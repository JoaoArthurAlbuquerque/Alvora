import React, { useState } from "react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { Button } from "../../core/ui/Button";
import { alunosEmRiscoMock } from "../../mocks/data";

export const PortalGestor: React.FC = () => {
  const [alunosEmRisco] = useState(alunosEmRiscoMock);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Painel de Gestão & Indicadores
        </h1>
        <p className="text-xs text-slate-500">
          Acompanhamento analítico de assiduidade e risco pedagógico.
        </p>
      </div>

      {/* KPIs Institucionais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-xs font-bold text-[#5170FF] uppercase">
            Total de Matriculados
          </p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">1,248</p>
        </Card>

        <Card>
          <p className="text-xs font-bold text-[#5170FF] uppercase">
            Frequência Média Geral
          </p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">92%</p>
          <Badge variant="success" className="mt-3">
            Dentro da Meta
          </Badge>
        </Card>

        <Card>
          <p className="text-xs font-bold text-[#5170FF] uppercase">
            Taxa de Retenção
          </p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">94.2%</p>
        </Card>

        <Card>
          <p className="text-xs font-bold text-[#5170FF] uppercase">
            Alunos em Risco (Faltas)
          </p>
          <p className="text-3xl font-extrabold text-rose-600 mt-2">
            {alunosEmRisco.length.toString().padStart(2, "0")}
          </p>
          <Badge variant="warning" className="mt-3">
            &gt; 20% de Ausências
          </Badge>
        </Card>
      </div>

      {/* Radar de Risco Pedagógico */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#5170FF]/10">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Radar de Risco Pedagógico por Absenteísmo
            </h3>
            <p className="text-xs text-slate-500">
              Alunos que ultrapassaram o limite crítico de faltas acumuladas por
              disciplina.
            </p>
          </div>
          <Button variant="secondary" size="sm">
            Exportar Relatório em PDF
          </Button>
        </div>

        <div className="divide-y divide-[#5170FF]/10">
          {alunosEmRisco.map((aluno) => (
            <div
              key={aluno.id}
              className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-900">
                    {aluno.nome}
                  </p>
                  <span className="text-xs text-slate-400">
                    • {aluno.matricula}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-[#5170FF]">
                    {aluno.disciplinaNome}
                  </span>{" "}
                  ({aluno.curso})
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs font-bold text-rose-600">
                    {aluno.percentualFrequencia}% de Frequência
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {aluno.faltasAcumuladas} faltas (Máx. permitido:{" "}
                    {aluno.maxFaltasPermitidas})
                  </p>
                </div>

                <Button variant="danger" size="sm">
                  Intervir / Notificar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
