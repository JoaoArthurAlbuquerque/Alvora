// =====================================================================
// src/modules/aluno/ConfirmarPresencaCard.tsx
// =====================================================================
import React, { useState } from "react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { useRegras } from "../../services/regrasService";
import { useConfirmarPresenca } from "../../services/alunoApi";
import type { ResultadoConfirmacao } from "../../services/chamadaStore";

const MENSAGENS: Record<ResultadoConfirmacao, { texto: string; cor: string }> =
  {
    ok: { texto: "✓ Presença confirmada!", cor: "text-emerald-600" },
    invalido: {
      texto: "PIN inválido, expirado ou você não é desta turma.",
      cor: "text-rose-600",
    },
    expirado: { texto: "Esta chamada já expirou.", cor: "text-amber-600" },
    duplicado: { texto: "Você já confirmou presença. 😉", cor: "text-primary" },
    erro: { texto: "Falha de conexão. Tente novamente.", cor: "text-rose-600" },
  };

export const ConfirmarPresencaCard: React.FC = () => {
  const { digitosPin: digitos } = useRegras();
  const confirmar = useConfirmarPresenca();
  const [pin, setPin] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoConfirmacao | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    setResultado(await confirmar(pin));
    setEnviando(false);
    setPin("");
  };

  return (
    <Card>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-3">
        Chamada ao vivo
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, "").slice(0, digitos));
            setResultado(null);
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label="PIN da chamada"
          placeholder={`PIN de ${digitos} dígitos`}
          className="flex-1 h-12 px-4 rounded-xl border border-primary/20 bg-white text-center text-lg font-black tracking-widest tabular focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40"
        />
        <Button
          type="submit"
          size="lg"
          disabled={pin.length !== digitos || enviando}
        >
          {enviando ? "Enviando..." : "Confirmar"}
        </Button>
      </form>
      {resultado && (
        <p
          role="status"
          className={`text-xs font-bold mt-3 ${MENSAGENS[resultado].cor}`}
        >
          {MENSAGENS[resultado].texto}
        </p>
      )}
    </Card>
  );
};
