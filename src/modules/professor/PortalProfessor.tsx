// =====================================================================
// src/modules/professor/PortalProfessor.tsx
// =====================================================================
import React, { useState } from "react";
import type { TabProfessor } from "../../types";
import { cn } from "../../core/lib/utils";
import { EstadoConsulta } from "../../core/ui/EstadoConsulta";
import { ABAS } from "./constantes";
import { SeletorSala } from "./SeletorSala";
import { useSalaSelecionada } from "./useSalaSelecionada";
import { InicioProfessor } from "./InicioProfessor";
import { LancamentoFrequencia } from "./LancamentoFrequencia";
import { NotasProfessor } from "./NotasProfessor";
import { ConteudosProfessor } from "./ConteudosProfessor";

export const PortalProfessor: React.FC = () => {
  const [aba, setAba] = useState<TabProfessor>("dashboard");
  const { salas, sala, setId, carregando, erro, recarregar } =
    useSalaSelecionada();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <nav className="flex-1 flex gap-1.5 p-1.5 rounded-2xl bg-white shadow-flat overflow-x-auto">
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
        <SeletorSala salas={salas} valor={sala?.id} onChange={setId} />
      </div>

      <EstadoConsulta
        carregando={carregando}
        erro={erro}
        vazio={!sala}
        textoVazio="Nenhuma disciplina vinculada a você ainda. Peça ao gestor para associar suas turmas."
        onTentar={() => recarregar()}
      >
        {sala && (
          <div key={`${aba}-${sala.id}`} className="animate-fade-up">
            {aba === "dashboard" && (
              <InicioProfessor
                sala={sala}
                salas={salas}
                onSelecionar={setId}
                onNavegar={setAba}
              />
            )}
            {aba === "diario" && <LancamentoFrequencia sala={sala} />}
            {aba === "notas" && <NotasProfessor sala={sala} />}
            {aba === "conteudos" && <ConteudosProfessor sala={sala} />}
          </div>
        )}
      </EstadoConsulta>
    </div>
  );
};
