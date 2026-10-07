import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import type { Usuario } from "../../types";

interface AuthState {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<string | null>;
  logout: () => Promise<void>;
  recarregarPerfil: () => Promise<void>;
  validarSessao: () => Promise<boolean>;
}

/** Usa o mesmo tipo de `Usuario.papel` (PapelUsuario), sem duplicar a definição */
type Papel = Usuario["papel"];

const PAPEIS_VALIDOS: readonly string[] = ["aluno", "professor", "gestor", "admin"];

/** Converte a string do banco em PapelUsuario. Valor desconhecido vira "aluno" (menor privilégio). */
function toPapel(valor: unknown): Papel {
  return (
    typeof valor === "string" && PAPEIS_VALIDOS.includes(valor) ? valor : "aluno"
  ) as Papel;
}

async function buscarPerfil(id: string, email: string): Promise<Usuario | null> {
  const { data: perfil, error } = await supabase
    .from("profiles")
    .select("id, nome, sobrenome, papel")
    .eq("id", id)
    .single();
  if (error || !perfil) return null;

  // Matrícula vem pela função segura (sempre do usuário logado)
  const { data: matricula } = await supabase.rpc("minha_matricula");

  return {
    id: perfil.id,
    nome: [perfil.nome, perfil.sobrenome].filter(Boolean).join(" "),
    sobrenome: perfil.sobrenome ?? "",
    matricula: (matricula as string | null) ?? "",
    email,
    papel: toPapel(perfil.papel),
    turmaOuCargo: "",
    turmasIds: [],
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,

      login: async (email, senha) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });
        if (error) return error.message;

        const usuario = await buscarPerfil(data.user.id, email);
        if (!usuario) {
          await supabase.auth.signOut();
          return "Perfil não encontrado";
        }

        set({ usuario });
        return null;
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ usuario: null });
      },

      // Atualiza a sessão salva sem precisar sair e entrar de novo
      recarregarPerfil: async () => {
        const atual = get().usuario;
        if (!atual) return;
        const usuario = await buscarPerfil(atual.id, atual.email);
        if (usuario) set({ usuario });
      },

      // Confere se o token do Supabase ainda vale para o usuário salvo
      validarSessao: async () => {
        const { data } = await supabase.auth.getSession();
        const atual = get().usuario;
        if (!data.session || data.session.user.id !== atual?.id) {
          set({ usuario: null });
          return false;
        }
        return true;
      },
    }),
    {
      name: "alvora-sessao",
      partialize: (s) => ({ usuario: s.usuario }),
    },
  ),
);

// Sessão encerrada fora do app (outra aba, token expirado) → limpa o usuário
supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") useAuthStore.setState({ usuario: null });
});
