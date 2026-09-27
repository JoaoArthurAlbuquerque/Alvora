// src/modules/calendario/CalendarioModal.tsx
import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CalendarCheck,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Modal } from "../../core/ui/Modal";
import { cn } from "../../core/lib/utils";
import {
  useEventos,
  eventoStore,
  type Evento,
  type TipoEvento,
} from "../../services/eventoStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  podeEditar?: boolean; // true para professor/gestor
  autorId?: string;
}

type Rascunho = { titulo: string; tipo: TipoEvento; data: string };

const TIPOS: Record<TipoEvento, { label: string; ponto: string; cls: string }> =
  {
    entrega: {
      label: "Entrega",
      ponto: "bg-primary",
      cls: "bg-primary/10 text-primary",
    },
    avaliacao: {
      label: "Avaliação",
      ponto: "bg-rose-500",
      cls: "bg-rose-50 text-rose-600",
    },
    feriado: {
      label: "Feriado",
      ponto: "bg-emerald-500",
      cls: "bg-emerald-50 text-emerald-600",
    },
    evento: {
      label: "Evento",
      ponto: "bg-amber-500",
      cls: "bg-amber-50 text-amber-600",
    },
  };

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

const chave = (a: number, m: number, d: number) =>
  `${a}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const inputCls =
  "h-9 px-3 rounded-full border border-slate-200 bg-white text-xs text-ink focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition";

const iconBtn =
  "w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 transition";

export const CalendarioModal: React.FC<Props> = ({
  isOpen,
  onClose,
  podeEditar = false,
  autorId = "anon",
}) => {
  const eventos = useEventos();
  const hoje = new Date();
  const hojeKey = chave(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

  const [ref, setRef] = useState({
    ano: hoje.getFullYear(),
    mes: hoje.getMonth(),
  });
  const [sel, setSel] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<TipoEvento>("evento");
  const [editId, setEditId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<Rascunho>({
    titulo: "",
    tipo: "evento",
    data: "",
  });

  const porDia = useMemo(() => {
    const m = new Map<string, Evento[]>();
    eventos.forEach((e) => m.set(e.data, [...(m.get(e.data) ?? []), e]));
    return m;
  }, [eventos]);

  const celulas = useMemo(() => {
    const inicio = new Date(ref.ano, ref.mes, 1).getDay();
    const total = new Date(ref.ano, ref.mes + 1, 0).getDate();
    return [
      ...Array<null>(inicio).fill(null),
      ...Array.from({ length: total }, (_, i) => i + 1),
    ];
  }, [ref]);

  const mudarMes = (delta: number) => {
    setSel(null);
    setEditId(null);
    setRef(({ ano, mes }) => {
      const d = new Date(ano, mes + delta, 1);
      return { ano: d.getFullYear(), mes: d.getMonth() };
    });
  };

  const irHoje = () => {
    setRef({ ano: hoje.getFullYear(), mes: hoje.getMonth() });
    setSel(hojeKey);
  };

  const prefixoMes = chave(ref.ano, ref.mes, 1).slice(0, 7);
  const lista = (
    sel
      ? (porDia.get(sel) ?? [])
      : eventos.filter((e) => e.data.startsWith(prefixoMes))
  )
    .slice()
    .sort((a, b) => a.data.localeCompare(b.data));

  const adicionar = (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    if (!sel || !titulo.trim()) return;
    eventoStore.adicionar({
      data: sel,
      titulo: titulo.trim(),
      tipo,
      criadoPor: autorId,
    });
    setTitulo("");
  };

  const iniciarEdicao = (e: Evento) => {
    setEditId(e.id);
    setRascunho({ titulo: e.titulo, tipo: e.tipo, data: e.data });
  };

  const salvarEdicao = (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    if (!editId || !rascunho.titulo.trim() || !rascunho.data) return;
    eventoStore.atualizar(editId, {
      ...rascunho,
      titulo: rascunho.titulo.trim(),
    });
    setEditId(null);
    // se mudou a data, acompanha o evento no calendário
    if (sel && rascunho.data !== sel) {
      const [a, m] = rascunho.data.split("-").map(Number);
      setRef({ ano: a, mes: m - 1 });
      setSel(rascunho.data);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Calendário Acadêmico">
      <div className="space-y-5">
        {/* cabeçalho */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => mudarMes(-1)}
            aria-label="Mês anterior"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-primary/10 hover:text-primary transition"
          >
            <ChevronLeft size={18} />
          </button>
          <h3
            key={prefixoMes}
            className="flex-1 text-center text-lg font-extrabold text-ink animate-fade-in"
          >
            {MESES[ref.mes]}{" "}
            <span className="text-slate-400 font-semibold">{ref.ano}</span>
          </h3>
          <button
            onClick={() => mudarMes(1)}
            aria-label="Próximo mês"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-primary/10 hover:text-primary transition"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={irHoje}
            className="px-3 h-9 rounded-full text-xs font-bold bg-brand text-white shadow-glow hover:scale-105 transition"
          >
            Hoje
          </button>
        </div>

        {/* grade */}
        <div>
          <div className="grid grid-cols-7 mb-1">
            {SEMANA.map((d, i) => (
              <span
                key={i}
                className="text-center text-[11px] font-bold text-slate-400"
              >
                {d}
              </span>
            ))}
          </div>
          <div
            key={prefixoMes}
            className="grid grid-cols-7 gap-1 animate-fade-in"
          >
            {celulas.map((dia, i) => {
              if (!dia) return <span key={i} />;
              const k = chave(ref.ano, ref.mes, dia);
              const evs = porDia.get(k) ?? [];
              const ehHoje = k === hojeKey;
              const ativo = k === sel;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setSel(ativo ? null : k);
                    setEditId(null);
                  }}
                  className={cn(
                    "relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-semibold tabular transition-all",
                    ativo
                      ? "bg-brand text-white shadow-glow scale-105"
                      : ehHoje
                        ? "ring-2 ring-primary text-primary"
                        : "text-ink hover:bg-primary/5",
                  )}
                >
                  {dia}
                  {evs.length > 0 && (
                    <span className="absolute bottom-1.5 flex gap-0.5">
                      {evs.slice(0, 3).map((e) => (
                        <span
                          key={e.id}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            ativo ? "bg-white" : TIPOS[e.tipo].ponto,
                          )}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* legenda */}
        <div className="flex flex-wrap gap-3 text-[11px] text-slate-500">
          {Object.values(TIPOS).map((t) => (
            <span key={t.label} className="flex items-center gap-1.5">
              <span className={cn("w-2 h-2 rounded-full", t.ponto)} /> {t.label}
            </span>
          ))}
        </div>

        {/* eventos */}
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-extrabold text-ink">
            <CalendarDays size={14} className="text-primary" />
            {sel
              ? new Date(`${sel}T12:00`).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                })
              : "Neste mês"}
          </p>
          {lista.length === 0 ? (
            <p className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-700 animate-pop">
              <CalendarCheck size={14} /> Dia livre, só alegria! 🌴
            </p>
          ) : (
            <div key={sel ?? prefixoMes} className="space-y-2 stagger">
              {lista.map((e) =>
                editId === e.id ? (
                  /* modo edição */
                  <form
                    key={e.id}
                    onSubmit={salvarEdicao}
                    className="flex flex-col sm:flex-row gap-2 p-3 rounded-xl bg-primary/5 ring-2 ring-primary/20 animate-pop"
                  >
                    <input
                      autoFocus
                      value={rascunho.titulo}
                      onChange={(ev) =>
                        setRascunho((r) => ({ ...r, titulo: ev.target.value }))
                      }
                      onKeyDown={(ev) => ev.key === "Escape" && setEditId(null)}
                      className={cn(inputCls, "flex-1")}
                    />
                    <input
                      type="date"
                      value={rascunho.data}
                      onChange={(ev) =>
                        setRascunho((r) => ({ ...r, data: ev.target.value }))
                      }
                      className={inputCls}
                    />
                    <select
                      value={rascunho.tipo}
                      onChange={(ev) =>
                        setRascunho((r) => ({
                          ...r,
                          tipo: ev.target.value as TipoEvento,
                        }))
                      }
                      className={cn(inputCls, "font-semibold")}
                    >
                      {(Object.keys(TIPOS) as TipoEvento[]).map((t) => (
                        <option key={t} value={t}>
                          {TIPOS[t].label}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-1 justify-end">
                      <button
                        type="submit"
                        aria-label="Salvar"
                        disabled={!rascunho.titulo.trim()}
                        className={cn(
                          iconBtn,
                          "w-9 h-9 bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50",
                        )}
                      >
                        <Check size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label="Cancelar"
                        onClick={() => setEditId(null)}
                        className={cn(
                          iconBtn,
                          "w-9 h-9 bg-white hover:text-ink",
                        )}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </form>
                ) : (
                  /* modo leitura */
                  <div
                    key={e.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 transition-colors"
                  >
                    <span className="w-10 text-center text-lg font-extrabold text-ink tabular">
                      {e.data.slice(8)}
                    </span>
                    <p className="flex-1 text-xs font-semibold text-ink">
                      {e.titulo}
                    </p>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                        TIPOS[e.tipo].cls,
                      )}
                    >
                      {TIPOS[e.tipo].label}
                    </span>
                    {podeEditar && (
                      <>
                        <button
                          onClick={() => iniciarEdicao(e)}
                          aria-label="Editar evento"
                          className={cn(
                            iconBtn,
                            "hover:text-primary hover:bg-primary/10",
                          )}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => eventoStore.remover(e.id)}
                          aria-label="Remover evento"
                          className={cn(
                            iconBtn,
                            "hover:text-rose-600 hover:bg-rose-50",
                          )}
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        {/* novo evento */}
        {podeEditar && sel && !editId && (
          <form
            onSubmit={adicionar}
            className="flex flex-col sm:flex-row gap-2 p-3 rounded-2xl bg-primary/5 animate-fade-up"
          >
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Novo evento neste dia..."
              className={cn(inputCls, "flex-1")}
            />
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoEvento)}
              className={cn(inputCls, "font-semibold")}
            >
              {(Object.keys(TIPOS) as TipoEvento[]).map((t) => (
                <option key={t} value={t}>
                  {TIPOS[t].label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!titulo.trim()}
              className="flex items-center justify-center gap-1 px-4 h-9 rounded-full bg-brand text-white text-xs font-bold shadow-glow hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition"
            >
              <Plus size={14} /> Adicionar
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};
