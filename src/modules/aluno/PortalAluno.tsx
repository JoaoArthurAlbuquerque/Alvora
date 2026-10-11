// =====================================================================
// src/modules/aluno/PortalAluno.tsx
// =====================================================================
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Calculator,
  CalendarX,
  Trophy,
  CalendarCheck,
  ClipboardList,
  BookOpen,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Badge } from "../../core/ui/Badge";
import { Button } from "../../core/ui/Button";
import { IconBubble, type CorBubble } from "../../core/ui/IconBubble";
import { AcessoRapido, type Atalho } from "../../core/ui/AcessoRapido";
import { situacaoFrequencia } from "../../services/diarioStore";
import { useRegras } from "../../services/regrasService";
import { cn } from "../../core/lib/utils";
import { useAlunoDados } from "./useAlunoDados";
import { BADGE_FREQ, COR_BARRA, CORES_DISC, semestreAtual } from "./constantes";

const saudacao = () => {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
};
const fmtNota = (n: number) => n.toFixed(1).replace(".", ",");

const ATALHOS: Atalho[] = [
  {
    titulo: "Justificar falta",
    descricao: "Envie atestado ou comprovante.",
    icone: CalendarX,
    cor: "rose",
    to: "/aluno/frequencia",
  },
  {
    titulo: "Simular AV2",
    descricao: "Descubra quanto precisa tirar.",
    icone: Calculator,
    cor: "primary",
    to: "/aluno/boletim",
  },
  {
    titulo: "Pedir documento",
    descricao: "Declarações e requerimentos.",
    icone: FileText,
    cor: "cyan",
    to: "/aluno/secretaria",
  },
];

export const PortalAluno: React.FC = () => {
  const navigate = useNavigate();
  const { aluno, historico, boletim, frequenciaGlobal, mediaGeral } =
    useAlunoDados();
  const { frequenciaMinima: FREQ_MINIMA, mediaMinima: MEDIA_MINIMA } =
    useRegras();

  const disciplinas = historico.map((h) => {
    const b = boletim.find((x) => x.id === h.disciplinaId);
    const media = b?.mediaParcial ?? undefined;
    return {
      ...h,
      media,
      professor: b?.professorNome,
      notaEmRisco: typeof media === "number" && media < MEDIA_MINIMA,
      situacao: situacaoFrequencia(h.percentualFrequencia),
    };
  });
  const atencao = disciplinas.filter(
    (d) => d.situacao !== "segura" || d.notaEmRisco,
  );
  const av2Pendentes = boletim.filter((b) => b.av2 === null).length;

  const stats = [
    {
      label: "Média geral",
      valor: mediaGeral !== null ? mediaGeral.toFixed(1) : "—",
      dica:
        mediaGeral === null
          ? "Sem notas lançadas"
          : mediaGeral >= MEDIA_MINIMA
            ? "Acima da média 🎯"
            : `Abaixo de ${fmtNota(MEDIA_MINIMA)}`,
      icone: Trophy,
      cor: "violet" as CorBubble,
    },
    {
      label: "Frequência",
      valor: `${frequenciaGlobal.toFixed(1)}%`,
      dica: `Mínimo: ${FREQ_MINIMA}%`,
      icone: CalendarCheck,
      cor: "emerald" as CorBubble,
    },
    {
      label: "AV2 pendentes",
      valor: String(av2Pendentes),
      dica: av2Pendentes ? "Simule sua nota" : "Tudo lançado 🎉",
      icone: ClipboardList,
      cor: "amber" as CorBubble,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-brand p-6 sm:p-8 text-white shadow-glow">
        <div className="absolute -right-16 -top-20 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute right-24 -bottom-24 w-56 h-56 rounded-full bg-white/10" />
        <div
          aria-hidden
          className="absolute right-10 top-8 hidden sm:flex gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center animate-float">
            <GraduationCap size={30} />
          </div>
          <div className="w-12 h-12 mt-10 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center animate-float [animation-delay:1.5s]">
            <BookOpen size={22} />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center animate-float [animation-delay:3s]">
            <Trophy size={24} />
          </div>
        </div>
        <div className="relative max-w-lg">
          <p className="text-xs font-semibold text-white/75">
            {[aluno.curso, semestreAtual(), `Mat. ${aluno.matricula}`]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
            {saudacao()}, {aluno.nome.split(" ")[0]}! 👋
          </h1>
          <p className="text-sm text-white/85 mt-2">
            {atencao.length
              ? `${atencao.length} disciplina${atencao.length > 1 ? "s pedem" : " pede"} sua atenção. Bora resolver?`
              : "Tudo em dia por aqui. Continue arrasando! 🚀"}
          </p>
        </div>
      </section>

      {/* Números: informação, sem hover */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-4">
            <IconBubble icone={s.icone} cor={s.cor} />
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
              <p className="text-2xl font-extrabold text-ink tabular">
                {s.valor}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{s.dica}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Avisos */}
      {atencao.length > 0 && (
        <div className="space-y-3 stagger">
          {atencao.map((d) => (
            <div
              key={d.disciplinaId}
              role="status"
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-white shadow-flat border-l-4 border-amber-400"
            >
              <IconBubble icone={AlertTriangle} cor="amber" tamanho="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink">{d.disciplinaNome}</p>
                <p className="text-xs text-slate-500">
                  {d.situacao !== "segura" &&
                    `${d.percentualFrequencia}% de frequência · ${d.faltas} faltas`}
                  {d.situacao !== "segura" && d.notaEmRisco && " · "}
                  {d.notaEmRisco && `média ${d.media?.toFixed(1)}`}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  navigate(
                    d.notaEmRisco ? "/aluno/boletim" : "/aluno/frequencia",
                  )
                }
              >
                Ver detalhes <ArrowRight size={14} aria-hidden />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Disciplinas: conteúdo, sem hover */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-ink">Suas disciplinas</h2>
          <Link
            to="/aluno/disciplinas"
            className="group text-sm font-semibold text-primary flex items-center gap-1 rounded-full px-2 -mx-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
          >
            Ver todas
            <ArrowRight
              size={14}
              aria-hidden
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
        {!disciplinas.length ? (
          <Card className="text-center text-sm text-slate-500 py-8">
            Nenhuma disciplina com aulas registradas ainda 📚
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
            {disciplinas.map((d, i) => (
              <Card key={d.disciplinaId} className="space-y-4">
                <div className="flex items-start gap-4">
                  <IconBubble
                    icone={BookOpen}
                    cor={CORES_DISC[i % CORES_DISC.length]}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink truncate">
                      {d.disciplinaNome}
                    </p>
                    {d.professor && (
                      <p className="text-xs text-slate-500 truncate">
                        {d.professor}
                      </p>
                    )}
                  </div>
                  <Badge variant={BADGE_FREQ[d.situacao].variant}>
                    {BADGE_FREQ[d.situacao].label}
                  </Badge>
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1.5 tabular">
                      <span>Frequência</span>
                      <span className="text-ink font-bold">
                        {d.percentualFrequencia}%
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={`Frequência em ${d.disciplinaNome}`}
                      aria-valuenow={Math.round(d.percentualFrequencia)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="h-2 bg-slate-100 rounded-full overflow-hidden"
                    >
                      <div
                        className={cn(
                          "h-full rounded-full animate-grow",
                          COR_BARRA[d.situacao],
                        )}
                        style={{ width: `${d.percentualFrequencia}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-medium text-slate-500">
                      Média
                    </p>
                    <p
                      className={cn(
                        "text-xl font-extrabold tabular",
                        d.notaEmRisco ? "text-rose-500" : "text-primary",
                      )}
                    >
                      {d.media?.toFixed(1) ?? "—"}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Atalhos: ação, visual próprio */}
      <AcessoRapido itens={ATALHOS} />
    </div>
  );
};
