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
import { boletimAlunoMock } from "../../mocks/data";
import { situacaoFrequencia, FREQ_MINIMA } from "../../services/diarioStore";
import { cn } from "../../core/lib/utils";
import { useAlunoDados } from "./useAlunoDados";
import { BADGE_FREQ, semestreAtual } from "./constantes";

const saudacao = () => {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
};
const corBarra = {
  segura: "bg-brand",
  atencao: "bg-gradient-to-r from-amber-400 to-amber-500",
  reprovado: "bg-gradient-to-r from-rose-400 to-rose-500",
};
const coresDisc: CorBubble[] = [
  "primary",
  "violet",
  "cyan",
  "emerald",
  "amber",
  "rose",
];

export const PortalAluno: React.FC = () => {
  const navigate = useNavigate();
  const { aluno, historico, frequenciaGlobal } = useAlunoDados();

  const disciplinas = historico.map((h) => {
    const b = boletimAlunoMock.find((x) => x.id === h.disciplinaId);
    return {
      ...h,
      media: b?.mediaParcial,
      professor: b?.professorNome,
      notaEmRisco: b?.status === "Em Risco",
      situacao: situacaoFrequencia(h.percentualFrequencia),
    };
  });
  const atencao = disciplinas.filter(
    (d) => d.situacao !== "segura" || d.notaEmRisco,
  );
  const av2Pendentes = boletimAlunoMock.filter((b) => b.av2 === null).length;

  const stats = [
    {
      label: "Média geral",
      valor: aluno.mediaGeral.toFixed(1),
      dica: aluno.mediaGeral >= 7 ? "Acima da média 🎯" : "Abaixo de 7,0",
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

  const atalhos = [
    {
      label: "Justificar falta",
      desc: "Envie atestado ou comprovante.",
      icone: CalendarX,
      cor: "rose" as CorBubble,
      to: "/aluno/frequencia",
    },
    {
      label: "Simular AV2",
      desc: "Descubra quanto precisa tirar.",
      icone: Calculator,
      cor: "primary" as CorBubble,
      to: "/aluno/boletim",
    },
    {
      label: "Pedir documento",
      desc: "Declarações e requerimentos.",
      icone: FileText,
      cor: "cyan" as CorBubble,
      to: "/aluno/secretaria",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-brand p-6 sm:p-8 text-white shadow-glow">
        <div className="absolute -right-16 -top-20 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute right-24 -bottom-24 w-56 h-56 rounded-full bg-white/10" />
        <div className="absolute right-10 top-8 hidden sm:flex gap-4">
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
            {aluno.curso} · {semestreAtual()} · Mat. {aluno.matricula}
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

      {/* Números */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
        {stats.map((s) => (
          <Card key={s.label} hoverable className="flex items-center gap-4">
            <IconBubble icone={s.icone} cor={s.cor} />
            <div>
              <p className="text-xs font-medium text-slate-400">{s.label}</p>
              <p className="text-2xl font-extrabold text-ink tabular">
                {s.valor}
              </p>
              <p className="text-[11px] text-slate-400">{s.dica}</p>
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
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-white shadow-flat border-l-4 border-amber-400"
            >
              <IconBubble icone={AlertTriangle} cor="amber" tamanho="sm" />
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">{d.disciplinaNome}</p>
                <p className="text-xs text-slate-500">
                  {d.situacao !== "segura" &&
                    `${d.percentualFrequencia}% de frequência · ${d.faltas} faltas`}
                  {d.situacao !== "segura" && d.notaEmRisco && " · "}
                  {d.notaEmRisco && `média ${d.media}`}
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
                Ver detalhes <ArrowRight size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Disciplinas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-ink">Suas disciplinas</h2>
          <Link
            to="/aluno/disciplinas"
            className="group text-sm font-semibold text-primary flex items-center gap-1"
          >
            Ver todas{" "}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
          {disciplinas.map((d, i) => (
            <Card key={d.disciplinaId} hoverable className="space-y-4">
              <div className="flex items-start gap-4">
                <IconBubble
                  icone={BookOpen}
                  cor={coresDisc[i % coresDisc.length]}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ink truncate">
                    {d.disciplinaNome}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {d.professor}
                  </p>
                </div>
                <Badge variant={BADGE_FREQ[d.situacao].variant}>
                  {BADGE_FREQ[d.situacao].label}
                </Badge>
              </div>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1.5 tabular">
                    <span>Frequência</span>
                    <span className="text-ink font-bold">
                      {d.percentualFrequencia}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full animate-grow",
                        corBarra[d.situacao],
                      )}
                      style={{ width: `${d.percentualFrequencia}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-medium text-slate-400">
                    Média
                  </p>
                  <p className="text-xl font-extrabold text-primary tabular">
                    {d.media?.toFixed(1) ?? "—"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Atalhos */}
      <section className="space-y-4">
        <h2 className="text-lg font-extrabold text-ink">Acesso rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
          {atalhos.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="group flex items-center gap-4 p-5 rounded-2xl bg-white shadow-flat border border-white hover:-translate-y-1 hover:shadow-flat-2 hover:border-primary/15 transition-all duration-300"
            >
              <IconBubble icone={a.icone} cor={a.cor} />
              <div className="flex-1">
                <p className="text-sm font-bold text-ink">{a.label}</p>
                <p className="text-xs text-slate-400">{a.desc}</p>
              </div>
              <ArrowRight
                size={16}
                className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
