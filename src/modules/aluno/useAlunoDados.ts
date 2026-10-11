import { useMemo } from "react";
import { useAuthStore } from "../../core/auth/useAuthStore";
import { calcularPercentual } from "../../utils/frequencia";
import { useJustificativas, aplicarAbonos } from "../../services/justificativaStore";
import { useMinhaFrequencia, useMeuBoletim, type ItemBoletim } from "../../services/alunoApi";

export function calcularMediaGeral(boletim: { mediaParcial?: number | null }[]): number | null {
  const notas = boletim.map((b) => b.mediaParcial).filter((m): m is number => typeof m === "number");
  if (!notas.length) return null;
  return Number((notas.reduce((s, m) => s + m, 0) / notas.length).toFixed(2));
}

export function useAlunoDados() {
  const usuario = useAuthStore((s) => s.usuario);
  const justificativas = useJustificativas();
  const { dados, carregando, erro } = useMinhaFrequencia();
  const boletim: ItemBoletim[] = useMeuBoletim();

  const aluno = useMemo(
    () => ({
      id: usuario?.id ?? "",
      nome: usuario?.nome || "Aluno",
      email: usuario?.email ?? "",
      matricula: usuario?.matricula || "—",
      curso: (usuario as { curso?: string } | null)?.curso ?? "",
    }),
    [usuario],
  );

  // Banco é a fonte; abonos locais aplicados por cima até migrar justificativas
  const historico = useMemo(
    () => aplicarAbonos(dados, justificativas, aluno.id),
    [dados, justificativas, aluno.id],
  );

  const frequenciaGlobal = useMemo(() => {
    const total = historico.reduce((a, h) => a + h.presencas + h.faltas, 0);
    const presencas = historico.reduce((a, h) => a + h.presencas, 0);
    return total ? calcularPercentual(presencas, total) : 100;
  }, [historico]);

  const mediaGeral = useMemo(() => calcularMediaGeral(boletim), [boletim]);

  return { aluno, historico, boletim, justificativas, frequenciaGlobal, mediaGeral, carregando, erro };
}
