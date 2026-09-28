import React, { useState } from "react";
import { UserPlus, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/core/ui/Card";
import { Button } from "@/core/ui/Button";
import { PageHeader } from "@/core/ui/PageHeader";
import type { PapelUsuario } from "@/types";

const inputCls =
  "w-full h-11 px-4 rounded-xl border border-primary/15 bg-white text-sm outline-none focus:ring-4 focus:ring-primary/15 transition";

const vazio = {
  nome: "",
  sobrenome: "",
  email: "",
  senha: "",
  papel: "aluno" as PapelUsuario,
};

export const AdminUsuarios: React.FC = () => {
  const [form, setForm] = useState(vazio);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const set =
    (campo: keyof typeof vazio) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [campo]: e.target.value }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!form.nome.trim() || !form.sobrenome.trim())
      return setErro("Informe nome e sobrenome.");
    if (form.senha.length < 6)
      return setErro("A senha precisa ter no mínimo 6 caracteres.");

    setCarregando(true);
    const { data, error } = await supabase.functions.invoke("criar-usuario", {
      body: form,
    });
    setCarregando(false);

    if (error || data?.error) {
      let msg = data?.error ?? error?.message ?? "Erro ao criar usuário";
      try {
        const ctx = await (error as { context?: Response })?.context?.json();
        if (ctx?.error) msg = ctx.error;
      } catch {
        /* ignora */
      }
      return setErro(msg);
    }

    setSucesso(
      `${form.nome} ${form.sobrenome} criado! Matrícula: ${data.matricula}`,
    );
    setForm(vazio);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        titulo="Usuários"
        descricao="Cadastre alunos, professores e gestores."
      />

      <Card>
        <form onSubmit={enviar} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Nome *"
              value={form.nome}
              onChange={set("nome")}
              className={inputCls}
            />
            <input
              required
              placeholder="Sobrenome *"
              value={form.sobrenome}
              onChange={set("sobrenome")}
              className={inputCls}
            />
          </div>
          <input
            required
            type="email"
            placeholder="E-mail *"
            value={form.email}
            onChange={set("email")}
            className={inputCls}
          />
          <input
            required
            type="password"
            placeholder="Senha (mín. 6) *"
            value={form.senha}
            onChange={set("senha")}
            className={inputCls}
          />
          <select
            value={form.papel}
            onChange={set("papel")}
            className={inputCls}
          >
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
            <option value="gestor">Gestor</option>
          </select>

          {erro && (
            <p className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-xl animate-shake">
              <AlertCircle size={16} /> {erro}
            </p>
          )}
          {sucesso && (
            <p className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 p-3 rounded-xl animate-pop">
              <CheckCircle2 size={16} /> {sucesso}
            </p>
          )}

          <Button
            type="submit"
            disabled={carregando}
            icon={<UserPlus size={16} />}
            className="w-full"
          >
            {carregando ? "Criando..." : "Criar usuário"}
          </Button>
        </form>
      </Card>
    </div>
  );
};
