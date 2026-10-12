import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI, type Content } from "@google/generative-ai";

const MODELOS = ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.5-flash-lite"];
const TIMEOUT_MS = 20000;
const MAX_MENSAGENS = 20;
const MAX_CARACTERES = 4000;

const SYSTEM_PROMPT = `
Você é o Alvi, o assistente pedagógico do Alvora. ☀️
Seu nome vem de "alvorada": você ajuda o conhecimento a amanhecer para alunos, professores e gestores.

Personalidade:
- Simpático, motivador e leve, com um toque de bom humor (sem exagerar).
- Claro e prático: respostas diretas, com exemplos e passos aplicáveis.
- Usa emojis com moderação (☀️📚✨).

Regras:
- Sempre responda em português do Brasil.
- Quando perguntarem quem você é, apresente-se como "Alvi, o assistente do Alvora".
- Ajude com estudos, planejamento de aulas, frequência, notas e uso da plataforma.
- Nunca solicite nem repita dados pessoais sensíveis (CPF, senhas, endereços, laudos).
- Se não souber algo específico da escola, diga com honestidade e sugira falar com a coordenação.
`.trim();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

type MsgEntrada = {
  role?: string;
  text?: string;
  content?: string;
  parts?: { text?: string }[];
};

type ErroApi = { status?: number; message?: string };

const textoDe = (m: MsgEntrada): string =>
  (m.text ?? m.content ?? m.parts?.map((p) => p.text ?? "").join("") ?? "").slice(0, MAX_CARACTERES);

const paraContent = (m: MsgEntrada): Content => ({
  role: m.role === "user" ? "user" : "model",
  parts: [{ text: textoDe(m) }],
});

function erroTemporario(e: unknown): boolean {
  const err = e as ErroApi;
  return (
    err?.status === 503 ||
    err?.status === 429 ||
    /high demand|overloaded|unavailable|timeout/i.test(err?.message || "")
  );
}

/** Desiste se o Gemini não responder a tempo */
function comTimeout<T>(p: Promise<T>, ms = TIMEOUT_MS): Promise<T> {
  let t: ReturnType<typeof setTimeout>;
  return Promise.race([
    p,
    new Promise<T>((_, rej) => {
      t = setTimeout(() => rej({ status: 503, message: "timeout" } as ErroApi), ms);
    }),
  ]).finally(() => clearTimeout(t));
}

// Aceita: { message }, { prompt }, { input }, { text } ou { messages: [...] }
function extrair(body: Record<string, unknown>) {
  const direto = (body.message ?? body.prompt ?? body.input ?? body.text) as string | undefined;

  let lista = (body.history ?? body.messages ?? []) as MsgEntrada[];
  if (!Array.isArray(lista)) lista = [];
  lista = lista.filter((m) => textoDe(m).trim()).slice(-MAX_MENSAGENS);

  if (typeof direto === "string" && direto.trim()) {
    return { message: direto.slice(0, MAX_CARACTERES), history: lista.map(paraContent) };
  }

  // Só o array: a última mensagem do usuário vira a pergunta
  const idx = lista.map((m) => m.role).lastIndexOf("user");
  if (idx === -1) return { message: "", history: [] as Content[] };

  return {
    message: textoDe(lista[idx]),
    history: lista.slice(0, idx).map(paraContent),
  };
}

async function gerarComFallback(history: Content[], message: string) {
  let ultimoErro: unknown;

  // Gemini exige que o histórico comece com "user"
  const inicio = history.findIndex((h) => h.role === "user");
  const hist = inicio === -1 ? [] : history.slice(inicio);

  for (const nome of MODELOS) {
    const model = genAI.getGenerativeModel({
      model: nome,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    });

    for (let i = 0; i < 2; i++) {
      try {
        const result = await comTimeout(model.startChat({ history: hist }).sendMessage(message));
        return { texto: result.response.text(), modelo: nome };
      } catch (e: unknown) {
        ultimoErro = e;
        // Só a mensagem de erro, nunca o conteúdo do usuário
        console.error(`[${nome}] tentativa ${i + 1}:`, (e as ErroApi)?.message);
        if (!erroTemporario(e)) break;
        await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
      }
    }
  }

  throw ultimoErro;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY não configurada" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { message, history } = extrair(body);

    if (!message.trim()) {
      return res.status(400).json({ error: "Mensagem vazia" });
    }

    const { texto, modelo } = await gerarComFallback(history, message);
    const resposta =
      texto?.trim() || "Ops, o Alvi deu uma cochilada 😴 Tente reformular a pergunta.";

    // O modal lê `data.reply`
    return res.status(200).json({ reply: resposta, model: modelo });
  } catch (e: unknown) {
    const err = e as ErroApi;
    const msg = err?.message || "Erro desconhecido";
    console.error("Falha final:", msg);
    return res.status(err?.status === 429 ? 429 : 500).json({
      error:
        msg === "timeout"
          ? "O Alvi demorou demais para pensar. Tente de novo 🙏"
          : err?.status === 429
            ? "Muitas perguntas seguidas. Aguarde um minutinho ☕"
            : "O Alvi não conseguiu responder agora. Tente novamente.",
    });
  }
}