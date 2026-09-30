// src/modules/calendario/calendario.ts
import type { PapelUsuario } from "../../types";
import type { Evento, TipoEvento } from "../../services/eventoStore";

/** Tipos de evento que cada perfil pode criar/editar */
export const tiposPermitidos = (papel: PapelUsuario): TipoEvento[] =>
  papel === "gestor"
    ? ["entrega", "avaliacao", "feriado", "evento"]
    : papel === "professor"
      ? ["entrega", "avaliacao"]
      : [];

/** Gestor mexe em tudo; professor só no que ele mesmo criou */
export const podeGerenciar = (
  e: Evento,
  papel: PapelUsuario,
  userId: string,
) => papel === "gestor" || (papel === "professor" && e.criadoPor === userId);
