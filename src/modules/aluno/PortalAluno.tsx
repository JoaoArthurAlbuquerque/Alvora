import React, { useState, useEffect } from "react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { Button } from "../../core/ui/Button";
import { Modal } from "../../core/ui/Modal";
import { TabAluno } from "../../types";
import {
  alunoLogadoMock,
  sessaoFrequenciaAtiva,
  boletimAlunoMock,
  requerimentosMock,
  boletosMock,
} from "../../mocks/data";
import {
  chamadaStore,
  useChamada,
  type ResultadoConfirmacao,
} from "../../services/chamadaStore";

const MENSAGENS_ERRO: Record<
  Exclude<ResultadoConfirmacao, "ok" | "duplicado">,
  string
> = {
  invalido: "Código PIN incorreto. Confira no data-show e tente novamente.",
  expirado: "Esta chamada já expirou. Peça ao professor um novo PIN.",
};

export const PortalAluno: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabAluno>("dashboard");
  const [aluno, setAluno] = useState(alunoLogadoMock);
  const sessaoInfo = sessaoFrequenciaAtiva; // só nome/id da disciplina

  // Chamada ao vivo (sincronizada entre abas)
  const { expiraEm } = useChamada();
  const [agora, setAgora] = useState(() => Date.now());
  const chamadaAtiva = !!expiraEm && expiraEm > agora;

  useEffect(() => {
    if (!expiraEm) return;
    const timer = setInterval(() => {
      const now = Date.now();
      setAgora(now);
      if (now >= expiraEm) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [expiraEm]);

  // Estados do Modal de Check-in por PIN
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [statusCheckin, setStatusCheckin] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Estados de simulação do boletim
  const [notaDesejada, setNotaDesejada] = useState<number>(7.0);

  const handleValidarPin = (e: React.FormEvent) => {
    e.preventDefault();
    const resultado = chamadaStore.confirmar(pinInput, aluno.id);
    setAgora(Date.now());

    if (resultado === "duplicado") {
      setStatusCheckin("success");
      setFeedbackMsg("Sua presença já estava confirmada nesta chamada. 😉");
      return;
    }

    if (resultado !== "ok") {
      setStatusCheckin("error");
      setFeedbackMsg(MENSAGENS_ERRO[resultado]);
      setPinInput("");
      return;
    }

    const hora = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setStatusCheckin("success");
    setFeedbackMsg(`Presença confirmada com sucesso às ${hora}!`);

    setAluno((prev) => ({
      ...prev,
      historicoFrequencia: prev.historicoFrequencia.map((item) =>
        item.disciplinaId === sessaoInfo.disciplinaId
          ? {
              ...item,
              presencas: item.presencas + 1,
              percentualFrequencia: Number(
                (((item.presencas + 1) / item.totalAulas) * 100).toFixed(1),
              ),
            }
          : item,
      ),
    }));
  };

  const closeCheckinModal = () => {
    setIsCheckinOpen(false);
    setPinInput("");
    setStatusCheckin("idle");
    setFeedbackMsg("");
  };

  return (
    <div className="space-y-6">
      {/* Navegação por Abas Horizontais */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#5170FF]/15">
        {[
          { id: "dashboard", label: "Início" },
          { id: "disciplinas", label: "Minhas Disciplinas" },
          { id: "frequencia", label: "Frequência & Presença" },
          { id: "boletim", label: "Boletim Escolar" },
          { id: "secretaria", label: "Secretaria & Financeiro" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabAluno)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-[#5170FF] text-white shadow-flat-sm"
                : "bg-white text-slate-600 hover:bg-[#5170FF]/10 hover:text-[#5170FF] border border-[#5170FF]/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* BANNER GLOBAL DE CHAMADA ATIVA */}
      {chamadaAtiva && (
        <div className="bg-gradient-to-r from-[#5170FF] to-[#3B59FF] text-white p-5 rounded-2xl shadow-flat flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">
                Chamada ao Vivo Aberta
              </span>
            </div>
            <h3 className="text-base font-bold">{sessaoInfo.disciplinaNome}</h3>
            <p className="text-xs text-white/80">
              Digite o PIN exibido em sala para validar sua presença.
            </p>
          </div>
          <Button
            variant="outline"
            className="bg-white text-[#5170FF] border-none hover:bg-white/95 shrink-0 font-bold"
            onClick={() => setIsCheckinOpen(true)}
          >
            Inserir PIN de Presença
          </Button>
        </div>
      )}

      {/* ABA 1: DASHBOARD (INÍCIO) */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <Card className="bg-white border-[#5170FF]/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-[#5170FF] uppercase tracking-wide">
                  {aluno.curso}
                </span>
                <h1 className="text-2xl font-bold text-slate-900 mt-1">
                  Bem-vindo, {aluno.nome.split(" ")[0]}!
                </h1>
                <p className="text-slate-500 text-xs mt-1">
                  Matrícula: {aluno.matricula}
                </p>
              </div>
              <Badge variant="primary">Semestre 2026.2</Badge>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <p className="text-xs font-bold text-[#5170FF] uppercase">
                Média Geral
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                {aluno.mediaGeral}
              </p>
              <Badge variant="success" className="mt-3">
                Aprovado por Média
              </Badge>
            </Card>

            <Card>
              <p className="text-xs font-bold text-[#5170FF] uppercase">
                Frequência Global
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                {(
                  aluno.historicoFrequencia.reduce(
                    (acc, h) => acc + h.percentualFrequencia,
                    0,
                  ) / aluno.historicoFrequencia.length
                ).toFixed(1)}
                %
              </p>
              <Badge variant="primary" className="mt-3">
                Assiduidade Regular
              </Badge>
            </Card>

            <Card>
              <p className="text-xs font-bold text-[#5170FF] uppercase">
                Atividades Pendentes
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">02</p>
              <Badge variant="warning" className="mt-3">
                Próximo Prazo: 3 dias
              </Badge>
            </Card>
          </div>

          <Card className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Próxima Aula Hoje
            </h3>
            <div className="p-4 rounded-xl bg-[#5170FF]/5 border border-[#5170FF]/10 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Desenvolvimento Front-End Especializado
                </p>
                <p className="text-xs text-slate-500">
                  Horário: 19:00 — 21:40 • Sala: Laboratório 04
                </p>
              </div>
              <Button size="sm" onClick={() => setActiveTab("disciplinas")}>
                Acessar Sala Virtual
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ABA 2: MINHAS DISCIPLINAS */}
      {activeTab === "disciplinas" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aluno.historicoFrequencia.map((disc) => (
              <Card key={disc.disciplinaId} hoverable className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {disc.disciplinaNome}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Prof. Marcos Vinícius • Carga: 60h
                    </p>
                  </div>
                  <Badge variant="info">Ativa</Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Aulas Concluídas</span>
                    <span className="text-[#5170FF]">
                      {disc.presencas + disc.faltas} / {disc.totalAulas}
                    </span>
                  </div>
                  <div className="w-full bg-[#5170FF]/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#5170FF] h-full rounded-full"
                      style={{
                        width: `${((disc.presencas + disc.faltas) / disc.totalAulas) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#5170FF]/10 flex justify-between items-center text-xs">
                  <span className="text-slate-500">
                    Material de Apoio: 12 PDFs / Slides
                  </span>
                  <Button size="sm" variant="secondary">
                    Entrar no Fórum
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: FREQUÊNCIA & PRESENÇA */}
      {activeTab === "frequencia" && (
        <div className="space-y-6">
          <Card className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Extrato Consolidado de Assiduidade
              </h3>
              <p className="text-xs text-slate-500">
                O limite máximo permitido de faltas por disciplina é 25% (mínimo
                de 75% de frequência).
              </p>
            </div>

            <div className="divide-y divide-[#5170FF]/10">
              {aluno.historicoFrequencia.map((item) => {
                const emRisco = item.percentualFrequencia < 80;
                return (
                  <div key={item.disciplinaId} className="py-4 space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {item.disciplinaNome}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.presencas} Presenças • {item.faltas} Faltas
                          acumuladas em {item.totalAulas} aulas
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {emRisco ? (
                          <Badge variant="warning">Atenção ao Risco</Badge>
                        ) : (
                          <Badge variant="success">Frequência Segura</Badge>
                        )}
                        <span className="text-base font-black text-[#5170FF]">
                          {item.percentualFrequencia}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-[#5170FF]/10 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${emRisco ? "bg-amber-500" : "bg-[#5170FF]"}`}
                        style={{ width: `${item.percentualFrequencia}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ABA 4: BOLETIM & DESEMPENHO */}
      {activeTab === "boletim" && (
        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Quadro Oficial de Notas — 2026.2
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#5170FF]/15 text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-2">Disciplina</th>
                    <th className="py-3 px-2">AV1</th>
                    <th className="py-3 px-2">AV2</th>
                    <th className="py-3 px-2">Ativ. Contínuas</th>
                    <th className="py-3 px-2">Média Parcial</th>
                    <th className="py-3 px-2">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5170FF]/10 text-slate-800 font-medium">
                  {boletimAlunoMock.map((b) => (
                    <tr key={b.id}>
                      <td className="py-3 px-2 font-bold">
                        {b.disciplinaNome}
                      </td>
                      <td className="py-3 px-2">{b.av1}</td>
                      <td className="py-3 px-2">
                        {b.av2 !== null ? b.av2 : "—"}
                      </td>
                      <td className="py-3 px-2">{b.atividadesContinuas}</td>
                      <td className="py-3 px-2 font-bold text-[#5170FF]">
                        {b.mediaParcial}
                      </td>
                      <td className="py-3 px-2">
                        {b.status === "Aprovado" && (
                          <Badge variant="success">Aprovado</Badge>
                        )}
                        {b.status === "Em Andamento" && (
                          <Badge variant="primary">Em Andamento</Badge>
                        )}
                        {b.status === "Em Risco" && (
                          <Badge variant="warning">Em Risco</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Simulador de Nota Necessária */}
          <Card className="space-y-4 bg-gradient-to-r from-[#5170FF]/5 via-white to-white border-[#5170FF]/20">
            <h3 className="text-sm font-bold text-slate-900">
              Simulador de Nota para Aprovação (AV2)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Média Final Almejada:{" "}
                  <span className="font-bold text-[#5170FF]">
                    {notaDesejada}
                  </span>
                </label>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.5"
                  value={notaDesejada}
                  onChange={(e) => setNotaDesejada(parseFloat(e.target.value))}
                  className="w-full accent-[#5170FF]"
                />
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#5170FF]/15 text-center">
                <p className="text-[11px] text-slate-500">
                  Nota mínima necessária na AV2 em Sistemas Distribuídos:
                </p>
                <p className="text-2xl font-black text-[#5170FF]">
                  {Math.max(0, Number((notaDesejada * 2 - 6.0).toFixed(1)))}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ABA 5: SECRETARIA & FINANCEIRO */}
      {activeTab === "secretaria" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900">
                  Requerimentos & Documentos
                </h3>
                <Button size="sm">Novo Pedido</Button>
              </div>

              <div className="space-y-3">
                {requerimentosMock.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-[#F5F7FF] border border-[#5170FF]/10 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {r.titulo}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Protocolo: {r.protocolo} • {r.dataSolicitacao}
                      </p>
                    </div>
                    <Badge
                      variant={r.status === "Concluído" ? "success" : "warning"}
                    >
                      {r.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Extrato Financeiro
              </h3>

              <div className="space-y-3">
                {boletosMock.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-[#F5F7FF] border border-[#5170FF]/10 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {b.referencia}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Vencimento: {b.vencimento} • R$ {b.valor.toFixed(2)}
                      </p>
                    </div>
                    {b.status === "Pago" ? (
                      <Badge variant="success">Pago</Badge>
                    ) : (
                      <Button size="sm" variant="outline">
                        Baixar PDF
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* MODAL DE CHECK-IN POR PIN */}
      <Modal
        isOpen={isCheckinOpen}
        onClose={closeCheckinModal}
        title="Auto-Check-in de Presença"
      >
        {statusCheckin === "success" ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <p className="text-sm font-bold text-slate-900">{feedbackMsg}</p>
            <Button className="w-full" onClick={closeCheckinModal}>
              Concluir
            </Button>
          </div>
        ) : (
          <form onSubmit={handleValidarPin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Digite o PIN de 4 dígitos (Exibido no Data-Show)
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={pinInput}
                onChange={(e) =>
                  setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="0000"
                className="w-full text-center text-3xl font-black tracking-widest py-3 rounded-xl border border-[#5170FF]/20 focus:outline-none focus:ring-2 focus:ring-[#5170FF]/40 bg-[#F5F7FF]"
                required
              />
            </div>

            {statusCheckin === "error" && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
                {feedbackMsg}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={pinInput.length !== 4}
            >
              Confirmar PIN
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
