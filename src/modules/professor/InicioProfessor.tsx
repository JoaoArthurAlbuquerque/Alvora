// =====================================================================
// src/modules/professor/InicioProfessor.tsx
// =====================================================================
import React from "react";
import {
  Activity,
  ClipboardCheck,
  AlertTriangle,
  Radar,
  Users,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";
import { classificar } from "../../services/radarRisco";
import { useRegras } from "../../services/regrasService";
import { useAlunosTurma, type Sala } from "../../services/api/turmas";
import {
  calcularMedia,
  useFrequenciaSala,
  useNotasSala,
} from "../../services/api/professor";
import type { TabProfessor } from "../../types";
import { cn } from "../../core/lib/utils";
import { ESTILO_RISCO, pad, iniciais } from "./constantes";

const ORDEM = { critico: 0, atencao: 1, ok: 2 } as const;

const CardSala: React.FC<{
  s: Sala;
  atual: boolean;
  onAbrir: (aba: TabProfessor) => void;
}> = ({ s, atual, onAbrir }) => {
  const { data: alunos } = useAlunosTurma(s.turmaId);
  return (
    <Card
      hoverable
      className={cn(
        "relative overflow-hidden space-y-4",
        atual && "ring-2 ring-primary/30",
      )}
    >
      <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-primary/5" />
      <div className="relative flex items-center gap-3">
        <IconBubble icone={Users} cor={atual ? "primary" : "cyan"} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-ink truncate">
            {s.disciplinaNome}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {s.turmaNome} · {alunos ? `${alunos.length} alunos` : "…"}
            {s.cargaHoraria ? ` · ${s.cargaHoraria}h` : ""}
          </p>
        </div>
      </div>
      <div className="relative grid grid-cols-2 gap-2">
        <Button size="sm" onClick={() => onAbrir("diario")}>
          Abrir diário
        </Button>
        <Button size="sm" variant="secondary" onClick={() => onAbrir("notas")}>
          Lançar notas
        </Button>
      </div>
    </Card>
  );
};

export const InicioProfessor: React.FC<{
  sala: Sala;
  salas: Sala[];
  onSelecionar: (id: string) => void;
  onNavegar: (t: TabProfessor) => void;
}> = ({ sala, salas, onSelecionar, onNavegar }) => {
  const regras = useRegras();
  const {
    frequenciaMinima: FREQ_MINIMA,
    mediaMinima: MEDIA_MINIMA,
    limiteAlertaFaltas,
  } = regras;
  const pesos = regras.pesosAvaliacoes as unknown as Record<string, number>;
  const { data: freq } = useFrequenciaSala(sala.id);
  const { data: notas = {} } = useNotasSala(sala.id);

  const alunos = freq?.alunos ?? [];
  const mediaFrequencia = freq?.mediaFrequencia ?? 100;
  const diarioHojeSalvo = !!freq?.diarioHojeSalvo;

  const radar = alunos
    .map((a) => {
      const media = calcularMedia(notas[a.id], pesos);
      const c = classificar(a.percentualFaltas, media, regras);
      return { ...a, media, nivel: c.nivel, motivo: c.motivo };
    })
    .sort(
      (x, y) =>
        ORDEM[x.nivel] - ORDEM[y.nivel] ||
        x.percentualFrequencia - y.percentualFrequencia,
    );

  const contagem = {
    alertas: radar.filter((r) => r.motivo).length,
    atencao: radar.filter((r) => !r.motivo && r.nivel === "atencao").length,
  };
  const freqOk = mediaFrequencia >= FREQ_MINIMA;
  const criterio = `faltas > ${limiteAlertaFaltas}% ou média < ${MEDIA_MINIMA}`;

  const kpis = [
    {
      label: "Frequência média",
      valor: `${mediaFrequencia}%`,
      sub: `${freq?.diasRegistrados ?? 0} dia(s) com registro · mínimo ${FREQ_MINIMA}%`,
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
        ? `+${contagem.atencao} em atenção · ${criterio}`
        : criterio.charAt(0).toUpperCase() + criterio.slice(1),
      icone: AlertTriangle,
      cor: contagem.alertas ? "rose" : contagem.atencao ? "amber" : "emerald",
    },
  ] as const;

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
            Radar de Risco · {sala.turmaNome} · {sala.disciplinaNome}
          </h3>
          <span className="text-[11px] text-slate-400">
            {alunos.length} alunos · atualiza em tempo real
          </span>
        </div>

        {!alunos.length && (
          <p className="text-sm text-slate-400 text-center py-4">
            Nenhum aluno com matrícula ativa nesta turma.
          </p>
        )}
        {!!alunos.length &&
          contagem.alertas === 0 &&
          contagem.atencao === 0 && (
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
          {salas.map((s) => (
            <CardSala
              key={s.id}
              s={s}
              atual={s.id === sala.id}
              onAbrir={(aba) => {
                onSelecionar(s.id);
                onNavegar(aba);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
