import { useEffect, useState } from "react";
import { chamadaStore, useChamada } from "../services/chamadaStore";
import { useRegras } from "../config/regras";

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
  const { pin, expiraEm, presentesIds, disciplinaId } = useChamada();
  const regras = useRegras(); // re-renderiza se o gestor mudar as regras
  const [agora, setAgora] = useState(() => Date.now());
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Só considera a chamada desta disciplina
  const minha = disciplinaId === turmaDisciplinaId;
  const restante =
    minha && expiraEm ? Math.max(0, Math.ceil((expiraEm - agora) / 1000)) : 0;
  const ativa = restante > 0;

  // Cronômetro
  useEffect(() => {
    if (!minha || !expiraEm) return;
    const t = setInterval(() => {
      const now = Date.now();
      setAgora(now);
      if (now >= expiraEm) clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [expiraEm, minha]);

  // Busca no banco quem já confirmou
  useEffect(() => {
    if (!ativa) return;
    chamadaStore.atualizarPresentes();
    const t = setInterval(() => chamadaStore.atualizarPresentes(), 3000);
    return () => clearInterval(t);
  }, [ativa]);

  const total = turma.alunosIds.length;
  const presentes = minha
    ? presentesIds.filter((id) => turma.alunosIds.includes(id)).length
    : 0;
  const mm = String(Math.floor(restante / 60)).padStart(2, "0");
  const ss = String(restante % 60).padStart(2, "0");

  const iniciar = async () => {
    setErro(null);
    setCarregando(true);
    try {
      await chamadaStore.iniciar(regras.validadePinMinutos * 60_000, {
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
        {minha && expiraEm && (
          <p className="mb-3 text-sm text-gray-600">
            Última chamada: {presentes}/{total} presentes
          </p>
        )}
        <button
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
          onClick={iniciar}
          disabled={carregando}
        >
          {carregando
            ? "Abrindo..."
            : minha && expiraEm
              ? "Reabrir chamada por PIN"
              : "Iniciar chamada por PIN"}
        </button>
        <p className="mt-2 text-xs text-gray-400">
          PIN de {regras.digitosPin} dígitos · válido por{" "}
          {regras.validadePinMinutos} min
        </p>
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
