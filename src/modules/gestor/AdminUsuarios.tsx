import { useState } from "react";
import type { ChangeEvent, FormEvent, CSSProperties } from "react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

type Papel = "aluno" | "professor" | "gestor";
type Form = { email: string; senha: string; papel: Papel };
type Msg = { tipo: "ok" | "erro"; texto: string } | null;

const FORM_INICIAL: Form = { email: "", senha: "", papel: "aluno" };

export function AdminUsuarios() {
  const [form, setForm] = useState<Form>(FORM_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value } as Form);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);

    if (form.senha.length < 6) {
      setMsg({
        tipo: "erro",
        texto: "A senha precisa ter no mínimo 6 caracteres.",
      });
      return;
    }

    setEnviando(true);
    const { data, error } = await supabase.functions.invoke("criar-usuario", {
      body: {
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

    setMsg({
      tipo: "ok",
      texto: `✅ ${form.papel} ${form.email} criado com sucesso!`,
    });
    setForm(FORM_INICIAL);
  };

  return (
    <div style={s.container}>
      <h2>👑 Cadastrar usuário</h2>

      <form onSubmit={handleSubmit} style={s.form}>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          style={s.input}
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          value={form.senha}
          onChange={handleChange}
          style={s.input}
        />

        <label htmlFor="papel">Papel</label>
        <select
          id="papel"
          name="papel"
          value={form.papel}
          onChange={handleChange}
          style={s.input}
        >
          <option value="aluno">Aluno</option>
          <option value="professor">Professor</option>
          <option value="gestor">Gestor</option>
        </select>

        <button type="submit" disabled={enviando} style={s.button}>
          {enviando ? "Criando..." : "Criar usuário"}
        </button>
      </form>

      {msg && (
        <p
          style={{
            ...s.msg,
            background: msg.tipo === "ok" ? "#d1fae5" : "#fee2e2",
          }}
        >
          {msg.texto}
        </p>
      )}
    </div>
  );
}

const s: Record<string, CSSProperties> = {
  container: {
    maxWidth: 420,
    margin: "40px auto",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,.1)",
    fontFamily: "sans-serif",
  },
  form: { display: "flex", flexDirection: "column", gap: 8 },
  input: { padding: 10, borderRadius: 8, border: "1px solid #ccc" },
  button: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  msg: { marginTop: 16, padding: 12, borderRadius: 8 },
};
