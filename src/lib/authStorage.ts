// =====================================================================
// src/lib/authStorage.ts  (NOVO)
// Um só lugar decide onde a sessão fica: localStorage (lembrar) ou sessionStorage
// =====================================================================
const FLAG = "alvora:lembrar";

const pegar = (f: () => Storage): Storage | null => {
  try {
    return typeof window === "undefined" ? null : f();
  } catch {
    return null; // modo privado / storage bloqueado
  }
};
const local = () => pegar(() => window.localStorage);
const sessao = () => pegar(() => window.sessionStorage);

/** Padrão: lembrar (mantém o comportamento de quem já estava logado) */
export const lembrarSessao = (): boolean => local()?.getItem(FLAG) !== "0";

export function definirLembrar(lembrar: boolean) {
  local()?.setItem(FLAG, lembrar ? "1" : "0");
}

const atual = () => (lembrarSessao() ? local() : sessao());
const outro = () => (lembrarSessao() ? sessao() : local());

/** Compatível com o Supabase Auth e com o createJSONStorage do Zustand */
export const authStorage = {
  getItem: (k: string): string | null => atual()?.getItem(k) ?? null,
  setItem: (k: string, v: string) => {
    atual()?.setItem(k, v);
    outro()?.removeItem(k); // nunca deixa token sobrando no outro lugar
  },
  removeItem: (k: string) => {
    local()?.removeItem(k);
    sessao()?.removeItem(k);
  },
};