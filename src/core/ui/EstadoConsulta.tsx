import React from "react";
import { AlertCircle, Inbox } from "lucide-react";
import { Skeleton } from "./Skeleton";
import { Button } from "./Button";

export const EstadoConsulta: React.FC<{
  carregando: boolean;
  erro: string | null;
  vazio: boolean;
  textoVazio: string;
  onTentar: () => void;
  children: React.ReactNode;
}> = ({ carregando, erro, vazio, textoVazio, onTentar, children }) => {
  if (carregando)
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  if (erro)
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <AlertCircle className="text-rose-500" />
        <p className="text-sm text-rose-600">{erro}</p>
        <Button size="sm" variant="outline" onClick={onTentar}>
          Tentar de novo
        </Button>
      </div>
    );
  if (vazio)
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
        <Inbox />
        <p className="text-sm">{textoVazio}</p>
      </div>
    );
  return <>{children}</>;
};
