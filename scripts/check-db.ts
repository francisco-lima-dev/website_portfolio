// ============================================================================
// UTILITÁRIO DE VERIFICAÇÃO — NÃO faz parte do app em runtime.
// Inspeciona o schema atual do banco (read-only). Rode com: npm run check-db
// Útil para reconferir as tabelas/colunas depois de aplicar novas migrations.
// ============================================================================
//
// Usa o MESMO cliente que o app usará em runtime: src/lib/db.ts
// (neon HTTP, conexão pooled DATABASE_URL).
//
// Por que import DINÂMICO logo abaixo? O lib/db.ts valida a DATABASE_URL
// no topo do módulo, no momento em que é importado. Se usássemos um import
// estático normal, ele rodaria ANTES do loadEnvFile (imports são içados
// para o topo) e a validação falharia. Então: carregamos o env primeiro,
// e só depois importamos o módulo, dentro da função.
process.loadEnvFile('.env.local');

async function check() {
  const { sql } = await import('../src/lib/db');

  // information_schema é um catálogo padrão do Postgres que descreve o
  // próprio banco. Aqui perguntamos as colunas das nossas duas tabelas.
  const columns = await sql`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name IN ('projects', 'thoughts')
    ORDER BY table_name, ordinal_position;
  `;

  console.table(columns);
  console.log(`\nTotal de colunas: ${columns.length}`);
}

check().catch((error) => {
  console.error(error);
  process.exit(1);
});
