// =====================================================================
// src/services/alunoApi.ts  (substitui o useMeuBoletim vazio e adiciona requerimentos)
// =====================================================================
import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/core/auth/useAuthStore";
import { ok, useRealtime } from "./api/realtime";
import { calcularMedia, AVALIACOES, type Avaliacao, type NotasAluno } from "./api/professor";
import {
  registrarPresenca as rpcRegistrarPresenca,
  useMinhaFrequencia as useMinhaFrequenciaRpc,
} from "./api/frequencia";
import { useRegras } from "./regrasService";
import type { ResultadoConfirmacao } from "./chamadaStore";

const db = supabase as unknown as SupabaseClient;

export interface FrequenciaDisciplina {
  disciplinaId: string;
  disciplinaNome: string;
  totalAulas: number;
  presencas: number;
  faltas: number;
  percentualFrequencia: number;
}

export interface ItemBoletim {
  id: string; // disciplinaId
  disciplinaNome: string;
  professorNome?: string;
  av1: number | null;
  av2: number | null;
  atividadesContinuas: number | null;
  mediaParcial: number | null;
  status: "Aprovado" | "Em Risco" | "Em Andamento";
}

export function useMinhaFrequencia() {
  const q = useMinhaFrequenciaRpc();
  const dados = useMemo<FrequenciaDisciplina[]>(
    () =>
      (q.data ?? []).map((r) => ({
        disciplinaId: r.disciplina_id,
        disciplinaNome: r.disciplina_nome ?? "Disciplina",
        totalAulas: Number(r.total_aulas ?? 0),
        presencas: Number(r.presencas ?? 0),
        faltas: Number(r.faltas ?? 0),
        percentualFrequencia: Number(r.percentual ?? 100),
      })),
    [q.data],
  );
  return { dados, carregando: q.isLoading, erro: (q.error as Error | null)?.message ?? null, recarregar: q.refetch };
}

// ---------- Boletim real (notas + turma_disciplinas) ----------
interface SalaRow {
  id: string;
  disciplinas: { id: string; nome: string } | null;
  profiles: { nome: string | null; sobrenome: string | null } | null;
}
interface NotaRow {
  turma_disciplina_id: string;
  avaliacao: string;
  valor: number | null;
}

export function useBoletimQuery() {
  const u = useAuthStore((s) => s.usuario);
  const regras = useRegras();
  const { dados: freq } = useMinhaFrequencia();
  useRealtime("notas", ["meu-boletim"]);

  const q = useQuery({
    queryKey: ["meu-boletim", u?.id],
    enabled: !!u,
    queryFn: async () => {
      const [s, n] = await Promise.all([
        db.from("turma_disciplinas").select("id, disciplinas(id, nome), profiles(nome, sobrenome)"),
        db.from("notas").select("turma_disciplina_id, avaliacao, valor").eq("aluno_id", u!.id),
      ]);
      return { salas: ok(s) as unknown as SalaRow[], notas: ok(n) as unknown as NotaRow[] };
    },
  });

  const boletim = useMemo<ItemBoletim[]>(() => {
    if (!q.data) return [];
    const pesos = regras.pesosAvaliacoes as unknown as Record<string, number>;
    const minhas = new Set(freq.map((f) => f.disciplinaId));
    const porSala: Record<string, NotasAluno> = {};
    q.data.notas.forEach((x) => {
      (porSala[x.turma_disciplina_id] ??= {})[x.avaliacao as Avaliacao] =
        x.valor === null ? null : Number(x.valor);
    });

    return q.data.salas
      // Só disciplinas em que o aluno está (frequência) ou já tem nota
      .filter((s) => s.disciplinas && (minhas.has(s.disciplinas.id) || porSala[s.id]))
      .map((s): ItemBoletim => {
        const n = porSala[s.id];
        const av1 = n?.AV1 ?? null;
        const av2 = n?.AV2 ?? null;
        const media = calcularMedia(n, pesos);
        const completo = AVALIACOES.every((av) => n?.[av] != null);
        const status: ItemBoletim["status"] =
          media === null
            ? "Em Andamento"
            : media < regras.mediaMinima
              ? "Em Risco"
              : completo
                ? "Aprovado"
                : "Em Andamento";
        return {
          id: s.disciplinas!.id,
          disciplinaNome: s.disciplinas!.nome,
          professorNome: s.profiles
            ? [s.profiles.nome, s.profiles.sobrenome].filter(Boolean).join(" ")
            : undefined,
          av1,
          av2,
          atividadesContinuas: null, // ainda não existe no banco
          mediaParcial: media,
          status,
        };
      })
      .sort((a, b) => a.disciplinaNome.localeCompare(b.disciplinaNome));
  }, [q.data, freq, regras]);

  return { boletim, carregando: q.isLoading, erro: (q.error as Error | null)?.message ?? null, recarregar: q.refetch };
}

/** Mantém a assinatura usada pelo useAlunoDados */
export const useMeuBoletim = (): ItemBoletim[] => useBoletimQuery().boletim;

// ---------- Requerimentos ----------
export interface RequerimentoAluno {
  id: string;
  titulo: string;
  protocolo: string;
  status: "Em Análise" | "Concluído" | "Indeferido";
  created_at: string;
}

export const TIPOS_REQUERIMENTO = [
  "Declaração de matrícula",
  "Histórico escolar",
  "Declaração de frequência",
  "Revisão de nota",
  "Trancamento de matrícula",
] as const;

export function useMeusRequerimentos() {
  const u = useAuthStore((s) => s.usuario);
  useRealtime("requerimentos", ["meus-req"]);
  return useQuery({
    queryKey: ["meus-req", u?.id],
    enabled: !!u,
    queryFn: async (): Promise<RequerimentoAluno[]> =>
      ok(
        await db
          .from("requerimentos")
          .select("id, titulo, protocolo, status, created_at")
          .eq("aluno_id", u!.id)
          .order("created_at", { ascending: false }),
      ) as unknown as RequerimentoAluno[],
  });
}

export function useNovoRequerimento() {
  const qc = useQueryClient();
  const u = useAuthStore((s) => s.usuario);
  return useMutation({
    mutationFn: async (titulo: string) => {
      const t = titulo.trim();
      if (t.length < 3 || t.length > 120) throw new Error("Escolha um tipo de requerimento.");
      const protocolo = `${new Date().getFullYear()}${Date.now().toString(36).toUpperCase().slice(-6)}`;
      return ok(
        await db.from("requerimentos").insert({ aluno_id: u!.id, titulo: t, protocolo, status: "Em Análise" }),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meus-req"] }),
  });
}

// ---------- PIN (sem mudanças) ----------
function interpretar(data: unknown): ResultadoConfirmacao {
  const r = ((typeof data === "string" ? JSON.parse(data) : data) ?? {}) as Record<string, unknown>;
  const s = String(r.status ?? r.resultado ?? (r.ok ? "ok" : (r.erro ?? "invalido"))).toLowerCase();
  if (s === "ok" || s === "sucesso") return "ok";
  if (s.includes("dupl") || s.includes("já") || s.includes("ja_")) return "duplicado";
  if (s.includes("expir")) return "expirado";
  return "invalido";
}

export function useConfirmarPresenca() {
  const qc = useQueryClient();
  return useCallback(
    async (pin: string): Promise<ResultadoConfirmacao> => {
      try {
        const r = interpretar(await rpcRegistrarPresenca(pin));
        if (r === "ok") qc.invalidateQueries({ queryKey: ["minha-freq"] });
        return r;
      } catch (e) {
        const m = String((e as Error)?.message ?? "").toLowerCase();
        if (m.includes("expir")) return "expirado";
        if (m.includes("dupl") || m.includes("já")) return "duplicado";
        if (m.includes("pin") || m.includes("turma")) return "invalido";
        return "erro";
      }
    },
    [qc],
  );
}
