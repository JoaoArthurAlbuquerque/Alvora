import type { LucideIcon } from "lucide-react";
import {
  House,
  BookOpen,
  CalendarCheck,
  GraduationCap,
  FileText,
  CalendarDays,
  UserRound,
  Users,
  BellRing,
  ChartColumn,
  Settings,
  Radio,
  ScrollText,
} from "lucide-react";
import type { PapelUsuario } from "../types";

export interface ItemNav {
  label: string;
  path: string;
  icone: LucideIcon;
}

export const navPorPapel: Record<PapelUsuario, ItemNav[]> = {
  aluno: [
    { label: "Início", path: "/aluno", icone: House },
    {
      label: "Minhas Disciplinas",
      path: "/aluno/disciplinas",
      icone: BookOpen,
    },
    { label: "Frequência", path: "/aluno/frequencia", icone: CalendarCheck },
    { label: "Boletim", path: "/aluno/boletim", icone: GraduationCap },
    { label: "Secretaria", path: "/aluno/secretaria", icone: FileText },
    { label: "Calendário", path: "/aluno/calendario", icone: CalendarDays },
    { label: "Meu Perfil", path: "/aluno/perfil", icone: UserRound },
  ],
  professor: [
    { label: "Início", path: "/professor", icone: House },
    { label: "Minhas Turmas", path: "/professor/turmas", icone: Users },
    {
      label: "Frequência",
      path: "/professor/frequencia",
      icone: CalendarCheck,
    },
    { label: "Notas", path: "/professor/notas", icone: GraduationCap },
    { label: "Alertas de Faltas", path: "/professor/alertas", icone: BellRing },
    { label: "Calendário", path: "/professor/calendario", icone: CalendarDays },
    { label: "Meu Perfil", path: "/professor/perfil", icone: UserRound },
  ],
  gestor: [
    { label: "Indicadores", path: "/gestor", icone: ChartColumn },
    { label: "Alunos & Turmas", path: "/gestor/turmas", icone: Users },
    { label: "Professores", path: "/gestor/professores", icone: GraduationCap },
    { label: "Regras", path: "/gestor/regras", icone: Settings },
    { label: "Calendário", path: "/gestor/calendario", icone: CalendarDays },
    { label: "Auditoria", path: "/gestor/auditoria", icone: ScrollText },
    { label: "Meu Perfil", path: "/gestor/perfil", icone: UserRound },
  ],
};

/** Ações rápidas extras por perfil (além de IA, Dúvidas e Calendário) */
export const acoesExtras: Record<PapelUsuario, ItemNav[]> = {
  aluno: [],
  professor: [
    { label: "Chamada ao Vivo", path: "/professor/frequencia", icone: Radio },
    { label: "Alertas de Faltas", path: "/professor/alertas", icone: BellRing },
  ],
  gestor: [
    { label: "Indicadores", path: "/gestor", icone: ChartColumn },
    {
      label: "Alunos em Risco",
      path: "/gestor/turmas?status=risco",
      icone: BellRing,
    },
  ],
};

export const rotuloPapel: Record<PapelUsuario, string> = {
  aluno: "Aluno",
  professor: "Professor",
  gestor: "Gestor",
};
