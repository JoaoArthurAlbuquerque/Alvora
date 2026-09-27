import React, { useState } from "react";
import { Modal } from "../../core/ui/Modal";
import { Button } from "../../core/ui/Button";

type Props = {
  aberto: boolean;
  titulo: string;
  rotulo: string;
  placeholder?: string;
  confirmar: string;
  perigo?: boolean;
  onConfirmar: (texto: string) => void;
  onFechar: () => void;
};

type FormProps = Omit<Props, "aberto" | "titulo">;

// Montado só quando o modal abre → estado nasce vazio, sem effect
const Formulario: React.FC<FormProps> = ({
  rotulo,
  placeholder,
  confirmar,
  perigo,
  onConfirmar,
  onFechar,
}) => {
  const [texto, setTexto] = useState("");

  const enviar = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const t = texto.trim();
    if (!t) return;
    onConfirmar(t);
    onFechar();
  };

  return (
    <form onSubmit={enviar} className="space-y-4">
      <label className="block text-sm font-semibold text-ink">
        {rotulo}
        <textarea
          autoFocus
          rows={3}
          value={texto}
          placeholder={placeholder}
          onChange={(e) => setTexto(e.target.value)}
          className="mt-1.5 w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 resize-none focus:bg-white focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition"
        />
      </label>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onFechar}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant={perigo ? "danger" : "primary"}
          className="w-full"
          disabled={!texto.trim()}
        >
          {confirmar}
        </Button>
      </div>
    </form>
  );
};

export const ModalTexto: React.FC<Props> = ({ aberto, titulo, ...resto }) => (
  <Modal isOpen={aberto} onClose={resto.onFechar} title={titulo}>
    {aberto && <Formulario {...resto} />}
  </Modal>
);
