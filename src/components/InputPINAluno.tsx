import { useState } from "react";
import {
  chamadaStore,
  type ResultadoConfirmacao,
} from "../services/chamadaStore";

type Resultado = ResultadoConfirmacao | "nao_matriculado";

const MSG: Record<Resultado, string> = {
  ok: "Presença confirmada! 🎉",
  invalido: "PIN inválido, expirado ou você não é desta turma.",
  expirado: "Nenhuma chamada ativa ou o PIN expirou.",
  duplicado: "Sua presença já foi registrada. ✅",
  erro: "Falha de conexão. Tente novamente.",
  nao_matriculado: "Você não está matriculado nesta turma.",
};

interface Props {
  alunoId: string;
  turma: { alunosIds: string[] };
}

export function InputPINAluno({ alunoId, turma }: Props) {
  const [pin, setPin] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);

  const enviar = async () => {
    if (pin.length !== 4 || enviando) return;
    setEnviando(true);
    const r: Resultado = turma.alunosIds.includes(alunoId)
      ? await chamadaStore.confirmar(pin, alunoId)
      : "nao_matriculado";
    setEnviando(false);
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
          disabled={pin.length !== 4 || enviando}
          className="rounded-lg bg-indigo-600 px-4 text-white disabled:opacity-40"
        >
          {enviando ? "..." : "Confirmar"}
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
