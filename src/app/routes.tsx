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
