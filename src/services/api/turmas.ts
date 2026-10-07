import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/core/auth/useAuthStore";
import { ok } from "./realtime";

export interface Sala {
  id: string;
  turmaId: string;
  turmaNome: string;
  disciplinaId: string;
  disciplinaNome: string;
  cargaHoraria: number | null;
  professorId: string | null;
}

export interface AlunoTurma {
  id: string;
  nome: string;
  matricula: string;
}

/** Formato cru devolvido pelo Supabase no join de salas */
interface SalaRow {
  id: string;
  turma_id: string;
  professor_id: string | null;
  turmas: { nome: string } | null;
  disciplinas: { id: string; nome: string; carga_horaria: number | null } | null;
}

/** Formato cru devolvido pelo Supabase no join de matrículas */
interface MatriculaRow {
  profiles: {
    id: string;
    nome: string | null;
    sobrenome: string | null;
    matricula: string | null;
  };
}

/** Salas que o usuário pode ver (o RLS já filtra por papel) */
export function useMinhasSalas() {
  const u = useAuthStore((s) => s.usuario);
  return useQuery({
    queryKey: ["salas", u?.id],
    enabled: !!u,
    queryFn: async (): Promise<Sala[]> => {
      let q = supabase
        .from("turma_disciplinas")
        .select(
          "id, turma_id, professor_id, turmas(nome), disciplinas(id, nome, carga_horaria)",
        );
      if (u?.papel === "professor") q = q.eq("professor_id", u.id);

      const rows = ok(await q) as unknown as SalaRow[];
      return rows.map((r) => ({
        id: r.id,
        turmaId: r.turma_id,
        turmaNome: r.turmas?.nome ?? "",
        disciplinaId: r.disciplinas?.id ?? "",
        disciplinaNome: r.disciplinas?.nome ?? "",
        cargaHoraria: r.disciplinas?.carga_horaria ?? null,
        professorId: r.professor_id,
      }));
    },
  });
}

/** Substitui useAlunosTurma/listarAlunosTurma do mocks/data.ts */
export function useAlunosTurma(turmaId?: string) {
  return useQuery({
    queryKey: ["alunos", turmaId],
    enabled: !!turmaId,
    queryFn: async (): Promise<AlunoTurma[]> => {
      const rows = ok(
        await supabase
          .from("matriculas")
          .select("profiles!inner(id, nome, sobrenome, matricula)")
          .eq("turma_id", turmaId as string)
          .eq("status", "ativa"),
      ) as unknown as MatriculaRow[];

      return rows
        .map(({ profiles: p }) => ({
          id: p.id,
          nome: [p.nome, p.sobrenome].filter(Boolean).join(" "),
          matricula: p.matricula ?? "",
        }))
        .sort((a, b) => a.nome.localeCompare(b.nome));
    },
  });
}