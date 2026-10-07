// src/services/regrasService.ts
import type { RegraFrequencia } from "../types";
import { gravar, ler } from "./storage";
import {
  REGRAS,
  REGRAS_PADRAO,
  aplicarRegras,
  normalizarRegras,
} from "../config/regras";
import { supabase } from "../lib/supabase";
import type { Json } from "../types/database";

const LINHA_ID = 1;

/** Completa campos faltando com os padrões (protege contra JSON antigo/incompleto). */
const mesclar = (r?: Partial<RegraFrequencia> | null): RegraFrequencia => ({
  ...REGRAS_PADRAO,
  ...(r ?? {}),
  pesosAvaliacoes: r?.pesosAvaliacoes ?? REGRAS_PADRAO.pesosAvaliacoes,
});

/** Aplica em memória (avisa os useRegras) e atualiza o cache local. */
function aplicarLocal(r?: Partial<RegraFrequencia> | null) {
  const novas = normalizarRegras(mesclar(r));
  if (JSON.stringify(novas) === JSON.stringify(REGRAS)) return; // evita re-render à toa
  aplicarRegras(novas);
  gravar("regras", REGRAS);
}

// 1) Início imediato com o cache local (tela não "pisca" com o padrão)
aplicarRegras(mesclar(ler("regras", REGRAS_PADRAO)));

// 2) Busca a versão oficial no banco
async function carregarDoBanco() {
  const { data, error } = await supabase
    .from("regras")
    .select("dados")
    .eq("id", LINHA_ID)
    .maybeSingle();
  if (error || !data) return; // offline ou sem sessão: fica com o cache
  aplicarLocal(data.dados as Partial<RegraFrequencia>);
}

if (typeof window !== "undefined") {
  carregarDoBanco();

  let canal: ReturnType<typeof supabase.channel> | null = null;

  // 3) Realtime: (re)cria o canal com o token do usuário logado
  function iniciarCanal() {
    if (canal) supabase.removeChannel(canal);
    canal = supabase
      .channel("alvora:regras")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "regras",
          filter: `id=eq.${LINHA_ID}`,
        },
        (payload) => {
          const novo = payload.new as { dados?: Partial<RegraFrequencia> } | null;
          if (novo?.dados) aplicarLocal(novo.dados);
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("[regras] realtime:", status); // só avisa se der problema
        }
      });
  }

  iniciarCanal();

  let usuarioAtual: string | null = null;

  // 4) Login/logout: atualiza token do Realtime e só recria o canal se o usuário mudar
  //    (o Supabase dispara SIGNED_IN de novo quando a aba volta ao foco)
  const { data: auth } = supabase.auth.onAuthStateChange((evento, sessao) => {
    if (evento === "SIGNED_IN" || evento === "TOKEN_REFRESHED") {
      supabase.realtime.setAuth(sessao?.access_token ?? null);

      const id = sessao?.user?.id ?? null;
      if (id !== usuarioAtual) {
        usuarioAtual = id;
        carregarDoBanco();
        iniciarCanal();
      }
    }
    if (evento === "SIGNED_OUT") {
      usuarioAtual = null;
      aplicarRegras(normalizarRegras(REGRAS_PADRAO));
      gravar("regras", REGRAS_PADRAO);
    }
  });

  // 5) HMR do Vite: evita canais e listeners duplicados
  import.meta.hot?.dispose(() => {
    if (canal) supabase.removeChannel(canal);
    auth.subscription.unsubscribe();
  });
}

export function validarRegras(r: RegraFrequencia): string[] {
  const erros: string[] = [];
  if (r.frequenciaMinima < 1 || r.frequenciaMinima > 100) erros.push("Frequência mínima deve estar entre 1 e 100%.");
  if (r.mediaMinima < 0 || r.mediaMinima > 10) erros.push("Média mínima deve estar entre 0 e 10.");
  if (Object.values(r.pesosAvaliacoes).some((p) => p <= 0)) erros.push("Todos os pesos devem ser maiores que zero.");
  if (r.validadePinMinutos < 1 || r.validadePinMinutos > 60) erros.push("Validade do PIN: de 1 a 60 minutos.");
  if (r.digitosPin < 4 || r.digitosPin > 8) erros.push("O PIN deve ter de 4 a 8 dígitos.");
  if (r.prazoJustificativaDias < 1 || r.prazoJustificativaDias > 30) erros.push("Prazo de justificativa: de 1 a 30 dias.");
  return erros;
}

export const regrasService = {
  obter: (): RegraFrequencia => REGRAS,

  /** Salva no banco (só gestor, via RLS) e aplica localmente. */
  salvar: async (r: RegraFrequencia): Promise<void> => {
    const dados = normalizarRegras(r);
    const erros = validarRegras(dados);
    if (erros.length) throw new Error(erros.join(" "));

    const { error } = await supabase.from("regras").upsert({
      id: LINHA_ID,
      dados: dados as unknown as Json,
      atualizado_em: new Date().toISOString(),
    });
    if (error) throw new Error(`Falha ao salvar regras: ${error.message}`);

    aplicarLocal(dados);
  },

  restaurarPadrao: () => regrasService.salvar(REGRAS_PADRAO),

  /** Força uma nova leitura do banco (ex.: botão "sincronizar"). */
  recarregar: carregarDoBanco,
};

/** Fonte única do hook */
export { useRegras } from "../config/regras";
