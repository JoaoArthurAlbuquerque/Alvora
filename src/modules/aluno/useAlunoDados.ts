import { useMemo } from "react";
import { useAuthStore } from "../../core/auth/useAuthStore";
import { alunoLogadoMock } from "../../mocks/data";
import { calcularPercentual } from "../../utils/frequencia";
import {
  useJustificativas,
  aplicarAbonos,
} from "../../services/justificativaStore";
import {
  useRegistros,
  aplicarRegistros,
} from "../../services/diarioStore";
import type { Aluno } from "../../types";

/** Identidade vem do Supabase; notas e frequência seguem mock por enquanto. */
export function useAlunoDados() {
  const usuario = useAuthStore((s) => s.usuario);
  const justificativas = useJustificativas();
  const registros = useRegistros();

  const aluno: Aluno = useMemo(
    () => ({
      ...alunoLogadoMock,
      id: usuario?.id ?? alunoLogadoMock.id,
      nome: usuario?.nome || alunoLogadoMock.nome,
      email: usuario?.email ?? alunoLogadoMock.email,
      matricula: usuario?.matricula || "—",
    }),
    [usuario],
  );

  // 1º chamadas do professor → 2º abonos das justificativas
  const historico = useMemo(
    () =>
      aplicarAbonos(
        aplicarRegistros(aluno.historicoFrequencia, registros, aluno.id),
        justificativas,
        aluno.id,
      ),
    [aluno.historicoFrequencia, registros, justificativas, aluno.id],
  );

  const frequenciaGlobal = useMemo(() => {
    const total = historico.reduce((a, h) => a + h.presencas + h.faltas, 0);
    const presencas = historico.reduce((a, h) => a + h.presencas, 0);
    return calcularPercentual(presencas, total);
  }, [historico]);

  return { aluno, historico, justificativas, frequenciaGlobal };
}
