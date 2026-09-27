import React from "react";
import { cn } from "../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  padded = true,
  ...props
}) => (
  <div
    className={cn(
      "bg-white rounded-2xl border border-white shadow-flat transition-all duration-300",
      padded && "p-5 sm:p-6",
      hoverable &&
        "group hover:-translate-y-1 hover:shadow-flat-2 hover:border-primary/15",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
