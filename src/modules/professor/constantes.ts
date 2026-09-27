import { Home, ClipboardCheck, PenLine, FolderOpen } from "lucide-react";
import type { NivelRisco } from "../../services/radarRisco";
import type { StatusPresenca, TabProfessor } from "../../types";

export const PROFESSOR_ID = "prof";

export const ABAS: {
  id: TabProfessor;
  label: string;
  icone: React.ElementType;
}[] = [
  { id: "dashboard", label: "Início", icone: Home },
  { id: "diario", label: "Diário & Chamada", icone: ClipboardCheck },
  { id: "notas", label: "Notas", icone: PenLine },
  { id: "conteudos", label: "Conteúdos", icone: FolderOpen },
];

export const ESTILO_RISCO: Record<
  NivelRisco,
  { barra: string; selo: string; label: string; borda: string }
> = {
  critico: {
    barra: "bg-gradient-to-r from-rose-400 to-rose-500",
    selo: "text-rose-600 bg-rose-500/10",
    label: "Crítico",
    borda: "border-rose-400",
  },
  atencao: {
    barra: "bg-gradient-to-r from-amber-400 to-amber-500",
    selo: "text-amber-600 bg-amber-500/10",
    label: "Atenção",
    borda: "border-amber-400",
  },
  ok: { barra: "bg-brand", selo: "", label: "", borda: "border-transparent" },
};

// Ciclo do clique: Presente → Falta → Justificada → Presente
export const PROXIMO: Record<StatusPresenca, StatusPresenca> = {
  PRESENTE_PIN: "FALTA",
  PRESENTE_MANUAL: "FALTA",
  FALTA: "FALTA_JUSTIFICADA",
  FALTA_JUSTIFICADA: "PRESENTE_MANUAL",
};

const PRESENTE = {
  label: "Presente",
  icone: "✓",
  cls: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30",
};
export const VISUAL: Record<
  StatusPresenca,
  { label: string; icone: string; cls: string }
> = {
  PRESENTE_PIN: PRESENTE,
  PRESENTE_MANUAL: PRESENTE,
  FALTA: {
    label: "Falta",
    icone: "✕",
    cls: "bg-rose-500 text-white shadow-lg shadow-rose-500/30",
  },
  FALTA_JUSTIFICADA: {
    label: "Justificada",
    icone: "⚑",
    cls: "bg-amber-400 text-white shadow-lg shadow-amber-500/30",
  },
};

export const pad = (n: number) => n.toString().padStart(2, "0");
export const formatarTempo = (seg: number) =>
  `${pad(Math.floor(seg / 60))}:${pad(seg % 60)}`;
export const hoje = () => new Date().toLocaleDateString("sv-SE");
export const iniciais = (nome: string) =>
  nome
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
export const corNota = (v: number) =>
  v >= 7
    ? "text-emerald-600 bg-emerald-50"
    : v >= 5
      ? "text-amber-600 bg-amber-50"
      : "text-rose-600 bg-rose-50";
