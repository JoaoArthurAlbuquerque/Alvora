import { useSyncExternalStore } from "react";
import { REGRAS } from "../config/regras";

const KEY = "alvora:chamada";
const EVT = "alvora:chamada-change";

export type ResultadoConfirmacao = "ok" | "invalido" | "expirado" | "duplicado";

export interface EstadoChamada {
  chamadaId: string | null;
  disciplinaId: string | null;
  disciplinaNome: string | null;
  pin: string | null;
  expiraEm: number | null;
  presentesIds: string[];
}

export interface InfoChamada {
  chamadaId?: string;
  disciplinaId?: string;
  disciplinaNome?: string;
}

const VAZIO: EstadoChamada = {
  chamadaId: null,
  disciplinaId: null,
  disciplinaNome: null,
  pin: null,
  expiraEm: null,
  presentesIds: [],
};

function ler(): EstadoChamada {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return v && typeof v === "object" ? { ...VAZIO, ...v } : VAZIO;
  } catch {
    return VAZIO;
  }
}

let cache: EstadoChamada = ler();

function gravar(estado: EstadoChamada) {
  localStorage.setItem(KEY, JSON.stringify(estado));
  cache = estado;
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

/** PIN numérico com a quantidade de dígitos definida em REGRAS. */
const gerarPin = () =>
  Math.floor(Math.random() * 10 ** REGRAS.digitosPin)
    .toString()
    .padStart(REGRAS.digitosPin, "0");

export const chamadaStore = {
  estado: () => cache,

  iniciar(duracaoMs: number, info: InfoChamada = {}) {
    gravar({
      chamadaId: info.chamadaId ?? `ch-${Date.now()}`,
      disciplinaId: info.disciplinaId ?? null,
      disciplinaNome: info.disciplinaNome ?? null,
      pin: gerarPin(),
      expiraEm: Date.now() + duracaoMs,
      presentesIds: [],
    });
  },

  /** Expira a chamada agora, mas mantém os presentes para salvar no diário. */
  encerrar() {
    if (!cache.expiraEm) return;
    gravar({ ...cache, expiraEm: Math.min(cache.expiraEm, Date.now()) });
  },

  confirmar(pin: string, alunoId: string): ResultadoConfirmacao {
    const { pin: atual, expiraEm, presentesIds } = cache;
    if (!atual || !expiraEm || Date.now() >= expiraEm) return "expirado";
    if (pin.trim() !== atual) return "invalido";
    if (presentesIds.includes(alunoId)) return "duplicado";
    gravar({ ...cache, presentesIds: [...presentesIds, alunoId] });
    return "ok";
  },

  limpar: () => gravar(VAZIO),
};

export const useChamada = () => useSyncExternalStore(subscribe, () => cache);
