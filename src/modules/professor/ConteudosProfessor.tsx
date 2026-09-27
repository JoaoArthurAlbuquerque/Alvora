import React from "react";
import { FolderOpen, FileText, Upload, Download } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";

const materiais = [
  {
    unidade: "Unidade 03 · Componentes Reutilizáveis e Hooks",
    arquivo: "Slides_Aula_03.pdf",
    data: "20/09/2026",
  },
];

export const ConteudosProfessor: React.FC = () => (
  <Card className="space-y-5">
    <div className="flex items-center gap-4">
      <IconBubble icone={FolderOpen} cor="amber" />
      <h3 className="flex-1 text-lg font-extrabold text-ink">
        Materiais de aula & tarefas
      </h3>
      <Button icon={<Upload size={15} />}>Upload</Button>
    </div>

    <label className="group flex flex-col items-center gap-1 p-8 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all">
      <Upload
        size={28}
        className="text-primary group-hover:-translate-y-1 transition-transform"
      />
      <span className="text-sm font-semibold text-ink">
        Arraste arquivos ou clique para enviar
      </span>
      <span className="text-[11px] text-slate-400">PDF, slides, imagens…</span>
      <input type="file" className="hidden" />
    </label>

    <ul className="space-y-2 stagger">
      {materiais.map((m) => (
        <li
          key={m.arquivo}
          className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 hover:translate-x-1 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-ink truncate">{m.unidade}</p>
            <p className="text-xs text-slate-400">
              {m.arquivo} · Publicado em {m.data}
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            icon={<Download size={14} />}
            aria-label="Baixar"
          />
        </li>
      ))}
    </ul>
  </Card>
);
