import { useEffect, useState } from "react";
import { chamadaStore, useChamada } from "../services/chamadaStore";

const DURACAO_MS = 5 * 60 * 1000;

interface Props {
  turma: { id: string; alunosIds: string[] };
  disciplinaNome: string;
  professorId?: string;
}

export function ChamadaPINProfessor({ turma, disciplinaNome }: Props) {
  const { pin, expiraEm, presentesIds } = useChamada();
  const [agora, setAgora] = useState(() => Date.now());

  useEffect(() => {
    if (!expiraEm) return;
    const t = setInterval(() => {
      const now = Date.now();
      setAgora(now);
      if (now >= expiraEm) clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [expiraEm]);

  const restante = expiraEm
    ? Math.max(0, Math.ceil((expiraEm - agora) / 1000))
    : 0;
  const ativa = restante > 0;
  const total = turma.alunosIds.length;
  const presentes = presentesIds.filter((id) =>
    turma.alunosIds.includes(id),
  ).length;

  const mm = String(Math.floor(restante / 60)).padStart(2, "0");
  const ss = String(restante % 60).padStart(2, "0");

  const iniciar = () => {
    setAgora(Date.now());
    chamadaStore.iniciar(DURACAO_MS);
  };

  const encerrar = () => {
    chamadaStore.encerrar();
    setAgora(Date.now());
  };

  if (!ativa) {
    return (
      <div className="rounded-xl border p-6 text-center">
        {expiraEm && (
          <p className="mb-3 text-sm text-gray-600">
            Última chamada: {presentes}/{total} presentes
          </p>
        )}
        <button
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
          onClick={iniciar}
        >
          Iniciar chamada por PIN
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-6 text-center">
      <p className="text-sm text-gray-500">PIN · {disciplinaNome}</p>
      <p className="my-2 font-mono text-6xl tracking-[0.3em]">{pin}</p>
      <p className={restante <= 15 ? "text-red-600" : "text-gray-600"}>
        ⏱ {mm}:{ss}
      </p>
      <p className="mt-3 font-medium">
        {presentes}/{total} confirmaram
      </p>
      <div className="mx-auto mt-2 h-2 w-48 overflow-hidden rounded bg-gray-200">
        <div
          className="h-full bg-green-500 transition-all"
          style={{ width: `${total ? (presentes / total) * 100 : 0}%` }}
        />
      </div>
      <button className="mt-4 rounded-lg border px-4 py-2" onClick={encerrar}>
        Encerrar chamada
      </button>
    </div>
  );
}
