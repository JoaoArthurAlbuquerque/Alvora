import { useEffect, useMemo } from "react";
import type { ResumoFrequenciaAluno } from "./frequenciaTurma";
import type { RegraFrequencia } from "../types";
import {
  REGRAS,
  MEDIA_MINIMA,
  MARGEM_FALTAS_PP,
  MARGEM_NOTA,
  useRegras,
} from "../config/regras";
import { criarStorePersistente } from "./storePersistente";

/** @deprecated use REGRAS.mediaMinima (este valor não se atualiza) */
export const NOTA_MINIMA = MEDIA_MINIMA;

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
  resolvidoEm?: number;
  notificado: { aluno: boolean; gestor: boolean };
  historico: EventoAlerta[];
}

export interface ItemRadar extends ResumoFrequenciaAluno {
  media: number | null;
  nivel: NivelRisco;
  motivo: MotivoAlerta | null;
}

// ---------- Regra única (pura e testável) ----------
export function classificar(
  pctFaltas: number,
  media: number | null,
  regras: RegraFrequencia = REGRAS,
): { motivo: MotivoAlerta | null; nivel: NivelRisco } {
  const limite = regras.limiteAlertaFaltas;
  const minima = regras.mediaMinima;

  const faltas = pctFaltas > limite;
  const nota = media !== null && media < minima;
  const motivo: MotivoAlerta | null =
    faltas && nota ? "AMBOS" : faltas ? "FALTAS" : nota ? "NOTA" : null;

  const perto =
    pctFaltas >= limite - MARGEM_FALTAS_PP ||
    (media !== null && media < minima + MARGEM_NOTA);

  const nivel: NivelRisco = motivo ? "critico" : perto ? "atencao" : "ok";
  return { motivo, nivel };
}

export function contarRisco(itens: ItemRadar[]) {
  return {
    alertas: itens.filter((i) => i.motivo).length,
    atencao: itens.filter((i) => i.nivel === "atencao").length,
  };
}

export const alertaAtivo = (a: Alerta) => !a.resolvidoEm;

// ---------- Store de alertas ----------
const store = criarStorePersistente<Alerta[]>("alvora:alertas", []);

export const alertaStore = {
  subscribe: store.subscribe,
  listar: store.get,
  listarAtivos: () => store.get().filter(alertaAtivo),

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

      // Saiu do risco → resolve (não apaga, preserva auditoria)
      if (!motivo) {
        if (!a.resolvidoEm) {
          mudou = true;
          proximo.push({
            ...a,
            resolvidoEm: agora,
            historico: [...a.historico, { em: agora, acao: "alerta resolvido", porId }],
          });
        } else {
          proximo.push(a);
        }
        continue;
      }

      pendentes.delete(a.alunoId);

      // Voltou ao risco → reabre o mesmo alerta
      if (a.resolvidoEm) {
        mudou = true;
        proximo.push({
          ...a,
          motivo,
          resolvidoEm: undefined,
          notificado: { aluno: false, gestor: false },
          historico: [
            ...a.historico,
            { em: agora, acao: `alerta reaberto (${motivo})`, porId },
          ],
        });
        continue;
      }

      if (motivo !== a.motivo) {
        mudou = true;
        proximo.push({
          ...a,
          motivo,
          historico: [
            ...a.historico,
            { em: agora, acao: `motivo alterado: ${a.motivo} → ${motivo}`, porId },
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
      historico: [...a.historico, { em: Date.now(), acao: "aluno notificado", porId }],
    }));
  },

  registrar(id: string, acao: string, porId: string) {
    alertaStore.atualizar(id, (a) => ({
      ...a,
      historico: [...a.historico, { em: Date.now(), acao, porId }],
    }));
  },

  /** Registra a ação em todos os alertas ativos de um aluno. */
  registrarPorAluno(alunoId: string, acao: string, porId: string) {
    const agora = Date.now();
    store.set(
      store
        .get()
        .map((a) =>
          a.alunoId === alunoId && alertaAtivo(a)
            ? { ...a, historico: [...a.historico, { em: agora, acao, porId }] }
            : a,
        ),
    );
  },
};

export const useAlertas = store.use;

// ---------- Hook do radar ----------
const PESO: Record<NivelRisco, number> = { critico: 0, atencao: 1, ok: 2 };

export function useRadarRisco(
  alunos: ResumoFrequenciaAluno[],
  medias: Record<string, number | null>,
  turmaId: string,
  porId: string,
  carregando = false,
) {
  const regras = useRegras();

  const itens = useMemo<ItemRadar[]>(
    () =>
      alunos
        .map((a) => {
          const media = medias[a.id] ?? null;
          return { ...a, media, ...classificar(a.percentualFaltas, media, regras) };
        })
        .sort(
          (x, y) =>
            PESO[x.nivel] - PESO[y.nivel] ||
            x.percentualFrequencia - y.percentualFrequencia,
        ),
    [alunos, medias, regras],
  );

  const alertas = useMemo(() => itens.filter((i) => i.motivo), [itens]);
  const contagem = useMemo(() => contarRisco(itens), [itens]);

  useEffect(() => {
    // Evita "resolver" todos os alertas enquanto os dados ainda não chegaram
    if (carregando || alunos.length === 0) return;
    alertaStore.sincronizar(
      turmaId,
      alertas.map((a) => ({ alunoId: a.id, motivo: a.motivo! })),
      porId,
    );
  }, [alertas, alunos.length, turmaId, porId, carregando]);

  return { itens, alertas, contagem };
}
