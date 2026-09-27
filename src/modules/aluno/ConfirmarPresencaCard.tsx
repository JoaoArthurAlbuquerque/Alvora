import React, { useState } from "react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { alunoLogadoMock } from "../../mocks/data";
import {
  chamadaStore,
  type ResultadoConfirmacao,
} from "../../services/chamadaStore";

const MENSAGENS: Record<ResultadoConfirmacao, { texto: string; cor: string }> =
  {
    ok: { texto: "✓ Presença confirmada!", cor: "text-emerald-600" },
    invalido: {
      texto: "PIN inválido. Confira no data-show.",
      cor: "text-rose-600",
    },
    expirado: { texto: "Esta chamada já expirou.", cor: "text-amber-600" },
    duplicado: {
      texto: "Você já confirmou presença. 😉",
      cor: "text-[#5170FF]",
    },
  };

export const ConfirmarPresencaCard: React.FC = () => {
  const [pin, setPin] = useState("");
  const [resultado, setResultado] = useState<ResultadoConfirmacao | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResultado(chamadaStore.confirmar(pin, alunoLogadoMock.id));
    setPin("");
  };

  return (
    <Card>
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
        Chamada ao Vivo
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={pin}
          onChange={(e) =>
            setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          inputMode="numeric"
          placeholder="PIN de 4 dígitos"
          className="flex-1 px-4 py-2 rounded-xl border border-[#5170FF]/20 text-center text-lg font-black tracking-widest focus:outline-none focus:border-[#5170FF]"
        />
        <Button type="submit" disabled={pin.length !== 4}>
          Confirmar
        </Button>
      </form>
      {resultado && (
        <p className={`text-xs font-bold mt-3 ${MENSAGENS[resultado].cor}`}>
          {MENSAGENS[resultado].texto}
        </p>
      )}
    </Card>
  );
};
