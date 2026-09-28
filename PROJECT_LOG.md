# Registro de Continuidade e Arquitetura — Alvora v3

## Stack Atual

- **Scaffold**: Vite 8 + React 19 + TypeScript 6
- **Estilização**: Tailwind CSS v4 (CSS-first via `@theme` no `src/index.css`)
- **Tipografia**: Plus Jakarta Sans (Google Fonts)
- **Backend**: Supabase (Auth, Postgres com RLS, Edge Functions)
- **Estado Global**: Zustand (sessão persistida e validada contra o token do Supabase)
- **Estado Assíncrono**: TanStack Query v5
- **UI**: Radix UI (Dialog, Tabs, Dropdown) + Lucide React
- **Testes**: Vitest + jsdom
- **Deploy**: Vercel (SPA rewrite em `vercel.json`)

## Identidade Visual

- Cor primária `#5170ff` (hover `#3b59ff`, deep `#2a3fd6`)
- Fundo com gradientes radiais suaves sobre `#f4f6ff`
- Gradiente de marca `.bg-brand` (135°, azul → violeta)
- Selos de risco com indicador triplo (cor + ícone + rótulo, contraste AA)
- Respeita `prefers-reduced-motion`

## Segurança

- RLS auditada em todas as tabelas
- Matrícula obtida via RPC `minha_matricula` (sempre do usuário logado)
- Criação de usuários exclusiva via Edge Function `criar-usuario`
- Storage não utilizado. Se for usado: buckets privados + signed URLs

## Decisões Tomadas

- 2026-09-20: Scaffolding Vite + React TS
- 2026-09-20: RBAC em 3 perfis (Aluno, Professor, Gestor)
- 2026-09-20: Central de Dúvidas transversal
- 2026-09-28: Migração de mocks para Supabase Auth + perfis reais
- 2026-09-28: Auditoria de segurança (RLS, auth store, storage) concluída
- 2026-09-28: Faxina (App.css removido, fontes duplicadas, tsbuildinfo no gitignore)

## Concluído

- [x] Tokens de design com `@theme`
- [x] Login com Supabase e validação de sessão
- [x] Portal do Aluno: Início, Disciplinas, Frequência, Boletim, Secretaria
- [x] Portal do Professor: Início, Chamada por PIN, Notas
- [x] Portal do Gestor: Indicadores, Usuários
- [x] Radar de risco de evasão sincronizado
- [x] Assistente IA, Calendário (modal), Central de Dúvidas

## Próximos Passos

- [ ] Perfil (3 papéis)
- [ ] Gestor → Alunos & Turmas (incluindo filtro `?status=risco`)
- [ ] Professor → Minhas Turmas
- [ ] Professor → Alertas de Faltas
- [ ] Gestor → Regras (migrar `config/regras.ts` para uma tabela)
- [ ] Gestor → Professores e Auditoria
- [ ] Rota de Calendário
