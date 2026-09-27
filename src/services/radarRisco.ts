import { useEffect, useMemo } from "react";
import type { ResumoFrequenciaAluno } from "./frequenciaTurma";
import { LIMITE_FALTAS_PCT } from "../config/regras";
import { criarStorePersistente } from "./storePersistente";

export const NOTA_MINIMA = 6;

export type NivelRisco = "critico" | "atencao" | "ok";
export type MotivoAlerta = "FALTAS" | "NOTA" | "AMBOS";

export interface EventoAlerta {
  em: number;
  acao: string;
  porId: string;
}

export interface Alerta {
  id: string;
  alunoId: string;
  turmaId: string;
  motivo: MotivoAlerta;
  criadoEm: number;
  notificado: { aluno: boolean; gestor: boolean };
  historico: EventoAlerta[];
}

export interface ItemRadar extends ResumoFrequenciaAluno {
  media: number | null;
  nivel: NivelRisco;
  motivo: MotivoAlerta | null;
}

const store = criarStorePersistente<Alerta[]>("alvora:alertas", []);

export const alertaStore = {
  subscribe: store.subscribe,
  listar: store.get,

  sincronizar(
    turmaId: string,
    ativos: { alunoId: string; motivo: MotivoAlerta }[],
    porId: string,
  ) {
    const agora = Date.now();
    const pendentes = new Map(ativos.map((a) => [a.alunoId, a.motivo]));
    const proximo: Alerta[] = [];
    let mudou = false;

    for (const a of store.get()) {
      if (a.turmaId !== turmaId) {
        proximo.push(a);
        continue;
      }
      const motivo = pendentes.get(a.alunoId);
      if (!motivo) {
        mudou = true; // saiu do risco → alerta resolvido
        continue;
      }
      pendentes.delete(a.alunoId);
      if (motivo !== a.motivo) {
        mudou = true;
        proximo.push({
          ...a,
          motivo,
          historico: [
            ...a.historico,
            {
              em: agora,
              acao: `motivo alterado: ${a.motivo} → ${motivo}`,
              porId,
            },
          ],
        });
      } else {
        proximo.push(a);
      }
    }

    pendentes.forEach((motivo, alunoId) => {
      mudou = true;
      proximo.push({
        id: `${turmaId}:${alunoId}`,
        alunoId,
        turmaId,
        motivo,
        criadoEm: agora,
        notificado: { aluno: false, gestor: false },
        historico: [{ em: agora, acao: `alerta aberto (${motivo})`, porId }],
      });
    });

    if (mudou) store.set(proximo);
  },

  atualizar(id: string, fn: (a: Alerta) => Alerta) {
    store.set(store.get().map((a) => (a.id === id ? fn(a) : a)));
  },

  notificar(id: string, porId: string) {
    alertaStore.atualizar(id, (a) => ({
      ...a,
      notificado: { aluno: true, gestor: true },
      historico: [
        ...a.historico,
        { em: Date.now(), acao: "aluno notificado", porId },
      ],
    }));
  },

  registrar(id: string, acao: string, porId: string) {
    alertaStore.atualizar(id, (a) => ({
      ...a,
      historico: [...a.historico, { em: Date.now(), acao, porId }],
    }));
  },

  /** Registra a ação em todos os alertas de um aluno. */
  registrarPorAluno(alunoId: string, acao: string, porId: string) {
    const agora = Date.now();
    store.set(
      store
        .get()
        .map((a) =>
          a.alunoId === alunoId
            ? { ...a, historico: [...a.historico, { em: agora, acao, porId }] }
            : a,
        ),
    );
  },
};

export const useAlertas = store.use;

// ---------- Cálculo do radar ----------
const PESO: Record<NivelRisco, number> = { critico: 0, atencao: 1, ok: 2 };

export function useRadarRisco(
  alunos: ResumoFrequenciaAluno[],
  medias: Record<string, number | null>,
  turmaId: string,
  porId: string,
) {
  const itens = useMemo<ItemRadar[]>(
    () =>
      alunos
        .map((a) => {
          const media = medias[a.id] ?? null;
          const faltas = a.emRisco;
          const nota = media !== null && media < NOTA_MINIMA;
          const motivo: MotivoAlerta | null =
            faltas && nota ? "AMBOS" : faltas ? "FALTAS" : nota ? "NOTA" : null;
          const perto =
            a.percentualFaltas >= LIMITE_FALTAS_PCT - 2 ||
            (media !== null && media < NOTA_MINIMA + 1);
          const nivel: NivelRisco = motivo
            ? "critico"
            : perto
              ? "atencao"
              : "ok";
          return { ...a, media, motivo, nivel };
        })
        .sort(
          (x, y) =>
            PESO[x.nivel] - PESO[y.nivel] ||
            x.percentualFrequencia - y.percentualFrequencia,
        ),
    [alunos, medias],
  );

  const alertas = useMemo(() => itens.filter((i) => i.motivo), [itens]);

  useEffect(() => {
    alertaStore.sincronizar(
      turmaId,
      alertas.map((a) => ({ alunoId: a.id, motivo: a.motivo! })),
      porId,
    );
  }, [alertas, turmaId, porId]);

  return { itens, alertas };
}
