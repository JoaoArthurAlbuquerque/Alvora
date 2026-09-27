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
