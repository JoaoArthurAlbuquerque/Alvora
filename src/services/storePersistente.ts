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

  const subscribe = (cb: () => void) => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        cache = ler();
        cb();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(EVT, cb);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(EVT, cb);
    };
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
