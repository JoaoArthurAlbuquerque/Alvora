import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PapelUsuario, Usuario } from "../../types";

interface AuthState {
  autenticado: boolean;
  usuario: Usuario | null;
  login: (papel: PapelUsuario) => void;
  logout: () => void;
}

const mockUsuarios: Record<PapelUsuario, Usuario> = {
  aluno: {
    id: "aluno-1",
    nome: "João Arthur Albuquerque",
    email: "joao.albuquerque@alvora.edu.br",
    papel: "aluno",
    turmaOuCargo: "Sistemas de Informação - 4º Período",
    turmasIds: ["turma-1", "turma-2", "turma-3"],
  },
  professor: {
    id: "prof-1",
    nome: "Prof. Carlos Eduardo",
    email: "carlos.eduardo@alvora.edu.br",
    papel: "professor",
    turmaOuCargo: "Docente de Algoritmos e Estrutura de Dados",
    turmasIds: ["turma-1"],
  },
  gestor: {
    id: "gestor-1",
    nome: "Dra. Maria Helena",
    email: "maria.helena@alvora.edu.br",
    papel: "gestor",
    turmaOuCargo: "Coordenação Pedagógica Geral",
    turmasIds: [],
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      autenticado: false,
      usuario: null,
      login: (papel) =>
        set({ autenticado: true, usuario: mockUsuarios[papel] }),
      logout: () => set({ autenticado: false, usuario: null }),
    }),
    { name: "alvora-sessao" },
  ),
);
