import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/30 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-primary/20 flex flex-col max-h-[90vh] animate-scale-in overflow-hidden"
      >
        <div className="relative px-6 h-16 flex items-center justify-between bg-brand text-white overflow-hidden">
          <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full bg-white/10" />
          <h3 className="relative text-base font-bold">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="relative p-1.5 rounded-lg hover:bg-white/15 hover:rotate-90 transition-all duration-300"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">{children}</div>
      </div>
    </div>
  );
};
