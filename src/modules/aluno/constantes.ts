import type { SituacaoFrequencia } from "../../services/diarioStore";
import type { CorBubble } from "../../core/ui/IconBubble";
import type { StatusJustificativa } from "../../services/justificativaStore";

export type VarianteBadge =
  | "success"
  | "warning"
  | "danger"
  | "primary"
  | "neutral";
type Selo = { variant: VarianteBadge; label: string };

export const BADGE_FREQ: Record<SituacaoFrequencia, Selo> = {
  segura: { variant: "success", label: "Regular" },
  atencao: { variant: "warning", label: "Atenção" },
  reprovado: { variant: "danger", label: "Abaixo do mínimo" },
};

export const SELO_JUST: Record<StatusJustificativa, Selo> = {
  pendente: { variant: "warning", label: "Em análise" },
  aprovada: { variant: "success", label: "Abonada" },
  recusada: { variant: "danger", label: "Recusada" },
};

export const SELO_BOLETIM: Record<string, VarianteBadge> = {
  Aprovado: "success",
  "Em Risco": "danger",
  "Em Andamento": "neutral",
};

export const semestreAtual = () => {
  const d = new Date();
  return `${d.getFullYear()}.${d.getMonth() < 6 ? 1 : 2}`;
};

export const formatarData = (iso: string) =>
  new Date(iso + "T12:00").toLocaleDateString("pt-BR");

export const CORES_DISC: CorBubble[] = [
  "primary",
  "violet",
  "cyan",
  "emerald",
  "amber",
  "rose",
];

export const COR_BARRA: Record<SituacaoFrequencia, string> = {
  segura: "bg-brand",
  atencao: "bg-gradient-to-r from-amber-400 to-amber-500",
  reprovado: "bg-gradient-to-r from-rose-400 to-rose-500",
};
