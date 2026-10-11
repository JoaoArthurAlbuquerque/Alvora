// src/modules/autenticacao/RedefinirSenhaPage.tsx  (rota /redefinir-senha)
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { Button } from "../../core/ui/Button";
import { cn } from "../../core/lib/utils";
import { supabase } from "../../lib/supabase";
import { SENHA_MIN, erroAuth, validarSenha } from "./senha";

type Fase = "verificando" | "pronto" | "invalido";

/** Lê o erro que o Supabase coloca na URL do link (hash ou query) */
function linkComErro(): boolean {
  if (typeof window === "undefined") return false;
  const url = new URLSearchParams(
    window.location.hash.slice(1) || window.location.search,
  );
  return (
    url.has("error") || url.has("error_code") || url.has("error_description")
  );
}

const campo =
  "w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10";

export const RedefinirSenhaPage: React.FC = () => {
  const navigate = useNavigate();
  // Decidido antes do 1º render: o efeito não precisa chamar setState direto
  const [fase, setFase] = useState<Fase>(() =>
    linkComErro() ? "invalido" : "verificando",
  );
  const [senha, setSenha] = useState("");
  const [conf, setConf] = useState("");
  const [ver, setVer] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (linkComErro()) return; // já está "invalido" no estado inicial

    // setFase só dentro de callbacks (sistema externo avisando)
    const pronto = () => setFase((f) => (f === "verificando" ? "pronto" : f));

    const { data } = supabase.auth.onAuthStateChange((ev, s) => {
      if (
        s &&
        (ev === "PASSWORD_RECOVERY" ||
          ev === "SIGNED_IN" ||
          ev === "INITIAL_SESSION")
      )
        pronto();
    });
    supabase.auth.getSession().then(({ data: d }) => {
      if (d.session) pronto();
    });
    const t = setTimeout(
      () => setFase((f) => (f === "verificando" ? "invalido" : f)),
      6000,
    );

    return () => {
      data.subscription.unsubscribe();
      clearTimeout(t);
    };
  }, []);

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salvando) return;
    const v = validarSenha(senha, conf);
    if (v) return setErro(v);
    setSalvando(true);
    setErro(null);
    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) {
      setSalvando(false);
      return setErro(erroAuth(error));
    }
    await supabase.auth.signOut({ scope: "global" }); // derruba sessões antigas
    navigate("/login", {
      replace: true,
      state: { aviso: "Senha alterada! Entre com a nova senha 🔐" },
    });
  };

  const forca = [
    senha.length >= SENHA_MIN,
    /[A-Za-z]/.test(senha) && /\d/.test(senha),
    senha.length >= 12,
  ].filter(Boolean).length;

  const campos = [
    { id: "nova", l: "Nova senha", v: senha, set: setSenha },
    { id: "conf", l: "Confirmar senha", v: conf, set: setConf },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-white">
      <div className="w-full max-w-sm space-y-8 animate-fade-up">
        <img src="/alvora_blue.svg" alt="Alvora" className="h-8" />

        {fase === "verificando" && (
          <p
            role="status"
            className="flex items-center gap-2 text-sm text-slate-500"
          >
            <Loader2 size={16} className="animate-spin text-primary" />{" "}
            Validando seu link…
          </p>
        )}

        {fase === "invalido" && (
          <div role="alert" className="space-y-4">
            <h1 className="text-2xl font-extrabold text-ink">
              Link inválido ou expirado ⏳
            </h1>
            <p className="text-sm text-slate-500">
              Por segurança, o link vale por pouco tempo e só uma vez. Peça um
              novo.
            </p>
            <Link
              to="/login?recuperar=1"
              className="inline-flex items-center h-10 px-5 rounded-full bg-brand text-white text-sm font-bold shadow-glow"
            >
              Pedir novo link
            </Link>
          </div>
        )}

        {fase === "pronto" && (
          <form onSubmit={salvar} noValidate className="space-y-5">
            <div>
              <h1 className="text-2xl font-extrabold text-ink flex items-center gap-2">
                <KeyRound className="text-primary" /> Nova senha
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Mínimo de {SENHA_MIN} caracteres, com letras e números.
              </p>
            </div>

            {campos.map((c) => (
              <label
                key={c.id}
                className="block text-sm font-semibold text-ink"
              >
                {c.l}
                <div className="relative mt-1.5">
                  <Lock
                    size={16}
                    aria-hidden
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={ver ? "text" : "password"}
                    autoComplete="new-password"
                    value={c.v}
                    onChange={(e) => {
                      c.set(e.target.value);
                      setErro(null);
                    }}
                    className={campo}
                  />
                  {c.id === "nova" && (
                    <button
                      type="button"
                      onClick={() => setVer((x) => !x)}
                      aria-label={ver ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary cursor-pointer"
                    >
                      {ver ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </label>
            ))}

            <div
              className="grid grid-cols-3 gap-1.5"
              aria-label={`Força da senha: ${forca} de 3`}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full",
                    i < forca
                      ? ["bg-rose-400", "bg-amber-400", "bg-emerald-500"][
                          forca - 1
                        ]
                      : "bg-slate-100",
                  )}
                />
              ))}
            </div>

            {erro && (
              <p
                role="alert"
                className="flex gap-2 text-sm text-rose-600 bg-rose-50 rounded-xl px-3.5 py-2.5 animate-shake"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" /> {erro}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={salvando}
              icon={
                salvando ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : undefined
              }
            >
              {salvando ? "Salvando…" : "Salvar nova senha"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
};
