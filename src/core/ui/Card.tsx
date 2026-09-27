import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-flat border border-primary/10 transition-all duration-200 ${
        hoverable ? "hover:-translate-y-0.5 hover:border-primary/25" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
