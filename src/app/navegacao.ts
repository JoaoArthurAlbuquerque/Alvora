import type { LucideIcon } from "lucide-react";
import {
  House,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  GraduationCap,
  FileText,
  Users,
  UserPlus,
  UserRound,
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

/** Rotas comuns a todos os perfis que não aparecem no menu */
export const ROTAS_COMUNS: Record<string, { label: string; icone: LucideIcon }> = {
  perfil: { label: "Meu perfil", icone: UserRound },
  calendario: { label: "Calendário", icone: CalendarDays },
};

/** Título do cabeçalho conforme a rota (antes, /aluno/perfil mostrava "Início") */
export function tituloDaRota(pathname: string, nav: ItemNav[]): string {
  const sub = pathname.split("/")[2];
  if (sub && ROTAS_COMUNS[sub]) return ROTAS_COMUNS[sub].label;
  const item = [...nav]
    .sort((a, b) => b.path.length - a.path.length)
    .find((i) => pathname === i.path || pathname.startsWith(`${i.path}/`));
  return item?.label ?? "";
}

/** Páginas que o papel pode buscar (escopo da busca global) */
export function paginasDoPapel(papel: PapelUsuario): ItemNav[] {
  return [
    ...navPorPapel[papel],
    ...Object.entries(ROTAS_COMUNS).map(([k, v]) => ({ ...v, path: `/${papel}/${k}` })),
  ];
}

const norm = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

export function buscarPaginas(termo: string, itens: ItemNav[]): ItemNav[] {
  const t = norm(termo);
  return t ? itens.filter((i) => norm(i.label).includes(t)) : [];
}
