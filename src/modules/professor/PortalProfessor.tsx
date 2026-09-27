import React, { useState } from "react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { Badge } from "../../core/ui/Badge";
import { TabProfessor } from "../../types";
import { LancamentoFrequencia } from "./LancamentoFrequencia";

export const PortalProfessor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabProfessor>("dashboard");
  const [notasTurma, setNotasTurma] = useState([
    {
      id: "1",
      aluno: "João Arthur Albuquerque",
      av1: 9.0,
      av2: 8.5,
      media: 8.75,
    },
    { id: "2", aluno: "Ana Beatriz Souza", av1: 7.5, av2: 8.0, media: 7.75 },
    { id: "3", aluno: "Carlos Eduardo Lima", av1: 5.0, av2: 6.0, media: 5.5 },
  ]);

  const handleNotaChange = (
    id: string,
    campo: "av1" | "av2",
    valor: number,
  ) => {
    setNotasTurma((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const av1 = campo === "av1" ? valor : n.av1;
          const av2 = campo === "av2" ? valor : n.av2;
          return {
            ...n,
            [campo]: valor,
            media: Number(((av1 + av2) / 2).toFixed(2)),
          };
        }
        return n;
      }),
    );
  };

  return (
    <div className="space-y-6">
      {/* Navegação por Abas Horizontais */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#5170FF]/15">
        {[
          { id: "dashboard", label: "Início" },
          { id: "diario", label: "Diário de Classe & Chamada" },
          { id: "notas", label: "Lançamento de Notas" },
          { id: "conteudos", label: "Conteúdos & Tarefas" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabProfessor)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-[#5170FF] text-white shadow-flat-sm"
                : "bg-white text-slate-600 hover:bg-[#5170FF]/10 hover:text-[#5170FF] border border-[#5170FF]/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ABA 1: INÍCIO / RESUMO DOCENTE */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <p className="text-xs font-bold text-[#5170FF] uppercase">
                Aulas Hoje
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">02</p>
              <Badge variant="primary" className="mt-3">
                Lab 04 & Sala 12
              </Badge>
            </Card>

            <Card>
              <p className="text-xs font-bold text-[#5170FF] uppercase">
                Trabalhos p/ Corrigir
              </p>
              <p className="text-3xl font-extrabold text-amber-600 mt-2">14</p>
              <Badge variant="warning" className="mt-3">
                Prazo: 2 dias
              </Badge>
            </Card>

            <Card>
              <p className="text-xs font-bold text-[#5170FF] uppercase">
                Alunos em Risco na Turma
              </p>
              <p className="text-3xl font-extrabold text-rose-600 mt-2">03</p>
              <Badge variant="danger" className="mt-3">
                Faltas &gt; 20%
              </Badge>
            </Card>
          </div>

          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Turmas Sob Minha Regência
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F5F7FF] border border-[#5170FF]/10 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Desenvolvimento Front-End
                  </p>
                  <p className="text-xs text-slate-500">42 Alunos • Noturno</p>
                </div>
                <Button size="sm" onClick={() => setActiveTab("diario")}>
                  Abrir Chamada
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-[#F5F7FF] border border-[#5170FF]/10 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Arquitetura de Software
                  </p>
                  <p className="text-xs text-slate-500">38 Alunos • Matutino</p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setActiveTab("notas")}
                >
                  Lançar Notas
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ABA 2: DIÁRIO DE CLASSE & CHAMADA */}
      {activeTab === "diario" && <LancamentoFrequencia />}

      {/* ABA 3: LANÇAMENTO DE NOTAS */}
      {activeTab === "notas" && (
        <Card className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#5170FF]/10">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Planilha de Avaliações — Turma A
              </h3>
              <p className="text-xs text-slate-500">
                Médias calculadas automaticamente.
              </p>
            </div>
            <Button size="sm">Publicar Boletim</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#5170FF]/15 text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-2">Aluno</th>
                  <th className="py-3 px-2">Nota AV1</th>
                  <th className="py-3 px-2">Nota AV2</th>
                  <th className="py-3 px-2">Média Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5170FF]/10">
                {notasTurma.map((n) => (
                  <tr key={n.id}>
                    <td className="py-3 px-2 font-bold text-slate-800">
                      {n.aluno}
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        step="0.5"
                        value={n.av1}
                        onChange={(e) =>
                          handleNotaChange(
                            n.id,
                            "av1",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-16 px-2 py-1 rounded-lg border border-[#5170FF]/20 text-center text-xs font-bold bg-[#F5F7FF]"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        step="0.5"
                        value={n.av2}
                        onChange={(e) =>
                          handleNotaChange(
                            n.id,
                            "av2",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-16 px-2 py-1 rounded-lg border border-[#5170FF]/20 text-center text-xs font-bold bg-[#F5F7FF]"
                      />
                    </td>
                    <td className="py-3 px-2 font-black text-[#5170FF]">
                      {n.media}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ABA 4: CONTEÚDOS & TAREFAS */}
      {activeTab === "conteudos" && (
        <Card className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">
              Materiais de Aula & Tarefas
            </h3>
            <Button size="sm">Upload de Arquivo</Button>
          </div>
          <div className="p-4 rounded-xl bg-[#F5F7FF] border border-[#5170FF]/10 text-xs space-y-2">
            <p className="font-bold text-slate-800">
              Unidade 03 — Componentes Reutilizáveis e Hooks
            </p>
            <p className="text-slate-500">
              Slides_Aula_03.pdf • Publicado em 20/09/2026
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
