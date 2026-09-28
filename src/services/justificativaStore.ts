import { criarStorePersistente } from "./storePersistente";
import { alertaStore } from "./radarRisco";
import { calcularPercentual } from "../utils/frequencia";

export type StatusJustificativa = "pendente" | "aprovada" | "recusada";

export interface Justificativa {
  id: string;
  alunoId: string;
  alunoNome: string;
  disciplinaId: string;
  disciplinaNome: string;
  dataFalta: string; // yyyy-mm-dd
  motivo: string;
  anexoNome?: string;
  status: StatusJustificativa;
  criadaEm: number;
  decididaEm?: number;
  parecer?: string;
}

type NovaJustificativa = Omit<Justificativa, "id" | "status" | "criadaEm">;

const store = criarStorePersistente<Justificativa[]>(
  "alvora:justificativas",
  [],
);

export const justificativaStore = {
  listar: store.get,

  enviar(j: NovaJustificativa): "ok" | "duplicada" {
    const existe = store
      .get()
      .some(
        (x) =>
          x.alunoId === j.alunoId &&
          x.disciplinaId === j.disciplinaId &&
          x.dataFalta === j.dataFalta &&
          x.status !== "recusada",
      );
    if (existe) return "duplicada";

    store.set([
      ...store.get(),
      {
        ...j,
        id: `jus-${Date.now()}`,
        status: "pendente",
        criadaEm: Date.now(),
      },
    ]);
    alertaStore.registrarPorAluno(
      j.alunoId,
      `justificativa enviada (${j.disciplinaNome}, ${j.dataFalta})`,
      j.alunoId,
    );
    return "ok";
  },

  decidir(
    id: string,
    status: "aprovada" | "recusada",
    porId: string,
    parecer?: string,
  ) {
    const alvo = store.get().find((j) => j.id === id);
    if (!alvo) return;
    store.set(
      store
        .get()
        .map((j) =>
          j.id === id ? { ...j, status, parecer, decididaEm: Date.now() } : j,
        ),
    );
    alertaStore.registrarPorAluno(
      alvo.alunoId,
      `justificativa ${status} (${alvo.dataFalta})${parecer ? `: ${parecer}` : ""}`,
      porId,
    );
  },
};

export const useJustificativas = store.use;

/** Abona no histórico do aluno as faltas com justificativa aprovada. */
export function aplicarAbonos<
  H extends {
    disciplinaId: string;
    presencas: number;
    faltas: number;
    percentualFrequencia: number;
  },
>(historico: H[], justificativas: Justificativa[], alunoId: string): H[] {
  return historico.map((h) => {
    const abonadas = justificativas.filter(
      (j) =>
        j.alunoId === alunoId &&
        j.disciplinaId === h.disciplinaId &&
        j.status === "aprovada",
    ).length;
    if (!abonadas) return h;
    const faltas = Math.max(0, h.faltas - abonadas);
    const presencas = h.presencas + (h.faltas - faltas);
    return {
      ...h,
      faltas,
      presencas,
      percentualFrequencia: calcularPercentual(presencas, presencas + faltas),
    };
  });
}
