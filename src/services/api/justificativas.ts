import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ok, useRealtime } from "./realtime";

const K = ["justificativas"];

export function useJustificativas() {
  useRealtime("justificativas", K);
  return useQuery({
    queryKey: K,
    queryFn: async () => ok(await supabase.from("justificativas")
      .select("*, aluno:profiles!justificativas_aluno_id_fkey(nome, sobrenome), sala:turma_disciplinas(disciplinas(nome))")
      .order("created_at", { ascending: false })),
  });
}

export function useEnviarJustificativa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (j: { td: string; dataFalta: string; motivo: string; arquivo?: File; alunoId: string }) => {
      let anexo_path: string | null = null;
      if (j.arquivo) {
        anexo_path = `${j.alunoId}/${crypto.randomUUID()}-${j.arquivo.name}`;
        ok(await supabase.storage.from("atestados").upload(anexo_path, j.arquivo));
      }
      return ok(await supabase.from("justificativas").insert({
        turma_disciplina_id: j.td, data_falta: j.dataFalta, motivo: j.motivo, anexo_path,
      }));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: K }),
  });
}

/** Gestor: aprovar já abona a falta no banco (trigger aplicar_abono) */
export function useDecidirJustificativa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (d: { id: string; status: "aprovada" | "recusada"; parecer?: string }) =>
      ok(await supabase.from("justificativas")
        .update({ status: d.status, parecer: d.parecer ?? null }).eq("id", d.id)),
    onSuccess: () => qc.invalidateQueries(),
  });
}

export const urlAnexo = async (path: string) =>
  (await supabase.storage.from("atestados").createSignedUrl(path, 300)).data?.signedUrl;
