// =====================================================================
// src/core/ui/AcessoRapido.tsx  (NOVO: crie este arquivo)
// Atalho ≠ card: fundo levemente tingido, sem sombra grande e seta que anda no hover
// =====================================================================
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";
import { IconBubble, type CorBubble } from "./IconBubble";

export interface Atalho {
  titulo: string;
  descricao?: string;
  icone: React.ElementType;
  cor?: CorBubble;
  to?: string; // navegação
  onClick?: () => void; // ou ação (abrir modal etc.)
}

const itemCls = cn(
  "group flex items-center gap-3 w-full min-h-16 px-3.5 py-3 rounded-xl text-left cursor-pointer",
  "bg-primary/[0.04] border border-primary/10 transition-all duration-200",
  "hover:bg-white hover:border-primary/30 hover:shadow-flat-sm active:scale-[0.99]",
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25",
);

const Conteudo: React.FC<{ a: Atalho }> = ({ a }) => (
  <>
    <IconBubble icone={a.icone} cor={a.cor ?? "primary"} tamanho="sm" />
    <span className="flex-1 min-w-0">
      <span className="block text-sm font-bold text-ink truncate">
        {a.titulo}
      </span>
      {a.descricao && (
        <span className="block text-xs text-slate-500 truncate">
          {a.descricao}
        </span>
      )}
    </span>
    <span
      aria-hidden
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-primary bg-white border border-primary/15 transition-all group-hover:bg-primary group-hover:text-white group-hover:translate-x-0.5"
    >
      <ArrowRight size={15} strokeWidth={2.5} />
    </span>
  </>
);

export const AcessoRapido: React.FC<{ itens: Atalho[]; titulo?: string }> = ({
  itens,
  titulo = "Acesso rápido",
}) => (
  <section aria-labelledby="acesso-rapido" className="space-y-2.5">
    <h2
      id="acesso-rapido"
      className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 px-1"
    >
      {titulo}
    </h2>
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
      {itens.map((a) => (
        <li key={a.titulo}>
          {a.to ? (
            <Link to={a.to} className={itemCls}>
              <Conteudo a={a} />
            </Link>
          ) : (
            <button type="button" onClick={a.onClick} className={itemCls}>
              <Conteudo a={a} />
            </button>
          )}
        </li>
      ))}
    </ul>
  </section>
);
