// src/services/eventoStore.ts
import { useSyncExternalStore } from "react";

export type TipoEvento = "entrega" | "avaliacao" | "feriado" | "evento";

export type Evento = {
  id: string;
  data: string; // AAAA-MM-DD
  titulo: string;
  tipo: TipoEvento;
  criadoPor: string;
};

const CHAVE = "alvora:eventos";

const SEED: Evento[] = [
  {
    id: "e1",
    data: "2026-09-25",
    titulo: "Início de Entregas Parciais",
    tipo: "entrega",
    criadoPor: "sistema",
  },
  {
    id: "e2",
    data: "2026-10-12",
    titulo: "Nossa Senhora Aparecida",
    tipo: "feriado",
    criadoPor: "sistema",
  },
  {
    id: "e3",
    data: "2026-10-15",
    titulo: "Avaliação Geral do Semestre",
    tipo: "avaliacao",
    criadoPor: "sistema",
  },
  {
    id: "e4",
    data: "2026-10-15",
    titulo: "Dia do Professor",
    tipo: "evento",
    criadoPor: "sistema",
  },
  {
    id: "e5",
    data: "2026-11-02",
    titulo: "Finados",
    tipo: "feriado",
    criadoPor: "sistema",
  },
  {
    id: "e6",
    data: "2026-11-20",
    titulo: "Feira de Ciências",
    tipo: "evento",
    criadoPor: "sistema",
  },
];

const carregar = (): Evento[] => {
  try {
    const raw = localStorage.getItem(CHAVE);
    return raw ? (JSON.parse(raw) as Evento[]) : SEED;
  } catch {
    return SEED;
  }
};

let estado: Evento[] = carregar();
const ouvintes = new Set<() => void>();

const emitir = (novo: Evento[]) => {
  estado = novo;
  localStorage.setItem(CHAVE, JSON.stringify(estado));
  ouvintes.forEach((fn) => fn());
};

export const eventoStore = {
  listar: () => estado,
  adicionar: (e: Omit<Evento, "id">) =>
    emitir([...estado, { ...e, id: crypto.randomUUID() }]),
  atualizar: (id: string, dados: Partial<Omit<Evento, "id" | "criadoPor">>) =>
    emitir(estado.map((e) => (e.id === id ? { ...e, ...dados } : e))),
  remover: (id: string) => emitir(estado.filter((e) => e.id !== id)),
  assinar: (fn: () => void) => {
    ouvintes.add(fn);
    return () => ouvintes.delete(fn);
  },
};

export const useEventos = () =>
  useSyncExternalStore(eventoStore.assinar, eventoStore.listar);
