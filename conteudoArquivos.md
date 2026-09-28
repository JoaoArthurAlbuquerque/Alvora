================================================
FILE: README.md
================================================
// README.md

# Alvora — Gestão Escolar & AVA Inteligente

Alvora é uma plataforma completa de Gestão Escolar e Ambiente Virtual de Aprendizagem Assíncrono com foco em retenção, auditoria de presença por engajamento e combate à evasão escolar.

## 🚀 Como Rodar o Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Executar o servidor de desenvolvimento
npm run dev

# 3. Validar a compilação de produção
npm run build
```

================================================
FILE: eslint.config.js
================================================
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
js.configs.recommended,
tseslint.configs.recommended,
reactHooks.configs.flat.recommended,
reactRefresh.configs.vite,
],
languageOptions: {
globals: globals.browser,
},
},
])

================================================
FILE: index.html
================================================

<!-- index.html -->
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Alvora</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</head>

<body class="bg-primary-soft text-[#1E293B] antialiased font-sans">
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>

</html>

================================================
FILE: package.json
================================================
{
"name": "alvora",
"private": true,
"version": "0.0.0",
"type": "module",
"scripts": {
"dev": "vite",
"test": "vitest",
"build": "tsc -b && vite build",
"lint": "eslint .",
"preview": "vite preview"
},
"dependencies": {
"@fontsource/fraunces": "^5.3.0",
"@fontsource/inter": "^5.3.0",
"@fontsource/plus-jakarta-sans": "^5.3.0",
"@fontsource/work-sans": "^5.3.0",
"@radix-ui/react-dialog": "^1.1.23",
"@radix-ui/react-dropdown-menu": "^2.1.24",
"@radix-ui/react-tabs": "^1.1.21",
"@supabase/supabase-js": "^2.117.2",
"@tanstack/react-query": "^5.103.1",
"clsx": "^2.1.1",
"lucide-react": "^1.47.0",
"react": "^19.2.8",
"react-dom": "^19.2.8",
"react-router-dom": "^7.18.4",
"tailwind-merge": "^3.7.0",
"zustand": "^5.0.15"
},
"devDependencies": {
"@eslint/js": "^10.0.1",
"@tailwindcss/vite": "^4.3.3",
"@types/node": "^24.13.6",
"@types/react": "^19.2.18",
"@types/react-dom": "^19.2.7",
"@vitejs/plugin-react": "^6.1.1",
"eslint": "^10.10.0",
"eslint-plugin-react-hooks": "^7.1.1",
"eslint-plugin-react-refresh": "^0.5.6",
"globals": "^17.12.0",
"jsdom": "^30.1.1",
"tailwindcss": "^4.3.3",
"typescript": "~6.0.2",
"typescript-eslint": "^8.69.0",
"vite": "^8.3.0",
"vitest": "^5.0.2"
}
}

================================================
FILE: PROJECT_LOG.md
================================================
// PROJECT_LOG.md

# Registro de Continuidade e Arquitetura — Alvora v3

## Stack Decidida

- **Scaffold**: Vite 6+ (React + TypeScript SWC)
- **Estilização**: Tailwind CSS v4 (CSS-first via `@theme` no `src/index.css`)
- **Tipografia**: `Fraunces` (serifada display) + `Work Sans` (corpo de alta legibilidade) via `@fontsource`
- **Estado Global**: Zustand (Persistência no `localStorage` para sessão RBAC)
- **Estado Assíncrono**: TanStack Query v5 para fixtures/mocks com latência simulada
- **Primitivas UI Acessíveis**: Radix UI (Dialog, Tabs, Dropdown Menu) + Lucide React (ícones)

## Diretrizes de Identidade Visual (Amanhecer)

- Fundo global neutro quente `#FAF7F2` (nunca branco puro corporativo)
- Cabeçalho horizonte com micro-gradiente sutil azul-profundo (`#0B3D66`)
- Badges de auditoria e cálculo por IA com linguagem direta ("Calculado por IA · Auditado")
- Selos de risco com indicador visual triplo (cor + ícone + rótulo textual em contraste AA)

## Decisões Tomadas

- 2026-09-20: Criação do scaffolding oficial Vite + React TS.
- 2026-09-20: Implementação do RBAC em 3 perfis (Aluno, Professor, Gestor) com login funcional de 3 rotas (Magic Link, Matrícula+Senha, Código Único).
- 2026-09-20: Central de Dúvidas Transversal multiperfil integrada a todos os portais.
- 2026-09-20: Autosave reativo no lançamento de notas do Professor mantido via `localStorage`.

## O que já foi concluído

- [x] Tokens de design da marca Alvora em CSS puro com `@theme`
- [x] Login com 3 personas mockadas e persistência real
- [x] Portal do Aluno com Notas, Frequência Assíncrona e Assistente Pedagógico
- [x] Portal do Professor com autosave de notas, auditoria de presença por IA e alertas de evasão
- [x] Portal do Gestor com Dashboard Executivo, Ranking de Risco e Auditoria
- [x] Central de Dúvidas Frequentes da Plataforma (Transversal)

================================================
FILE: tsconfig.app.json
================================================
// tsconfig.app.json
{
"compilerOptions": {
"target": "ES2022",
"useDefineForClassFields": true,
"lib": ["ES2022", "DOM", "DOM.Iterable"],
"module": "ESNext",
"skipLibCheck": true,
"moduleResolution": "bundler",
"allowImportingTsExtensions": true,
"isolatedModules": true,
"moduleDetection": "force",
"noEmit": true,
"jsx": "react-jsx",
"strict": true,
"noUnusedLocals": true,
"noUnusedParameters": true,
"noFallthroughCasesInSwitch": true,
"ignoreDeprecations": "6.0",
"baseUrl": ".",
"paths": {
"@/_": ["src/_"]
}
},
"include": ["src"]
}

================================================
FILE: tsconfig.app.tsbuildinfo
================================================
{"root":["./src/app.tsx","./src/main.tsx","./src/vite-env.d.ts","./src/app/applayout.tsx","./src/app/protectedroute.tsx","./src/app/navegacao.ts","./src/app/routes.tsx","./src/core/auth/useauthstore.ts","./src/core/lib/utils.ts","./src/core/ui/badge.tsx","./src/core/ui/button.tsx","./src/core/ui/card.tsx","./src/core/ui/emconstrucao.tsx","./src/core/ui/modal.tsx","./src/core/ui/skeleton.tsx","./src/mocks/data.ts","./src/modules/aluno/portalaluno.tsx","./src/modules/assistente-pedagogico/assistentepedagogicomodal.tsx","./src/modules/autenticacao/loginpage.tsx","./src/modules/calendario/calendariomodal.tsx","./src/modules/central-duvidas/centralduvidasdrawer.tsx","./src/modules/gestor/portalgestor.tsx","./src/modules/professor/lancamentofrequencia.tsx","./src/modules/professor/portalprofessor.tsx","./src/services/presencaservice.ts","./src/services/regrasservice.ts","./src/services/storage.ts","./src/types/index.ts"],"version":"6.0.3"}

================================================
FILE: tsconfig.json
================================================
// tsconfig.json
{
"files": [],
"references": [{ "path": "./tsconfig.app.json" }]
}

================================================
FILE: tsconfig.node.json
================================================
{
"compilerOptions": {
"tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
"target": "es2023",
"lib": ["ES2023"],
"types": ["node"],
"skipLibCheck": true,

    /* Bundler mode */
    "module": "nodenext",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true

},
"include": ["vite.config.ts"]
}

================================================
FILE: vite.config.ts
================================================
/// <reference types="vitest/config" />
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
plugins: [react(), tailwindcss()],
resolve: {
alias: {
"@": path.resolve(import.meta.dirname, "./src"),
},
},
test: {
environment: "jsdom", // o diarioStore usa localStorage e window
},
});

================================================
FILE: src/App.css
================================================
.counter {
font-size: 16px;
padding: 5px 10px;
border-radius: 5px;
color: var(--accent);
background: var(--accent-bg);
border: 2px solid transparent;
transition: border-color 0.3s;
margin-bottom: 24px;

&:hover {
border-color: var(--accent-border);
}
&:focus-visible {
outline: 2px solid var(--accent);
outline-offset: 2px;
}
}

.hero {
position: relative;

.base,
.framework,
.vite {
inset-inline: 0;
margin: 0 auto;
}

.base {
width: 170px;
position: relative;
z-index: 0;
}

.framework,
.vite {
position: absolute;
}

.framework {
z-index: 1;
top: 34px;
height: 28px;
transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
scale(1.4);
}

.vite {
z-index: 0;
top: 107px;
height: 26px;
width: auto;
transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
scale(0.8);
}
}

#center {
display: flex;
flex-direction: column;
gap: 25px;
place-content: center;
place-items: center;
flex-grow: 1;

@media (max-width: 1024px) {
padding: 32px 20px 24px;
gap: 18px;
}
}

#next-steps {
display: flex;
border-top: 1px solid var(--border);
text-align: left;

& > div {
flex: 1 1 0;
padding: 32px;
@media (max-width: 1024px) {
padding: 24px 20px;
}
}

.icon {
margin-bottom: 16px;
width: 22px;
height: 22px;
}

@media (max-width: 1024px) {
flex-direction: column;
text-align: center;
}
}

#docs {
border-right: 1px solid var(--border);

@media (max-width: 1024px) {
border-right: none;
border-bottom: 1px solid var(--border);
}
}

#next-steps ul {
list-style: none;
padding: 0;
display: flex;
gap: 8px;
margin: 32px 0 0;

.logo {
height: 18px;
}

a {
color: var(--text-h);
font-size: 16px;
border-radius: 6px;
background: var(--social-bg);
display: flex;
padding: 6px 12px;
align-items: center;
gap: 8px;
text-decoration: none;
transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }

}

@media (max-width: 1024px) {
margin-top: 20px;
flex-wrap: wrap;
justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }

}
}

#spacer {
height: 88px;
border-top: 1px solid var(--border);
@media (max-width: 1024px) {
height: 48px;
}
}

.ticks {
position: relative;
width: 100%;

&::before,
&::after {
content: '';
position: absolute;
top: -4.5px;
border: 5px solid transparent;
}

&::before {
left: 0;
border-left-color: var(--border);
}
&::after {
right: 0;
border-right-color: var(--border);
}
}

================================================
FILE: src/App.tsx
================================================
import { AppRoutes } from "./app/routes";

export default function App() {
return <AppRoutes />;
}

================================================
FILE: src/index.css
================================================
@import "tailwindcss";

@theme static {
--font-sans:
"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, sans-serif;

--color-primary: #5170ff;
--color-primary-hover: #3b59ff;
--color-primary-deep: #2a3fd6;
--color-primary-soft: #eef2ff;
--color-ink: #0f172a;

--shadow-flat: 0 8px 30px -12px rgba(81, 112, 255, 0.18);
--shadow-flat-2: 0 12px 40px -12px rgba(81, 112, 255, 0.28);
--shadow-flat-sm: 0 4px 14px -6px rgba(81, 112, 255, 0.25);
--shadow-glow: 0 10px 25px -8px rgba(81, 112, 255, 0.55);

--animate-fade-up: fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
--animate-fade-in: fade-in 0.3s ease-out both;
--animate-scale-in: scale-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
--animate-slide-in: slide-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
--animate-float: float 6s ease-in-out infinite;
--animate-grow: grow 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
--animate-shake: shake 0.4s ease-in-out;
--animate-pop: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;

@keyframes shake {
0%,
100% {
transform: translateX(0);
}
20%,
60% {
transform: translateX(-8px);
}
40%,
80% {
transform: translateX(8px);
}
}
@keyframes pop {
0% {
opacity: 0;
transform: scale(0.4);
}
100% {
opacity: 1;
transform: scale(1);
}
}

@keyframes fade-up {
from {
opacity: 0;
transform: translateY(14px);
}
to {
opacity: 1;
transform: translateY(0);
}
}
@keyframes fade-in {
from {
opacity: 0;
}
to {
opacity: 1;
}
}
@keyframes scale-in {
from {
opacity: 0;
transform: scale(0.94) translateY(8px);
}
to {
opacity: 1;
transform: scale(1) translateY(0);
}
}
@keyframes slide-in {
from {
opacity: 0;
transform: translateX(-24px);
}
to {
opacity: 1;
transform: translateX(0);
}
}
@keyframes float {
0%,
100% {
transform: translateY(0) rotate(0deg);
}
50% {
transform: translateY(-10px) rotate(3deg);
}
}
@keyframes grow {
from {
width: 0;
}
}
}

@layer base {
body {
font-family: var(--font-sans);
color: var(--color-ink);
background:
radial-gradient(1200px 600px at 100% -10%, #dfe6ff 0%, transparent 60%),
radial-gradient(900px 500px at -10% 110%, #e8e4ff 0%, transparent 60%),
#f4f6ff;
background-attachment: fixed;
-webkit-font-smoothing: antialiased;
}
h1,
h2,
h3 {
letter-spacing: -0.02em;
}
.tabular {
font-variant-numeric: tabular-nums;
}
}

@layer utilities {
/_ Filhos entram em cascata _/
.stagger > _ {
animation: var(--animate-fade-up);
}
.stagger > _:nth-child(1) {
animation-delay: 0.02s;
}
.stagger > _:nth-child(2) {
animation-delay: 0.08s;
}
.stagger > _:nth-child(3) {
animation-delay: 0.14s;
}
.stagger > _:nth-child(4) {
animation-delay: 0.2s;
}
.stagger > _:nth-child(5) {
animation-delay: 0.26s;
}
.stagger > _:nth-child(6) {
animation-delay: 0.32s;
}
.stagger > _:nth-child(n + 7) {
animation-delay: 0.38s;
}

.bg-brand {
background-image: linear-gradient(
135deg,
#5170ff 0%,
#3b59ff 55%,
#6d5bff 100%
);
}
}

@media (prefers-reduced-motion: reduce) {
_,
_::before,
\*::after {
animation: none !important;
transition: none !important;
}
}

================================================
FILE: src/main.tsx
================================================
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
<React.StrictMode>
<App />
</React.StrictMode>,
);

================================================
FILE: src/vite-env.d.ts
================================================
declare module "@fontsource/inter/_.css";
declare module "_.css";

================================================
FILE: src/app/Applayout.tsx
================================================
import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
Menu,
X,
LogOut,
Sparkles,
CircleHelp,
CalendarDays,
Search,
ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../core/auth/useAuthStore";
import { cn } from "../core/lib/utils";
import { navPorPapel, acoesExtras, rotuloPapel } from "./navegacao";
import { AssistentePedagogicoModal } from "../modules/assistente-pedagogico/AssistentePedagogicoModal";
import { CentralDuvidasDrawer } from "../modules/central-duvidas/CentralDuvidasDrawer";
import { CalendarioModal } from "../modules/calendario/CalendarioModal";

const itemBase =
"group relative w-full flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-medium transition-all duration-200";
const itemInativo =
"text-slate-500 hover:text-primary hover:bg-primary/5 hover:translate-x-1";

export const AppLayout: React.FC = () => {
const { usuario, logout } = useAuthStore();
const navigate = useNavigate();
const { pathname } = useLocation();
const [menuAberto, setMenuAberto] = useState(false);
const [isAiOpen, setIsAiOpen] = useState(false);
const [isDuvidasOpen, setIsDuvidasOpen] = useState(false);
const [isCalendarOpen, setIsCalendarOpen] = useState(false);

if (!usuario) return null;
const papel = usuario.papel;
const nav = navPorPapel[papel];
const paginaAtual =
[...nav]
.sort((a, b) => b.path.length - a.path.length)
.find((i) => pathname.startsWith(i.path))?.label ??
(pathname.endsWith("/perfil") ? "Meu Perfil" : "");

const fechar = () => setMenuAberto(false);
const abrir = (setter: (v: boolean) => void) => () => {
fechar();
setter(true);
};
const sair = () => {
logout();
navigate("/login", { replace: true });
};
const inicial = usuario.nome
.replace(/^(Prof\.|Profa\.|Dra?\.)\s\*/, "")
.charAt(0);

const ferramentas = [
{ label: "Assistente IA", icone: Sparkles, onClick: abrir(setIsAiOpen) },
{
label: "Calendário",
icone: CalendarDays,
onClick: abrir(setIsCalendarOpen),
},
{
label: "Central de Dúvidas",
icone: CircleHelp,
onClick: abrir(setIsDuvidasOpen),
},
];

const sidebar = (
<>
<div className="flex items-center justify-between h-16 px-3">
<img src="/alvora_blue.svg" alt="Alvora" className="h-8 w-auto" />
<button
          onClick={fechar}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-100"
          aria-label="Fechar menu"
        >
<X size={18} />
</button>
</div>

      <nav className="mt-4 space-y-1 stagger">
        {nav.map(({ label, path, icone: Icone }) => (
          <NavLink
            key={path}
            to={path}
            end={path === `/${papel}`}
            onClick={fechar}
            className={({ isActive }) =>
              cn(
                itemBase,
                isActive ? "bg-brand text-white shadow-glow" : itemInativo,
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icone size={18} strokeWidth={isActive ? 2.4 : 2} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={15} className="opacity-80" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8">
        <p className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
          Ferramentas
        </p>
        <div className="space-y-1">
          {acoesExtras[papel].map(({ label, path, icone: Icone }) => (
            <button
              key={label}
              onClick={() => {
                fechar();
                navigate(path);
              }}
              className={cn(itemBase, itemInativo)}
            >
              <Icone size={18} /> {label}
            </button>
          ))}
          {ferramentas.map(({ label, icone: Icone, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className={cn(itemBase, itemInativo)}
            >
              <Icone size={18} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Card promocional da IA */}
      <button
        onClick={abrir(setIsAiOpen)}
        className="group mt-auto mb-3 relative overflow-hidden rounded-2xl bg-brand p-4 text-left text-white shadow-glow hover:-translate-y-0.5 transition-transform"
      >
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />
        <Sparkles size={20} className="relative animate-float" />
        <p className="relative mt-2 text-sm font-bold">Precisa de ajuda?</p>
        <p className="relative text-xs text-white/80">
          Pergunte ao Assistente IA ✨
        </p>
      </button>

      <div className="pt-3 border-t border-slate-100 flex items-center gap-1">
        <NavLink
          to={`/${papel}/perfil`}
          onClick={fechar}
          className="flex-1 flex items-center gap-2.5 p-2 rounded-xl hover:bg-primary/5 min-w-0"
        >
          <div className="w-9 h-9 rounded-full bg-brand text-white text-sm font-bold flex items-center justify-center shrink-0 ring-4 ring-primary/10">
            {inicial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate">
              {usuario.nome}
            </p>
            <p className="text-xs text-slate-400">{rotuloPapel[papel]}</p>
          </div>
        </NavLink>
        <button
          onClick={sair}
          title="Sair"
          aria-label="Sair"
          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
        >
          <LogOut size={17} />
        </button>
      </div>
    </>

);

return (
<div className="min-h-screen flex">
<aside className="hidden md:flex w-64 h-[calc(100vh-2rem)] sticky top-4 m-4 mr-0 bg-white/90 backdrop-blur rounded-3xl shadow-flat-2 flex-col px-3 pb-3 shrink-0 overflow-y-auto animate-slide-in">
{sidebar}
</aside>

      {menuAberto && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm animate-fade-in"
            onClick={fechar}
          />
          <aside className="absolute left-3 top-3 bottom-3 w-72 max-w-[85vw] bg-white rounded-3xl shadow-2xl flex flex-col px-3 pb-3 overflow-y-auto animate-slide-in">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 px-4 sm:px-6 lg:px-10 pt-4">
          <div className="h-16 flex items-center gap-3 px-4 md:px-2 rounded-2xl bg-white/70 md:bg-transparent backdrop-blur md:backdrop-blur-none shadow-flat md:shadow-none">
            <button
              onClick={() => setMenuAberto(true)}
              className="md:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <h2
              key={paginaAtual}
              className="text-lg md:text-2xl font-extrabold text-ink truncate animate-fade-in"
            >
              {paginaAtual}
            </h2>
            <div className="ml-auto hidden lg:flex items-center gap-2 h-10 w-72 px-4 rounded-full bg-white border border-primary/10 shadow-flat-sm focus-within:ring-4 focus-within:ring-primary/15 transition">
              <Search size={16} className="text-slate-400" />
              <input
                placeholder="Buscar..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <NavLink
              to={`/${papel}/perfil`}
              className="hidden md:flex items-center gap-2 h-10 pl-1 pr-4 rounded-full bg-brand text-white text-sm font-semibold shadow-glow hover:-translate-y-0.5 transition-transform"
            >
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                {inicial}
              </span>
              {usuario.nome.split(" ")[0]}
            </NavLink>
          </div>
        </header>

        <main
          key={pathname}
          className="flex-1 px-4 sm:px-6 lg:px-10 py-6 overflow-x-hidden animate-fade-up"
        >
          <Outlet />
        </main>
      </div>

      {/* Botão flutuante de dúvidas */}
      <button
        onClick={abrir(setIsDuvidasOpen)}
        aria-label="Central de Dúvidas"
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-brand text-white shadow-glow flex items-center justify-center hover:scale-110 hover:rotate-12 transition-transform duration-300"
      >
        <CircleHelp size={24} />
      </button>

      <AssistentePedagogicoModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />
      <CentralDuvidasDrawer
        isOpen={isDuvidasOpen}
        onClose={() => setIsDuvidasOpen(false)}
      />
      <CalendarioModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
    </div>

);
};

================================================
FILE: src/app/navegacao.ts
================================================
import type { LucideIcon } from "lucide-react";
import {
House,
BookOpen,
CalendarCheck,
GraduationCap,
FileText,
Users,
BellRing,
ChartColumn,
Settings,
Radio,
ScrollText,
} from "lucide-react";
import type { PapelUsuario } from "../types";

export interface ItemNav {
label: string;
path: string;
icone: LucideIcon;
}

export const navPorPapel: Record<PapelUsuario, ItemNav[]> = {
aluno: [
{ label: "Início", path: "/aluno", icone: House },
{ label: "Disciplinas", path: "/aluno/disciplinas", icone: BookOpen },
{ label: "Frequência", path: "/aluno/frequencia", icone: CalendarCheck },
{ label: "Boletim", path: "/aluno/boletim", icone: GraduationCap },
{ label: "Secretaria", path: "/aluno/secretaria", icone: FileText },
],
professor: [
{ label: "Início", path: "/professor", icone: House },
{ label: "Minhas Turmas", path: "/professor/turmas", icone: Users },
{ label: "Chamada", path: "/professor/frequencia", icone: Radio },
{ label: "Notas", path: "/professor/notas", icone: GraduationCap },
{ label: "Alertas de Faltas", path: "/professor/alertas", icone: BellRing },
],
gestor: [
{ label: "Indicadores", path: "/gestor", icone: ChartColumn },
{ label: "Alunos & Turmas", path: "/gestor/turmas", icone: Users },
{ label: "Professores", path: "/gestor/professores", icone: GraduationCap },
{ label: "Regras", path: "/gestor/regras", icone: Settings },
{ label: "Auditoria", path: "/gestor/auditoria", icone: ScrollText },
],
};

/\*_ Atalhos extras por perfil (além de IA, Dúvidas e Calendário) _/
export const acoesExtras: Record<PapelUsuario, ItemNav[]> = {
aluno: [],
professor: [],
gestor: [
{
label: "Alunos em Risco",
path: "/gestor/turmas?status=risco",
icone: BellRing,
},
],
};

export const rotuloPapel: Record<PapelUsuario, string> = {
aluno: "Aluno",
professor: "Professor",
gestor: "Gestor",
};

================================================
FILE: src/app/ProtectedRoute.tsx
================================================
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../core/auth/useAuthStore";
import type { PapelUsuario } from "../types";

interface Props {
papeis?: PapelUsuario[];
}

export const ProtectedRoute: React.FC<Props> = ({ papeis }) => {
const usuario = useAuthStore((s) => s.usuario);

if (!usuario) return <Navigate to="/login" replace />;
// Perfil sem permissão volta para o próprio portal
if (papeis && !papeis.includes(usuario.papel))
return <Navigate to={`/${usuario.papel}`} replace />;

return <Outlet />;
};

================================================
FILE: src/app/routes.tsx
================================================
import {
createBrowserRouter,
RouterProvider,
Navigate,
} from "react-router-dom";
import { AppLayout } from "./Applayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../modules/autenticacao/LoginPage";
import { AlunoShell } from "../modules/aluno/AlunoShell";
import { PortalAluno } from "../modules/aluno/PortalAluno";
import { DisciplinasAluno } from "../modules/aluno/DisciplinasAluno";
import { FrequenciaAluno } from "../modules/aluno/FrequenciaAluno";
import { BoletimAluno } from "../modules/aluno/BoletimAluno";
import { SecretariaAluno } from "../modules/aluno/SecretariaAluno";
import { PortalProfessor } from "../modules/professor/PortalProfessor";
import { LancamentoFrequencia } from "../modules/professor/LancamentoFrequencia";
import { PortalGestor } from "../modules/gestor/PortalGestor";
import { AdminUsuarios } from "../modules/gestor/AdminUsuarios";
import CriarUsuario from "../modules/gestor/CriarUsuario"; // 👈 novo
import { EmConstrucao } from "../core/ui/EmConstrucao";
import { useAuthStore } from "../core/auth/useAuthStore";

function RedirecionarPorPapel() {
const usuario = useAuthStore((s) => s.usuario);
return <Navigate to={usuario ? `/${usuario.papel}` : "/login"} replace />;
}

const placeholder = (paths: string[]) =>
paths.map((path) => ({ path, element: <EmConstrucao /> }));

const router = createBrowserRouter([
{ path: "/login", element: <LoginPage /> },
{
element: <ProtectedRoute />,
children: [
{
element: <AppLayout />,
children: [
{ index: true, element: <RedirecionarPorPapel /> },
{
path: "aluno",
element: <ProtectedRoute papeis={["aluno"]} />,
children: [
{
element: <AlunoShell />,
children: [
{ index: true, element: <PortalAluno /> },
{ path: "disciplinas", element: <DisciplinasAluno /> },
{ path: "frequencia", element: <FrequenciaAluno /> },
{ path: "boletim", element: <BoletimAluno /> },
{ path: "secretaria", element: <SecretariaAluno /> },
...placeholder(["calendario", "perfil"]),
],
},
],
},
{
path: "professor",
element: <ProtectedRoute papeis={["professor"]} />,
children: [
{ index: true, element: <PortalProfessor /> },
{ path: "frequencia", element: <LancamentoFrequencia /> },
...placeholder([
"turmas",
"notas",
"alertas",
"calendario",
"perfil",
]),
],
},
{
path: "gestor",
element: <ProtectedRoute papeis={["gestor"]} />,
children: [
{ index: true, element: <PortalGestor /> },
{ path: "usuarios", element: <AdminUsuarios /> },
{ path: "criar-usuario", element: <CriarUsuario /> }, // 👈 novo
...placeholder([
"turmas",
"professores",
"regras",
"calendario",
"auditoria",
"perfil",
]),
],
},
],
},
],
},
{ path: "\*", element: <RedirecionarPorPapel /> },
]);

export function AppRoutes() {
return <RouterProvider router={router} />;
}

================================================
FILE: src/components/ChamadaPINProfessor.tsx
================================================
import { useEffect, useState } from "react";
import { chamadaStore, useChamada } from "../services/chamadaStore";

const DURACAO_MS = 5 _ 60 _ 1000;

interface Props {
turma: { id: string; alunosIds: string[] };
disciplinaNome: string;
professorId?: string;
}

export function ChamadaPINProfessor({ turma, disciplinaNome }: Props) {
const { pin, expiraEm, presentesIds } = useChamada();
const [agora, setAgora] = useState(() => Date.now());

useEffect(() => {
if (!expiraEm) return;
const t = setInterval(() => {
const now = Date.now();
setAgora(now);
if (now >= expiraEm) clearInterval(t);
}, 1000);
return () => clearInterval(t);
}, [expiraEm]);

const restante = expiraEm
? Math.max(0, Math.ceil((expiraEm - agora) / 1000))
: 0;
const ativa = restante > 0;
const total = turma.alunosIds.length;
const presentes = presentesIds.filter((id) =>
turma.alunosIds.includes(id),
).length;

const mm = String(Math.floor(restante / 60)).padStart(2, "0");
const ss = String(restante % 60).padStart(2, "0");

const iniciar = () => {
setAgora(Date.now());
chamadaStore.iniciar(DURACAO_MS);
};

const encerrar = () => {
chamadaStore.encerrar();
setAgora(Date.now());
};

if (!ativa) {
return (
<div className="rounded-xl border p-6 text-center">
{expiraEm && (
<p className="mb-3 text-sm text-gray-600">
Última chamada: {presentes}/{total} presentes
</p>
)}
<button
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
          onClick={iniciar}
        >
Iniciar chamada por PIN
</button>
</div>
);
}

return (
<div className="rounded-xl border p-6 text-center">
<p className="text-sm text-gray-500">PIN · {disciplinaNome}</p>
<p className="my-2 font-mono text-6xl tracking-[0.3em]">{pin}</p>
<p className={restante <= 15 ? "text-red-600" : "text-gray-600"}>
⏱ {mm}:{ss}
</p>
<p className="mt-3 font-medium">
{presentes}/{total} confirmaram
</p>
<div className="mx-auto mt-2 h-2 w-48 overflow-hidden rounded bg-gray-200">
<div
className="h-full bg-green-500 transition-all"
style={{ width: `${total ? (presentes / total) * 100 : 0}%` }}
/>
</div>
<button className="mt-4 rounded-lg border px-4 py-2" onClick={encerrar}>
Encerrar chamada
</button>
</div>
);
}

================================================
FILE: src/components/InputPINAluno.tsx
================================================
import { useState } from "react";
import {
chamadaStore,
type ResultadoConfirmacao,
} from "../services/chamadaStore";

type Resultado = ResultadoConfirmacao | "nao_matriculado";

const MSG: Record<Resultado, string> = {
ok: "Presença confirmada! 🎉",
invalido: "PIN incorreto. Confira e tente de novo.",
expirado: "Nenhuma chamada ativa ou o PIN expirou.",
duplicado: "Sua presença já foi registrada. ✅",
nao_matriculado: "Você não está matriculado nesta turma.",
};

interface Props {
alunoId: string;
turma: { alunosIds: string[] };
}

export function InputPINAluno({ alunoId, turma }: Props) {
const [pin, setPin] = useState("");
const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);

const enviar = () => {
if (pin.length !== 4) return;
const r: Resultado = turma.alunosIds.includes(alunoId)
? chamadaStore.confirmar(pin, alunoId)
: "nao_matriculado";
const ok = r === "ok" || r === "duplicado";
setMsg({ ok, texto: MSG[r] });
if (ok) setPin("");
};

return (
<div className="rounded-xl border p-6">
<label className="text-sm font-medium">Digite o PIN da aula</label>
<div className="mt-2 flex gap-2">
<input
inputMode="numeric"
maxLength={4}
value={pin}
onChange={(e) =>
setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
}
onKeyDown={(e) => e.key === "Enter" && enviar()}
className="w-32 rounded-lg border px-3 py-2 text-center font-mono text-2xl tracking-widest"
/>
<button
onClick={enviar}
disabled={pin.length !== 4}
className="rounded-lg bg-indigo-600 px-4 text-white disabled:opacity-40" >
Confirmar
</button>
</div>
{msg && (
<p
className={`mt-3 text-sm ${msg.ok ? "text-green-600" : "text-red-600"}`} >
{msg.texto}
</p>
)}
</div>
);
}

================================================
FILE: src/components/SincronizadorRadar.tsx
================================================
import { useFrequenciaTurma, TURMA_ID } from "../services/frequenciaTurma";
import { useRadarRisco } from "../services/radarRisco";
import { useMediasTurma } from "../services/notas";

/\*_ Mantém os alertas sincronizados em qualquer tela. Não renderiza nada. _/
export function SincronizadorRadar() {
const { alunos } = useFrequenciaTurma();
const medias = useMediasTurma(alunos);
useRadarRisco(alunos, medias, TURMA_ID, "sistema");
return null;
}

================================================
FILE: src/config/regras.ts
================================================
import type { RegraFrequencia } from "../types";

export const REGRAS: RegraFrequencia = {
frequenciaMinima: 75,
mediaMinima: 7,
pesosAvaliacoes: { AV1: 1, AV2: 1 },
validadePinMinutos: 5,
digitosPin: 4,
limiteAlertaFaltas: 25,
prazoJustificativaDias: 3,
};

/\*_ Derivado: nunca edite à mão _/
export const LIMITE_FALTAS_PCT = 100 - REGRAS.frequenciaMinima;
export const FREQ_MINIMA = REGRAS.frequenciaMinima;

================================================
FILE: src/core/auth/useAuthStore.ts
================================================
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PapelUsuario, Usuario } from "../../types";

interface AuthState {
autenticado: boolean;
usuario: Usuario | null;
login: (papel: PapelUsuario) => void;
logout: () => void;
}

const mockUsuarios: Record<PapelUsuario, Usuario> = {
aluno: {
id: "aluno-1",
nome: "João Arthur Albuquerque",
email: "joao.albuquerque@alvora.edu.br",
papel: "aluno",
turmaOuCargo: "Sistemas de Informação - 4º Período",
turmasIds: ["turma-1", "turma-2", "turma-3"],
},
professor: {
id: "prof-1",
nome: "Prof. Carlos Eduardo",
email: "carlos.eduardo@alvora.edu.br",
papel: "professor",
turmaOuCargo: "Docente de Algoritmos e Estrutura de Dados",
turmasIds: ["turma-1"],
},
gestor: {
id: "gestor-1",
nome: "Dra. Maria Helena",
email: "maria.helena@alvora.edu.br",
papel: "gestor",
turmaOuCargo: "Coordenação Pedagógica Geral",
turmasIds: [],
},
};

export const useAuthStore = create<AuthState>()(
persist(
(set) => ({
autenticado: false,
usuario: null,
login: (papel) =>
set({ autenticado: true, usuario: mockUsuarios[papel] }),
logout: () => set({ autenticado: false, usuario: null }),
}),
{ name: "alvora-sessao" },
),
);

================================================
FILE: src/core/lib/utils.ts
================================================
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
return twMerge(clsx(inputs));
}

export function formatarSimulacaoData(dataTexto: string): string {
return dataTexto;
}

================================================
FILE: src/core/ui/Badge.tsx
================================================
import React from "react";
import { cn } from "../lib/utils";

type Variant =
| "primary"
| "success"
| "warning"
| "info"
| "danger"
| "neutral";

const styles: Record<Variant, string> = {
primary: "bg-primary/10 text-primary",
info: "bg-brand text-white shadow-flat-sm",
success: "bg-emerald-50 text-emerald-600",
warning: "bg-amber-50 text-amber-600",
danger: "bg-rose-50 text-rose-600",
neutral: "bg-slate-100 text-slate-600",
};

export const Badge: React.FC<{
children: React.ReactNode;
variant?: Variant;
className?: string;
}> = ({ children, variant = "neutral", className }) => (
<span
className={cn(
"inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap",
styles[variant],
className,
)}

>

    {children}

  </span>
);

================================================
FILE: src/core/ui/Button.tsx
================================================
import React from "react";
import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
size?: "sm" | "md" | "lg";
icon?: React.ReactNode;
}

const sizes = {
sm: "h-8 px-3.5 text-xs gap-1.5 rounded-lg",
md: "h-10 px-5 text-sm gap-2 rounded-xl",
lg: "h-12 px-6 text-sm gap-2 rounded-xl",
};

const variants = {
primary:
"bg-brand text-white shadow-glow hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-8px_rgba(81,112,255,0.65)]",
secondary: "bg-primary/10 text-primary hover:bg-primary/15",
outline:
"border border-primary/20 bg-white text-primary hover:bg-primary/5 hover:border-primary/40",
ghost: "text-primary hover:bg-primary/10",
danger:
"bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 hover:-translate-y-0.5",
};

export const Button: React.FC<ButtonProps> = ({
children,
variant = "primary",
size = "md",
icon,
className,
type = "button",
...props
}) => (
<button
type={type}
className={cn(
"inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.97]",
"focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25",
"disabled:opacity-50 disabled:pointer-events-none",
sizes[size],
variants[variant],
className,
)}
{...props}

>

    {icon && <span className="inline-flex shrink-0">{icon}</span>}
    {children}

  </button>
);

================================================
FILE: src/core/ui/Card.tsx
================================================
import React from "react";
import { cn } from "../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
hoverable?: boolean;
padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
children,
className,
hoverable = false,
padded = true,
...props
}) => (

  <div
    className={cn(
      "bg-white rounded-2xl border border-white shadow-flat transition-all duration-300",
      padded && "p-5 sm:p-6",
      hoverable &&
        "group hover:-translate-y-1 hover:shadow-flat-2 hover:border-primary/15",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

================================================
FILE: src/core/ui/EmConstrucao.tsx
================================================
import React from "react";
import { useLocation } from "react-router-dom";
import { Hammer } from "lucide-react";

export const EmConstrucao: React.FC = () => {
const { pathname } = useLocation();
return (
<div className="flex flex-col items-center justify-center py-20 text-center">
<Hammer className="text-slate-300 mb-3" size={28} />
<h1 className="text-base font-semibold text-slate-800">
Essa tela ainda está sendo construída
</h1>
<p className="text-sm text-slate-500 mt-1">
Volte em breve.{" "}
<code className="text-xs text-slate-400">{pathname}</code>
</p>
</div>
);
};

================================================
FILE: src/core/ui/IconBubble.tsx
================================================
import React from "react";
import { cn } from "../lib/utils";

export type CorBubble =
| "primary"
| "violet"
| "emerald"
| "amber"
| "rose"
| "cyan";

const cores: Record<CorBubble, string> = {
primary: "from-[#7b93ff] to-[#3b59ff] shadow-[#5170ff]/40",
violet: "from-[#a78bfa] to-[#6d5bff] shadow-violet-500/40",
emerald: "from-[#5eead4] to-[#10b981] shadow-emerald-500/40",
amber: "from-[#fcd34d] to-[#f59e0b] shadow-amber-500/40",
rose: "from-[#fda4af] to-[#f43f5e] shadow-rose-500/40",
cyan: "from-[#67e8f9] to-[#0ea5e9] shadow-sky-500/40",
};

export const IconBubble: React.FC<{
icone: React.ElementType;
cor?: CorBubble;
tamanho?: "sm" | "md" | "lg";
className?: string;
}> = ({ icone: Icone, cor = "primary", tamanho: size = "md", className }) => {
const t = { sm: "w-9 h-9", md: "w-12 h-12", lg: "w-14 h-14" }[size];
const i = { sm: 16, md: 20, lg: 24 }[size];
return (
<div
className={cn(
"rounded-full bg-linear-to-br text-white flex items-center justify-center shrink-0 shadow-lg",
"transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6",
cores[cor],
t,
className,
)} >
<Icone size={i} strokeWidth={2.2} />
</div>
);
};

================================================
FILE: src/core/ui/Modal.tsx
================================================
import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
isOpen: boolean;
onClose: () => void;
title: string;
children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
isOpen,
onClose,
title,
children,
}) => {
useEffect(() => {
if (!isOpen) return;
const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
document.addEventListener("keydown", onKey);
document.body.style.overflow = "hidden";
return () => {
document.removeEventListener("keydown", onKey);
document.body.style.overflow = "";
};
}, [isOpen, onClose]);

if (!isOpen) return null;

return (
<div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/30 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
<div
role="dialog"
aria-modal="true"
aria-label={title}
onClick={(e) => e.stopPropagation()}
className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-primary/20 flex flex-col max-h-[90vh] animate-scale-in overflow-hidden" >
<div className="relative px-6 h-16 flex items-center justify-between bg-brand text-white overflow-hidden">
<div className="absolute -right-8 -top-10 w-32 h-32 rounded-full bg-white/10" />
<h3 className="relative text-base font-bold">{title}</h3>
<button
            onClick={onClose}
            aria-label="Fechar"
            className="relative p-1.5 rounded-lg hover:bg-white/15 hover:rotate-90 transition-all duration-300"
          >
<X size={18} />
</button>
</div>
<div className="p-6 overflow-y-auto space-y-4">{children}</div>
</div>
</div>
);
};

================================================
FILE: src/core/ui/PageHeader.tsx
================================================
import React from "react";

export const PageHeader: React.FC<{
titulo: string;
descricao?: React.ReactNode;
acao?: React.ReactNode;
}> = ({ titulo, descricao, acao }) => (

  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 animate-fade-up">
    <div>
      <h1 className="text-2xl font-extrabold text-ink">{titulo}</h1>
      {descricao && <p className="text-sm text-slate-500 mt-1">{descricao}</p>}
    </div>
    {acao}
  </div>
);

================================================
FILE: src/core/ui/Skeleton.tsx
================================================
import React from "react";
import { cn } from "../lib/utils";

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (

  <div className={cn("animate-pulse bg-primary/10 rounded-xl", className)} />
);

================================================
FILE: src/lib/supabase.ts
================================================
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
throw new Error(
"Faltam VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY no .env.local",
);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

================================================
FILE: src/mocks/data.ts
================================================
import {
SessaoFrequenciaAoVivo,
Aluno,
AlunoEmRisco,
BoletimDisciplina,
RequerimentoSecretaria,
BoletoFinanceiro,
DiarioDocenteStatus,
} from "../types";

export const sessaoFrequenciaAtiva: SessaoFrequenciaAoVivo = {
id: "sessao-1",
disciplinaId: "1",
disciplinaNome: "Desenvolvimento Front-End Especializado",
pinCode: "8492",
tempoLimiteSegundos: 300,
ativa: true,
alunosPresentesIds: ["aluno-2", "aluno-3"],
};

export const alunoLogadoMock: Aluno = {
id: "aluno-1",
nome: "João Arthur Albuquerque",
email: "aluno@alvora.edu.br",
role: "aluno",
matricula: "202410842",
curso: "Análise e Desenvolvimento de Sistemas",
mediaGeral: 8.9,
historicoFrequencia: [
{
disciplinaId: "1",
disciplinaNome: "Desenvolvimento Front-End Especializado",
totalAulas: 40,
presencas: 38,
faltas: 2,
percentualFrequencia: 95.0,
},
{
disciplinaId: "2",
disciplinaNome: "Engenharia de Software e Arquitetura",
totalAulas: 40,
presencas: 40,
faltas: 0,
percentualFrequencia: 100.0,
},
{
disciplinaId: "3",
disciplinaNome: "Sistemas Distribuídos e Cloud",
totalAulas: 36,
presencas: 28,
faltas: 8,
percentualFrequencia: 77.7,
},
],
};

export const listaAlunosTurmaMock = [
{
id: "aluno-1",
nome: "João Arthur Albuquerque",
matricula: "202410842",
presente: false,
},
{
id: "aluno-2",
nome: "Ana Beatriz Souza",
matricula: "202410843",
presente: true,
},
{
id: "aluno-3",
nome: "Carlos Eduardo Lima",
matricula: "202410844",
presente: true,
},
{
id: "aluno-4",
nome: "Mariana Costa",
matricula: "202410845",
presente: false,
},
{
id: "aluno-5",
nome: "Lucas Mendonça Silva",
matricula: "202410846",
presente: false,
},
];

export const alunosEmRiscoMock: AlunoEmRisco[] = [
{
id: "aluno-102",
nome: "Gabriel Santos Ferreira",
matricula: "202410112",
curso: "Engenharia de Software",
disciplinaNome: "Sistemas Distribuídos e Cloud",
percentualFrequencia: 72.5,
faltasAcumuladas: 11,
maxFaltasPermitidas: 10,
mediaAtual: 5.2,
motivoRisco: "AMBOS",
},
{
id: "aluno-105",
nome: "Camila Rocha Ramos",
matricula: "202410304",
curso: "Análise e Desenvol. de Sistemas",
disciplinaNome: "Desenvolvimento Front-End Especializado",
percentualFrequencia: 74.0,
faltasAcumuladas: 10,
maxFaltasPermitidas: 10,
mediaAtual: 7.8,
motivoRisco: "FALTAS",
},
{
id: "aluno-109",
nome: "Mateus Oliveira Filho",
matricula: "202410408",
curso: "Ciência da Computação",
disciplinaNome: "Bancos de Dados Relacionais",
percentualFrequencia: 88.0,
faltasAcumuladas: 4,
maxFaltasPermitidas: 10,
mediaAtual: 4.8,
motivoRisco: "NOTA",
},
];

export const boletimAlunoMock: BoletimDisciplina[] = [
{
id: "1",
disciplinaNome: "Desenvolvimento Front-End Especializado",
professorNome: "Prof. Marcos Vinícius",
av1: 9.0,
av2: 8.5,
atividadesContinuas: 9.5,
mediaParcial: 8.9,
status: "Aprovado",
},
{
id: "2",
disciplinaNome: "Engenharia de Software e Arquitetura",
professorNome: "Profa. Renata Silveira",
av1: 8.5,
av2: null,
atividadesContinuas: 9.0,
mediaParcial: 8.7,
status: "Em Andamento",
},
{
id: "3",
disciplinaNome: "Sistemas Distribuídos e Cloud",
professorNome: "Prof. André Albuquerque",
av1: 6.0,
av2: null,
atividadesContinuas: 7.0,
mediaParcial: 6.3,
status: "Em Risco",
},
];

export const requerimentosMock: RequerimentoSecretaria[] = [
{
id: "req-1",
titulo: "Declaração de Matrícula Atualizada",
protocolo: "20260925-001",
dataSolicitacao: "20/09/2026",
status: "Concluído",
},
{
id: "req-2",
titulo: "Histórico Escolar Parcial Assinado",
protocolo: "20260922-014",
dataSolicitacao: "22/09/2026",
status: "Em Análise",
},
];

export const boletosMock: BoletoFinanceiro[] = [
{
id: "bol-1",
referencia: "Mensalidade Setembro / 2026",
vencimento: "10/09/2026",
valor: 780.0,
status: "Pago",
},
{
id: "bol-2",
referencia: "Mensalidade Outubro / 2026",
vencimento: "10/10/2026",
valor: 780.0,
status: "A Vencer",
},
];

export const diariosDocentesMock: DiarioDocenteStatus[] = [
{
id: "dir-1",
disciplinaNome: "Desenvolvimento Front-End Especializado",
turma: "ADS - 4º Período A",
professorNome: "Prof. Marcos Vinícius",
aulasMinistradas: 32,
aulasPrevistas: 40,
statusDiario: "Em Dia",
frequenciaMediaTurma: 94.2,
},
{
id: "dir-2",
disciplinaNome: "Sistemas Distribuídos e Cloud",
turma: "ADS - 4º Período B",
professorNome: "Prof. André Albuquerque",
aulasMinistradas: 24,
aulasPrevistas: 40,
statusDiario: "Pendente (3d)",
frequenciaMediaTurma: 81.5,
},
{
id: "dir-3",
disciplinaNome: "Bancos de Dados Relacionais",
turma: "CC - 2º Período A",
professorNome: "Prof. Fernando Dantas",
aulasMinistradas: 18,
aulasPrevistas: 40,
statusDiario: "Atrasado",
frequenciaMediaTurma: 76.0,
},
];
// Histórico base da Turma A em Front-End (disciplinaId "1")
export const historicoBaseTurmaMock: Record<
string,
{ totalAulas: number; presencas: number; faltas: number }

> = {
> "aluno-1": { totalAulas: 40, presencas: 38, faltas: 2 }, // igual ao alunoLogadoMock
> "aluno-2": { totalAulas: 40, presencas: 36, faltas: 4 },
> "aluno-3": { totalAulas: 40, presencas: 34, faltas: 6 },
> "aluno-4": { totalAulas: 40, presencas: 30, faltas: 10 }, // 25% → já em risco
> "aluno-5": { totalAulas: 40, presencas: 32, faltas: 8 }, // 20% → mais uma falta e entra no risco 😬
> };

================================================
FILE: src/modules/aluno/AlunoShell.tsx
================================================
import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Radio, AlertTriangle, Check, KeyRound } from "lucide-react";
import { Button } from "../../core/ui/Button";
import { Modal } from "../../core/ui/Modal";
import { IconBubble } from "../../core/ui/IconBubble";
import { sessaoFrequenciaAtiva } from "../../mocks/data";
import {
chamadaStore,
useChamada,
type ResultadoConfirmacao,
} from "../../services/chamadaStore";
import { FREQ_MINIMA } from "../../services/diarioStore";
import {
useAlertas,
alertaStore,
NOTA_MINIMA,
type MotivoAlerta,
} from "../../services/radarRisco";
import { DISCIPLINA_ID } from "../../services/frequenciaTurma";
import { cn } from "../../core/lib/utils";
import { useAlunoDados } from "./useAlunoDados";

const MENSAGENS_ERRO: Record<
Exclude<ResultadoConfirmacao, "ok" | "duplicado">,
string

> = {
> invalido: "PIN incorreto. Confira no data-show e tente de novo.",
> expirado: "Essa chamada expirou. Peça um novo PIN ao professor.",
> };

export const AlunoShell: React.FC = () => {
const navigate = useNavigate();
const { aluno, historico } = useAlunoDados();

const chamada = useChamada();
const { expiraEm } = chamada;
const [agora, setAgora] = useState(() => Date.now());
const chamadaAtiva = !!expiraEm && expiraEm > agora;
const restante = expiraEm
? Math.max(0, Math.floor((expiraEm - agora) / 1000))
: 0;

useEffect(() => {
if (!expiraEm) return;
const t = setInterval(() => {
const now = Date.now();
setAgora(now);
if (now >= expiraEm) clearInterval(t);
}, 1000);
return () => clearInterval(t);
}, [expiraEm]);

const [pinAberto, setPinAberto] = useState(false);
const [pin, setPin] = useState("");
const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
const [msg, setMsg] = useState("");
const [tentativa, setTentativa] = useState(0);

const validar = (e: React.FormEvent) => {
e.preventDefault();
const r = chamadaStore.confirmar(pin, aluno.id);
setAgora(Date.now());
if (r === "duplicado") {
setStatus("success");
return setMsg("Sua presença já estava confirmada 😉");
}
if (r !== "ok") {
setStatus("error");
setMsg(MENSAGENS_ERRO[r]);
setTentativa((t) => t + 1);
return setPin("");
}
const hora = new Date().toLocaleTimeString("pt-BR", {
hour: "2-digit",
minute: "2-digit",
});
setStatus("success");
setMsg(
`Presença registrada às ${hora}. Ela aparece no extrato quando o professor salvar o diário.`,
);
};

const fecharPin = () => {
setPinAberto(false);
setPin("");
setStatus("idle");
setMsg("");
};

const todos = useAlertas();
const alertas = useMemo(
() =>
todos.filter(
(a) =>
a.alunoId === aluno.id &&
a.notificado.aluno &&
!a.historico.some((h) => h.acao === "aluno ciente"),
),
[todos, aluno.id],
);

const disc = historico.find((h) => h.disciplinaId === DISCIPLINA_ID);
const limite = disc
? Math.floor((disc.totalAulas \* (100 - FREQ_MINIMA)) / 100)
: 0;
const restantes = disc ? Math.max(0, limite - disc.faltas) : 0;

const mensagem = (motivo: MotivoAlerta) => {
const nome = disc?.disciplinaNome ?? "uma disciplina";
const faltas = disc
? `${disc.percentualFrequencia}% de frequência em ${nome}. ${restantes > 0 ? `Restam ${restantes} falta(s) até o limite.` : "Limite de faltas atingido."}`
      : `Frequência abaixo do mínimo em ${nome}.`;
    const nota = `Média abaixo de ${NOTA_MINIMA} em ${nome}.`;
    return motivo === "FALTAS"
      ? faltas
      : motivo === "NOTA"
        ? nota
        : `${faltas} ${nota}`;
};

const urgente = restante <= 30;

return (
<div className="max-w-5xl mx-auto space-y-4">
{chamadaAtiva && (
<div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-brand text-white shadow-glow animate-fade-up">
<div className="absolute -right-10 -top-12 w-40 h-40 rounded-full bg-white/10" />
<div className="relative w-12 h-12 shrink-0">
<span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
<span className="relative w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
<Radio size={22} />
</span>
</div>
<div className="relative flex-1 min-w-0">
<p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/70">
Chamada ao vivo
</p>
<p className="text-base font-bold truncate">
{chamada.disciplinaNome ?? sessaoFrequenciaAtiva.disciplinaNome}
</p>
</div>
<div
className={cn(
"relative px-4 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center font-extrabold text-lg tabular",
urgente && "animate-pulse bg-rose-500/40",
)} >
{Math.floor(restante / 60)}:{String(restante % 60).padStart(2, "0")}
</div>
<Button
size="md"
icon={<KeyRound size={16} />}
className="relative bg-white text-primary! shadow-lg hover:bg-white hover:-translate-y-0.5"
onClick={() => setPinAberto(true)} >
Inserir PIN
</Button>
</div>
)}

      {alertas.map((al) => (
        <div
          key={al.id}
          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-white shadow-flat border-l-4 border-rose-400 animate-fade-up"
        >
          <IconBubble icone={AlertTriangle} cor="rose" tamanho="sm" />
          <div className="flex-1">
            <p className="text-sm font-bold text-ink">{mensagem(al.motivo)}</p>
            <p className="text-xs text-slate-500">
              Ainda dá tempo de virar o jogo 💪 A coordenação está te
              acompanhando.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/aluno/frequencia")}
            >
              Ver extrato
            </Button>
            <Button
              size="sm"
              onClick={() =>
                alertaStore.registrar(al.id, "aluno ciente", aluno.id)
              }
            >
              Estou ciente
            </Button>
          </div>
        </div>
      ))}

      <Outlet />

      <Modal isOpen={pinAberto} onClose={fecharPin} title="Confirmar presença">
        {status === "success" ? (
          <div className="text-center py-4 space-y-5">
            <div className="relative w-20 h-20 mx-auto">
              <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-emerald-300 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 animate-pop">
                <Check size={36} strokeWidth={3} />
              </div>
            </div>
            <div>
              <p className="text-lg font-extrabold text-ink">
                Presença confirmada! 🎉
              </p>
              <p className="text-sm text-slate-500 mt-1">{msg}</p>
            </div>
            <Button className="w-full" onClick={fecharPin}>
              Concluir
            </Button>
          </div>
        ) : (
          <form onSubmit={validar} className="space-y-5">
            <p className="text-sm text-slate-500 text-center">
              Digite o PIN de 4 dígitos exibido em sala
            </p>
            <label
              key={tentativa}
              className={cn("relative block", tentativa > 0 && "animate-shake")}
            >
              <input
                autoFocus
                inputMode="numeric"
                maxLength={4}
                value={pin}
                aria-label="PIN"
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-extrabold tabular transition-all duration-200",
                      pin[i]
                        ? "border-primary bg-primary/5 text-primary -translate-y-0.5 shadow-flat-sm"
                        : "border-slate-200 text-slate-300",
                      i === pin.length &&
                        "border-primary/50 ring-4 ring-primary/10",
                      status === "error" && !pin && "border-rose-300",
                    )}
                  >
                    {pin[i] ? (
                      <span className="animate-pop">{pin[i]}</span>
                    ) : (
                      "•"
                    )}
                  </div>
                ))}
              </div>
            </label>
            {status === "error" && (
              <p className="text-sm font-medium text-rose-600 bg-rose-50 p-3 rounded-xl text-center animate-fade-in">
                {msg}
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={pin.length !== 4}
            >
              Confirmar presença
            </Button>
          </form>
        )}
      </Modal>
    </div>

);
};

================================================
FILE: src/modules/aluno/BoletimAluno.tsx
================================================
import React, { useState } from "react";
import { Calculator, Target } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { PageHeader } from "../../core/ui/PageHeader";
import { IconBubble } from "../../core/ui/IconBubble";
import { boletimAlunoMock } from "../../mocks/data";
import { cn } from "../../core/lib/utils";
import { SELO_BOLETIM, semestreAtual } from "./constantes";

const pendentes = boletimAlunoMock.filter((b) => b.av2 === null);

const Anel: React.FC<{ valor: number }> = ({ valor }) => {
const r = 26,
c = 2 _ Math.PI _ r;
const cor = valor >= 7 ? "#5170ff" : valor >= 5 ? "#f59e0b" : "#f43f5e";
return (
<div className="relative w-16 h-16 shrink-0">
<svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
<circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#eef2ff"
          strokeWidth="6"
        />
<circle
cx="32"
cy="32"
r={r}
fill="none"
stroke={cor}
strokeWidth="6"
strokeLinecap="round"
strokeDasharray={c}
strokeDashoffset={c - (valor / 10) \* c}
style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)",
          }}
className="animate-[grow-ring_1.2s_cubic-bezier(0.22,1,0.36,1)_both]"
/>
</svg>
<span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-ink tabular">
{valor.toFixed(1)}
</span>
<style>{`@keyframes grow-ring { from { stroke-dashoffset: ${c}; } }`}</style>
</div>
);
};

export const BoletimAluno: React.FC = () => {
const [meta, setMeta] = useState(7);
const [discId, setDiscId] = useState(pendentes[0]?.id ?? "");
const disc = pendentes.find((b) => b.id === discId);
const necessaria = disc
? Math.max(0, Number((meta \* 2 - disc.av1).toFixed(1)))
: null;

return (
<div className="space-y-6">
<PageHeader titulo="Boletim" descricao={`Semestre ${semestreAtual()}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
        {boletimAlunoMock.map((b) => (
          <Card key={b.id} hoverable className="flex items-center gap-5">
            <Anel valor={b.mediaParcial} />
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {b.disciplinaNome}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {b.professorNome}
                  </p>
                </div>
                <Badge variant={SELO_BOLETIM[b.status]}>{b.status}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 tabular">
                {[
                  { l: "AV1", v: b.av1 },
                  { l: "AV2", v: b.av2 },
                  { l: "Ativ.", v: b.atividadesContinuas },
                ].map(({ l, v }) => (
                  <div
                    key={l}
                    className="rounded-lg bg-slate-50 group-hover:bg-primary/5 transition-colors py-1.5 text-center"
                  >
                    <p className="text-[10px] font-medium text-slate-400">
                      {l}
                    </p>
                    <p
                      className={cn(
                        "text-sm font-bold",
                        v == null ? "text-slate-300" : "text-ink",
                      )}
                    >
                      {v?.toFixed(1) ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="space-y-5 animate-fade-up">
        <div className="flex items-center gap-4">
          <IconBubble icone={Calculator} cor="violet" />
          <div>
            <h2 className="text-lg font-extrabold text-ink">
              Quanto preciso tirar na AV2?
            </h2>
            <p className="text-xs text-slate-400">
              Escolha a disciplina e a média que você quer alcançar.
            </p>
          </div>
        </div>

        {!disc ? (
          <p className="text-sm text-slate-500 p-4 rounded-xl bg-emerald-50 text-center">
            Nenhuma AV2 pendente. Mandou bem! 🎉
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {pendentes.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setDiscId(b.id)}
                    className={cn(
                      "px-3.5 h-9 rounded-full text-xs font-semibold transition-all",
                      discId === b.id
                        ? "bg-brand text-white shadow-glow"
                        : "bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary",
                    )}
                  >
                    {b.disciplinaNome} · AV1 {b.av1}
                  </button>
                ))}
              </div>
              <label className="block text-sm font-semibold text-ink">
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Target size={15} className="text-primary" /> Média desejada
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-extrabold tabular">
                    {meta.toFixed(1)}
                  </span>
                </span>
                <input
                  type="range"
                  min="6"
                  max="10"
                  step="0.5"
                  value={meta}
                  onChange={(e) => setMeta(parseFloat(e.target.value))}
                  className="mt-3 w-full accent-primary cursor-pointer"
                />
                <span className="flex justify-between text-[10px] text-slate-400 tabular">
                  <span>6,0</span>
                  <span>10,0</span>
                </span>
              </label>
            </div>

            <div className="relative overflow-hidden p-6 rounded-2xl bg-brand text-white text-center shadow-glow">
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10" />
              <div className="absolute -left-6 -bottom-10 w-24 h-24 rounded-full bg-white/10" />
              <p className="relative text-xs font-semibold text-white/80">
                Nota mínima na AV2
              </p>
              {necessaria !== null && necessaria > 10 ? (
                <p
                  key="x"
                  className="relative text-sm font-bold mt-3 animate-pop"
                >
                  Inalcançável só com a AV2 😅
                  <br />
                  Tente uma meta menor.
                </p>
              ) : (
                <>
                  <p
                    key={`${discId}-${meta}`}
                    className="relative text-5xl font-extrabold mt-2 tabular animate-pop"
                  >
                    {necessaria?.toFixed(1)}
                  </p>
                  <p className="relative text-xs text-white/80 mt-1">
                    {necessaria! <= 5
                      ? "Tranquilo, você consegue! 😎"
                      : necessaria! <= 8
                        ? "Bora estudar que dá! 💪"
                        : "Desafio aceito? 🔥"}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>

);
};

================================================
FILE: src/modules/aluno/ConfirmarPresencaCard.tsx
================================================
import React, { useState } from "react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { alunoLogadoMock } from "../../mocks/data";
import {
chamadaStore,
type ResultadoConfirmacao,
} from "../../services/chamadaStore";

const MENSAGENS: Record<ResultadoConfirmacao, { texto: string; cor: string }> =
{
ok: { texto: "✓ Presença confirmada!", cor: "text-emerald-600" },
invalido: {
texto: "PIN inválido. Confira no data-show.",
cor: "text-rose-600",
},
expirado: { texto: "Esta chamada já expirou.", cor: "text-amber-600" },
duplicado: {
texto: "Você já confirmou presença. 😉",
cor: "text-primary",
},
};

export const ConfirmarPresencaCard: React.FC = () => {
const [pin, setPin] = useState("");
const [resultado, setResultado] = useState<ResultadoConfirmacao | null>(null);

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
setResultado(chamadaStore.confirmar(pin, alunoLogadoMock.id));
setPin("");
};

return (
<Card>
<h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
Chamada ao Vivo
</h3>
<form onSubmit={handleSubmit} className="flex gap-3">
<input
value={pin}
onChange={(e) =>
setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
}
inputMode="numeric"
placeholder="PIN de 4 dígitos"
className="flex-1 px-4 py-2 rounded-xl border border-primary/20 text-center text-lg font-black tracking-widest focus:outline-none focus:border-primary"
/>
<Button type="submit" disabled={pin.length !== 4}>
Confirmar
</Button>
</form>
{resultado && (
<p className={`text-xs font-bold mt-3 ${MENSAGENS[resultado].cor}`}>
{MENSAGENS[resultado].texto}
</p>
)}
</Card>
);
};

================================================
FILE: src/modules/aluno/constantes.ts
================================================
import type { SituacaoFrequencia } from "../../services/diarioStore";
import type { CorBubble } from "../../core/ui/IconBubble";
import type { StatusJustificativa } from "../../services/justificativaStore";

export type VarianteBadge =
| "success"
| "warning"
| "danger"
| "primary"
| "neutral";
type Selo = { variant: VarianteBadge; label: string };

export const BADGE_FREQ: Record<SituacaoFrequencia, Selo> = {
segura: { variant: "success", label: "Regular" },
atencao: { variant: "warning", label: "Atenção" },
reprovado: { variant: "danger", label: "Abaixo do mínimo" },
};

export const SELO_JUST: Record<StatusJustificativa, Selo> = {
pendente: { variant: "warning", label: "Em análise" },
aprovada: { variant: "success", label: "Abonada" },
recusada: { variant: "danger", label: "Recusada" },
};

export const SELO_BOLETIM: Record<string, VarianteBadge> = {
Aprovado: "success",
"Em Risco": "danger",
"Em Andamento": "neutral",
};

export const semestreAtual = () => {
const d = new Date();
return `${d.getFullYear()}.${d.getMonth() < 6 ? 1 : 2}`;
};

export const formatarData = (iso: string) =>
new Date(iso + "T12:00").toLocaleDateString("pt-BR");

export const CORES_DISC: CorBubble[] = [
"primary",
"violet",
"cyan",
"emerald",
"amber",
"rose",
];

export const COR_BARRA: Record<SituacaoFrequencia, string> = {
segura: "bg-brand",
atencao: "bg-gradient-to-r from-amber-400 to-amber-500",
reprovado: "bg-gradient-to-r from-rose-400 to-rose-500",
};

================================================
FILE: src/modules/aluno/DisciplinasAluno.tsx
================================================
import React from "react";
import { BookOpen, CheckCircle2, XCircle, CalendarClock } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { PageHeader } from "../../core/ui/PageHeader";
import { IconBubble } from "../../core/ui/IconBubble";
import { situacaoFrequencia } from "../../services/diarioStore";
import { boletimAlunoMock } from "../../mocks/data";
import { useAlunoDados } from "./useAlunoDados";
import { BADGE_FREQ, CORES_DISC } from "./constantes";

export const DisciplinasAluno: React.FC = () => {
const { historico } = useAlunoDados();
return (
<div className="space-y-6">
<PageHeader
titulo="Minhas disciplinas"
descricao={`${historico.length} disciplinas neste semestre 📚`}
/>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
{historico.map((d, i) => {
const dadas = d.presencas + d.faltas;
const prog = d.totalAulas
? Math.min(100, (dadas / d.totalAulas) \* 100)
: 0;
const badge = BADGE_FREQ[situacaoFrequencia(d.percentualFrequencia)];
const prof = boletimAlunoMock.find(
(b) => b.id === d.disciplinaId,
)?.professorNome;
const infos = [
{
icone: CheckCircle2,
valor: d.presencas,
label: "presenças",
cor: "text-emerald-500",
},
{
icone: XCircle,
valor: d.faltas,
label: "faltas",
cor: "text-rose-500",
},
{
icone: CalendarClock,
valor: Math.max(0, d.totalAulas - dadas),
label: "restantes",
cor: "text-primary",
},
];
return (
<Card key={d.disciplinaId} hoverable className="space-y-5">
<div className="flex items-start gap-4">
<IconBubble
icone={BookOpen}
cor={CORES_DISC[i % CORES_DISC.length]}
/>
<div className="flex-1 min-w-0">
<h3 className="text-sm font-bold text-ink truncate">
{d.disciplinaNome}
</h3>
<p className="text-xs text-slate-400 truncate">{prof}</p>
</div>
<Badge variant={badge.variant}>{badge.label}</Badge>
</div>

              <div className="grid grid-cols-3 gap-2">
                {infos.map(({ icone: I, valor, label, cor }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-slate-50 group-hover:bg-primary/5 transition-colors p-2.5 text-center"
                  >
                    <I size={15} className={`mx-auto ${cor}`} />
                    <p className="text-base font-extrabold text-ink tabular mt-1">
                      {valor}
                    </p>
                    <p className="text-[10px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1.5 tabular">
                  <span>Aulas concluídas</span>
                  <span className="text-ink font-bold">
                    {dadas} / {d.totalAulas}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full animate-grow"
                    style={{ width: `${prog}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>

);
};

================================================
FILE: src/modules/aluno/FrequenciaAluno.tsx
================================================
import React, { useMemo, useState } from "react";
import {
Paperclip,
MessageSquare,
UploadCloud,
CalendarX,
BookOpen,
FileCheck2,
X,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { Button } from "../../core/ui/Button";
import { Modal } from "../../core/ui/Modal";
import { PageHeader } from "../../core/ui/PageHeader";
import { IconBubble } from "../../core/ui/IconBubble";
import { situacaoFrequencia, FREQ_MINIMA } from "../../services/diarioStore";
import { justificativaStore } from "../../services/justificativaStore";
import { cn } from "../../core/lib/utils";
import { useAlunoDados } from "./useAlunoDados";
import {
BADGE_FREQ,
SELO_JUST,
formatarData,
CORES_DISC,
COR_BARRA,
} from "./constantes";

const campo =
"mt-1.5 w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition";
const pontoStatus = {
pendente: "bg-amber-400",
aprovada: "bg-emerald-500",
recusada: "bg-rose-500",
};

export const FrequenciaAluno: React.FC = () => {
const { aluno, historico, justificativas, frequenciaGlobal } =
useAlunoDados();
const [aberto, setAberto] = useState(false);
const [disc, setDisc] = useState("");
const [data, setData] = useState("");
const [motivo, setMotivo] = useState("");
const [anexo, setAnexo] = useState<string>();
const [erro, setErro] = useState("");
const [arrastando, setArrastando] = useState(false);
const hoje = new Date().toISOString().slice(0, 10);

const minhas = useMemo(
() =>
justificativas
.filter((j) => j.alunoId === aluno.id)
.sort((a, b) => b.criadaEm - a.criadaEm),
[justificativas, aluno.id],
);

const abrir = (id: string) => {
setDisc(id);
setData("");
setMotivo("");
setAnexo(undefined);
setErro("");
setAberto(true);
};

const enviar = (e: React.FormEvent) => {
e.preventDefault();
const d = historico.find((h) => h.disciplinaId === disc);
if (!d) return;
const r = justificativaStore.enviar({
alunoId: aluno.id,
alunoNome: aluno.nome,
disciplinaId: d.disciplinaId,
disciplinaNome: d.disciplinaNome,
dataFalta: data,
motivo: motivo.trim(),
anexoNome: anexo,
});
if (r === "duplicada")
return setErro(
"Já existe uma justificativa para essa data nessa disciplina.",
);
setAberto(false);
};

const totalFaltas = historico.reduce((a, h) => a + h.faltas, 0);
const resumo = [
{
label: "Frequência geral",
valor: `${frequenciaGlobal.toFixed(1)}%`,
cor: "emerald" as const,
icone: FileCheck2,
},
{
label: "Total de faltas",
valor: totalFaltas,
cor: "rose" as const,
icone: CalendarX,
},
{
label: "Justificativas em análise",
valor: minhas.filter((j) => j.status === "pendente").length,
cor: "amber" as const,
icone: MessageSquare,
},
];

return (
<div className="space-y-6">
<PageHeader
titulo="Frequência"
descricao={`Mínimo de ${FREQ_MINIMA}% por disciplina (até ${100 - FREQ_MINIMA}% de faltas).`}
/>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
        {resumo.map((r) => (
          <Card key={r.label} hoverable className="flex items-center gap-4">
            <IconBubble icone={r.icone} cor={r.cor} />
            <div>
              <p className="text-xs font-medium text-slate-400">{r.label}</p>
              <p className="text-2xl font-extrabold text-ink tabular">
                {r.valor}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-3 stagger">
        {historico.map((h, i) => {
          const sit = situacaoFrequencia(h.percentualFrequencia);
          return (
            <Card key={h.disciplinaId} hoverable className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <IconBubble
                  icone={BookOpen}
                  cor={CORES_DISC[i % CORES_DISC.length]}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink">
                    {h.disciplinaNome}
                  </p>
                  <p className="text-xs text-slate-400 tabular">
                    {h.presencas} presenças · {h.faltas} faltas · {h.totalAulas}{" "}
                    aulas
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {h.faltas > 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<CalendarX size={14} />}
                      onClick={() => abrir(h.disciplinaId)}
                    >
                      Justificar
                    </Button>
                  )}
                  <Badge variant={BADGE_FREQ[sit].variant}>
                    {BADGE_FREQ[sit].label}
                  </Badge>
                  <span className="text-xl font-extrabold text-ink tabular w-16 text-right">
                    {h.percentualFrequencia}%
                  </span>
                </div>
              </div>
              <div className="relative h-2.5 bg-slate-100 rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full animate-grow",
                    COR_BARRA[sit],
                  )}
                  style={{ width: `${h.percentualFrequencia}%` }}
                />
                <div
                  className="absolute -top-1 h-4.5 w-0.5 rounded bg-ink/40"
                  style={{ left: `${FREQ_MINIMA}%` }}
                  title={`Mínimo ${FREQ_MINIMA}%`}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400">
                    {FREQ_MINIMA}%
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {minhas.length > 0 && (
        <Card className="space-y-5">
          <h2 className="text-lg font-extrabold text-ink">
            Minhas justificativas
          </h2>
          <ol className="relative border-l-2 border-primary/10 ml-2 space-y-5 stagger">
            {minhas.map((j) => (
              <li key={j.id} className="relative pl-6">
                <span
                  className={cn(
                    "absolute -left-1.75 top-1.5 w-3 h-3 rounded-full ring-4 ring-white",
                    pontoStatus[j.status],
                  )}
                />
                <div className="flex justify-between items-start gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 transition-colors">
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-bold text-ink">
                      {j.disciplinaNome} ·{" "}
                      <span className="tabular">
                        {formatarData(j.dataFalta)}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">{j.motivo}</p>
                    {j.anexoNome && (
                      <p className="text-xs font-medium text-primary flex items-center gap-1">
                        <Paperclip size={12} /> {j.anexoNome}
                      </p>
                    )}
                    {j.parecer && (
                      <p className="text-xs text-slate-600 flex items-start gap-1.5 mt-2 p-2 rounded-lg bg-white">
                        <MessageSquare
                          size={12}
                          className="mt-0.5 shrink-0 text-primary"
                        />{" "}
                        {j.parecer}
                      </p>
                    )}
                  </div>
                  <Badge variant={SELO_JUST[j.status].variant}>
                    {SELO_JUST[j.status].label}
                  </Badge>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      <Modal
        isOpen={aberto}
        onClose={() => setAberto(false)}
        title="Justificar falta"
      >
        <form onSubmit={enviar} className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
            <IconBubble icone={BookOpen} tamanho="sm" />
            <p className="text-sm font-bold text-primary">
              {historico.find((h) => h.disciplinaId === disc)?.disciplinaNome}
            </p>
          </div>
          <label className="block text-sm font-semibold text-ink">
            Data da falta
            <input
              type="date"
              required
              max={hoje}
              value={data}
              onChange={(e) => setData(e.target.value)}
              className={campo}
            />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Motivo
            <textarea
              required
              minLength={10}
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex.: consulta médica"
              className={cn(campo, "resize-none")}
            />
            <span
              className={cn(
                "block text-right text-[11px] mt-1 tabular",
                motivo.trim().length >= 10
                  ? "text-emerald-500"
                  : "text-slate-400",
              )}
            >
              {motivo.trim().length}/10 mín.
            </span>
          </label>

          <div className="text-sm font-semibold text-ink">
            Comprovante{" "}
            <span className="font-normal text-slate-400">(opcional)</span>
            {anexo ? (
              <div className="mt-1.5 flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 animate-scale-in">
                <FileCheck2 size={18} className="text-emerald-600" />
                <span className="flex-1 text-xs font-medium text-emerald-700 truncate">
                  {anexo}
                </span>
                <button
                  type="button"
                  onClick={() => setAnexo(undefined)}
                  aria-label="Remover"
                  className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-100"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setArrastando(true);
                }}
                onDragLeave={() => setArrastando(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setArrastando(false);
                  setAnexo(e.dataTransfer.files?.[0]?.name);
                }}
                className={cn(
                  "group mt-1.5 flex flex-col items-center gap-1 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all",
                  arrastando
                    ? "border-primary bg-primary/10 scale-[1.02]"
                    : "border-slate-200 hover:border-primary/40 hover:bg-primary/5",
                )}
              >
                <UploadCloud
                  size={28}
                  className={cn(
                    "text-primary transition-transform",
                    arrastando
                      ? "-translate-y-1 scale-110"
                      : "group-hover:-translate-y-1",
                  )}
                />
                <span className="text-xs font-semibold text-ink">
                  Arraste aqui ou clique para enviar
                </span>
                <span className="text-[11px] font-normal text-slate-400">
                  PDF ou imagem
                </span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setAnexo(e.target.files?.[0]?.name)}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {erro && (
            <p className="text-sm font-medium text-rose-600 bg-rose-50 p-3 rounded-xl animate-shake">
              {erro}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!data || motivo.trim().length < 10}
          >
            Enviar justificativa
          </Button>
        </form>
      </Modal>
    </div>

);
};

================================================
FILE: src/modules/aluno/PortalAluno.tsx
================================================
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
ArrowRight,
FileText,
Calculator,
CalendarX,
Trophy,
CalendarCheck,
ClipboardList,
BookOpen,
AlertTriangle,
GraduationCap,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { Button } from "../../core/ui/Button";
import { IconBubble, type CorBubble } from "../../core/ui/IconBubble";
import { boletimAlunoMock } from "../../mocks/data";
import { situacaoFrequencia, FREQ_MINIMA } from "../../services/diarioStore";
import { cn } from "../../core/lib/utils";
import { useAlunoDados } from "./useAlunoDados";
import { BADGE_FREQ, semestreAtual } from "./constantes";

const saudacao = () => {
const h = new Date().getHours();
return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
};
const corBarra = {
segura: "bg-brand",
atencao: "bg-gradient-to-r from-amber-400 to-amber-500",
reprovado: "bg-gradient-to-r from-rose-400 to-rose-500",
};
const coresDisc: CorBubble[] = [
"primary",
"violet",
"cyan",
"emerald",
"amber",
"rose",
];

export const PortalAluno: React.FC = () => {
const navigate = useNavigate();
const { aluno, historico, frequenciaGlobal } = useAlunoDados();

const disciplinas = historico.map((h) => {
const b = boletimAlunoMock.find((x) => x.id === h.disciplinaId);
return {
...h,
media: b?.mediaParcial,
professor: b?.professorNome,
notaEmRisco: b?.status === "Em Risco",
situacao: situacaoFrequencia(h.percentualFrequencia),
};
});
const atencao = disciplinas.filter(
(d) => d.situacao !== "segura" || d.notaEmRisco,
);
const av2Pendentes = boletimAlunoMock.filter((b) => b.av2 === null).length;

const stats = [
{
label: "Média geral",
valor: aluno.mediaGeral.toFixed(1),
dica: aluno.mediaGeral >= 7 ? "Acima da média 🎯" : "Abaixo de 7,0",
icone: Trophy,
cor: "violet" as CorBubble,
},
{
label: "Frequência",
valor: `${frequenciaGlobal.toFixed(1)}%`,
dica: `Mínimo: ${FREQ_MINIMA}%`,
icone: CalendarCheck,
cor: "emerald" as CorBubble,
},
{
label: "AV2 pendentes",
valor: String(av2Pendentes),
dica: av2Pendentes ? "Simule sua nota" : "Tudo lançado 🎉",
icone: ClipboardList,
cor: "amber" as CorBubble,
},
];

const atalhos = [
{
label: "Justificar falta",
desc: "Envie atestado ou comprovante.",
icone: CalendarX,
cor: "rose" as CorBubble,
to: "/aluno/frequencia",
},
{
label: "Simular AV2",
desc: "Descubra quanto precisa tirar.",
icone: Calculator,
cor: "primary" as CorBubble,
to: "/aluno/boletim",
},
{
label: "Pedir documento",
desc: "Declarações e requerimentos.",
icone: FileText,
cor: "cyan" as CorBubble,
to: "/aluno/secretaria",
},
];

return (
<div className="space-y-8">
{/_ Banner _/}
<section className="relative overflow-hidden rounded-3xl bg-brand p-6 sm:p-8 text-white shadow-glow">
<div className="absolute -right-16 -top-20 w-72 h-72 rounded-full bg-white/10" />
<div className="absolute right-24 -bottom-24 w-56 h-56 rounded-full bg-white/10" />
<div className="absolute right-10 top-8 hidden sm:flex gap-4">
<div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center animate-float">
<GraduationCap size={30} />
</div>
<div className="w-12 h-12 mt-10 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center animate-float [animation-delay:1.5s]">
<BookOpen size={22} />
</div>
<div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center animate-float [animation-delay:3s]">
<Trophy size={24} />
</div>
</div>
<div className="relative max-w-lg">
<p className="text-xs font-semibold text-white/75">
{aluno.curso} · {semestreAtual()} · Mat. {aluno.matricula}
</p>
<h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
{saudacao()}, {aluno.nome.split(" ")[0]}! 👋
</h1>
<p className="text-sm text-white/85 mt-2">
{atencao.length
? `${atencao.length} disciplina${atencao.length > 1 ? "s pedem" : " pede"} sua atenção. Bora resolver?`
: "Tudo em dia por aqui. Continue arrasando! 🚀"}
</p>
</div>
</section>

      {/* Números */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
        {stats.map((s) => (
          <Card key={s.label} hoverable className="flex items-center gap-4">
            <IconBubble icone={s.icone} cor={s.cor} />
            <div>
              <p className="text-xs font-medium text-slate-400">{s.label}</p>
              <p className="text-2xl font-extrabold text-ink tabular">
                {s.valor}
              </p>
              <p className="text-[11px] text-slate-400">{s.dica}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Avisos */}
      {atencao.length > 0 && (
        <div className="space-y-3 stagger">
          {atencao.map((d) => (
            <div
              key={d.disciplinaId}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-white shadow-flat border-l-4 border-amber-400"
            >
              <IconBubble icone={AlertTriangle} cor="amber" tamanho="sm" />
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">{d.disciplinaNome}</p>
                <p className="text-xs text-slate-500">
                  {d.situacao !== "segura" &&
                    `${d.percentualFrequencia}% de frequência · ${d.faltas} faltas`}
                  {d.situacao !== "segura" && d.notaEmRisco && " · "}
                  {d.notaEmRisco && `média ${d.media}`}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  navigate(
                    d.notaEmRisco ? "/aluno/boletim" : "/aluno/frequencia",
                  )
                }
              >
                Ver detalhes <ArrowRight size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Disciplinas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-ink">Suas disciplinas</h2>
          <Link
            to="/aluno/disciplinas"
            className="group text-sm font-semibold text-primary flex items-center gap-1"
          >
            Ver todas{" "}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
          {disciplinas.map((d, i) => (
            <Card key={d.disciplinaId} hoverable className="space-y-4">
              <div className="flex items-start gap-4">
                <IconBubble
                  icone={BookOpen}
                  cor={coresDisc[i % coresDisc.length]}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {d.disciplinaNome}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {d.professor}
                  </p>
                </div>
                <Badge variant={BADGE_FREQ[d.situacao].variant}>
                  {BADGE_FREQ[d.situacao].label}
                </Badge>
              </div>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1.5 tabular">
                    <span>Frequência</span>
                    <span className="text-ink font-bold">
                      {d.percentualFrequencia}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full animate-grow",
                        corBarra[d.situacao],
                      )}
                      style={{ width: `${d.percentualFrequencia}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-medium text-slate-400">
                    Média
                  </p>
                  <p className="text-xl font-extrabold text-primary tabular">
                    {d.media?.toFixed(1) ?? "—"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Atalhos */}
      <section className="space-y-4">
        <h2 className="text-lg font-extrabold text-ink">Acesso rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
          {atalhos.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="group flex items-center gap-4 p-5 rounded-2xl bg-white shadow-flat border border-white hover:-translate-y-1 hover:shadow-flat-2 hover:border-primary/15 transition-all duration-300"
            >
              <IconBubble icone={a.icone} cor={a.cor} />
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">{a.label}</p>
                <p className="text-xs text-slate-400">{a.desc}</p>
              </div>
              <ArrowRight
                size={16}
                className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>

);
};

================================================
FILE: src/modules/aluno/SecretariaAluno.tsx
================================================
import React from "react";
import {
Plus,
Download,
FileText,
Receipt,
CheckCircle2,
Clock,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { Button } from "../../core/ui/Button";
import { PageHeader } from "../../core/ui/PageHeader";
import { IconBubble } from "../../core/ui/IconBubble";
import { requerimentosMock, boletosMock } from "../../mocks/data";
import { cn } from "../../core/lib/utils";

const brl = (v: number) =>
v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Secao: React.FC<{
titulo: string;
icone: React.ElementType;
cor: "primary" | "emerald";
acao?: React.ReactNode;
children: React.ReactNode;
}> = ({ titulo, icone, cor, acao, children }) => (
<Card className="space-y-4">
<div className="flex items-center gap-3">
<IconBubble icone={icone} cor={cor} tamanho="sm" />
<h2 className="flex-1 text-lg font-extrabold text-ink">{titulo}</h2>
{acao}
</div>
<ul className="space-y-2 stagger">{children}</ul>
</Card>
);

const Item: React.FC<{ children: React.ReactNode }> = ({ children }) => (

  <li className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 hover:translate-x-1 transition-all">
    {children}
  </li>
);

export const SecretariaAluno: React.FC = () => {
const emAberto = boletosMock.filter((b) => b.status !== "Pago");
return (
<div className="space-y-6">
<PageHeader
        titulo="Secretaria"
        descricao="Documentos, requerimentos e financeiro."
      />

      {emAberto.length > 0 && (
        <div className="relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl bg-brand text-white shadow-glow animate-fade-up">
          <div className="absolute -right-10 -top-12 w-40 h-40 rounded-full bg-white/10" />
          <Receipt size={26} className="relative animate-float" />
          <div className="relative flex-1">
            <p className="text-sm font-bold">
              {emAberto.length} boleto{emAberto.length > 1 && "s"} em aberto
            </p>
            <p className="text-xs text-white/80 tabular">
              Total: {brl(emAberto.reduce((a, b) => a + b.valor, 0))}
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 items-start">
        <Secao
          titulo="Requerimentos"
          icone={FileText}
          cor="primary"
          acao={
            <Button size="sm" icon={<Plus size={14} />}>
              Novo
            </Button>
          }
        >
          {requerimentosMock.map((r) => {
            const ok = r.status === "Concluído";
            return (
              <Item key={r.id}>
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                    ok
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-amber-100 text-amber-600",
                  )}
                >
                  {ok ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <Clock size={17} className="animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {r.titulo}
                  </p>
                  <p className="text-xs text-slate-400 tabular">
                    #{r.protocolo} · {r.dataSolicitacao}
                  </p>
                </div>
                <Badge variant={ok ? "success" : "warning"}>{r.status}</Badge>
              </Item>
            );
          })}
        </Secao>

        <Secao titulo="Financeiro" icone={Receipt} cor="emerald">
          {boletosMock.map((b) => {
            const pago = b.status === "Pago";
            return (
              <Item key={b.id}>
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                    pago
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  {pago ? <CheckCircle2 size={17} /> : <Receipt size={17} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {b.referencia}
                  </p>
                  <p className="text-xs text-slate-400 tabular">
                    Vence {b.vencimento}
                  </p>
                </div>
                <span className="text-sm font-extrabold text-ink tabular">
                  {brl(b.valor)}
                </span>
                {pago ? (
                  <Badge variant="success">Pago</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Download size={14} />}
                  >
                    Boleto
                  </Button>
                )}
              </Item>
            );
          })}
        </Secao>
      </div>
    </div>

);
};

================================================
FILE: src/modules/aluno/useAlunoDados.ts
================================================
import { useMemo } from "react";
import { alunoLogadoMock } from "../../mocks/data";
import { useRegistros, aplicarRegistros } from "../../services/diarioStore";
import {
useJustificativas,
aplicarAbonos,
} from "../../services/justificativaStore";

/\*_ Aluno com frequência = mock + diário + abonos aprovados _/
export function useAlunoDados() {
const registros = useRegistros();
const justificativas = useJustificativas();

const aluno = useMemo(
() => ({
...alunoLogadoMock,
historicoFrequencia: aplicarAbonos(
aplicarRegistros(
alunoLogadoMock.historicoFrequencia,
registros,
alunoLogadoMock.id,
),
justificativas,
alunoLogadoMock.id,
),
}),
[registros, justificativas],
);

const historico = aluno.historicoFrequencia;
const frequenciaGlobal = historico.length
? historico.reduce((acc, h) => acc + h.percentualFrequencia, 0) /
historico.length
: 100;

return { aluno, historico, justificativas, frequenciaGlobal };
}

================================================
FILE: src/modules/assistente-pedagogico/AssistentePedagogicoModal.tsx
================================================
// src/modules/assistente-pedagogico/AssistentePedagogicoModal.tsx
import React, { useState } from "react";
import { Modal } from "../../core/ui/Modal";
import { Button } from "../../core/ui/Button";

interface Props {
isOpen: boolean;
onClose: () => void;
}

export const AssistentePedagogicoModal: React.FC<Props> = ({
isOpen,
onClose,
}) => {
const [query, setQuery] = useState("");
const [messages, setMessages] = useState([
{
role: "assistant",
content:
"Olá! Sou seu Assistente Pedagógico Alvora. Como posso ajudar em seus estudos hoje?",
},
]);

const handleSend = (e: React.FormEvent) => {
e.preventDefault();
if (!query.trim()) return;
setMessages((prev) => [...prev, { role: "user", content: query }]);
setQuery("");
setTimeout(() => {
setMessages((prev) => [
...prev,
{
role: "assistant",
content:
"Entendi sua dúvida! Recomendamos revisar a unidade de componentes reutilizáveis do curso.",
},
]);
}, 600);
};

return (
<Modal isOpen={isOpen} onClose={onClose} title="Assistente Pedagógico IA">
<div className="space-y-4">
<div className="space-y-3 max-h-60 overflow-y-auto pr-2">
{messages.map((m, idx) => (
<div
key={idx}
className={`p-3 rounded-2xl text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-white ml-auto max-w-[80%]"
                  : "bg-primary/10 text-slate-800 mr-auto max-w-[80%]"
              }`} >
{m.content}
</div>
))}
</div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite sua dúvida pedagógica..."
            className="flex-1 px-4 py-2 rounded-xl border border-primary/20 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 bg-primary-soft"
          />
          <Button type="submit" size="sm">
            Enviar
          </Button>
        </form>
      </div>
    </Modal>

);
};

================================================
FILE: src/modules/autenticacao/LoginPage.tsx
================================================
// src/modules/autenticacao/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
GraduationCap,
BookOpen,
BarChart3,
Mail,
Lock,
Eye,
EyeOff,
ArrowRight,
Loader2,
Sparkles,
TrendingUp,
CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "../../core/auth/useAuthStore";
import { Button } from "../../core/ui/Button";
import { cn } from "../../core/lib/utils";

type Role = "aluno" | "professor" | "gestor";

const ROLES: { id: Role; label: string; icone: typeof GraduationCap }[] = [
{ id: "aluno", label: "Aluno", icone: GraduationCap },
{ id: "professor", label: "Professor", icone: BookOpen },
{ id: "gestor", label: "Gestor", icone: BarChart3 },
];

const inputCls =
"w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-ink placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition";

export const LoginPage: React.FC = () => {
const [role, setRole] = useState<Role>("aluno");
const [email, setEmail] = useState("aluno@alvora.edu.br");
const [senha, setSenha] = useState("");
const [ver, setVer] = useState(false);
const [carregando, setCarregando] = useState(false);
const login = useAuthStore((s) => s.login);
const navigate = useNavigate();

const idx = ROLES.findIndex((r) => r.id === role);

const trocarRole = (r: Role) => {
setRole(r);
setEmail(`${r}@alvora.edu.br`);
};

const entrar = (e: React.SyntheticEvent) => {
e.preventDefault();
setCarregando(true);
setTimeout(() => {
login(role);
navigate(`/${role}`);
}, 600);
};

return (
<main className="grid min-h-screen w-full lg:grid-cols-2 bg-white">
{/_ ESQUERDA _/}
<aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-brand p-12 text-white">
{/_ bolhas de luz _/}
<div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-float" />
<div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-fuchsia-400/20 blur-3xl animate-float [animation-delay:1.5s]" />
<div
className="pointer-events-none absolute inset-0 opacity-[0.06]"
style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
/>

        <img
          src="/alvora_blue.svg"
          alt="Alvora"
          className="relative h-9 w-fit brightness-0 invert animate-fade-up"
        />

        <div className="relative space-y-8">
          <div className="max-w-md space-y-4 animate-fade-up">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur">
              <Sparkles size={13} /> Plataforma educacional
            </span>
            <h2 className="text-4xl font-extrabold leading-tight">
              Onde a escola inteira se encontra, da chamada ao boletim.
            </h2>
          </div>

          {/* cards flutuantes */}
          <div className="flex gap-4 stagger">
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur border border-white/20 animate-float">
              <TrendingUp size={18} className="mb-2" />
              <p className="text-2xl font-extrabold tabular">92%</p>
              <p className="text-[11px] text-white/70">Frequência média</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur border border-white/20 animate-float [animation-delay:0.8s] mt-6">
              <CheckCircle2 size={18} className="mb-2" />
              <p className="text-2xl font-extrabold tabular">1.2k</p>
              <p className="text-[11px] text-white/70">Chamadas no mês</p>
            </div>
          </div>
        </div>

        <p className="relative text-sm text-white/50">
          © {new Date().getFullYear()} Alvora
        </p>
      </aside>

      {/* DIREITA */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm stagger">
          <img
            src="/alvora_blue.svg"
            alt="Alvora"
            className="mb-10 h-8 lg:hidden"
          />

          <div className="animate-fade-up">
            <h1 className="text-3xl font-extrabold text-ink">
              Bem-vindo de volta 👋
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Entre com seu e-mail institucional para continuar.
            </p>
          </div>

          <form onSubmit={entrar} className="mt-8 space-y-5 animate-fade-up">
            {/* seletor de perfil */}
            <div>
              <span className="mb-2 block text-sm font-semibold text-ink">
                Entrar como
              </span>
              <div className="relative grid grid-cols-3 p-1 rounded-2xl bg-slate-100">
                <div
                  className="absolute top-1 bottom-1 left-1 rounded-xl bg-brand shadow-glow transition-transform duration-300 ease-out"
                  style={{
                    width: "calc((100% - 0.5rem) / 3)",
                    transform: `translateX(${idx * 100}%)`,
                  }}
                />
                {ROLES.map(({ id, label, icone: I }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => trocarRole(id)}
                    className={cn(
                      "relative z-10 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-colors",
                      role === id
                        ? "text-white"
                        : "text-slate-500 hover:text-primary",
                    )}
                  >
                    <I
                      size={18}
                      className={cn(
                        "transition-transform",
                        role === id && "scale-110",
                      )}
                    />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* e-mail */}
            <label className="block text-sm font-semibold text-ink">
              E-mail institucional
              <div className="relative mt-1.5">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@escola.edu.br"
                  className={inputCls}
                />
              </div>
            </label>

            {/* senha */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="senha"
                  className="text-sm font-semibold text-ink"
                >
                  Senha
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Esqueceu?
                </a>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="senha"
                  type={ver ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className={cn(inputCls, "pr-11")}
                />
                <button
                  type="button"
                  onClick={() => setVer((v) => !v)}
                  aria-label={ver ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition"
                >
                  {ver ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded accent-primary"
              />
              Manter conectado
            </label>

            <Button
              type="submit"
              size="lg"
              disabled={carregando}
              className="w-full group"
              icon={
                carregando ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : undefined
              }
            >
              {carregando ? (
                "Entrando…"
              ) : (
                <span className="flex items-center gap-2">
                  Entrar como {ROLES[idx].label}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-10 text-xs text-slate-400 animate-fade-up">
            <a href="#" className="hover:text-primary transition">
              Privacidade
            </a>{" "}
            ·{" "}
            <a href="#" className="hover:text-primary transition">
              Suporte
            </a>
          </p>
        </div>
      </section>
    </main>

);
};

================================================
FILE: src/modules/calendario/CalendarioModal.tsx
================================================
// src/modules/calendario/CalendarioModal.tsx
import React, { useMemo, useState } from "react";
import {
ChevronLeft,
ChevronRight,
CalendarDays,
CalendarCheck,
Plus,
Trash2,
Pencil,
Check,
X,
} from "lucide-react";
import { Modal } from "../../core/ui/Modal";
import { cn } from "../../core/lib/utils";
import {
useEventos,
eventoStore,
type Evento,
type TipoEvento,
} from "../../services/eventoStore";

interface Props {
isOpen: boolean;
onClose: () => void;
podeEditar?: boolean; // true para professor/gestor
autorId?: string;
}

type Rascunho = { titulo: string; tipo: TipoEvento; data: string };

const TIPOS: Record<TipoEvento, { label: string; ponto: string; cls: string }> =
{
entrega: {
label: "Entrega",
ponto: "bg-primary",
cls: "bg-primary/10 text-primary",
},
avaliacao: {
label: "Avaliação",
ponto: "bg-rose-500",
cls: "bg-rose-50 text-rose-600",
},
feriado: {
label: "Feriado",
ponto: "bg-emerald-500",
cls: "bg-emerald-50 text-emerald-600",
},
evento: {
label: "Evento",
ponto: "bg-amber-500",
cls: "bg-amber-50 text-amber-600",
},
};

const MESES = [
"Janeiro",
"Fevereiro",
"Março",
"Abril",
"Maio",
"Junho",
"Julho",
"Agosto",
"Setembro",
"Outubro",
"Novembro",
"Dezembro",
];
const SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

const chave = (a: number, m: number, d: number) =>
`${a}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const inputCls =
"h-9 px-3 rounded-full border border-slate-200 bg-white text-xs text-ink focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition";

const iconBtn =
"w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 transition";

export const CalendarioModal: React.FC<Props> = ({
isOpen,
onClose,
podeEditar = false,
autorId = "anon",
}) => {
const eventos = useEventos();
const hoje = new Date();
const hojeKey = chave(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

const [ref, setRef] = useState({
ano: hoje.getFullYear(),
mes: hoje.getMonth(),
});
const [sel, setSel] = useState<string | null>(null);
const [titulo, setTitulo] = useState("");
const [tipo, setTipo] = useState<TipoEvento>("evento");
const [editId, setEditId] = useState<string | null>(null);
const [rascunho, setRascunho] = useState<Rascunho>({
titulo: "",
tipo: "evento",
data: "",
});

const porDia = useMemo(() => {
const m = new Map<string, Evento[]>();
eventos.forEach((e) => m.set(e.data, [...(m.get(e.data) ?? []), e]));
return m;
}, [eventos]);

const celulas = useMemo(() => {
const inicio = new Date(ref.ano, ref.mes, 1).getDay();
const total = new Date(ref.ano, ref.mes + 1, 0).getDate();
return [
...Array<null>(inicio).fill(null),
...Array.from({ length: total }, (_, i) => i + 1),
];
}, [ref]);

const mudarMes = (delta: number) => {
setSel(null);
setEditId(null);
setRef(({ ano, mes }) => {
const d = new Date(ano, mes + delta, 1);
return { ano: d.getFullYear(), mes: d.getMonth() };
});
};

const irHoje = () => {
setRef({ ano: hoje.getFullYear(), mes: hoje.getMonth() });
setSel(hojeKey);
};

const prefixoMes = chave(ref.ano, ref.mes, 1).slice(0, 7);
const lista = (
sel
? (porDia.get(sel) ?? [])
: eventos.filter((e) => e.data.startsWith(prefixoMes))
)
.slice()
.sort((a, b) => a.data.localeCompare(b.data));

const adicionar = (ev: React.SyntheticEvent) => {
ev.preventDefault();
if (!sel || !titulo.trim()) return;
eventoStore.adicionar({
data: sel,
titulo: titulo.trim(),
tipo,
criadoPor: autorId,
});
setTitulo("");
};

const iniciarEdicao = (e: Evento) => {
setEditId(e.id);
setRascunho({ titulo: e.titulo, tipo: e.tipo, data: e.data });
};

const salvarEdicao = (ev: React.SyntheticEvent) => {
ev.preventDefault();
if (!editId || !rascunho.titulo.trim() || !rascunho.data) return;
eventoStore.atualizar(editId, {
...rascunho,
titulo: rascunho.titulo.trim(),
});
setEditId(null);
// se mudou a data, acompanha o evento no calendário
if (sel && rascunho.data !== sel) {
const [a, m] = rascunho.data.split("-").map(Number);
setRef({ ano: a, mes: m - 1 });
setSel(rascunho.data);
}
};

return (
<Modal isOpen={isOpen} onClose={onClose} title="Calendário Acadêmico">
<div className="space-y-5">
{/_ cabeçalho _/}
<div className="flex items-center gap-2">
<button
onClick={() => mudarMes(-1)}
aria-label="Mês anterior"
className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-primary/10 hover:text-primary transition" >
<ChevronLeft size={18} />
</button>
<h3
            key={prefixoMes}
            className="flex-1 text-center text-lg font-extrabold text-ink animate-fade-in"
          >
{MESES[ref.mes]}{" "}
<span className="text-slate-400 font-semibold">{ref.ano}</span>
</h3>
<button
onClick={() => mudarMes(1)}
aria-label="Próximo mês"
className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-primary/10 hover:text-primary transition" >
<ChevronRight size={18} />
</button>
<button
            onClick={irHoje}
            className="px-3 h-9 rounded-full text-xs font-bold bg-brand text-white shadow-glow hover:scale-105 transition"
          >
Hoje
</button>
</div>

        {/* grade */}
        <div>
          <div className="grid grid-cols-7 mb-1">
            {SEMANA.map((d, i) => (
              <span
                key={i}
                className="text-center text-[11px] font-bold text-slate-400"
              >
                {d}
              </span>
            ))}
          </div>
          <div
            key={prefixoMes}
            className="grid grid-cols-7 gap-1 animate-fade-in"
          >
            {celulas.map((dia, i) => {
              if (!dia) return <span key={i} />;
              const k = chave(ref.ano, ref.mes, dia);
              const evs = porDia.get(k) ?? [];
              const ehHoje = k === hojeKey;
              const ativo = k === sel;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setSel(ativo ? null : k);
                    setEditId(null);
                  }}
                  className={cn(
                    "relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-semibold tabular transition-all",
                    ativo
                      ? "bg-brand text-white shadow-glow scale-105"
                      : ehHoje
                        ? "ring-2 ring-primary text-primary"
                        : "text-ink hover:bg-primary/5",
                  )}
                >
                  {dia}
                  {evs.length > 0 && (
                    <span className="absolute bottom-1.5 flex gap-0.5">
                      {evs.slice(0, 3).map((e) => (
                        <span
                          key={e.id}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            ativo ? "bg-white" : TIPOS[e.tipo].ponto,
                          )}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* legenda */}
        <div className="flex flex-wrap gap-3 text-[11px] text-slate-500">
          {Object.values(TIPOS).map((t) => (
            <span key={t.label} className="flex items-center gap-1.5">
              <span className={cn("w-2 h-2 rounded-full", t.ponto)} /> {t.label}
            </span>
          ))}
        </div>

        {/* eventos */}
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-extrabold text-ink">
            <CalendarDays size={14} className="text-primary" />
            {sel
              ? new Date(`${sel}T12:00`).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                })
              : "Neste mês"}
          </p>
          {lista.length === 0 ? (
            <p className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-700 animate-pop">
              <CalendarCheck size={14} /> Dia livre, só alegria! 🌴
            </p>
          ) : (
            <div key={sel ?? prefixoMes} className="space-y-2 stagger">
              {lista.map((e) =>
                editId === e.id ? (
                  /* modo edição */
                  <form
                    key={e.id}
                    onSubmit={salvarEdicao}
                    className="flex flex-col sm:flex-row gap-2 p-3 rounded-xl bg-primary/5 ring-2 ring-primary/20 animate-pop"
                  >
                    <input
                      autoFocus
                      value={rascunho.titulo}
                      onChange={(ev) =>
                        setRascunho((r) => ({ ...r, titulo: ev.target.value }))
                      }
                      onKeyDown={(ev) => ev.key === "Escape" && setEditId(null)}
                      className={cn(inputCls, "flex-1")}
                    />
                    <input
                      type="date"
                      value={rascunho.data}
                      onChange={(ev) =>
                        setRascunho((r) => ({ ...r, data: ev.target.value }))
                      }
                      className={inputCls}
                    />
                    <select
                      value={rascunho.tipo}
                      onChange={(ev) =>
                        setRascunho((r) => ({
                          ...r,
                          tipo: ev.target.value as TipoEvento,
                        }))
                      }
                      className={cn(inputCls, "font-semibold")}
                    >
                      {(Object.keys(TIPOS) as TipoEvento[]).map((t) => (
                        <option key={t} value={t}>
                          {TIPOS[t].label}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-1 justify-end">
                      <button
                        type="submit"
                        aria-label="Salvar"
                        disabled={!rascunho.titulo.trim()}
                        className={cn(
                          iconBtn,
                          "w-9 h-9 bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50",
                        )}
                      >
                        <Check size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label="Cancelar"
                        onClick={() => setEditId(null)}
                        className={cn(
                          iconBtn,
                          "w-9 h-9 bg-white hover:text-ink",
                        )}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </form>
                ) : (
                  /* modo leitura */
                  <div
                    key={e.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 transition-colors"
                  >
                    <span className="w-10 text-center text-lg font-extrabold text-ink tabular">
                      {e.data.slice(8)}
                    </span>
                    <p className="flex-1 text-xs font-semibold text-ink">
                      {e.titulo}
                    </p>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        TIPOS[e.tipo].cls,
                      )}
                    >
                      {TIPOS[e.tipo].label}
                    </span>
                    {podeEditar && (
                      <>
                        <button
                          onClick={() => iniciarEdicao(e)}
                          aria-label="Editar evento"
                          className={cn(
                            iconBtn,
                            "hover:text-primary hover:bg-primary/10",
                          )}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => eventoStore.remover(e.id)}
                          aria-label="Remover evento"
                          className={cn(
                            iconBtn,
                            "hover:text-rose-600 hover:bg-rose-50",
                          )}
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        {/* novo evento */}
        {podeEditar && sel && !editId && (
          <form
            onSubmit={adicionar}
            className="flex flex-col sm:flex-row gap-2 p-3 rounded-2xl bg-primary/5 animate-fade-up"
          >
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Novo evento neste dia..."
              className={cn(inputCls, "flex-1")}
            />
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoEvento)}
              className={cn(inputCls, "font-semibold")}
            >
              {(Object.keys(TIPOS) as TipoEvento[]).map((t) => (
                <option key={t} value={t}>
                  {TIPOS[t].label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!titulo.trim()}
              className="flex items-center justify-center gap-1 px-4 h-9 rounded-full bg-brand text-white text-xs font-bold shadow-glow hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition"
            >
              <Plus size={14} /> Adicionar
            </button>
          </form>
        )}
      </div>
    </Modal>

);
};

================================================
FILE: src/modules/central-duvidas/CentralDuvidasDrawer.tsx
================================================
// src/modules/central-duvidas/CentralDuvidasDrawer.tsx
import React from "react";
import { Button } from "../../core/ui/Button";

interface Props {
isOpen: boolean;
onClose: () => void;
}

export const CentralDuvidasDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex justify-end bg-[#0F172A]/30 backdrop-blur-xs">
<div className="w-full max-w-md bg-white h-full shadow-flat p-6 flex flex-col justify-between">
<div>
<div className="flex justify-between items-center pb-4 border-b border-primary/10">
<h3 className="font-bold text-slate-900">Central de Dúvidas</h3>
<button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
✕
</button>
</div>
<div className="mt-4 space-y-3">
<div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
<p className="text-xs font-bold text-primary">Dúvida #1042</p>
<p className="text-xs text-slate-700 mt-1">
Como enviar o projeto final de React com TypeScript?
</p>
</div>
</div>
</div>
<Button onClick={onClose} className="w-full">
Fechar
</Button>
</div>
</div>
);
};

================================================
FILE: src/modules/gestor/AdminUsuarios.tsx
================================================
import { useState } from "react";
import type { ChangeEvent, FormEvent, CSSProperties } from "react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

type Papel = "aluno" | "professor" | "gestor";
type Form = { email: string; senha: string; papel: Papel };
type Msg = { tipo: "ok" | "erro"; texto: string } | null;

const FORM_INICIAL: Form = { email: "", senha: "", papel: "aluno" };

export function AdminUsuarios() {
const [form, setForm] = useState<Form>(FORM_INICIAL);
const [enviando, setEnviando] = useState(false);
const [msg, setMsg] = useState<Msg>(null);

const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
setForm({ ...form, [e.target.name]: e.target.value } as Form);

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
e.preventDefault();
setMsg(null);

    if (form.senha.length < 6) {
      setMsg({
        tipo: "erro",
        texto: "A senha precisa ter no mínimo 6 caracteres.",
      });
      return;
    }

    setEnviando(true);
    const { data, error } = await supabase.functions.invoke("criar-usuario", {
      body: {
        email: form.email.trim().toLowerCase(),
        senha: form.senha,
        papel: form.papel,
      },
    });
    setEnviando(false);

    if (error || data?.erro) {
      let texto: string = data?.erro || error?.message || "Erro desconhecido";

      if (error instanceof FunctionsHttpError) {
        try {
          const corpo = await error.context.json();
          if (corpo?.erro) texto = corpo.erro;
        } catch {
          /* resposta sem JSON */
        }
      }

      setMsg({ tipo: "erro", texto });
      return;
    }

    setMsg({
      tipo: "ok",
      texto: `✅ ${form.papel} ${form.email} criado com sucesso!`,
    });
    setForm(FORM_INICIAL);

};

return (
<div style={s.container}>
<h2>👑 Cadastrar usuário</h2>

      <form onSubmit={handleSubmit} style={s.form}>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          style={s.input}
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          value={form.senha}
          onChange={handleChange}
          style={s.input}
        />

        <label htmlFor="papel">Papel</label>
        <select
          id="papel"
          name="papel"
          value={form.papel}
          onChange={handleChange}
          style={s.input}
        >
          <option value="aluno">Aluno</option>
          <option value="professor">Professor</option>
          <option value="gestor">Gestor</option>
        </select>

        <button type="submit" disabled={enviando} style={s.button}>
          {enviando ? "Criando..." : "Criar usuário"}
        </button>
      </form>

      {msg && (
        <p
          style={{
            ...s.msg,
            background: msg.tipo === "ok" ? "#d1fae5" : "#fee2e2",
          }}
        >
          {msg.texto}
        </p>
      )}
    </div>

);
}

const s: Record<string, CSSProperties> = {
container: {
maxWidth: 420,
margin: "40px auto",
padding: 24,
borderRadius: 12,
boxShadow: "0 2px 12px rgba(0,0,0,.1)",
fontFamily: "sans-serif",
},
form: { display: "flex", flexDirection: "column", gap: 8 },
input: { padding: 10, borderRadius: 8, border: "1px solid #ccc" },
button: {
marginTop: 12,
padding: 12,
borderRadius: 8,
border: "none",
background: "#4f46e5",
color: "#fff",
fontWeight: "bold",
cursor: "pointer",
},
msg: { marginTop: 16, padding: 12, borderRadius: 8 },
};

================================================
FILE: src/modules/gestor/constantes.ts
================================================
import type { MotivoAlerta } from "../../services/radarRisco";
import type { StatusJustificativa } from "../../services/justificativaStore";
import { LIMITE_FALTAS_PCT } from "../../services/frequenciaTurma";

export const GESTOR_ID = "gestor";
export const FREQ_MINIMA = 100 - LIMITE_FALTAS_PCT;

export type Filtro = "TODOS" | MotivoAlerta;
export const FILTROS: Filtro[] = ["TODOS", "FALTAS", "NOTA", "AMBOS"];

export const SELO_MOTIVO: Record<
MotivoAlerta,
{ cls: string; label: string; borda: string }

> = {
> FALTAS: {

    cls: "text-rose-600 bg-rose-500/10",
    label: "Faltas",
    borda: "border-rose-400",

},
NOTA: {
cls: "text-amber-600 bg-amber-500/10",
label: "Nota",
borda: "border-amber-400",
},
AMBOS: {
cls: "text-white bg-gradient-to-r from-rose-500 to-rose-600",
label: "Faltas + Nota",
borda: "border-rose-600",
},
};

export const SELO_JUST: Record<
Exclude<StatusJustificativa, "pendente">,
{ variant: "success" | "danger"; label: string; ponto: string }

> = {
> aprovada: {

    variant: "success",
    label: "✓ Aprovada",
    ponto: "bg-emerald-500",

},
recusada: { variant: "danger", label: "✕ Recusada", ponto: "bg-rose-500" },
};

export const fmt = (ms: number) =>
new Date(ms).toLocaleString("pt-BR", {
dateStyle: "short",
timeStyle: "short",
});
export const fmtData = (iso: string) =>
new Date(iso + "T12:00").toLocaleDateString("pt-BR");
export const pad = (n: number) => n.toString().padStart(2, "0");
export const iniciais = (nome: string) =>
nome
.split(" ")
.filter(Boolean)
.map((p) => p[0])
.slice(0, 2)
.join("")
.toUpperCase();

================================================
FILE: src/modules/gestor/CriarUsuario.tsx
================================================
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function CriarUsuario() {
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");
const [role, setRole] = useState("aluno");
const [mensagem, setMensagem] = useState("");
const [carregando, setCarregando] = useState(false);

async function criar() {
setCarregando(true);
setMensagem("");

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setMensagem("❌ Faça login como gestor primeiro.");
      setCarregando(false);
      return;
    }

    const { error } = await supabase.functions.invoke("criar-usuario", {
      body: { nome, email, senha, role },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (error) {
      const detalhe = await error.context?.json?.().catch(() => null);
      setMensagem(`❌ Erro: ${detalhe?.error ?? error.message}`);
    } else {
      setMensagem("✅ Usuário criado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
    }
    setCarregando(false);

}

return (
<div>
<h3>Criar usuário</h3>
<input
placeholder="Nome"
value={nome}
onChange={(e) => setNome(e.target.value)}
/>
<input
placeholder="E-mail"
value={email}
onChange={(e) => setEmail(e.target.value)}
/>
<input
type="password"
placeholder="Senha"
value={senha}
onChange={(e) => setSenha(e.target.value)}
/>
<select value={role} onChange={(e) => setRole(e.target.value)}>
<option value="aluno">Aluno</option>
<option value="professor">Professor</option>
<option value="gestor">Gestor</option>
</select>
<button onClick={criar} disabled={carregando}>
{carregando ? "Criando..." : "Criar"}
</button>
{mensagem && <p>{mensagem}</p>}
</div>
);
}

================================================
FILE: src/modules/gestor/JustificativasGestor.tsx
================================================
import React, { useMemo, useState } from "react";
import {
FileCheck2,
Paperclip,
Check,
X,
Quote,
CalendarX,
Clock,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";
import {
useJustificativas,
justificativaStore,
} from "../../services/justificativaStore";
import { cn } from "../../core/lib/utils";
import {
GESTOR_ID,
SELO_JUST,
fmt,
fmtData,
iniciais,
pad,
} from "./constantes";
import { ModalTexto } from "./ModalTexto";

export const JustificativasGestor: React.FC = () => {
const justificativas = useJustificativas();
const [recusando, setRecusando] = useState<string | null>(null);

const pendentes = useMemo(
() =>
justificativas
.filter((j) => j.status === "pendente")
.sort((a, b) => a.criadaEm - b.criadaEm),
[justificativas],
);
const decididas = useMemo(
() =>
justificativas
.filter((j) => j.status !== "pendente")
.sort((a, b) => (b.decididaEm ?? 0) - (a.decididaEm ?? 0))
.slice(0, 5),
[justificativas],
);

return (
<div className="space-y-6">
<Card className="space-y-5">
<div className="flex flex-wrap items-center gap-4">
<IconBubble icone={FileCheck2} cor="amber" />
<div className="flex-1 min-w-0">
<h3 className="text-lg font-extrabold text-ink">
Justificativas de falta
</h3>
<p className="text-xs text-slate-400">
Aprovadas abonam a falta no extrato do aluno automaticamente.
</p>
</div>
<Badge variant={pendentes.length ? "warning" : "success"}>
{pad(pendentes.length)} pendente(s)
</Badge>
</div>

        {pendentes.length === 0 ? (
          <div className="p-8 rounded-2xl bg-emerald-50 text-center space-y-1 animate-pop">
            <p className="text-4xl animate-float">☕</p>
            <p className="text-sm font-bold text-emerald-700">
              Caixa zerada! Hora do cafezinho
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger">
            {pendentes.map((j) => (
              <div
                key={j.id}
                className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {iniciais(j.alunoNome)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink truncate">
                      {j.alunoNome}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {j.disciplinaNome}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-medium tabular">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
                    <CalendarX size={11} /> Falta {fmtData(j.dataFalta)}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-slate-500">
                    <Clock size={11} /> {fmt(j.criadaEm)}
                  </span>
                </div>
                <p className="flex gap-2 text-xs text-slate-600 p-3 rounded-xl bg-white">
                  <Quote size={12} className="shrink-0 mt-0.5 text-primary" />{" "}
                  {j.motivo}
                </p>
                {j.anexoNome && (
                  <p className="text-[11px] font-medium text-primary flex items-center gap-1">
                    <Paperclip size={12} /> {j.anexoNome}
                  </p>
                )}
                <div className="flex gap-2 mt-auto">
                  <Button
                    size="sm"
                    className="flex-1"
                    icon={<Check size={14} />}
                    onClick={() =>
                      justificativaStore.decidir(j.id, "aprovada", GESTOR_ID)
                    }
                  >
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-1"
                    icon={<X size={14} />}
                    onClick={() => setRecusando(j.id)}
                  >
                    Recusar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {decididas.length > 0 && (
        <Card className="space-y-4">
          <h4 className="text-sm font-extrabold text-ink">
            Decididas recentemente
          </h4>
          <ol className="relative ml-2 border-l-2 border-primary/10 space-y-3 stagger">
            {decididas.map((j) => {
              const selo = SELO_JUST[j.status as "aprovada" | "recusada"];
              return (
                <li key={j.id} className="relative pl-6">
                  <span
                    className={cn(
                      "absolute -left-1.75 top-3 w-3 h-3 rounded-full ring-4 ring-white",
                      selo.ponto,
                    )}
                  />
                  <div className="flex justify-between items-start gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="min-w-0 text-xs">
                      <p className="font-bold text-ink">
                        {j.alunoNome}{" "}
                        <span className="font-normal text-slate-400">
                          · {j.disciplinaNome} · {fmtData(j.dataFalta)}
                        </span>
                      </p>
                      {j.parecer && (
                        <p className="text-slate-500 mt-0.5">{j.parecer}</p>
                      )}
                    </div>
                    <Badge variant={selo.variant}>{selo.label}</Badge>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
      )}

      <ModalTexto
        aberto={!!recusando}
        titulo="Recusar justificativa"
        rotulo="Motivo da recusa (o aluno verá)"
        placeholder="Ex.: comprovante ilegível"
        confirmar="Recusar"
        perigo
        onFechar={() => setRecusando(null)}
        onConfirmar={(t) =>
          recusando &&
          justificativaStore.decidir(recusando, "recusada", GESTOR_ID, t)
        }
      />
    </div>

);
};

================================================
FILE: src/modules/gestor/ModalTexto.tsx
================================================
import React, { useState } from "react";
import { Modal } from "../../core/ui/Modal";
import { Button } from "../../core/ui/Button";

type Props = {
aberto: boolean;
titulo: string;
rotulo: string;
placeholder?: string;
confirmar: string;
perigo?: boolean;
onConfirmar: (texto: string) => void;
onFechar: () => void;
};

type FormProps = Omit<Props, "aberto" | "titulo">;

// Montado só quando o modal abre → estado nasce vazio, sem effect
const Formulario: React.FC<FormProps> = ({
rotulo,
placeholder,
confirmar,
perigo,
onConfirmar,
onFechar,
}) => {
const [texto, setTexto] = useState("");

const enviar = (e: React.SyntheticEvent) => {
e.preventDefault();
const t = texto.trim();
if (!t) return;
onConfirmar(t);
onFechar();
};

return (
<form onSubmit={enviar} className="space-y-4">
<label className="block text-sm font-semibold text-ink">
{rotulo}
<textarea
autoFocus
rows={3}
value={texto}
placeholder={placeholder}
onChange={(e) => setTexto(e.target.value)}
className="mt-1.5 w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 resize-none focus:bg-white focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition"
/>
</label>
<div className="flex gap-3">
<Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onFechar}
        >
Cancelar
</Button>
<Button
type="submit"
variant={perigo ? "danger" : "primary"}
className="w-full"
disabled={!texto.trim()} >
{confirmar}
</Button>
</div>
</form>
);
};

export const ModalTexto: React.FC<Props> = ({ aberto, titulo, ...resto }) => (
<Modal isOpen={aberto} onClose={resto.onFechar} title={titulo}>
{aberto && <Formulario {...resto} />}
</Modal>
);

================================================
FILE: src/modules/gestor/PortalGestor.tsx
================================================
import React, { useState } from "react";
import {
Users,
Activity,
AlertTriangle,
BellOff,
FileClock,
Radar,
FileCheck2,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { PageHeader } from "../../core/ui/PageHeader";
import { IconBubble } from "../../core/ui/IconBubble";
import { useAlertas } from "../../services/radarRisco";
import { useFrequenciaTurma } from "../../services/frequenciaTurma";
import { useJustificativas } from "../../services/justificativaStore";
import { cn } from "../../core/lib/utils";
import { FREQ_MINIMA, pad } from "./constantes";
import { RadarGestor } from "./RadarGestor";
import { JustificativasGestor } from "./JustificativasGestor";

type Aba = "radar" | "justificativas";

export const PortalGestor: React.FC = () => {
const alertas = useAlertas();
const justificativas = useJustificativas();
const { alunos, mediaFrequencia } = useFrequenciaTurma();
const [aba, setAba] = useState<Aba>("radar");

const semNotif = alertas.filter((a) => !a.notificado.aluno).length;
const justPend = justificativas.filter((j) => j.status === "pendente").length;
const dentroMeta = mediaFrequencia >= FREQ_MINIMA;

const kpis = [
{
label: "Alunos monitorados",
valor: alunos.length,
sub: "Em acompanhamento",
icone: Users,
cor: "primary",
},
{
label: "Frequência média",
valor: `${mediaFrequencia}%`,
sub: `Meta: ${FREQ_MINIMA}%`,
icone: Activity,
cor: dentroMeta ? "emerald" : "rose",
},
{
label: "Alertas ativos",
valor: pad(alertas.length),
sub: "Faltas ou nota baixa",
icone: AlertTriangle,
cor: alertas.length ? "rose" : "emerald",
},
{
label: "Sem notificação",
valor: pad(semNotif),
sub: semNotif ? "Aguardando ação" : "Tudo tratado ✓",
icone: BellOff,
cor: semNotif ? "amber" : "emerald",
},
{
label: "Justificativas",
valor: pad(justPend),
sub: justPend ? "Em análise" : "Caixa zerada ☕",
icone: FileClock,
cor: justPend ? "amber" : "emerald",
},
] as const;

const abas = [
{
id: "radar" as const,
label: "Radar de risco",
icone: Radar,
qtd: alertas.length,
},
{
id: "justificativas" as const,
label: "Justificativas",
icone: FileCheck2,
qtd: justPend,
},
];

return (
<div className="space-y-6">
<PageHeader
        titulo="Painel de Gestão"
        descricao="Assiduidade e risco pedagógico em tempo real 📊"
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 stagger">
        {kpis.map((k) => (
          <Card key={k.label} hoverable className="space-y-3">
            <IconBubble icone={k.icone} cor={k.cor} tamanho="sm" />
            <div>
              <p className="text-xs font-medium text-slate-400">{k.label}</p>
              <p className="text-2xl font-extrabold text-ink tabular">
                {k.valor}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{k.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <nav className="flex gap-1.5 p-1.5 rounded-2xl bg-white shadow-flat overflow-x-auto">
        {abas.map(({ id, label, icone: I, qtd }) => (
          <button
            key={id}
            onClick={() => setAba(id)}
            className={cn(
              "flex items-center gap-2 px-4 h-10 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
              aba === id
                ? "bg-brand text-white shadow-glow"
                : "text-slate-500 hover:bg-primary/5 hover:text-primary",
            )}
          >
            <I size={15} /> {label}
            {qtd > 0 && (
              <span
                className={cn(
                  "min-w-5 h-5 px-1.5 rounded-full text-[10px] flex items-center justify-center tabular",
                  aba === id ? "bg-white/25" : "bg-rose-500 text-white",
                )}
              >
                {qtd}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div key={aba} className="animate-fade-up">
        {aba === "radar" ? <RadarGestor /> : <JustificativasGestor />}
      </div>
    </div>

);
};

================================================
FILE: src/modules/gestor/RadarGestor.tsx
================================================
import React, { useMemo, useState } from "react";
import {
Radar,
Search,
Bell,
BellRing,
Handshake,
History,
FileDown,
ChevronDown,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";
import { useAlertas, alertaStore } from "../../services/radarRisco";
import { useFrequenciaTurma } from "../../services/frequenciaTurma";
import { cn } from "../../core/lib/utils";
import {
FILTROS,
FREQ_MINIMA,
GESTOR_ID,
SELO_MOTIVO,
fmt,
iniciais,
type Filtro,
} from "./constantes";
import { ModalTexto } from "./ModalTexto";

export const RadarGestor: React.FC = () => {
const alertas = useAlertas();
const { alunos } = useFrequenciaTurma();
const [filtro, setFiltro] = useState<Filtro>("TODOS");
const [busca, setBusca] = useState("");
const [aberto, setAberto] = useState<string | null>(null);
const [intervindo, setIntervindo] = useState<string | null>(null);

const porId = useMemo(() => new Map(alunos.map((a) => [a.id, a])), [alunos]);

const lista = useMemo(() => {
const termo = busca.trim().toLowerCase();
return alertas
.filter((a) => filtro === "TODOS" || a.motivo === filtro)
.map((al) => ({ al, aluno: porId.get(al.alunoId) }))
.filter(({ al, aluno }) =>
(aluno?.nome ?? al.alunoId).toLowerCase().includes(termo),
)
.sort(
(x, y) =>
(x.aluno?.percentualFrequencia ?? 100) -
(y.aluno?.percentualFrequencia ?? 100),
);
}, [alertas, filtro, busca, porId]);

const contar = (f: Filtro) =>
f === "TODOS"
? alertas.length
: alertas.filter((a) => a.motivo === f).length;

return (
<Card className="space-y-5">
<div className="flex flex-wrap items-center gap-4">
<IconBubble icone={Radar} cor="violet" />
<div className="flex-1 min-w-0">
<h3 className="text-lg font-extrabold text-ink">
Radar de risco pedagógico
</h3>
<p className="text-xs text-slate-400">
Gerado automaticamente a partir do diário e das notas.
</p>
</div>
<Button
variant="secondary"
icon={<FileDown size={15} />}
onClick={() => window.print()} >
Exportar PDF
</Button>
</div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={cn(
              "px-3.5 h-9 rounded-full text-xs font-semibold transition-all",
              filtro === f
                ? "bg-brand text-white shadow-glow"
                : "bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary",
            )}
          >
            {f === "TODOS" ? "Todos" : SELO_MOTIVO[f].label}{" "}
            <span className="opacity-70 tabular">({contar(f)})</span>
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-56">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar aluno..."
            className="w-full h-9 pl-9 pr-3 rounded-full border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition"
          />
        </div>
      </div>

      {lista.length === 0 && (
        <p className="text-sm font-bold text-emerald-600 bg-emerald-50 p-4 rounded-xl text-center animate-pop">
          🎉 Nenhum alerta por aqui. Instituição no azul!
        </p>
      )}

      <div className="space-y-3 stagger">
        {lista.map(({ al, aluno }) => {
          const selo = SELO_MOTIVO[al.motivo];
          const expandido = aberto === al.id;
          return (
            <div
              key={al.id}
              className={cn(
                "p-4 rounded-2xl bg-slate-50 border-l-4 space-y-3 hover:bg-primary/5 transition-colors",
                selo.borda,
              )}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {iniciais(aluno?.nome ?? al.alunoId)}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-ink">
                        {aluno?.nome ?? al.alunoId}
                      </p>
                      {aluno && (
                        <span className="text-[11px] text-slate-400 tabular">
                          {aluno.matricula}
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          selo.cls,
                        )}
                      >
                        {selo.label}
                      </span>
                      {al.notificado.aluno && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-600 bg-emerald-500/10">
                          ✓ notificado
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Turma {al.turmaId} · aberto em {fmt(al.criadoEm)}
                    </p>
                  </div>
                </div>

                {aluno && (
                  <div className="lg:w-48 space-y-1">
                    <div className="flex justify-between text-[11px] tabular">
                      <span className="text-slate-400">
                        {aluno.faltas}/{aluno.totalAulas} faltas
                      </span>
                      <b
                        className={aluno.emRisco ? "text-rose-600" : "text-ink"}
                      >
                        {aluno.percentualFrequencia}%
                      </b>
                    </div>
                    <div className="relative h-2 rounded-full bg-slate-200/70">
                      <div
                        className={cn(
                          "h-full rounded-full animate-grow",
                          aluno.emRisco
                            ? "bg-linear-to-r from-rose-400 to-rose-500"
                            : "bg-brand",
                        )}
                        style={{ width: `${aluno.percentualFrequencia}%` }}
                      />
                      <div
                        className="absolute -top-0.5 h-3 w-0.5 rounded bg-ink/40"
                        style={{ left: `${FREQ_MINIMA}%` }}
                        title={`Meta ${FREQ_MINIMA}%`}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={al.notificado.aluno}
                    icon={
                      al.notificado.aluno ? (
                        <BellRing size={14} />
                      ) : (
                        <Bell size={14} />
                      )
                    }
                    onClick={() => alertaStore.notificar(al.id, GESTOR_ID)}
                  >
                    {al.notificado.aluno ? "Notificado" : "Notificar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<Handshake size={14} />}
                    onClick={() => setIntervindo(al.id)}
                  >
                    Intervir
                  </Button>
                  <button
                    onClick={() => setAberto(expandido ? null : al.id)}
                    className="flex items-center gap-1 px-2.5 h-8 rounded-full text-[11px] font-bold text-primary hover:bg-primary/10 transition"
                  >
                    <History size={13} /> {al.historico.length}
                    <ChevronDown
                      size={13}
                      className={cn(
                        "transition-transform",
                        expandido && "rotate-180",
                      )}
                    />
                  </button>
                </div>
              </div>

              {expandido && (
                <ol className="relative ml-5 border-l-2 border-primary/15 space-y-3 animate-fade-in">
                  {[...al.historico].reverse().map((h, i) => (
                    <li key={i} className="relative pl-5 text-xs">
                      <span
                        className={cn(
                          "absolute -left-1.75 top-1 w-3 h-3 rounded-full ring-4 ring-slate-50",
                          i === 0 ? "bg-primary" : "bg-slate-300",
                        )}
                      />
                      <p className="font-semibold text-ink">{h.acao}</p>
                      <p className="text-[11px] text-slate-400 tabular">
                        {fmt(h.em)} · {h.porId}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          );
        })}
      </div>

      <ModalTexto
        aberto={!!intervindo}
        titulo="Registrar intervenção"
        rotulo="Descreva a intervenção"
        placeholder="Ex.: ligação para o responsável"
        confirmar="Registrar"
        onFechar={() => setIntervindo(null)}
        onConfirmar={(t) =>
          intervindo &&
          alertaStore.registrar(intervindo, `intervenção: ${t}`, GESTOR_ID)
        }
      />
    </Card>

);
};

================================================
FILE: src/modules/professor/constantes.ts
================================================
import { Home, ClipboardCheck, PenLine, FolderOpen } from "lucide-react";
import type { NivelRisco } from "../../services/radarRisco";
import type { StatusPresenca, TabProfessor } from "../../types";

export const PROFESSOR_ID = "prof";

export const ABAS: {
id: TabProfessor;
label: string;
icone: React.ElementType;
}[] = [
{ id: "dashboard", label: "Início", icone: Home },
{ id: "diario", label: "Diário & Chamada", icone: ClipboardCheck },
{ id: "notas", label: "Notas", icone: PenLine },
{ id: "conteudos", label: "Conteúdos", icone: FolderOpen },
];

export const ESTILO_RISCO: Record<
NivelRisco,
{ barra: string; selo: string; label: string; borda: string }

> = {
> critico: {

    barra: "bg-gradient-to-r from-rose-400 to-rose-500",
    selo: "text-rose-600 bg-rose-500/10",
    label: "Crítico",
    borda: "border-rose-400",

},
atencao: {
barra: "bg-gradient-to-r from-amber-400 to-amber-500",
selo: "text-amber-600 bg-amber-500/10",
label: "Atenção",
borda: "border-amber-400",
},
ok: { barra: "bg-brand", selo: "", label: "", borda: "border-transparent" },
};

// Ciclo do clique: Presente → Falta → Justificada → Presente
export const PROXIMO: Record<StatusPresenca, StatusPresenca> = {
PRESENTE_PIN: "FALTA",
PRESENTE_MANUAL: "FALTA",
FALTA: "FALTA_JUSTIFICADA",
FALTA_JUSTIFICADA: "PRESENTE_MANUAL",
};

const PRESENTE = {
label: "Presente",
icone: "✓",
cls: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30",
};
export const VISUAL: Record<
StatusPresenca,
{ label: string; icone: string; cls: string }

> = {
> PRESENTE_PIN: PRESENTE,
> PRESENTE_MANUAL: PRESENTE,
> FALTA: {

    label: "Falta",
    icone: "✕",
    cls: "bg-rose-500 text-white shadow-lg shadow-rose-500/30",

},
FALTA_JUSTIFICADA: {
label: "Justificada",
icone: "⚑",
cls: "bg-amber-400 text-white shadow-lg shadow-amber-500/30",
},
};

export const pad = (n: number) => n.toString().padStart(2, "0");
export const formatarTempo = (seg: number) =>
`${pad(Math.floor(seg / 60))}:${pad(seg % 60)}`;
export const hoje = () => new Date().toLocaleDateString("sv-SE");
export const iniciais = (nome: string) =>
nome
.split(" ")
.filter(Boolean)
.map((p) => p[0])
.slice(0, 2)
.join("")
.toUpperCase();
export const corNota = (v: number) =>
v >= 7
? "text-emerald-600 bg-emerald-50"
: v >= 5
? "text-amber-600 bg-amber-50"
: "text-rose-600 bg-rose-50";

================================================
FILE: src/modules/professor/ConteudosProfessor.tsx
================================================
import React from "react";
import { FolderOpen, FileText, Upload, Download } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";

const materiais = [
{
unidade: "Unidade 03 · Componentes Reutilizáveis e Hooks",
arquivo: "Slides_Aula_03.pdf",
data: "20/09/2026",
},
];

export const ConteudosProfessor: React.FC = () => (
<Card className="space-y-5">
<div className="flex items-center gap-4">
<IconBubble icone={FolderOpen} cor="amber" />
<h3 className="flex-1 text-lg font-extrabold text-ink">
Materiais de aula & tarefas
</h3>
<Button icon={<Upload size={15} />}>Upload</Button>
</div>

    <label className="group flex flex-col items-center gap-1 p-8 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all">
      <Upload
        size={28}
        className="text-primary group-hover:-translate-y-1 transition-transform"
      />
      <span className="text-sm font-semibold text-ink">
        Arraste arquivos ou clique para enviar
      </span>
      <span className="text-[11px] text-slate-400">PDF, slides, imagens…</span>
      <input type="file" className="hidden" />
    </label>

    <ul className="space-y-2 stagger">
      {materiais.map((m) => (
        <li
          key={m.arquivo}
          className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 hover:translate-x-1 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink truncate">{m.unidade}</p>
            <p className="text-xs text-slate-400">
              {m.arquivo} · Publicado em {m.data}
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            icon={<Download size={14} />}
            aria-label="Baixar"
          />
        </li>
      ))}
    </ul>

  </Card>
);

================================================
FILE: src/modules/professor/InicioProfessor.tsx
================================================
import React from "react";
import {
Activity,
ClipboardCheck,
AlertTriangle,
Radar,
Users,
Moon,
Sun,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";
import {
useFrequenciaTurma,
LIMITE_FALTAS_PCT,
TURMA_ID,
} from "../../services/frequenciaTurma";
import { useRadarRisco } from "../../services/radarRisco";
import { useMediasTurma } from "../../services/notas";
import type { TabProfessor } from "../../types";
import { cn } from "../../core/lib/utils";
import { ESTILO_RISCO, PROFESSOR_ID, pad, iniciais } from "./constantes";

export const InicioProfessor: React.FC<{
onNavegar: (t: TabProfessor) => void;
}> = ({ onNavegar }) => {
const { alunos, mediaFrequencia, diasRegistrados, diarioHojeSalvo } =
useFrequenciaTurma();
const medias = useMediasTurma(alunos);
const { itens: radar } = useRadarRisco(
alunos,
medias,
TURMA_ID,
PROFESSOR_ID,
);
const alertas = radar.filter((a) => a.nivel !== "ok");
const freqOk = mediaFrequencia >= 100 - LIMITE_FALTAS_PCT;

const kpis = [
{
label: "Frequência média",
valor: `${mediaFrequencia}%`,
sub: `${diasRegistrados} diário(s) lançado(s)`,
icone: Activity,
cor: freqOk ? "emerald" : "rose",
},
{
label: "Diário de hoje",
valor: diarioHojeSalvo ? "Salvo" : "Pendente",
sub: diarioHojeSalvo ? "Tudo em dia ✓" : "Faça a chamada 📣",
icone: ClipboardCheck,
cor: diarioHojeSalvo ? "emerald" : "amber",
},
{
label: "Alunos em risco",
valor: pad(alertas.length),
sub: `Faltas > ${LIMITE_FALTAS_PCT}% ou nota baixa`,
icone: AlertTriangle,
cor: alertas.length ? "rose" : "emerald",
},
] as const;

const turmas = [
{
nome: "Desenvolvimento Front-End",
info: `${alunos.length} alunos`,
turno: "Noturno",
icone: Moon,
acao: diarioHojeSalvo ? "Revisar chamada" : "Abrir chamada",
aba: "diario" as const,
destaque: !diarioHojeSalvo,
},
{
nome: "Arquitetura de Software",
info: "38 alunos",
turno: "Matutino",
icone: Sun,
acao: "Lançar notas",
aba: "notas" as const,
destaque: false,
},
];

return (
<div className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
{kpis.map((k) => (
<Card key={k.label} hoverable className="flex items-center gap-4">
<IconBubble icone={k.icone} cor={k.cor} />
<div className="min-w-0">
<p className="text-xs font-medium text-slate-400">{k.label}</p>
<p className="text-2xl font-extrabold text-ink tabular">
{k.valor}
</p>
<p className="text-[11px] text-slate-400 truncate">{k.sub}</p>
</div>
</Card>
))}
</div>

      <Card className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <IconBubble icone={Radar} cor="violet" tamanho="sm" />
          <h3 className="flex-1 text-lg font-extrabold text-ink">
            Radar de Risco · Turma A
          </h3>
          <span className="text-[11px] text-slate-400">
            {alunos.length} alunos · atualiza ao salvar diário ou notas
          </span>
        </div>

        {alertas.length === 0 && (
          <p className="text-sm font-bold text-emerald-600 bg-emerald-50 p-4 rounded-xl text-center animate-pop">
            🎉 Nenhum aluno em risco. Turma afiada!
          </p>
        )}

        <div className="space-y-2 stagger">
          {radar.map((a) => {
            const e = ESTILO_RISCO[a.nivel];
            return (
              <div
                key={a.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-xl bg-slate-50 border-l-4 hover:bg-primary/5 transition-colors",
                  e.borda,
                )}
              >
                <div className="w-9 h-9 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {iniciais(a.nome)}
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-ink">
                      {a.nome}
                      {e.label && (
                        <span
                          className={cn(
                            "ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full",
                            e.selo,
                          )}
                        >
                          {e.label}
                          {a.motivo && ` · ${a.motivo}`}
                        </span>
                      )}
                    </span>
                    <span className="text-slate-400 tabular">
                      {a.faltas}/{a.totalAulas} faltas ·{" "}
                      <b className="text-ink">{a.percentualFrequencia}%</b>
                      {a.media !== null && (
                        <>
                          {" "}
                          · média <b className="text-ink">{a.media}</b>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200/70 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full animate-grow",
                        e.barra,
                      )}
                      style={{ width: `${a.percentualFrequencia}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-extrabold text-ink">Minhas turmas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
          {turmas.map((t) => (
            <Card
              key={t.nome}
              hoverable
              className="relative overflow-hidden space-y-4"
            >
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-primary/5" />
              <div className="relative flex items-center gap-3">
                <IconBubble
                  icone={Users}
                  cor={t.aba === "diario" ? "primary" : "cyan"}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {t.nome}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <t.icone size={12} /> {t.info} · {t.turno}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="relative w-full"
                variant={
                  t.destaque || t.aba === "diario" ? "primary" : "secondary"
                }
                onClick={() => onNavegar(t.aba)}
              >
                {t.acao}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>

);
};

================================================
FILE: src/modules/professor/LancamentoFrequencia.tsx
================================================
import React, { useState, useEffect, useMemo } from "react";
import { Radio, KeyRound, Save, Users, X, Zap } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { Modal } from "../../core/ui/Modal";
import { listaAlunosTurmaMock, sessaoFrequenciaAtiva } from "../../mocks/data";
import { chamadaStore, useChamada } from "../../services/chamadaStore";
import {
diarioStore,
useRegistros,
contaComoPresenca,
} from "../../services/diarioStore";
import { TURMA_ID, DISCIPLINA_ID } from "../../services/frequenciaTurma";
import { REGRAS } from "../../config/regras";
import type { StatusPresenca } from "../../types";
import { cn } from "../../core/lib/utils";
import { PROXIMO, VISUAL, formatarTempo, hoje, iniciais } from "./constantes";

const DURACAO_MS = REGRAS.validadePinMinutos _ 60 _ 1000;

export const LancamentoFrequencia: React.FC = () => {
const { chamadaId, pin, expiraEm, presentesIds } = useChamada();
const registros = useRegistros();
const [ajustesManuais, setAjustesManuais] = useState<
Record<string, StatusPresenca>

> ({});
> const [isModalPinOpen, setIsModalPinOpen] = useState(false);
> const [agora, setAgora] = useState(() => Date.now());
> const [toast, setToast] = useState<string | null>(null);

const tempoRestante = expiraEm
? Math.max(0, Math.ceil((expiraEm - agora) / 1000))
: 0;
const chamadaAtiva = tempoRestante > 0;
const jaSalvoHoje = diarioStore.jaSalvo(TURMA_ID, DISCIPLINA_ID);

const salvosHoje = useMemo(() => {
const d = hoje();
const mapa: Record<string, StatusPresenca> = {};
registros.forEach((r) => {
if (
r.turmaId === TURMA_ID &&
r.disciplinaId === DISCIPLINA_ID &&
r.data === d
)
mapa[r.alunoId] = r.status;
});
return mapa;
}, [registros]);

const alunos = listaAlunosTurmaMock.map((a) => {
const viaPin = presentesIds.includes(a.id);
const salvo = salvosHoje[a.id];
const mock: StatusPresenca = a.presente ? "PRESENTE_MANUAL" : "FALTA";
const base: StatusPresenca =
chamadaAtiva && viaPin
? "PRESENTE_PIN"
: (salvo ?? (viaPin ? "PRESENTE_PIN" : mock));
const status = ajustesManuais[a.id] ?? base;
return { ...a, viaPin: status === "PRESENTE_PIN", status };
});

const totalPresentes = alunos.filter((a) =>
contaComoPresenca(a.status),
).length;
const pct = alunos.length ? (totalPresentes / alunos.length) \* 100 : 0;

useEffect(() => {
if (!expiraEm) return;
const timer = setInterval(() => {
const now = Date.now();
setAgora(now);
if (now >= expiraEm) clearInterval(timer);
}, 1000);
return () => clearInterval(timer);
}, [expiraEm]);

useEffect(() => {
if (!toast) return;
const t = setTimeout(() => setToast(null), 3500);
return () => clearTimeout(t);
}, [toast]);

const handleGerarPin = () => {
if (!chamadaAtiva) {
setAgora(Date.now());
setAjustesManuais({});
chamadaStore.iniciar(DURACAO_MS, {
disciplinaId: DISCIPLINA_ID,
disciplinaNome: sessaoFrequenciaAtiva.disciplinaNome,
});
}
setIsModalPinOpen(true);
};

const handleEncerrar = () => {
chamadaStore.encerrar();
setAgora(Date.now());
setIsModalPinOpen(false);
};

const alternarStatus = (id: string, atual: StatusPresenca) =>
setAjustesManuais((prev) => ({ ...prev, [id]: PROXIMO[atual] }));

const handleSalvarDiario = () => {
if (chamadaAtiva) {
chamadaStore.encerrar();
setAgora(Date.now());
}
const statusPorAluno: Record<string, StatusPresenca> = {};
alunos.forEach((a) => (statusPorAluno[a.id] = a.status));
const eraAtualizacao = jaSalvoHoje;
const total = diarioStore.salvar({
turmaId: TURMA_ID,
disciplinaId: DISCIPLINA_ID,
chamadaId: chamadaId ?? undefined,
statusPorAluno,
});
setAjustesManuais({});
setToast(
eraAtualizacao
? `Diário atualizado: ${total} alunos 📒`
: `Diário salvo: ${total} alunos registrados 📒`,
);
};

const r = 34,
c = 2 _ Math.PI _ r;
const digitos = (pin ?? "-".repeat(REGRAS.digitosPin)).split("");
const urgente = chamadaAtiva && tempoRestante <= 30;

return (
<div className="space-y-6">
{/_ Cabeçalho _/}
<div
className={cn(
"relative overflow-hidden p-5 rounded-2xl flex flex-col md:flex-row md:items-center gap-5",
chamadaAtiva
? "bg-brand text-white shadow-glow"
: "bg-white shadow-flat",
)} >
<div
className={cn(
"absolute -right-10 -top-12 w-40 h-40 rounded-full",
chamadaAtiva ? "bg-white/10" : "bg-primary/5",
)}
/>

        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              strokeWidth="7"
              className={chamadaAtiva ? "stroke-white/20" : "stroke-slate-100"}
            />
            <circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c - (pct / 100) * c}
              className={chamadaAtiva ? "stroke-white" : "stroke-primary"}
              style={{
                transition: "stroke-dashoffset .8s cubic-bezier(.22,1,.36,1)",
              }}
            />
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={cn(
                "text-lg font-extrabold tabular leading-none",
                !chamadaAtiva && "text-ink",
              )}
            >
              {totalPresentes}
            </span>
            <span
              className={cn(
                "text-[10px]",
                chamadaAtiva ? "text-white/70" : "text-slate-400",
              )}
            >
              de {alunos.length}
            </span>
          </span>
        </div>

        <div className="relative flex-1 min-w-0">
          {chamadaAtiva ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/70 flex items-center gap-1.5">
              <Radio size={12} className="animate-pulse" /> Chamada ao vivo ·{" "}
              {formatarTempo(tempoRestante)}
            </p>
          ) : (
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              Diário de classe
            </p>
          )}
          <h2
            className={cn(
              "text-lg font-extrabold truncate",
              !chamadaAtiva && "text-ink",
            )}
          >
            {sessaoFrequenciaAtiva.disciplinaNome}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span
              className={cn(
                "text-xs",
                chamadaAtiva ? "text-white/80" : "text-slate-400",
              )}
            >
              Turma A
            </span>
            {jaSalvoHoje && (
              <span
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  chamadaAtiva
                    ? "bg-white/20"
                    : "text-emerald-600 bg-emerald-500/10",
                )}
              >
                ✓ Diário de hoje salvo
              </span>
            )}
          </div>
        </div>

        <div className="relative flex flex-wrap gap-2">
          <Button
            icon={<KeyRound size={16} />}
            onClick={handleGerarPin}
            className={cn(
              chamadaAtiva &&
                "bg-white text-primary! hover:bg-white hover:-translate-y-0.5 shadow-lg",
            )}
          >
            {chamadaAtiva ? "Exibir PIN" : "Gerar PIN"}
          </Button>
          <Button
            variant="outline"
            icon={<Save size={16} />}
            onClick={handleSalvarDiario}
            className={cn(
              chamadaAtiva &&
                "border-white/40 text-white! bg-white/10 hover:bg-white/20",
            )}
          >
            {jaSalvoHoje ? "Atualizar diário" : "Salvar diário"}
          </Button>
        </div>
      </div>

      {/* Lista */}
      <Card className="space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h3 className="text-lg font-extrabold text-ink flex items-center gap-2">
            <Users size={18} className="text-primary" /> Alunos
            {chamadaAtiva && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
                ao vivo
              </span>
            )}
          </h3>
          <span className="text-[11px] text-slate-400">
            Toque no status para alternar P → F → J
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 stagger">
          {alunos.map((a) => {
            const v = VISUAL[a.status];
            return (
              <div
                key={a.id}
                className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 transition-colors"
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">
                    {iniciais(a.nome)}
                  </div>
                  {a.viaPin && (
                    <span
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center animate-pop"
                      title="Confirmou via PIN"
                    >
                      <Zap size={11} className="text-primary fill-primary" />
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {a.nome}
                  </p>
                  <p className="text-[11px] text-slate-400 tabular">
                    Mat. {a.matricula}
                    {a.viaPin && (
                      <span className="text-primary font-semibold">
                        {" "}
                        · via PIN
                      </span>
                    )}
                  </p>
                </div>
                <button
                  key={a.status}
                  onClick={() => alternarStatus(a.id, a.status)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-bold transition-transform hover:scale-105 active:scale-95 animate-pop",
                    v.cls,
                  )}
                >
                  <span>{v.icone}</span> {v.label}
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 pl-4 pr-2 h-12 rounded-full bg-ink text-white text-sm font-bold shadow-2xl animate-pop">
          {toast}
          <button
            onClick={() => setToast(null)}
            aria-label="Fechar"
            className="p-1.5 rounded-full hover:bg-white/10"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Modal PIN */}
      <Modal
        isOpen={isModalPinOpen}
        onClose={() => setIsModalPinOpen(false)}
        title="Chamada ao vivo"
      >
        <div className="text-center py-4 space-y-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">
            Digite no Portal do Aluno
          </p>

          <div className="flex justify-center gap-3">
            {digitos.map((d, i) => (
              <div
                key={`${pin}-${i}`}
                style={{ animationDelay: `${i * 90}ms` }}
                className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-brand text-white shadow-glow flex items-center justify-center text-5xl sm:text-6xl font-black tabular animate-pop"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={cn(
                "p-3 rounded-2xl",
                urgente ? "bg-rose-50 animate-pulse" : "bg-amber-50",
              )}
            >
              <p className="text-[11px] font-medium text-slate-500">
                Expira em
              </p>
              <p
                className={cn(
                  "text-2xl font-black tabular",
                  urgente ? "text-rose-600" : "text-amber-600",
                )}
              >
                {chamadaAtiva ? formatarTempo(tempoRestante) : "Expirado"}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50">
              <p className="text-[11px] font-medium text-slate-500">Via PIN</p>
              <p
                key={presentesIds.length}
                className="text-2xl font-black text-emerald-600 tabular animate-pop"
              >
                {presentesIds.length}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="w-full" onClick={() => setIsModalPinOpen(false)}>
              Voltar para a lista
            </Button>
            {chamadaAtiva && (
              <Button
                className="w-full"
                variant="outline"
                onClick={handleEncerrar}
              >
                Encerrar chamada
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>

);
};

================================================
FILE: src/modules/professor/NotasProfessor.tsx
================================================
import React from "react";
import { FileSpreadsheet, Send } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";
import { useNotasTurma, atualizarNota } from "../../services/notas";
import { cn } from "../../core/lib/utils";
import { corNota, iniciais } from "./constantes";

export const NotasProfessor: React.FC = () => {
const notas = useNotasTurma();
const media = notas.length
? notas.reduce((a, n) => a + Number(n.media), 0) / notas.length
: 0;

return (
<Card className="space-y-5">
<div className="flex flex-wrap items-center gap-4">
<IconBubble icone={FileSpreadsheet} cor="violet" />
<div className="flex-1 min-w-0">
<h3 className="text-lg font-extrabold text-ink">
Planilha de avaliações · Turma A
</h3>
<p className="text-xs text-slate-400">
Médias calculadas automaticamente ✨
</p>
</div>
<span
className={cn(
"px-3 h-9 rounded-full text-xs font-bold flex items-center tabular",
corNota(media),
)} >
Média da turma {media.toFixed(1)}
</span>
<Button icon={<Send size={15} />}>Publicar boletim</Button>
</div>

      <div className="space-y-2 stagger">
        <div className="hidden sm:grid grid-cols-[1fr_88px_88px_88px] gap-3 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Aluno</span>
          <span className="text-center">AV1</span>
          <span className="text-center">AV2</span>
          <span className="text-center">Média</span>
        </div>
        {notas.map((n) => (
          <div
            key={n.id}
            className="grid grid-cols-3 sm:grid-cols-[1fr_88px_88px_88px] items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 transition-colors"
          >
            <div className="col-span-3 sm:col-span-1 flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                {iniciais(n.aluno)}
              </div>
              <span className="text-sm font-bold text-ink truncate">
                {n.aluno}
              </span>
            </div>
            {(["av1", "av2"] as const).map((campo) => (
              <input
                key={campo}
                type="number"
                step="0.5"
                min={0}
                max={10}
                value={n[campo]}
                aria-label={`${campo} de ${n.aluno}`}
                onChange={(e) =>
                  atualizarNota(
                    n.id,
                    campo,
                    Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)),
                  )
                }
                className="w-full h-10 rounded-xl border-2 border-transparent bg-white text-center text-sm font-bold text-ink tabular shadow-flat-sm focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition"
              />
            ))}
            <span
              key={n.media}
              className={cn(
                "h-10 rounded-xl flex items-center justify-center text-sm font-black tabular animate-pop",
                corNota(Number(n.media)),
              )}
            >
              {n.media}
            </span>
          </div>
        ))}
      </div>
    </Card>

);
};

================================================
FILE: src/modules/professor/PortalProfessor.tsx
================================================
import React, { useState } from "react";
import type { TabProfessor } from "../../types";
import { cn } from "../../core/lib/utils";
import { ABAS } from "./constantes";
import { InicioProfessor } from "./InicioProfessor";
import { LancamentoFrequencia } from "./LancamentoFrequencia";
import { NotasProfessor } from "./NotasProfessor";
import { ConteudosProfessor } from "./ConteudosProfessor";

export const PortalProfessor: React.FC = () => {
const [aba, setAba] = useState<TabProfessor>("dashboard");

return (
<div className="space-y-6">
<nav className="flex gap-1.5 p-1.5 rounded-2xl bg-white shadow-flat overflow-x-auto">
{ABAS.map(({ id, label, icone: I }) => (
<button
key={id}
onClick={() => setAba(id)}
className={cn(
"flex items-center gap-2 px-4 h-10 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200",
aba === id
? "bg-brand text-white shadow-glow"
: "text-slate-500 hover:bg-primary/5 hover:text-primary",
)} >
<I size={15} /> {label}
</button>
))}
</nav>

      <div key={aba} className="animate-fade-up">
        {aba === "dashboard" && <InicioProfessor onNavegar={setAba} />}
        {aba === "diario" && <LancamentoFrequencia />}
        {aba === "notas" && <NotasProfessor />}
        {aba === "conteudos" && <ConteudosProfessor />}
      </div>
    </div>

);
};

================================================
FILE: src/services/chamadaStore.ts
================================================
import { useSyncExternalStore } from "react";
import { REGRAS } from "../config/regras";

const KEY = "alvora:chamada";
const EVT = "alvora:chamada-change";

export type ResultadoConfirmacao = "ok" | "invalido" | "expirado" | "duplicado";

export interface EstadoChamada {
chamadaId: string | null;
disciplinaId: string | null;
disciplinaNome: string | null;
pin: string | null;
expiraEm: number | null;
presentesIds: string[];
}

export interface InfoChamada {
chamadaId?: string;
disciplinaId?: string;
disciplinaNome?: string;
}

const VAZIO: EstadoChamada = {
chamadaId: null,
disciplinaId: null,
disciplinaNome: null,
pin: null,
expiraEm: null,
presentesIds: [],
};

function ler(): EstadoChamada {
try {
const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
return v && typeof v === "object" ? { ...VAZIO, ...v } : VAZIO;
} catch {
return VAZIO;
}
}

let cache: EstadoChamada = ler();

function gravar(estado: EstadoChamada) {
localStorage.setItem(KEY, JSON.stringify(estado));
cache = estado;
window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
const onStorage = (e: StorageEvent) => {
if (e.key === KEY) {
cache = ler();
cb();
}
};
window.addEventListener("storage", onStorage);
window.addEventListener(EVT, cb);
return () => {
window.removeEventListener("storage", onStorage);
window.removeEventListener(EVT, cb);
};
}

/** PIN numérico com a quantidade de dígitos definida em REGRAS. _/
const gerarPin = () =>
Math.floor(Math.random() _ 10 ** REGRAS.digitosPin)
.toString()
.padStart(REGRAS.digitosPin, "0");

export const chamadaStore = {
estado: () => cache,

iniciar(duracaoMs: number, info: InfoChamada = {}) {
gravar({
chamadaId: info.chamadaId ?? `ch-${Date.now()}`,
disciplinaId: info.disciplinaId ?? null,
disciplinaNome: info.disciplinaNome ?? null,
pin: gerarPin(),
expiraEm: Date.now() + duracaoMs,
presentesIds: [],
});
},

/\*_ Expira a chamada agora, mas mantém os presentes para salvar no diário. _/
encerrar() {
if (!cache.expiraEm) return;
gravar({ ...cache, expiraEm: Math.min(cache.expiraEm, Date.now()) });
},

confirmar(pin: string, alunoId: string): ResultadoConfirmacao {
const { pin: atual, expiraEm, presentesIds } = cache;
if (!atual || !expiraEm || Date.now() >= expiraEm) return "expirado";
if (pin.trim() !== atual) return "invalido";
if (presentesIds.includes(alunoId)) return "duplicado";
gravar({ ...cache, presentesIds: [...presentesIds, alunoId] });
return "ok";
},

limpar: () => gravar(VAZIO),
};

export const useChamada = () => useSyncExternalStore(subscribe, () => cache);

================================================
FILE: src/services/diarioStore.test.ts
================================================
import { beforeEach, describe, expect, it } from "vitest";
import type { RegistroPresenca, StatusPresenca } from "../types";
import {
contaComoPresenca,
aplicarRegistros,
diarioStore,
situacaoFrequencia,
FREQ_MINIMA,
FREQ_ALERTA,
} from "./diarioStore";

const FALTA = "FALTA" as StatusPresenca; // ajuste se o seu status de falta tiver outro nome

const reg = (
alunoId: string,
disciplinaId: string,
status: StatusPresenca,
data = "2026-09-27",
): RegistroPresenca => ({
id: `t1-${data}-${alunoId}-${Math.random()}`,
alunoId,
turmaId: "t1",
disciplinaId,
status,
data,
registradoEm: 0,
});

const base = [
{
disciplinaId: "mat",
presencas: 8,
faltas: 2,
totalAulas: 20,
percentualFrequencia: 80,
},
];

describe("contaComoPresenca", () => {
it("aceita PIN e manual", () => {
expect(contaComoPresenca("PRESENTE_PIN")).toBe(true);
expect(contaComoPresenca("PRESENTE_MANUAL")).toBe(true);
});
it("rejeita falta", () => {
expect(contaComoPresenca(FALTA)).toBe(false);
});
});

describe("aplicarRegistros", () => {
it("sem registros devolve o mesmo item", () => {
const r = aplicarRegistros(base, [], "a1");
expect(r[0]).toBe(base[0]);
});

it("soma presenças e faltas e recalcula o %", () => {
const r = aplicarRegistros(
base,
[reg("a1", "mat", "PRESENTE_PIN"), reg("a1", "mat", FALTA)],
"a1",
);
expect(r[0]).toMatchObject({
presencas: 9,
faltas: 3,
percentualFrequencia: 75,
});
});

it("ignora outros alunos e outras disciplinas", () => {
const r = aplicarRegistros(
base,
[reg("a2", "mat", FALTA), reg("a1", "port", FALTA)],
"a1",
);
expect(r[0]).toBe(base[0]);
});

it("totalAulas nunca fica menor que o número de aulas dadas", () => {
const pequeno = [{ ...base[0], totalAulas: 10 }];
const r = aplicarRegistros(
pequeno,
[reg("a1", "mat", "PRESENTE_PIN")],
"a1",
);
expect(r[0].totalAulas).toBe(11);
});
});

describe("diarioStore", () => {
beforeEach(() => diarioStore.limpar());

it("salvar grava um registro por aluno", () => {
const n = diarioStore.salvar({
turmaId: "t1",
disciplinaId: "mat",
data: "2026-09-27",
statusPorAluno: { a1: "PRESENTE_MANUAL", a2: FALTA },
});
expect(n).toBe(2);
expect(diarioStore.jaSalvo("t1", "mat", "2026-09-27")).toBe(true);
});

it("salvar duas vezes no mesmo dia sobrescreve (não duplica)", () => {
const input = {
turmaId: "t1",
disciplinaId: "mat",
data: "2026-09-27",
statusPorAluno: { a1: FALTA },
};
diarioStore.salvar(input);
diarioStore.salvar({ ...input, statusPorAluno: { a1: "PRESENTE_MANUAL" } });
expect(diarioStore.listar()).toHaveLength(1);
expect(diarioStore.listar()[0].status).toBe("PRESENTE_MANUAL");
});

it("marcar via PIN aparece em presentesDaChamada", () => {
diarioStore.marcar({
alunoId: "a1",
turmaId: "t1",
disciplinaId: "mat",
chamadaId: "c1",
status: "PRESENTE_PIN",
});
expect(diarioStore.presentesDaChamada("c1")).toEqual(["a1"]);
});
});

describe("situacaoFrequencia", () => {
it("abaixo do mínimo é reprovado", () => {
expect(situacaoFrequencia(FREQ_MINIMA - 0.1)).toBe("reprovado");
});

it("entre mínimo e alerta é atenção", () => {
expect(situacaoFrequencia(FREQ_MINIMA)).toBe("atencao");
expect(situacaoFrequencia(FREQ_ALERTA - 0.1)).toBe("atencao");
});

it("a partir do alerta é segura", () => {
expect(situacaoFrequencia(FREQ_ALERTA)).toBe("segura");
expect(situacaoFrequencia(100)).toBe("segura");
});
});

================================================
FILE: src/services/diarioStore.ts
================================================
import { useSyncExternalStore } from "react";
import { FREQ_MINIMA } from "../config/regras";
import type { RegistroPresenca, StatusPresenca } from "../types";

const KEY = "alvora:diario";
const EVT = "alvora:diario-change";

/\*_ Frequência mínima vem de config/regras; a faixa de alerta continua aqui (em %). _/
export { FREQ_MINIMA }; // PortalAluno continua importando daqui
export const FREQ_ALERTA = 80;

export type SituacaoFrequencia = "segura" | "atencao" | "reprovado";

/\*_ Classifica um percentual de frequência. _/
export const situacaoFrequencia = (percentual: number): SituacaoFrequencia =>
percentual < FREQ_MINIMA
? "reprovado"
: percentual < FREQ_ALERTA
? "atencao"
: "segura";

/\*_ Data local no formato YYYY-MM-DD (evita o "pulo" de dia do UTC). _/
const hoje = () => new Date().toLocaleDateString("sv-SE");

/\*_ Diz se um status (ou um registro) conta como presença no cálculo de frequência. _/
export const contaComoPresenca = (
x: StatusPresenca | Pick<RegistroPresenca, "status">,
): boolean => {
const status = typeof x === "string" ? x : x.status;
return status === "PRESENTE_PIN" || status === "PRESENTE_MANUAL";
};

interface ItemFrequencia {
disciplinaId: string;
presencas: number;
faltas: number;
totalAulas: number;
percentualFrequencia: number;
}

/\*_ Soma os registros do diário ao histórico base (mock) do aluno. _/
export function aplicarRegistros<T extends ItemFrequencia>(
historico: T[],
registros: RegistroPresenca[],
alunoId: string,
): T[] {
return historico.map((item) => {
const doAluno = registros.filter(
(r) => r.alunoId === alunoId && r.disciplinaId === item.disciplinaId,
);
if (!doAluno.length) return item;

    const extrasP = doAluno.filter(contaComoPresenca).length;
    const presencas = item.presencas + extrasP;
    const faltas = item.faltas + (doAluno.length - extrasP);
    const dadas = presencas + faltas;
    const totalAulas = Math.max(item.totalAulas, dadas);

    return {
      ...item,
      presencas,
      faltas,
      totalAulas,
      percentualFrequencia: dadas
        ? Number(((presencas / dadas) * 100).toFixed(1))
        : 100,
    };

});
}

function ler(): RegistroPresenca[] {
try {
const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
return Array.isArray(v) ? v : [];
} catch {
return [];
}
}

let cache: RegistroPresenca[] = ler();

function gravar(lista: RegistroPresenca[]) {
localStorage.setItem(KEY, JSON.stringify(lista));
cache = lista;
window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
const onStorage = (e: StorageEvent) => {
if (e.key === KEY) {
cache = ler();
cb();
}
};
window.addEventListener("storage", onStorage);
window.addEventListener(EVT, cb);
return () => {
window.removeEventListener("storage", onStorage);
window.removeEventListener(EVT, cb);
};
}

export interface SalvarDiarioInput {
turmaId: string;
disciplinaId: string;
chamadaId?: string;
data?: string;
statusPorAluno: Record<string, StatusPresenca>;
}

export type MarcarPresencaInput = Omit<
RegistroPresenca,
"id" | "registradoEm" | "data"

> & { data?: string };

export const diarioStore = {
listar: () => cache,

/\*_ Salva a chamada da turma inteira. Retorna quantos registros foram gravados. _/
salvar(input: SalvarDiarioInput): number {
const data = input.data ?? hoje();
const agora = Date.now();
const novos: RegistroPresenca[] = Object.entries(input.statusPorAluno).map(
([alunoId, status]) => ({
id: `${input.turmaId}-${data}-${alunoId}`,
alunoId,
turmaId: input.turmaId,
disciplinaId: input.disciplinaId,
chamadaId: input.chamadaId,
status,
data,
registradoEm: agora,
}),
);
const ids = new Set(novos.map((r) => r.id));
gravar([...cache.filter((r) => !ids.has(r.id)), ...novos]);
return novos.length;
},

/\*_ Upsert de um único aluno (usado pela chamada por PIN). _/
marcar(r: MarcarPresencaInput) {
const data = r.data ?? hoje();
const id = `${r.turmaId}-${data}-${r.alunoId}`;
const novo: RegistroPresenca = { ...r, id, data, registradoEm: Date.now() };
gravar([...cache.filter((x) => x.id !== id), novo]);
},

presentesDaChamada: (chamadaId: string) =>
cache
.filter((r) => r.chamadaId === chamadaId && r.status === "PRESENTE_PIN")
.map((r) => r.alunoId),

jaSalvo: (turmaId: string, disciplinaId: string, data: string = hoje()) =>
cache.some(
(r) =>
r.turmaId === turmaId &&
r.disciplinaId === disciplinaId &&
r.data === data,
),

limpar: () => gravar([]),
};

export const useRegistros = () => useSyncExternalStore(subscribe, () => cache);

================================================
FILE: src/services/eventoStore.ts
================================================
// src/services/eventoStore.ts
import { useSyncExternalStore } from "react";

export type TipoEvento = "entrega" | "avaliacao" | "feriado" | "evento";

export type Evento = {
id: string;
data: string; // AAAA-MM-DD
titulo: string;
tipo: TipoEvento;
criadoPor: string;
};

const CHAVE = "alvora:eventos";

const SEED: Evento[] = [
{
id: "e1",
data: "2026-09-25",
titulo: "Início de Entregas Parciais",
tipo: "entrega",
criadoPor: "sistema",
},
{
id: "e2",
data: "2026-10-12",
titulo: "Nossa Senhora Aparecida",
tipo: "feriado",
criadoPor: "sistema",
},
{
id: "e3",
data: "2026-10-15",
titulo: "Avaliação Geral do Semestre",
tipo: "avaliacao",
criadoPor: "sistema",
},
{
id: "e4",
data: "2026-10-15",
titulo: "Dia do Professor",
tipo: "evento",
criadoPor: "sistema",
},
{
id: "e5",
data: "2026-11-02",
titulo: "Finados",
tipo: "feriado",
criadoPor: "sistema",
},
{
id: "e6",
data: "2026-11-20",
titulo: "Feira de Ciências",
tipo: "evento",
criadoPor: "sistema",
},
];

const carregar = (): Evento[] => {
try {
const raw = localStorage.getItem(CHAVE);
return raw ? (JSON.parse(raw) as Evento[]) : SEED;
} catch {
return SEED;
}
};

let estado: Evento[] = carregar();
const ouvintes = new Set<() => void>();

const emitir = (novo: Evento[]) => {
estado = novo;
localStorage.setItem(CHAVE, JSON.stringify(estado));
ouvintes.forEach((fn) => fn());
};

export const eventoStore = {
listar: () => estado,
adicionar: (e: Omit<Evento, "id">) =>
emitir([...estado, { ...e, id: crypto.randomUUID() }]),
atualizar: (id: string, dados: Partial<Omit<Evento, "id" | "criadoPor">>) =>
emitir(estado.map((e) => (e.id === id ? { ...e, ...dados } : e))),
remover: (id: string) => emitir(estado.filter((e) => e.id !== id)),
assinar: (fn: () => void) => {
ouvintes.add(fn);
return () => ouvintes.delete(fn);
},
};

export const useEventos = () =>
useSyncExternalStore(eventoStore.assinar, eventoStore.listar);

================================================
FILE: src/services/frequenciaTurma.ts
================================================
import { useMemo } from "react";
import {
listaAlunosTurmaMock,
historicoBaseTurmaMock,
sessaoFrequenciaAtiva,
} from "../mocks/data";
import { useRegistros, contaComoPresenca, diarioStore } from "./diarioStore";
import { useJustificativas } from "./justificativaStore";
import { LIMITE_FALTAS_PCT } from "../config/regras";
import type { RegistroPresenca } from "../types";

export const TURMA_ID = "turma-a";
export const DISCIPLINA_ID = sessaoFrequenciaAtiva.disciplinaId;
export { LIMITE_FALTAS_PCT }; // PortalProfessor e PortalGestor importam daqui

type Justificativa = ReturnType<typeof useJustificativas>[number];

export interface ResumoFrequenciaAluno {
id: string;
nome: string;
matricula: string;
totalAulas: number;
presencas: number;
faltas: number;
faltasAbonadas: number;
percentualFrequencia: number;
percentualFaltas: number;
emRisco: boolean;
}

/\*_ Conta os abonos aprovados de um aluno na disciplina da turma (datas únicas). _/
const contarAbonos = (justificativas: Justificativa[], alunoId: string) =>
new Set(
justificativas
.filter(
(j) =>
j.alunoId === alunoId &&
j.disciplinaId === DISCIPLINA_ID &&
j.status === "aprovada",
)
.map((j) => j.dataFalta),
).size;

export function calcularFrequenciaTurma(
registros: RegistroPresenca[],
justificativas: Justificativa[] = [],
): ResumoFrequenciaAluno[] {
return listaAlunosTurmaMock.map((a) => {
const base = historicoBaseTurmaMock[a.id] ?? {
totalAulas: 0,
presencas: 0,
faltas: 0,
};
const meus = registros.filter(
(r) =>
r.alunoId === a.id &&
r.turmaId === TURMA_ID &&
r.disciplinaId === DISCIPLINA_ID,
);
const novasPresencas = meus.filter((r) =>
contaComoPresenca(r.status),
).length;

    const faltasBrutas = base.faltas + (meus.length - novasPresencas);
    const faltasAbonadas = Math.min(
      faltasBrutas,
      contarAbonos(justificativas, a.id),
    );
    const presencas = base.presencas + novasPresencas + faltasAbonadas;
    const faltas = faltasBrutas - faltasAbonadas;
    const totalAulas = Math.max(base.totalAulas, presencas + faltas) || 1;
    const percentualFaltas = Number(((faltas / totalAulas) * 100).toFixed(1));

    return {
      id: a.id,
      nome: a.nome,
      matricula: a.matricula,
      totalAulas,
      presencas,
      faltas,
      faltasAbonadas,
      percentualFrequencia: Number((100 - percentualFaltas).toFixed(1)),
      percentualFaltas,
      emRisco: percentualFaltas > LIMITE_FALTAS_PCT,
    };

});
}

export function useFrequenciaTurma() {
const registros = useRegistros();
const justificativas = useJustificativas();

return useMemo(() => {
const alunos = calcularFrequenciaTurma(registros, justificativas);
const emRisco = alunos
.filter((a) => a.emRisco)
.sort((x, y) => y.percentualFaltas - x.percentualFaltas);
const mediaFrequencia = alunos.length
? Number(
(
alunos.reduce((s, a) => s + a.percentualFrequencia, 0) /
alunos.length
).toFixed(1),
)
: 0;
const diasRegistrados = new Set(
registros
.filter(
(r) => r.turmaId === TURMA_ID && r.disciplinaId === DISCIPLINA_ID,
)
.map((r) => r.data),
).size;
// `registros` na dependência garante o recálculo quando o diário muda
const diarioHojeSalvo = diarioStore.jaSalvo(TURMA_ID, DISCIPLINA_ID);
return {
alunos,
emRisco,
mediaFrequencia,
diasRegistrados,
diarioHojeSalvo,
};
}, [registros, justificativas]);
}

================================================
FILE: src/services/justificativaStore.ts
================================================
import { criarStorePersistente } from "./storePersistente";
import { alertaStore } from "./radarRisco";

export type StatusJustificativa = "pendente" | "aprovada" | "recusada";

export interface Justificativa {
id: string;
alunoId: string;
alunoNome: string;
disciplinaId: string;
disciplinaNome: string;
dataFalta: string; // yyyy-mm-dd
motivo: string;
anexoNome?: string;
status: StatusJustificativa;
criadaEm: number;
decididaEm?: number;
parecer?: string;
}

type NovaJustificativa = Omit<Justificativa, "id" | "status" | "criadaEm">;

const store = criarStorePersistente<Justificativa[]>(
"alvora:justificativas",
[],
);

export const justificativaStore = {
listar: store.get,

enviar(j: NovaJustificativa): "ok" | "duplicada" {
const existe = store
.get()
.some(
(x) =>
x.alunoId === j.alunoId &&
x.disciplinaId === j.disciplinaId &&
x.dataFalta === j.dataFalta &&
x.status !== "recusada",
);
if (existe) return "duplicada";

    store.set([
      ...store.get(),
      {
        ...j,
        id: `jus-${Date.now()}`,
        status: "pendente",
        criadaEm: Date.now(),
      },
    ]);
    alertaStore.registrarPorAluno(
      j.alunoId,
      `justificativa enviada (${j.disciplinaNome}, ${j.dataFalta})`,
      j.alunoId,
    );
    return "ok";

},

decidir(
id: string,
status: "aprovada" | "recusada",
porId: string,
parecer?: string,
) {
const alvo = store.get().find((j) => j.id === id);
if (!alvo) return;
store.set(
store
.get()
.map((j) =>
j.id === id ? { ...j, status, parecer, decididaEm: Date.now() } : j,
),
);
alertaStore.registrarPorAluno(
alvo.alunoId,
`justificativa ${status} (${alvo.dataFalta})${parecer ? `: ${parecer}` : ""}`,
porId,
);
},
};

export const useJustificativas = store.use;

/\*_ Abona no histórico do aluno as faltas com justificativa aprovada. _/
export function aplicarAbonos<
H extends {
disciplinaId: string;
presencas: number;
faltas: number;
percentualFrequencia: number;
},

> (historico: H[], justificativas: Justificativa[], alunoId: string): H[] {
> return historico.map((h) => {

    const abonadas = justificativas.filter(
      (j) =>
        j.alunoId === alunoId &&
        j.disciplinaId === h.disciplinaId &&
        j.status === "aprovada",
    ).length;
    if (!abonadas) return h;
    const faltas = Math.max(0, h.faltas - abonadas);
    const presencas = h.presencas + (h.faltas - faltas);
    const dadas = presencas + faltas;
    return {
      ...h,
      faltas,
      presencas,
      percentualFrequencia: dadas ? Math.round((presencas / dadas) * 100) : 100,
    };

});
}

================================================
FILE: src/services/notas.ts
================================================
import { useMemo, useSyncExternalStore } from "react";

export type NotaAluno = {
id: string;
aluno: string;
av1: number;
av2: number;
media: number;
};

const CHAVE = "notas_turma_v1";

const INICIAL: NotaAluno[] = [
{
id: "1",
aluno: "João Arthur Albuquerque",
av1: 9.0,
av2: 8.5,
media: 8.75,
},
{ id: "2", aluno: "Ana Beatriz Souza", av1: 7.5, av2: 8.0, media: 7.75 },
{ id: "3", aluno: "Carlos Eduardo Lima", av1: 5.0, av2: 6.0, media: 5.5 },
];

const carregar = (): NotaAluno[] => {
try {
const raw = localStorage.getItem(CHAVE);
return raw ? JSON.parse(raw) : INICIAL;
} catch {
return INICIAL;
}
};

let estado: NotaAluno[] = carregar();
const ouvintes = new Set<() => void>();

const emitir = () => {
localStorage.setItem(CHAVE, JSON.stringify(estado));
ouvintes.forEach((l) => l());
};

const assinar = (l: () => void) => {
ouvintes.add(l);
return () => ouvintes.delete(l);
};

export const normalizar = (s: string) =>
s
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.trim()
.toLowerCase();

export function atualizarNota(id: string, campo: "av1" | "av2", valor: number) {
const v = Math.min(10, Math.max(0, valor));
estado = estado.map((n) => {
if (n.id !== id) return n;
const av1 = campo === "av1" ? v : n.av1;
const av2 = campo === "av2" ? v : n.av2;
return { ...n, [campo]: v, media: Number(((av1 + av2) / 2).toFixed(2)) };
});
emitir();
}

export function useNotasTurma(): NotaAluno[] {
return useSyncExternalStore(assinar, () => estado);
}

/\*_ Médias indexadas pelo ID do aluno da frequência (casadas por nome). Referência estável. _/
export function useMediasTurma(
alunos: { id: string; nome: string }[],
): Record<string, number | null> {
const notas = useNotasTurma();
return useMemo(() => {
const porNome = new Map(notas.map((n) => [normalizar(n.aluno), n.media]));
const out: Record<string, number | null> = {};
for (const a of alunos) out[a.id] = porNome.get(normalizar(a.nome)) ?? null;
return out;
}, [notas, alunos]);
}

================================================
FILE: src/services/presencaService.ts
================================================
import type {
ChamadaPIN,
RegistroPresenca,
ResultadoValidacaoPIN,
StatusPresenca,
} from "../types";
import { gravar, ler } from "./storage";
import { regrasService } from "./regrasService";

const hoje = () => new Date().toISOString().slice(0, 10);
const chamadas = () => ler<ChamadaPIN[]>("chamadas", []);
const registros = () => ler<RegistroPresenca[]>("registros", []);

/** PIN criptograficamente aleatório, sem repetir entre chamadas ativas \*/
function gerarPIN(digitos: number): string {
const ativos = new Set(
chamadas()
.filter(estaAtiva)
.map((c) => c.pin),
);
let pin: string;
do {
const n = crypto.getRandomValues(new Uint32Array(1))[0] % 10 ** digitos;
pin = String(n).padStart(digitos, "0");
} while (ativos.has(pin));
return pin;
}

export const estaAtiva = (c: ChamadaPIN) =>
!c.encerrada && Date.now() < c.expiraEm;

export const presencaService = {
abrirChamada(
dados: Pick<
ChamadaPIN,
"turmaId" | "disciplinaId" | "disciplinaNome" | "professorId" >,
minutos = regrasService.obter().validadePinMinutos,
): ChamadaPIN {
// Só uma chamada ativa por turma
const lista = chamadas().map((c) =>
c.turmaId === dados.turmaId && estaAtiva(c)
? { ...c, encerrada: true }
: c,
);
const agora = Date.now();
const nova: ChamadaPIN = {
...dados,
id: crypto.randomUUID(),
pin: gerarPIN(regrasService.obter().digitosPin),
abertaEm: agora,
expiraEm: agora + minutos \* 60_000,
encerrada: false,
};
gravar("chamadas", [...lista, nova]);
return nova;
},

encerrarChamada(id: string) {
gravar(
"chamadas",
chamadas().map((c) => (c.id === id ? { ...c, encerrada: true } : c)),
);
},

/\*_ Chamadas ativas nas turmas informadas (banner do aluno / tela do professor) _/
chamadasAtivas: (turmasIds: string[]) =>
chamadas().filter((c) => estaAtiva(c) && turmasIds.includes(c.turmaId)),

validarPIN(
alunoId: string,
turmasDoAluno: string[],
pinDigitado: string,
): ResultadoValidacaoPIN {
const pin = pinDigitado.trim();
const candidatas = chamadas().filter((c) => c.pin === pin);
if (!candidatas.length) return "PIN_INCORRETO";

    const daTurma = candidatas.filter((c) => turmasDoAluno.includes(c.turmaId));
    if (!daTurma.length) return "NAO_MATRICULADO";

    const chamada = daTurma.find(estaAtiva);
    if (!chamada) return "PIN_EXPIRADO";

    const lista = registros();
    const data = hoje();
    const existente = lista.find(
      (r) =>
        r.alunoId === alunoId &&
        r.turmaId === chamada.turmaId &&
        r.data === data,
    );
    if (existente?.status.startsWith("PRESENTE")) return "JA_REGISTRADO";

    const novo: RegistroPresenca = {
      id: crypto.randomUUID(),
      alunoId,
      turmaId: chamada.turmaId,
      disciplinaId: chamada.disciplinaId,
      data,
      status: "PRESENTE_PIN",
      chamadaId: chamada.id,
      registradoEm: Date.now(),
    };
    gravar("registros", [...lista.filter((r) => r !== existente), novo]);
    return "SUCESSO";

},

/\*_ Lançamento manual do professor (PIN esquecido, sem internet, justificativa) _/
lancarManual(
alunoId: string,
turmaId: string,
disciplinaId: string,
status: StatusPresenca,
justificativa?: string,
data = hoje(),
) {
const lista = registros().filter(
(r) =>
!(r.alunoId === alunoId && r.turmaId === turmaId && r.data === data),
);
lista.push({
id: crypto.randomUUID(),
alunoId,
turmaId,
disciplinaId,
data,
status,
justificativa,
registradoEm: Date.now(),
});
gravar("registros", lista);
},

confirmadosNaChamada: (chamadaId: string) =>
registros().filter((r) => r.chamadaId === chamadaId),

registrosDoDia: (turmaId: string, data = hoje()) =>
registros().filter((r) => r.turmaId === turmaId && r.data === data),

historicoAluno: (alunoId: string) =>
registros().filter((r) => r.alunoId === alunoId),

/\*_ % de frequência: falta justificada não conta contra o aluno _/
percentual(alunoId: string, turmaId: string): number {
const rs = registros().filter(
(r) =>
r.alunoId === alunoId &&
r.turmaId === turmaId &&
r.status !== "FALTA_JUSTIFICADA",
);
if (!rs.length) return 100;
return (
Math.round(
(rs.filter((r) => r.status.startsWith("PRESENTE")).length / rs.length) \*
1000,
) / 10
);
},
};

================================================
FILE: src/services/radarRisco.ts
================================================
import { useEffect, useMemo } from "react";
import type { ResumoFrequenciaAluno } from "./frequenciaTurma";
import { LIMITE_FALTAS_PCT } from "../config/regras";
import { criarStorePersistente } from "./storePersistente";

export const NOTA_MINIMA = 6;

export type NivelRisco = "critico" | "atencao" | "ok";
export type MotivoAlerta = "FALTAS" | "NOTA" | "AMBOS";

export interface EventoAlerta {
em: number;
acao: string;
porId: string;
}

export interface Alerta {
id: string;
alunoId: string;
turmaId: string;
motivo: MotivoAlerta;
criadoEm: number;
notificado: { aluno: boolean; gestor: boolean };
historico: EventoAlerta[];
}

export interface ItemRadar extends ResumoFrequenciaAluno {
media: number | null;
nivel: NivelRisco;
motivo: MotivoAlerta | null;
}

const store = criarStorePersistente<Alerta[]>("alvora:alertas", []);

export const alertaStore = {
subscribe: store.subscribe,
listar: store.get,

sincronizar(
turmaId: string,
ativos: { alunoId: string; motivo: MotivoAlerta }[],
porId: string,
) {
const agora = Date.now();
const pendentes = new Map(ativos.map((a) => [a.alunoId, a.motivo]));
const proximo: Alerta[] = [];
let mudou = false;

    for (const a of store.get()) {
      if (a.turmaId !== turmaId) {
        proximo.push(a);
        continue;
      }
      const motivo = pendentes.get(a.alunoId);
      if (!motivo) {
        mudou = true; // saiu do risco → alerta resolvido
        continue;
      }
      pendentes.delete(a.alunoId);
      if (motivo !== a.motivo) {
        mudou = true;
        proximo.push({
          ...a,
          motivo,
          historico: [
            ...a.historico,
            {
              em: agora,
              acao: `motivo alterado: ${a.motivo} → ${motivo}`,
              porId,
            },
          ],
        });
      } else {
        proximo.push(a);
      }
    }

    pendentes.forEach((motivo, alunoId) => {
      mudou = true;
      proximo.push({
        id: `${turmaId}:${alunoId}`,
        alunoId,
        turmaId,
        motivo,
        criadoEm: agora,
        notificado: { aluno: false, gestor: false },
        historico: [{ em: agora, acao: `alerta aberto (${motivo})`, porId }],
      });
    });

    if (mudou) store.set(proximo);

},

atualizar(id: string, fn: (a: Alerta) => Alerta) {
store.set(store.get().map((a) => (a.id === id ? fn(a) : a)));
},

notificar(id: string, porId: string) {
alertaStore.atualizar(id, (a) => ({
...a,
notificado: { aluno: true, gestor: true },
historico: [
...a.historico,
{ em: Date.now(), acao: "aluno notificado", porId },
],
}));
},

registrar(id: string, acao: string, porId: string) {
alertaStore.atualizar(id, (a) => ({
...a,
historico: [...a.historico, { em: Date.now(), acao, porId }],
}));
},

/\*_ Registra a ação em todos os alertas de um aluno. _/
registrarPorAluno(alunoId: string, acao: string, porId: string) {
const agora = Date.now();
store.set(
store
.get()
.map((a) =>
a.alunoId === alunoId
? { ...a, historico: [...a.historico, { em: agora, acao, porId }] }
: a,
),
);
},
};

export const useAlertas = store.use;

// ---------- Cálculo do radar ----------
const PESO: Record<NivelRisco, number> = { critico: 0, atencao: 1, ok: 2 };

export function useRadarRisco(
alunos: ResumoFrequenciaAluno[],
medias: Record<string, number | null>,
turmaId: string,
porId: string,
) {
const itens = useMemo<ItemRadar[]>(
() =>
alunos
.map((a) => {
const media = medias[a.id] ?? null;
const faltas = a.emRisco;
const nota = media !== null && media < NOTA_MINIMA;
const motivo: MotivoAlerta | null =
faltas && nota ? "AMBOS" : faltas ? "FALTAS" : nota ? "NOTA" : null;
const perto =
a.percentualFaltas >= LIMITE_FALTAS_PCT - 2 ||
(media !== null && media < NOTA_MINIMA + 1);
const nivel: NivelRisco = motivo
? "critico"
: perto
? "atencao"
: "ok";
return { ...a, media, motivo, nivel };
})
.sort(
(x, y) =>
PESO[x.nivel] - PESO[y.nivel] ||
x.percentualFrequencia - y.percentualFrequencia,
),
[alunos, medias],
);

const alertas = useMemo(() => itens.filter((i) => i.motivo), [itens]);

useEffect(() => {
alertaStore.sincronizar(
turmaId,
alertas.map((a) => ({ alunoId: a.id, motivo: a.motivo! })),
porId,
);
}, [alertas, turmaId, porId]);

return { itens, alertas };
}

================================================
FILE: src/services/regrasService.ts
================================================
import type { RegraFrequencia } from "../types";
import { gravar, ler } from "./storage";

const PADRAO: RegraFrequencia = {
frequenciaMinima: 75,
mediaMinima: 7,
pesosAvaliacoes: { AV1: 0.4, AV2: 0.4, Atividades: 0.2 },
validadePinMinutos: 10,
digitosPin: 6,
limiteAlertaFaltas: 20,
prazoJustificativaDias: 5,
};

export const regrasService = {
obter: (): RegraFrequencia => ({ ...PADRAO, ...ler("regras", PADRAO) }),
salvar: (regras: RegraFrequencia) => gravar("regras", regras),
};

================================================
FILE: src/services/storage.ts
================================================
// Camada de persistência mock. Para usar um backend real,
// basta trocar estas funções por chamadas HTTP.
export function ler<T>(chave: string, padrao: T): T {
try {
const bruto = localStorage.getItem(`alvora:${chave}`);
return bruto ? (JSON.parse(bruto) as T) : padrao;
} catch {
return padrao;
}
}

export function gravar<T>(chave: string, valor: T): void {
localStorage.setItem(`alvora:${chave}`, JSON.stringify(valor));
window.dispatchEvent(new CustomEvent("alvora:dados", { detail: chave }));
}

/\*_ Avisa sobre mudanças na mesma aba e entre abas (professor ↔ aluno) _/
export function observar(callback: () => void): () => void {
const handler = () => callback();
window.addEventListener("alvora:dados", handler);
window.addEventListener("storage", handler);
return () => {
window.removeEventListener("alvora:dados", handler);
window.removeEventListener("storage", handler);
};
}

================================================
FILE: src/services/storePersistente.ts
================================================
import { useSyncExternalStore } from "react";

export function criarStorePersistente<T>(key: string, vazio: T) {
const EVT = `${key}-change`;

const ler = (): T => {
try {
const v = localStorage.getItem(key);
return v ? (JSON.parse(v) as T) : vazio;
} catch {
return vazio;
}
};

let cache = ler();

const subscribe = (cb: () => void) => {
const onStorage = (e: StorageEvent) => {
if (e.key === key) {
cache = ler();
cb();
}
};
window.addEventListener("storage", onStorage);
window.addEventListener(EVT, cb);
return () => {
window.removeEventListener("storage", onStorage);
window.removeEventListener(EVT, cb);
};
};

return {
get: () => cache,
set(v: T) {
cache = v;
localStorage.setItem(key, JSON.stringify(v));
window.dispatchEvent(new Event(EVT));
},
subscribe,
use: () => useSyncExternalStore(subscribe, () => cache),
};
}

================================================
FILE: src/types/index.ts
================================================
export type TabAluno =
| "dashboard"
| "disciplinas"
| "frequencia"
| "boletim"
| "secretaria";
export type TabProfessor =
| "dashboard"
| "diario"
| "notas"
| "conteudos"
| "atendimento";
export type TabGestor =
| "dashboard"
| "radar_risco"
| "diarios_docentes"
| "comunicados";

export interface User {
id: string;
nome: string;
email: string;
role: "aluno" | "professor" | "gestor";
}

export interface SessaoFrequenciaAoVivo {
id: string;
disciplinaId: string;
disciplinaNome: string;
pinCode: string;
tempoLimiteSegundos: number;
ativa: boolean;
alunosPresentesIds: string[];
}

export interface HistoricoFrequenciaItem {
disciplinaId: string;
disciplinaNome: string;
totalAulas: number;
presencas: number;
faltas: number;
percentualFrequencia: number;
}

export interface Aluno extends User {
matricula: string;
curso: string;
mediaGeral: number;
historicoFrequencia: HistoricoFrequenciaItem[];
}

export interface AlunoEmRisco {
id: string;
nome: string;
matricula: string;
curso: string;
disciplinaNome: string;
percentualFrequencia: number;
faltasAcumuladas: number;
maxFaltasPermitidas: number;
mediaAtual: number;
motivoRisco: "FALTAS" | "NOTA" | "AMBOS";
}

export interface AvaliacaoUnidade {
unidade: string;
nota: number | null;
peso: number;
}

export interface BoletimDisciplina {
id: string;
disciplinaNome: string;
professorNome: string;
av1: number;
av2: number | null;
atividadesContinuas: number;
mediaParcial: number;
status: "Aprovado" | "Em Andamento" | "Em Risco";
}

export interface RequerimentoSecretaria {
id: string;
titulo: string;
protocolo: string;
dataSolicitacao: string;
status: "Concluído" | "Em Análise" | "Pendente";
}

export interface BoletoFinanceiro {
id: string;
referencia: string;
vencimento: string;
valor: number;
status: "Pago" | "A Vencer" | "Em Atraso";
}

export interface DiarioDocenteStatus {
id: string;
disciplinaNome: string;
turma: string;
professorNome: string;
aulasMinistradas: number;
aulasPrevistas: number;
statusDiario: "Em Dia" | "Pendente (3d)" | "Atrasado";
frequenciaMediaTurma: number;
}

// ===== Perfis e Usuários =====
export type PapelUsuario = "aluno" | "professor" | "gestor";

export interface Usuario {
id: string;
nome: string;
email: string;
papel: PapelUsuario;
turmaOuCargo: string;
turmasIds: string[]; // aluno: turmas matriculadas | professor: turmas que leciona
fotoUrl?: string;
}

export interface Professor extends Usuario {
papel: "professor";
disciplinasIds: string[];
}

export interface Gestor extends Usuario {
papel: "gestor";
permissoes: string[];
}

// ===== Acadêmico =====
export interface Disciplina {
id: string;
nome: string;
cargaHoraria: number;
professorId: string;
}

export interface Turma {
id: string;
nome: string;
curso: string;
turno: "Matutino" | "Vespertino" | "Noturno";
disciplinaId: string;
professorId: string;
alunosIds: string[];
}

// ===== Presença por PIN =====
export type StatusPresenca =
| "PRESENTE_PIN"
| "PRESENTE_MANUAL"
| "FALTA"
| "FALTA_JUSTIFICADA";

export interface ChamadaPIN {
id: string;
turmaId: string;
disciplinaId: string;
disciplinaNome: string;
professorId: string;
pin: string;
abertaEm: number; // epoch ms
expiraEm: number; // epoch ms
encerrada: boolean;
}

export interface RegistroPresenca {
id: string;
alunoId: string;
turmaId: string;
disciplinaId: string;
data: string; // AAAA-MM-DD
status: StatusPresenca;
chamadaId?: string;
justificativa?: string;
registradoEm: number;
}

export type ResultadoValidacaoPIN =
| "SUCESSO"
| "PIN_INCORRETO"
| "PIN_EXPIRADO"
| "JA_REGISTRADO"
| "NAO_MATRICULADO";

// ===== Notas, Alertas, Calendário, Regras =====
export interface Nota {
id: string;
alunoId: string;
turmaId: string;
avaliacao: string; // "AV1", "AV2", "Atividades"...
bimestre: 1 | 2 | 3 | 4;
valor: number | null;
peso: number;
}

export interface Alerta {
id: string;
alunoId: string;
turmaId: string;
motivo: "FALTAS" | "NOTA" | "AMBOS";
criadoEm: number;
notificado: { aluno: boolean; gestor: boolean };
historico: { em: number; acao: string; porId: string }[];
}

export interface EventoCalendario {
id: string;
titulo: string;
data: string; // AAAA-MM-DD
horaInicio?: string;
horaFim?: string;
tipo: "AULA" | "PROVA" | "ENTREGA" | "FERIADO" | "EVENTO";
turmaId?: string; // ausente = evento institucional
descricao?: string;
}

export interface RegraFrequencia {
frequenciaMinima: number; // %, ex: 75
mediaMinima: number; // ex: 7
pesosAvaliacoes: Record<string, number>;
validadePinMinutos: number;
digitosPin: 4 | 5 | 6;
limiteAlertaFaltas: number; // % de faltas que dispara alerta
prazoJustificativaDias: number;
}

================================================
FILE: supabase/config.toml
================================================

# For detailed configuration reference documentation, visit:

# https://supabase.com/docs/guides/local-development/cli/config

# A string used to distinguish different Supabase projects on the same host. Defaults to the

# working directory name when running `supabase init`.

project_id = "alvora"

[api]
enabled = true

# Port to use for the API URL.

port = 54321

# Schemas to expose in your API. Tables, views and stored procedures in this schema will get API

# endpoints. `public` and `graphql_public` schemas are included by default.

schemas = ["public", "graphql_public"]

# Extra schemas to add to the search_path of every request.

extra_search_path = ["public", "extensions"]

# The maximum number of rows returns from a view, table, or stored procedure. Limits payload size

# for accidental or malicious requests.

max_rows = 1000

# Controls whether new tables, views, sequences and functions created in the `public` schema by

# `postgres` are reachable through the Data API roles (`anon`, `authenticated`, `service_role`)

# without explicit GRANTs, matching the cloud default. Set to `false` to require explicit GRANTs

# instead. Left unset, a fresh project falls back to `true`.

# auto_expose_new_tables = true

[api.tls]

# Enable HTTPS endpoints locally using a self-signed certificate.

enabled = false

# Paths to self-signed certificate pair.

# cert_path = "../certs/my-cert.pem"

# key_path = "../certs/my-key.pem"

[db]

# Port to use for the local database URL.

port = 54322

# Port used by db diff command to initialize the shadow database.

shadow_port = 54320

# Maximum amount of time to wait for health check when starting the local database.

health_timeout = "2m"

# The database major version to use. This has to be the same as your remote database's. Run `SHOW

# server_version;` on the remote database to check.

major_version = 17

[db.pooler]
enabled = false

# Port to use for the local connection pooler.

port = 54329

# Specifies when a server connection can be reused by other clients.

# Configure one of the supported pooler modes: `transaction`, `session`.

pool_mode = "transaction"

# How many server connections to allow per user/database pair.

default_pool_size = 20

# Maximum number of client connections allowed.

max_client_conn = 100

# [db.vault]

# secret_key = "env(SECRET_VALUE)"

[db.migrations]

# If disabled, migrations will be skipped during a db push or reset.

enabled = true

# Specifies an ordered list of schema files, directories, or glob patterns that describe your database.

# Supports paths relative to supabase directory: "./schemas/\*.sql", "./database".

schema_paths = []

[db.seed]

# If enabled, seeds the database after migrations during a db reset.

enabled = true

# Specifies an ordered list of seed files to load during db reset.

# Supports glob patterns relative to supabase directory: "./seeds/\*.sql"

sql_paths = ["./seed.sql"]

[db.network_restrictions]

# Enable management of network restrictions.

enabled = false

# List of IPv4 CIDR blocks allowed to connect to the database.

# Defaults to allow all IPv4 connections. Set empty array to block all IPs.

allowed_cidrs = ["0.0.0.0/0"]

# List of IPv6 CIDR blocks allowed to connect to the database.

# Defaults to allow all IPv6 connections. Set empty array to block all IPs.

allowed_cidrs_v6 = ["::/0"]

# Uncomment to reject non-secure connections to the database.

# [db.ssl_enforcement]

# enabled = true

[realtime]
enabled = true

# Bind realtime via either IPv4 or IPv6. (default: IPv4)

# ip_version = "IPv6"

# The maximum length in bytes of HTTP request headers. (default: 4096)

# max_header_length = 4096

[studio]
enabled = true

# Port to use for Supabase Studio.

port = 54323

# External URL of the API server that frontend connects to.

api_url = "http://127.0.0.1"

# OpenAI API Key to use for Supabase AI in the Supabase Studio.

openai_api_key = "env(OPENAI_API_KEY)"

# Email testing server. Emails sent with the local dev setup are not actually sent - rather, they

# are monitored, and you can view the emails that would have been sent from the web interface.

[local_smtp]
enabled = true

# Port to use for the email testing server web interface.

port = 54324

# Uncomment to expose additional ports for testing user applications that send emails.

# smtp_port = 54325

# pop3_port = 54326

# admin_email = "admin@email.com"

# sender_name = "Admin"

[storage]
enabled = true

# The maximum file size allowed (e.g. "5MB", "500KB").

file_size_limit = "50MiB"

# Uncomment to configure local storage buckets

# [storage.buckets.images]

# public = false

# file_size_limit = "50MiB"

# allowed_mime_types = ["image/png", "image/jpeg"]

# objects_path = "./images"

# Allow connections via S3 compatible clients

[storage.s3_protocol]
enabled = true

# Image transformation API is available to Supabase Pro plan.

# [storage.image_transformation]

# enabled = true

# Store analytical data in S3 for running ETL jobs over Iceberg Catalog

# This feature is only available on the hosted platform.

[storage.analytics]
enabled = false
max_namespaces = 5
max_tables = 10
max_catalogs = 2

# Analytics Buckets is available to Supabase Pro plan.

# [storage.analytics.buckets.my-warehouse]

# Store vector embeddings in S3 for large and durable datasets

[storage.vector]
enabled = true
max_buckets = 10
max_indexes = 5

# Vector Buckets is available to Supabase Pro plan.

# [storage.vector.buckets.documents-openai]

[auth]
enabled = true

# The base URL of your website. Used as an allow-list for redirects and for constructing URLs used

# in emails.

site_url = "http://127.0.0.1:3000"

# The public URL that Auth serves on. Defaults to the API external URL with `/auth/v1` appended.

# external_url = ""

# A list of _exact_ URLs that auth providers are permitted to redirect to post authentication.

additional_redirect_urls = ["https://127.0.0.1:3000"]

# How long tokens are valid for, in seconds. Defaults to 3600 (1 hour), maximum 604,800 (1 week).

jwt_expiry = 3600

# JWT issuer URL. If not set, defaults to auth.external_url.

# jwt_issuer = ""

# Path to JWT signing key. DO NOT commit your signing keys file to git.

# signing_keys_path = "./signing_keys.json"

# If disabled, the refresh token will never expire.

enable_refresh_token_rotation = true

# Allows refresh tokens to be reused after expiry, up to the specified interval in seconds.

# Requires enable_refresh_token_rotation = true.

refresh_token_reuse_interval = 10

# Allow/disallow new user signups to your project.

enable_signup = true

# Allow/disallow anonymous sign-ins to your project.

enable_anonymous_sign_ins = false

# Allow/disallow testing manual linking of accounts

enable_manual_linking = false

# Passwords shorter than this value will be rejected as weak. Minimum 6, recommended 8 or more.

minimum_password_length = 6

# Passwords that do not meet the following requirements will be rejected as weak. Supported values

# are: `letters_digits`, `lower_upper_letters_digits`, `lower_upper_letters_digits_symbols`

password_requirements = ""

# Configure passkey sign-ins.

# [auth.passkey]

# enabled = false

# Configure WebAuthn relying party settings (required when passkey is enabled).

# [auth.webauthn]

# rp_display_name = "Supabase"

# rp_id = "localhost"

# rp_origins = ["http://127.0.0.1:3000"]

[auth.rate_limit]

# Number of emails that can be sent per hour. Requires auth.email.smtp to be enabled.

email_sent = 2

# Number of SMS messages that can be sent per hour. Requires auth.sms to be enabled.

sms_sent = 30

# Number of anonymous sign-ins that can be made per hour per IP address. Requires enable_anonymous_sign_ins = true.

anonymous_users = 30

# Number of sessions that can be refreshed in a 5 minute interval per IP address.

token_refresh = 150

# Number of sign up and sign-in requests that can be made in a 5 minute interval per IP address (excludes anonymous users).

sign_in_sign_ups = 30

# Number of OTP / Magic link verifications that can be made in a 5 minute interval per IP address.

token_verifications = 30

# Number of Web3 logins that can be made in a 5 minute interval per IP address.

web3 = 30

# Configure one of the supported captcha providers: `hcaptcha`, `turnstile`.

# [auth.captcha]

# enabled = true

# provider = "hcaptcha"

# secret = ""

[auth.email]

# Allow/disallow new user signups via email to your project.

enable_signup = true

# If enabled, a user will be required to confirm any email change on both the old, and new email

# addresses. If disabled, only the new email is required to confirm.

double_confirm_changes = true

# If enabled, users need to confirm their email address before signing in.

enable_confirmations = false

# If enabled, users will need to reauthenticate or have logged in recently to change their password.

secure_password_change = false

# Controls the minimum amount of time that must pass before sending another signup confirmation or password reset email.

max_frequency = "1s"

# Number of characters used in the email OTP.

otp_length = 6

# Number of seconds before the email OTP expires (defaults to 1 hour).

otp_expiry = 3600

# Use a production-ready SMTP server

# [auth.email.smtp]

# enabled = true

# host = "smtp.sendgrid.net"

# port = 587

# user = "apikey"

# pass = "env(SENDGRID_API_KEY)"

# admin_email = "admin@email.com"

# sender_name = "Admin"

# Uncomment to customize email template

# [auth.email.template.invite]

# subject = "You have been invited"

# content_path = "./supabase/templates/invite.html"

# Uncomment to customize notification email template

# [auth.email.notification.password_changed]

# enabled = true

# subject = "Your password has been changed"

# content_path = "./supabase/templates/password_changed_notification.html"

[auth.sms]

# Allow/disallow new user signups via SMS to your project.

enable_signup = false

# If enabled, users need to confirm their phone number before signing in.

enable_confirmations = false

# Template for sending OTP to users

template = "Your code is {{ .Code }}"

# Controls the minimum amount of time that must pass before sending another sms otp.

max_frequency = "5s"

# Use pre-defined map of phone number to OTP for testing.

# [auth.sms.test_otp]

# 4152127777 = "123456"

# Configure logged in session timeouts.

# [auth.sessions]

# Force log out after the specified duration.

# timebox = "24h"

# Force log out if the user has been inactive longer than the specified duration.

# inactivity_timeout = "8h"

# This hook runs before a new user is created and allows developers to reject the request based on the incoming user object.

# [auth.hook.before_user_created]

# enabled = true

# uri = "pg-functions://postgres/auth/before-user-created-hook"

# This hook runs before a token is issued and allows you to add additional claims based on the authentication method used.

# [auth.hook.custom_access_token]

# enabled = true

# uri = "pg-functions://<database>/<schema>/<hook_name>"

# Configure one of the supported SMS providers: `twilio`, `twilio_verify`, `messagebird`, `textlocal`, `vonage`.

[auth.sms.twilio]
enabled = false
account_sid = ""
message_service_sid = ""

# DO NOT commit your Twilio auth token to git. Use environment variable substitution instead:

auth_token = "env(SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN)"

# Multi-factor-authentication is available to Supabase Pro plan.

[auth.mfa]

# Control how many MFA factors can be enrolled at once per user.

max_enrolled_factors = 10

# Control MFA via App Authenticator (TOTP)

[auth.mfa.totp]
enroll_enabled = false
verify_enabled = false

# Configure MFA via Phone Messaging

[auth.mfa.phone]
enroll_enabled = false
verify_enabled = false
otp_length = 6
template = "Your code is {{ .Code }}"
max_frequency = "5s"

# Configure MFA via WebAuthn

# [auth.mfa.web_authn]

# enroll_enabled = true

# verify_enabled = true

# Use an external OAuth provider. The full list of providers are: `apple`, `azure`, `bitbucket`,

# `discord`, `facebook`, `github`, `gitlab`, `google`, `keycloak`, `linkedin_oidc`, `notion`, `twitch`,

# `twitter`, `x`, `slack`, `spotify`, `workos`, `zoom`.

[auth.external.apple]
enabled = false
client_id = ""

# DO NOT commit your OAuth provider secret to git. Use environment variable substitution instead:

secret = "env(SUPABASE_AUTH_EXTERNAL_APPLE_SECRET)"

# Overrides the default auth callback URL derived from auth.external_url.

redirect_uri = ""

# Overrides the default auth provider URL. Used to support self-hosted gitlab, single-tenant Azure,

# or any other third-party OIDC providers.

url = ""

# If enabled, the nonce check will be skipped. Required for local sign in with Google auth.

skip_nonce_check = false

# If enabled, it will allow the user to successfully authenticate when the provider does not return an email address.

email_optional = false

# Allow Solana wallet holders to sign in to your project via the Sign in with Solana (SIWS, EIP-4361) standard.

# You can configure "web3" rate limit in the [auth.rate_limit] section and set up [auth.captcha] if self-hosting.

[auth.web3.solana]
enabled = false

# Use Firebase Auth as a third-party provider alongside Supabase Auth.

[auth.third_party.firebase]
enabled = false

# project_id = "my-firebase-project"

# Use Auth0 as a third-party provider alongside Supabase Auth.

[auth.third_party.auth0]
enabled = false

# tenant = "my-auth0-tenant"

# tenant_region = "us"

# Use AWS Cognito (Amplify) as a third-party provider alongside Supabase Auth.

[auth.third_party.aws_cognito]
enabled = false

# user_pool_id = "my-user-pool-id"

# user_pool_region = "us-east-1"

# Use Clerk as a third-party provider alongside Supabase Auth.

[auth.third_party.clerk]
enabled = false

# Obtain from https://clerk.com/setup/supabase

# domain = "example.clerk.accounts.dev"

# OAuth server configuration

[auth.oauth_server]

# Enable OAuth server functionality

enabled = false

# Path for OAuth consent flow UI

authorization_url_path = "/oauth/consent"

# Allow dynamic client registration

allow_dynamic_registration = false

[edge_runtime]
enabled = true

# Supported request policies: `oneshot`, `per_worker`.

# `per_worker` (default) — enables hot reload during local development.

# `oneshot` — fallback mode if hot reload causes issues (e.g. in large repos or with symlinks).

policy = "per_worker"

# Port to attach the Chrome inspector for debugging edge functions.

inspector_port = 8083

# The Deno major version to use.

deno_version = 2

# [edge_runtime.secrets]

# secret_key = "env(SECRET_VALUE)"

[analytics]
enabled = true
port = 54327

# Configure one of the supported backends: `postgres`, `bigquery`.

backend = "postgres"

# Experimental features may be deprecated any time

[experimental]

# Configures Postgres storage engine to use OrioleDB (S3)

orioledb_version = ""

# Configures S3 bucket URL, eg. <bucket_name>.s3-<region>.amazonaws.com

s3_host = "env(S3_HOST)"

# Configures S3 bucket region, eg. us-east-1

s3_region = "env(S3_REGION)"

# Configures AWS_ACCESS_KEY_ID for S3 bucket

s3_access_key = "env(S3_ACCESS_KEY)"

# Configures AWS_SECRET_ACCESS_KEY for S3 bucket

s3_secret_key = "env(S3_SECRET_KEY)"

# pg-delta is the schema diff engine for db diff / db pull / db remote commit.

# Set enabled = false to fall back to the legacy migra engine.

[experimental.pgdelta]
enabled = true

# Directory under `supabase/` where declarative files are written.

# declarative_schema_path = "./schemas"

# JSON string passed through to pg-delta SQL formatting. When omitted, SQL is

# formatted with uppercase keywords, indent 2, max width 180, trailing commas,

# and column/key alignment. Set to "null" to emit raw, unformatted SQL.

# format_options = "{\"keywordCase\":\"upper\",\"indent\":2,\"maxWidth\":180,\"commaStyle\":\"trailing\"}"

[functions.criar-usuario]
enabled = true
verify_jwt = false
import_map = "./functions/criar-usuario/deno.json"

# Uncomment to specify a custom file path to the entrypoint.

# Supported file extensions are: .ts, .js, .mjs, .jsx, .tsx

entrypoint = "./functions/criar-usuario/index.ts"

# Specifies static files to be bundled with the function. Supports glob patterns.

# For example, if you want to serve static HTML pages in your function:

# static_files = [ "./functions/criar-usuario/*.html" ]

================================================
FILE: supabase/functions/criar-usuario/deno.json
================================================
{
"imports": {
"@supabase/functions-js": "jsr:@supabase/functions-js@^2",
"@supabase/server": "npm:@supabase/server@^1"
}
}

================================================
FILE: supabase/functions/criar-usuario/index.ts
================================================
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
"Access-Control-Allow-Origin": "\*",
"Access-Control-Allow-Headers":
"authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
new Response(JSON.stringify(body), {
status,
headers: { ...cors, "Content-Type": "application/json" },
});

Deno.serve(async (req) => {
if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

try {
const url = Deno.env.get("SUPABASE_URL")!;
const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // 1. Quem está chamando?
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const {
      data: { user },
    } = await admin.auth.getUser(token);
    if (!user) return json({ erro: "Não autenticado." }, 401);

    // 2. É admin?
    const { data: perfil } = await admin
      .from("profiles")
      .select("papel")
      .eq("id", user.id)
      .single();
    if (perfil?.papel !== "admin") return json({ erro: "Apenas admins." }, 403);

    // 3. Valida os dados
    const { email, senha, papel } = await req.json();
    if (!email || !senha || senha.length < 6)
      return json({ erro: "E-mail e senha (mín. 6) são obrigatórios." }, 400);
    if (!["aluno", "professor", "admin"].includes(papel))
      return json({ erro: "Papel inválido." }, 400);

    // 4. Cria o usuário
    const { data: novo, error } = await admin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });
    if (error) return json({ erro: error.message }, 400);

    // 5. Grava o papel
    const { error: errPerfil } = await admin
      .from("profiles")
      .upsert({ id: novo.user.id, papel });
    if (errPerfil) return json({ erro: errPerfil.message }, 400);

    return json({ ok: true, id: novo.user.id });

} catch (e) {
return json({ erro: (e as Error).message }, 500);
}
});

================================================
FILE: supabase/functions/criar-usuario/.npmrc
================================================

# Configuration for private npm package dependencies

# For more information on using private registries with Edge Functions, see:

# https://supabase.com/docs/guides/functions/import-maps#importing-from-private-registries
