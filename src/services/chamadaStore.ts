import { useSyncExternalStore } from "react";

const KEY = "alvora:chamada";

export type ChamadaState = {
  pin: string | null;
  expiraEm: number | null;
  presentesIds: string[];
};

export type ResultadoConfirmacao = "ok" | "invalido" | "expirado" | "duplicado";

const VAZIO: ChamadaState = { pin: null, expiraEm: null, presentesIds: [] };

let cacheRaw: string | null = null;
let cache: ChamadaState = VAZIO;
const listeners = new Set<() => void>();

function ler(): ChamadaState {
  const raw = localStorage.getItem(KEY);
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cache = raw ? (JSON.parse(raw) as ChamadaState) : VAZIO;
    } catch {
      cache = VAZIO;
    }
  }
  return cache;
}

function gravar(state: ChamadaState) {
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage); // sincroniza outras abas
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export const chamadaStore = {
  iniciar(duracaoMs: number): string {
    const pin = String(Math.floor(1000 + Math.random() * 9000));
    gravar({ pin, expiraEm: Date.now() + duracaoMs, presentesIds: [] });
    return pin;
  },

  encerrar() {
    gravar({ ...ler(), expiraEm: Date.now() });
  },

  confirmar(pin: string, alunoId: string): ResultadoConfirmacao {
    const s = ler();
    if (!s.pin || s.pin !== pin.trim()) return "invalido";
    if (!s.expiraEm || Date.now() >= s.expiraEm) return "expirado";
    if (s.presentesIds.includes(alunoId)) return "duplicado";
    gravar({ ...s, presentesIds: [...s.presentesIds, alunoId] });
    return "ok";
  },
};

export function useChamada(): ChamadaState {
  return useSyncExternalStore(subscribe, ler, () => VAZIO);
}
