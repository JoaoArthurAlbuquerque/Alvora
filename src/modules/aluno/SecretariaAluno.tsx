// =====================================================================
// src/modules/aluno/SecretariaAluno.tsx
// =====================================================================
import React, { useState } from "react";
import {
  Plus,
  FileText,
  Receipt,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { Button } from "../../core/ui/Button";
import { Modal } from "../../core/ui/Modal";
import { PageHeader } from "../../core/ui/PageHeader";
import { IconBubble } from "../../core/ui/IconBubble";
import { EstadoConsulta } from "../../core/ui/EstadoConsulta";
import {
  TIPOS_REQUERIMENTO,
  useMeusRequerimentos,
  useNovoRequerimento,
  type RequerimentoAluno,
} from "../../services/alunoApi";
import { cn } from "../../core/lib/utils";

const VISUAL_REQ: Record<
  RequerimentoAluno["status"],
  {
    cls: string;
    icone: React.ReactNode;
    badge: "success" | "warning" | "danger";
  }
> = {
  Concluído: {
    cls: "bg-emerald-100 text-emerald-600",
    icone: <CheckCircle2 size={17} />,
    badge: "success",
  },
  "Em Análise": {
    cls: "bg-amber-100 text-amber-600",
    icone: <Clock size={17} />,
    badge: "warning",
  },
  Indeferido: {
    cls: "bg-rose-100 text-rose-600",
    icone: <XCircle size={17} />,
    badge: "danger",
  },
};

const dataBR = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { timeZone: "America/Fortaleza" });

const Secao: React.FC<{
  titulo: string;
  icone: React.ElementType;
  cor: "primary" | "emerald";
  acao?: React.ReactNode;
  children: React.ReactNode;
}> = ({ titulo, icone, cor, acao, children }) => (
  <Card className="space-y-4">
    <div className="flex items-center gap-3">
      <IconBubble icone={icone} cor={cor} tamanho="sm" />
      <h2 className="flex-1 text-lg font-extrabold text-ink">{titulo}</h2>
      {acao}
    </div>
    {children}
  </Card>
);

export const SecretariaAluno: React.FC = () => {
  const { data: reqs = [], isLoading, error, refetch } = useMeusRequerimentos();
  const novo = useNovoRequerimento();
  const [aberto, setAberto] = useState(false);
  const [tipo, setTipo] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    try {
      await novo.mutateAsync(tipo);
      setAberto(false);
      setTipo("");
    } catch (er) {
      setErro((er as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Secretaria"
        descricao="Documentos, requerimentos e financeiro."
      />

      <div className="grid md:grid-cols-2 gap-4 items-start">
        <Secao
          titulo="Requerimentos"
          icone={FileText}
          cor="primary"
          acao={
            <Button
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setAberto(true)}
            >
              Novo
            </Button>
          }
        >
          <EstadoConsulta
            carregando={isLoading}
            erro={error ? (error as Error).message : null}
            vazio={!reqs.length}
            textoVazio="Nenhum requerimento ainda. Precisa de um documento? Clique em Novo 📄"
            onTentar={() => refetch()}
          >
            <ul className="space-y-2 stagger">
              {reqs.map((r) => {
                const v = VISUAL_REQ[r.status] ?? VISUAL_REQ["Em Análise"];
                return (
                  <li
                    key={r.id}
                    className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 rounded-xl bg-slate-50"
                  >
                    <div
                      aria-hidden
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                        v.cls,
                      )}
                    >
                      {v.icone}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-ink truncate">
                        {r.titulo}
                      </p>
                      <p className="text-xs text-slate-500 tabular">
                        #{r.protocolo} · {dataBR(r.created_at)}
                      </p>
                    </div>
                    <Badge variant={v.badge}>{r.status}</Badge>
                  </li>
                );
              })}
            </ul>
          </EstadoConsulta>
        </Secao>

        <Secao titulo="Financeiro" icone={Receipt} cor="emerald">
          <p className="text-sm text-slate-500 text-center py-6">
            Boletos em breve por aqui 💳
            <br />
            <span className="text-xs">
              Enquanto isso, fale com a secretaria.
            </span>
          </p>
        </Secao>
      </div>

      <Modal
        isOpen={aberto}
        onClose={() => setAberto(false)}
        title="Novo requerimento"
      >
        <form onSubmit={enviar} className="space-y-4">
          <div className="grid gap-2">
            {TIPOS_REQUERIMENTO.map((t) => (
              <label
                key={t}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                  tipo === t
                    ? "border-primary/40 bg-primary/5"
                    : "border-slate-200 hover:bg-slate-50",
                )}
              >
                <input
                  type="radio"
                  name="tipo"
                  checked={tipo === t}
                  onChange={() => setTipo(t)}
                />
                <span className="text-sm font-semibold text-ink">{t}</span>
              </label>
            ))}
          </div>
          {erro && (
            <p
              role="alert"
              className="text-sm text-rose-600 bg-rose-50 p-3 rounded-xl"
            >
              {erro}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!tipo || novo.isPending}
          >
            {novo.isPending ? "Enviando..." : "Enviar requerimento"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};
