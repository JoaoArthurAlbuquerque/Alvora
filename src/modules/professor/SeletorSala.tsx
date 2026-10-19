import React from "react";
import type { Sala } from "../../services/api/turmas";
import { EstadoConsulta } from "../../core/ui/EstadoConsulta";
import { useSalaSelecionada } from "./useSalaSelecionada";

export const SeletorSala: React.FC<{
  salas: Sala[];
  valor?: string;
  onChange: (id: string) => void;
}> = ({ salas, valor, onChange }) =>
  salas.length > 1 ? (
    <select
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Turma e disciplina"
      className="h-10 px-3 rounded-xl bg-white shadow-flat-sm text-sm font-bold text-ink focus:outline-none focus:ring-4 focus:ring-primary/10"
    >
      {salas.map((s) => (
        <option key={s.id} value={s.id}>
          {s.turmaNome} · {s.disciplinaNome}
        </option>
      ))}
    </select>
  ) : null;

type RenderSala = (s: Sala) => React.ReactNode;

/** Busca as salas sozinho quando a tela é aberta direto pela rota */
const SalaAutomatica: React.FC<{ children: RenderSala }> = ({ children }) => {
  const { salas, sala, setId, carregando, erro, recarregar } =
    useSalaSelecionada();
  return (
    <div className="space-y-4">
      {/* Turma e disciplina sempre visíveis, mesmo com uma só sala */}
      {sala && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Turma: <b className="text-ink">{sala.turmaNome}</b> · Disciplina:{" "}
            <b className="text-ink">{sala.disciplinaNome}</b>
          </p>
          <SeletorSala salas={salas} valor={sala.id} onChange={setId} />
        </div>
      )}
      <EstadoConsulta
        carregando={carregando}
        erro={erro}
        vazio={!sala}
        textoVazio="Nenhuma disciplina vinculada a você ainda. Peça ao gestor para associar suas turmas."
        onTentar={() => recarregar()}
      >
        {sala && <div key={sala.id}>{children(sala)}</div>}
      </EstadoConsulta>
    </div>
  );
};

/** Usa a sala recebida por prop ou carrega as do professor logado */
export const ComSala: React.FC<{ sala?: Sala; children: RenderSala }> = ({
  sala,
  children,
}) =>
  sala ? <>{children(sala)}</> : <SalaAutomatica>{children}</SalaAutomatica>;
