// src/modules/central-duvidas/CentralDuvidasDrawer.tsx
import React from "react";
import { Button } from "../../core/ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CentralDuvidasDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0F172A]/30 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-flat p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center pb-4 border-b border-primary/10">
            <h3 className="font-bold text-slate-900">Central de Dúvidas</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 space-y-3">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs font-bold text-primary">Dúvida #1042</p>
              <p className="text-xs text-slate-700 mt-1">
                Como enviar o projeto final de React com TypeScript?
              </p>
            </div>
          </div>
        </div>
        <Button onClick={onClose} className="w-full">
          Fechar
        </Button>
      </div>
    </div>
  );
};
