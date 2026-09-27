import React from "react";
import { cn } from "../lib/utils";

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("animate-pulse bg-primary/10 rounded-xl", className)} />
);
