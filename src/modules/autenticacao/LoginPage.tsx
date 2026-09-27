// src/modules/autenticacao/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../core/auth/useAuthStore";
import { Button } from "../../core/ui/Button";

type Role = "aluno" | "professor" | "gestor";
const roles: Role[] = ["aluno", "professor", "gestor"];

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("aluno@alvora.edu.br");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [role, setRole] = useState<Role>("aluno");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    navigate(`/${role}`);
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2">
      {/* ESQUERDA — painel roxo (depois vira imagem) */}
      <aside className="relative hidden overflow-hidden bg-[#4A2FBD] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <img
          src="/alvora_blue.svg"
          alt="Alvora"
          className="relative h-9 w-fit brightness-0 invert"
        />

        <div className="relative max-w-md">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
            Plataforma educacional
          </p>
          <h2 className="text-4xl font-semibold leading-tight">
            Onde a escola inteira se encontra da chamada ao boletim.
          </h2>
        </div>

        <p className="relative text-sm text-white/50">
          © {new Date().getFullYear()} Alvora
        </p>
      </aside>

      {/* DIREITA — login */}
      <section className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <img
            src="/alvora_blue.svg"
            alt="Alvora"
            className="mb-10 h-8 lg:hidden"
          />

          <h1 className="text-2xl font-semibold text-slate-900">
            Bem-vindo de volta
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Entre com seu e-mail institucional para continuar.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Entrar como
              </span>
              <div className="grid grid-cols-3 rounded-lg bg-slate-100 p-1">
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-md py-2 text-sm font-medium capitalize transition ${
                      role === r
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                E-mail institucional
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@escola.edu.br"
                className={inputClass}
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="senha"
                  className="text-sm font-medium text-slate-700"
                >
                  Senha
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Esqueceu?
                </a>
              </div>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className={`${inputClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-3 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  {mostrarSenha ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" className="h-4 w-4 accent-primary" />
              Manter conectado
            </label>

            <Button type="submit" className="w-full" size="lg">
              Entrar como {role}
            </Button>
          </form>

          <p className="mt-10 text-xs text-slate-400">
            <a href="#" className="hover:text-slate-600">
              Privacidade
            </a>{" "}
            ·{" "}
            <a href="#" className="hover:text-slate-600">
              Suporte
            </a>
          </p>
        </div>
      </section>
    </main>
  );
};
