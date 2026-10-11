// src/modules/gestor/turmas/GestaoTurmas.tsx
import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "../../../core/ui/PageHeader";
import { Button } from "../../../core/ui/Button";
import { Badge } from "../../../core/ui/Badge";
import { Card } from "../../../core/ui/Card";
import { EstadoConsulta } from "../../../core/ui/EstadoConsulta";
import { cn } from "../../../core/lib/utils";
import {
  useTurmasGestao,
  type TurmaGestao,
} from "../../../services/api/gestao";
import { DetalheTurma } from "./DetalheTurma";
import { ModalTurma } from "./ModaisTurma";
import { inputCls, normalizar, useAviso } from "./helpers";

export const GestaoTurmas: React.FC = () => {
  const { data: turmas = [], isLoading, error, refetch } = useTurmasGestao();
  const { aviso, toast } = useAviso();
  const [busca, setBusca] = useState("");
  const [verArquivadas, setVerArquivadas] = useState(false);
  const [selId, setSelId] = useState<string>();
  const [form, setForm] = useState<{ turma: TurmaGestao | null } | null>(null);

  const filtradas = turmas.filter(
    (t) =>
      (verArquivadas || t.ativa) &&
      normalizar(
        `${t.nome} ${t.ano_letivo ?? ""} ${t.professores.join(" ")}`,
      ).includes(normalizar(busca)),
  );
  const sel = turmas.find((t) => t.id === selId) ?? filtradas[0];

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Gestão de turmas"
        descricao={`${turmas.filter((t) => t.ativa).length} turma(s) ativa(s) · monte a grade, vincule professores e matricule alunos`}
        acao={
          <Button
            icon={<Plus size={16} />}
            onClick={() => setForm({ turma: null })}
          >
            Nova turma
          </Button>
        }
      />

      <EstadoConsulta
        carregando={isLoading}
        erro={error ? (error as Error).message : null}
        vazio={!turmas.length}
        textoVazio="Nenhuma turma cadastrada. Clique em “Nova turma” para começar 🚀"
        onTentar={() => refetch()}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 items-start">
          <Card padded={false} className="p-3 space-y-3 lg:sticky lg:top-24">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                placeholder="Buscar turma ou professor…"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className={cn(inputCls, "pl-9")}
              />
            </div>
            <label className="flex items-center gap-2 px-1 text-xs font-bold text-slate-500">
              <input
                type="checkbox"
                checked={verArquivadas}
                onChange={(e) => setVerArquivadas(e.target.checked)}
              />
              Mostrar arquivadas
            </label>
            <ul className="space-y-1.5 max-h-[60vh] overflow-y-auto">
              {!filtradas.length && (
                <li className="text-sm text-slate-400 text-center py-6">
                  Nada encontrado 🔎
                </li>
              )}
              {filtradas.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    aria-current={sel?.id === t.id}
                    onClick={() => setSelId(t.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-colors",
                      sel?.id === t.id
                        ? "bg-primary/10 ring-2 ring-primary/30"
                        : "bg-slate-50 hover:bg-primary/5",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-ink truncate min-w-0">
                        {t.nome}
                      </span>
                      {!t.ativa && <Badge>Arquivada</Badge>}
                      {t.ativa && t.semProfessor > 0 && (
                        <Badge variant="warning">
                          {t.semProfessor} s/ prof.
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {t.ano_letivo ?? "—"} · {t.totalAlunos} aluno(s) ·{" "}
                      {t.totalDisciplinas} disciplina(s)
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {sel ? (
            <DetalheTurma
              key={sel.id}
              turma={sel}
              aviso={aviso}
              onEditar={() => setForm({ turma: sel })}
              onExcluida={() => setSelId(undefined)}
            />
          ) : (
            <Card className="text-center text-sm text-slate-400 py-12">
              Selecione uma turma
            </Card>
          )}
        </div>
      </EstadoConsulta>

      {form && (
        <ModalTurma
          aberto
          key={form.turma?.id ?? "nova"}
          turma={form.turma}
          aviso={aviso}
          onFechar={() => setForm(null)}
          onSalva={setSelId}
        />
      )}
      {toast}
    </div>
  );
};
