import type { ComponentType } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppLayout } from "./Applayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../modules/autenticacao/LoginPage";
import { EmConstrucao } from "../core/ui/EmConstrucao";
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

/** Carrega um componente nomeado sob demanda */
const tela =
  <K extends string>(
    importar: () => Promise<Record<K, ComponentType>>,
    nome: K,
  ) =>
  async () => ({ Component: (await importar())[nome] });

const placeholder = (paths: string[]) =>
  paths.map((path) => ({ path, element: <EmConstrucao /> }));

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        HydrateFallback: Carregando,
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
                  ...placeholder(["calendario", "perfil"]),
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
              ...placeholder(["turmas", "alertas", "calendario", "perfil"]),
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
  { path: "*", element: <RedirecionarPorPapel /> },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
