import { useMemo, useSyncExternalStore } from "react";

export type NotaAluno = {
  id: string;
  aluno: string;
  av1: number;
  av2: number;
  media: number;
};

const CHAVE = "notas_turma_v1";

const INICIAL: NotaAluno[] = [
  {
    id: "1",
    aluno: "João Arthur Albuquerque",
    av1: 9.0,
    av2: 8.5,
    media: 8.75,
  },
  { id: "2", aluno: "Ana Beatriz Souza", av1: 7.5, av2: 8.0, media: 7.75 },
  { id: "3", aluno: "Carlos Eduardo Lima", av1: 5.0, av2: 6.0, media: 5.5 },
];

const carregar = (): NotaAluno[] => {
  try {
    const raw = localStorage.getItem(CHAVE);
    return raw ? JSON.parse(raw) : INICIAL;
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
  estado = estado.map((n) => {
    if (n.id !== id) return n;
    const av1 = campo === "av1" ? v : n.av1;
    const av2 = campo === "av2" ? v : n.av2;
    return { ...n, [campo]: v, media: Number(((av1 + av2) / 2).toFixed(2)) };
  });
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
