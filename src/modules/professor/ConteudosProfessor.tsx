// =====================================================================
// src/modules/professor/ConteudosProfessor.tsx
// =====================================================================
import React, { useRef, useState } from "react";
import { FolderOpen, FileText, Upload, Download, Trash2 } from "lucide-react";
import { Card } from "../../core/ui/Card";
import { Button } from "../../core/ui/Button";
import { IconBubble } from "../../core/ui/IconBubble";
import type { Sala } from "../../services/api/turmas";
import {
  abrirMaterial,
  useEnviarMaterial,
  useExcluirMaterial,
  useMateriais,
} from "../../services/api/professor";
import { cn } from "../../core/lib/utils";
import { ComSala } from "./SeletorSala";

const dataBR = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("pt-BR", {
        timeZone: "America/Fortaleza",
      })
    : "";

export const ConteudosProfessor: React.FC<{ sala?: Sala }> = ({ sala }) => (
  <ComSala sala={sala}>{(s) => <ConteudosSala sala={s} />}</ComSala>
);

const ConteudosSala: React.FC<{ sala: Sala }> = ({ sala }) => {
  const { data: materiais = [], isLoading } = useMateriais(sala.id);
  const enviar = useEnviarMaterial(sala.id);
  const excluir = useExcluirMaterial(sala.id);
  const input = useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const enviarArquivos = async (lista: FileList | null) => {
    setErro(null);
    for (const f of Array.from(lista ?? [])) {
      try {
        await enviar.mutateAsync(f);
      } catch (e) {
        setErro((e as Error).message);
      }
    }
    if (input.current) input.current.value = "";
  };

  return (
    <Card className="space-y-5">
      <div className="flex items-center gap-4">
        <IconBubble icone={FolderOpen} cor="amber" />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold text-ink">Materiais de aula</h3>
          <p className="text-xs text-slate-400 truncate">
            {sala.turmaNome} · {sala.disciplinaNome}
          </p>
        </div>
        <Button
          icon={<Upload size={15} />}
          onClick={() => input.current?.click()}
          disabled={enviar.isPending}
        >
          {enviar.isPending ? "Enviando..." : "Upload"}
        </Button>
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastando(false);
          enviarArquivos(e.dataTransfer.files);
        }}
        className={cn(
          "group flex flex-col items-center gap-1 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all",
          arrastando
            ? "border-primary/60 bg-primary/5"
            : "border-slate-200 hover:border-primary/40 hover:bg-primary/5",
        )}
      >
        <Upload
          size={28}
          className="text-primary group-hover:-translate-y-1 transition-transform"
        />
        <span className="text-sm font-semibold text-ink">
          Arraste arquivos ou clique para enviar
        </span>
        <span className="text-[11px] text-slate-400">
          PDF, slides, imagens…
        </span>
        <input
          ref={input}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => enviarArquivos(e.target.files)}
        />
      </label>

      {erro && (
        <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-xl">
          {erro}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-400 text-center py-4">
          Carregando materiais... ⏳
        </p>
      ) : !materiais.length ? (
        <p className="text-sm text-slate-400 text-center py-4">
          Nenhum material publicado ainda 📂
        </p>
      ) : (
        <ul className="space-y-2 stagger">
          {materiais.map((m) => (
            <li
              key={m.id}
              className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 hover:translate-x-1 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <FileText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate">
                  {m.titulo}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {m.descricao ? `${m.descricao} · ` : ""}Publicado em{" "}
                  {dataBR(m.created_at)}
                </p>
              </div>
              {m.arquivo_url && (
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<Download size={14} />}
                  aria-label="Baixar"
                  onClick={() =>
                    abrirMaterial(m.arquivo_url!).catch((e) =>
                      setErro((e as Error).message),
                    )
                  }
                />
              )}
              <Button
                size="sm"
                variant="ghost"
                icon={<Trash2 size={14} />}
                aria-label="Excluir"
                disabled={excluir.isPending}
                onClick={() =>
                  confirm(`Excluir "${m.titulo}"?`) && excluir.mutate(m)
                }
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
