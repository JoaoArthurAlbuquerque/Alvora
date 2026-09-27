import React from "react";
import {
  Plus,
  Download,
  FileText,
  Receipt,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { Button } from "../../core/ui/Button";
import { PageHeader } from "../../core/ui/PageHeader";
import { IconBubble } from "../../core/ui/IconBubble";
import { requerimentosMock, boletosMock } from "../../mocks/data";
import { cn } from "../../core/lib/utils";

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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
    <ul className="space-y-2 stagger">{children}</ul>
  </Card>
);

const Item: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 hover:translate-x-1 transition-all">
    {children}
  </li>
);

export const SecretariaAluno: React.FC = () => {
  const emAberto = boletosMock.filter((b) => b.status !== "Pago");
  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Secretaria"
        descricao="Documentos, requerimentos e financeiro."
      />

      {emAberto.length > 0 && (
        <div className="relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl bg-brand text-white shadow-glow animate-fade-up">
          <div className="absolute -right-10 -top-12 w-40 h-40 rounded-full bg-white/10" />
          <Receipt size={26} className="relative animate-float" />
          <div className="relative flex-1">
            <p className="text-sm font-bold">
              {emAberto.length} boleto{emAberto.length > 1 && "s"} em aberto
            </p>
            <p className="text-xs text-white/80 tabular">
              Total: {brl(emAberto.reduce((a, b) => a + b.valor, 0))}
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 items-start">
        <Secao
          titulo="Requerimentos"
          icone={FileText}
          cor="primary"
          acao={
            <Button size="sm" icon={<Plus size={14} />}>
              Novo
            </Button>
          }
        >
          {requerimentosMock.map((r) => {
            const ok = r.status === "Concluído";
            return (
              <Item key={r.id}>
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                    ok
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-amber-100 text-amber-600",
                  )}
                >
                  {ok ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <Clock size={17} className="animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {r.titulo}
                  </p>
                  <p className="text-xs text-slate-400 tabular">
                    #{r.protocolo} · {r.dataSolicitacao}
                  </p>
                </div>
                <Badge variant={ok ? "success" : "warning"}>{r.status}</Badge>
              </Item>
            );
          })}
        </Secao>

        <Secao titulo="Financeiro" icone={Receipt} cor="emerald">
          {boletosMock.map((b) => {
            const pago = b.status === "Pago";
            return (
              <Item key={b.id}>
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                    pago
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  {pago ? <CheckCircle2 size={17} /> : <Receipt size={17} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {b.referencia}
                  </p>
                  <p className="text-xs text-slate-400 tabular">
                    Vence {b.vencimento}
                  </p>
                </div>
                <span className="text-sm font-extrabold text-ink tabular">
                  {brl(b.valor)}
                </span>
                {pago ? (
                  <Badge variant="success">Pago</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Download size={14} />}
                  >
                    Boleto
                  </Button>
                )}
              </Item>
            );
          })}
        </Secao>
      </div>
    </div>
  );
};
