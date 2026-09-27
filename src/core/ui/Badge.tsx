import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "info" | "danger";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className = "",
}) => {
  const styles = {
    primary: "bg-[#5170FF]/10 text-[#5170FF] border-[#5170FF]/20",
    success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    info: "bg-[#5170FF]/15 text-[#3B59FF] border-[#5170FF]/30",
    danger: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
    
  );
};
