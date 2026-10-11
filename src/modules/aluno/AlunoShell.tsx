// =====================================================================
// src/modules/aluno/AlunoShell.tsx
// =====================================================================
import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Radio, AlertTriangle, Check, KeyRound } from "lucide-react";
import { Button } from "../../core/ui/Button";
import { Modal } from "../../core/ui/Modal";
import { IconBubble } from "../../core/ui/IconBubble";
import type { ResultadoConfirmacao } from "../../services/chamadaStore";
import { useConfirmarPresenca } from "../../services/alunoApi";
import { useChamadaAtiva } from "../../services/useChamadaAtiva";
import { useRegras } from "../../services/regrasService";
import { classificar, type MotivoAlerta } from "../../services/radarRisco";
import { cn } from "../../core/lib/utils";
import { useAlunoDados } from "./useAlunoDados";

type ResultadoErro = Exclude<ResultadoConfirmacao, "ok" | "duplicado">;

const MENSAGENS_ERRO: Record<ResultadoErro, string> = {
  invalido: "PIN inválido, expirado ou você não é desta turma.",
  expirado: "Essa chamada expirou. Peça um novo PIN ao professor.",
  erro: "Falha de conexão. Tente novamente.",
};

/** Ciência dos alertas fica no navegador até existir tabela no banco */
const chaveCientes = (alunoId: string) => `alvora:cientes:${alunoId}`;
const lerCientes = (alunoId: string): string[] => {
  try {
    return JSON.parse(localStorage.getItem(chaveCientes(alunoId)) ?? "[]");
  } catch {
    return [];
  }
};

interface AlertaAluno {
  id: string;
  disciplinaNome: string;
  motivo: MotivoAlerta;
  percentual: number;
  restantes: number;
  media: number | null;
}

export const AlunoShell: React.FC = () => {
  const navigate = useNavigate();
  const { aluno, historico, boletim } = useAlunoDados();
  const regras = useRegras();
  const {
    frequenciaMinima: FREQ_MINIMA,
    mediaMinima: MEDIA_MINIMA,
    digitosPin,
  } = regras;
  const confirmar = useConfirmarPresenca();

  // ---------- Chamada ao vivo ----------
  const chamada = useChamadaAtiva();
  const expiraEm = chamada?.expiraEm ?? null;
  const [agora, setAgora] = useState(() => Date.now());
  const chamadaAtiva = !!expiraEm && expiraEm > agora;
  const restante = expiraEm
    ? Math.max(0, Math.floor((expiraEm - agora) / 1000))
    : 0;

  useEffect(() => {
    if (!expiraEm) return;
    const tick = () => {
      const now = Date.now();
      setAgora(now);
      if (now >= expiraEm) clearInterval(t);
    };
    const t = setInterval(tick, 1000);
    const primeiro = setTimeout(tick, 0);
    return () => {
      clearInterval(t);
      clearTimeout(primeiro);
    };
  }, [expiraEm]);

  // ---------- PIN ----------
  const [pinAberto, setPinAberto] = useState(false);
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [tentativa, setTentativa] = useState(0);
  const [enviando, setEnviando] = useState(false);

  const validar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    const r: ResultadoConfirmacao = await confirmar(pin);
    setEnviando(false);
    setAgora(Date.now());

    if (r === "duplicado") {
      setStatus("success");
      return setMsg("Sua presença já estava confirmada 😉");
    }
    if (r !== "ok") {
      setStatus("error");
      setMsg(MENSAGENS_ERRO[r]);
      setTentativa((t) => t + 1);
      return setPin("");
    }
    const hora = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setStatus("success");
    setMsg(`Presença registrada às ${hora}.`);
  };

  const fecharPin = () => {
    setPinAberto(false);
    setPin("");
    setStatus("idle");
    setMsg("");
  };

  // ---------- Alertas por disciplina ----------
  const [cientes, setCientes] = useState<string[]>(() => lerCientes(aluno.id));
  const [cientesDe, setCientesDe] = useState(aluno.id);

  // Recarrega a lista no próprio render quando o aluno troca (sem useEffect)
  if (cientesDe !== aluno.id) {
    setCientesDe(aluno.id);
    setCientes(lerCientes(aluno.id));
  }

  const marcarCiente = (id: string) => {
    const novos = [...new Set([...cientes, id])];
    setCientes(novos);
    localStorage.setItem(chaveCientes(aluno.id), JSON.stringify(novos));
  };

  const alertas = useMemo<AlertaAluno[]>(
    () =>
      historico
        .map((h) => {
          const media =
            boletim.find((b) => b.id === h.disciplinaId)?.mediaParcial ?? null;
          const { motivo } = classificar(
            100 - h.percentualFrequencia,
            media,
            regras,
          );
          const limite = Math.floor((h.totalAulas * (100 - FREQ_MINIMA)) / 100);
          return {
            id: h.disciplinaId,
            disciplinaNome: h.disciplinaNome,
            motivo,
            percentual: h.percentualFrequencia,
            restantes: Math.max(0, limite - h.faltas),
            media,
          };
        })
        .filter(
          (a): a is AlertaAluno =>
            !!a.motivo && !cientes.includes(`${a.id}:${a.motivo}`),
        ),
    [historico, boletim, regras, FREQ_MINIMA, cientes],
  );

  const mensagem = (a: AlertaAluno) => {
    const faltas = `${a.percentual}% de frequência em ${a.disciplinaNome}. ${
      a.restantes > 0
        ? `Restam ${a.restantes} falta(s) até o limite.`
        : "Limite de faltas atingido."
    }`;
    const nota = `Média abaixo de ${MEDIA_MINIMA} em ${a.disciplinaNome}.`;
    return a.motivo === "FALTAS"
      ? faltas
      : a.motivo === "NOTA"
        ? nota
        : `${faltas} ${nota}`;
  };

  const urgente = restante <= 30;
  const casas = Array.from({ length: digitosPin }, (_, i) => i);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {chamadaAtiva && (
        <div
          role="status"
          className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-brand text-white shadow-glow animate-fade-up"
        >
          <div className="absolute -right-10 -top-12 w-40 h-40 rounded-full bg-white/10" />
          <div aria-hidden className="relative w-12 h-12 shrink-0">
            <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
            <span className="relative w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Radio size={22} />
            </span>
          </div>
          <div className="relative flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/70">
              Chamada ao vivo
            </p>
            <p className="text-base font-bold truncate">
              {chamada?.disciplinaNome ?? "Aula em andamento"}
            </p>
          </div>
          <div
            aria-label="Tempo restante"
            className={cn(
              "relative px-4 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center font-extrabold text-lg tabular",
              urgente && "animate-pulse bg-rose-500/40",
            )}
          >
            {Math.floor(restante / 60)}:{String(restante % 60).padStart(2, "0")}
          </div>
          <Button
            icon={<KeyRound size={16} />}
            className="relative bg-white text-primary! shadow-lg hover:bg-white hover:-translate-y-0.5"
            onClick={() => setPinAberto(true)}
          >
            Inserir PIN
          </Button>
        </div>
      )}

      {alertas.map((al) => (
        <div
          key={`${al.id}:${al.motivo}`}
          role="status"
          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-white shadow-flat border-l-4 border-rose-400 animate-fade-up"
        >
          <IconBubble icone={AlertTriangle} cor="rose" tamanho="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink">{mensagem(al)}</p>
            <p className="text-xs text-slate-500">
              Ainda dá tempo de virar o jogo 💪 A coordenação está te
              acompanhando.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                navigate(
                  al.motivo === "NOTA" ? "/aluno/boletim" : "/aluno/frequencia",
                )
              }
            >
              Ver detalhes
            </Button>
            <Button
              size="sm"
              onClick={() => marcarCiente(`${al.id}:${al.motivo}`)}
            >
              Estou ciente
            </Button>
          </div>
        </div>
      ))}

      <Outlet />

      <Modal isOpen={pinAberto} onClose={fecharPin} title="Confirmar presença">
        {status === "success" ? (
          <div role="status" className="text-center py-4 space-y-5">
            <div aria-hidden className="relative w-20 h-20 mx-auto">
              <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-emerald-300 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 animate-pop">
                <Check size={36} strokeWidth={3} />
              </div>
            </div>
            <div>
              <p className="text-lg font-extrabold text-ink">
                Presença confirmada! 🎉
              </p>
              <p className="text-sm text-slate-500 mt-1">{msg}</p>
            </div>
            <Button className="w-full" onClick={fecharPin}>
              Concluir
            </Button>
          </div>
        ) : (
          <form onSubmit={validar} className="space-y-5">
            <p className="text-sm text-slate-500 text-center">
              Digite o PIN de {digitosPin} dígitos exibido em sala
            </p>
            <label
              key={tentativa}
              className={cn("relative block", tentativa > 0 && "animate-shake")}
            >
              <input
                autoFocus
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={digitosPin}
                value={pin}
                aria-label={`PIN de ${digitosPin} dígitos`}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, digitosPin))
                }
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div
                aria-hidden
                className="grid gap-2 sm:gap-3"
                style={{
                  gridTemplateColumns: `repeat(${digitosPin}, minmax(0, 1fr))`,
                }}
              >
                {casas.map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-14 sm:h-16 rounded-2xl border-2 flex items-center justify-center text-2xl sm:text-3xl font-extrabold tabular transition-all duration-200",
                      pin[i]
                        ? "border-primary bg-primary/5 text-primary -translate-y-0.5 shadow-flat-sm"
                        : "border-slate-200 text-slate-300",
                      i === pin.length &&
                        "border-primary/50 ring-4 ring-primary/10",
                      status === "error" && !pin && "border-rose-300",
                    )}
                  >
                    {pin[i] ? (
                      <span className="animate-pop">{pin[i]}</span>
                    ) : (
                      "•"
                    )}
                  </div>
                ))}
              </div>
            </label>
            {status === "error" && (
              <p
                role="alert"
                className="text-sm font-medium text-rose-600 bg-rose-50 p-3 rounded-xl text-center animate-fade-in"
              >
                {msg}
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={pin.length !== digitosPin || enviando}
            >
              {enviando ? "Enviando..." : "Confirmar presença"}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
