import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Modal } from "../../core/ui/Modal";
import { Button } from "../../core/ui/Button";
import { cn } from "../../core/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR = "/alvi.png"; // public/alvi.png

const SAUDACAO: Message = {
  role: "assistant",
  content:
    "Oi, eu sou o Alvi! ☀️ Seu parceiro pedagógico no Alvora. Bora planejar, estudar ou tirar uma dúvida? (Evite enviar dados pessoais de alunos.)",
};

const SUGESTOES = [
  "Ideias para uma aula dinâmica 💡",
  "Como recuperar um aluno com muitas faltas?",
  "Monte um plano de estudos para a AV2 📚",
];

/** Avatar do Alvi com reserva caso a imagem não carregue */
const AvatarAlvi: React.FC<{ tamanho?: "sm" | "md" }> = ({
  tamanho = "sm",
}) => {
  const [falhou, setFalhou] = useState(false);
  const cls = tamanho === "md" ? "w-11 h-11" : "w-8 h-8";
  return falhou ? (
    <span
      aria-hidden
      className={cn(
        cls,
        "shrink-0 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center",
      )}
    >
      A
    </span>
  ) : (
    <img
      src={AVATAR}
      alt=""
      aria-hidden
      onError={() => setFalhou(true)}
      className={cn(
        cls,
        "shrink-0 rounded-full bg-white object-cover ring-2 ring-primary/15",
      )}
    />
  );
};

export const AssistentePedagogicoModal: React.FC<Props> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([SAUDACAO]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);

  // Rola para a última mensagem
  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const enviar = async (texto: string) => {
    const t = texto.trim();
    if (!t || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: t }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Sem a saudação inicial
        body: JSON.stringify({ messages: newMessages.slice(1) }),
      });
      const data = (await r.json().catch(() => ({}))) as {
        reply?: string;
        error?: string;
      };
      const resposta =
        r.ok && data.reply
          ? data.reply
          : `⚠️ ${data.error ?? "Erro ao responder."}`;
      setMessages((m) => [...m, { role: "assistant", content: resposta }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "⚠️ Sem conexão com o servidor. Tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    enviar(input);
  };

  const soSaudacao = messages.length === 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Alvi · Assistente Pedagógico"
    >
      <div className="flex flex-col gap-4">
        {/* Apresentação */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary/5">
          <AvatarAlvi tamanho="md" />
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-ink">Alvi</p>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full bg-emerald-500"
                aria-hidden
              />
              {loading ? "Digitando…" : "Online · pronto para ajudar"}
            </p>
          </div>
        </div>

        <div
          className="max-h-[50vh] overflow-y-auto space-y-3 pr-1"
          aria-live="polite"
        >
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md bg-brand text-white text-sm whitespace-pre-wrap">
                  {m.content}
                </p>
              </div>
            ) : (
              <div key={i} className="flex items-end gap-2 justify-start">
                <AvatarAlvi />
                <p className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-bl-md bg-slate-100 text-ink text-sm whitespace-pre-wrap">
                  {m.content}
                </p>
              </div>
            ),
          )}

          {loading && (
            <div className="flex items-end gap-2 justify-start">
              <AvatarAlvi />
              <p
                className="px-4 py-3 rounded-2xl rounded-bl-md bg-slate-100 flex gap-1"
                aria-label="Alvi está digitando"
              >
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: `${d * 150}ms` }}
                  />
                ))}
              </p>
            </div>
          )}

          {soSaudacao && !loading && (
            <div className="flex flex-wrap gap-2 pl-10">
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => enviar(s)}
                  className="px-3 h-8 rounded-full text-xs font-semibold text-primary bg-white border border-primary/20 cursor-pointer hover:bg-primary/5 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div ref={fimRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            autoFocus
            value={input}
            maxLength={4000}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte ao Alvi…"
            aria-label="Sua pergunta para o Alvi"
            disabled={loading}
            className="flex-1 h-10 px-4 rounded-full border border-primary/15 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 disabled:opacity-60"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            icon={<Send size={15} />}
            aria-label="Enviar"
          />
        </form>
      </div>
    </Modal>
  );
};
