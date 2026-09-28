import React, { useState } from "react";
import { UserPlus, CheckCircle2, XCircle } from "lucide-react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";
import { cn } from "../../core/lib/utils";

type Papel = "aluno" | "professor" | "gestor";
type Form = { nome: string; email: string; senha: string; papel: Papel };
type Msg = { tipo: "ok" | "erro"; texto: string } | null;

const FORM_INICIAL: Form = { nome: "", email: "", senha: "", papel: "aluno" };

const PAPEIS: { id: Papel; label: string; emoji: string }[] = [
  { id: "aluno", label: "Aluno", emoji: "🎒" },
  { id: "professor", label: "Professor", emoji: "📚" },
  { id: "gestor", label: "Gestor", emoji: "👑" },
];

const inputCls =
  "mt-1.5 w-full text-sm px-4 h-11 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition";

export const AdminUsuarios: React.FC = () => {
  const [form, setForm] = useState<Form>(FORM_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  const set = <K extends keyof Form>(campo: K, valor: Form[K]) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!form.nome.trim() || !form.email.trim() || form.senha.length < 6) {
      setMsg({
        tipo: "erro",
        texto: "Preencha nome, e-mail e senha (mín. 6).",
      });
      return;
    }

    setEnviando(true);
    const { data, error } = await supabase.functions.invoke("criar-usuario", {
      body: {
        nome: form.nome.trim(),
        email: form.email.trim().toLowerCase(),
        senha: form.senha,
        papel: form.papel,
      },
    });
    setEnviando(false);

    if (error || data?.erro) {
      let texto: string = data?.erro || error?.message || "Erro desconhecido";
      if (error instanceof FunctionsHttpError) {
        try {
          const corpo = await error.context.json();
          if (corpo?.erro) texto = corpo.erro;
        } catch {
          /* resposta sem JSON */
        }
      }
      setMsg({ tipo: "erro", texto });
      return;
    }

    setMsg({ tipo: "ok", texto: `${form.nome.trim()} entrou na Alvora! 🌅` });
    setForm(FORM_INICIAL);
  };

  return (
    <Card className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-4">
        <IconBubble icone={UserPlus} cor="primary" />
        <div>
          <h3 className="text-lg font-extrabold text-ink">Cadastrar usuário</h3>
          <p className="text-xs text-slate-400">
            O acesso é liberado na hora, sem confirmação por e-mail.
          </p>
        </div>
      </div>

      <form onSubmit={enviar} className="space-y-4">
        <label className="block text-sm font-semibold text-ink">
          Nome completo
          <input
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
            placeholder="Ex.: Pedro Albuquerque"
            className={inputCls}
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block text-sm font-semibold text-ink">
            E-mail
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="pedro@escola.com"
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Senha
            <input
              type="password"
              value={form.senha}
              onChange={(e) => set("senha", e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className={inputCls}
            />
          </label>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink mb-1.5">Papel</p>
          <div className="grid grid-cols-3 gap-2">
            {PAPEIS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => set("papel", p.id)}
                className={cn(
                  "h-11 rounded-xl text-xs font-bold transition-all",
                  form.papel === p.id
                    ? "bg-brand text-white shadow-glow"
                    : "bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary",
                )}
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={enviando}
          icon={<UserPlus size={15} />}
        >
          {enviando ? "Criando..." : "Criar usuário"}
        </Button>
      </form>

      {msg && (
        <p
          className={cn(
            "flex items-center gap-2 text-sm font-bold p-4 rounded-xl animate-pop",
            msg.tipo === "ok"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-600",
          )}
        >
          {msg.tipo === "ok" ? (
            <CheckCircle2 size={16} />
          ) : (
            <XCircle size={16} />
          )}
          {msg.texto}
        </p>
      )}
    </Card>
  );
};
