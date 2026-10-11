// =====================================================================
// src/modules/professor/NotasProfessor.tsx
// =====================================================================
import React, { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { IconBubble } from "../../core/ui/IconBubble";
import { useRegras } from "../../services/regrasService";
import { useAlunosTurma, type Sala } from "../../services/api/turmas";
import {
  AVALIACOES,
  calcularMedia,
  useNotasSala,
  useSalvarNota,
  type Avaliacao,
} from "../../services/api/professor";
import { cn } from "../../core/lib/utils";
import { corNota, iniciais } from "./constantes";
import { ComSala } from "./SeletorSala";

export const NotasProfessor: React.FC<{ sala?: Sala }> = ({ sala }) => (
  <ComSala sala={sala}>{(s) => <NotasSala sala={s} />}</ComSala>
);

const NotasSala: React.FC<{ sala: Sala }> = ({ sala }) => {
  const regras = useRegras();
  const pesos = regras.pesosAvaliacoes as unknown as Record<string, number>;
  const { data: alunos = [], isLoading } = useAlunosTurma(sala.turmaId);
  const { data: notas = {} } = useNotasSala(sala.id);
  const salvar = useSalvarNota(sala.id);
  const [rascunho, setRascunho] = useState<Record<string, string>>({});
  const [erro, setErro] = useState<string | null>(null);

  const chave = (aluno: string, av: Avaliacao) => `${aluno}:${av}`;

  const medias = alunos.map((a) => calcularMedia(notas[a.id], pesos));
  const validas = medias.filter((m): m is number => m !== null);
  const mediaTurma = validas.length
    ? validas.reduce((s, m) => s + m, 0) / validas.length
    : null;

  const confirmar = (alunoId: string, av: Avaliacao) => {
    const k = chave(alunoId, av);
    if (!(k in rascunho)) return;
    const txt = rascunho[k].replace(",", ".").trim();
    const valor = txt === "" ? null : Math.min(10, Math.max(0, Number(txt)));
    setRascunho((p) => {
      const resto = { ...p };
      delete resto[k];
      return resto;
    });
    if (valor !== null && Number.isNaN(valor)) return;
    if (valor === (notas[alunoId]?.[av] ?? null)) return;
    salvar.mutate(
      { alunoId, avaliacao: av, valor },
      { onError: (e) => setErro((e as Error).message) },
    );
  };

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <IconBubble icone={FileSpreadsheet} cor="violet" />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold text-ink">
            Planilha de avaliações · {sala.turmaNome} · {sala.disciplinaNome}
          </h3>
          <p className="text-xs text-slate-400">
            {salvar.isPending
              ? "Salvando…"
              : "Salva ao sair do campo · aluno vê na hora ✨"}
          </p>
        </div>
        {mediaTurma !== null && (
          <span
            className={cn(
              "px-3 h-9 rounded-full text-xs font-bold flex items-center tabular",
              corNota(mediaTurma),
            )}
          >
            Média da turma {mediaTurma.toFixed(1)}
          </span>
        )}
      </div>

      {erro && (
        <p
          className="text-sm text-rose-600 bg-rose-50 p-3 rounded-xl"
          onClick={() => setErro(null)}
        >
          {erro}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-400 text-center py-6">
          Carregando alunos... ⏳
        </p>
      ) : !alunos.length ? (
        <p className="text-sm text-slate-400 text-center py-6">
          Nenhum aluno com matrícula ativa nesta turma.
        </p>
      ) : (
        <div className="space-y-2 stagger">
          <div className="hidden sm:grid grid-cols-[1fr_88px_88px_88px] gap-3 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Aluno</span>
            {AVALIACOES.map((av) => (
              <span key={av} className="text-center">
                {av}
              </span>
            ))}
            <span className="text-center">Média</span>
          </div>
          {alunos.map((a, i) => {
            const media = medias[i];
            return (
              <div
                key={a.id}
                className="grid grid-cols-3 sm:grid-cols-[1fr_88px_88px_88px] items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 transition-colors"
              >
                <div className="col-span-3 sm:col-span-1 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {iniciais(a.nome)}
                  </div>
                  <span className="text-sm font-bold text-ink truncate">
                    {a.nome}
                  </span>
                </div>
                {AVALIACOES.map((av) => {
                  const k = chave(a.id, av);
                  const salvo = notas[a.id]?.[av];
                  return (
                    <input
                      key={av}
                      type="number"
                      inputMode="decimal"
                      step="0.5"
                      min={0}
                      max={10}
                      placeholder="–"
                      value={rascunho[k] ?? salvo ?? ""}
                      aria-label={`${av} de ${a.nome}`}
                      onChange={(e) =>
                        setRascunho((p) => ({ ...p, [k]: e.target.value }))
                      }
                      onBlur={() => confirmar(a.id, av)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.target as HTMLInputElement).blur()
                      }
                      className="w-full h-10 rounded-xl border-2 border-transparent bg-white text-center text-sm font-bold text-ink tabular shadow-flat-sm focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition"
                    />
                  );
                })}
                <span
                  key={media ?? "x"}
                  className={cn(
                    "h-10 rounded-xl flex items-center justify-center text-sm font-black tabular animate-pop",
                    media === null ? "text-slate-400 bg-white" : corNota(media),
                  )}
                >
                  {media ?? "–"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
