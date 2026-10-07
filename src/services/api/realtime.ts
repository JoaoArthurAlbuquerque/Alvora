import { useEffect } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useRealtime(tabela: string, chave: QueryKey) {
  const qc = useQueryClient();
  const k = JSON.stringify(chave);
  useEffect(() => {
    const ch = supabase
      .channel(`rt:${tabela}:${crypto.randomUUID()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: tabela },
        () => qc.invalidateQueries({ queryKey: chave }))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabela, k]);
}

/** Lança o erro do Supabase para o React Query tratar */
export const ok = <T,>({ data, error }: { data: T; error: unknown }) => {
  if (error) throw error;
  return data;
};
