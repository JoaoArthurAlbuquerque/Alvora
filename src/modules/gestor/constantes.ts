import type { MotivoAlerta } from "../../services/radarRisco";
import type { StatusJustificativa } from "../../services/justificativaStore";

export const GESTOR_ID = "gestor";

export type Filtro = "TODOS" | MotivoAlerta;
export const FILTROS: Filtro[] = ["TODOS", "FALTAS", "NOTA", "AMBOS"];

export const SELO_MOTIVO: Record<
  MotivoAlerta,
  { cls: string; label: string; borda: string }
> = {
  FALTAS: {
    cls: "text-rose-600 bg-rose-500/10",
    label: "Faltas",
    borda: "border-rose-400",
  },
  NOTA: {
    cls: "text-amber-600 bg-amber-500/10",
    label: "Nota",
    borda: "border-amber-400",
  },
  AMBOS: {
    cls: "text-white bg-gradient-to-r from-rose-500 to-rose-600",
    label: "Faltas + Nota",
    borda: "border-rose-600",
  },
};

export const SELO_JUST: Record<
  Exclude<StatusJustificativa, "pendente">,
  { variant: "success" | "danger"; label: string; ponto: string }
> = {
  aprovada: {
    variant: "success",
    label: "✓ Aprovada",
    ponto: "bg-emerald-500",
  },
  recusada: { variant: "danger", label: "✕ Recusada", ponto: "bg-rose-500" },
};

export const fmt = (ms: number) =>
  new Date(ms).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
export const fmtData = (iso: string) =>
  new Date(iso + "T12:00").toLocaleDateString("pt-BR");
export const pad = (n: number) => n.toString().padStart(2, "0");
export const iniciais = (nome: string) =>
  nome
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
