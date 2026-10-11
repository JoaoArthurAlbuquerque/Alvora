<div align="center">

<img src="./public/alvora_blue.svg" alt="Alvora" width="140" />

### Gestão Escolar & AVA Inteligente

**Presença auditada por engajamento. Risco de evasão detectado antes que seja tarde.**

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)

</div>

---

## ✨ Sobre

O **Alvora** une **gestão escolar** e **ambiente virtual de aprendizagem assíncrono** numa só plataforma. A ideia é simples: a escola não deveria descobrir que perdeu um aluno só no fim do semestre.

Para isso, o Alvora cruza **frequência, notas e engajamento** e avisa professores e gestores **enquanto ainda dá tempo de agir**.

---

## 🎯 Funcionalidades

### 👩‍🎓 Portal do Aluno
- **Chamada por PIN:** a presença é registrada com o código temporário exibido pelo professor
- **Frequência e notas** em tempo real, com situação por disciplina
- **Justificativas de falta** com envio de atestado
- **Calendário** com entregas, avaliações, feriados e eventos

### 👨‍🏫 Portal do Professor
- **PIN de chamada** com expiração automática
- **Diário de classe** e lançamento de frequência
- **Notas** (AV1, AV2 e média) com cálculo automático
- **Radar de risco:** alertas de alunos perto da reprovação por falta ou nota
- **Assistente Pedagógico com IA**

### 🏫 Portal do Gestor
- **Gestão de turmas:** grade, vínculo de professores e matrículas
- **Administração de usuários** por perfil
- **Análise de justificativas** e abonos
- **Auditoria** das ações da plataforma
- **Regras escolares configuráveis:** frequência mínima, média, prazos e PIN

### 🌐 Recursos gerais
- **Central de Dúvidas**
- **Sincronização em tempo real** entre dispositivos
- **Segurança por perfil** com Row Level Security (RLS)

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| **Front-end** | React + TypeScript |
| **Build** | Vite |
| **Estilo** | Tailwind CSS |
| **Estado e cache** | TanStack Query |
| **Ícones** | Lucide React |
| **Back-end** | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| **Funções serverless** | Supabase Edge Functions (Deno) |
| **Segurança** | Row Level Security + RPCs `security definer` |

---

## 📁 Estrutura

```
src/
├── app/          # Layout, rotas e navegação
├── core/         # Auth, UI base e utilitários
├── modules/      # aluno · professor · gestor · calendario · central-duvidas · assistente-pedagogico
├── services/     # Integração com o Supabase (API, hooks e regras)
├── config/       # Regras escolares
└── lib/          # Cliente Supabase
supabase/
└── functions/    # Edge Functions (ex.: criar-usuario)
```

---

## 🚀 Como rodar

**Pré-requisitos:** Node.js 18+ e um projeto no [Supabase](https://supabase.com).

```bash
# 1. Clonar e instalar
git clone <url-do-repositorio>
cd alvora
npm install

# 2. Configurar as variáveis de ambiente
cp .env.example .env

# 3. Rodar em desenvolvimento
npm run dev

# 4. Gerar o build de produção
npm run build
```

### 🔐 Variáveis de ambiente

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

> ⚠️ A `SUPABASE_SERVICE_ROLE_KEY` **nunca** vai para o front-end. Ela fica apenas nos secrets das Edge Functions.

---

## 👥 Perfis de acesso

| Perfil | O que acessa |
|---|---|
| 🎓 **Aluno** | Suas frequências, notas, justificativas e calendário |
| 👩‍🏫 **Professor** | Suas turmas, diário, chamada, notas e radar de risco |
| 🏫 **Gestor** | Toda a escola: turmas, usuários, regras e auditoria |

---

<div align="center">

Feito com 💜 para que **nenhum aluno fique pelo caminho**.

</div>
