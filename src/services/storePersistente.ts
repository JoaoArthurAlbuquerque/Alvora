import { useSyncExternalStore } from "react";

export function criarStorePersistente<T>(key: string, vazio: T) {
  const EVT = `${key}-change`;

  const ler = (): T => {
    try {
      const v = localStorage.getItem(key);
      return v ? (JSON.parse(v) as T) : vazio;
    } catch {
      return vazio;
    }
  };

  let cache = ler();

  // Sempre ouvindo outras abas, mesmo sem nenhum componente inscrito
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key === key) {
        cache = ler();
        window.dispatchEvent(new Event(EVT));
      }
    });
  }

  const subscribe = (cb: () => void) => {
    window.addEventListener(EVT, cb);
    return () => window.removeEventListener(EVT, cb);
  };

  return {
    get: () => cache,
    set(v: T) {
      cache = v;
      localStorage.setItem(key, JSON.stringify(v));
      window.dispatchEvent(new Event(EVT));
    },
    subscribe,
    use: () => useSyncExternalStore(subscribe, () => cache),
  };
}
