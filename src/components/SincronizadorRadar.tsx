import { useFrequenciaTurma, TURMA_ID } from "../services/frequenciaTurma";
import { useRadarRisco } from "../services/radarRisco";
import { useMediasTurma } from "../services/notas";

/** Mantém os alertas sincronizados em qualquer tela. Não renderiza nada. */
export function SincronizadorRadar() {
  const { alunos } = useFrequenciaTurma();
  const medias = useMediasTurma(alunos);
  useRadarRisco(alunos, medias, TURMA_ID, "sistema");
  return null;
}
