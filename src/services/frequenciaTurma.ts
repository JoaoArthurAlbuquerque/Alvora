import { useMemo } from "react";
import {
  listaAlunosTurmaMock,
  historicoBaseTurmaMock,
  sessaoFrequenciaAtiva,
} from "../mocks/data";
import { useRegistros, contaComoPresenca, diarioStore } from "./diarioStore";
import { useJustificativas } from "./justificativaStore";
import { LIMITE_FALTAS_PCT } from "../config/regras";
import type { RegistroPresenca } from "../types";

export const TURMA_ID = "turma-a";
export const DISCIPLINA_ID = sessaoFrequenciaAtiva.disciplinaId;
export { LIMITE_FALTAS_PCT }; // PortalProfessor e PortalGestor importam daqui

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
): ResumoFrequenciaAluno[] {
  return listaAlunosTurmaMock.map((a) => {
    const base = historicoBaseTurmaMock[a.id] ?? {
      totalAulas: 0,
      presencas: 0,
      faltas: 0,
    };
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
      emRisco: percentualFaltas > LIMITE_FALTAS_PCT,
    };
  });
}

export function useFrequenciaTurma() {
  const registros = useRegistros();
  const justificativas = useJustificativas();

  return useMemo(() => {
    const alunos = calcularFrequenciaTurma(registros, justificativas);
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
    };
  }, [registros, justificativas]);
}
