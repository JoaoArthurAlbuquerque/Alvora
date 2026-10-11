import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  LifeBuoy,
  Mail,
  Copy,
  Send,
  KeyRound,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";
import { cn } from "../../core/lib/utils";
import { useAuthStore } from "../../core/auth/useAuthStore";
import { EMAIL_RE } from "../autenticacao/senha";

/** Defina VITE_SUPORTE_EMAIL no .env e na Vercel */
const SUPORTE =
  (import.meta.env.VITE_SUPORTE_EMAIL as string) || "suporte@alvora.app";
const ATUALIZADO = "11/10/2026";

const PRIVACIDADE: { t: string; c: React.ReactNode }[] = [
  {
    t: "Quais dados tratamos",
    c: "Nome, e-mail institucional, matrícula, perfil (aluno, professor ou gestor), turmas, frequência, notas, justificativas de falta, comprovantes enviados e requerimentos.",
  },
  {
    t: "Para quê",
    c: "Somente para a gestão acadêmica: registrar presença, lançar notas, acompanhar riscos de reprovação, analisar justificativas e atender requerimentos (LGPD, art. 7º, II e III).",
  },
  {
    t: "Quem acessa",
    c: "Cada aluno vê apenas os próprios dados. Professores veem as turmas que lecionam. A coordenação vê o necessário para a gestão. O controle é feito no banco de dados (Row Level Security), não só na tela.",
  },
  {
    t: "Comprovantes e arquivos",
    c: "Ficam em armazenamento privado. A abertura gera um link temporário de poucos minutos.",
  },
  {
    t: "Sessão e armazenamento local",
    c: "Usamos o armazenamento do navegador apenas para manter você conectado. Com “Manter conectado” desmarcado, a sessão termina ao fechar a aba. Não usamos cookies de publicidade.",
  },
  {
    t: "Registro de ações",
    c: "Alterações em turmas, matrículas e disciplinas ficam registradas na auditoria, com autor e data, para segurança e transparência.",
  },
  {
    t: "Seus direitos (LGPD, art. 18)",
    c: (
      <>
        Confirmar o tratamento, acessar, corrigir, pedir anonimização ou
        eliminação quando cabível, e revogar consentimentos. Para isso, escreva
        para{" "}
        <a
          className="text-primary font-semibold hover:underline"
          href={`mailto:${SUPORTE}?subject=LGPD`}
        >
          {SUPORTE}
        </a>
        .
      </>
    ),
  },
];

const FAQ = [
  {
    p: "Esqueci minha senha. E agora?",
    r: "Na tela de login, clique em “Esqueceu a senha?” e informe seu e-mail. O link chega em alguns minutos (confira o spam) e vale uma única vez.",
  },
  {
    p: "O PIN da chamada diz “inválido”.",
    r: "O PIN muda a cada chamada e expira em poucos minutos. Confira os dígitos e se você está matriculado na turma. Se persistir, avise o professor.",
  },
  {
    p: "Minha falta não foi abonada.",
    r: "A justificativa precisa ser aprovada pela coordenação. Acompanhe o status em Frequência › Minhas justificativas.",
  },
  {
    p: "Minha nota não aparece.",
    r: "As notas aparecem assim que o professor as lança. Se algo estiver errado, peça “Revisão de nota” na Secretaria.",
  },
  {
    p: "Entrei com o perfil errado.",
    r: "Selecione Aluno, Professor ou Gestor antes de entrar. O perfil precisa ser o mesmo da sua conta.",
  },
];

const campo =
  "w-full h-10 px-3 rounded-xl bg-white border border-primary/15 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40";

const Contato: React.FC = () => {
  const usuario = useAuthStore((s) => s.usuario);
  const [f, setF] = useState({
    nome: usuario?.nome ?? "",
    email: usuario?.email ?? "",
    assunto: "Dúvida",
    msg: "",
  });
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (f.nome.trim().length < 2) return setErro("Informe seu nome.");
    if (!EMAIL_RE.test(f.email.trim()))
      return setErro("Informe um e-mail válido para resposta.");
    if (f.msg.trim().length < 10)
      return setErro("Descreva o problema (mínimo de 10 caracteres).");
    setErro(null);
    const corpo = `${f.msg.trim()}\n\n—\nNome: ${f.nome.trim()}\nE-mail: ${f.email.trim()}\nPerfil: ${usuario?.papel ?? "não conectado"}\nPágina: ${document.referrer || location.href}`;
    window.location.href = `mailto:${SUPORTE}?subject=${encodeURIComponent(`[Alvora] ${f.assunto}`)}&body=${encodeURIComponent(corpo)}`;
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(SUPORTE);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setErro(`Não foi possível copiar. O e-mail é ${SUPORTE}`);
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <IconBubble icone={Mail} cor="cyan" tamanho="sm" />
        <h2 className="flex-1 text-lg font-extrabold text-ink">
          Fale com o suporte
        </h2>
        <Button
          size="sm"
          variant="outline"
          icon={<Copy size={14} />}
          onClick={copiar}
        >
          {copiado ? "Copiado ✓" : SUPORTE}
        </Button>
      </div>
      <form onSubmit={enviar} noValidate className="grid sm:grid-cols-2 gap-3">
        <label className="text-xs font-bold text-slate-500 space-y-1.5">
          Nome
          <input
            className={campo}
            value={f.nome}
            maxLength={120}
            onChange={(e) => setF({ ...f, nome: e.target.value })}
          />
        </label>
        <label className="text-xs font-bold text-slate-500 space-y-1.5">
          E-mail para resposta
          <input
            type="email"
            className={campo}
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
          />
        </label>
        <label className="sm:col-span-2 text-xs font-bold text-slate-500 space-y-1.5">
          Assunto
          <select
            className={campo}
            value={f.assunto}
            onChange={(e) => setF({ ...f, assunto: e.target.value })}
          >
            {[
              "Dúvida",
              "Problema de acesso",
              "Erro no sistema",
              "Privacidade / LGPD",
              "Sugestão",
            ].map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>
        <label className="sm:col-span-2 text-xs font-bold text-slate-500 space-y-1.5">
          Mensagem
          <textarea
            rows={4}
            maxLength={2000}
            className={cn(campo, "h-auto py-2 resize-none")}
            value={f.msg}
            onChange={(e) => setF({ ...f, msg: e.target.value })}
            placeholder="Conte o que aconteceu e em qual tela…"
          />
        </label>
        {erro && (
          <p
            role="alert"
            className="sm:col-span-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-xl"
          >
            {erro}
          </p>
        )}
        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            Abre seu aplicativo de e-mail com a mensagem pronta.
          </p>
          <Button type="submit" icon={<Send size={15} />}>
            Enviar mensagem
          </Button>
        </div>
      </form>
    </Card>
  );
};

export const PrivacidadeSuportePage: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const usuario = useAuthStore((s) => s.usuario);
  const suporte = pathname.startsWith("/suporte");
  const voltar = usuario ? `/${usuario.papel}` : "/login";

  const aba = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-2 px-4 h-10 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
      isActive
        ? "bg-brand text-white shadow-glow"
        : "text-slate-500 hover:bg-primary/5 hover:text-primary",
    );

  return (
    <main className="min-h-screen bg-slate-50/60 px-4 sm:px-6 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between gap-3">
          <img src="/alvora_blue.svg" alt="Alvora" className="h-8" />
          <Button
            size="sm"
            variant="ghost"
            icon={<ArrowLeft size={14} />}
            onClick={() => navigate(voltar)}
          >
            {usuario ? "Voltar ao painel" : "Voltar ao login"}
          </Button>
        </header>

        <nav
          aria-label="Seções"
          className="flex gap-1.5 p-1.5 rounded-2xl bg-white shadow-flat w-fit"
        >
          <NavLink to="/privacidade" className={aba}>
            <ShieldCheck size={15} /> Privacidade
          </NavLink>
          <NavLink to="/suporte" className={aba}>
            <LifeBuoy size={15} /> Suporte
          </NavLink>
        </nav>

        {suporte ? (
          <div key="s" className="space-y-6 animate-fade-up">
            <div>
              <h1 className="text-2xl font-extrabold text-ink">
                Como podemos ajudar? 🛟
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Veja as dúvidas comuns ou fale direto com a gente.
              </p>
            </div>
            <Link
              to="/login?recuperar=1"
              className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-primary/10 hover:border-primary/30 transition"
            >
              <IconBubble icone={KeyRound} cor="primary" tamanho="sm" />
              <span className="flex-1 text-sm font-bold text-ink">
                Recuperar minha senha
              </span>
              <span className="text-xs font-bold text-primary">Abrir →</span>
            </Link>
            <Card className="space-y-2">
              <h2 className="text-lg font-extrabold text-ink mb-2">
                Perguntas frequentes
              </h2>
              {FAQ.map((q) => (
                <details
                  key={q.p}
                  className="group rounded-xl bg-slate-50 open:bg-primary/5"
                >
                  <summary className="cursor-pointer list-none flex justify-between gap-3 p-3 text-sm font-bold text-ink rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25">
                    {q.p}
                    <span
                      aria-hidden
                      className="text-primary transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-3 pb-3 text-sm text-slate-600">{q.r}</p>
                </details>
              ))}
            </Card>
            <Contato />
          </div>
        ) : (
          <div key="p" className="space-y-6 animate-fade-up">
            <div>
              <h1 className="text-2xl font-extrabold text-ink">
                Política de privacidade 🔒
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Como a Alvora cuida dos seus dados · atualizado em {ATUALIZADO}
              </p>
            </div>
            <Card className="space-y-5">
              {PRIVACIDADE.map((s, i) => (
                <section
                  key={s.t}
                  aria-labelledby={`p-${i}`}
                  className="space-y-1"
                >
                  <h2 id={`p-${i}`} className="text-sm font-extrabold text-ink">
                    {i + 1}. {s.t}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {s.c}
                  </p>
                </section>
              ))}
            </Card>
            <p className="text-xs text-slate-500">
              Dúvidas sobre seus dados?{" "}
              <Link
                to="/suporte"
                className="text-primary font-semibold hover:underline"
              >
                Fale com o suporte
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </main>
  );
};
