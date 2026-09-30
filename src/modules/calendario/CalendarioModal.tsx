// src/modules/calendario/CalendarioModal.tsx
import React from "react";
import { Modal } from "../../core/ui/Modal";
import { CalendarioConteudo } from "./CalendarioConteudo";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarioModal: React.FC<Props> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Calendário Acadêmico">
    <CalendarioConteudo />
  </Modal>
);
