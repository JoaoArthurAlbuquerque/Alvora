// Camada de persistência mock. Para usar um backend real,
// basta trocar estas funções por chamadas HTTP.
export function ler<T>(chave: string, padrao: T): T {
  try {
    const bruto = localStorage.getItem(`alvora:${chave}`);
    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
}

export function gravar<T>(chave: string, valor: T): void {
  localStorage.setItem(`alvora:${chave}`, JSON.stringify(valor));
  window.dispatchEvent(new CustomEvent("alvora:dados", { detail: chave }));
}

/** Avisa sobre mudanças na mesma aba e entre abas (professor ↔ aluno) */
export function observar(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener("alvora:dados", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("alvora:dados", handler);
    window.removeEventListener("storage", handler);
  };
}
