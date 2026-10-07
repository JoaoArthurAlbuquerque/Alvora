import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Database, Json } from "@/types/database";
import { ok, useRealtime } from "./realtime";
import { normalizarRegras, REGRAS_PADRAO } from "@/config/regras";
import type { RegraFrequencia } from "@/types";

export type Linha = Record<string, unknown>;

/** Fábrica genérica: listar + salvar + excluir com realtime */
type TableName = keyof Database["public"]["Tables"];

/** Cliente sem tipos só para a fábrica genérica (evita "Type instantiation is excessively deep") */
const db = supabase as unknown as SupabaseClient;

function crud<T extends Linha = Linha>(tabela: TableName, ordem = "created_at", asc = false) {
  const K = [tabela];

  return {
    useLista: (filtro?: Record<string, string>) => {
      useRealtime(tabela, K);
      return useQuery({
        queryKey: [...K, filtro],
        queryFn: async (): Promise<T[]> => {
          let q = db.from(tabela).select("*").order(ordem, { ascending: asc });
          Object.entries(filtro ?? {}).forEach(([c, v]) => {
            q = q.eq(c, v);
          });
          return ok(await q) as unknown as T[];
        },
      });
    },

    useSalvar: (onConflict?: string) => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: async (v: Partial<T> | Partial<T>[]): Promise<T[]> =>
          ok(
            await db
              .from(tabela)
              .upsert(v as Linha | Linha[], onConflict ? { onConflict } : undefined)
              .select(),
          ) as unknown as T[],
        onSuccess: () => qc.invalidateQueries({ queryKey: K }),
      });
    },

    useExcluir: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: async (id: string) =>
          ok(await db.from(tabela).delete().eq("id", id)),
        onSuccess: () => qc.invalidateQueries({ queryKey: K }),
      });
    },
  };
}

// ---------- Tipos das tabelas ----------
export interface Evento extends Linha {
  id: string;
  turma_id: string | null;
  data: string;
  titulo: string;
  tipo: "entrega" | "avaliacao" | "feriado" | "evento";
  criado_por: string;
  created_at: string;
}

export interface Nota extends Linha {
  id: string;
  turma_disciplina_id: string;
  aluno_id: string;
  avaliacao: string;
  valor: number | null;
  lancado_por: string | null;
  updated_at: string;
}

export interface Duvida extends Linha {
  id: string;
  numero: number;
  aluno_id: string;
  turma_disciplina_id: string | null;
  pergunta: string;
  resposta: string | null;
  respondido_por: string | null;
  status: "aberta" | "respondida" | "fechada";
  created_at: string;
}

export interface Requerimento extends Linha {
  id: string;
  aluno_id: string;
  titulo: string;
  protocolo: string;
  status: "Em Análise" | "Concluído" | "Indeferido";
  created_at: string;
}

export interface RegistroAuditoria extends Linha {
  id: number;
  usuario_id: string | null;
  tabela: string;
  acao: "INSERT" | "UPDATE" | "DELETE";
  registro_id: string | null;
  antes: Linha | null;
  depois: Linha | null;
  created_at: string;
}

// ---------- APIs ----------
export const eventosApi = crud<Evento>("eventos", "data", true);
/** Salvar com onConflict "turma_disciplina_id,aluno_id,avaliacao" */
export const notasApi = crud<Nota>("notas", "updated_at");
export const duvidasApi = crud<Duvida>("duvidas");
export const requerimentosApi = crud<Requerimento>("requerimentos");
export const auditoriaApi = crud<RegistroAuditoria>("auditoria");

// ---------- Regras globais (linha id = 1) ----------
interface RegrasRow {
  dados: Partial<RegraFrequencia> | null;
}

export function useRegras() {
  useRealtime("regras", ["regras"]);
  return useQuery({
    queryKey: ["regras"],
    queryFn: async (): Promise<RegraFrequencia> => {
      const r = ok(
        await supabase.from("regras").select("dados").eq("id", 1).maybeSingle(),
      ) as unknown as RegrasRow | null;
      return normalizarRegras({ ...REGRAS_PADRAO, ...(r?.dados ?? {}) });
    },
  });
}

export function useSalvarRegras() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (r: RegraFrequencia) =>
      ok(
        await supabase.from("regras").upsert({
          id: 1,
          dados: normalizarRegras(r) as unknown as Json,
          atualizado_em: new Date().toISOString(),
        }),
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["regras"] }),
  });
}