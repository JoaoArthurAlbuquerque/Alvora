// src/modules/gestor/turmas/helpers.tsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "../../../core/lib/utils";
import { erroGestao } from "../../../services/api/gestao";

export const inputCls =
  "w-full h-10 px-3 rounded-xl bg-white border border-primary/15 text-sm text-ink focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 disabled:opacity-60";

export const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

export type Aviso = { ok: (t: string) => void; erro: (e: unknown) => void };

export function useAviso() {
  const [msg, setMsg] = useState<{ texto: string; erro: boolean } | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 4000);
    return () => clearTimeout(t);
  }, [msg]);
  const aviso: Aviso = {
    ok: (texto) => setMsg({ texto, erro: false }),
    erro: (e) => setMsg({ texto: erroGestao(e), erro: true }),
  };
  const toast = msg && (
    <div
      role="status"
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 pl-4 pr-2 h-12 rounded-full text-white text-sm font-bold shadow-2xl animate-pop",
        msg.erro ? "bg-rose-600" : "bg-ink",
      )}
    >
      {msg.texto}
      <button
        onClick={() => setMsg(null)}
        aria-label="Fechar"
        className="p-1.5 rounded-full hover:bg-white/10"
      >
        <X size={14} />
      </button>
    </div>
  );
  return { aviso, toast };
}
