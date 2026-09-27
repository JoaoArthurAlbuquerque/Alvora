// src/modules/autenticacao/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../core/auth/useAuthStore";
import { Button } from "../../core/ui/Button";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("aluno@alvora.edu.br");
  const [role, setRole] = useState<"aluno" | "professor" | "gestor">("aluno");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#F5F7FF] via-white to-[#5170FF]/10 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-flat border border-[#5170FF]/15 space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/alvora_blue.svg"
            alt="Alvora Logo"
            className="h-10 mx-auto"
          />
          <p className="text-xs text-[#5170FF] font-semibold tracking-wide uppercase pt-2">
            Plataforma Educacional
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              E-mail Institucional
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#5170FF]/20 focus:outline-none focus:ring-2 focus:ring-[#5170FF]/40 text-sm bg-[#F5F7FF]/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Perfil de Acesso
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["aluno", "professor", "gestor"] as const).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl capitalize border transition-all ${
                    role === r
                      ? "bg-[#5170FF] text-white border-[#5170FF] shadow-flat-sm"
                      : "bg-white text-slate-600 border-[#5170FF]/20 hover:bg-[#5170FF]/5"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full mt-4" size="lg">
            Entrar no Sistema
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Alvora 2026 - Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};
