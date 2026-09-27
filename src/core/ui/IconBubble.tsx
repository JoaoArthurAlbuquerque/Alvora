import React from "react";
import { cn } from "../lib/utils";

export type CorBubble =
  | "primary"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "cyan";

const cores: Record<CorBubble, string> = {
  primary: "from-[#7b93ff] to-[#3b59ff] shadow-[#5170ff]/40",
  violet: "from-[#a78bfa] to-[#6d5bff] shadow-violet-500/40",
  emerald: "from-[#5eead4] to-[#10b981] shadow-emerald-500/40",
  amber: "from-[#fcd34d] to-[#f59e0b] shadow-amber-500/40",
  rose: "from-[#fda4af] to-[#f43f5e] shadow-rose-500/40",
  cyan: "from-[#67e8f9] to-[#0ea5e9] shadow-sky-500/40",
};

export const IconBubble: React.FC<{
  icone: React.ElementType;
  cor?: CorBubble;
  tamanho?: "sm" | "md" | "lg";
  className?: string;
}> = ({ icone: Icone, cor = "primary", tamanho: size = "md", className }) => {
  const t = { sm: "w-9 h-9", md: "w-12 h-12", lg: "w-14 h-14" }[size];
  const i = { sm: 16, md: 20, lg: 24 }[size];
  return (
    <div
      className={cn(
        "rounded-full bg-linear-to-br text-white flex items-center justify-center shrink-0 shadow-lg",
        "transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6",
        cores[cor],
        t,
        className,
      )}
    >
      <Icone size={i} strokeWidth={2.2} />
    </div>
  );
};
