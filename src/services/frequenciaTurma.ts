import { useMemo } from "react";
import {
  historicoBase,
  sessaoFrequenciaAtiva,
  type AlunoTurma,
} from "../mocks/data";
import { listarAlunosTurma, useAlunosTurma } from "./alunosTurma";
import { useRegistros, contaComoPresenca, diarioStore } from "./diarioStore";
import { useJustificativas } from "./justificativaStore";
import { LIMITE_FALTAS_PCT, REGRAS } from "../config/regras";
import { useRegras } from "./regrasService";
import { classificar } from "./radarRisco";
import type { RegistroPresenca, RegraFrequencia } from "../types";

export const TURMA_ID = "turma-a";

/** UUID real da turma no Supabase (opcional). Sem ele, lista todos os perfis com role "aluno". */
export const TURMA_UUID: string = import.meta.env.VITE_TURMA_ID ?? "";

/** ID do mock: usado só no diário/histórico local (localStorage). */
export const DISCIPLINA_ID = sessaoFrequenciaAtiva.disciplinaId;

/** UUID real de turma_disciplinas.id: usado na chamada por PIN (Supabase). */
export const TURMA_DISCIPLINA_ID: string =
  import.meta.env.VITE_TURMA_DISCIPLINA_ID ?? "";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Diz se o valor é um UUID válido (evita "invalid input syntax for type uuid"). */
export const ehUuid = (v: string | null | undefined): v is string =>
  !!v && UUID_RE.test(v);

/** Turma a consultar no banco (undefined = todos os alunos). */
export const turmaConsulta = (): string | undefined =>
  ehUuid(TURMA_UUID) ? TURMA_UUID : undefined;

/**
 * @deprecated Valor estático: ignora mudanças do gestor.
 * Use `limiteFaltas` retornado por `useFrequenciaTurma()`.
 * Mantido só até migrar PortalProfessor e PortalGestor.
 */
export { LIMITE_FALTAS_PCT };

type Justificativa = ReturnType<typeof useJustificativas>[number];

export interface ResumoFrequenciaAluno {
  id: string;
  nome: string;
  matricula: string;
  totalAulas: number;
  presencas: number;
  faltas: number;
  faltasAbonadas: number;
  percentualFrequencia: number;
  percentualFaltas: number;
  /** Risco APENAS por faltas (regra vem de classificar). Para risco completo use o radar. */
  emRisco: boolean;
}

/** Conta os abonos aprovados de um aluno na disciplina da turma (datas únicas). */
const contarAbonos = (justificativas: Justificativa[], alunoId: string) =>
  new Set(
    justificativas
      .filter(
        (j) =>
          j.alunoId === alunoId &&
          j.disciplinaId === DISCIPLINA_ID &&
          j.status === "aprovada",
      )
      .map((j) => j.dataFalta),
  ).size;

export function calcularFrequenciaTurma(
  registros: RegistroPresenca[],
  justificativas: Justificativa[] = [],
  turma: AlunoTurma[] = listarAlunosTurma(),
  regras: RegraFrequencia = REGRAS,
): ResumoFrequenciaAluno[] {
  return turma.map((a) => {
    const base = historicoBase(a.id);
    const meus = registros.filter(
      (r) =>
        r.alunoId === a.id &&
        r.turmaId === TURMA_ID &&
        r.disciplinaId === DISCIPLINA_ID,
    );
    const novasPresencas = meus.filter((r) =>
      contaComoPresenca(r.status),
    ).length;

    const faltasBrutas = base.faltas + (meus.length - novasPresencas);
    const faltasAbonadas = Math.min(
      faltasBrutas,
      contarAbonos(justificativas, a.id),
    );
    const presencas = base.presencas + novasPresencas + faltasAbonadas;
    const faltas = faltasBrutas - faltasAbonadas;
    const totalAulas = Math.max(base.totalAulas, presencas + faltas) || 1;
    const percentualFaltas = Number(((faltas / totalAulas) * 100).toFixed(1));

    return {
      id: a.id,
      nome: a.nome,
      matricula: a.matricula,
      totalAulas,
      presencas,
      faltas,
      faltasAbonadas,
      percentualFrequencia: Number((100 - percentualFaltas).toFixed(1)),
      percentualFaltas,
      emRisco: classificar(percentualFaltas, null, regras).motivo !== null,
    };
  });
}

export function useFrequenciaTurma() {
  const registros = useRegistros();
  const justificativas = useJustificativas();
  const turma = useAlunosTurma(turmaConsulta());
  // Quando o gestor muda as regras, o risco é calculado de novo
  const regras = useRegras();

  return useMemo(() => {
    const alunos = calcularFrequenciaTurma(
      registros,
      justificativas,
      turma,
      regras,
    );
    const emRisco = alunos
      .filter((a) => a.emRisco)
      .sort((x, y) => y.percentualFaltas - x.percentualFaltas);
    const mediaFrequencia = alunos.length
      ? Number(
          (
            alunos.reduce((s, a) => s + a.percentualFrequencia, 0) /
            alunos.length
          ).toFixed(1),
        )
      : 0;
    const diasRegistrados = new Set(
      registros
        .filter(
          (r) => r.turmaId === TURMA_ID && r.disciplinaId === DISCIPLINA_ID,
        )
        .map((r) => r.data),
    ).size;
    // `registros` na dependência garante o recálculo quando o diário muda
    const diarioHojeSalvo = diarioStore.jaSalvo(TURMA_ID, DISCIPLINA_ID);
    return {
      alunos,
      emRisco,
      mediaFrequencia,
      diasRegistrados,
      diarioHojeSalvo,
      limiteFaltas: regras.limiteAlertaFaltas,
    };
  }, [registros, justificativas, turma, regras]);
}
