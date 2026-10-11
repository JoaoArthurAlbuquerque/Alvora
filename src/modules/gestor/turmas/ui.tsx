// src/modules/gestor/turmas/ui.tsx (só componentes)
import React from "react";

export const Campo: React.FC<{
  label: string;
  children: React.ReactNode;
  dica?: string;
}> = ({ label, children, dica }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-bold text-slate-500">{label}</span>
    {children}
    {dica && <span className="block text-[11px] text-slate-400">{dica}</span>}
  </label>
);

export const ErroForm: React.FC<{ erro: string | null }> = ({ erro }) =>
  erro ? (
    <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-xl">{erro}</p>
  ) : null;
