import React from "react";
import { useLocation } from "react-router-dom";
import { Hammer } from "lucide-react";

export const EmConstrucao: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Hammer className="text-slate-300 mb-3" size={28} />
      <h1 className="text-base font-semibold text-slate-800">
        Essa tela ainda está sendo construída
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Volte em breve.{" "}
        <code className="text-xs text-slate-400">{pathname}</code>
      </p>
    </div>
  );
};
