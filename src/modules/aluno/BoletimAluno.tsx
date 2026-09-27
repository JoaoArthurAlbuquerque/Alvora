import React, { useState } from "react";
import { Calculator, Target } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { PageHeader } from "../../core/ui/PageHeader";
import { IconBubble } from "../../core/ui/IconBubble";
import { boletimAlunoMock } from "../../mocks/data";
import { cn } from "../../core/lib/utils";
import { SELO_BOLETIM, semestreAtual } from "./constantes";

const pendentes = boletimAlunoMock.filter((b) => b.av2 === null);

const Anel: React.FC<{ valor: number }> = ({ valor }) => {
  const r = 26,
    c = 2 * Math.PI * r;
  const cor = valor >= 7 ? "#5170ff" : valor >= 5 ? "#f59e0b" : "#f43f5e";
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#eef2ff"
          strokeWidth="6"
        />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={cor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (valor / 10) * c}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)",
          }}
          className="animate-[grow-ring_1.2s_cubic-bezier(0.22,1,0.36,1)_both]"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-ink tabular">
        {valor.toFixed(1)}
      </span>
      <style>{`@keyframes grow-ring { from { stroke-dashoffset: ${c}; } }`}</style>
    </div>
  );
};

export const BoletimAluno: React.FC = () => {
  const [meta, setMeta] = useState(7);
  const [discId, setDiscId] = useState(pendentes[0]?.id ?? "");
  const disc = pendentes.find((b) => b.id === discId);
  const necessaria = disc
    ? Math.max(0, Number((meta * 2 - disc.av1).toFixed(1)))
    : null;

  return (
    <div className="space-y-6">
      <PageHeader titulo="Boletim" descricao={`Semestre ${semestreAtual()}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
        {boletimAlunoMock.map((b) => (
          <Card key={b.id} hoverable className="flex items-center gap-5">
            <Anel valor={b.mediaParcial} />
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {b.disciplinaNome}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {b.professorNome}
                  </p>
                </div>
                <Badge variant={SELO_BOLETIM[b.status]}>{b.status}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 tabular">
                {[
                  { l: "AV1", v: b.av1 },
                  { l: "AV2", v: b.av2 },
                  { l: "Ativ.", v: b.atividadesContinuas },
                ].map(({ l, v }) => (
                  <div
                    key={l}
                    className="rounded-lg bg-slate-50 group-hover:bg-primary/5 transition-colors py-1.5 text-center"
                  >
                    <p className="text-[10px] font-medium text-slate-400">
                      {l}
                    </p>
                    <p
                      className={cn(
                        "text-sm font-bold",
                        v == null ? "text-slate-300" : "text-ink",
                      )}
                    >
                      {v?.toFixed(1) ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="space-y-5 animate-fade-up">
        <div className="flex items-center gap-4">
          <IconBubble icone={Calculator} cor="violet" />
          <div>
            <h2 className="text-lg font-extrabold text-ink">
              Quanto preciso tirar na AV2?
            </h2>
            <p className="text-xs text-slate-400">
              Escolha a disciplina e a média que você quer alcançar.
            </p>
          </div>
        </div>

        {!disc ? (
          <p className="text-sm text-slate-500 p-4 rounded-xl bg-emerald-50 text-center">
            Nenhuma AV2 pendente. Mandou bem! 🎉
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {pendentes.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setDiscId(b.id)}
                    className={cn(
                      "px-3.5 h-9 rounded-full text-xs font-semibold transition-all",
                      discId === b.id
                        ? "bg-brand text-white shadow-glow"
                        : "bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary",
                    )}
                  >
                    {b.disciplinaNome} · AV1 {b.av1}
                  </button>
                ))}
              </div>
              <label className="block text-sm font-semibold text-ink">
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Target size={15} className="text-primary" /> Média desejada
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-extrabold tabular">
                    {meta.toFixed(1)}
                  </span>
                </span>
                <input
                  type="range"
                  min="6"
                  max="10"
                  step="0.5"
                  value={meta}
                  onChange={(e) => setMeta(parseFloat(e.target.value))}
                  className="mt-3 w-full accent-primary cursor-pointer"
                />
                <span className="flex justify-between text-[10px] text-slate-400 tabular">
                  <span>6,0</span>
                  <span>10,0</span>
                </span>
              </label>
            </div>

            <div className="relative overflow-hidden p-6 rounded-2xl bg-brand text-white text-center shadow-glow">
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10" />
              <div className="absolute -left-6 -bottom-10 w-24 h-24 rounded-full bg-white/10" />
              <p className="relative text-xs font-semibold text-white/80">
                Nota mínima na AV2
              </p>
              {necessaria !== null && necessaria > 10 ? (
                <p
                  key="x"
                  className="relative text-sm font-bold mt-3 animate-pop"
                >
                  Inalcançável só com a AV2 😅
                  <br />
                  Tente uma meta menor.
                </p>
              ) : (
                <>
                  <p
                    key={`${discId}-${meta}`}
                    className="relative text-5xl font-extrabold mt-2 tabular animate-pop"
                  >
                    {necessaria?.toFixed(1)}
                  </p>
                  <p className="relative text-xs text-white/80 mt-1">
                    {necessaria! <= 5
                      ? "Tranquilo, você consegue! 😎"
                      : necessaria! <= 8
                        ? "Bora estudar que dá! 💪"
                        : "Desafio aceito? 🔥"}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
