import React, { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { PageHeader } from "../../core/ui/PageHeader";
import { Badge } from "../../core/ui/Badge";
import { REGRAS_PADRAO } from "../../config/regras";
import {
  regrasService,
  useRegras,
  validarRegras,
} from "../../services/regrasService";
import type { RegraFrequencia } from "../../types";

type CampoNum = Exclude<
  keyof RegraFrequencia,
  "pesosAvaliacoes" | "limiteAlertaFaltas"
>;

const CAMPOS: { k: CampoNum; l: string; sufixo: string; step?: number }[] = [
  { k: "frequenciaMinima", l: "Frequência mínima", sufixo: "%" },
  { k: "mediaMinima", l: "Média mínima", sufixo: "pts", step: 0.5 },
  {
    k: "prazoJustificativaDias",
    l: "Prazo p/ justificar falta",
    sufixo: "dias",
  },
  { k: "validadePinMinutos", l: "Validade do PIN", sufixo: "min" },
  { k: "digitosPin", l: "Dígitos do PIN", sufixo: "díg." },
];

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-ink tabular focus:outline-none focus:ring-2 focus:ring-primary/40";

export const RegrasGestor: React.FC = () => {
  const salvas = useRegras();
  const [form, setForm] = useState<RegraFrequencia>(salvas);
  const [msg, setMsg] = useState<string | null>(null);

  // Quando as regras salvas mudam, o formulário é atualizado sem usar useEffect
  const [ultimasSalvas, setUltimasSalvas] = useState(salvas);
  if (ultimasSalvas !== salvas) {
    setUltimasSalvas(salvas);
    setForm(salvas);
  }

  const erros = validarRegras(form);
  const alterado = JSON.stringify(form) !== JSON.stringify(salvas);
  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 2500);
  };

  const setNum = (k: CampoNum, v: string) =>
    setForm((f) => ({ ...f, [k]: Number(v) }));
  const setPeso = (k: string, v: string) =>
    setForm((f) => ({
      ...f,
      pesosAvaliacoes: { ...f.pesosAvaliacoes, [k]: Number(v) },
    }));

  const salvar = () => {
    regrasService.salvar(form);
    flash("Regras salvas ✅");
  };
  const restaurar = () => {
    if (!confirm("Restaurar todas as regras para o padrão?")) return;
    regrasService.restaurarPadrao();
    flash("Padrão restaurado ♻️");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Regras"
        descricao="Valem para todo o sistema assim que você salva"
      />

      <Card className="space-y-4">
        <h3 className="font-extrabold text-ink">Frequência, notas e PIN</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {CAMPOS.map((c) => (
            <label key={c.k} className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">
                {c.l} <span className="text-slate-400">({c.sufixo})</span>
              </span>
              <input
                type="number"
                step={c.step ?? 1}
                className={inputCls}
                value={form[c.k]}
                onChange={(e) => setNum(c.k, e.target.value)}
              />
              {form[c.k] !== REGRAS_PADRAO[c.k] && (
                <span className="text-[11px] text-slate-400">
                  padrão: {REGRAS_PADRAO[c.k]}
                </span>
              )}
            </label>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Com essa frequência mínima, o aluno entra em risco com mais de{" "}
          <b className="text-rose-600">{100 - form.frequenciaMinima}%</b> de
          faltas.
        </p>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-extrabold text-ink">Pesos das avaliações</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.entries(form.pesosAvaliacoes).map(([k, v]) => (
            <label key={k} className="space-y-1">
              <span className="text-xs font-semibold text-slate-500">{k}</span>
              <input
                type="number"
                step={0.1}
                className={inputCls}
                value={v}
                onChange={(e) => setPeso(k, e.target.value)}
              />
            </label>
          ))}
        </div>
      </Card>

      {erros.length > 0 && (
        <Card className="bg-rose-50 space-y-1">
          {erros.map((e) => (
            <p key={e} className="text-sm text-rose-700">
              • {e}
            </p>
          ))}
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={salvar}
          disabled={!alterado || erros.length > 0}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
        >
          <Save size={16} /> Salvar
        </button>
        <button
          onClick={() => setForm(salvas)}
          disabled={!alterado}
          className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        >
          Descartar
        </button>
        <button
          onClick={restaurar}
          className="ml-auto inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
        >
          <RotateCcw size={16} /> Restaurar padrão
        </button>
        {msg && <Badge variant="success">{msg}</Badge>}
      </div>
    </div>
  );
};
