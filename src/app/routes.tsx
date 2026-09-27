import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AppLayout } from "./Applayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../modules/autenticacao/LoginPage";
import { PortalAluno } from "../modules/aluno/PortalAluno";
import { PortalProfessor } from "../modules/professor/PortalProfessor";
import { PortalGestor } from "../modules/gestor/PortalGestor";
import { LancamentoFrequencia } from "../modules/professor/LancamentoFrequencia";
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
              { index: true, element: <PortalAluno /> },
              ...placeholder([
                "disciplinas",
                "frequencia",
                "boletim",
                "secretaria",
                "calendario",
                "perfil",
              ]),
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
