import { describe, expect, it } from "vitest";
import { buscarPaginas, navPorPapel, paginasDoPapel, tituloDaRota } from "./navegacao";

describe("tituloDaRota", () => {
  it("perfil não herda o título de Início (QA-11)", () => {
    expect(tituloDaRota("/aluno/perfil", navPorPapel.aluno)).toBe("Meu perfil");
  });
  it("mostra a página mais específica", () => {
    expect(tituloDaRota("/professor/alertas", navPorPapel.professor)).toBe("Alertas de Faltas");
    expect(tituloDaRota("/aluno", navPorPapel.aluno)).toBe("Início");
  });
  it("não confunde prefixos parecidos", () => {
    expect(tituloDaRota("/alunox", navPorPapel.aluno)).toBe("");
  });
});

describe("buscarPaginas", () => {
  const itens = paginasDoPapel("professor");
  it("ignora acentos e maiúsculas", () => {
    expect(buscarPaginas("calendario", itens).map((i) => i.path)).toContain("/professor/calendario");
  });
  it("termo vazio não retorna nada", () => {
    expect(buscarPaginas("  ", itens)).toEqual([]);
  });
  it("sem correspondência retorna lista vazia", () => {
    expect(buscarPaginas("xyz", itens)).toEqual([]);
  });
  it("respeita o papel", () => {
    expect(buscarPaginas("auditoria", itens)).toEqual([]);
  });
});