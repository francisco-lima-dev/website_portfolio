import { Pool } from '@neondatabase/serverless';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// O tsx não carrega .env.local sozinho (só o Next faz isso). Usamos o
// carregador nativo do Node — sem precisar do pacote dotenv.
process.loadEnvFile('.env.local');

// Migrations rodam da máquina/CI, não em ambiente serverless: usamos a
// conexão DIRETA (unpooled). Validação explícita, mesmo padrão do lib/db.ts.
const connectionString = process.env.DATABASE_URL_UNPOOLED;
if (!connectionString) {
  throw new Error(
    'DATABASE_URL_UNPOOLED não está definida. Confira o .env.local (conexão direta do Neon).',
  );
}

const MIGRATIONS_DIR = join(process.cwd(), 'db', 'migrations');

async function migrate() {
  // Pool abre uma sessão real (via WebSocket), o que permite transações
  // interativas (BEGIN/COMMIT) — algo que o driver HTTP não faz.
  const pool = new Pool({ connectionString });

  try {
    // 1. Garante a tabela de controle. IF NOT EXISTS = idempotente.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        name        TEXT PRIMARY KEY,
        applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. Descobre o que já foi aplicado.
    const applied = await pool.query<{ name: string }>('SELECT name FROM _migrations');
    const appliedNames = new Set(applied.rows.map((row) => row.name));

    // 3. Lê os arquivos .sql e ordena pelo nome (001, 002, ...).
    const files = readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    // 4. Aplica só os pendentes, cada um na sua própria transação.
    const pending = files.filter((file) => !appliedNames.has(file));

    if (pending.length === 0) {
      console.log('Nada a aplicar — banco já está atualizado.');
      return;
    }

    for (const file of pending) {
      const sqlText = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');

      // Pegamos um client dedicado: a transação precisa rodar toda na
      // MESMA conexão, senão BEGIN/COMMIT não fazem sentido.
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(sqlText);
        await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`✓ aplicada: ${file}`);
      } catch (error) {
        // Qualquer falha desfaz TUDO: nem o schema nem o registro persistem.
        await client.query('ROLLBACK');
        throw new Error(`Falha ao aplicar ${file}: ${(error as Error).message}`);
      } finally {
        client.release();
      }
    }

    console.log(`\nConcluído: ${pending.length} migration(s) aplicada(s).`);
  } finally {
    // Fecha o pool pra o processo não ficar pendurado.
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
