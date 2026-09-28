import { useMemo } from "react";
import { useAuthStore } from "../../core/auth/useAuthStore";
import { alunoLogadoMock } from "../../mocks/data";
import {
  useJustificativas,
  aplicarAbonos,
} from "../../services/justificativaStore";
import type { Aluno } from "../../types";

/** Identidade vem do Supabase; notas e frequência seguem mock por enquanto. */
export function useAlunoDados() {
  const usuario = useAuthStore((s) => s.usuario);
  const justificativas = useJustificativas();

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

  const historico = useMemo(
    () => aplicarAbonos(aluno.historicoFrequencia, justificativas, aluno.id),
    [aluno.historicoFrequencia, justificativas, aluno.id],
  );

  const frequenciaGlobal = useMemo(() => {
    const total = historico.reduce((a, h) => a + h.presencas + h.faltas, 0);
    const presencas = historico.reduce((a, h) => a + h.presencas, 0);
    return total ? (presencas / total) * 100 : 100;
  }, [historico]);

  return { aluno, historico, justificativas, frequenciaGlobal };
}
