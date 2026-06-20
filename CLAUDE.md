# Portfólio — Francisco

## Contexto
- Projeto de estudo, voltado para consolidar conceitos teóricos estudados recentemente (redes, banco de dados, segurança, sistemas).
- O foco é aprendizado: entender cada parte da arquitetura e as decisões por trás dela, não só obter o resultado.
- Abordagem "build-together": construir parte por parte, entendendo antes de avançar.

## Stack
- Next.js 16.2.9 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Banco: Neon Postgres (via integração Vercel Marketplace)
- Driver de banco: @neondatabase/serverless (SQL puro, SEM ORM — decisão consciente para aprender SQL de verdade)
- Deploy: Vercel (deploy automático a cada git push)
- Domínio: francisco.blog (já configurado e servindo via HTTPS)

## Identidade visual
- Dark mode, técnico, minimalista
- Fundo: #0a0a0a
- Cor de destaque: verde terminal (#22c55e)
- Tipografia monospace para detalhes

## Estrutura de páginas (planejada)
- `/` — Home
- `/projects` — Feed público de projetos (cards estilo rede social)
- `/projects/[slug]` — Página individual de um projeto
- `/thoughts` — Feed de posts de blog (cards)
- `/thoughts/[slug]` — Página individual de um thought
- `/about` — Sobre mim
- `/admin` — Painel protegido (só eu acesso) para postar

## Regras de trabalho
- Sempre explicar o porquê das decisões de arquitetura
- Não gerar código sem explicar o que cada parte faz
- Manter componentes pequenos e com responsabilidade única
- Perguntar antes de gerar: explicar a abordagem e aguardar confirmação
- Avançar uma etapa por vez, não gerar tudo de uma vez

## Regras técnicas (Next.js 16 — IMPORTANTE)
- Next.js 16 removeu acesso síncrono: params, searchParams, cookies, headers são SEMPRE assíncronos (usar await)
- Sem cache implícito: usar 'use cache' explicitamente quando quiser cachear dados
- Turbopack é o bundler padrão
- Consultar node_modules/next/dist/docs/ antes de assumir convenções antigas
- Projeto usa pasta src/ com alias @/* → ./src/*

## Modelo de dados (schema)

### Tabela: projects
- id, created_at, slug (UNIQUE), featured (bool), status (CHECK: 'in_progress' | 'completed')
- Card: title, description, cover_image, tags (TEXT[])
- Post completo: problem_solved, learnings, challenges, dev_process, ai_usage, next_steps, repo_url
- Obrigatórios: slug, title, description (resto opcional)

### Tabela: thoughts
- id, created_at, slug (UNIQUE), title, description (opcional), content, tags (TEXT[])
- Obrigatórios: slug, title, content (description é opcional)

### Decisões de modelagem tomadas
- projects e thoughts são tabelas separadas (entidades diferentes, não atributos um do outro)
- projects tem estrutura rica e fixa (Opção A: colunas separadas por seção); thoughts é texto livre
- description (card) e content/seções (página) são separados: card mostra resumo, página mostra tudo
- slug serve para URLs amigáveis (francisco.blog/projects/mini-shell-em-c em vez de /projects/7)
- tags como TEXT[] (array nativo do Postgres), não tabela separada — simplicidade
- status com CHECK constraint (banco recusa valores fora dos dois permitidos)

---

## ESTADO ATUAL — onde paramos

### ✅ FEITO — Fundação do backend (infraestrutura + dados)
1. Projeto Next.js criado (TypeScript, ESLint, Tailwind 4, App Router, src/)
2. Rodando localmente (npm run dev → localhost:3000)
3. Código no GitHub
4. Deploy na Vercel funcionando + domínio francisco.blog configurado (HTTPS)
5. Banco Neon Postgres criado (região SP, plano Free), conectado nuvem + local
6. CLI Vercel instalada, projeto linkado, .env.local com credenciais (protegido pelo .gitignore)
7. Driver @neondatabase/serverless instalado
8. Módulo de conexão: src/lib/db.ts (com validação explícita da env var, exporta `sql` — neon HTTP)
9. Sistema de migrations:
   - db/migrations/001_initial_schema.sql (tabelas projects + thoughts)
   - scripts/migrate.ts (runner com tabela de controle _migrations, transações BEGIN/COMMIT, idempotente)
   - Usa Pool/WebSocket + DATABASE_URL_UNPOOLED (conexão direta para DDL transacional)
   - Script "migrate" no package.json
   - [CONFIRMAR ao retomar: migration foi executada? Tabelas projects, thoughts e _migrations existem no banco?]

### ⬜ A FAZER — Parte "viva" do backend (construir junto com o frontend)
1. Funções de acesso aos dados (getAllProjects, createProject, etc. — queries SQL em lib/)
2. API routes (/api/projects, /api/thoughts — endpoints GET/POST/PUT/DELETE)
3. Autenticação de admin (login só do Francisco — provavelmente NextAuth)
4. Upload de imagem (decisão pendente: onde guardar cover_image — Vercel Blob? outra?)

### ⬜ A FAZER — Frontend (ainda não começado)
1. Layout base + identidade visual (a "casca": navbar, footer, tema dark)
2. Home (/)
3. Feed de projetos (/projects) + página individual (/projects/[slug])
4. Feed de thoughts (/thoughts) + página individual (/thoughts/[slug])
5. Sobre (/about)
6. Painel admin (/admin) — formulários para postar projetos e thoughts

### Decisões pendentes (para decidir quando chegar a hora)
- Card de thought sem description: mostrar só título, ou gerar preview das primeiras linhas do content?
- Como gerar o slug a partir do título (ex: "Mini Shell em C" → "mini-shell-em-c")
- Onde hospedar imagens de capa

---

## Conceitos já estudados nesta jornada (para referência)
- Cliente vs servidor; HTTP vs HTTPS (e por que localhost é HTTP)
- Requisição de página (HTML) vs chamada de API (JSON) — ambas via HTTP
- Server Components vs Client Components (buscar dados no servidor vs no cliente)
- API como camada de controle entre cliente e banco (autenticação vs autorização)
- Connection pooling: pooled vs unpooled (e quando usar cada uma)
- Migrations, idempotência, tabela de controle _migrations
- Transações (ACID, BEGIN/COMMIT/ROLLBACK, DDL transacional no Postgres)
- Prepared statements / template tags e prevenção de SQL injection
- devDependencies vs dependencies
- Validação explícita de env var (fail-fast) vs non-null assertion