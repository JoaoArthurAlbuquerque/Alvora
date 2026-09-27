import React from "react";
import { cn } from "../lib/utils";

type Variant =
  | "primary"
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "neutral";

const styles: Record<Variant, string> = {
  primary: "bg-primary/10 text-primary",
  info: "bg-brand text-white shadow-flat-sm",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-rose-50 text-rose-600",
  neutral: "bg-slate-100 text-slate-600",
};

export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}> = ({ children, variant = "neutral", className }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap",
      styles[variant],
      className,
    )}
  >
    {children}
  </span>
);
