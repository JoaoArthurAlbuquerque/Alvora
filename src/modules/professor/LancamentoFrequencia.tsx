import React, { useState, useEffect, useMemo } from "react";
import { Radio, KeyRound, Save, Users, X, Zap } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { Modal } from "../../core/ui/Modal";
import { sessaoFrequenciaAtiva } from "../../mocks/data";
import { useAlunosTurma } from "../../services/alunosTurma";
import { chamadaStore, useChamada } from "../../services/chamadaStore";
import {
  diarioStore,
  useRegistros,
  contaComoPresenca,
} from "../../services/diarioStore";
import {
  TURMA_ID,
  DISCIPLINA_ID,
  TURMA_DISCIPLINA_ID,
  ehUuid,
  turmaConsulta,
} from "../../services/frequenciaTurma";
import { useRegras } from "../../services/regrasService";
import type { StatusPresenca } from "../../types";
import { cn } from "../../core/lib/utils";
import { PROXIMO, VISUAL, formatarTempo, hoje, iniciais } from "./constantes";

interface Props {
  /** turma_disciplinas.id (UUID). Se não vier, usa VITE_TURMA_DISCIPLINA_ID. */
  turmaDisciplinaId?: string;
  disciplinaNome?: string;
}

export const LancamentoFrequencia: React.FC<Props> = ({
  turmaDisciplinaId = TURMA_DISCIPLINA_ID,
  disciplinaNome = sessaoFrequenciaAtiva.disciplinaNome,
}) => {
  const { validadePinMinutos, digitosPin } = useRegras();
  // Calculado aqui dentro para acompanhar as mudanças que o gestor fizer
  const duracaoMs = validadePinMinutos * 60 * 1000;

  const { chamadaId, pin, expiraEm, presentesIds } = useChamada();
  const registros = useRegistros();
  const turma = useAlunosTurma(turmaConsulta());
  const [ajustesManuais, setAjustesManuais] = useState<
    Record<string, StatusPresenca>
  >({});
  const [isModalPinOpen, setIsModalPinOpen] = useState(false);
  const [agora, setAgora] = useState(() => Date.now());
  const [toast, setToast] = useState<string | null>(null);
  const [abrindo, setAbrindo] = useState(false);

  const tempoRestante = expiraEm
    ? Math.max(0, Math.ceil((expiraEm - agora) / 1000))
    : 0;
  const chamadaAtiva = tempoRestante > 0;
  const jaSalvoHoje = diarioStore.jaSalvo(TURMA_ID, DISCIPLINA_ID);

  const salvosHoje = useMemo(() => {
    const d = hoje();
    const mapa: Record<string, StatusPresenca> = {};
    registros.forEach((r) => {
      if (
        r.turmaId === TURMA_ID &&
        r.disciplinaId === DISCIPLINA_ID &&
        r.data === d
      )
        mapa[r.alunoId] = r.status;
    });
    return mapa;
  }, [registros]);

  const alunos = turma.map((a) => {
    const viaPin = presentesIds.includes(a.id);
    const salvo = salvosHoje[a.id];
    const mock: StatusPresenca = a.presente ? "PRESENTE_MANUAL" : "FALTA";
    const base: StatusPresenca =
      chamadaAtiva && viaPin
        ? "PRESENTE_PIN"
        : (salvo ?? (viaPin ? "PRESENTE_PIN" : mock));
    const status = ajustesManuais[a.id] ?? base;
    return { ...a, viaPin: status === "PRESENTE_PIN", status };
  });

  const totalPresentes = alunos.filter((a) =>
    contaComoPresenca(a.status),
  ).length;
  const pct = alunos.length ? (totalPresentes / alunos.length) * 100 : 0;

  // Cronômetro
  useEffect(() => {
    if (!expiraEm) return;
    const timer = setInterval(() => {
      const now = Date.now();
      setAgora(now);
      if (now >= expiraEm) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [expiraEm]);

  // Busca no banco quem já confirmou via PIN
  useEffect(() => {
    if (!chamadaAtiva) return;
    chamadaStore.atualizarPresentes();
    const t = setInterval(() => chamadaStore.atualizarPresentes(), 3000);
    return () => clearInterval(t);
  }, [chamadaAtiva]);

  // Toast some sozinho
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleGerarPin = async () => {
    if (!chamadaAtiva) {
      if (!ehUuid(turmaDisciplinaId)) {
        setToast("Configure VITE_TURMA_DISCIPLINA_ID com um UUID válido ⚠️");
        return;
      }
      setAbrindo(true);
      try {
        setAjustesManuais({});
        await chamadaStore.iniciar(duracaoMs, {
          disciplinaId: turmaDisciplinaId,
          disciplinaNome,
        });
        setAgora(Date.now());
      } catch (e) {
        setToast((e as Error).message);
        return;
      } finally {
        setAbrindo(false);
      }
    }
    setIsModalPinOpen(true);
  };

  const handleEncerrar = async () => {
    try {
      await chamadaStore.encerrar();
      await chamadaStore.atualizarPresentes();
    } catch (e) {
      setToast((e as Error).message);
    }
    setAgora(Date.now());
    setIsModalPinOpen(false);
  };

  const alternarStatus = (id: string, atual: StatusPresenca) =>
    setAjustesManuais((prev) => ({ ...prev, [id]: PROXIMO[atual] }));

  const handleSalvarDiario = async () => {
    if (chamadaAtiva) {
      try {
        await chamadaStore.encerrar();
      } catch {
        /* segue salvando localmente */
      }
      setAgora(Date.now());
    }
    const statusPorAluno: Record<string, StatusPresenca> = {};
    alunos.forEach((a) => (statusPorAluno[a.id] = a.status));
    const eraAtualizacao = jaSalvoHoje;
    const total = diarioStore.salvar({
      turmaId: TURMA_ID,
      disciplinaId: DISCIPLINA_ID,
      chamadaId: chamadaId ?? undefined,
      statusPorAluno,
    });
    setAjustesManuais({});
    setToast(
      eraAtualizacao
        ? `Diário atualizado: ${total} alunos 📒`
        : `Diário salvo: ${total} alunos registrados 📒`,
    );
  };

  const r = 34,
    c = 2 * Math.PI * r;
  const digitos = (pin ?? "-".repeat(digitosPin)).split("");
  const urgente = chamadaAtiva && tempoRestante <= 30;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div
        className={cn(
          "relative overflow-hidden p-5 rounded-2xl flex flex-col md:flex-row md:items-center gap-5",
          chamadaAtiva
            ? "bg-brand text-white shadow-glow"
            : "bg-white shadow-flat",
        )}
      >
        <div
          className={cn(
            "absolute -right-10 -top-12 w-40 h-40 rounded-full",
            chamadaAtiva ? "bg-white/10" : "bg-primary/5",
          )}
        />

        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              strokeWidth="7"
              className={chamadaAtiva ? "stroke-white/20" : "stroke-slate-100"}
            />
            <circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c - (pct / 100) * c}
              className={chamadaAtiva ? "stroke-white" : "stroke-primary"}
              style={{
                transition: "stroke-dashoffset .8s cubic-bezier(.22,1,.36,1)",
              }}
            />
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={cn(
                "text-lg font-extrabold tabular leading-none",
                !chamadaAtiva && "text-ink",
              )}
            >
              {totalPresentes}
            </span>
            <span
              className={cn(
                "text-[10px]",
                chamadaAtiva ? "text-white/70" : "text-slate-400",
              )}
            >
              de {alunos.length}
            </span>
          </span>
        </div>

        <div className="relative flex-1 min-w-0">
          {chamadaAtiva ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/70 flex items-center gap-1.5">
              <Radio size={12} className="animate-pulse" /> Chamada ao vivo ·{" "}
              {formatarTempo(tempoRestante)}
            </p>
          ) : (
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              Diário de classe
            </p>
          )}
          <h2
            className={cn(
              "text-lg font-extrabold truncate",
              !chamadaAtiva && "text-ink",
            )}
          >
            {disciplinaNome}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span
              className={cn(
                "text-xs",
                chamadaAtiva ? "text-white/80" : "text-slate-400",
              )}
            >
              Turma A
            </span>
            {jaSalvoHoje && (
              <span
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  chamadaAtiva
                    ? "bg-white/20"
                    : "text-emerald-600 bg-emerald-500/10",
                )}
              >
                ✓ Diário de hoje salvo
              </span>
            )}
          </div>
        </div>

        <div className="relative flex flex-wrap gap-2">
          <Button
            icon={<KeyRound size={16} />}
            onClick={handleGerarPin}
            disabled={abrindo}
            className={cn(
              chamadaAtiva &&
                "bg-white text-primary! hover:bg-white hover:-translate-y-0.5 shadow-lg",
            )}
          >
            {abrindo ? "Abrindo..." : chamadaAtiva ? "Exibir PIN" : "Gerar PIN"}
          </Button>
          <Button
            variant="outline"
            icon={<Save size={16} />}
            onClick={handleSalvarDiario}
            className={cn(
              chamadaAtiva &&
                "border-white/40 text-white! bg-white/10 hover:bg-white/20",
            )}
          >
            {jaSalvoHoje ? "Atualizar diário" : "Salvar diário"}
          </Button>
        </div>
      </div>

      {/* Lista */}
      <Card className="space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <h3 className="text-lg font-extrabold text-ink flex items-center gap-2">
            <Users size={18} className="text-primary" /> Alunos
            {chamadaAtiva && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
                ao vivo
              </span>
            )}
          </h3>
          <span className="text-[11px] text-slate-400">
            Toque no status para alternar P → F → J
          </span>
        </div>

        {alunos.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            Carregando alunos... ⏳
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 stagger">
            {alunos.map((a) => {
              const v = VISUAL[a.status];
              return (
                <div
                  key={a.id}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 transition-colors"
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">
                      {iniciais(a.nome)}
                    </div>
                    {a.viaPin && (
                      <span
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center animate-pop"
                        title="Confirmou via PIN"
                      >
                        <Zap size={11} className="text-primary fill-primary" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink truncate">
                      {a.nome}
                    </p>
                    <p className="text-[11px] text-slate-400 tabular">
                      Mat. {a.matricula}
                      {a.viaPin && (
                        <span className="text-primary font-semibold">
                          {" "}
                          · via PIN
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    key={a.status}
                    onClick={() => alternarStatus(a.id, a.status)}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-bold transition-transform hover:scale-105 active:scale-95 animate-pop",
                      v.cls,
                    )}
                  >
                    <span>{v.icone}</span> {v.label}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 pl-4 pr-2 h-12 rounded-full bg-ink text-white text-sm font-bold shadow-2xl animate-pop">
          {toast}
          <button
            onClick={() => setToast(null)}
            aria-label="Fechar"
            className="p-1.5 rounded-full hover:bg-white/10"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Modal PIN */}
      <Modal
        isOpen={isModalPinOpen}
        onClose={() => setIsModalPinOpen(false)}
        title="Chamada ao vivo"
      >
        <div className="text-center py-4 space-y-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">
            Digite no Portal do Aluno
          </p>

          <div className="flex justify-center gap-3">
            {digitos.map((d, i) => (
              <div
                key={`${pin}-${i}`}
                style={{ animationDelay: `${i * 90}ms` }}
                className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-brand text-white shadow-glow flex items-center justify-center text-5xl sm:text-6xl font-black tabular animate-pop"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={cn(
                "p-3 rounded-2xl",
                urgente ? "bg-rose-50 animate-pulse" : "bg-amber-50",
              )}
            >
              <p className="text-[11px] font-medium text-slate-500">
                Expira em
              </p>
              <p
                className={cn(
                  "text-2xl font-black tabular",
                  urgente ? "text-rose-600" : "text-amber-600",
                )}
              >
                {chamadaAtiva ? formatarTempo(tempoRestante) : "Expirado"}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50">
              <p className="text-[11px] font-medium text-slate-500">Via PIN</p>
              <p
                key={presentesIds.length}
                className="text-2xl font-black text-emerald-600 tabular animate-pop"
              >
                {presentesIds.length}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="w-full" onClick={() => setIsModalPinOpen(false)}>
              Voltar para a lista
            </Button>
            {chamadaAtiva && (
              <Button
                className="w-full"
                variant="outline"
                onClick={handleEncerrar}
              >
                Encerrar chamada
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
