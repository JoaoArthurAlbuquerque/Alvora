// =====================================================================
// src/modules/aluno/CardFrequencia.tsx  (NOVO)
// =====================================================================
import React from "react";
import { BookOpen, CalendarCheck, AlertTriangle, Info } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";
import { useRegras } from "../../services/regrasService";
import { situacaoFrequencia } from "../../services/diarioStore";
import type { FrequenciaDisciplina } from "../../services/alunoApi";
import { cn } from "../../core/lib/utils";
import { BADGE_FREQ, COR_BARRA, CORES_DISC } from "./constantes";

interface Props {
  d: FrequenciaDisciplina;
  indice?: number;
  onJustificar: () => void;
}

const FAIXA = {
  reprovado: {
    caixa: "bg-rose-50 border-rose-200",
    icone: "text-rose-500",
    texto: "text-rose-700",
    botao: "danger" as const,
  },
  atencao: {
    caixa: "bg-amber-50 border-amber-200",
    icone: "text-amber-500",
    texto: "text-amber-800",
    botao: "primary" as const,
  },
};

export const CardFrequencia: React.FC<Props> = ({
  d,
  indice = 0,
  onJustificar,
}) => {
  const { frequenciaMinima: MIN } = useRegras();
  const situacao = situacaoFrequencia(d.percentualFrequencia);
  const badge = BADGE_FREQ[situacao];
  const pct = Math.min(100, Math.max(0, d.percentualFrequencia));

  // Faltas que ainda cabem até o limite
  const limite = Math.floor((d.totalAulas * (100 - MIN)) / 100);
  const restantes = Math.max(0, limite - d.faltas);

  const faixa = situacao !== "segura" ? FAIXA[situacao] : null;
  const mensagem =
    situacao === "reprovado" ? (
      <>
        Você está com <strong>{d.faltas} faltas</strong> e abaixo de {MIN}%. Tem
        atestado ou comprovante? Justifique agora para recuperar sua frequência.
      </>
    ) : (
      <>
        Atenção:{" "}
        {restantes > 0 ? (
          <>
            só restam <strong>{restantes} falta(s)</strong> até o limite.
          </>
        ) : (
          "você chegou no limite de faltas."
        )}{" "}
        Se alguma falta teve motivo, justifique.
      </>
    );

  return (
    <Card className="space-y-5">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center gap-4">
        <IconBubble
          icone={BookOpen}
          cor={CORES_DISC[indice % CORES_DISC.length]}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-ink truncate">
            {d.disciplinaNome}
          </h3>
          <p className="text-xs text-slate-500 tabular">
            {d.presencas} presenças · {d.faltas} faltas · {d.totalAulas} aulas
          </p>
        </div>
        <Badge variant={badge.variant}>{badge.label}</Badge>
        <span
          className={cn(
            "text-2xl font-extrabold tabular",
            situacao === "reprovado" ? "text-rose-600" : "text-ink",
          )}
        >
          {d.percentualFrequencia}%
        </span>
      </div>

      {/* Barra com marcador do mínimo */}
      <div className="relative pt-5">
        <span
          className="absolute top-0 -translate-x-1/2 text-[11px] font-semibold text-slate-500 tabular"
          style={{ left: `${MIN}%` }}
        >
          {MIN}%
        </span>
        <div
          role="progressbar"
          aria-label={`Frequência em ${d.disciplinaNome}`}
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden"
        >
          <div
            className={cn(
              "h-full rounded-full animate-grow",
              COR_BARRA[situacao],
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span
          aria-hidden
          className="absolute top-4 h-4 w-0.5 rounded bg-slate-400"
          style={{ left: `${MIN}%` }}
        />
      </div>

      {/* Ação em destaque */}
      {d.faltas > 0 &&
        (faixa ? (
          <div
            role="status"
            className={cn(
              "flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border animate-fade-up",
              faixa.caixa,
            )}
          >
            <AlertTriangle
              size={22}
              className={cn("shrink-0", faixa.icone)}
              aria-hidden
            />
            <p className={cn("flex-1 text-sm", faixa.texto)}>{mensagem}</p>
            <Button
              variant={faixa.botao}
              size="lg"
              icon={<CalendarCheck size={18} />}
              onClick={onJustificar}
              className="w-full sm:w-auto"
            >
              Justificar faltas
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <Info size={14} aria-hidden /> Você ainda pode faltar {restantes}{" "}
              vez(es).
            </p>
            <Button
              variant="ghost"
              size="sm"
              icon={<CalendarCheck size={15} />}
              onClick={onJustificar}
            >
              Justificar uma falta
            </Button>
          </div>
        ))}
    </Card>
  );
};
