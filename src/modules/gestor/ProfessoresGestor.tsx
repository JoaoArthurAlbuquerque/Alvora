import React, { useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { Card } from "@/core/ui/Card";
import { PageHeader } from "@/core/ui/PageHeader";
import { Badge } from "@/core/ui/Badge";
import { Button } from "@/core/ui/Button";
import { EstadoConsulta } from "@/core/ui/EstadoConsulta";
import { carregarEscola, useConsulta } from "@/services/escolaService";
import { iniciais } from "./constantes";

export const ProfessoresGestor: React.FC = () => {
  const { data, erro, carregando, recarregar } = useConsulta(carregarEscola);
  const [busca, setBusca] = useState("");

  const professores = useMemo(() => {
    if (!data) return [];
    const q = busca.toLowerCase();
    return [...data.pessoas.values()]
      .filter(
        (p) => p.papel === "professor" && p.nome.toLowerCase().includes(q),
      )
      .map((p) => {
        const aulas = data.turmas.flatMap((t) =>
          t.disciplinas
            .filter((d) => d.professorId === p.id)
            .map((d) => ({ ...d, turma: t.nome, alunos: t.alunos.length })),
        );
        return {
          ...p,
          aulas,
          totalAlunos: aulas.reduce((s, a) => s + a.alunos, 0),
        };
      })
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [data, busca]);

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Professores"
        descricao={`${professores.length} mestre(s) no time 🍎`}
        acao={
          <Button
            variant="outline"
            size="sm"
            onClick={recarregar}
            icon={<RefreshCw size={14} />}
          >
            Atualizar
          </Button>
        }
      />

      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar professor..."
          className="w-full h-11 pl-11 pr-4 rounded-xl border border-primary/15 bg-white text-sm outline-none focus:ring-4 focus:ring-primary/15"
        />
      </div>

      <EstadoConsulta
        carregando={carregando}
        erro={erro}
        vazio={!professores.length}
        textoVazio="Nenhum professor encontrado."
        onTentar={recarregar}
      >
        <div className="grid md:grid-cols-2 gap-4">
          {professores.map((p) => (
            <Card key={p.id} hoverable className="animate-fade-up">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-12 h-12 rounded-2xl bg-brand text-white font-extrabold flex items-center justify-center shadow-glow">
                  {iniciais(p.nome)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-ink truncate">{p.nome}</p>
                  <p className="text-xs text-slate-500">
                    {p.aulas.length} disciplina(s) · {p.totalAlunos} alunos
                  </p>
                </div>
                {!p.aulas.length && <Badge variant="warning">Sem turma</Badge>}
              </div>
              <div className="flex flex-wrap gap-2">
                {p.aulas.map((a) => (
                  <Badge key={a.tdId} variant="primary">
                    {a.nome} · {a.turma}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </EstadoConsulta>
    </div>
  );
};
