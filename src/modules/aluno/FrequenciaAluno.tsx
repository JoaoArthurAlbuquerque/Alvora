import React, { useMemo, useState } from "react";
import {
  Paperclip,
  MessageSquare,
  UploadCloud,
  CalendarX,
  BookOpen,
  FileCheck2,
  X,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { Button } from "../../core/ui/Button";
import { Modal } from "../../core/ui/Modal";
import { PageHeader } from "../../core/ui/PageHeader";
import { IconBubble } from "../../core/ui/IconBubble";
import { situacaoFrequencia } from "../../services/diarioStore";
import { justificativaStore } from "../../services/justificativaStore";
import { cn } from "../../core/lib/utils";
import { useAlunoDados } from "./useAlunoDados";
import { useRegras } from "../../services/regrasService";
import {
  BADGE_FREQ,
  SELO_JUST,
  formatarData,
  CORES_DISC,
  COR_BARRA,
} from "./constantes";

const campo =
  "mt-1.5 w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition";
const pontoStatus = {
  pendente: "bg-amber-400",
  aprovada: "bg-emerald-500",
  recusada: "bg-rose-500",
};

export const FrequenciaAluno: React.FC = () => {
  const { aluno, historico, justificativas, frequenciaGlobal } =
    useAlunoDados();
  const [aberto, setAberto] = useState(false);
  const [disc, setDisc] = useState("");
  const [data, setData] = useState("");
  const [motivo, setMotivo] = useState("");
  const [anexo, setAnexo] = useState<string>();
  const [erro, setErro] = useState("");
  const [arrastando, setArrastando] = useState(false);
  const hoje = new Date().toISOString().slice(0, 10);
  const { frequenciaMinima: FREQ_MINIMA } = useRegras();

  const minhas = useMemo(
    () =>
      justificativas
        .filter((j) => j.alunoId === aluno.id)
        .sort((a, b) => b.criadaEm - a.criadaEm),
    [justificativas, aluno.id],
  );

  const abrir = (id: string) => {
    setDisc(id);
    setData("");
    setMotivo("");
    setAnexo(undefined);
    setErro("");
    setAberto(true);
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const d = historico.find((h) => h.disciplinaId === disc);
    if (!d) return;
    const r = justificativaStore.enviar({
      alunoId: aluno.id,
      alunoNome: aluno.nome,
      disciplinaId: d.disciplinaId,
      disciplinaNome: d.disciplinaNome,
      dataFalta: data,
      motivo: motivo.trim(),
      anexoNome: anexo,
    });
    if (r === "duplicada")
      return setErro(
        "Já existe uma justificativa para essa data nessa disciplina.",
      );
    setAberto(false);
  };

  const totalFaltas = historico.reduce((a, h) => a + h.faltas, 0);
  const resumo = [
    {
      label: "Frequência geral",
      valor: `${frequenciaGlobal.toFixed(1)}%`,
      cor: "emerald" as const,
      icone: FileCheck2,
    },
    {
      label: "Total de faltas",
      valor: totalFaltas,
      cor: "rose" as const,
      icone: CalendarX,
    },
    {
      label: "Justificativas em análise",
      valor: minhas.filter((j) => j.status === "pendente").length,
      cor: "amber" as const,
      icone: MessageSquare,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Frequência"
        descricao={`Mínimo de ${FREQ_MINIMA}% por disciplina (até ${100 - FREQ_MINIMA}% de faltas).`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
        {resumo.map((r) => (
          <Card key={r.label} hoverable className="flex items-center gap-4">
            <IconBubble icone={r.icone} cor={r.cor} />
            <div>
              <p className="text-xs font-medium text-slate-400">{r.label}</p>
              <p className="text-2xl font-extrabold text-ink tabular">
                {r.valor}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-3 stagger">
        {historico.map((h, i) => {
          const sit = situacaoFrequencia(h.percentualFrequencia);
          return (
            <Card key={h.disciplinaId} hoverable className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <IconBubble
                  icone={BookOpen}
                  cor={CORES_DISC[i % CORES_DISC.length]}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink">
                    {h.disciplinaNome}
                  </p>
                  <p className="text-xs text-slate-400 tabular">
                    {h.presencas} presenças · {h.faltas} faltas · {h.totalAulas}{" "}
                    aulas
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {h.faltas > 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<CalendarX size={14} />}
                      onClick={() => abrir(h.disciplinaId)}
                    >
                      Justificar
                    </Button>
                  )}
                  <Badge variant={BADGE_FREQ[sit].variant}>
                    {BADGE_FREQ[sit].label}
                  </Badge>
                  <span className="text-xl font-extrabold text-ink tabular w-16 text-right">
                    {h.percentualFrequencia}%
                  </span>
                </div>
              </div>
              <div className="relative h-2.5 bg-slate-100 rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full animate-grow",
                    COR_BARRA[sit],
                  )}
                  style={{ width: `${h.percentualFrequencia}%` }}
                />
                <div
                  className="absolute -top-1 h-4.5 w-0.5 rounded bg-ink/40"
                  style={{ left: `${FREQ_MINIMA}%` }}
                  title={`Mínimo ${FREQ_MINIMA}%`}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400">
                    {FREQ_MINIMA}%
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {minhas.length > 0 && (
        <Card className="space-y-5">
          <h2 className="text-lg font-extrabold text-ink">
            Minhas justificativas
          </h2>
          <ol className="relative border-l-2 border-primary/10 ml-2 space-y-5 stagger">
            {minhas.map((j) => (
              <li key={j.id} className="relative pl-6">
                <span
                  className={cn(
                    "absolute -left-1.75 top-1.5 w-3 h-3 rounded-full ring-4 ring-white",
                    pontoStatus[j.status],
                  )}
                />
                <div className="flex justify-between items-start gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 transition-colors">
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-bold text-ink">
                      {j.disciplinaNome} ·{" "}
                      <span className="tabular">
                        {formatarData(j.dataFalta)}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">{j.motivo}</p>
                    {j.anexoNome && (
                      <p className="text-xs font-medium text-primary flex items-center gap-1">
                        <Paperclip size={12} /> {j.anexoNome}
                      </p>
                    )}
                    {j.parecer && (
                      <p className="text-xs text-slate-600 flex items-start gap-1.5 mt-2 p-2 rounded-lg bg-white">
                        <MessageSquare
                          size={12}
                          className="mt-0.5 shrink-0 text-primary"
                        />{" "}
                        {j.parecer}
                      </p>
                    )}
                  </div>
                  <Badge variant={SELO_JUST[j.status].variant}>
                    {SELO_JUST[j.status].label}
                  </Badge>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      <Modal
        isOpen={aberto}
        onClose={() => setAberto(false)}
        title="Justificar falta"
      >
        <form onSubmit={enviar} className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
            <IconBubble icone={BookOpen} tamanho="sm" />
            <p className="text-sm font-bold text-primary">
              {historico.find((h) => h.disciplinaId === disc)?.disciplinaNome}
            </p>
          </div>
          <label className="block text-sm font-semibold text-ink">
            Data da falta
            <input
              type="date"
              required
              max={hoje}
              value={data}
              onChange={(e) => setData(e.target.value)}
              className={campo}
            />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Motivo
            <textarea
              required
              minLength={10}
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex.: consulta médica"
              className={cn(campo, "resize-none")}
            />
            <span
              className={cn(
                "block text-right text-[11px] mt-1 tabular",
                motivo.trim().length >= 10
                  ? "text-emerald-500"
                  : "text-slate-400",
              )}
            >
              {motivo.trim().length}/10 mín.
            </span>
          </label>

          <div className="text-sm font-semibold text-ink">
            Comprovante{" "}
            <span className="font-normal text-slate-400">(opcional)</span>
            {anexo ? (
              <div className="mt-1.5 flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 animate-scale-in">
                <FileCheck2 size={18} className="text-emerald-600" />
                <span className="flex-1 text-xs font-medium text-emerald-700 truncate">
                  {anexo}
                </span>
                <button
                  type="button"
                  onClick={() => setAnexo(undefined)}
                  aria-label="Remover"
                  className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-100"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setArrastando(true);
                }}
                onDragLeave={() => setArrastando(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setArrastando(false);
                  setAnexo(e.dataTransfer.files?.[0]?.name);
                }}
                className={cn(
                  "group mt-1.5 flex flex-col items-center gap-1 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all",
                  arrastando
                    ? "border-primary bg-primary/10 scale-[1.02]"
                    : "border-slate-200 hover:border-primary/40 hover:bg-primary/5",
                )}
              >
                <UploadCloud
                  size={28}
                  className={cn(
                    "text-primary transition-transform",
                    arrastando
                      ? "-translate-y-1 scale-110"
                      : "group-hover:-translate-y-1",
                  )}
                />
                <span className="text-xs font-semibold text-ink">
                  Arraste aqui ou clique para enviar
                </span>
                <span className="text-[11px] font-normal text-slate-400">
                  PDF ou imagem
                </span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setAnexo(e.target.files?.[0]?.name)}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {erro && (
            <p className="text-sm font-medium text-rose-600 bg-rose-50 p-3 rounded-xl animate-shake">
              {erro}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!data || motivo.trim().length < 10}
          >
            Enviar justificativa
          </Button>
        </form>
      </Modal>
    </div>
  );
};
