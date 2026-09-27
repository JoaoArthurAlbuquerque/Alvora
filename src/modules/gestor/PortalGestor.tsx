import React, { useState } from "react";
import {
  Users,
  Activity,
  AlertTriangle,
  BellOff,
  FileClock,
  Radar,
  FileCheck2,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { PageHeader } from "../../core/ui/PageHeader";
import { IconBubble } from "../../core/ui/IconBubble";
import { useAlertas } from "../../services/radarRisco";
import { useFrequenciaTurma } from "../../services/frequenciaTurma";
import { useJustificativas } from "../../services/justificativaStore";
import { cn } from "../../core/lib/utils";
import { FREQ_MINIMA, pad } from "./constantes";
import { RadarGestor } from "./RadarGestor";
import { JustificativasGestor } from "./JustificativasGestor";

type Aba = "radar" | "justificativas";

export const PortalGestor: React.FC = () => {
  const alertas = useAlertas();
  const justificativas = useJustificativas();
  const { alunos, mediaFrequencia } = useFrequenciaTurma();
  const [aba, setAba] = useState<Aba>("radar");

  const semNotif = alertas.filter((a) => !a.notificado.aluno).length;
  const justPend = justificativas.filter((j) => j.status === "pendente").length;
  const dentroMeta = mediaFrequencia >= FREQ_MINIMA;

  const kpis = [
    {
      label: "Alunos monitorados",
      valor: alunos.length,
      sub: "Em acompanhamento",
      icone: Users,
      cor: "primary",
    },
    {
      label: "Frequência média",
      valor: `${mediaFrequencia}%`,
      sub: `Meta: ${FREQ_MINIMA}%`,
      icone: Activity,
      cor: dentroMeta ? "emerald" : "rose",
    },
    {
      label: "Alertas ativos",
      valor: pad(alertas.length),
      sub: "Faltas ou nota baixa",
      icone: AlertTriangle,
      cor: alertas.length ? "rose" : "emerald",
    },
    {
      label: "Sem notificação",
      valor: pad(semNotif),
      sub: semNotif ? "Aguardando ação" : "Tudo tratado ✓",
      icone: BellOff,
      cor: semNotif ? "amber" : "emerald",
    },
    {
      label: "Justificativas",
      valor: pad(justPend),
      sub: justPend ? "Em análise" : "Caixa zerada ☕",
      icone: FileClock,
      cor: justPend ? "amber" : "emerald",
    },
  ] as const;

  const abas = [
    {
      id: "radar" as const,
      label: "Radar de risco",
      icone: Radar,
      qtd: alertas.length,
    },
    {
      id: "justificativas" as const,
      label: "Justificativas",
      icone: FileCheck2,
      qtd: justPend,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Painel de Gestão"
        descricao="Assiduidade e risco pedagógico em tempo real 📊"
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 stagger">
        {kpis.map((k) => (
          <Card key={k.label} hoverable className="space-y-3">
            <IconBubble icone={k.icone} cor={k.cor} tamanho="sm" />
            <div>
              <p className="text-xs font-medium text-slate-400">{k.label}</p>
              <p className="text-2xl font-extrabold text-ink tabular">
                {k.valor}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{k.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <nav className="flex gap-1.5 p-1.5 rounded-2xl bg-white shadow-flat overflow-x-auto">
        {abas.map(({ id, label, icone: I, qtd }) => (
          <button
            key={id}
            onClick={() => setAba(id)}
            className={cn(
              "flex items-center gap-2 px-4 h-10 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
              aba === id
                ? "bg-brand text-white shadow-glow"
                : "text-slate-500 hover:bg-primary/5 hover:text-primary",
            )}
          >
            <I size={15} /> {label}
            {qtd > 0 && (
              <span
                className={cn(
                  "min-w-5 h-5 px-1.5 rounded-full text-[10px] flex items-center justify-center tabular",
                  aba === id ? "bg-white/25" : "bg-rose-500 text-white",
                )}
              >
                {qtd}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div key={aba} className="animate-fade-up">
        {aba === "radar" ? <RadarGestor /> : <JustificativasGestor />}
      </div>
    </div>
  );
};
