import React, { useState, useEffect, useMemo } from "react";
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
import {
  useRegistros,
  aplicarRegistros,
  situacaoFrequencia,
  FREQ_MINIMA,
  type SituacaoFrequencia,
} from "../../services/diarioStore";
import {
  useAlertas,
  alertaStore,
  NOTA_MINIMA,
  type MotivoAlerta,
} from "../../services/radarRisco";
import { DISCIPLINA_ID } from "../../services/frequenciaTurma";
import {
  justificativaStore,
  useJustificativas,
  aplicarAbonos,
  type StatusJustificativa,
} from "../../services/justificativaStore";

type VarianteBadge = "success" | "warning" | "primary" | "info";

const MENSAGENS_ERRO: Record<
  Exclude<ResultadoConfirmacao, "ok" | "duplicado">,
  string
> = {
  invalido: "Código PIN incorreto. Confira no data-show e tente novamente.",
  expirado: "Esta chamada já expirou. Peça ao professor um novo PIN.",
};

const BADGE_FREQ: Record<
  SituacaoFrequencia,
  { variant: VarianteBadge; label: string }
> = {
  segura: { variant: "success", label: "Frequência Segura" },
  atencao: { variant: "warning", label: "Atenção ao Risco" },
  reprovado: { variant: "warning", label: "Abaixo do Mínimo" },
};

const BADGE_FREQ_GLOBAL: Record<
  SituacaoFrequencia,
  { variant: VarianteBadge; label: string }
> = {
  segura: { variant: "success", label: "Assiduidade Regular" },
  atencao: { variant: "warning", label: "Assiduidade em Alerta" },
  reprovado: { variant: "warning", label: "Assiduidade Crítica" },
};

const SELO_JUST: Record<
  StatusJustificativa,
  { variant: VarianteBadge; label: string }
> = {
  pendente: { variant: "warning", label: "⏳ Em análise" },
  aprovada: { variant: "success", label: "✓ Abonada" },
  recusada: { variant: "warning", label: "✕ Recusada" },
};

const badgeMedia = (m: number): { variant: VarianteBadge; label: string } =>
  m >= 7
    ? { variant: "success", label: "Aprovado por Média" }
    : m >= 5
      ? { variant: "warning", label: "Rumo à Recuperação" }
      : { variant: "warning", label: "Desempenho em Risco" };

const semestreAtual = () => {
  const d = new Date();
  return `${d.getFullYear()}.${d.getMonth() < 6 ? 1 : 2}`;
};

const formatarData = (iso: string) =>
  new Date(iso + "T12:00").toLocaleDateString("pt-BR");

export const PortalAluno: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabAluno>("dashboard");
  const semestre = semestreAtual();

  // Frequência = registros do diário + abonos aprovados
  const registros = useRegistros();
  const justificativas = useJustificativas();
  const aluno = useMemo(
    () => ({
      ...alunoLogadoMock,
      historicoFrequencia: aplicarAbonos(
        aplicarRegistros(
          alunoLogadoMock.historicoFrequencia,
          registros,
          alunoLogadoMock.id,
        ),
        justificativas,
        alunoLogadoMock.id,
      ),
    }),
    [registros, justificativas],
  );

  // Chamada ao vivo (sincronizada entre abas)
  const chamada = useChamada();
  const { expiraEm } = chamada;
  const nomeDisciplinaChamada =
    chamada.disciplinaNome ?? sessaoFrequenciaAtiva.disciplinaNome;
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

  // Simulador: só disciplinas com AV2 pendente
  const pendentesAv2 = useMemo(
    () => boletimAlunoMock.filter((b) => b.av2 === null),
    [],
  );
  const [notaDesejada, setNotaDesejada] = useState<number>(7.0);
  const [discSimId, setDiscSimId] = useState<string>(
    () => pendentesAv2[0]?.id ?? "",
  );
  const discSim = pendentesAv2.find((b) => b.id === discSimId);
  const notaNecessaria = discSim
    ? Math.max(0, Number((notaDesejada * 2 - Number(discSim.av1)).toFixed(1)))
    : null;

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
    setFeedbackMsg(
      `Presença registrada às ${hora}! Ela entra no seu extrato quando o professor salvar o diário. ✅`,
    );
  };

  const closeCheckinModal = () => {
    setIsCheckinOpen(false);
    setPinInput("");
    setStatusCheckin("idle");
    setFeedbackMsg("");
  };

  // Justificativa de faltas
  const [isJustOpen, setIsJustOpen] = useState(false);
  const [justDisc, setJustDisc] = useState("");
  const [justData, setJustData] = useState("");
  const [justMotivo, setJustMotivo] = useState("");
  const [justAnexo, setJustAnexo] = useState<string | undefined>();
  const [justMsg, setJustMsg] = useState("");
  const hojeISO = new Date().toISOString().slice(0, 10);

  const minhasJust = useMemo(
    () =>
      justificativas
        .filter((j) => j.alunoId === aluno.id)
        .sort((a, b) => b.criadaEm - a.criadaEm),
    [justificativas, aluno.id],
  );

  const abrirJust = (disciplinaId: string) => {
    setJustDisc(disciplinaId);
    setJustData("");
    setJustMotivo("");
    setJustAnexo(undefined);
    setJustMsg("");
    setIsJustOpen(true);
  };

  const enviarJust = (e: React.FormEvent) => {
    e.preventDefault();
    const disc = aluno.historicoFrequencia.find(
      (h) => h.disciplinaId === justDisc,
    );
    if (!disc) return;
    const r = justificativaStore.enviar({
      alunoId: aluno.id,
      alunoNome: aluno.nome,
      disciplinaId: disc.disciplinaId,
      disciplinaNome: disc.disciplinaNome,
      dataFalta: justData,
      motivo: justMotivo.trim(),
      anexoNome: justAnexo,
    });
    if (r === "duplicada") {
      setJustMsg(
        "Já existe uma justificativa para essa data nessa disciplina. 🤔",
      );
      return;
    }
    setIsJustOpen(false);
  };

  // Indicadores derivados
  const historico = aluno.historicoFrequencia;
  const frequenciaGlobalNum = historico.length
    ? historico.reduce((acc, h) => acc + h.percentualFrequencia, 0) /
      historico.length
    : 100;
  const frequenciaGlobal = frequenciaGlobalNum.toFixed(1);
  const badgeFreqGlobal =
    BADGE_FREQ_GLOBAL[situacaoFrequencia(frequenciaGlobalNum)];
  const mediaNum = Number(aluno.mediaGeral);
  const badgeMediaAtual = badgeMedia(mediaNum);
  const emRiscoLista = historico.filter(
    (h) => situacaoFrequencia(h.percentualFrequencia) !== "segura",
  );
  const pontoAtencao = historico.length
    ? historico.reduce((min, h) =>
        h.percentualFrequencia < min.percentualFrequencia ? h : min,
      )
    : null;

  // Alertas enviados pelo gestor para este aluno
  const todosAlertas = useAlertas();
  const meusAlertas = useMemo(
    () =>
      todosAlertas.filter(
        (a) =>
          a.alunoId === aluno.id &&
          a.notificado.aluno &&
          !a.historico.some((h) => h.acao === "aluno ciente"),
      ),
    [todosAlertas, aluno.id],
  );

  const discAlerta = historico.find((h) => h.disciplinaId === DISCIPLINA_ID);
  const limiteFaltas = discAlerta
    ? Math.floor((discAlerta.totalAulas * (100 - FREQ_MINIMA)) / 100)
    : 0;
  const faltasRestantes = discAlerta
    ? Math.max(0, limiteFaltas - discAlerta.faltas)
    : 0;

  const mensagemAlerta = (motivo: MotivoAlerta) => {
    const nome = discAlerta?.disciplinaNome ?? "uma disciplina";
    const faltas = discAlerta
      ? `Você está com ${discAlerta.percentualFrequencia}% de frequência em ${nome}. ${
          faltasRestantes > 0
            ? `Restam só ${faltasRestantes} falta(s) até o limite.`
            : "Você já atingiu o limite de faltas."
        }`
      : `Sua frequência em ${nome} está abaixo do mínimo.`;
    const nota = `Sua média em ${nome} está abaixo de ${NOTA_MINIMA}. Procure o professor para montar um plano de recuperação.`;
    return motivo === "FALTAS"
      ? faltas
      : motivo === "NOTA"
        ? nota
        : `${faltas} ${nota}`;
  };

  return (
    <div className="space-y-6">
      {/* Navegação por Abas Horizontais */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-primary/15">
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
                ? "bg-primary text-white shadow-flat-sm"
                : "bg-white text-slate-600 hover:bg-primary/10 hover:text-primary border border-primary/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* BANNER GLOBAL DE CHAMADA ATIVA */}
      {chamadaAtiva && (
        <div className="bg-gradient-to-r from-primary to-[#3B59FF] text-white p-5 rounded-2xl shadow-flat flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">
                Chamada ao Vivo Aberta
              </span>
            </div>
            <h3 className="text-base font-bold">{nomeDisciplinaChamada}</h3>
            <p className="text-xs text-white/80">
              Digite o PIN exibido em sala para validar sua presença.
            </p>
          </div>
          <Button
            variant="outline"
            className="bg-white text-primary border-none hover:bg-white/95 shrink-0 font-bold"
            onClick={() => setIsCheckinOpen(true)}
          >
            Inserir PIN de Presença
          </Button>
        </div>
      )}

      {/* BANNER DE ALERTA PEDAGÓGICO */}
      {meusAlertas.map((al) => (
        <div
          key={al.id}
          className="p-5 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600">
                Alerta da Coordenação • {al.motivo}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900">
              {mensagemAlerta(al.motivo)}
            </p>
            <p className="text-xs text-slate-500">
              Ainda dá tempo de virar o jogo 💪 A coordenação está com você.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveTab("frequencia")}
            >
              Ver Extrato
            </Button>
            <Button
              size="sm"
              onClick={() =>
                alertaStore.registrar(al.id, "aluno ciente", aluno.id)
              }
            >
              Estou ciente
            </Button>
          </div>
        </div>
      ))}

      {/* ABA 1: DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <Card className="bg-white border-primary/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wide">
                  {aluno.curso}
                </span>
                <h1 className="text-2xl font-bold text-slate-900 mt-1">
                  Bem-vindo, {aluno.nome.split(" ")[0]}!
                </h1>
                <p className="text-slate-500 text-xs mt-1">
                  Matrícula: {aluno.matricula}
                </p>
              </div>
              <Badge variant="primary">Semestre {semestre}</Badge>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <p className="text-xs font-bold text-primary uppercase">
                Média Geral
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                {aluno.mediaGeral}
              </p>
              <Badge variant={badgeMediaAtual.variant} className="mt-3">
                {badgeMediaAtual.label}
              </Badge>
            </Card>

            <Card>
              <p className="text-xs font-bold text-primary uppercase">
                Frequência Global
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                {frequenciaGlobal}%
              </p>
              <Badge variant={badgeFreqGlobal.variant} className="mt-3">
                {badgeFreqGlobal.label}
              </Badge>
            </Card>

            <Card>
              <p className="text-xs font-bold text-primary uppercase">
                Disciplinas em Risco
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                {String(emRiscoLista.length).padStart(2, "0")}
              </p>
              <Badge
                variant={emRiscoLista.length ? "warning" : "success"}
                className="mt-3"
              >
                {emRiscoLista.length
                  ? `Mínimo exigido: ${FREQ_MINIMA}%`
                  : "Tudo sob controle"}
              </Badge>
            </Card>
          </div>

          {pontoAtencao && (
            <Card className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Ponto de Atenção
              </h3>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {pontoAtencao.disciplinaNome}
                  </p>
                  <p className="text-xs text-slate-500">
                    Sua menor frequência: {pontoAtencao.percentualFrequencia}% •{" "}
                    {pontoAtencao.faltas} faltas
                  </p>
                </div>
                <Button size="sm" onClick={() => setActiveTab("frequencia")}>
                  Ver Extrato
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ABA 2: MINHAS DISCIPLINAS */}
      {activeTab === "disciplinas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {historico.map((disc) => {
            const dadas = disc.presencas + disc.faltas;
            const progresso = disc.totalAulas
              ? Math.min(100, (dadas / disc.totalAulas) * 100)
              : 0;
            const badge =
              BADGE_FREQ[situacaoFrequencia(disc.percentualFrequencia)];
            return (
              <Card key={disc.disciplinaId} hoverable className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {disc.disciplinaNome}
                  </h3>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Aulas Concluídas</span>
                    <span className="text-primary">
                      {dadas} / {disc.totalAulas}
                    </span>
                  </div>
                  <div className="w-full bg-primary/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${progresso}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ABA 3: FREQUÊNCIA & PRESENÇA */}
      {activeTab === "frequencia" && (
        <Card className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Extrato Consolidado de Assiduidade
            </h3>
            <p className="text-xs text-slate-500">
              O limite máximo permitido de faltas por disciplina é{" "}
              {100 - FREQ_MINIMA}% (mínimo de {FREQ_MINIMA}% de frequência).
            </p>
          </div>

          <div className="divide-y divide-primary/10">
            {historico.map((item) => {
              const situacao = situacaoFrequencia(item.percentualFrequencia);
              const badge = BADGE_FREQ[situacao];
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
                      {item.faltas > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => abrirJust(item.disciplinaId)}
                        >
                          Justificar falta
                        </Button>
                      )}
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      <span className="text-base font-black text-primary">
                        {item.percentualFrequencia}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-primary/10 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        situacao === "reprovado"
                          ? "bg-rose-500"
                          : situacao === "atencao"
                            ? "bg-amber-500"
                            : "bg-primary"
                      }`}
                      style={{ width: `${item.percentualFrequencia}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {minhasJust.length > 0 && (
            <div className="pt-4 border-t border-primary/10 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase">
                Minhas Justificativas
              </h4>
              {minhasJust.map((j) => (
                <div
                  key={j.id}
                  className="p-3 rounded-xl bg-primary-soft border border-primary/10 flex justify-between items-start gap-2"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {j.disciplinaNome} • {formatarData(j.dataFalta)}
                    </p>
                    <p className="text-[11px] text-slate-500">{j.motivo}</p>
                    {j.anexoNome && (
                      <p className="text-[11px] text-primary">
                        📎 {j.anexoNome}
                      </p>
                    )}
                    {j.parecer && (
                      <p className="text-[11px] text-slate-700 mt-1">
                        💬 {j.parecer}
                      </p>
                    )}
                  </div>
                  <Badge variant={SELO_JUST[j.status].variant}>
                    {SELO_JUST[j.status].label}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ABA 4: BOLETIM */}
      {activeTab === "boletim" && (
        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Quadro Oficial de Notas — {semestre}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-primary/15 text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-2">Disciplina</th>
                    <th className="py-3 px-2">AV1</th>
                    <th className="py-3 px-2">AV2</th>
                    <th className="py-3 px-2">Ativ. Contínuas</th>
                    <th className="py-3 px-2">Média Parcial</th>
                    <th className="py-3 px-2">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10 text-slate-800 font-medium">
                  {boletimAlunoMock.map((b) => (
                    <tr key={b.id}>
                      <td className="py-3 px-2 font-bold">
                        {b.disciplinaNome}
                      </td>
                      <td className="py-3 px-2">{b.av1}</td>
                      <td className="py-3 px-2">{b.av2 ?? "—"}</td>
                      <td className="py-3 px-2">{b.atividadesContinuas}</td>
                      <td className="py-3 px-2 font-bold text-primary">
                        {b.mediaParcial}
                      </td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={
                            b.status === "Aprovado"
                              ? "success"
                              : b.status === "Em Risco"
                                ? "warning"
                                : "primary"
                          }
                        >
                          {b.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Simulador de Nota Necessária */}
          <Card className="space-y-4 bg-gradient-to-r from-primary/5 via-white to-white border-primary/20">
            <h3 className="text-sm font-bold text-slate-900">
              Simulador de Nota para Aprovação (AV2)
            </h3>

            {!discSim ? (
              <p className="text-xs text-slate-500">
                Nenhuma disciplina com AV2 pendente. Mandou bem! 🎉
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-3">
                  <select
                    value={discSimId}
                    onChange={(e) => setDiscSimId(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-primary/20 bg-white"
                  >
                    {pendentesAv2.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.disciplinaNome} (AV1: {b.av1})
                      </option>
                    ))}
                  </select>
                  <label className="block text-xs font-semibold text-slate-600">
                    Média Final Almejada:{" "}
                    <span className="font-bold text-primary">
                      {notaDesejada.toFixed(1)}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="6.0"
                    max="10.0"
                    step="0.5"
                    value={notaDesejada}
                    onChange={(e) =>
                      setNotaDesejada(parseFloat(e.target.value))
                    }
                    className="w-full accent-primary"
                  />
                </div>
                <div className="p-3 bg-white rounded-xl border border-primary/15 text-center">
                  <p className="text-[11px] text-slate-500">
                    Nota mínima necessária na AV2 em {discSim.disciplinaNome}:
                  </p>
                  {notaNecessaria !== null && notaNecessaria > 10 ? (
                    <p className="text-sm font-bold text-rose-600 mt-1">
                      Inalcançável só com a AV2 😅 Tente uma meta menor.
                    </p>
                  ) : (
                    <p className="text-2xl font-black text-primary">
                      {notaNecessaria}
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ABA 5: SECRETARIA & FINANCEIRO */}
      {activeTab === "secretaria" && (
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
                  className="p-3 rounded-xl bg-primary-soft border border-primary/10 flex justify-between items-center"
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
                  className="p-3 rounded-xl bg-primary-soft border border-primary/10 flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {b.referencia}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Vencimento: {b.vencimento} •{" "}
                      {b.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
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
                className="w-full text-center text-3xl font-black tracking-widest py-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-primary-soft"
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

      {/* MODAL DE JUSTIFICATIVA DE FALTA */}
      <Modal
        isOpen={isJustOpen}
        onClose={() => setIsJustOpen(false)}
        title="Justificar Falta"
      >
        <form onSubmit={enviarJust} className="space-y-3">
          <p className="text-xs font-bold text-primary">
            {historico.find((h) => h.disciplinaId === justDisc)?.disciplinaNome}
          </p>
          <label className="block text-xs font-bold text-slate-700">
            Data da falta
            <input
              type="date"
              required
              max={hojeISO}
              value={justData}
              onChange={(e) => setJustData(e.target.value)}
              className="mt-1 w-full text-xs p-2 rounded-xl border border-primary/20 bg-primary-soft"
            />
          </label>
          <label className="block text-xs font-bold text-slate-700">
            Motivo
            <textarea
              required
              minLength={10}
              rows={3}
              value={justMotivo}
              onChange={(e) => setJustMotivo(e.target.value)}
              placeholder="Descreva o motivo (ex.: consulta médica)"
              className="mt-1 w-full text-xs p-2 rounded-xl border border-primary/20 bg-primary-soft font-normal"
            />
          </label>
          <label className="block text-xs font-bold text-slate-700">
            Comprovante (opcional)
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setJustAnexo(e.target.files?.[0]?.name)}
              className="mt-1 w-full text-xs font-normal"
            />
          </label>
          {justMsg && (
            <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded-xl text-center">
              {justMsg}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={!justData || justMotivo.trim().length < 10}
          >
            Enviar Justificativa
          </Button>
        </form>
      </Modal>
    </div>
  );
};
