import React, { useMemo, useState } from "react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { Button } from "../../core/ui/Button";
import {
  useAlertas,
  alertaStore,
  type MotivoAlerta,
} from "../../services/radarRisco";
import {
  useFrequenciaTurma,
  LIMITE_FALTAS_PCT,
} from "../../services/frequenciaTurma";
import {
  useJustificativas,
  justificativaStore,
  type StatusJustificativa,
} from "../../services/justificativaStore";

type Filtro = "TODOS" | MotivoAlerta;
const GESTOR_ID = "gestor";
const FREQ_MINIMA = 100 - LIMITE_FALTAS_PCT;

const SELO: Record<MotivoAlerta, string> = {
  FALTAS: "text-rose-600 bg-rose-500/10",
  NOTA: "text-amber-600 bg-amber-500/10",
  AMBOS: "text-white bg-rose-600",
};

const SELO_JUST: Record<
  Exclude<StatusJustificativa, "pendente">,
  { variant: "success" | "danger"; label: string }
> = {
  aprovada: { variant: "success", label: "✓ Aprovada" },
  recusada: { variant: "danger", label: "✕ Recusada" },
};

const fmt = (ms: number) =>
  new Date(ms).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

const fmtData = (iso: string) =>
  new Date(iso + "T12:00").toLocaleDateString("pt-BR");

const pad = (n: number) => n.toString().padStart(2, "0");

export const PortalGestor: React.FC = () => {
  const alertas = useAlertas();
  const justificativas = useJustificativas();
  const { alunos, mediaFrequencia } = useFrequenciaTurma();
  const [filtro, setFiltro] = useState<Filtro>("TODOS");
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState<string | null>(null);

  const porId = useMemo(() => new Map(alunos.map((a) => [a.id, a])), [alunos]);

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return alertas
      .filter((a) => filtro === "TODOS" || a.motivo === filtro)
      .map((al) => ({ al, aluno: porId.get(al.alunoId) }))
      .filter(({ al, aluno }) =>
        (aluno?.nome ?? al.alunoId).toLowerCase().includes(termo),
      )
      .sort(
        (x, y) =>
          (x.aluno?.percentualFrequencia ?? 100) -
          (y.aluno?.percentualFrequencia ?? 100),
      );
  }, [alertas, filtro, busca, porId]);

  const pendentesJust = useMemo(
    () =>
      justificativas
        .filter((j) => j.status === "pendente")
        .sort((a, b) => a.criadaEm - b.criadaEm),
    [justificativas],
  );

  const decididasJust = useMemo(
    () =>
      justificativas
        .filter((j) => j.status !== "pendente")
        .sort((a, b) => (b.decididaEm ?? 0) - (a.decididaEm ?? 0))
        .slice(0, 5),
    [justificativas],
  );

  const pendentes = alertas.filter((a) => !a.notificado.aluno).length;
  const dentroMeta = mediaFrequencia >= FREQ_MINIMA;

  const intervir = (id: string) => {
    const nota = window.prompt(
      "Descreva a intervenção (ex.: ligação para o responsável):",
    );
    if (nota?.trim())
      alertaStore.registrar(id, `intervenção: ${nota.trim()}`, GESTOR_ID);
  };

  const decidir = (id: string, status: "aprovada" | "recusada") => {
    if (status === "aprovada") {
      justificativaStore.decidir(id, status, GESTOR_ID);
      return;
    }
    const parecer = window.prompt("Motivo da recusa (o aluno verá):")?.trim();
    if (parecer) justificativaStore.decidir(id, status, GESTOR_ID, parecer);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Painel de Gestão & Indicadores
        </h1>
        <p className="text-xs text-slate-500">
          Acompanhamento analítico de assiduidade e risco pedagógico.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <p className="text-xs font-bold text-primary uppercase">
            Alunos Monitorados
          </p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {alunos.length}
          </p>
        </Card>

        <Card>
          <p className="text-xs font-bold text-primary uppercase">
            Frequência Média
          </p>
          <p
            className={`text-3xl font-extrabold mt-2 ${dentroMeta ? "text-emerald-600" : "text-rose-600"}`}
          >
            {mediaFrequencia}%
          </p>
          <Badge variant={dentroMeta ? "success" : "danger"} className="mt-3">
            Meta: {FREQ_MINIMA}%
          </Badge>
        </Card>

        <Card>
          <p className="text-xs font-bold text-primary uppercase">
            Alertas Ativos
          </p>
          <p
            className={`text-3xl font-extrabold mt-2 ${alertas.length ? "text-rose-600" : "text-emerald-600"}`}
          >
            {pad(alertas.length)}
          </p>
          <Badge variant="warning" className="mt-3">
            Faltas &gt; {LIMITE_FALTAS_PCT}% ou nota baixa
          </Badge>
        </Card>

        <Card>
          <p className="text-xs font-bold text-primary uppercase">
            Sem Notificação
          </p>
          <p
            className={`text-3xl font-extrabold mt-2 ${pendentes ? "text-amber-600" : "text-emerald-600"}`}
          >
            {pad(pendentes)}
          </p>
          <Badge variant={pendentes ? "warning" : "success"} className="mt-3">
            {pendentes ? "Aguardando ação" : "Tudo tratado ✓"}
          </Badge>
        </Card>

        <Card>
          <p className="text-xs font-bold text-primary uppercase">
            Justificativas
          </p>
          <p
            className={`text-3xl font-extrabold mt-2 ${pendentesJust.length ? "text-amber-600" : "text-emerald-600"}`}
          >
            {pad(pendentesJust.length)}
          </p>
          <Badge
            variant={pendentesJust.length ? "warning" : "success"}
            className="mt-3"
          >
            {pendentesJust.length ? "Em análise" : "Caixa zerada ☕"}
          </Badge>
        </Card>
      </div>

      {/* Radar */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-primary/10">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Radar de Risco Pedagógico
            </h3>
            <p className="text-xs text-slate-500">
              Alertas gerados automaticamente a partir do diário e das notas.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            Exportar Relatório em PDF
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          {(["TODOS", "FALTAS", "NOTA", "AMBOS"] as Filtro[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                filtro === f
                  ? "bg-primary text-white"
                  : "bg-white text-slate-600 border border-primary/10 hover:bg-primary/10"
              }`}
            >
              {f === "TODOS" ? "Todos" : f}
              <span className="ml-1 opacity-70">
                (
                {f === "TODOS"
                  ? alertas.length
                  : alertas.filter((a) => a.motivo === f).length}
                )
              </span>
            </button>
          ))}
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar aluno..."
            className="ml-auto px-3 py-1.5 rounded-xl border border-primary/20 text-xs bg-primary-soft"
          />
        </div>

        {lista.length === 0 && (
          <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl text-center">
            🎉 Nenhum alerta por aqui. Instituição no azul!
          </p>
        )}

        <div className="divide-y divide-primary/10">
          {lista.map(({ al, aluno }) => (
            <div key={al.id} className="py-3.5 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">
                      {aluno?.nome ?? al.alunoId}
                    </p>
                    {aluno && (
                      <span className="text-xs text-slate-400">
                        • {aluno.matricula}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${SELO[al.motivo]}`}
                    >
                      {al.motivo}
                    </span>
                    {al.notificado.aluno && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg text-emerald-600 bg-emerald-500/10">
                        ✓ notificado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Turma {al.turmaId} • aberto em {fmt(al.criadoEm)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {aluno && (
                    <div className="text-right">
                      <p
                        className={`text-xs font-bold ${aluno.emRisco ? "text-rose-600" : "text-slate-700"}`}
                      >
                        {aluno.percentualFrequencia}% de frequência
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {aluno.faltas} faltas / {aluno.totalAulas} aulas
                      </p>
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={al.notificado.aluno}
                    onClick={() => alertaStore.notificar(al.id, GESTOR_ID)}
                  >
                    {al.notificado.aluno ? "Notificado" : "Notificar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => intervir(al.id)}
                  >
                    Intervir
                  </Button>
                  <button
                    onClick={() => setAberto(aberto === al.id ? null : al.id)}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    {aberto === al.id ? "Ocultar" : "Histórico"} (
                    {al.historico.length})
                  </button>
                </div>
              </div>

              {aberto === al.id && (
                <ul className="ml-2 pl-3 border-l-2 border-primary/20 space-y-1">
                  {[...al.historico].reverse().map((h, i) => (
                    <li key={i} className="text-[11px] text-slate-600">
                      <b className="text-slate-800">{fmt(h.em)}</b> — {h.acao}{" "}
                      <span className="text-slate-400">({h.porId})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Justificativas de Falta */}
      <Card className="space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-primary/10">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Justificativas de Falta
            </h3>
            <p className="text-xs text-slate-500">
              Aprovadas abonam a falta no extrato do aluno automaticamente.
            </p>
          </div>
          <Badge variant={pendentesJust.length ? "warning" : "success"}>
            {pad(pendentesJust.length)} pendente(s)
          </Badge>
        </div>

        {pendentesJust.length === 0 ? (
          <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl text-center">
            Caixa zerada! Hora do cafezinho ☕
          </p>
        ) : (
          <div className="divide-y divide-primary/10">
            {pendentesJust.map((j) => (
              <div
                key={j.id}
                className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {j.alunoNome}
                  </p>
                  <p className="text-xs text-slate-500">
                    {j.disciplinaNome} • falta em {fmtData(j.dataFalta)} •
                    enviada {fmt(j.criadaEm)}
                  </p>
                  <p className="text-xs text-slate-700 mt-1">“{j.motivo}”</p>
                  {j.anexoNome && (
                    <p className="text-[11px] text-primary">📎 {j.anexoNome}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" onClick={() => decidir(j.id, "aprovada")}>
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => decidir(j.id, "recusada")}
                  >
                    Recusar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {decididasJust.length > 0 && (
          <div className="pt-3 border-t border-primary/10 space-y-2">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase">
              Decididas recentemente
            </h4>
            {decididasJust.map((j) => {
              const selo = SELO_JUST[j.status as "aprovada" | "recusada"];
              return (
                <div
                  key={j.id}
                  className="flex justify-between items-center gap-2 text-xs"
                >
                  <span className="text-slate-700">
                    <b>{j.alunoNome}</b> • {j.disciplinaNome} •{" "}
                    {fmtData(j.dataFalta)}
                    {j.parecer && (
                      <span className="text-slate-400"> — {j.parecer}</span>
                    )}
                  </span>
                  <Badge variant={selo.variant}>{selo.label}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
