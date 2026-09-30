// src/modules/calendario/calendario.test.ts
import { describe, it, expect } from "vitest";
import { tiposPermitidos, podeGerenciar } from "./calendario";
import type { Evento } from "../../services/eventoStore";

const ev: Evento = {
  id: "1",
  data: "2026-10-12",
  titulo: "X",
  tipo: "entrega",
  criadoPor: "p1",
};

describe("permissões do calendário", () => {
  it("aluno não cria nada; professor não cria feriado nem evento", () => {
    expect(tiposPermitidos("aluno")).toEqual([]);
    expect(tiposPermitidos("professor")).toEqual(["entrega", "avaliacao"]);
    expect(tiposPermitidos("gestor")).toContain("feriado");
  });

  it("professor só gerencia o que criou; gestor gerencia tudo", () => {
    expect(podeGerenciar(ev, "professor", "p1")).toBe(true);
    expect(podeGerenciar(ev, "professor", "p2")).toBe(false);
    expect(podeGerenciar(ev, "gestor", "g1")).toBe(true);
    expect(podeGerenciar(ev, "aluno", "p1")).toBe(false);
  });
});
