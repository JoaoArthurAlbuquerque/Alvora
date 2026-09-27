// src/modules/calendario/CalendarioModal.tsx
import React from "react";
import { Modal } from "../../core/ui/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarioModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Calendário Acadêmico 2026">
      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-primary/10 text-primary flex justify-between items-center text-xs font-bold">
          <span>25 de Setembro, 2026</span>
          <span>Início de Entregas Parciais</span>
        </div>
        <div className="p-3 rounded-xl bg-primary/5 text-slate-700 flex justify-between items-center text-xs font-medium">
          <span>15 de Outubro, 2026</span>
          <span>Avaliação Geral do Semestre</span>
        </div>
      </div>
    </Modal>
  );
};
