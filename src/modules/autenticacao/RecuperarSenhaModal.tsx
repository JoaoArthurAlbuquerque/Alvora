import React, { useEffect, useState } from "react";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Modal } from "../../core/ui/Modal";
import { Button } from "../../core/ui/Button";
import { supabase } from "../../lib/supabase";
import { erroAuth, validarEmail } from "./senha";

const ESPERA = 60;

export const RecuperarSenhaModal: React.FC<{
  aberto: boolean;
  emailInicial?: string;
  onFechar: () => void;
}> = ({ aberto, emailInicial = "", onFechar }) => {
  const [email, setEmail] = useState(emailInicial);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [espera, setEspera] = useState(0);

  useEffect(() => {
    if (!espera) return;
    const t = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [espera]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando || espera) return;
    const v = validarEmail(email);
    if (v) return setErro(v);
    setEnviando(true);
    setErro(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setEnviando(false);
    if (error) return setErro(erroAuth(error));
    setEnviado(true); // mesma resposta exista ou não a conta (não expõe e-mails)
    setEspera(ESPERA);
  };

  return (
    <Modal isOpen={aberto} onClose={onFechar} title="Recuperar senha">
      {enviado ? (
        <div role="status" className="text-center space-y-4 py-2">
          <CheckCircle2
            size={44}
            className="mx-auto text-emerald-500 animate-pop"
            aria-hidden
          />
          <p className="text-sm text-slate-600">
            Se <b className="text-ink">{email.trim()}</b> estiver cadastrado,
            você vai receber um link para criar uma nova senha. Confira também o
            spam 📬
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="w-full"
              disabled={!!espera}
              onClick={() => setEnviado(false)}
            >
              {espera ? `Reenviar em ${espera}s` : "Reenviar"}
            </Button>
            <Button className="w-full" onClick={onFechar}>
              Entendi
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={enviar} noValidate className="space-y-4">
          <p className="text-sm text-slate-500">
            Informe o e-mail institucional. Enviaremos um link válido por tempo
            limitado.
          </p>
          <label className="block text-sm font-semibold text-ink">
            E-mail institucional
            <div className="relative mt-1.5">
              <Mail
                size={16}
                aria-hidden
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                autoFocus
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErro(null);
                }}
                aria-invalid={!!erro}
                placeholder="nome@escola.edu.br"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </label>
          {erro && (
            <p
              role="alert"
              className="flex gap-2 text-sm text-rose-600 bg-rose-50 rounded-xl px-3.5 py-2.5"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {erro}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={enviando || !!espera}
            icon={
              enviando ? (
                <Loader2 size={16} className="animate-spin" />
              ) : undefined
            }
          >
            {enviando
              ? "Enviando…"
              : espera
                ? `Aguarde ${espera}s`
                : "Enviar link"}
          </Button>
        </form>
      )}
    </Modal>
  );
};
