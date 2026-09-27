import { useMemo } from "react";
import { alunoLogadoMock } from "../../mocks/data";
import { useRegistros, aplicarRegistros } from "../../services/diarioStore";
import {
  useJustificativas,
  aplicarAbonos,
} from "../../services/justificativaStore";

/** Aluno com frequência = mock + diário + abonos aprovados */
export function useAlunoDados() {
  const registros = useRegistros();
  const justificativas = useJustificativas();

  const aluno = useMemo(
    () => ({
      ...alunoLogadoMock,
      historicoFrequencia: aplicarAbonos(
        aplicarRegistros(
          alunoLogadoMock.historicoFrequencia,
          registros,
          alunoLogadoMock.id,
        ),
        justificativas,
        alunoLogadoMock.id,
      ),
    }),
    [registros, justificativas],
  );

  const historico = aluno.historicoFrequencia;
  const frequenciaGlobal = historico.length
    ? historico.reduce((acc, h) => acc + h.percentualFrequencia, 0) /
      historico.length
    : 100;

  return { aluno, historico, justificativas, frequenciaGlobal };
}
