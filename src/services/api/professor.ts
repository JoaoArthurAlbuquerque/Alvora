// =====================================================================
// src/services/api/professor.ts  (NOVO): dados reais da área do professor
// =====================================================================
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/core/auth/useAuthStore";
import { ok, useRealtime } from "@/services/api/realtime";
import type { StatusPresenca } from "@/types";

/** Chama a RPC gerar_pin direto (sem depender de frequencia.ts) */
async function gerarPin(
  td: string,
  minutos: number,
): Promise<{ pin: string; expira_em: string } | null> {
  const { data, error } = await supabase.rpc(
    "gerar_pin" as never,
    { p_turma_disciplina_id: td, p_minutos: minutos } as never,
  );
  if (error) throw new Error(error.message);
  const r = (data as unknown as { pin: string; expira_em: string }[] | null)?.[0];
  return r ?? null;
}

/** Data de hoje no fuso de Recife (mesmo fuso usado pelo gerar_pin) */
export const hojeRecife = () =>
  new Date().toLocaleDateString("sv-SE", { timeZone: "America/Fortaleza" });

/** ABONADA é gravado pelo trigger aplicar_abono (justificativa aprovada) */
export type StatusBanco = StatusPresenca | "ABONADA";

const CONTA_PRESENCA: StatusBanco[] = ["PRESENTE_PIN", "PRESENTE_MANUAL", "ABONADA"];
const round1 = (n: number) => Math.round(n * 10) / 10;

export interface ResumoAluno {
  id: string;
  nome: string;
  totalAulas: number;
  presencas: number;
  faltas: number;
  faltasAbonadas: number;
  percentualFrequencia: number;
  percentualFaltas: number;
}

interface LinhaFreq {
  aluno_id: string;
  data: string;
  status: string;
}

interface LinhaRpc {
  aluno_id: string;
  nome: string;
  total_aulas: number | string;
  presencas: number | string;
  percentual: number | string;
}

/** Frequência da sala: RPC frequencia_turma + linhas do dia */
export function useFrequenciaSala(td?: string) {
  useRealtime("frequencias", ["prof-freq", td]);
  return useQuery({
    queryKey: ["prof-freq", td],
    enabled: !!td,
    queryFn: async () => {
      const [resumo, linhas] = await Promise.all([
        supabase.rpc("frequencia_turma", { p_td: td as string }),
        supabase
          .from("frequencias")
          .select("aluno_id, data, status")
          .eq("turma_disciplina_id", td as string),
      ]);
      const r = ok(resumo) as unknown as LinhaRpc[];
      const l = ok(linhas) as unknown as LinhaFreq[];

      const hoje = hojeRecife();
      const statusHoje: Record<string, StatusBanco> = {};
      const datas = new Set<string>();
      l.forEach((x) => {
        datas.add(x.data);
        if (x.data === hoje) statusHoje[x.aluno_id] = x.status as StatusBanco;
      });

      const alunos: ResumoAluno[] = r.map((a) => {
        const total = Number(a.total_aulas);
        const presencas = Number(a.presencas);
        const faltas = Math.max(total - presencas, 0);
        return {
          id: a.aluno_id,
          nome: a.nome,
          totalAulas: total,
          presencas,
          faltas,
          faltasAbonadas: l.filter((x) => x.aluno_id === a.aluno_id && x.status === "ABONADA").length,
          percentualFrequencia: Number(a.percentual),
          percentualFaltas: total ? round1((100 * faltas) / total) : 0,
        };
      });

      const mediaFrequencia = alunos.length
        ? round1(alunos.reduce((s, a) => s + a.percentualFrequencia, 0) / alunos.length)
        : 100;

      return {
        alunos,
        statusHoje,
        mediaFrequencia,
        diasRegistrados: datas.size,
        diarioHojeSalvo: Object.keys(statusHoje).length > 0,
      };
    },
  });
}

/** Grava o diário do dia em `frequencias` (fonte única do percentual) */
export function useSalvarDiario(td: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (statusPorAluno: Record<string, StatusBanco>) => {
      const data = hojeRecife();
      const linhas = Object.entries(statusPorAluno).map(([aluno_id, status]) => ({
        turma_disciplina_id: td,
        aluno_id,
        data,
        status,
        presente: CONTA_PRESENCA.includes(status),
      }));
      ok(
        await supabase
          .from("frequencias")
          .upsert(linhas, { onConflict: "turma_disciplina_id,aluno_id,data" }),
      );
      return linhas.length;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prof-freq", td] }),
  });
}

// ---------- Chamada por PIN ----------
export interface PinAtivo {
  pin: string;
  expiraEm: number;
}

export function usePinAtivo(td?: string) {
  return useQuery({
    queryKey: ["pin-ativo", td],
    enabled: !!td,
    refetchInterval: 15_000,
    queryFn: async (): Promise<PinAtivo | null> => {
      const r = ok(
        await supabase
          .from("aula_pins")
          .select("pin, expira_em")
          .eq("turma_disciplina_id", td as string)
          .gt("expira_em", new Date().toISOString())
          .order("expira_em", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ) as unknown as { pin: string; expira_em: string } | null;
      return r ? { pin: r.pin, expiraEm: new Date(r.expira_em).getTime() } : null;
    },
  });
}

/** Alunos que confirmaram via PIN hoje (substitui o chamadaId local) */
export function usePresentesPin(td?: string, aoVivo = false) {
  return useQuery({
    queryKey: ["pin-presentes", td],
    enabled: !!td,
    refetchInterval: aoVivo ? 3000 : false,
    queryFn: async (): Promise<string[]> => {
      const r = ok(
        await supabase
          .from("frequencias")
          .select("aluno_id")
          .eq("turma_disciplina_id", td as string)
          .eq("data", hojeRecife())
          .eq("status", "PRESENTE_PIN"),
      ) as unknown as { aluno_id: string }[];
      return r.map((x) => x.aluno_id);
    },
  });
}

export function useAbrirChamada(td: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (minutos: number) => {
      const r = await gerarPin(td, minutos);
      if (!r) throw new Error("Não foi possível gerar o PIN.");
      return r;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pin-ativo", td] }),
  });
}

export function useEncerrarChamada(td: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const agora = new Date().toISOString();
      ok(
        await supabase
          .from("aula_pins")
          .update({ expira_em: agora })
          .eq("turma_disciplina_id", td)
          .gt("expira_em", agora),
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pin-ativo", td] });
      qc.invalidateQueries({ queryKey: ["pin-presentes", td] });
    },
  });
}

// ---------- Notas ----------
export const AVALIACOES = ["AV1", "AV2"] as const;
export type Avaliacao = (typeof AVALIACOES)[number];
export type NotasAluno = Partial<Record<Avaliacao, number | null>>;

export function useNotasSala(td?: string) {
  useRealtime("notas", ["prof-notas", td]);
  return useQuery({
    queryKey: ["prof-notas", td],
    enabled: !!td,
    queryFn: async (): Promise<Record<string, NotasAluno>> => {
      const r = ok(
        await supabase
          .from("notas")
          .select("aluno_id, avaliacao, valor")
          .eq("turma_disciplina_id", td as string),
      ) as unknown as { aluno_id: string; avaliacao: string; valor: number | null }[];
      const mapa: Record<string, NotasAluno> = {};
      r.forEach((n) => {
        (mapa[n.aluno_id] ??= {})[n.avaliacao as Avaliacao] =
          n.valor === null ? null : Number(n.valor);
      });
      return mapa;
    },
  });
}

/** Média ponderada pelas regras do gestor (peso 1 quando não houver) */
export function calcularMedia(
  n: NotasAluno | undefined,
  pesos?: Record<string, number>,
): number | null {
  let soma = 0;
  let total = 0;
  AVALIACOES.forEach((av) => {
    const v = n?.[av];
    if (v == null) return;
    const p = pesos?.[av] ?? pesos?.[av.toLowerCase()] ?? 1;
    soma += v * p;
    total += p;
  });
  return total ? round1(soma / total) : null;
}

export function useSalvarNota(td: string) {
  const qc = useQueryClient();
  const u = useAuthStore((s) => s.usuario);
  return useMutation({
    mutationFn: async (p: { alunoId: string; avaliacao: Avaliacao; valor: number | null }) => {
      if (p.valor !== null && (p.valor < 0 || p.valor > 10))
        throw new Error("A nota deve estar entre 0 e 10.");
      ok(
        await supabase.from("notas").upsert(
          {
            turma_disciplina_id: td,
            aluno_id: p.alunoId,
            avaliacao: p.avaliacao,
            valor: p.valor,
            lancado_por: u?.id ?? null,
          },
          { onConflict: "turma_disciplina_id,aluno_id,avaliacao" },
        ),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prof-notas", td] }),
  });
}

// ---------- Materiais (tabela `materiais` + Storage) ----------
export const BUCKET_MATERIAIS = "materiais";

export interface Material {
  id: string;
  titulo: string;
  descricao: string | null;
  arquivo_url: string | null; // caminho no bucket
  created_at: string | null;
}

export function useMateriais(td?: string) {
  useRealtime("materiais", ["materiais", td]);
  return useQuery({
    queryKey: ["materiais", td],
    enabled: !!td,
    queryFn: async (): Promise<Material[]> =>
      ok(
        await supabase
          .from("materiais")
          .select("id, titulo, descricao, arquivo_url, created_at")
          .eq("turma_disciplina_id", td as string)
          .order("created_at", { ascending: false }),
      ) as unknown as Material[],
  });
}

export function useEnviarMaterial(td: string) {
  const qc = useQueryClient();
  const u = useAuthStore((s) => s.usuario);
  return useMutation({
    mutationFn: async (arquivo: File) => {
      const nome = arquivo.name.normalize("NFD").replace(/[^\w.-]+/g, "_");
      const caminho = `${td}/${Date.now()}-${nome}`;
      const up = await supabase.storage.from(BUCKET_MATERIAIS).upload(caminho, arquivo);
      if (up.error) throw new Error(`Falha no upload: ${up.error.message}`);
      ok(
        await supabase.from("materiais").insert({
          turma_disciplina_id: td,
          titulo: arquivo.name,
          arquivo_url: caminho,
          created_by: u?.id ?? null,
        }),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["materiais", td] }),
  });
}

export function useExcluirMaterial(td: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (m: Material) => {
      ok(await supabase.from("materiais").delete().eq("id", m.id));
      if (m.arquivo_url) await supabase.storage.from(BUCKET_MATERIAIS).remove([m.arquivo_url]);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["materiais", td] }),
  });
}

export async function abrirMaterial(caminho: string) {
  if (/^https?:\/\//.test(caminho)) return window.open(caminho, "_blank");
  const { data, error } = await supabase.storage
    .from(BUCKET_MATERIAIS)
    .createSignedUrl(caminho, 60);
  if (error) throw error;
  window.open(data.signedUrl, "_blank");
}