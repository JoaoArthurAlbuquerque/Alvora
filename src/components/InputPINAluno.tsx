import { useState } from "react";
import {
  chamadaStore,
  type ResultadoConfirmacao,
} from "../services/chamadaStore";

type Resultado = ResultadoConfirmacao | "nao_matriculado";

const MSG: Record<Resultado, string> = {
  ok: "Presença confirmada! 🎉",
  invalido: "PIN incorreto. Confira e tente de novo.",
  expirado: "Nenhuma chamada ativa ou o PIN expirou.",
  duplicado: "Sua presença já foi registrada. ✅",
  nao_matriculado: "Você não está matriculado nesta turma.",
};

interface Props {
  alunoId: string;
  turma: { alunosIds: string[] };
}

export function InputPINAluno({ alunoId, turma }: Props) {
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);

  const enviar = () => {
    if (pin.length !== 4) return;
    const r: Resultado = turma.alunosIds.includes(alunoId)
      ? chamadaStore.confirmar(pin, alunoId)
      : "nao_matriculado";
    const ok = r === "ok" || r === "duplicado";
    setMsg({ ok, texto: MSG[r] });
    if (ok) setPin("");
  };

  return (
    <div className="rounded-xl border p-6">
      <label className="text-sm font-medium">Digite o PIN da aula</label>
      <div className="mt-2 flex gap-2">
        <input
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) =>
            setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          className="w-32 rounded-lg border px-3 py-2 text-center font-mono text-2xl tracking-widest"
        />
        <button
          onClick={enviar}
          disabled={pin.length !== 4}
          className="rounded-lg bg-indigo-600 px-4 text-white disabled:opacity-40"
        >
          Confirmar
        </button>
      </div>
      {msg && (
        <p
          className={`mt-3 text-sm ${msg.ok ? "text-green-600" : "text-red-600"}`}
        >
          {msg.texto}
        </p>
      )}
    </div>
  );
}
