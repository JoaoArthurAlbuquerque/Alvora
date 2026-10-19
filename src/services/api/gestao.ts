import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { ok, useRealtime } from "./realtime";

/** Cliente sem tipos (mesmo padrão do crud.ts) */
const db = supabase as unknown as SupabaseClient;
const K = ["gestao"] as const;

export type StatusMatricula = "ativa" | "inativa" | "trancada" | "concluida";

export interface TurmaGestao {
  id: string;
  nome: string;
  ano_letivo: number | null;
  ativa: boolean;
  totalAlunos: number;
  totalDisciplinas: number;
  semProfessor: number;
  professores: string[];
}

export interface Pessoa {
  id: string;
  nome: string;
  matricula: string | null;
}

export interface Disciplina {
  id: string;
  nome: string;
  carga_horaria: number | null;
}

export interface SalaGestao {
  id: string;
  disciplina: Disciplina;
  professor: Pessoa | null;
}

export interface MatriculaGestao {
  id: string;
  status: StatusMatricula;
  aluno: Pessoa;
}

type PerfilRow = { id: string; nome: string | null; sobrenome: string | null; matricula?: string | null };

export const nomeCompleto = (p?: PerfilRow | null) =>
  p ? [p.nome, p.sobrenome].filter(Boolean).join(" ") || "Sem nome" : "";

const paraPessoa = (p: PerfilRow): Pessoa => ({
  id: p.id,
  nome: nomeCompleto(p),
  matricula: p.matricula ?? null,
});

/** Erro do Postgres → mensagem que diz o que fazer */
export function erroGestao(e: unknown): string {
  const { code, message = "" } = (e ?? {}) as { code?: string; message?: string };
  if (code === "23505") return "Já existe um registro igual (turma, disciplina ou matrícula).";
  if (code === "23503")
    return "Há frequência, notas ou matrículas ligadas a este item. Desative ou arquive em vez de remover.";
  if (code === "23514") return "Valor fora das regras do banco. Confira o status e os campos e tente de novo.";
  if (code === "42501" || message.includes("row-level security"))
    return "Você não tem permissão para esta ação. Confirme se está logado como gestor.";
  if (code === "P0001") return message; // mensagens dos triggers já vêm em pt-BR
  if (/fetch|network/i.test(message)) return "Sem conexão. Verifique a internet e tente de novo.";
  return message ? `Não foi possível concluir: ${message}` : "Algo deu errado 😕 Tente de novo.";
}

function useInvalidar() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: K });
}

// ---------- Turmas ----------
interface TurmaRow {
  id: string;
  nome: string;
  ano_letivo: number | null;
  ativa: boolean | null;
  matriculas: { status: string }[];
  turma_disciplinas: { professor_id: string | null; profiles: PerfilRow | null }[];
}

export function useTurmasGestao() {
  useRealtime("turmas", [...K, "turmas"]);
  useRealtime("matriculas", [...K, "turmas"]);
  useRealtime("turma_disciplinas", [...K, "turmas"]);
  return useQuery({
    queryKey: [...K, "turmas"],
    queryFn: async (): Promise<TurmaGestao[]> => {
      const rows = ok(
        await db
          .from("turmas")
          .select(
            "id, nome, ano_letivo, ativa, matriculas(status), turma_disciplinas(professor_id, profiles(id, nome, sobrenome))",
          )
          .order("ano_letivo", { ascending: false, nullsFirst: false })
          .order("nome"),
      ) as unknown as TurmaRow[];

      return rows.map((t) => ({
        id: t.id,
        nome: t.nome,
        ano_letivo: t.ano_letivo,
        ativa: t.ativa !== false,
        totalAlunos: t.matriculas.filter((m) => m.status === "ativa").length,
        totalDisciplinas: t.turma_disciplinas.length,
        semProfessor: t.turma_disciplinas.filter((d) => !d.professor_id).length,
        professores: [...new Set(t.turma_disciplinas.map((d) => nomeCompleto(d.profiles)).filter(Boolean))],
      }));
    },
  });
}

export interface TurmaForm {
  id?: string;
  nome: string;
  ano_letivo: number | null;
}

export function validarTurma(f: TurmaForm): string | null {
  const nome = f.nome.trim();
  if (nome.length < 2 || nome.length > 80) return "O nome deve ter de 2 a 80 caracteres.";
  if (f.ano_letivo !== null && (f.ano_letivo < 2000 || f.ano_letivo > 2100)) return "Ano letivo inválido.";
  return null;
}

export function useSalvarTurma() {
  const invalidar = useInvalidar();
  return useMutation({
    mutationFn: async (f: TurmaForm): Promise<string> => {
      const erro = validarTurma(f);
      if (erro) throw new Error(erro);
      const dados = { nome: f.nome.trim(), ano_letivo: f.ano_letivo };
      const r = ok(
        f.id
          ? await db.from("turmas").update(dados).eq("id", f.id).select("id").single()
          : await db.from("turmas").insert(dados).select("id").single(),
      ) as unknown as { id: string };
      return r.id;
    },
    onSuccess: invalidar,
  });
}

export function useArquivarTurma() {
  const invalidar = useInvalidar();
  return useMutation({
    mutationFn: async ({ id, ativa }: { id: string; ativa: boolean }) =>
      ok(await db.from("turmas").update({ ativa }).eq("id", id)),
    onSuccess: invalidar,
  });
}

export function useExcluirTurma() {
  const invalidar = useInvalidar();
  return useMutation({
    mutationFn: async (id: string) => ok(await db.from("turmas").delete().eq("id", id)),
    onSuccess: invalidar,
  });
}

// ---------- Catálogos ----------
export function useDisciplinas() {
  useRealtime("disciplinas", [...K, "disciplinas"]);
  return useQuery({
    queryKey: [...K, "disciplinas"],
    queryFn: async (): Promise<Disciplina[]> =>
      ok(await db.from("disciplinas").select("id, nome, carga_horaria").order("nome")) as unknown as Disciplina[],
  });
}

export function useCriarDisciplina() {
  const invalidar = useInvalidar();
  return useMutation({
    mutationFn: async (d: { nome: string; carga_horaria: number | null }): Promise<string> => {
      const nome = d.nome.trim();
      if (nome.length < 2 || nome.length > 80) throw new Error("Nome da disciplina: de 2 a 80 caracteres.");
      if (d.carga_horaria !== null && (d.carga_horaria < 1 || d.carga_horaria > 2000))
        throw new Error("Carga horária inválida.");
      const r = ok(
        await db.from("disciplinas").insert({ nome, carga_horaria: d.carga_horaria }).select("id").single(),
      ) as unknown as { id: string };
      return r.id;
    },
    onSuccess: invalidar,
  });
}

export function usePessoas(papel: "professor" | "aluno") {
  return useQuery({
    queryKey: [...K, "pessoas", papel],
    queryFn: async (): Promise<Pessoa[]> => {
      const rows = ok(
        await db
          .from("profiles")
          .select(papel === "aluno" ? "id, nome, sobrenome, matricula" : "id, nome, sobrenome")
          .eq("papel", papel)
          .order("nome"),
      ) as unknown as PerfilRow[];
      return rows.map(paraPessoa);
    },
  });
}

// ---------- Detalhe da turma ----------
interface SalaRow {
  id: string;
  disciplinas: Disciplina | null;
  profiles: PerfilRow | null;
}
interface MatRow {
  id: string;
  status: StatusMatricula;
  profiles: PerfilRow;
}

export function useDetalheTurma(turmaId?: string) {
  useRealtime("turma_disciplinas", [...K, "detalhe", turmaId]);
  useRealtime("matriculas", [...K, "detalhe", turmaId]);
  return useQuery({
    queryKey: [...K, "detalhe", turmaId],
    enabled: !!turmaId,
    queryFn: async () => {
      const [s, m] = await Promise.all([
        db
          .from("turma_disciplinas")
          .select("id, disciplinas(id, nome, carga_horaria), profiles(id, nome, sobrenome)")
          .eq("turma_id", turmaId as string),
        db
          .from("matriculas")
          .select("id, status, profiles!inner(id, nome, sobrenome, matricula)")
          .eq("turma_id", turmaId as string),
      ]);
      const salas = (ok(s) as unknown as SalaRow[])
        .map((r): SalaGestao => ({
          id: r.id,
          disciplina: r.disciplinas ?? { id: "", nome: "Disciplina removida", carga_horaria: null },
          professor: r.profiles ? paraPessoa(r.profiles) : null,
        }))
        .sort((a, b) => a.disciplina.nome.localeCompare(b.disciplina.nome));
      const matriculas = (ok(m) as unknown as MatRow[])
        .map((r): MatriculaGestao => ({ id: r.id, status: r.status, aluno: paraPessoa(r.profiles) }))
        .sort((a, b) => a.aluno.nome.localeCompare(b.aluno.nome));
      return { salas, matriculas };
    },
  });
}

export function useVincularDisciplina(turmaId: string) {
  const invalidar = useInvalidar();
  return useMutation({
    mutationFn: async (p: { disciplinaId: string; professorId: string | null }) => {
      if (!p.disciplinaId) throw new Error("Escolha a disciplina.");
      return ok(
        await db.from("turma_disciplinas").insert({
          turma_id: turmaId,
          disciplina_id: p.disciplinaId,
          professor_id: p.professorId,
        }),
      );
    },
    onSuccess: invalidar,
  });
}

export function useTrocarProfessor() {
  const invalidar = useInvalidar();
  return useMutation({
    mutationFn: async (p: { salaId: string; professorId: string | null }) =>
      ok(await db.from("turma_disciplinas").update({ professor_id: p.professorId }).eq("id", p.salaId)),
    onSuccess: invalidar,
  });
}

export function useRemoverDisciplina() {
  const invalidar = useInvalidar();
  return useMutation({
    mutationFn: async (salaId: string) => ok(await db.from("turma_disciplinas").delete().eq("id", salaId)),
    onSuccess: invalidar,
  });
}

export function useMatricular(turmaId: string) {
  const invalidar = useInvalidar();
  return useMutation({
    mutationFn: async (alunoIds: string[]) => {
      if (!alunoIds.length) throw new Error("Selecione ao menos um aluno.");
      ok(
        await db
          .from("matriculas")
          .upsert(
            alunoIds.map((aluno_id) => ({ turma_id: turmaId, aluno_id, status: "ativa" })),
            { onConflict: "turma_id,aluno_id" },
          ),
      );
      return alunoIds.length;
    },
    onSuccess: invalidar,
  });
}

/** "Remover" matrícula = desativar (mantém o histórico de frequência e notas) */
export function useStatusMatricula() {
  const invalidar = useInvalidar();
  return useMutation({
    mutationFn: async (p: { id: string; status: StatusMatricula }) =>
      ok(await db.from("matriculas").update({ status: p.status }).eq("id", p.id)),
    onSuccess: invalidar,
  });
}