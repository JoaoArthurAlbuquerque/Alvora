// =====================================================================
// src/modules/professor/AlertasProfessor.tsx
// =====================================================================
import React from "react";
import { BellRing, ShieldCheck, TriangleAlert } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { PageHeader } from "../../core/ui/PageHeader";
import { IconBubble } from "../../core/ui/IconBubble";
import { EstadoConsulta } from "../../core/ui/EstadoConsulta";
import { cn } from "../../core/lib/utils";
import { useRegras } from "../../services/regrasService";
import { classificar } from "../../services/radarRisco";
import {
  useFrequenciaSala,
  type ResumoAluno,
} from "../../services/api/professor";
import { iniciais } from "./constantes";
import { SeletorSala } from "./SeletorSala";
import { useSalaSelecionada } from "./useSalaSelecionada";

const LinhaAluno: React.FC<{
  a: ResumoAluno;
  risco: boolean;
  limite: number;
}> = ({ a, risco, limite }) => {
  const resta = Math.floor((a.totalAulas * limite) / 100) - a.faltas;
  const uso = Math.min(100, (a.percentualFaltas / limite) * 100);
  return (
    <li className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
      <div
        className={cn(
          "w-10 h-10 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0",
          risco ? "bg-rose-500" : "bg-amber-500",
        )}
      >
        {iniciais(a.nome)}
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-ink truncate">{a.nome}</p>
          <span
            className={cn(
              "text-sm font-black tabular",
              risco ? "text-rose-600" : "text-amber-600",
            )}
          >
            {a.percentualFaltas}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              risco ? "bg-rose-500" : "bg-amber-500",
            )}
            style={{ width: `${uso}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 tabular">
          {a.faltas} faltas em {a.totalAulas} aulas
          {a.faltasAbonadas > 0 && ` · ${a.faltasAbonadas} abonada(s)`} ·{" "}
          {resta > 0 ? (
            `pode faltar mais ${resta}`
          ) : (
            <b className="text-rose-600">limite estourado</b>
          )}
        </p>
      </div>
    </li>
  );
};

export const AlertasProfessor: React.FC = () => {
  const regras = useRegras();
  const limite = regras.limiteAlertaFaltas;
  const { salas, sala, setId, carregando, erro, recarregar } =
    useSalaSelecionada();
  const { data: freq } = useFrequenciaSala(sala?.id);
  const alunos = freq?.alunos ?? [];

  const emRisco = alunos
    .filter((a) => a.percentualFaltas > limite)
    .sort((x, y) => y.percentualFaltas - x.percentualFaltas);
  const atencao = alunos
    .filter(
      (a) =>
        a.percentualFaltas <= limite &&
        classificar(a.percentualFaltas, null, regras).nivel === "atencao",
    )
    .sort((x, y) => y.percentualFaltas - x.percentualFaltas);

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Alertas de Faltas"
        descricao={`Limite de faltas: ${limite}% das aulas${sala ? ` · ${sala.turmaNome} · ${sala.disciplinaNome}` : ""}`}
        acao={<SeletorSala salas={salas} valor={sala?.id} onChange={setId} />}
      />

      <EstadoConsulta
        carregando={carregando}
        erro={erro}
        vazio={!sala}
        textoVazio="Nenhuma disciplina vinculada a você ainda."
        onTentar={() => recarregar()}
      >
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              l: "Em risco",
              v: emRisco.length,
              i: BellRing,
              c: "rose" as const,
            },
            {
              l: "Atenção",
              v: atencao.length,
              i: TriangleAlert,
              c: "amber" as const,
            },
            {
              l: "Regulares",
              v: alunos.length - emRisco.length - atencao.length,
              i: ShieldCheck,
              c: "emerald" as const,
            },
          ].map((k) => (
            <Card
              key={k.l}
              className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left"
            >
              <IconBubble icone={k.i} cor={k.c} tamanho="sm" />
              <div>
                <p className="text-[11px] text-slate-500">{k.l}</p>
                <p className="text-2xl font-extrabold text-ink tabular">
                  {k.v}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {[
          {
            titulo: "Acima do limite",
            lista: emRisco,
            risco: true,
            badge: "danger" as const,
          },
          {
            titulo: "Perto do limite",
            lista: atencao,
            risco: false,
            badge: "warning" as const,
          },
        ].map((s) => (
          <Card key={s.titulo} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-ink">{s.titulo}</h3>
              <Badge variant={s.badge}>{s.lista.length}</Badge>
            </div>
            {s.lista.length ? (
              <ul className="space-y-2 stagger">
                {s.lista.map((a) => (
                  <LinhaAluno
                    key={a.id}
                    a={a}
                    risco={s.risco}
                    limite={limite}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400 py-4 text-center">
                Ninguém aqui 🎉
              </p>
            )}
          </Card>
        ))}
      </EstadoConsulta>
    </div>
  );
};
