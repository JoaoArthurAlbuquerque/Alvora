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
