// =====================================================================
// src/modules/professor/useSalaSelecionada.ts  (NOVO)
// =====================================================================
import { useState } from "react";
import { useMinhasSalas } from "../../services/api/turmas";

/** Salas reais do professor logado (turma_disciplinas.professor_id) */
export function useSalaSelecionada() {
  const q = useMinhasSalas();
  const [id, setId] = useState<string>();
  const salas = q.data ?? [];
  const sala = salas.find((s) => s.id === id) ?? salas[0];
  return {
    salas,
    sala,
    setId,
    carregando: q.isLoading,
    erro: (q.error as Error | null)?.message ?? null,
    recarregar: q.refetch,
  };
}
