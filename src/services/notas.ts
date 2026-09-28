import { useMemo, useSyncExternalStore } from "react";
import { REGRAS } from "../config/regras";

export type NotaAluno = {
  id: string;
  aluno: string;
  av1: number;
  av2: number;
  media: number;
};

const CHAVE = "notas_turma_v1";

/** Média ponderada pelos pesos da instituição. */
export function calcularMedia(av1: number, av2: number): number {
  const { AV1, AV2 } = REGRAS.pesosAvaliacoes;
  return Number(((av1 * AV1 + av2 * AV2) / (AV1 + AV2)).toFixed(2));
}

const comMedia = (n: Omit<NotaAluno, "media">): NotaAluno => ({
  ...n,
  media: calcularMedia(n.av1, n.av2),
});

const INICIAL: NotaAluno[] = [
  { id: "1", aluno: "João Arthur Albuquerque", av1: 9.0, av2: 8.5 },
  { id: "2", aluno: "Ana Beatriz Souza", av1: 7.5, av2: 8.0 },
  { id: "3", aluno: "Carlos Eduardo Lima", av1: 5.0, av2: 6.0 },
].map(comMedia);

const carregar = (): NotaAluno[] => {
  try {
    const raw = localStorage.getItem(CHAVE);
    return raw ? (JSON.parse(raw) as NotaAluno[]).map(comMedia) : INICIAL;
  } catch {
    return INICIAL;
  }
};

let estado: NotaAluno[] = carregar();
const ouvintes = new Set<() => void>();

const emitir = () => {
  localStorage.setItem(CHAVE, JSON.stringify(estado));
  ouvintes.forEach((l) => l());
};

const assinar = (l: () => void) => {
  ouvintes.add(l);
  return () => ouvintes.delete(l);
};

export const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

export function atualizarNota(id: string, campo: "av1" | "av2", valor: number) {
  const v = Math.min(10, Math.max(0, valor));
  estado = estado.map((n) =>
    n.id !== id ? n : comMedia({ ...n, [campo]: v }),
  );
  emitir();
}

export function useNotasTurma(): NotaAluno[] {
  return useSyncExternalStore(assinar, () => estado);
}

/** Médias indexadas pelo ID do aluno da frequência (casadas por nome). Referência estável. */
export function useMediasTurma(
  alunos: { id: string; nome: string }[],
): Record<string, number | null> {
  const notas = useNotasTurma();
  return useMemo(() => {
    const porNome = new Map(notas.map((n) => [normalizar(n.aluno), n.media]));
    const out: Record<string, number | null> = {};
    for (const a of alunos) out[a.id] = porNome.get(normalizar(a.nome)) ?? null;
    return out;
  }, [notas, alunos]);
}
