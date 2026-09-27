import React, { useState, useEffect } from "react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { Modal } from "../../core/ui/Modal";
import { listaAlunosTurmaMock, sessaoFrequenciaAtiva } from "../../mocks/data";
import { chamadaStore, useChamada } from "../../services/chamadaStore";
import { diarioStore, useRegistros } from "../../services/diarioStore";
import type { StatusPresenca } from "../../types";

const DURACAO_MS = 5 * 60 * 1000;
const TURMA_ID = "turma-a";
const DISCIPLINA_ID = sessaoFrequenciaAtiva.disciplinaId;

const formatarTempo = (seg: number) => {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const hoje = () => new Date().toLocaleDateString("sv-SE");

// Ciclo do clique: Presente → Falta → Justificada → Presente
const PROXIMO: Record<StatusPresenca, StatusPresenca> = {
  PRESENTE_PIN: "FALTA",
  PRESENTE_MANUAL: "FALTA",
  FALTA: "FALTA_JUSTIFICADA",
  FALTA_JUSTIFICADA: "PRESENTE_MANUAL",
};

const VISUAL: Record<StatusPresenca, { label: string; cls: string }> = {
  PRESENTE_PIN: {
    label: "✓ Presente",
    cls: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  },
  PRESENTE_MANUAL: {
    label: "✓ Presente",
    cls: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  },
  FALTA: {
    label: "✕ Falta",
    cls: "bg-rose-500/10 text-rose-600 border border-rose-500/20",
  },
  FALTA_JUSTIFICADA: {
    label: "⚑ Justificada",
    cls: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  },
};

const ehPresente = (s: StatusPresenca) =>
  s === "PRESENTE_PIN" || s === "PRESENTE_MANUAL";

export const LancamentoFrequencia: React.FC = () => {
  const { pin, expiraEm, presentesIds } = useChamada();
  const registros = useRegistros();
  const [ajustesManuais, setAjustesManuais] = useState<
    Record<string, StatusPresenca>
  >({});
  const [isModalPinOpen, setIsModalPinOpen] = useState(false);
  const [agora, setAgora] = useState(() => Date.now());
  const [toast, setToast] = useState<string | null>(null);

  const tempoRestante = expiraEm
    ? Math.max(0, Math.ceil((expiraEm - agora) / 1000))
    : 0;
  const chamadaAtiva = tempoRestante > 0;

  // Reativo: reavalia sempre que os registros mudam
  const jaSalvoHoje = registros.some(
    (r) =>
      r.turmaId === TURMA_ID &&
      r.disciplinaId === DISCIPLINA_ID &&
      r.data === hoje(),
  );

  // Derivado: ajuste manual > confirmação via PIN > valor do mock
  const alunos = listaAlunosTurmaMock.map((a) => {
    const viaPin = presentesIds.includes(a.id);
    const base: StatusPresenca = viaPin
      ? "PRESENTE_PIN"
      : a.presente
        ? "PRESENTE_MANUAL"
        : "FALTA";
    return { ...a, viaPin, status: ajustesManuais[a.id] ?? base };
  });

  const totalPresentes = alunos.filter((a) => ehPresente(a.status)).length;

  useEffect(() => {
    if (!expiraEm) return;
    const timer = setInterval(() => {
      const now = Date.now();
      setAgora(now);
      if (now >= expiraEm) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [expiraEm]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleGerarPin = () => {
    if (!chamadaAtiva) {
      setAgora(Date.now());
      setAjustesManuais({});
      chamadaStore.iniciar(DURACAO_MS);
    }
    setIsModalPinOpen(true);
  };

  const handleEncerrar = () => {
    chamadaStore.encerrar();
    setAgora(Date.now());
    setIsModalPinOpen(false);
  };

  const alternarStatus = (id: string, atual: StatusPresenca) => {
    setAjustesManuais((prev) => ({ ...prev, [id]: PROXIMO[atual] }));
  };

  const handleSalvarDiario = () => {
    if (chamadaAtiva) {
      chamadaStore.encerrar(); // fecha o PIN para ninguém entrar depois
      setAgora(Date.now());
    }

    const statusPorAluno: Record<string, StatusPresenca> = {};
    alunos.forEach((a) => {
      statusPorAluno[a.id] = a.status;
    });

    const eraAtualizacao = jaSalvoHoje;
    const total = diarioStore.salvar({
      turmaId: TURMA_ID,
      disciplinaId: DISCIPLINA_ID,
      chamadaId: expiraEm ? `chamada-${expiraEm}` : undefined,
      statusPorAluno,
    });

    setToast(
      eraAtualizacao
        ? `Diário atualizado: ${total} alunos 📒`
        : `Diário salvo: ${total} alunos registrados 📒`,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Diário de Classe & Chamada ao Vivo
          </h2>
          <p className="text-xs text-slate-500">
            {sessaoFrequenciaAtiva.disciplinaNome} • Turma A
          </p>
          {jaSalvoHoje && (
            <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
              ✓ Diário de hoje já salvo
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleGerarPin}
            variant={chamadaAtiva ? "secondary" : "primary"}
          >
            {chamadaAtiva ? "Exibir PIN da Chamada" : "Gerar PIN de Chamada"}
          </Button>
          <Button variant="outline" onClick={handleSalvarDiario}>
            {jaSalvoHoje ? "Atualizar Diário" : "Salvar Diário"}
          </Button>
        </div>
      </div>

      {toast && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 text-center">
          {toast}
        </div>
      )}

      <Card>
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#5170FF]/10">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Alunos Confirmados ({totalPresentes}/{alunos.length})
            {chamadaAtiva && (
              <span className="ml-2 inline-flex items-center gap-1 text-emerald-600 normal-case">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ao vivo
              </span>
            )}
          </h3>
          <span className="text-xs text-slate-400">
            Clique para alternar P / F / Justificada
          </span>
        </div>

        <div className="divide-y divide-[#5170FF]/10">
          {alunos.map((aluno) => (
            <div
              key={aluno.id}
              className="py-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {aluno.nome}
                  {aluno.viaPin && (
                    <span className="ml-2 text-[10px] font-bold text-[#5170FF] bg-[#5170FF]/10 px-2 py-0.5 rounded-lg">
                      via PIN
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-slate-400">
                  Matrícula: {aluno.matricula}
                </p>
              </div>

              <button
                onClick={() => alternarStatus(aluno.id, aluno.status)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${VISUAL[aluno.status].cls}`}
              >
                {VISUAL[aluno.status].label}
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        isOpen={isModalPinOpen}
        onClose={() => setIsModalPinOpen(false)}
        title="Chamada Inteligente ao Vivo"
      >
        <div className="text-center py-6 space-y-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Digite este código no seu Portal do Aluno
          </p>

          <div className="inline-block bg-[#5170FF]/10 border-2 border-[#5170FF] px-10 py-6 rounded-3xl shadow-flat">
            <span className="text-6xl font-black text-[#5170FF] tracking-widest">
              {pin ?? "----"}
            </span>
          </div>

          <div className="p-3 bg-[#F5F7FF] rounded-2xl max-w-xs mx-auto border border-[#5170FF]/10">
            <p className="text-xs text-slate-500">Expira em</p>
            <p className="text-2xl font-black text-amber-600">
              {chamadaAtiva ? formatarTempo(tempoRestante) : "Expirado"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {presentesIds.length} confirmação(ões) via PIN
            </p>
          </div>

          <div className="flex gap-3">
            <Button className="w-full" onClick={() => setIsModalPinOpen(false)}>
              Voltar para a Lista
            </Button>
            {chamadaAtiva && (
              <Button
                className="w-full"
                variant="outline"
                onClick={handleEncerrar}
              >
                Encerrar Chamada
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
