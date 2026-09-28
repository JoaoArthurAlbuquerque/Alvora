import { useEffect, useState } from "react";
import { chamadaStore, useChamada } from "../services/chamadaStore";

const DURACAO_MS = 5 * 60 * 1000;

interface Props {
  turma: { id: string; alunosIds: string[] };
  turmaDisciplinaId: string; // turma_disciplinas.id
  disciplinaNome: string;
  professorId?: string;
}

export function ChamadaPINProfessor({
  turma,
  turmaDisciplinaId,
  disciplinaNome,
}: Props) {
  const { pin, expiraEm, presentesIds } = useChamada();
  const [agora, setAgora] = useState(() => Date.now());
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const restante = expiraEm
    ? Math.max(0, Math.ceil((expiraEm - agora) / 1000))
    : 0;
  const ativa = restante > 0;

  useEffect(() => {
    if (!expiraEm) return;
    const t = setInterval(() => {
      const now = Date.now();
      setAgora(now);
      if (now >= expiraEm) clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [expiraEm]);

  // Busca no banco quem já confirmou
  useEffect(() => {
    if (!ativa) return;
    chamadaStore.atualizarPresentes();
    const t = setInterval(() => chamadaStore.atualizarPresentes(), 3000);
    return () => clearInterval(t);
  }, [ativa]);

  const total = turma.alunosIds.length;
  const presentes = presentesIds.filter((id) =>
    turma.alunosIds.includes(id),
  ).length;
  const mm = String(Math.floor(restante / 60)).padStart(2, "0");
  const ss = String(restante % 60).padStart(2, "0");

  const iniciar = async () => {
    setErro(null);
    setCarregando(true);
    try {
      await chamadaStore.iniciar(DURACAO_MS, {
        disciplinaId: turmaDisciplinaId,
        disciplinaNome,
      });
      setAgora(Date.now());
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setCarregando(false);
    }
  };

  const encerrar = async () => {
    setErro(null);
    try {
      await chamadaStore.encerrar();
      await chamadaStore.atualizarPresentes();
    } catch (e) {
      setErro((e as Error).message);
    }
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
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
          onClick={iniciar}
          disabled={carregando}
        >
          {carregando ? "Abrindo..." : "Iniciar chamada por PIN"}
        </button>
        {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}
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
      {erro && <p className="mt-3 text-sm text-red-600">{erro}</p>}
    </div>
  );
}
