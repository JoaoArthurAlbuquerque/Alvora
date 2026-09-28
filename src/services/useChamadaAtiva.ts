import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface ChamadaAtiva {
  turmaDisciplinaId: string;
  disciplinaNome: string | null;
  expiraEm: number;
}

export function useChamadaAtiva(intervaloMs = 10000) {
  const [chamada, setChamada] = useState<ChamadaAtiva | null>(null);

  useEffect(() => {
    let vivo = true;
    const buscar = async () => {
      const { data, error } = await supabase.rpc("chamada_ativa");
      if (!vivo || error) return;
      const r = data?.[0];
      setChamada(
        r
          ? {
              turmaDisciplinaId: r.turma_disciplina_id,
              disciplinaNome: r.disciplina_nome,
              expiraEm: new Date(r.expira_em).getTime(),
            }
          : null,
      );
    };
    buscar();
    const t = setInterval(buscar, intervaloMs);
    const foco = () => document.visibilityState === "visible" && buscar();
    document.addEventListener("visibilitychange", foco);
    return () => {
      vivo = false;
      clearInterval(t);
      document.removeEventListener("visibilitychange", foco);
    };
  }, [intervaloMs]);

  return chamada;
}
