import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { PapelUsuario } from "@/types";

// ✅ Nomes reais das colunas no banco
const COL = {
  tdTurma: "turma_id",
  tdDisciplina: "disciplina_id",
  tdProfessor: "professor_id",
  matAluno: "aluno_id",
  matTurma: "turma_id",
  freqAluno: "aluno_id",
  freqTd: "turma_disciplina_id",
  freqPresente: "presente",
  freqData: "data",
} as const;

type Linha = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface Pessoa { id: string; nome: string; papel: PapelUsuario }
export interface DiscTurma { tdId: string; nome: string; professorId: string; professorNome: string }
export interface TurmaResumo { id: string; nome: string; curso: string; turno: string; disciplinas: DiscTurma[]; alunos: Pessoa[] }
export interface Escola { turmas: TurmaResumo[]; pessoas: Map<string, Pessoa> }
export interface RegistroAuditoria { id: string; quando: string; status: "PRESENTE" | "FALTA"; aluno: string; disciplina: string; turma: string; professor: string }

const nomeDe = (p: Linha) => [p.nome, p.sobrenome].filter(Boolean).join(" ") || "Sem nome";

const checar = (...rs: { error: unknown }[]) => {
  const e = rs.find((r) => r.error)?.error;
  if (e) throw e;
};

export async function carregarEscola(): Promise<Escola> {
  const [t, td, d, m, p] = await Promise.all([
    supabase.from("turmas").select("id, nome, ano_letivo, turno"),
    supabase.from("turma_disciplinas").select("id, turma_id, disciplina_id, professor_id"),
    supabase.from("disciplinas").select("id, nome"),
    supabase.from("matriculas").select("id, turma_id, aluno_id, status"),
    supabase.from("profiles").select("id, nome, sobrenome, papel"),
  ]);
  checar(t, td, d, m, p);

  const pessoas = new Map<string, Pessoa>(
    (p.data ?? []).map((x: Linha) => [x.id, { id: x.id, nome: nomeDe(x), papel: x.papel }]),
  );
  const discNome = new Map((d.data ?? []).map((x: Linha) => [x.id, x.nome as string]));

  const turmas = (t.data ?? []).map((x: Linha): TurmaResumo => ({
    id: x.id,
    nome: x.nome ?? "Turma",
    curso: x.ano_letivo ? `Ano letivo ${x.ano_letivo}` : "",
    turno: x.turno ?? "",
    disciplinas: (td.data ?? [])
      .filter((r: Linha) => r[COL.tdTurma] === x.id)
      .map((r: Linha) => ({
        tdId: r.id,
        nome: discNome.get(r[COL.tdDisciplina]) ?? "Disciplina",
        professorId: r[COL.tdProfessor],
        professorNome: pessoas.get(r[COL.tdProfessor])?.nome ?? "A definir",
      })),
    alunos: (m.data ?? [])
      .filter((r: Linha) => r[COL.matTurma] === x.id)
      .map((r: Linha) => pessoas.get(r[COL.matAluno]))
      .filter(Boolean) as Pessoa[],
  }));

  return { turmas, pessoas };
}

export async function carregarAuditoria(limite = 100): Promise<RegistroAuditoria[]> {
  const [f, escola] = await Promise.all([
    supabase.from("frequencias").select("*").order(COL.freqData, { ascending: false }).limit(limite),
    carregarEscola(),
  ]);
  checar(f);

  const porTd = new Map<string, { disc: DiscTurma; turma: string }>();
  escola.turmas.forEach((t) => t.disciplinas.forEach((disc) => porTd.set(disc.tdId, { disc, turma: t.nome })));

  return (f.data ?? []).map((r: Linha) => {
    const td = porTd.get(r[COL.freqTd]);
    return {
      id: String(r.id),
      quando: r[COL.freqData] ?? "",
      status: r[COL.freqPresente] ? "PRESENTE" : "FALTA",
      aluno: escola.pessoas.get(r[COL.freqAluno])?.nome ?? "Aluno",
      disciplina: td?.disc.nome ?? "—",
      turma: td?.turma ?? "—",
      professor: td?.disc.professorNome ?? "—",
    };
  });
}

/** Hook genérico: carrega, trata erro e permite recarregar */
export function useConsulta<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let vivo = true;
    fn()
      .then((r) => { if (vivo) { setData(r); setErro(null); } })
      .catch((e) => { if (vivo) setErro((e as { message?: string })?.message ?? "Erro ao carregar dados"); })
      .finally(() => { if (vivo) setCarregando(false); });
    return () => { vivo = false; };
  }, [fn, versao]);

  const recarregar = useCallback(() => {
    setCarregando(true);
    setErro(null);
    setVersao((v) => v + 1);
  }, []);

  return { data, erro, carregando, recarregar };
}
