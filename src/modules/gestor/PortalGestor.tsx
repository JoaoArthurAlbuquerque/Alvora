// =====================================================================
// src/modules/gestor/PortalGestor.tsx
// =====================================================================
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Activity,
  AlertTriangle,
  BellOff,
  FileClock,
  School,
  ChevronRight,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { PageHeader } from "../../core/ui/PageHeader";
import { IconBubble } from "../../core/ui/IconBubble";
import { useAlertas, alertaAtivo } from "../../services/radarRisco";
import { useFrequenciaTurma } from "../../services/frequenciaTurma";
import { useJustificativas } from "../../services/justificativaStore";
// Importar do service garante que as regras salvas já foram carregadas
import { useRegras } from "../../services/regrasService";
import { useTurmasGestao } from "../../services/api/gestao";
import { pad } from "./constantes";
import { RadarGestor } from "./RadarGestor";

export const PortalGestor: React.FC = () => {
  const {
    frequenciaMinima: FREQ_MINIMA,
    mediaMinima: MEDIA_MINIMA,
    limiteAlertaFaltas: limiteFaltas,
  } = useRegras();
  const todos = useAlertas();
  const alertas = useMemo(() => todos.filter(alertaAtivo), [todos]);
  const justificativas = useJustificativas();
  const { alunos, mediaFrequencia } = useFrequenciaTurma();
  const { data: turmas = [] } = useTurmasGestao();

  const semNotif = alertas.filter((a) => !a.notificado.aluno).length;
  const justPend = justificativas.filter((j) => j.status === "pendente").length;
  const dentroMeta = mediaFrequencia >= FREQ_MINIMA;
  // Turmas ativas com alguma disciplina ainda sem professor
  const turmasPendentes = turmas.filter(
    (t) => t.ativa && t.semProfessor > 0,
  ).length;

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
      label: "Alertas",
      valor: pad(alertas.length),
      sub: `Faltas > ${limiteFaltas}% ou média < ${MEDIA_MINIMA}`,
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
      to: "/gestor/justificativas",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Painel de Gestão"
        descricao="Assiduidade e risco pedagógico em tempo real"
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 stagger">
        {kpis.map((k) => {
          const card = (
            <Card hoverable className="space-y-3 h-full">
              <IconBubble icone={k.icone} cor={k.cor} tamanho="sm" />
              <div>
                <p className="text-xs font-medium text-slate-400">{k.label}</p>
                <p className="text-2xl font-extrabold text-ink tabular">
                  {k.valor}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{k.sub}</p>
              </div>
            </Card>
          );
          return "to" in k ? (
            <Link
              key={k.label}
              to={k.to}
              className="rounded-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
            >
              {card}
            </Link>
          ) : (
            <div key={k.label}>{card}</div>
          );
        })}
      </div>

      {turmasPendentes > 0 && (
        <Link
          to="/gestor/turmas"
          className="flex items-center gap-3 px-4 h-12 rounded-2xl bg-amber-50 text-amber-800 text-sm font-semibold shadow-flat-sm hover:bg-amber-100 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
        >
          <School size={17} aria-hidden />
          <span className="flex-1">
            {turmasPendentes === 1
              ? "1 turma ativa tem disciplina sem professor"
              : `${turmasPendentes} turmas ativas têm disciplinas sem professor`}
          </span>
          <ChevronRight size={16} aria-hidden />
        </Link>
      )}

      <div className="animate-fade-up">
        <RadarGestor />
      </div>
    </div>
  );
};
