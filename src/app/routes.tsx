// =====================================================================
// src/app/routes.tsx
// =====================================================================
import type { ComponentType } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";
import { Loader2, RefreshCw } from "lucide-react";
import { AppLayout } from "./Applayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../modules/autenticacao/LoginPage";
import { useAuthStore } from "../core/auth/useAuthStore";

function RedirecionarPorPapel() {
  const usuario = useAuthStore((s) => s.usuario);
  return <Navigate to={usuario ? `/${usuario.papel}` : "/login"} replace />;
}

function Carregando() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={28} className="animate-spin text-primary" />
    </div>
  );
}

/** Tela amigável no lugar do "Unexpected Application Error" */
function ErroRota() {
  const erro = useRouteError();
  const mensagem = isRouteErrorResponse(erro)
    ? `${erro.status} · ${erro.statusText}`
    : erro instanceof Error
      ? erro.message
      : "Erro desconhecido";
  // Deploy novo ou HMR quebrado: o módulo antigo não existe mais
  const moduloAntigo =
    /dynamically imported module|Importing a module script failed/i.test(
      mensagem,
    );

  return (
    <div
      role="alert"
      className="max-w-md mx-auto py-20 px-4 text-center space-y-4"
    >
      <p className="text-4xl" aria-hidden>
        😅
      </p>
      <h1 className="text-xl font-extrabold text-ink">Ops, algo deu errado</h1>
      <p className="text-sm text-slate-500">
        {moduloAntigo
          ? "Esta tela foi atualizada. Recarregue para pegar a versão nova."
          : "Não conseguimos abrir esta tela agora."}
      </p>
      {import.meta.env.DEV && (
        <pre className="text-left text-[11px] text-rose-600 bg-rose-50 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap">
          {mensagem}
        </pre>
      )}
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => location.reload()}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-brand text-white text-sm font-bold shadow-glow cursor-pointer hover:-translate-y-0.5 transition-transform"
        >
          <RefreshCw size={15} aria-hidden /> Recarregar
        </button>
        <a
          href="/"
          className="inline-flex items-center h-10 px-5 rounded-full border-[1.5px] border-primary/25 bg-white text-primary text-sm font-bold hover:bg-primary/5"
        >
          Ir para o início
        </a>
      </div>
    </div>
  );
}

/** Carrega um componente nomeado sob demanda */
const tela =
  <K extends string>(
    importar: () => Promise<Record<K, ComponentType>>,
    nome: K,
  ) =>
  async () => ({ Component: (await importar())[nome] });

/** Rotas públicas (funcionam com ou sem login) */
const rotaPublica = <K extends string>(
  path: string,
  importar: () => Promise<Record<K, ComponentType>>,
  nome: K,
) => ({
  path,
  errorElement: <ErroRota />,
  HydrateFallback: Carregando,
  lazy: tela(importar, nome),
});

/** Rotas compartilhadas pelos perfis */
const rotaCalendario = () => ({
  path: "calendario",
  lazy: tela(
    () => import("../modules/calendario/CalendarioPage"),
    "CalendarioPage",
  ),
});
const rotaPerfil = () => ({
  path: "perfil",
  lazy: tela(() => import("../modules/perfil/PerfilPage"), "PerfilPage"),
});
const rotaTurmas = () => ({
  path: "turmas",
  lazy: tela(() => import("../modules/turmas/TurmasPage"), "TurmasPage"),
});

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage />, errorElement: <ErroRota /> },

  // ▼ Públicas
  rotaPublica(
    "/redefinir-senha",
    () => import("../modules/autenticacao/RedefinirSenhaPage"),
    "RedefinirSenhaPage",
  ),
  rotaPublica(
    "/privacidade",
    () => import("../modules/institucional/PrivacidadeSuportePage"),
    "PrivacidadeSuportePage",
  ),
  rotaPublica(
    "/suporte",
    () => import("../modules/institucional/PrivacidadeSuportePage"),
    "PrivacidadeSuportePage",
  ),

  // ▼ Protegidas
  {
    element: <ProtectedRoute />,
    errorElement: <ErroRota />,
    children: [
      {
        element: <AppLayout />,
        HydrateFallback: Carregando,
        children: [
          {
            // Erro numa tela não derruba o menu: aparece dentro do layout
            errorElement: <ErroRota />,
            children: [
              { index: true, element: <RedirecionarPorPapel /> },
              {
                path: "aluno",
                element: <ProtectedRoute papeis={["aluno"]} />,
                children: [
                  {
                    lazy: tela(
                      () => import("../modules/aluno/AlunoShell"),
                      "AlunoShell",
                    ),
                    children: [
                      {
                        index: true,
                        lazy: tela(
                          () => import("../modules/aluno/PortalAluno"),
                          "PortalAluno",
                        ),
                      },
                      {
                        path: "disciplinas",
                        lazy: tela(
                          () => import("../modules/aluno/DisciplinasAluno"),
                          "DisciplinasAluno",
                        ),
                      },
                      {
                        path: "frequencia",
                        lazy: tela(
                          () => import("../modules/aluno/FrequenciaAluno"),
                          "FrequenciaAluno",
                        ),
                      },
                      {
                        path: "boletim",
                        lazy: tela(
                          () => import("../modules/aluno/BoletimAluno"),
                          "BoletimAluno",
                        ),
                      },
                      {
                        path: "secretaria",
                        lazy: tela(
                          () => import("../modules/aluno/SecretariaAluno"),
                          "SecretariaAluno",
                        ),
                      },
                      rotaCalendario(),
                      rotaPerfil(),
                    ],
                  },
                ],
              },
              {
                path: "professor",
                element: <ProtectedRoute papeis={["professor"]} />,
                children: [
                  {
                    index: true,
                    lazy: tela(
                      () => import("../modules/professor/PortalProfessor"),
                      "PortalProfessor",
                    ),
                  },
                  {
                    path: "frequencia",
                    lazy: tela(
                      () => import("../modules/professor/LancamentoFrequencia"),
                      "LancamentoFrequencia",
                    ),
                  },
                  {
                    path: "notas",
                    lazy: tela(
                      () => import("../modules/professor/NotasProfessor"),
                      "NotasProfessor",
                    ),
                  },
                  {
                    path: "alertas",
                    lazy: tela(
                      () => import("../modules/professor/AlertasProfessor"),
                      "AlertasProfessor",
                    ),
                  },
                  rotaTurmas(),
                  rotaCalendario(),
                  rotaPerfil(),
                ],
              },
              {
                path: "gestor",
                element: <ProtectedRoute papeis={["gestor"]} />,
                children: [
                  {
                    index: true,
                    lazy: tela(
                      () => import("../modules/gestor/PortalGestor"),
                      "PortalGestor",
                    ),
                  },
                  {
                    path: "usuarios",
                    lazy: tela(
                      () => import("../modules/gestor/AdminUsuarios"),
                      "AdminUsuarios",
                    ),
                  },
                  {
                    path: "regras",
                    lazy: tela(
                      () => import("../modules/gestor/RegrasGestor"),
                      "RegrasGestor",
                    ),
                  },
                  {
                    path: "professores",
                    lazy: tela(
                      () => import("../modules/gestor/ProfessoresGestor"),
                      "ProfessoresGestor",
                    ),
                  },
                  {
                    path: "auditoria",
                    lazy: tela(
                      () => import("../modules/gestor/AuditoriaGestor"),
                      "AuditoriaGestor",
                    ),
                  },
                  {
                    path: "turmas",
                    lazy: tela(
                      () => import("../modules/gestor/turmas/GestaoTurmas"),
                      "GestaoTurmas",
                    ),
                  },
                  rotaCalendario(),
                  rotaPerfil(),
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <RedirecionarPorPapel /> }, // sempre por último
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
