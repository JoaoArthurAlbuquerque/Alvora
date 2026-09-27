import React, { useState, useEffect } from "react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { Modal } from "../../core/ui/Modal";
import { listaAlunosTurmaMock, sessaoFrequenciaAtiva } from "../../mocks/data";

const DURACAO_MS = 5 * 60 * 1000;

const formatarTempo = (seg: number) => {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export const LancamentoFrequencia: React.FC = () => {
  const [alunos, setAlunos] = useState(listaAlunosTurmaMock);
  const [isModalPinOpen, setIsModalPinOpen] = useState(false);
  const [expiraEm, setExpiraEm] = useState<number | null>(null);
  const [agora, setAgora] = useState(0);

  // Estado derivado: nada de setState para sincronizar
  const tempoRestante = expiraEm
    ? Math.max(0, Math.ceil((expiraEm - agora) / 1000))
    : 0;
  const chamadaAtiva = tempoRestante > 0;

  // Timer: setState só dentro do callback (permitido pela regra)
  useEffect(() => {
    if (!expiraEm) return;
    const timer = setInterval(() => {
      const now = Date.now();
      setAgora(now);
      if (now >= expiraEm) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [expiraEm]);

  const handleGerarPin = () => {
    if (!chamadaAtiva) {
      const now = Date.now();
      setAgora(now);
      setExpiraEm(now + DURACAO_MS);
      const confirmados = sessaoFrequenciaAtiva.alunosPresentesIds;
      setAlunos((prev) =>
        prev.map((a) =>
          confirmados.includes(a.id) ? { ...a, presente: true } : a,
        ),
      );
    }
    setIsModalPinOpen(true);
  };

  const togglePresenca = (id: string) => {
    setAlunos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, presente: !a.presente } : a)),
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
            Desenvolvimento Front-End Especializado • Turma A
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleGerarPin}
            variant={chamadaAtiva ? "secondary" : "primary"}
          >
            {chamadaAtiva ? "Exibir PIN da Chamada" : "Gerar PIN de Chamada"}
          </Button>
          <Button variant="outline">Salvar Diário</Button>
        </div>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#5170FF]/10">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Alunos Confirmados ({alunos.filter((a) => a.presente).length}/
            {alunos.length})
          </h3>
          <span className="text-xs text-slate-400">
            Pressione para alterar P / F manualmente
          </span>
        </div>

        <div className="divide-y divide-[#5170FF]/10">
          {alunos.map((aluno) => (
            <div
              key={aluno.id}
              className="py-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-bold text-slate-800">{aluno.nome}</p>
                <p className="text-[11px] text-slate-400">
                  Matrícula: {aluno.matricula}
                </p>
              </div>

              <button
                onClick={() => togglePresenca(aluno.id)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  aluno.presente
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                }`}
              >
                {aluno.presente ? "✓ Presente" : "✕ Falta"}
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal Projetável para Data-Show */}
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
              {sessaoFrequenciaAtiva.pinCode}
            </span>
          </div>

          <div className="p-3 bg-[#F5F7FF] rounded-2xl max-w-xs mx-auto border border-[#5170FF]/10">
            <p className="text-xs text-slate-500">Expira em</p>
            <p className="text-2xl font-black text-amber-600">
              {chamadaAtiva ? formatarTempo(tempoRestante) : "Expirado"}
            </p>
          </div>

          <Button className="w-full" onClick={() => setIsModalPinOpen(false)}>
            Voltar para a Lista de Presença
          </Button>
        </div>
      </Modal>
    </div>
  );
};
