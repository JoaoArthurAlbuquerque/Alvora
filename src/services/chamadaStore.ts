import { useSyncExternalStore } from "react";
import { REGRAS } from "../config/regras";
import { supabase } from "../lib/supabase";

const KEY = "alvora:chamada";
const EVT = "alvora:chamada-change";
const FUSO = "America/Recife";

export type ResultadoConfirmacao = "ok" | "invalido" | "expirado" | "duplicado" | "erro";

export interface EstadoChamada {
  chamadaId: string | null;
  disciplinaId: string | null; // = turma_disciplina_id
  disciplinaNome: string | null;
  pin: string | null;
  expiraEm: number | null;
  data: string | null; // YYYY-MM-DD (fuso Recife)
  presentesIds: string[];
}

export interface InfoChamada {
  disciplinaId: string; // turma_disciplina_id (obrigatório)
  disciplinaNome?: string;
}

const VAZIO: EstadoChamada = {
  chamadaId: null,
  disciplinaId: null,
  disciplinaNome: null,
  pin: null,
  expiraEm: null,
  data: null,
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

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      cache = ler();
      window.dispatchEvent(new Event(EVT));
    }
  });
}

function gravar(estado: EstadoChamada) {
  localStorage.setItem(KEY, JSON.stringify(estado));
  cache = estado;
  window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  return () => window.removeEventListener(EVT, cb);
}

/** PIN criptograficamente aleatório com o nº de dígitos das regras */
const gerarPin = () => {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 10 ** REGRAS.digitosPin;
  return String(n).padStart(REGRAS.digitosPin, "0");
};

/** Data de hoje no fuso de Recife, igual à checagem da função SQL. */
const hojeRecife = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: FUSO });

function mapearErro(msg: string): ResultadoConfirmacao {
  const m = msg.toLowerCase();
  if (m.includes("expirado")) return "expirado";
  if (m.includes("duplicad") || m.includes("já registr")) return "duplicado";
  if (m.includes("pin inválido") || m.includes("turma")) return "invalido";
  return "erro"; // rede, sessão, etc.
}

export const chamadaStore = {
  estado: () => cache,

  /** PROFESSOR: cria ou substitui o PIN do dia em aula_pins. */
  async iniciar(duracaoMs: number, info: InfoChamada) {
    const pin = gerarPin();
    const expiraEm = Date.now() + duracaoMs;
    const data = hojeRecife();

    const { error } = await supabase
      .from("aula_pins")
      .upsert(
        {
          turma_disciplina_id: info.disciplinaId,
          data,
          pin,
          expira_em: new Date(expiraEm).toISOString(),
        },
        { onConflict: "turma_disciplina_id,data" },
      );
    if (error) throw new Error(`Falha ao abrir chamada: ${error.message}`);

    const atual = ler();
    const mesmoDia = atual.disciplinaId === info.disciplinaId && atual.data === data;

    gravar({
      chamadaId: `${info.disciplinaId}-${data}-${pin}`,
      disciplinaId: info.disciplinaId,
      disciplinaNome: info.disciplinaNome ?? null,
      pin,
      expiraEm,
      data,
      presentesIds: mesmoDia ? atual.presentesIds : [], // reabriu? mantém quem já confirmou
    });
  },

  /** PROFESSOR: expira o PIN no banco agora. */
  async encerrar() {
    const a = ler();
    if (!a.disciplinaId || !a.data || !a.expiraEm) return;

    const { error } = await supabase
      .from("aula_pins")
      .update({ expira_em: new Date().toISOString() })
      .eq("turma_disciplina_id", a.disciplinaId)
      .eq("data", a.data);
    if (error) throw new Error(`Falha ao encerrar: ${error.message}`);

    gravar({ ...a, expiraEm: Math.min(a.expiraEm, Date.now()) });
  },

  /** PROFESSOR: busca quem já confirmou (os alunos usam outros aparelhos). */
  async atualizarPresentes() {
    const a = ler();
    if (!a.disciplinaId || !a.data) return;

    const { data, error } = await supabase
      .from("frequencias")
      .select("aluno_id")
      .eq("turma_disciplina_id", a.disciplinaId)
      .eq("data", a.data)
      .eq("presente", true);
    if (error) return;

    gravar({ ...a, presentesIds: data.map((r) => r.aluno_id) });
  },

  /** ALUNO: quem valida é o banco. */
  async confirmar(pin: string, alunoId: string): Promise<ResultadoConfirmacao> {
    const limpo = pin.trim();
    if (!/^\d{4,8}$/.test(limpo)) return "invalido";

    const { error } = await supabase.rpc("registrar_presenca", { p_pin: limpo });
    if (error) return mapearErro(error.message);

    const a = ler();
    if (!a.presentesIds.includes(alunoId))
      gravar({ ...a, presentesIds: [...a.presentesIds, alunoId] });
    return "ok";
  },

  limpar: () => gravar(VAZIO),
};

export const useChamada = () => useSyncExternalStore(subscribe, () => cache);
