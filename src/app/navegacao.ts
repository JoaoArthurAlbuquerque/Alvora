// =====================================================================
// src/app/navegacao.ts
// =====================================================================
import type { LucideIcon } from "lucide-react";
import {
  House,
  BookOpen,
  CalendarCheck,
  GraduationCap,
  FileText,
  Users,
  UserPlus,
  BellRing,
  ChartColumn,
  Settings,
  Radio,
  ScrollText,
  School,
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
    { label: "Disciplinas", path: "/aluno/disciplinas", icone: BookOpen },
    { label: "Frequência", path: "/aluno/frequencia", icone: CalendarCheck },
    { label: "Boletim", path: "/aluno/boletim", icone: GraduationCap },
    { label: "Secretaria", path: "/aluno/secretaria", icone: FileText },
  ],
  professor: [
    { label: "Início", path: "/professor", icone: House },
    { label: "Minhas Turmas", path: "/professor/turmas", icone: Users },
    { label: "Chamada", path: "/professor/frequencia", icone: Radio },
    { label: "Notas", path: "/professor/notas", icone: GraduationCap },
    { label: "Alertas de Faltas", path: "/professor/alertas", icone: BellRing },
  ],
  gestor: [
    { label: "Indicadores", path: "/gestor", icone: ChartColumn },
    { label: "Turmas", path: "/gestor/turmas", icone: School },
    { label: "Professores", path: "/gestor/professores", icone: GraduationCap },
    { label: "Usuários", path: "/gestor/usuarios", icone: UserPlus },
    { label: "Regras", path: "/gestor/regras", icone: Settings },
    { label: "Auditoria", path: "/gestor/auditoria", icone: ScrollText },
  ],
};

/** Atalhos extras por perfil (além de IA e Calendário) */
export const acoesExtras: Record<PapelUsuario, ItemNav[]> = {
  aluno: [],
  professor: [],
  gestor: [
    {
      // O radar de risco fica no painel; a gestão de turmas não filtra por risco
      label: "Alunos em Risco",
      path: "/gestor",
      icone: BellRing,
    },
  ],
};

export const rotuloPapel: Record<PapelUsuario, string> = {
  aluno: "Aluno",
  professor: "Professor",
  gestor: "Gestor",
};