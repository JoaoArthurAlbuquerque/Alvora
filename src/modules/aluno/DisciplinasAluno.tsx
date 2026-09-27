import React from "react";
import { BookOpen, CheckCircle2, XCircle, CalendarClock } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { PageHeader } from "../../core/ui/PageHeader";
import { IconBubble } from "../../core/ui/IconBubble";
import { situacaoFrequencia } from "../../services/diarioStore";
import { boletimAlunoMock } from "../../mocks/data";
import { useAlunoDados } from "./useAlunoDados";
import { BADGE_FREQ, CORES_DISC } from "./constantes";

export const DisciplinasAluno: React.FC = () => {
  const { historico } = useAlunoDados();
  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Minhas disciplinas"
        descricao={`${historico.length} disciplinas neste semestre 📚`}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
        {historico.map((d, i) => {
          const dadas = d.presencas + d.faltas;
          const prog = d.totalAulas
            ? Math.min(100, (dadas / d.totalAulas) * 100)
            : 0;
          const badge = BADGE_FREQ[situacaoFrequencia(d.percentualFrequencia)];
          const prof = boletimAlunoMock.find(
            (b) => b.id === d.disciplinaId,
          )?.professorNome;
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
            <Card key={d.disciplinaId} hoverable className="space-y-5">
              <div className="flex items-start gap-4">
                <IconBubble
                  icone={BookOpen}
                  cor={CORES_DISC[i % CORES_DISC.length]}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-ink truncate">
                    {d.disciplinaNome}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">{prof}</p>
                </div>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {infos.map(({ icone: I, valor, label, cor }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-slate-50 group-hover:bg-primary/5 transition-colors p-2.5 text-center"
                  >
                    <I size={15} className={`mx-auto ${cor}`} />
                    <p className="text-base font-extrabold text-ink tabular mt-1">
                      {valor}
                    </p>
                    <p className="text-[10px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1.5 tabular">
                  <span>Aulas concluídas</span>
                  <span className="text-ink font-bold">
                    {dadas} / {d.totalAulas}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full animate-grow"
                    style={{ width: `${prog}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
