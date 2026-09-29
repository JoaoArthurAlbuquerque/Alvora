import { describe, it, expect } from "vitest";
import { classificar } from "./radarRisco";
import { REGRAS_PADRAO } from "../config/regras";

// Regras fixas: o teste não depende do localStorage nem de outros testes
const c = (pctFaltas: number, media: number | null) =>
  classificar(pctFaltas, media, REGRAS_PADRAO);

describe("classificar (regras padrão)", () => {
  it("25% exato é atenção, não alerta", () => {
    const r = c(25, 8);
    expect(r.motivo).toBeNull();
    expect(r.nivel).toBe("atencao");
  });
  it("acima de 25% é FALTAS", () =>
    expect(c(25.1, 8).motivo).toBe("FALTAS"));
  it("usa a média mínima das regras (7)", () =>
    expect(c(5, 6.5).motivo).toBe("NOTA"));
  it("média entre 7 e 8 é atenção", () =>
    expect(c(5, 7.5).nivel).toBe("atencao"));
  it("faltas + nota = AMBOS", () =>
    expect(c(30, 5).motivo).toBe("AMBOS"));
  it("sem média, avalia só faltas", () =>
    expect(c(10, null).nivel).toBe("ok"));
  it("23% de faltas já é atenção", () =>
    expect(c(23, 9).nivel).toBe("atencao"));
});

describe("classificar (regras customizadas)", () => {
  it("respeita limite de faltas alterado pelo gestor", () =>
    expect(
      classificar(22, null, { ...REGRAS_PADRAO, limiteAlertaFaltas: 20 }).motivo,
    ).toBe("FALTAS"));
  it("respeita média mínima alterada pelo gestor", () =>
    expect(
      classificar(5, 5.5, { ...REGRAS_PADRAO, mediaMinima: 5 }).motivo,
    ).toBeNull());
});
