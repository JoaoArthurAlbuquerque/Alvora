// =====================================================================
// src/modules/gestor/turmas/ModaisTurma.tsx
// =====================================================================
import React, { useMemo, useState } from "react";
import { Modal } from "../../../core/ui/Modal";
import { Button } from "../../../core/ui/Button";
import {
  erroGestao,
  useCriarDisciplina,
  useDisciplinas,
  useMatricular,
  usePessoas,
  useSalvarTurma,
  useVincularDisciplina,
  validarTurma,
  type TurmaGestao,
} from "../../../services/api/gestao";
import { Campo, ErroForm } from "./ui";
import { inputCls, normalizar, type Aviso } from "./helpers";

/** Criar / editar turma */
export const ModalTurma: React.FC<{
  turma: TurmaGestao | null; // null = nova
  aberto: boolean;
  onFechar: () => void;
  onSalva: (id: string) => void;
  aviso: Aviso;
}> = ({ turma, aberto, onFechar, onSalva, aviso }) => {
  const [nome, setNome] = useState(turma?.nome ?? "");
  const [ano, setAno] = useState(
    String(turma?.ano_letivo ?? new Date().getFullYear()),
  );
  const [erro, setErro] = useState<string | null>(null);
  const salvar = useSalvarTurma();

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = { id: turma?.id, nome, ano_letivo: ano ? Number(ano) : null };
    const v = validarTurma(form);
    if (v) return setErro(v);
    try {
      const id = await salvar.mutateAsync(form);
      aviso.ok(turma ? "Turma atualizada ✏️" : "Turma criada 🎉");
      onSalva(id);
      onFechar();
    } catch (er) {
      setErro(erroGestao(er));
    }
  };

  return (
    <Modal
      isOpen={aberto}
      onClose={onFechar}
      title={turma ? "Editar turma" : "Nova turma"}
    >
      <form onSubmit={enviar} className="space-y-4">
        <Campo label="Nome da turma" dica="Ex.: 1º Ano A, 9º B – Manhã">
          <input
            autoFocus
            maxLength={80}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={inputCls}
          />
        </Campo>
        <Campo label="Ano letivo">
          <input
            type="number"
            min={2000}
            max={2100}
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className={inputCls}
          />
        </Campo>
        <ErroForm erro={erro} />
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onFechar}
          >
            Cancelar
          </Button>
          <Button type="submit" className="w-full" disabled={salvar.isPending}>
            {salvar.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

/** Adicionar disciplina à turma + professor responsável */
export const ModalVincular: React.FC<{
  turmaId: string;
  jaVinculadas: string[];
  aberto: boolean;
  onFechar: () => void;
  aviso: Aviso;
}> = ({ turmaId, jaVinculadas, aberto, onFechar, aviso }) => {
  const { data: disciplinas = [] } = useDisciplinas();
  const { data: professores = [], isLoading } = usePessoas("professor");
  const vincular = useVincularDisciplina(turmaId);
  const criar = useCriarDisciplina();
  const [disciplinaId, setDisciplinaId] = useState("");
  const [professorId, setProfessorId] = useState("");
  const [nova, setNova] = useState({ ativa: false, nome: "", carga: "" });
  const [erro, setErro] = useState<string | null>(null);

  const livres = disciplinas.filter((d) => !jaVinculadas.includes(d.id));
  const ocupado = vincular.isPending || criar.isPending;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    try {
      const id = nova.ativa
        ? await criar.mutateAsync({
            nome: nova.nome,
            carga_horaria: nova.carga ? Number(nova.carga) : null,
          })
        : disciplinaId;
      await vincular.mutateAsync({
        disciplinaId: id,
        professorId: professorId || null,
      });
      aviso.ok("Disciplina vinculada à turma 📚");
      onFechar();
    } catch (er) {
      setErro(erroGestao(er));
    }
  };

  return (
    <Modal isOpen={aberto} onClose={onFechar} title="Adicionar disciplina">
      <form onSubmit={enviar} className="space-y-4">
        {nova.ativa ? (
          <div className="grid grid-cols-[1fr_110px] gap-3">
            <Campo label="Nova disciplina">
              <input
                autoFocus
                maxLength={80}
                value={nova.nome}
                onChange={(e) => setNova({ ...nova, nome: e.target.value })}
                className={inputCls}
              />
            </Campo>
            <Campo label="Carga (h)">
              <input
                type="number"
                min={1}
                max={2000}
                value={nova.carga}
                onChange={(e) => setNova({ ...nova, carga: e.target.value })}
                className={inputCls}
              />
            </Campo>
          </div>
        ) : (
          <Campo label="Disciplina">
            <select
              value={disciplinaId}
              onChange={(e) => setDisciplinaId(e.target.value)}
              className={inputCls}
            >
              <option value="">Selecione…</option>
              {livres.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                  {d.carga_horaria ? ` · ${d.carga_horaria}h` : ""}
                </option>
              ))}
            </select>
          </Campo>
        )}
        <button
          type="button"
          className="text-xs font-bold text-primary hover:underline"
          onClick={() => setNova({ ...nova, ativa: !nova.ativa })}
        >
          {nova.ativa
            ? "← Escolher uma disciplina existente"
            : "+ Cadastrar nova disciplina"}
        </button>

        <Campo
          label="Professor responsável"
          dica={
            professores.length
              ? "Pode ficar vazio e ser definido depois."
              : "Nenhum professor cadastrado. Crie em Usuários."
          }
        >
          <select
            value={professorId}
            onChange={(e) => setProfessorId(e.target.value)}
            className={inputCls}
            disabled={isLoading}
          >
            <option value="">Sem professor por enquanto</option>
            {professores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </Campo>

        <ErroForm erro={erro} />
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onFechar}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="w-full"
            disabled={ocupado || (!nova.ativa && !disciplinaId)}
          >
            {ocupado ? "Salvando..." : "Vincular"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

/** Matricular vários alunos de uma vez */
export const ModalMatricular: React.FC<{
  turmaId: string;
  jaAtivos: string[];
  aberto: boolean;
  onFechar: () => void;
  aviso: Aviso;
}> = ({ turmaId, jaAtivos, aberto, onFechar, aviso }) => {
  const { data: alunos = [], isLoading } = usePessoas("aluno");
  const matricular = useMatricular(turmaId);
  const [busca, setBusca] = useState("");
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [erro, setErro] = useState<string | null>(null);

  const disponiveis = useMemo(
    () =>
      alunos.filter(
        (a) =>
          !jaAtivos.includes(a.id) &&
          normalizar(`${a.nome} ${a.matricula ?? ""}`).includes(
            normalizar(busca),
          ),
      ),
    [alunos, jaAtivos, busca],
  );

  const todos =
    disponiveis.length > 0 && disponiveis.every((a) => sel.has(a.id));

  const alternar = (id: string) =>
    setSel((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const alternarTodos = () =>
    setSel((s) => {
      const n = new Set(s);
      disponiveis.forEach((a) => (todos ? n.delete(a.id) : n.add(a.id)));
      return n;
    });

  const enviar = async () => {
    setErro(null);
    try {
      const n = await matricular.mutateAsync([...sel]);
      aviso.ok(`${n} aluno(s) matriculado(s) 🎓`);
      onFechar();
    } catch (er) {
      setErro(erroGestao(er));
    }
  };

  return (
    <Modal isOpen={aberto} onClose={onFechar} title="Matricular alunos">
      <div className="space-y-4">
        <input
          autoFocus
          placeholder="Buscar por nome ou matrícula…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className={inputCls}
        />
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 font-bold text-slate-500">
            <input type="checkbox" checked={todos} onChange={alternarTodos} />
            Selecionar todos da busca
          </label>
          <span className="text-slate-400">{sel.size} selecionado(s)</span>
        </div>

        <ul className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
          {isLoading && (
            <li className="text-sm text-slate-400 text-center py-6">
              Carregando alunos... ⏳
            </li>
          )}
          {!isLoading && !disponiveis.length && (
            <li className="text-sm text-slate-400 text-center py-6">
              Nenhum aluno disponível. Cadastre novos em Usuários.
            </li>
          )}
          {disponiveis.map((a) => (
            <li key={a.id}>
              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-primary/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sel.has(a.id)}
                  onChange={() => alternar(a.id)}
                />
                <span className="flex-1 text-sm font-semibold text-ink truncate">
                  {a.nome}
                </span>
                <span className="text-[11px] text-slate-400 tabular">
                  {a.matricula ?? "sem matrícula"}
                </span>
              </label>
            </li>
          ))}
        </ul>

        <ErroForm erro={erro} />
        <div className="flex gap-3">
          <Button variant="outline" className="w-full" onClick={onFechar}>
            Cancelar
          </Button>
          <Button
            className="w-full"
            onClick={enviar}
            disabled={!sel.size || matricular.isPending}
          >
            {matricular.isPending
              ? "Matriculando..."
              : `Matricular ${sel.size || ""}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
