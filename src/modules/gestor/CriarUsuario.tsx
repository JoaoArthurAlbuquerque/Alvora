import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function CriarUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("aluno");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function criar() {
    setCarregando(true);
    setMensagem("");

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setMensagem("❌ Faça login como gestor primeiro.");
      setCarregando(false);
      return;
    }

    const { error } = await supabase.functions.invoke("criar-usuario", {
      body: { nome, email, senha, role },
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (error) {
      const detalhe = await error.context?.json?.().catch(() => null);
      setMensagem(`❌ Erro: ${detalhe?.error ?? error.message}`);
    } else {
      setMensagem("✅ Usuário criado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
    }
    setCarregando(false);
  }

  return (
    <div>
      <h3>Criar usuário</h3>
      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="aluno">Aluno</option>
        <option value="professor">Professor</option>
        <option value="gestor">Gestor</option>
      </select>
      <button onClick={criar} disabled={carregando}>
        {carregando ? "Criando..." : "Criar"}
      </button>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
