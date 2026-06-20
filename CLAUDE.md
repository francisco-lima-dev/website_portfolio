# Portfólio — Francisco

## Contexto

- Projeto de estudo, voltado para eu consolidar alguns conceitos teóricos que estudei recentemente. 
- Como o foco é aprendizado, quero entender cada parte da arquitetura e tomada de decisões.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vercel Postgres
- NextAuth (autenticação de admin)

## Identidade visual
- Dark mode, técnico, minimalista
- Fundo: #0a0a0a
- Cor de destaque: verde terminal (#22c55e)
- Tipografia monospace para detalhes

## Estrutura de páginas
- `/` — Home
- `/projects` — Feed público de projetos
- `/about` — Sobre mim
- `/admin` — Painel protegido (só eu acesso)
- `/thoughts` — Uma página de blog, onde eu farei posts sobre coisas que quero falar

## Regras
- Sempre explicar o porquê das decisões de arquitetura
- Não gerar código sem explicar o que cada parte faz
- Manter componentes pequenos e com responsabilidade única
- Perguntar antes de gerar: explicar a abordagem e aguardar confirmação

## Versão e regras técnicas
- Next.js 16.2.9, React 19, Tailwind CSS 4
- Next.js 16 removeu acesso síncrono: params, searchParams, cookies, headers são SEMPRE assíncronos (usar await)
- Sem cache implícito: usar 'use cache' explicitamente quando quiser cachear dados
- Turbopack é o bundler padrão
- Consultar node_modules/next/dist/docs/ antes de assumir convenções antigas
