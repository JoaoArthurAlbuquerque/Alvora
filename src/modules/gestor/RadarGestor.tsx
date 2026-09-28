import React, { useMemo, useState } from "react";
import {
  Radar,
  Search,
  Bell,
  BellRing,
  Handshake,
  History,
  FileDown,
  ChevronDown,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";
import {
  useAlertas,
  alertaStore,
  alertaAtivo,
} from "../../services/radarRisco";
import { useFrequenciaTurma } from "../../services/frequenciaTurma";
import { cn } from "../../core/lib/utils";
import {
  FILTROS,
  FREQ_MINIMA,
  GESTOR_ID,
  SELO_MOTIVO,
  fmt,
  iniciais,
  type Filtro,
} from "./constantes";
import { ModalTexto } from "./ModalTexto";

export const RadarGestor: React.FC = () => {
  const todos = useAlertas();
  const alertas = useMemo(() => todos.filter(alertaAtivo), [todos]);
  const { alunos } = useFrequenciaTurma();
  const [filtro, setFiltro] = useState<Filtro>("TODOS");
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState<string | null>(null);
  const [intervindo, setIntervindo] = useState<string | null>(null);

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

  const contar = (f: Filtro) =>
    f === "TODOS"
      ? alertas.length
      : alertas.filter((a) => a.motivo === f).length;

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <IconBubble icone={Radar} cor="violet" />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold text-ink">
            Radar de risco pedagógico
          </h3>
          <p className="text-xs text-slate-400">
            Gerado automaticamente a partir do diário e das notas.
          </p>
        </div>
        <Button
          variant="secondary"
          icon={<FileDown size={15} />}
          onClick={() => window.print()}
        >
          Exportar PDF
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={cn(
              "px-3.5 h-9 rounded-full text-xs font-semibold transition-all",
              filtro === f
                ? "bg-brand text-white shadow-glow"
                : "bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary",
            )}
          >
            {f === "TODOS" ? "Todos" : SELO_MOTIVO[f].label}{" "}
            <span className="opacity-70 tabular">({contar(f)})</span>
          </button>
        ))}
        <div className="relative ml-auto w-full sm:w-56">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar aluno..."
            className="w-full h-9 pl-9 pr-3 rounded-full border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition"
          />
        </div>
      </div>

      {lista.length === 0 && (
        <p className="text-sm font-bold text-emerald-600 bg-emerald-50 p-4 rounded-xl text-center animate-pop">
          🎉 Nenhum alerta por aqui. Instituição no azul!
        </p>
      )}

      <div className="space-y-3 stagger">
        {lista.map(({ al, aluno }) => {
          const selo = SELO_MOTIVO[al.motivo];
          const expandido = aberto === al.id;
          return (
            <div
              key={al.id}
              className={cn(
                "p-4 rounded-2xl bg-slate-50 border-l-4 space-y-3 hover:bg-primary/5 transition-colors",
                selo.borda,
              )}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {iniciais(aluno?.nome ?? al.alunoId)}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-ink">
                        {aluno?.nome ?? al.alunoId}
                      </p>
                      {aluno && (
                        <span className="text-[11px] text-slate-400 tabular">
                          {aluno.matricula}
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          selo.cls,
                        )}
                      >
                        {selo.label}
                      </span>
                      {al.notificado.aluno && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-600 bg-emerald-500/10">
                          ✓ notificado
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Turma {al.turmaId} · aberto em {fmt(al.criadoEm)}
                    </p>
                  </div>
                </div>

                {aluno && (
                  <div className="lg:w-48 space-y-1">
                    <div className="flex justify-between text-[11px] tabular">
                      <span className="text-slate-400">
                        {aluno.faltas}/{aluno.totalAulas} faltas
                      </span>
                      <b className={aluno.emRisco ? "text-rose-600" : "text-ink"}>
                        {aluno.percentualFrequencia}%
                      </b>
                    </div>
                    <div className="relative h-2 rounded-full bg-slate-200/70">
                      <div
                        className={cn(
                          "h-full rounded-full animate-grow",
                          aluno.emRisco
                            ? "bg-linear-to-r from-rose-400 to-rose-500"
                            : "bg-brand",
                        )}
                        style={{ width: `${aluno.percentualFrequencia}%` }}
                      />
                      <div
                        className="absolute -top-0.5 h-3 w-0.5 rounded bg-ink/40"
                        style={{ left: `${FREQ_MINIMA}%` }}
                        title={`Meta ${FREQ_MINIMA}%`}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={al.notificado.aluno}
                    icon={
                      al.notificado.aluno ? (
                        <BellRing size={14} />
                      ) : (
                        <Bell size={14} />
                      )
                    }
                    onClick={() => alertaStore.notificar(al.id, GESTOR_ID)}
                  >
                    {al.notificado.aluno ? "Notificado" : "Notificar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<Handshake size={14} />}
                    onClick={() => setIntervindo(al.id)}
                  >
                    Intervir
                  </Button>
                  <button
                    onClick={() => setAberto(expandido ? null : al.id)}
                    className="flex items-center gap-1 px-2.5 h-8 rounded-full text-[11px] font-bold text-primary hover:bg-primary/10 transition"
                  >
                    <History size={13} /> {al.historico.length}
                    <ChevronDown
                      size={13}
                      className={cn(
                        "transition-transform",
                        expandido && "rotate-180",
                      )}
                    />
                  </button>
                </div>
              </div>

              {expandido && (
                <ol className="relative ml-5 border-l-2 border-primary/15 space-y-3 animate-fade-in">
                  {[...al.historico].reverse().map((h, i) => (
                    <li key={i} className="relative pl-5 text-xs">
                      <span
                        className={cn(
                          "absolute -left-1.75 top-1 w-3 h-3 rounded-full ring-4 ring-slate-50",
                          i === 0 ? "bg-primary" : "bg-slate-300",
                        )}
                      />
                      <p className="font-semibold text-ink">{h.acao}</p>
                      <p className="text-[11px] text-slate-400 tabular">
                        {fmt(h.em)} · {h.porId}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          );
        })}
      </div>

      <ModalTexto
        aberto={!!intervindo}
        titulo="Registrar intervenção"
        rotulo="Descreva a intervenção"
        placeholder="Ex.: ligação para o responsável"
        confirmar="Registrar"
        onFechar={() => setIntervindo(null)}
        onConfirmar={(t) =>
          intervindo &&
          alertaStore.registrar(intervindo, `intervenção: ${t}`, GESTOR_ID)
        }
      />
    </Card>
  );
};
