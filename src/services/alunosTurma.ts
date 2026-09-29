import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "../lib/supabase";
import { listaAlunosTurmaMock, type AlunoTurma } from "../mocks/data";

// ⚙️ Nomes conferidos com o seu banco
const TABELA_TURMA_DISC = "turma_disciplinas"; // id, turma_id, disciplina_id
const TABELA_MATRICULAS = "matriculas"; // turma_id, aluno_id, status
const TABELA_PERFIS = "profiles"; // id, nome, sobrenome, matricula, papel
const PAPEL_ALUNO = "aluno";
const TURMA_DISC_PADRAO = import.meta.env.VITE_TURMA_DISCIPLINA_ID as
  | string
  | undefined;
const EVT = "alvora:alunos-turma-change";

let cache: AlunoTurma[] = [];
let carregadoPara: string | null = null;
let emAndamento: Promise<void> | null = null;

function emitir(lista: AlunoTurma[]) {
  cache = lista;
  window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  return () => window.removeEventListener(EVT, cb);
}

type LinhaPerfil = {
  id: string;
  nome: string | null;
  sobrenome: string | null;
  matricula: string | null;
};

/** Formato mínimo do erro retornado pelo Supabase (PostgREST). */
type ErroSupabase = {
  message: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
};

/** Erro enriquecido com a tabela onde falhou. */
type ErroDetalhado = Error & {
  code?: string;
  details?: string | null;
  hint?: string | null;
  tabela?: string;
};

const mapear = (p: LinhaPerfil): AlunoTurma => ({
  id: p.id,
  nome:
    [p.nome, p.sobrenome].filter(Boolean).join(" ").trim() || "Aluno sem nome",
  matricula: p.matricula ?? "—",
  presente: false,
});

/** Lança o erro dizendo em qual tabela falhou. */
function checar(error: ErroSupabase | null, tabela: string): void {
  if (error) {
    const erro: ErroDetalhado = Object.assign(
      new Error(`[${tabela}] ${error.message}`),
      {
        code: error.code,
        details: error.details,
        hint: error.hint,
        tabela,
      }
    );
    throw erro;
  }
}

async function buscar(turmaDisciplinaId?: string): Promise<AlunoTurma[]> {
  if (turmaDisciplinaId) {
    // 1) turma_disciplina -> turma_id
    const { data: td, error: e1 } = await supabase
      .from(TABELA_TURMA_DISC)
      .select("turma_id")
      .eq("id", turmaDisciplinaId)
      .maybeSingle();
    checar(e1, TABELA_TURMA_DISC);
    if (!td) {
      throw new Error(
        `turma_disciplina ${turmaDisciplinaId} não encontrada (ou bloqueada pelo RLS)`
      );
    }

    // 2) turma_id -> aluno_ids
    const { data: mats, error: e2 } = await supabase
      .from(TABELA_MATRICULAS)
      .select("aluno_id")
      .eq("turma_id", td.turma_id);
    checar(e2, TABELA_MATRICULAS);

    const ids = (mats ?? []).map((m: { aluno_id: string }) => m.aluno_id);
    if (ids.length === 0) return [];

    // 3) aluno_ids -> perfis (somente papel "aluno")
    const { data: perfis, error: e3 } = await supabase
      .from(TABELA_PERFIS)
      .select("id, nome, sobrenome, matricula")
      .in("id", ids)
      .eq("papel", PAPEL_ALUNO);
    checar(e3, TABELA_PERFIS);
    return ((perfis ?? []) as LinhaPerfil[]).map(mapear);
  }

  // Sem turma: todos os perfis com papel "aluno"
  const { data, error } = await supabase
    .from(TABELA_PERFIS)
    .select("id, nome, sobrenome, matricula")
    .eq("papel", PAPEL_ALUNO);
  checar(error, TABELA_PERFIS);
  return ((data ?? []) as LinhaPerfil[]).map(mapear);
}

export async function carregarAlunosTurma(turmaId?: string, forcar = false) {
  const id = turmaId ?? TURMA_DISC_PADRAO;
  const chave = id ?? "*";
  if (!forcar && carregadoPara === chave) return;
  if (emAndamento) return emAndamento;

  emAndamento = (async () => {
    try {
      const lista = await buscar(id);
      console.info(
        `[alunosTurma] ${lista.length} aluno(s) carregado(s) para`,
        chave
      );
      emitir(lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")));
    } catch (e: unknown) {
      const erro = e as ErroDetalhado;
      console.warn(
        `[alunosTurma] Falha no Supabase, usando mock: ${erro?.message} (code: ${erro?.code ?? "?"})`,
        e
      );
      emitir(listaAlunosTurmaMock);
    } finally {
      carregadoPara = chave; // evita repetir a busca sem parar
      emAndamento = null;
    }
  })();
  return emAndamento;
}

/** Leitura síncrona (último valor carregado). */
export const listarAlunosTurma = (): AlunoTurma[] => cache;

/** Hook: busca no banco e re-renderiza quando a lista chega. */
export function useAlunosTurma(turmaId?: string): AlunoTurma[] {
  useEffect(() => {
    carregarAlunosTurma(turmaId);
  }, [turmaId]);
  return useSyncExternalStore(subscribe, () => cache);
}
