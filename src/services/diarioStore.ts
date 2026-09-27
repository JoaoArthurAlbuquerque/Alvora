import { useSyncExternalStore } from "react";
import type { RegistroPresenca, StatusPresenca } from "../types";

const KEY = "alvora:diario";
const EVT = "alvora:diario-change";

/** Data local no formato YYYY-MM-DD (evita o "pulo" de dia do UTC). */
const hoje = () => new Date().toLocaleDateString("sv-SE");

/** Diz se um status (ou um registro) conta como presença no cálculo de frequência. */
export const contaComoPresenca = (
  x: StatusPresenca | Pick<RegistroPresenca, "status">,
): boolean => {
  const status = typeof x === "string" ? x : x.status;
  return status === "PRESENTE_PIN" || status === "PRESENTE_MANUAL";
};

interface ItemFrequencia {
  disciplinaId: string;
  presencas: number;
  faltas: number;
  totalAulas: number;
  percentualFrequencia: number;
}

/** Soma os registros do diário ao histórico base (mock) do aluno. */
export function aplicarRegistros<T extends ItemFrequencia>(
  historico: T[],
  registros: RegistroPresenca[],
  alunoId: string,
): T[] {
  return historico.map((item) => {
    const doAluno = registros.filter(
      (r) => r.alunoId === alunoId && r.disciplinaId === item.disciplinaId,
    );
    if (!doAluno.length) return item;

    const extrasP = doAluno.filter(contaComoPresenca).length;
    const presencas = item.presencas + extrasP;
    const faltas = item.faltas + (doAluno.length - extrasP);
    const dadas = presencas + faltas;
    const totalAulas = Math.max(item.totalAulas, dadas);

    return {
      ...item,
      presencas,
      faltas,
      totalAulas,
      percentualFrequencia: dadas
        ? Number(((presencas / dadas) * 100).toFixed(1))
        : 100,
    };
  });
}

function ler(): RegistroPresenca[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

let cache: RegistroPresenca[] = ler();

function gravar(lista: RegistroPresenca[]) {
  localStorage.setItem(KEY, JSON.stringify(lista));
  cache = lista;
  window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = ler();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVT, cb);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVT, cb);
  };
}

export interface SalvarDiarioInput {
  turmaId: string;
  disciplinaId: string;
  chamadaId?: string;
  data?: string;
  statusPorAluno: Record<string, StatusPresenca>;
}

export type MarcarPresencaInput = Omit<
  RegistroPresenca,
  "id" | "registradoEm" | "data"
> & { data?: string };

export const diarioStore = {
  listar: () => cache,

  /** Salva a chamada da turma inteira. Retorna quantos registros foram gravados. */
  salvar(input: SalvarDiarioInput): number {
    const data = input.data ?? hoje();
    const agora = Date.now();
    const novos: RegistroPresenca[] = Object.entries(input.statusPorAluno).map(
      ([alunoId, status]) => ({
        id: `${input.turmaId}-${data}-${alunoId}`,
        alunoId,
        turmaId: input.turmaId,
        disciplinaId: input.disciplinaId,
        chamadaId: input.chamadaId,
        status,
        data,
        registradoEm: agora,
      }),
    );
    const ids = new Set(novos.map((r) => r.id));
    gravar([...cache.filter((r) => !ids.has(r.id)), ...novos]);
    return novos.length;
  },

  /** Upsert de um único aluno (usado pela chamada por PIN). */
  marcar(r: MarcarPresencaInput) {
    const data = r.data ?? hoje();
    const id = `${r.turmaId}-${data}-${r.alunoId}`;
    const novo: RegistroPresenca = { ...r, id, data, registradoEm: Date.now() };
    gravar([...cache.filter((x) => x.id !== id), novo]);
  },

  presentesDaChamada: (chamadaId: string) =>
    cache
      .filter((r) => r.chamadaId === chamadaId && r.status === "PRESENTE_PIN")
      .map((r) => r.alunoId),

  jaSalvo: (turmaId: string, disciplinaId: string, data: string = hoje()) =>
    cache.some(
      (r) =>
        r.turmaId === turmaId &&
        r.disciplinaId === disciplinaId &&
        r.data === data,
    ),

  limpar: () => gravar([]),
};

export const useRegistros = () => useSyncExternalStore(subscribe, () => cache);
