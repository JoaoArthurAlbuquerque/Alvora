import React, { useState } from "react";
import type { TabProfessor } from "../../types";
import { cn } from "../../core/lib/utils";
import { ABAS } from "./constantes";
import { InicioProfessor } from "./InicioProfessor";
import { LancamentoFrequencia } from "./LancamentoFrequencia";
import { NotasProfessor } from "./NotasProfessor";
import { ConteudosProfessor } from "./ConteudosProfessor";

export const PortalProfessor: React.FC = () => {
  const [aba, setAba] = useState<TabProfessor>("dashboard");

  return (
    <div className="space-y-6">
      <nav className="flex gap-1.5 p-1.5 rounded-2xl bg-white shadow-flat overflow-x-auto">
        {ABAS.map(({ id, label, icone: I }) => (
          <button
            key={id}
            onClick={() => setAba(id)}
            className={cn(
              "flex items-center gap-2 px-4 h-10 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200",
              aba === id
                ? "bg-brand text-white shadow-glow"
                : "text-slate-500 hover:bg-primary/5 hover:text-primary",
            )}
          >
            <I size={15} /> {label}
          </button>
        ))}
      </nav>

      <div key={aba} className="animate-fade-up">
        {aba === "dashboard" && <InicioProfessor onNavegar={setAba} />}
        {aba === "diario" && <LancamentoFrequencia />}
        {aba === "notas" && <NotasProfessor />}
        {aba === "conteudos" && <ConteudosProfessor />}
      </div>
    </div>
  );
};
