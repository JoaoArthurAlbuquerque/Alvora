import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ok, useRealtime } from "./realtime";

export function useFrequenciaTurma(td?: string) {
  useRealtime("frequencias", ["freq-turma", td]);
  return useQuery({
    queryKey: ["freq-turma", td], enabled: !!td,
    queryFn: async () => ok(await supabase.rpc("frequencia_turma", { p_td: td })) as {
      aluno_id: string; nome: string; total_aulas: number; presencas: number; percentual: number;
    }[],
  });
}

export function useMinhaFrequencia() {
  useRealtime("frequencias", ["minha-freq"]);
  return useQuery({
    queryKey: ["minha-freq"],
    queryFn: async () => ok(await supabase.rpc("minha_frequencia")) as {
      disciplina_id: string; disciplina_nome: string; total_aulas: number;
      presencas: number; faltas: number; percentual: number;
    }[],
  });
}

/** Chamada manual do professor */
export function useSalvarChamada(td: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ data, presencas }: { data: string; presencas: Record<string, boolean> }) =>
      ok(await supabase.from("frequencias").upsert(
        Object.entries(presencas).map(([aluno_id, presente]) => ({
          turma_disciplina_id: td, aluno_id, data, presente,
          status: presente ? "PRESENTE_MANUAL" : "FALTA",
        })),
        { onConflict: "turma_disciplina_id,aluno_id,data" })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["freq-turma", td] }),
  });
}

export const gerarPin = async (td: string, minutos?: number) =>
  (ok(await supabase.rpc("gerar_pin", { p_turma_disciplina_id: td, p_minutos: minutos ?? null })) as
    { pin: string; expira_em: string }[])[0];

export const registrarPresenca = async (pin: string) =>
  ok(await supabase.rpc("registrar_presenca", { p_pin: pin }));
