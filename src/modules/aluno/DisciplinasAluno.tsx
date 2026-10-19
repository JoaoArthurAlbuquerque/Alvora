import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  CalendarClock,
  ArrowRight,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { PageHeader } from "../../core/ui/PageHeader";
import { IconBubble } from "../../core/ui/IconBubble";
import { EstadoConsulta } from "../../core/ui/EstadoConsulta";
import { situacaoFrequencia } from "../../services/diarioStore";
import { useAlunoDados } from "./useAlunoDados";
import { BADGE_FREQ, CORES_DISC } from "./constantes";

const fmt = (v: number | null | undefined) => (v == null ? "—" : v.toFixed(1));

export const DisciplinasAluno: React.FC = () => {
  const { historico, boletim, carregando, erro } = useAlunoDados();
  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Minhas disciplinas"
        descricao={`${historico.length} disciplina${historico.length === 1 ? "" : "s"} neste semestre 📚`}
      />
      <EstadoConsulta
        carregando={carregando}
        erro={erro}
        vazio={!historico.length}
        textoVazio="Nenhuma disciplina com aulas registradas ainda 📚"
        onTentar={() => location.reload()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
          {historico.map((d, i) => {
            const dadas = d.presencas + d.faltas;
            const prog = d.totalAulas
              ? Math.min(100, (dadas / d.totalAulas) * 100)
              : 0;
            const badge =
              BADGE_FREQ[situacaoFrequencia(d.percentualFrequencia)];
            // Mesmo boletim do useAlunoDados (respeita o RLS de `notas`)
            const notas = boletim.find((b) => b.id === d.disciplinaId);
            const infos = [
              {
                icone: CheckCircle2,
                valor: d.presencas,
                label: "presenças",
                cor: "text-emerald-500",
              },
              {
                icone: XCircle,
                valor: d.faltas,
                label: "faltas",
                cor: "text-rose-500",
              },
              {
                icone: CalendarClock,
                valor: Math.max(0, d.totalAulas - dadas),
                label: "restantes",
                cor: "text-primary",
              },
            ];
            return (
              <Card key={d.disciplinaId} className="space-y-5">
                <div className="flex items-start gap-4">
                  <IconBubble
                    icone={BookOpen}
                    cor={CORES_DISC[i % CORES_DISC.length]}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-ink truncate">
                      {d.disciplinaNome}
                    </h3>
                    {notas?.professorNome && (
                      <p className="text-xs text-slate-500 truncate">
                        {notas.professorNome}
                      </p>
                    )}
                  </div>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {infos.map(({ icone: I, valor, label, cor }) => (
                    <div
                      key={label}
                      className="rounded-xl bg-slate-50 p-2.5 text-center"
                    >
                      <I size={15} className={`mx-auto ${cor}`} aria-hidden />
                      <p className="text-base font-extrabold text-ink tabular mt-1">
                        {valor}
                      </p>
                      <p className="text-[11px] text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1.5 tabular">
                    <span>Aulas concluídas</span>
                    <span className="text-ink font-bold">
                      {dadas} / {d.totalAulas}
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`Aulas concluídas em ${d.disciplinaNome}`}
                    aria-valuenow={Math.round(prog)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="h-2 bg-slate-100 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-brand rounded-full animate-grow"
                      style={{ width: `${prog}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <p className="text-xs text-slate-500 tabular">
                    AV1 <b className="text-ink">{fmt(notas?.av1)}</b> · AV2{" "}
                    <b className="text-ink">{fmt(notas?.av2)}</b> · Média{" "}
                    <b className="text-primary">{fmt(notas?.mediaParcial)}</b>
                  </p>
                  <Link
                    to="/aluno/boletim"
                    className="text-xs font-semibold text-primary flex items-center gap-1 rounded hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
                  >
                    Ver notas <ArrowRight size={12} aria-hidden />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </EstadoConsulta>
    </div>
  );
};
