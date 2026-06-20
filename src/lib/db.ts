import { neon } from '@neondatabase/serverless';

// Lemos a variável uma vez, no carregamento do módulo.
const databaseUrl = process.env.DATABASE_URL;

// Validação explícita: se a env var não existe, falhamos AQUI, com uma
// mensagem clara, em vez de deixar um `undefined` virar uma connection
// string inválida que só estouraria um erro obscuro na primeira query.
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL não está definida. Confira o .env.local (conexão pooled do Neon).',
  );
}

// `neon()` cria uma função de query que fala com o Neon via HTTP.
// Exportamos como `sql` para usar com template tags:
//   const rows = await sql`SELECT * FROM projects WHERE id = ${id}`;
// Os valores interpolados (${id}) são enviados como PARÂMETROS, não
// concatenados na string — isso previne SQL injection automaticamente.
export const sql = neon(databaseUrl);
