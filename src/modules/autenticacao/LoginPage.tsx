// src/modules/autenticacao/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Sparkles,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "../../core/auth/useAuthStore";
import { Button } from "../../core/ui/Button";
import { cn } from "../../core/lib/utils";

type Role = "aluno" | "professor" | "gestor";

const ROLES: { id: Role; label: string; icone: typeof GraduationCap }[] = [
  { id: "aluno", label: "Aluno", icone: GraduationCap },
  { id: "professor", label: "Professor", icone: BookOpen },
  { id: "gestor", label: "Gestor", icone: BarChart3 },
];

const inputCls =
  "w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-ink placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition";

export const LoginPage: React.FC = () => {
  const [role, setRole] = useState<Role>("aluno");
  const [email, setEmail] = useState("aluno@alvora.edu.br");
  const [senha, setSenha] = useState("");
  const [ver, setVer] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const idx = ROLES.findIndex((r) => r.id === role);

  const trocarRole = (r: Role) => {
    setRole(r);
    setEmail(`${r}@alvora.edu.br`);
  };

  const entrar = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setCarregando(true);
    setTimeout(() => {
      login(role);
      navigate(`/${role}`);
    }, 600);
  };

  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2 bg-white">
      {/* ESQUERDA */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-brand p-12 text-white">
        {/* bolhas de luz */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-float" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-fuchsia-400/20 blur-3xl animate-float [animation-delay:1.5s]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <img
          src="/alvora_blue.svg"
          alt="Alvora"
          className="relative h-9 w-fit brightness-0 invert animate-fade-up"
        />

        <div className="relative space-y-8">
          <div className="max-w-md space-y-4 animate-fade-up">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur">
              <Sparkles size={13} /> Plataforma educacional
            </span>
            <h2 className="text-4xl font-extrabold leading-tight">
              Onde a escola inteira se encontra, da chamada ao boletim.
            </h2>
          </div>

          {/* cards flutuantes */}
          <div className="flex gap-4 stagger">
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur border border-white/20 animate-float">
              <TrendingUp size={18} className="mb-2" />
              <p className="text-2xl font-extrabold tabular">92%</p>
              <p className="text-[11px] text-white/70">Frequência média</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur border border-white/20 animate-float [animation-delay:0.8s] mt-6">
              <CheckCircle2 size={18} className="mb-2" />
              <p className="text-2xl font-extrabold tabular">1.2k</p>
              <p className="text-[11px] text-white/70">Chamadas no mês</p>
            </div>
          </div>
        </div>

        <p className="relative text-sm text-white/50">
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
              Bem-vindo de volta 👋
            </h1>
            <p className="mt-1 text-sm text-slate-400">
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
                    onClick={() => trocarRole(id)}
                    className={cn(
                      "relative z-10 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-colors",
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@escola.edu.br"
                  className={inputCls}
                />
              </div>
            </label>

            {/* senha */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="senha"
                  className="text-sm font-semibold text-ink"
                >
                  Senha
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Esqueceu?
                </a>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="senha"
                  type={ver ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className={cn(inputCls, "pr-11")}
                />
                <button
                  type="button"
                  onClick={() => setVer((v) => !v)}
                  aria-label={ver ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition"
                >
                  {ver ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded accent-primary"
              />
              Manter conectado
            </label>

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
            <a href="#" className="hover:text-primary transition">
              Privacidade
            </a>{" "}
            ·{" "}
            <a href="#" className="hover:text-primary transition">
              Suporte
            </a>
          </p>
        </div>
      </section>
    </main>
  );
};
