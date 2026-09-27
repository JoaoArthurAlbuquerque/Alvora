// src/modules/assistente-pedagogico/AssistentePedagogicoModal.tsx
import React, { useState } from "react";
import { Modal } from "../../core/ui/Modal";
import { Button } from "../../core/ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AssistentePedagogicoModal: React.FC<Props> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Olá! Sou seu Assistente Pedagógico Alvora. Como posso ajudar em seus estudos hoje?",
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setQuery("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Entendi sua dúvida! Recomendamos revisar a unidade de componentes reutilizáveis do curso.",
        },
      ]);
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assistente Pedagógico IA">
      <div className="space-y-4">
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-white ml-auto max-w-[80%]"
                  : "bg-primary/10 text-slate-800 mr-auto max-w-[80%]"
              }`}
            >
              {m.content}
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite sua dúvida pedagógica..."
            className="flex-1 px-4 py-2 rounded-xl border border-primary/20 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 bg-primary-soft"
          />
          <Button type="submit" size="sm">
            Enviar
          </Button>
        </form>
      </div>
    </Modal>
  );
};
