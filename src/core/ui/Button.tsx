import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5170FF]/40 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#5170FF] to-[#3B59FF] text-white shadow-flat-sm hover:opacity-95 active:scale-[0.98]",
    secondary:
      "bg-[#5170FF]/10 text-[#5170FF] hover:bg-[#5170FF]/15 active:scale-[0.98]",
    outline:
      "border border-[#5170FF]/20 text-[#5170FF] bg-white hover:bg-[#5170FF]/5",
    ghost: "text-[#5170FF] hover:bg-[#5170FF]/10",
    danger: "bg-rose-500/10 text-rose-600 hover:bg-rose-500/15",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
