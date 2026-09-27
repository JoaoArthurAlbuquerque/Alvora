import React from "react";
import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

const sizes = {
  sm: "h-8 px-3.5 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-sm gap-2 rounded-xl",
};

const variants = {
  primary:
    "bg-brand text-white shadow-glow hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-8px_rgba(81,112,255,0.65)]",
  secondary: "bg-primary/10 text-primary hover:bg-primary/15",
  outline:
    "border border-primary/20 bg-white text-primary hover:bg-primary/5 hover:border-primary/40",
  ghost: "text-primary hover:bg-primary/10",
  danger:
    "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 hover:-translate-y-0.5",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  className,
  type = "button",
  ...props
}) => (
  <button
    type={type}
    className={cn(
      "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.97]",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25",
      "disabled:opacity-50 disabled:pointer-events-none",
      sizes[size],
      variants[variant],
      className,
    )}
    {...props}
  >
    {icon && <span className="inline-flex shrink-0">{icon}</span>}
    {children}
  </button>
);
