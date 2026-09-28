import { describe, it, expect } from "vitest";
import { classificar } from "./radarRisco";

describe("classificar", () => {
  it("25% exato é atenção, não alerta", () => {
    const r = classificar(25, 8);
    expect(r.motivo).toBeNull();
    expect(r.nivel).toBe("atencao");
  });
  it("acima de 25% é FALTAS", () =>
    expect(classificar(25.1, 8).motivo).toBe("FALTAS"));
  it("usa a média mínima das regras (7)", () =>
    expect(classificar(5, 6.5).motivo).toBe("NOTA"));
  it("média entre 7 e 8 é atenção", () =>
    expect(classificar(5, 7.5).nivel).toBe("atencao"));
  it("faltas + nota = AMBOS", () =>
    expect(classificar(30, 5).motivo).toBe("AMBOS"));
  it("sem média, avalia só faltas", () =>
    expect(classificar(10, null).nivel).toBe("ok"));
  it("23% de faltas já é atenção", () =>
    expect(classificar(23, 9).nivel).toBe("atencao"));
});
