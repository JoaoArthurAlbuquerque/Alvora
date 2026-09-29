import type { RegraFrequencia } from "../types";
import { gravar, ler } from "./storage";
import {
  REGRAS,
  REGRAS_PADRAO,
  aplicarRegras,
  normalizarRegras,
} from "../config/regras";
import { supabase } from "../lib/supabase";

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
  aplicarLocal(data.dados as RegraFrequencia);
}

if (typeof window !== "undefined") {
  carregarDoBanco();

  // 3) Recarrega ao logar (antes do login a RLS bloqueia a leitura)
  supabase.auth.onAuthStateChange((evento) => {
    if (evento === "SIGNED_IN" || evento === "TOKEN_REFRESHED") carregarDoBanco();
  });

  // 4) Realtime: o gestor salvou → todos os aparelhos atualizam na hora
  supabase
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
        const novo = payload.new as { dados?: RegraFrequencia } | null;
        if (novo?.dados) aplicarLocal(novo.dados);
      },
    )
    .subscribe();
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
    const erros = validarRegras(r);
    if (erros.length) throw new Error(erros.join(" "));

    const dados = normalizarRegras(r);
    const { error } = await supabase.from("regras").upsert({
      id: LINHA_ID,
      dados,
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
