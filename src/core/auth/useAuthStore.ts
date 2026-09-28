import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import type { Usuario } from "../../types";

interface AuthState {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      login: async (email, senha) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });
        if (error) return error.message;

        const { data: perfil, error: e2 } = await supabase
          .from("profiles")
          .select("id, nome, papel")
          .eq("id", data.user.id)
          .single();
        if (e2 || !perfil) return "Perfil não encontrado";

        set({
          usuario: {
            id: perfil.id,
            nome: perfil.nome,
            email,
            papel: perfil.papel,
            turmaOuCargo: "",
            turmasIds: [],
          },
        });
        return null;
      },
      logout: async () => {
        await supabase.auth.signOut();
        set({ usuario: null });
      },
    }),
    { name: "alvora-sessao" },
  ),
);
