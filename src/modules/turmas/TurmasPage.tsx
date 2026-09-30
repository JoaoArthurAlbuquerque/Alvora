import React, { useMemo, useState } from "react";
import { ChevronDown, Search, Users, BookOpen, RefreshCw } from "lucide-react";
import { Card } from "@/core/ui/Card";
import { PageHeader } from "@/core/ui/PageHeader";
import { Badge } from "@/core/ui/Badge";
import { Button } from "@/core/ui/Button";
import { IconBubble } from "@/core/ui/IconBubble";
import { EstadoConsulta } from "@/core/ui/EstadoConsulta";
import { cn } from "@/core/lib/utils";
import { useAuthStore } from "@/core/auth/useAuthStore";
import { carregarEscola, useConsulta } from "@/services/escolaService";
import { iniciais } from "../gestor/constantes";

export const TurmasPage: React.FC = () => {
  const usuario = useAuthStore((s) => s.usuario);
  const { data, erro, carregando, recarregar } = useConsulta(carregarEscola);
  const [busca, setBusca] = useState("");
  const [aberta, setAberta] = useState<string | null>(null);
  const ehProfessor = usuario?.papel === "professor";

  const turmas = useMemo(() => {
    const q = busca.toLowerCase();
    return (data?.turmas ?? [])
      .filter(
        (t) =>
          !ehProfessor ||
          t.disciplinas.some((d) => d.professorId === usuario?.id),
      )
      .filter(
        (t) =>
          !q ||
          [t.nome, t.curso, ...t.alunos.map((a) => a.nome)].some((s) =>
            s.toLowerCase().includes(q),
          ),
      );
  }, [data, busca, ehProfessor, usuario?.id]);

  return (
    <div className="space-y-6">
      <PageHeader
        titulo={ehProfessor ? "Minhas turmas" : "Alunos & Turmas"}
        descricao={`${turmas.length} turma(s) na área 🎒`}
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
          placeholder="Buscar turma, curso ou aluno..."
          className="w-full h-11 pl-11 pr-4 rounded-xl border border-primary/15 bg-white text-sm outline-none focus:ring-4 focus:ring-primary/15"
        />
      </div>

      <EstadoConsulta
        carregando={carregando}
        erro={erro}
        vazio={!turmas.length}
        textoVazio="Nenhuma turma por aqui ainda."
        onTentar={recarregar}
      >
        <div className="space-y-3">
          {turmas.map((t) => {
            const abrir = aberta === t.id;
            const discs = ehProfessor
              ? t.disciplinas.filter((d) => d.professorId === usuario?.id)
              : t.disciplinas;
            return (
              <Card
                key={t.id}
                padded={false}
                className="overflow-hidden animate-fade-up"
              >
                <button
                  onClick={() => setAberta(abrir ? null : t.id)}
                  className="w-full flex items-center gap-4 p-5 text-left group"
                >
                  <IconBubble icone={Users} />
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-ink truncate">{t.nome}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {[t.curso, t.turno].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <Badge variant="primary">{t.alunos.length} alunos</Badge>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "text-slate-400 transition-transform",
                      abrir && "rotate-180",
                    )}
                  />
                </button>

                {abrir && (
                  <div className="px-5 pb-5 space-y-4 animate-fade-in">
                    <div className="flex flex-wrap gap-2">
                      {discs.map((d) => (
                        <Badge key={d.tdId} variant="neutral">
                          <BookOpen size={11} /> {d.nome} · {d.professorNome}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {t.alunos.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50"
                        >
                          <span className="w-8 h-8 rounded-lg bg-brand text-white text-[11px] font-bold flex items-center justify-center">
                            {iniciais(a.nome)}
                          </span>
                          <span className="text-xs font-semibold text-ink truncate">
                            {a.nome}
                          </span>
                        </div>
                      ))}
                      {!t.alunos.length && (
                        <p className="text-xs text-slate-400">
                          Sem alunos matriculados.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </EstadoConsulta>
    </div>
  );
};
