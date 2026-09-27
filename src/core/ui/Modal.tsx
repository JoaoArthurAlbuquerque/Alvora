import React from "react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-flat border border-primary/15 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-primary/10 flex items-center justify-between bg-primary/5">
          <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-primary p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">{children}</div>
      </div>
    </div>
  );
};
