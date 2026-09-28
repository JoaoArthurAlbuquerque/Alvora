import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../core/auth/useAuthStore";
import type { PapelUsuario } from "../types";

interface Props {
  papeis?: PapelUsuario[];
}

export const ProtectedRoute: React.FC<Props> = ({ papeis }) => {
  const usuario = useAuthStore((s) => s.usuario);
  const validarSessao = useAuthStore((s) => s.validarSessao);
  const raiz = !papeis;
  const [checando, setChecando] = useState(raiz && !!usuario);

  useEffect(() => {
    if (!raiz || !usuario) return;
    let vivo = true;
    validarSessao().finally(() => vivo && setChecando(false));
    return () => {
      vivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checando)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );

  if (!usuario) return <Navigate to="/login" replace />;
  // Perfil sem permissão volta para o próprio portal
  if (papeis && !papeis.includes(usuario.papel))
    return <Navigate to={`/${usuario.papel}`} replace />;

  return <Outlet />;
};
