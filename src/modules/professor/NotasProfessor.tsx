import React from "react";
import { FileSpreadsheet, Send } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";
import { useNotasTurma, atualizarNota } from "../../services/notas";
import { cn } from "../../core/lib/utils";
import { corNota, iniciais } from "./constantes";

export const NotasProfessor: React.FC = () => {
  const notas = useNotasTurma();
  const media = notas.length
    ? notas.reduce((a, n) => a + Number(n.media), 0) / notas.length
    : 0;

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <IconBubble icone={FileSpreadsheet} cor="violet" />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold text-ink">
            Planilha de avaliações · Turma A
          </h3>
          <p className="text-xs text-slate-400">
            Médias calculadas automaticamente ✨
          </p>
        </div>
        <span
          className={cn(
            "px-3 h-9 rounded-full text-xs font-bold flex items-center tabular",
            corNota(media),
          )}
        >
          Média da turma {media.toFixed(1)}
        </span>
        <Button icon={<Send size={15} />}>Publicar boletim</Button>
      </div>

      <div className="space-y-2 stagger">
        <div className="hidden sm:grid grid-cols-[1fr_88px_88px_88px] gap-3 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Aluno</span>
          <span className="text-center">AV1</span>
          <span className="text-center">AV2</span>
          <span className="text-center">Média</span>
        </div>
        {notas.map((n) => (
          <div
            key={n.id}
            className="grid grid-cols-3 sm:grid-cols-[1fr_88px_88px_88px] items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 transition-colors"
          >
            <div className="col-span-3 sm:col-span-1 flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0">
                {iniciais(n.aluno)}
              </div>
              <span className="text-sm font-bold text-ink truncate">
                {n.aluno}
              </span>
            </div>
            {(["av1", "av2"] as const).map((campo) => (
              <input
                key={campo}
                type="number"
                step="0.5"
                min={0}
                max={10}
                value={n[campo]}
                aria-label={`${campo} de ${n.aluno}`}
                onChange={(e) =>
                  atualizarNota(
                    n.id,
                    campo,
                    Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)),
                  )
                }
                className="w-full h-10 rounded-xl border-2 border-transparent bg-white text-center text-sm font-bold text-ink tabular shadow-flat-sm focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition"
              />
            ))}
            <span
              key={n.media}
              className={cn(
                "h-10 rounded-xl flex items-center justify-center text-sm font-black tabular animate-pop",
                corNota(Number(n.media)),
              )}
            >
              {n.media}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
