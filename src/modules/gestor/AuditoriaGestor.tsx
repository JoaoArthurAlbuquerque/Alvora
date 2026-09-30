import React, { useMemo, useState } from "react";
import { RefreshCw, Search, ScrollText } from "lucide-react";
import { Card } from "@/core/ui/Card";
import { PageHeader } from "@/core/ui/PageHeader";
import { Badge } from "@/core/ui/Badge";
import { Button } from "@/core/ui/Button";
import { EstadoConsulta } from "@/core/ui/EstadoConsulta";
import { cn } from "@/core/lib/utils";
import { carregarAuditoria, useConsulta } from "@/services/escolaService";

const selo = (s: string) =>
  s === "PRESENTE"
    ? ({ variant: "success", label: "Presente" } as const)
    : ({ variant: "danger", label: "Falta" } as const);

/** "AAAA-MM-DD" → meio-dia local (evita o bug do dia anterior por fuso) */
const dataBR = (v: string) => {
  if (!v) return "—";
  const d = new Date(v.length === 10 ? `${v}T12:00:00` : v);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("pt-BR");
};

const FILTROS = ["TODOS", "PRESENTE", "FALTA"] as const;
const ROTULO: Record<(typeof FILTROS)[number], string> = {
  TODOS: "Todos",
  PRESENTE: "Presenças",
  FALTA: "Faltas",
};

export const AuditoriaGestor: React.FC = () => {
  const { data, erro, carregando, recarregar } = useConsulta(carregarAuditoria);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>("TODOS");

  const itens = useMemo(() => {
    const q = busca.toLowerCase();
    return (data ?? []).filter(
      (r) =>
        (filtro === "TODOS" || r.status === filtro) &&
        (!q ||
          [r.aluno, r.disciplina, r.turma, r.professor].some((s) =>
            s.toLowerCase().includes(q),
          )),
    );
  }, [data, busca, filtro]);

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Auditoria"
        descricao="Últimos 100 registros de presença 🕵️"
        acao={
          <Button
            variant="outline"
            size="sm"
            onClick={recarregar}
            icon={<RefreshCw size={14} />}
          >
            Atualizar
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Aluno, disciplina, turma ou professor..."
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-primary/15 bg-white text-sm outline-none focus:ring-4 focus:ring-primary/15"
          />
        </div>
        <div className="flex gap-1.5 p-1.5 rounded-2xl bg-white shadow-flat">
          {FILTROS.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={cn(
                "px-4 h-8 rounded-xl text-xs font-bold transition",
                filtro === f
                  ? "bg-brand text-white shadow-glow"
                  : "text-slate-500 hover:bg-primary/5",
              )}
            >
              {ROTULO[f]}
            </button>
          ))}
        </div>
      </div>

      <EstadoConsulta
        carregando={carregando}
        erro={erro}
        vazio={!itens.length}
        textoVazio="Nenhum registro encontrado."
        onTentar={recarregar}
      >
        <Card padded={false} className="divide-y divide-slate-100">
          {itens.map((r) => {
            const s = selo(r.status);
            return (
              <div key={r.id} className="flex items-center gap-3 p-4">
                <ScrollText size={16} className="text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {r.aluno}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {r.disciplina} · {r.turma} · {r.professor}
                  </p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <Badge variant={s.variant}>{s.label}</Badge>
                  <p className="text-[10px] text-slate-400">
                    {dataBR(r.quando)}
                  </p>
                </div>
              </div>
            );
          })}
        </Card>
      </EstadoConsulta>
    </div>
  );
};
