import React from "react";
import {
  Activity,
  ClipboardCheck,
  AlertTriangle,
  Radar,
  Users,
  Moon,
  Sun,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";
import {
  useFrequenciaTurma,
  LIMITE_FALTAS_PCT,
  TURMA_ID,
} from "../../services/frequenciaTurma";
import { useRadarRisco } from "../../services/radarRisco";
import { useMediasTurma } from "../../services/notas";
import { FREQ_MINIMA, MEDIA_MINIMA } from "../../config/regras";
import type { TabProfessor } from "../../types";
import { cn } from "../../core/lib/utils";
import { ESTILO_RISCO, PROFESSOR_ID, pad, iniciais } from "./constantes";

export const InicioProfessor: React.FC<{
  onNavegar: (t: TabProfessor) => void;
}> = ({ onNavegar }) => {
  const { alunos, mediaFrequencia, diasRegistrados, diarioHojeSalvo } =
    useFrequenciaTurma();
  const medias = useMediasTurma(alunos);
  const { itens: radar, contagem } = useRadarRisco(
    alunos,
    medias,
    TURMA_ID,
    PROFESSOR_ID,
  );
  const freqOk = mediaFrequencia >= FREQ_MINIMA;
  const turmaTranquila = contagem.alertas === 0 && contagem.atencao === 0;

  const kpis = [
    {
      label: "Frequência média",
      valor: `${mediaFrequencia}%`,
      sub: `${diasRegistrados} diário(s) lançado(s)`,
      icone: Activity,
      cor: freqOk ? "emerald" : "rose",
    },
    {
      label: "Diário de hoje",
      valor: diarioHojeSalvo ? "Salvo" : "Pendente",
      sub: diarioHojeSalvo ? "Tudo em dia ✓" : "Faça a chamada 📣",
      icone: ClipboardCheck,
      cor: diarioHojeSalvo ? "emerald" : "amber",
    },
    {
      label: "Alertas",
      valor: pad(contagem.alertas),
      sub: contagem.atencao
        ? `+${contagem.atencao} em atenção · faltas > ${LIMITE_FALTAS_PCT}% ou média < ${MEDIA_MINIMA}`
        : `Faltas > ${LIMITE_FALTAS_PCT}% ou média < ${MEDIA_MINIMA}`,
      icone: AlertTriangle,
      cor: contagem.alertas ? "rose" : contagem.atencao ? "amber" : "emerald",
    },
  ] as const;

  const turmas = [
    {
      nome: "Desenvolvimento Front-End",
      info: `${alunos.length} alunos`,
      turno: "Noturno",
      icone: Moon,
      acao: diarioHojeSalvo ? "Revisar chamada" : "Abrir chamada",
      aba: "diario" as const,
      destaque: !diarioHojeSalvo,
    },
    {
      nome: "Arquitetura de Software",
      info: "38 alunos",
      turno: "Matutino",
      icone: Sun,
      acao: "Lançar notas",
      aba: "notas" as const,
      destaque: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
        {kpis.map((k) => (
          <Card key={k.label} hoverable className="flex items-center gap-4">
            <IconBubble icone={k.icone} cor={k.cor} />
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">{k.label}</p>
              <p className="text-2xl font-extrabold text-ink tabular">
                {k.valor}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{k.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <IconBubble icone={Radar} cor="violet" tamanho="sm" />
          <h3 className="flex-1 text-lg font-extrabold text-ink">
            Radar de Risco · Turma A
          </h3>
          <span className="text-[11px] text-slate-400">
            {alunos.length} alunos · atualiza ao salvar diário ou notas
          </span>
        </div>

        {turmaTranquila && (
          <p className="text-sm font-bold text-emerald-600 bg-emerald-50 p-4 rounded-xl text-center animate-pop">
            🎉 Nenhum aluno em risco. Turma afiada!
          </p>
        )}

        <div className="space-y-2 stagger">
          {radar.map((a) => {
            const e = ESTILO_RISCO[a.nivel];
            return (
              <div
                key={a.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-xl bg-slate-50 border-l-4 hover:bg-primary/5 transition-colors",
                  e.borda,
                )}
              >
                <div className="w-9 h-9 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {iniciais(a.nome)}
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-ink">
                      {a.nome}
                      {e.label && (
                        <span
                          className={cn(
                            "ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full",
                            e.selo,
                          )}
                        >
                          {e.label}
                          {a.motivo && ` · ${a.motivo}`}
                        </span>
                      )}
                    </span>
                    <span className="text-slate-400 tabular">
                      {a.faltas}/{a.totalAulas} faltas ·{" "}
                      <b className="text-ink">{a.percentualFrequencia}%</b>
                      {a.media !== null && (
                        <>
                          {" "}
                          · média <b className="text-ink">{a.media}</b>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200/70 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full animate-grow",
                        e.barra,
                      )}
                      style={{ width: `${a.percentualFrequencia}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-extrabold text-ink">Minhas turmas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
          {turmas.map((t) => (
            <Card
              key={t.nome}
              hoverable
              className="relative overflow-hidden space-y-4"
            >
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-primary/5" />
              <div className="relative flex items-center gap-3">
                <IconBubble
                  icone={Users}
                  cor={t.aba === "diario" ? "primary" : "cyan"}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {t.nome}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <t.icone size={12} /> {t.info} · {t.turno}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="relative w-full"
                variant={
                  t.destaque || t.aba === "diario" ? "primary" : "secondary"
                }
                onClick={() => onNavegar(t.aba)}
              >
                {t.acao}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
