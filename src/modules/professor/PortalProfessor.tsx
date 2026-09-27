import React, { useState } from "react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { Badge } from "../../core/ui/Badge";
import { TabProfessor } from "../../types";
import { LancamentoFrequencia } from "./LancamentoFrequencia";
import {
  useFrequenciaTurma,
  LIMITE_FALTAS_PCT,
  TURMA_ID,
} from "../../services/frequenciaTurma";
import { useRadarRisco, type NivelRisco } from "../../services/radarRisco";
import {
  useNotasTurma,
  useMediasTurma,
  atualizarNota,
} from "../../services/notas";

const PROFESSOR_ID = "prof";

const ESTILO: Record<
  NivelRisco,
  { barra: string; selo: string; label: string }
> = {
  critico: {
    barra: "bg-rose-500",
    selo: "text-rose-600 bg-rose-500/10",
    label: "🔴 crítico",
  },
  atencao: {
    barra: "bg-amber-500",
    selo: "text-amber-600 bg-amber-500/10",
    label: "🟡 atenção",
  },
  ok: { barra: "bg-emerald-500", selo: "", label: "" },
};

const pad = (n: number) => n.toString().padStart(2, "0");

export const PortalProfessor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabProfessor>("dashboard");
  const { alunos, mediaFrequencia, diasRegistrados, diarioHojeSalvo } =
    useFrequenciaTurma();

  const notasTurma = useNotasTurma();
  const medias = useMediasTurma(alunos);
  const { itens: radar } = useRadarRisco(
    alunos,
    medias,
    TURMA_ID,
    PROFESSOR_ID,
  );
  const alertas = radar.filter((a) => a.nivel !== "ok");

  return (
    <div className="space-y-6">
      {/* Navegação por Abas */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-primary/15">
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
                ? "bg-primary text-white shadow-flat-sm"
                : "bg-white text-slate-600 hover:bg-primary/10 hover:text-primary border border-primary/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ABA 1: INÍCIO */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <p className="text-xs font-bold text-primary uppercase">
                Frequência Média da Turma
              </p>
              <p
                className={`text-3xl font-extrabold mt-2 ${
                  mediaFrequencia >= 100 - LIMITE_FALTAS_PCT
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {mediaFrequencia}%
              </p>
              <Badge variant="primary" className="mt-3">
                {diasRegistrados} diário(s) lançado(s) no sistema
              </Badge>
            </Card>

            <Card>
              <p className="text-xs font-bold text-primary uppercase">
                Diário de Hoje
              </p>
              <p
                className={`text-3xl font-extrabold mt-2 ${diarioHojeSalvo ? "text-emerald-600" : "text-amber-600"}`}
              >
                {diarioHojeSalvo ? "Salvo" : "Pendente"}
              </p>
              <Badge
                variant={diarioHojeSalvo ? "primary" : "warning"}
                className="mt-3"
              >
                {diarioHojeSalvo ? "Tudo em dia ✓" : "Faça a chamada"}
              </Badge>
            </Card>

            <Card>
              <p className="text-xs font-bold text-primary uppercase">
                Alunos em Risco na Turma
              </p>
              <p
                className={`text-3xl font-extrabold mt-2 ${alertas.length ? "text-rose-600" : "text-emerald-600"}`}
              >
                {pad(alertas.length)}
              </p>
              <Badge
                variant={alertas.length ? "danger" : "primary"}
                className="mt-3"
              >
                Faltas &gt; {LIMITE_FALTAS_PCT}% ou nota baixa
              </Badge>
            </Card>
          </div>

          {/* Radar de risco */}
          <Card className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">
                Radar de Risco — Turma A
              </h3>
              <span className="text-xs text-slate-400">
                {alunos.length} alunos • atualiza ao salvar o diário ou notas
              </span>
            </div>

            {alertas.length === 0 && (
              <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl text-center">
                🎉 Nenhum aluno em risco. Turma afiada!
              </p>
            )}

            <div className="space-y-3">
              {radar.map((a) => {
                const e = ESTILO[a.nivel];
                return (
                  <div key={a.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        {a.nome}
                        {e.label && (
                          <span
                            className={`ml-2 text-[10px] px-2 py-0.5 rounded-lg ${e.selo}`}
                          >
                            {e.label}
                            {a.motivo && ` • ${a.motivo}`}
                          </span>
                        )}
                      </span>
                      <span className="text-slate-500">
                        {a.faltas} faltas / {a.totalAulas} aulas •{" "}
                        <b>{a.percentualFrequencia}%</b>
                        {a.media !== null && (
                          <>
                            {" "}
                            • média <b>{a.media}</b>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${e.barra} transition-all duration-500`}
                        style={{ width: `${a.percentualFrequencia}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Turmas Sob Minha Regência
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary-soft border border-primary/10 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Desenvolvimento Front-End
                  </p>
                  <p className="text-xs text-slate-500">
                    {alunos.length} Alunos • Noturno
                  </p>
                </div>
                <Button size="sm" onClick={() => setActiveTab("diario")}>
                  {diarioHojeSalvo ? "Revisar Chamada" : "Abrir Chamada"}
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-primary-soft border border-primary/10 flex justify-between items-center">
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

      {/* ABA 2: DIÁRIO */}
      {activeTab === "diario" && <LancamentoFrequencia />}

      {/* ABA 3: NOTAS */}
      {activeTab === "notas" && (
        <Card className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-primary/10">
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
                <tr className="border-b border-primary/15 text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-2">Aluno</th>
                  <th className="py-3 px-2">Nota AV1</th>
                  <th className="py-3 px-2">Nota AV2</th>
                  <th className="py-3 px-2">Média Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {notasTurma.map((n) => (
                  <tr key={n.id}>
                    <td className="py-3 px-2 font-bold text-slate-800">
                      {n.aluno}
                    </td>
                    {(["av1", "av2"] as const).map((campo) => (
                      <td key={campo} className="py-3 px-2">
                        <input
                          type="number"
                          step="0.5"
                          min={0}
                          max={10}
                          value={n[campo]}
                          onChange={(e) =>
                            atualizarNota(
                              n.id,
                              campo,
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-16 px-2 py-1 rounded-lg border border-primary/20 text-center text-xs font-bold bg-primary-soft"
                        />
                      </td>
                    ))}
                    <td className="py-3 px-2 font-black text-primary">
                      {n.media}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ABA 4: CONTEÚDOS */}
      {activeTab === "conteudos" && (
        <Card className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">
              Materiais de Aula & Tarefas
            </h3>
            <Button size="sm">Upload de Arquivo</Button>
          </div>
          <div className="p-4 rounded-xl bg-primary-soft border border-primary/10 text-xs space-y-2">
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
