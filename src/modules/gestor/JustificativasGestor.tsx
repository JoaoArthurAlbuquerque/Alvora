import React, { useMemo, useState } from "react";
import {
  FileCheck2,
  Paperclip,
  Check,
  X,
  Quote,
  CalendarX,
  Clock,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";
import {
  useJustificativas,
  justificativaStore,
} from "../../services/justificativaStore";
import { cn } from "../../core/lib/utils";
import {
  GESTOR_ID,
  SELO_JUST,
  fmt,
  fmtData,
  iniciais,
  pad,
} from "./constantes";
import { ModalTexto } from "./ModalTexto";

export const JustificativasGestor: React.FC = () => {
  const justificativas = useJustificativas();
  const [recusando, setRecusando] = useState<string | null>(null);

  const pendentes = useMemo(
    () =>
      justificativas
        .filter((j) => j.status === "pendente")
        .sort((a, b) => a.criadaEm - b.criadaEm),
    [justificativas],
  );
  const decididas = useMemo(
    () =>
      justificativas
        .filter((j) => j.status !== "pendente")
        .sort((a, b) => (b.decididaEm ?? 0) - (a.decididaEm ?? 0))
        .slice(0, 5),
    [justificativas],
  );

  return (
    <div className="space-y-6">
      <Card className="space-y-5">
        <div className="flex flex-wrap items-center gap-4">
          <IconBubble icone={FileCheck2} cor="amber" />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-extrabold text-ink">
              Justificativas de falta
            </h3>
            <p className="text-xs text-slate-400">
              Aprovadas abonam a falta no extrato do aluno automaticamente.
            </p>
          </div>
          <Badge variant={pendentes.length ? "warning" : "success"}>
            {pad(pendentes.length)} pendente(s)
          </Badge>
        </div>

        {pendentes.length === 0 ? (
          <div className="p-8 rounded-2xl bg-emerald-50 text-center space-y-1 animate-pop">
            <p className="text-4xl animate-float">☕</p>
            <p className="text-sm font-bold text-emerald-700">
              Caixa zerada! Hora do cafezinho
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger">
            {pendentes.map((j) => (
              <div
                key={j.id}
                className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {iniciais(j.alunoNome)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink truncate">
                      {j.alunoNome}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {j.disciplinaNome}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-medium tabular">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
                    <CalendarX size={11} /> Falta {fmtData(j.dataFalta)}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-slate-500">
                    <Clock size={11} /> {fmt(j.criadaEm)}
                  </span>
                </div>
                <p className="flex gap-2 text-xs text-slate-600 p-3 rounded-xl bg-white">
                  <Quote size={12} className="shrink-0 mt-0.5 text-primary" />{" "}
                  {j.motivo}
                </p>
                {j.anexoNome && (
                  <p className="text-[11px] font-medium text-primary flex items-center gap-1">
                    <Paperclip size={12} /> {j.anexoNome}
                  </p>
                )}
                <div className="flex gap-2 mt-auto">
                  <Button
                    size="sm"
                    className="flex-1"
                    icon={<Check size={14} />}
                    onClick={() =>
                      justificativaStore.decidir(j.id, "aprovada", GESTOR_ID)
                    }
                  >
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-1"
                    icon={<X size={14} />}
                    onClick={() => setRecusando(j.id)}
                  >
                    Recusar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {decididas.length > 0 && (
        <Card className="space-y-4">
          <h4 className="text-sm font-extrabold text-ink">
            Decididas recentemente
          </h4>
          <ol className="relative ml-2 border-l-2 border-primary/10 space-y-3 stagger">
            {decididas.map((j) => {
              const selo = SELO_JUST[j.status as "aprovada" | "recusada"];
              return (
                <li key={j.id} className="relative pl-6">
                  <span
                    className={cn(
                      "absolute -left-1.75 top-3 w-3 h-3 rounded-full ring-4 ring-white",
                      selo.ponto,
                    )}
                  />
                  <div className="flex justify-between items-start gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="min-w-0 text-xs">
                      <p className="font-bold text-ink">
                        {j.alunoNome}{" "}
                        <span className="font-normal text-slate-400">
                          · {j.disciplinaNome} · {fmtData(j.dataFalta)}
                        </span>
                      </p>
                      {j.parecer && (
                        <p className="text-slate-500 mt-0.5">{j.parecer}</p>
                      )}
                    </div>
                    <Badge variant={selo.variant}>{selo.label}</Badge>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
      )}

      <ModalTexto
        aberto={!!recusando}
        titulo="Recusar justificativa"
        rotulo="Motivo da recusa (o aluno verá)"
        placeholder="Ex.: comprovante ilegível"
        confirmar="Recusar"
        perigo
        onFechar={() => setRecusando(null)}
        onConfirmar={(t) =>
          recusando &&
          justificativaStore.decidir(recusando, "recusada", GESTOR_ID, t)
        }
      />
    </div>
  );
};
