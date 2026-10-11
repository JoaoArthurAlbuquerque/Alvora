// src/modules/autenticacao/LoginPage.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  useNavigate,
  Navigate,
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  BarChart3,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "../../core/auth/useAuthStore";
import { Button } from "../../core/ui/Button";
import { cn } from "../../core/lib/utils";
import { lembrarSessao } from "../../lib/authStorage";
import { RecuperarSenhaModal } from "./RecuperarSenhaModal";

/** Arquivos em /public (o nome diferencia maiúsculas na Vercel) */
const VIDEOS = [
  "/aula.mp4",
  "/aula2.mp4",
  "/aula3.mp4",
  "/aula4.mp4",
  "/aula5.mp4",
];

type Role = "aluno" | "professor" | "gestor";

const ROLES: { id: Role; label: string; icone: typeof GraduationCap }[] = [
  { id: "aluno", label: "Aluno", icone: GraduationCap },
  { id: "professor", label: "Professor", icone: BookOpen },
  { id: "gestor", label: "Gestor", icone: BarChart3 },
];

const ERROS: Record<string, string> = {
  "Invalid login credentials": "E-mail ou senha incorretos.",
  "Email not confirmed": "Confirme seu e-mail antes de entrar.",
};

const inputCls =
  "w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-ink placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition";

export const LoginPage: React.FC = () => {
  const [role, setRole] = useState<Role>("aluno");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [ver, setVer] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [lembrar, setLembrar] = useState(lembrarSessao);
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const [recuperando, setRecuperando] = useState(
    () => params.get("recuperar") === "1",
  );
  const aviso = (location.state as { aviso?: string } | null)?.aviso ?? null;
  const fecharRecuperar = () => {
    setRecuperando(false);
    if (params.has("recuperar")) setParams({}, { replace: true });
  };
  // Vídeos: alternam com crossfade; pulam os que falharem; ficam parados com "reduzir movimento"
  const [atual, setAtual] = useState(0);
  const [falhas, setFalhas] = useState<Set<number>>(() => new Set());
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [reduzMovimento] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const { usuario, login, logout } = useAuthStore();
  const navigate = useNavigate();

  /** Próximo vídeo válido depois de i (em loop) */
  const proximo = (i: number) => {
    for (let k = 1; k <= VIDEOS.length; k++) {
      const j = (i + k) % VIDEOS.length;
      if (!falhas.has(j)) return j;
    }
    return i;
  };

  const avancar = (i: number) => {
    const n = proximo(i);
    if (n === i)
      refs.current[i]?.play().catch(() => {}); // só sobrou um: repete
    else setAtual(n);
  };

  // Ao trocar, o vídeo ativo começa do início
  useEffect(() => {
    if (reduzMovimento) return;
    const v = refs.current[atual];
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [atual, reduzMovimento]);

  if (usuario) return <Navigate to={`/${usuario.papel}`} replace />;

  const idx = ROLES.findIndex((r) => r.id === role);

  const trocarRole = (r: Role) => {
    setRole(r);
    setErro(null);
  };

  const entrar = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email || !senha) return setErro("Preencha e-mail e senha.");

    setCarregando(true);
    setErro(null);

    const msg = await login(email.trim(), senha, lembrar);
    if (msg) {
      setCarregando(false);
      return setErro(ERROS[msg] ?? msg);
    }

    const papel = useAuthStore.getState().usuario?.papel;
    if (papel !== role) {
      await logout();
      setCarregando(false);
      return setErro(
        `Esta conta não é de ${ROLES[idx].label}. Selecione o perfil correto.`,
      );
    }

    navigate(`/${papel}`, { replace: true });
  };

  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2 bg-white">
      {/* ESQUERDA: gradiente como reserva + vídeo por cima */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-brand p-12 text-white">
        {VIDEOS.map((src, i) =>
          falhas.has(i) ? null : (
            <video
              key={src}
              ref={(el) => {
                refs.current[i] = el;
              }}
              aria-hidden
              src={src}
              muted
              playsInline
              preload={i === atual || i === proximo(atual) ? "auto" : "none"}
              onEnded={() => i === atual && avancar(i)}
              onError={() => {
                setFalhas((s) => new Set(s).add(i));
                if (i === atual) setAtual(proximo(i));
              }}
              className={cn(
                "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
                i === atual ? "opacity-100" : "opacity-0",
              )}
            />
          ),
        )}

        {/* Camada da marca: deixa o texto legível sobre o vídeo */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/80 via-primary-hover/65 to-[#6d5bff]/75" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/50 via-transparent to-ink/20" />

        <img
          src="/alvora_blue.svg"
          alt="Alvora"
          className="relative h-9 w-fit brightness-0 invert animate-fade-up"
        />

        <div className="relative space-y-8">
          <div className="max-w-md space-y-4 animate-fade-up">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur">
              Plataforma educacional
            </span>
            <h2 className="text-4xl font-extrabold leading-tight drop-shadow-sm">
              Onde a escola inteira se encontra, da chamada ao boletim.
            </h2>
          </div>

          <div className="flex gap-4 stagger">
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 animate-float">
              <TrendingUp size={18} className="mb-2" />
              <p className="text-2xl font-extrabold tabular">92%</p>
              <p className="text-[11px] text-white/80">Frequência média</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 animate-float [animation-delay:0.8s] mt-6">
              <CheckCircle2 size={18} className="mb-2" />
              <p className="text-2xl font-extrabold tabular">1.2k</p>
              <p className="text-[11px] text-white/80">Chamadas no mês</p>
            </div>
          </div>
        </div>

        <p className="relative text-sm text-white/70">
          © {new Date().getFullYear()} Alvora
        </p>
      </aside>

      {/* DIREITA */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm stagger">
          <img
            src="/alvora_blue.svg"
            alt="Alvora"
            className="mb-10 h-8 lg:hidden"
          />

          <div className="animate-fade-up">
            <h1 className="text-3xl font-extrabold text-ink">
              Bem-vindo de volta
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Entre com seu e-mail institucional para continuar.
            </p>
          </div>

          <form onSubmit={entrar} className="mt-8 space-y-5 animate-fade-up">
            {/* seletor de perfil */}
            <div>
              <span className="mb-2 block text-sm font-semibold text-ink">
                Entrar como
              </span>
              <div className="relative grid grid-cols-3 p-1 rounded-2xl bg-slate-100">
                <div
                  className="absolute top-1 bottom-1 left-1 rounded-xl bg-brand shadow-glow transition-transform duration-300 ease-out"
                  style={{
                    width: "calc((100% - 0.5rem) / 3)",
                    transform: `translateX(${idx * 100}%)`,
                  }}
                />
                {ROLES.map(({ id, label, icone: I }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={role === id}
                    onClick={() => trocarRole(id)}
                    className={cn(
                      "relative z-10 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors",
                      role === id
                        ? "text-white"
                        : "text-slate-500 hover:text-primary",
                    )}
                  >
                    <I
                      size={18}
                      className={cn(
                        "transition-transform",
                        role === id && "scale-110",
                      )}
                    />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* e-mail */}
            <label className="block text-sm font-semibold text-ink">
              E-mail institucional
              <div className="relative mt-1.5">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@escola.edu.br"
                  className={inputCls}
                />
              </div>
            </label>

            {/* senha */}
            <div>
              <label
                htmlFor="senha"
                className="mb-1.5 block text-sm font-semibold text-ink"
              >
                Senha
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="senha"
                  type={ver ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className={cn(inputCls, "pr-11")}
                />
                <button
                  type="button"
                  onClick={() => setVer((v) => !v)}
                  aria-label={ver ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 cursor-pointer hover:text-primary hover:bg-primary/5 transition"
                >
                  {ver ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setRecuperando(true)}
                  className="text-xs font-semibold text-primary hover:underline rounded cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
                >
                  Esqueceu a senha?
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
                className="h-4 w-4 rounded accent-primary"
              />
              Manter conectado
              <span className="text-[11px] text-slate-400">
                {lembrar ? "(neste dispositivo)" : "(só nesta aba)"}
              </span>
            </label>

            {aviso && !erro && (
              <p
                role="status"
                className="flex items-start gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-xl px-3.5 py-2.5 animate-fade-in"
              >
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                {aviso}
              </p>
            )}

            {erro && (
              <p
                key={erro}
                role="alert"
                className="flex items-start gap-2 text-sm text-rose-600 bg-rose-50 rounded-xl px-3.5 py-2.5 animate-shake"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {erro}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={carregando}
              className="w-full group"
              icon={
                carregando ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : undefined
              }
            >
              {carregando ? (
                "Entrando…"
              ) : (
                <span className="flex items-center gap-2">
                  Entrar como {ROLES[idx].label}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-10 text-xs text-slate-400 animate-fade-up">
            <Link to="/privacidade" className="hover:text-primary transition">
              Privacidade
            </Link>{" "}
            ·{" "}
            <Link to="/suporte" className="hover:text-primary transition">
              Suporte
            </Link>
          </p>
        </div>
      </section>

      {recuperando && (
        <RecuperarSenhaModal
          aberto
          emailInicial={email}
          onFechar={fecharRecuperar}
        />
      )}
    </main>
  );
};
