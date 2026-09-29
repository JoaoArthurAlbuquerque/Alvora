import React, { useState } from "react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { useAlunoDados } from "./useAlunoDados";
import { useRegras } from "../../services/regrasService";
import {
  chamadaStore,
  type ResultadoConfirmacao,
} from "../../services/chamadaStore";

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
  const { aluno } = useAlunoDados();
  const { digitosPin: digitos } = useRegras();
  const [pin, setPin] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoConfirmacao | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    setResultado(await chamadaStore.confirmar(pin, aluno.id));
    setEnviando(false);
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
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, "").slice(0, digitos));
            setResultado(null);
          }}
          inputMode="numeric"
          placeholder={`PIN de ${digitos} dígitos`}
          className="flex-1 px-4 py-2 rounded-xl border border-primary/20 text-center text-lg font-black tracking-widest focus:outline-none focus:border-primary"
        />
        <Button type="submit" disabled={pin.length !== digitos || enviando}>
          {enviando ? "Enviando..." : "Confirmar"}
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
