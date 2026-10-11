// src/modules/gestor/turmas/DetalheTurma.tsx
import React, { useState } from "react";
import {
  Archive,
  ArchiveRestore,
  BookOpen,
  GraduationCap,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { Card } from "../../../core/ui/Card";
import { Badge } from "../../../core/ui/Badge";
import { Button } from "../../../core/ui/Button";
import { IconBubble } from "../../../core/ui/IconBubble";
import { EstadoConsulta } from "../../../core/ui/EstadoConsulta";
import { cn } from "../../../core/lib/utils";
import {
  useArquivarTurma,
  useDetalheTurma,
  useExcluirTurma,
  usePessoas,
  useRemoverDisciplina,
  useStatusMatricula,
  useTrocarProfessor,
  type StatusMatricula,
  type TurmaGestao,
} from "../../../services/api/gestao";
import { ModalMatricular, ModalVincular } from "./ModaisTurma";
import { inputCls, normalizar, type Aviso } from "./helpers";

const SELO_MAT: Record<
  StatusMatricula,
  { v: "success" | "neutral" | "warning" | "primary"; l: string }
> = {
  ativa: { v: "success", l: "Ativa" },
  inativa: { v: "neutral", l: "Inativa" },
  trancada: { v: "warning", l: "Trancada" },
  concluida: { v: "primary", l: "Concluída" },
};

export const DetalheTurma: React.FC<{
  turma: TurmaGestao;
  onEditar: () => void;
  onExcluida: () => void;
  aviso: Aviso;
}> = ({ turma, onEditar, onExcluida, aviso }) => {
  const [aba, setAba] = useState<"disciplinas" | "alunos">("disciplinas");
  const [modal, setModal] = useState<"vincular" | "matricular" | null>(null);
  const [buscaAluno, setBuscaAluno] = useState("");
  const [verInativos, setVerInativos] = useState(false);

  const { data, isLoading, error, refetch } = useDetalheTurma(turma.id);
  const { data: professores = [] } = usePessoas("professor");
  const arquivar = useArquivarTurma();
  const excluir = useExcluirTurma();
  const trocar = useTrocarProfessor();
  const remover = useRemoverDisciplina();
  const statusMat = useStatusMatricula();

  const salas = data?.salas ?? [];
  const matriculas = data?.matriculas ?? [];
  const ativos = matriculas.filter((m) => m.status === "ativa");
  const lista = matriculas.filter(
    (m) =>
      (verInativos || m.status === "ativa") &&
      normalizar(`${m.aluno.nome} ${m.aluno.matricula ?? ""}`).includes(
        normalizar(buscaAluno),
      ),
  );

  const executar = (p: Promise<unknown>, msg: string) =>
    p.then(() => aviso.ok(msg)).catch(aviso.erro);

  const handleExcluir = () => {
    if (salas.length || matriculas.length)
      return aviso.erro(
        new Error("Turma com vínculos não pode ser excluída. Arquive-a."),
      );
    if (confirm(`Excluir a turma "${turma.nome}"? Não dá para desfazer.`))
      excluir
        .mutateAsync(turma.id)
        .then(() => {
          aviso.ok("Turma excluída 🗑️");
          onExcluida();
        })
        .catch(aviso.erro);
  };

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden space-y-4">
        <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-primary/5" />
        <div className="relative flex flex-wrap items-center gap-4">
          <IconBubble icone={Users} cor={turma.ativa ? "primary" : "violet"} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold text-ink truncate">
                {turma.nome}
              </h2>
              {!turma.ativa && <Badge variant="neutral">Arquivada</Badge>}
            </div>
            <p className="text-xs text-slate-400">
              Ano letivo {turma.ano_letivo ?? "não definido"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              icon={<Pencil size={14} />}
              onClick={onEditar}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon={
                turma.ativa ? (
                  <Archive size={14} />
                ) : (
                  <ArchiveRestore size={14} />
                )
              }
              disabled={arquivar.isPending}
              onClick={() =>
                (!turma.ativa ||
                  confirm(
                    "Arquivar a turma? Ela deixa de aceitar matrículas.",
                  )) &&
                executar(
                  arquivar.mutateAsync({ id: turma.id, ativa: !turma.ativa }),
                  turma.ativa ? "Turma arquivada 📦" : "Turma reativada ✅",
                )
              }
            >
              {turma.ativa ? "Arquivar" : "Reativar"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              icon={<Trash2 size={14} />}
              aria-label="Excluir turma"
              onClick={handleExcluir}
            />
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-3">
          {[
            { l: "Alunos ativos", v: ativos.length },
            { l: "Disciplinas", v: salas.length },
            { l: "Sem professor", v: salas.filter((s) => !s.professor).length },
          ].map((k) => (
            <div key={k.l} className="p-3 rounded-xl bg-slate-50">
              <p className="text-[11px] text-slate-400">{k.l}</p>
              <p className="text-xl font-extrabold text-ink tabular">
                {isLoading ? "…" : k.v}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <nav className="flex gap-1.5 p-1.5 rounded-2xl bg-white shadow-flat w-fit">
        {(
          [
            { id: "disciplinas", l: "Disciplinas e professores", i: BookOpen },
            { id: "alunos", l: `Alunos (${ativos.length})`, i: GraduationCap },
          ] as const
        ).map(({ id, l, i: I }) => (
          <button
            key={id}
            onClick={() => setAba(id)}
            className={cn(
              "flex items-center gap-2 px-4 h-10 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
              aba === id
                ? "bg-brand text-white shadow-glow"
                : "text-slate-500 hover:bg-primary/5 hover:text-primary",
            )}
          >
            <I size={15} /> {l}
          </button>
        ))}
      </nav>

      <EstadoConsulta
        carregando={isLoading}
        erro={error ? (error as Error).message : null}
        vazio={false}
        textoVazio=""
        onTentar={() => refetch()}
      >
        {aba === "disciplinas" ? (
          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-extrabold text-ink">Grade da turma</h3>
              <Button
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => setModal("vincular")}
              >
                Adicionar disciplina
              </Button>
            </div>
            {!salas.length ? (
              <p className="text-sm text-slate-400 text-center py-6">
                Nenhuma disciplina ainda. Comece montando a grade 📚
              </p>
            ) : (
              <ul className="space-y-2">
                {salas.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-50"
                  >
                    <div className="flex-1 min-w-[160px]">
                      <p className="text-sm font-bold text-ink">
                        {s.disciplina.nome}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {s.disciplina.carga_horaria
                          ? `${s.disciplina.carga_horaria}h`
                          : "Carga horária não definida"}
                        {!s.professor && (
                          <span className="text-amber-600 font-bold">
                            {" "}
                            · sem professor
                          </span>
                        )}
                      </p>
                    </div>
                    <select
                      aria-label={`Professor de ${s.disciplina.nome}`}
                      value={s.professor?.id ?? ""}
                      disabled={trocar.isPending}
                      onChange={(e) =>
                        executar(
                          trocar.mutateAsync({
                            salaId: s.id,
                            professorId: e.target.value || null,
                          }),
                          "Professor atualizado 👩‍🏫",
                        )
                      }
                      className={cn(inputCls, "w-56")}
                    >
                      <option value="">Sem professor</option>
                      {professores.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome}
                        </option>
                      ))}
                    </select>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<Trash2 size={14} />}
                      aria-label="Remover disciplina"
                      onClick={() =>
                        confirm(`Remover ${s.disciplina.nome} desta turma?`) &&
                        executar(
                          remover.mutateAsync(s.id),
                          "Disciplina removida da turma",
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ) : (
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                placeholder="Buscar aluno…"
                value={buscaAluno}
                onChange={(e) => setBuscaAluno(e.target.value)}
                className={cn(inputCls, "flex-1 min-w-[180px]")}
              />
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <input
                  type="checkbox"
                  checked={verInativos}
                  onChange={(e) => setVerInativos(e.target.checked)}
                />
                Mostrar inativos
              </label>
              <Button
                size="sm"
                icon={<UserPlus size={14} />}
                disabled={!turma.ativa}
                onClick={() => setModal("matricular")}
              >
                Matricular
              </Button>
            </div>
            {!lista.length ? (
              <p className="text-sm text-slate-400 text-center py-6">
                {matriculas.length
                  ? "Ninguém encontrado nessa busca 🔎"
                  : "Nenhum aluno matriculado ainda 🎓"}
              </p>
            ) : (
              <ul className="space-y-2">
                {lista.map((m) => {
                  const selo = SELO_MAT[m.status] ?? SELO_MAT.inativa;
                  const ativa = m.status === "ativa";
                  return (
                    <li
                      key={m.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-ink truncate">
                          {m.aluno.nome}
                        </p>
                        <p className="text-[11px] text-slate-400 tabular">
                          {m.aluno.matricula
                            ? `Mat. ${m.aluno.matricula}`
                            : "Sem matrícula"}
                        </p>
                      </div>
                      <Badge variant={selo.v}>{selo.l}</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={
                          statusMat.isPending || (!ativa && !turma.ativa)
                        }
                        onClick={() =>
                          (!ativa ||
                            confirm(
                              `Desativar a matrícula de ${m.aluno.nome}? O histórico é mantido.`,
                            )) &&
                          executar(
                            statusMat.mutateAsync({
                              id: m.id,
                              status: ativa ? "inativa" : "ativa",
                            }),
                            ativa
                              ? "Matrícula desativada"
                              : "Matrícula reativada ✅",
                          )
                        }
                      >
                        {ativa ? "Desativar" : "Reativar"}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        )}
      </EstadoConsulta>

      {modal === "vincular" && (
        <ModalVincular
          aberto
          turmaId={turma.id}
          jaVinculadas={salas.map((s) => s.disciplina.id)}
          onFechar={() => setModal(null)}
          aviso={aviso}
        />
      )}
      {modal === "matricular" && (
        <ModalMatricular
          aberto
          turmaId={turma.id}
          jaAtivos={ativos.map((m) => m.aluno.id)}
          onFechar={() => setModal(null)}
          aviso={aviso}
        />
      )}
    </div>
  );
};
