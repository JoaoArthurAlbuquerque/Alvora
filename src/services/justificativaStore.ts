// =====================================================================
// src/services/justificativaStore.ts
// =====================================================================
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/core/auth/useAuthStore";
import { ok, useRealtime } from "./api/realtime";
import { calcularPercentual } from "../utils/frequencia";
import type { FrequenciaDisciplina } from "./alunoApi";

const db = supabase as unknown as SupabaseClient;
const BUCKET = "comprovantes";
export const TAMANHO_MAX_ANEXO = 5 * 1024 * 1024;

export type StatusJustificativa = "pendente" | "aprovada" | "recusada";

export interface Justificativa {
  id: string;
  alunoId: string;
  alunoNome: string;
  disciplinaId: string;
  disciplinaNome: string;
  dataFalta: string; // YYYY-MM-DD
  motivo: string;
  anexoPath?: string;
  anexoNome?: string;
  status: StatusJustificativa;
  parecer?: string;
  criadaEm: number;
}

interface Row {
  id: string;
  aluno_id: string;
  disciplina_id: string;
  data_falta: string;
  motivo: string;
  anexo_path: string | null;
  anexo_nome: string | null;
  status: StatusJustificativa;
  parecer: string | null;
  created_at: string;
  profiles: { nome: string | null; sobrenome: string | null } | null;
  disciplinas: { nome: string } | null;
}

const mapear = (r: Row): Justificativa => ({
  id: r.id,
  alunoId: r.aluno_id,
  alunoNome:
    [r.profiles?.nome, r.profiles?.sobrenome].filter(Boolean).join(" ") || "Aluno",
  disciplinaId: r.disciplina_id,
  disciplinaNome: r.disciplinas?.nome ?? "Disciplina",
  dataFalta: r.data_falta,
  motivo: r.motivo,
  anexoPath: r.anexo_path ?? undefined,
  anexoNome: r.anexo_nome ?? undefined,
  status: r.status,
  parecer: r.parecer ?? undefined,
  criadaEm: new Date(r.created_at).getTime(),
});

const VAZIO: Justificativa[] = [];

/** O RLS decide o escopo: o aluno vê as dele e a coordenação vê todas */
export function useJustificativasQuery() {
  const u = useAuthStore((s) => s.usuario);
  useRealtime("justificativas", ["justificativas"]);
  return useQuery({
    queryKey: ["justificativas", u?.id],
    enabled: !!u,
    queryFn: async () =>
      (
        ok(
          await db
            .from("justificativas")
            .select(
              "id, aluno_id, disciplina_id, data_falta, motivo, anexo_path, anexo_nome, status, parecer, created_at, profiles!justificativas_aluno_id_fkey(nome, sobrenome), disciplinas(nome)",
            )
            .order("created_at", { ascending: false }),
        ) as unknown as Row[]
      ).map(mapear),
  });
}

/** Mesma assinatura de antes: devolve o array */
export const useJustificativas = (): Justificativa[] =>
  useJustificativasQuery().data ?? VAZIO;

// ---------- Envio (aluno) ----------
export interface NovaJustificativa {
  disciplinaId: string;
  dataFalta: string;
  motivo: string;
  anexo?: File;
}

export function useEnviarJustificativa() {
  const qc = useQueryClient();
  const u = useAuthStore((s) => s.usuario);
  return useMutation({
    mutationFn: async (n: NovaJustificativa): Promise<"ok" | "duplicada"> => {
      if (!u) throw new Error("Sessão expirada. Entre novamente.");
      let anexoPath: string | null = null;

      if (n.anexo) {
        if (n.anexo.size > TAMANHO_MAX_ANEXO)
          throw new Error("O comprovante deve ter no máximo 5 MB.");
        const ext = n.anexo.name.split(".").pop()?.toLowerCase() || "bin";
        anexoPath = `${u.id}/${crypto.randomUUID()}.${ext}`;
        const { error } = await db.storage
          .from(BUCKET)
          .upload(anexoPath, n.anexo, { contentType: n.anexo.type, upsert: false });
        if (error) throw new Error("Não foi possível enviar o comprovante.");
      }

      const { error } = await db.from("justificativas").insert({
        aluno_id: u.id,
        disciplina_id: n.disciplinaId,
        data_falta: n.dataFalta,
        motivo: n.motivo.trim(),
        anexo_path: anexoPath,
        anexo_nome: n.anexo?.name ?? null,
      });

      if (error) {
        // Remove o arquivo que ficou sem justificativa
        if (anexoPath) await db.storage.from(BUCKET).remove([anexoPath]);
        if (error.code === "23505") return "duplicada";
        throw new Error(error.message);
      }
      return "ok";
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["justificativas"] }),
  });
}

// ---------- Avaliação (coordenação) ----------
export function useAvaliarJustificativa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      id: string;
      status: Exclude<StatusJustificativa, "pendente">;
      parecer?: string;
    }) =>
      ok(
        await db
          .from("justificativas")
          .update({ status: p.status, parecer: p.parecer?.trim() || null })
          .eq("id", p.id),
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["justificativas"] });
      qc.invalidateQueries({ queryKey: ["minha-freq"] });
    },
  });
}

/** Link temporário (5 min) para abrir o comprovante */
export async function urlComprovante(path: string): Promise<string> {
  const { data, error } = await db.storage.from(BUCKET).createSignedUrl(path, 300);
  if (error || !data) throw new Error("Comprovante indisponível.");
  return data.signedUrl;
}

/** Cada justificativa aprovada converte 1 falta em presença */
export function aplicarAbonos(
  dados: FrequenciaDisciplina[],
  justificativas: Justificativa[],
  alunoId: string,
): FrequenciaDisciplina[] {
  const abonos: Record<string, number> = {};
  justificativas.forEach((j) => {
    if (j.alunoId === alunoId && j.status === "aprovada")
      abonos[j.disciplinaId] = (abonos[j.disciplinaId] ?? 0) + 1;
  });
  return dados.map((d) => {
    const n = Math.min(abonos[d.disciplinaId] ?? 0, d.faltas);
    if (!n) return d;
    const presencas = d.presencas + n;
    const faltas = d.faltas - n;
    return {
      ...d,
      presencas,
      faltas,
      percentualFrequencia: calcularPercentual(presencas, presencas + faltas),
    };
  });
}

export const useAbonos = (dados: FrequenciaDisciplina[], alunoId: string) => {
  const js = useJustificativas();
  return useMemo(() => aplicarAbonos(dados, js, alunoId), [dados, js, alunoId]);
};

// ---------- Compatibilidade com imports antigos (tela do gestor) ----------
/** @deprecated use os hooks diretamente */
export const justificativaStore = {
  useJustificativas,
  useJustificativasQuery,
  useEnviarJustificativa,
  useAvaliarJustificativa,
  useAbonos,
  aplicarAbonos,
  urlComprovante,
};

export default justificativaStore;
