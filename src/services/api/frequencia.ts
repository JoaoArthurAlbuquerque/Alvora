// src/services/api/frequencia.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ok, useRealtime } from "./realtime";

export interface FrequenciaAluno {
  aluno_id: string;
  nome: string;
  total_aulas: number;
  presencas: number;
  percentual: number;
}

export interface MinhaFrequencia {
  disciplina_id: string;
  disciplina_nome: string;
  total_aulas: number;
  presencas: number;
  faltas: number;
  percentual: number;
}

export interface PinGerado {
  pin: string;
  expira_em: string;
}

export function useFrequenciaTurma(td?: string) {
  useRealtime("frequencias", ["freq-turma", td]);
  return useQuery({
    queryKey: ["freq-turma", td],
    enabled: !!td,
    queryFn: async (): Promise<FrequenciaAluno[]> =>
      ok(
        await supabase.rpc("frequencia_turma", { p_td: td as string }),
      ) as unknown as FrequenciaAluno[],
  });
}

export function useMinhaFrequencia() {
  useRealtime("frequencias", ["minha-freq"]);
  return useQuery({
    queryKey: ["minha-freq"],
    queryFn: async (): Promise<MinhaFrequencia[]> =>
      ok(await supabase.rpc("minha_frequencia")) as unknown as MinhaFrequencia[],
  });
}

/** Chamada manual do professor */
export function useSalvarChamada(td: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
      presencas,
    }: {
      data: string;
      presencas: Record<string, boolean>;
    }) =>
      ok(
        await supabase.from("frequencias").upsert(
          Object.entries(presencas).map(([aluno_id, presente]) => ({
            turma_disciplina_id: td,
            aluno_id,
            data,
            presente,
            status: presente ? ("PRESENTE_MANUAL" as const) : ("FALTA" as const),
          })),
          { onConflict: "turma_disciplina_id,aluno_id,data" },
        ),
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["freq-turma", td] }),
  });
}

export const gerarPin = async (td: string, minutos?: number): Promise<PinGerado | undefined> => {
  const rows = ok(
    await supabase.rpc("gerar_pin", {
      p_turma_disciplina_id: td,
      // omitido quando não informado: o banco usa o DEFAULT
      ...(minutos !== undefined ? { p_minutos: minutos } : {}),
    }),
  ) as unknown as PinGerado[];
  return rows?.[0];
};

export const registrarPresenca = async (pin: string) =>
  ok(await supabase.rpc("registrar_presenca", { p_pin: pin }));
