import React, { useState, useEffect } from "react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { Badge } from "../../core/ui/Badge";
import { Modal } from "../../core/ui/Modal";
import { listaAlunosTurmaMock, sessaoFrequenciaAtiva } from "../../mocks/data";

export const LancamentoFrequencia: React.FC = () => {
  const [alunos, setAlunos] = useState(listaAlunosTurmaMock);
  const [isModalPinOpen, setIsModalPinOpen] = useState(false);
  const [chamadaAtiva, setChamadaAtiva] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(300);

  useEffect(() => {
    if (chamadaAtiva) {
      const confirmados = sessaoFrequenciaAtiva.alunosPresentesIds;
      setAlunos((prev) =>
        prev.map((a) =>
          confirmados.includes(a.id) ? { ...a, presente: true } : a,
        ),
      );
    }
  }, [chamadaAtiva]);

  useEffect(() => {
    if (!chamadaAtiva || tempoRestante <= 0) return;
    const timer = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setChamadaAtiva(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [chamadaAtiva, tempoRestante]);

  const handleGerarPin = () => {
    setChamadaAtiva(true);
    setTempoRestante(300);
    setIsModalPinOpen(true);
  };

  const togglePresenca = (id: string) => {
    setAlunos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, presente: !a.presente } : a)),
    );
  };

  const formatarTempo = (seg: number) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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
              {formatarTempo(tempoRestante)}
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
