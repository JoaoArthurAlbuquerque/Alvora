import { describe, it, expect } from "vitest";
import { aplicarAbonos, type Justificativa } from "./justificativaStore";

const hist = (faltas: number, presencas: number) => [
  { disciplinaId: "mat", presencas, faltas, percentualFrequencia: 0 },
];

const jus = (over: Partial<Justificativa> = {}): Justificativa => ({
  id: "j1",
  alunoId: "a1",
  alunoNome: "Ana",
  disciplinaId: "mat",
  disciplinaNome: "Matemática",
  dataFalta: "2026-09-01",
  motivo: "atestado",
  status: "aprovada",
  criadaEm: 0,
  ...over,
});

describe("aplicarAbonos", () => {
  it("sem justificativa aprovada devolve o mesmo item", () => {
    const h = hist(2, 7);
    expect(aplicarAbonos(h, [jus({ status: "pendente" })], "a1")[0]).toBe(h[0]);
  });

  it("converte falta abonada em presença e recalcula com 1 casa", () => {
    const [r] = aplicarAbonos(hist(3, 6), [jus()], "a1");
    expect(r).toMatchObject({ faltas: 2, presencas: 7, percentualFrequencia: 77.8 });
  });

  it("ignora outros alunos e outras disciplinas", () => {
    const h = hist(2, 7);
    const r = aplicarAbonos(
      h,
      [jus({ alunoId: "a2" }), jus({ disciplinaId: "port" })],
      "a1",
    );
    expect(r[0]).toBe(h[0]);
  });

  it("faltas nunca ficam negativas", () => {
    const [r] = aplicarAbonos(hist(1, 4), [jus(), jus({ id: "j2" })], "a1");
    expect(r).toMatchObject({ faltas: 0, presencas: 5, percentualFrequencia: 100 });
  });
});
