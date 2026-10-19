import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  NavLink,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Sparkles,
  CircleHelp,
  CalendarDays,
  Search,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../core/auth/useAuthStore";
import { cn } from "../core/lib/utils";
import type { PapelUsuario } from "../types";
import {
  navPorPapel,
  acoesExtras,
  rotuloPapel,
  tituloDaRota,
  paginasDoPapel,
  buscarPaginas,
} from "./navegacao";

const AssistentePedagogicoModal = lazy(() =>
  import("../modules/assistente-pedagogico/AssistentePedagogicoModal").then(
    (m) => ({
      default: m.AssistentePedagogicoModal,
    }),
  ),
);
const CentralDuvidasDrawer = lazy(() =>
  import("../modules/central-duvidas/CentralDuvidasDrawer").then((m) => ({
    default: m.CentralDuvidasDrawer,
  })),
);
const CalendarioModal = lazy(() =>
  import("../modules/calendario/CalendarioModal").then((m) => ({
    default: m.CalendarioModal,
  })),
);

type Ferramenta = "ia" | "duvidas" | "calendario";

const AVATAR_ALVI = "/alvi.png"; // public/alvi.png

/** Avatar do Alvi; cai para o ícone Sparkles se a imagem não carregar */
const IconeAlvi: React.FC<{ size?: number; className?: string }> = ({
  size = 18,
  className,
}) => {
  const [falhou, setFalhou] = useState(false);
  if (falhou) return <Sparkles size={size} className={className} aria-hidden />;
  return (
    <img
      src={AVATAR_ALVI}
      alt=""
      aria-hidden
      width={size}
      height={size}
      onError={() => setFalhou(true)}
      className={cn("shrink-0 rounded-full bg-white object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
};

const foco =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25";
const itemBase = cn(
  "group relative w-full flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-medium text-left cursor-pointer transition-colors duration-200",
  foco,
);
const itemInativo = "text-slate-500 hover:text-primary hover:bg-primary/5";
const iconeBtn = cn("p-2 rounded-lg cursor-pointer transition-colors", foco);

/** Busca global: procura as páginas que o perfil logado pode abrir */
const BuscaPaginas: React.FC<{ papel: PapelUsuario }> = ({ papel }) => {
  const navigate = useNavigate();
  const [termo, setTermo] = useState("");
  const resultados = buscarPaginas(termo, paginasDoPapel(papel));
  const ir = (path: string) => {
    setTermo("");
    navigate(path);
  };

  return (
    <div className="relative hidden lg:block w-64 shrink-0">
      <div className="flex items-center gap-2 h-10 px-4 rounded-full bg-white border border-primary/10 shadow-flat-sm focus-within:ring-4 focus-within:ring-primary/15 transition">
        <Search size={16} className="text-slate-400" aria-hidden />
        <input
          type="search"
          role="combobox"
          aria-expanded={!!termo.trim()}
          aria-controls="busca-resultados"
          aria-label="Buscar páginas"
          placeholder="Buscar páginas..."
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && resultados[0]) ir(resultados[0].path);
            if (e.key === "Escape") setTermo("");
          }}
          className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>
      {termo.trim() && (
        <ul
          id="busca-resultados"
          role="listbox"
          className="absolute right-0 top-12 z-20 w-full p-1.5 rounded-2xl bg-white shadow-flat-2 border border-primary/10 animate-fade-in"
        >
          {resultados.length ? (
            resultados.map(({ label, path, icone: I }) => (
              <li key={path}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => ir(path)}
                  className="w-full flex items-center gap-2.5 px-3 h-10 rounded-xl text-sm text-left text-ink cursor-pointer hover:bg-primary/5"
                >
                  <I size={16} className="text-primary" aria-hidden /> {label}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-3 text-xs text-slate-500">
              Nenhuma página encontrada. A busca procura as telas do menu, o
              perfil e o calendário.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export const AppLayout: React.FC = () => {
  const { usuario, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const [aberto, setAberto] = useState<Ferramenta | null>(null);
  const [carregados, setCarregados] = useState<Set<Ferramenta>>(
    () => new Set(),
  );

  const papel = usuario?.papel;
  const nav = papel ? navPorPapel[papel] : undefined;

  useEffect(() => {
    if (usuario && !nav) logout();
  }, [usuario, nav, logout]);

  // Esc fecha o menu mobile
  useEffect(() => {
    if (!menuAberto) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuAberto(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuAberto]);

  if (!usuario || !nav || !papel) return <Navigate to="/login" replace />;

  const nome =
    usuario.nome?.trim() || usuario.email?.split("@")[0] || "Usuário";
  const inicial = nome
    .replace(/^(Prof\.|Profa\.|Dra?\.)\s*/, "")
    .charAt(0)
    .toUpperCase();
  const paginaAtual = tituloDaRota(pathname, nav);

  const fechar = () => setMenuAberto(false);
  const abrir = (f: Ferramenta) => () => {
    fechar();
    setCarregados((s) => (s.has(f) ? s : new Set(s).add(f)));
    setAberto(f);
  };
  const fecharFerramenta = () => setAberto(null);
  const sair = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // O Alvi fica só no card de baixo, sem repetir aqui
  const ferramentas = [
    { label: "Calendário", icone: CalendarDays, onClick: abrir("calendario") },
  ];

  const sidebar = (
    <>
      <div className="flex items-center justify-between h-16 px-3">
        <img src="/alvora_blue.svg" alt="Alvora" className="h-8 w-auto" />
        <button
          type="button"
          onClick={fechar}
          className={cn(
            "md:hidden text-slate-500 hover:bg-slate-100",
            iconeBtn,
          )}
          aria-label="Fechar menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav aria-label="Principal" className="mt-4 space-y-1 stagger">
        {nav.map(({ label, path, icone: Icone }) => (
          <NavLink
            key={path}
            to={path}
            end={path === `/${papel}`}
            onClick={fechar}
            className={({ isActive }) =>
              cn(
                itemBase,
                isActive ? "bg-brand text-white shadow-glow" : itemInativo,
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icone size={18} strokeWidth={isActive ? 2.4 : 2} aria-hidden />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <ChevronRight size={15} className="opacity-80" aria-hidden />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8">
        <p className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
          Ferramentas
        </p>
        <div className="space-y-1">
          {(acoesExtras[papel] ?? []).map(({ label, path, icone: Icone }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                fechar();
                navigate(path);
              }}
              className={cn(itemBase, itemInativo)}
            >
              <Icone size={18} aria-hidden /> {label}
            </button>
          ))}
          {ferramentas.map(({ label, icone: Icone, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className={cn(itemBase, itemInativo)}
            >
              <Icone size={18} aria-hidden /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Card do Alvi (é um botão: pode reagir) */}
      <button
        type="button"
        onClick={abrir("ia")}
        aria-label="Conversar com o Alvi, assistente pedagógico"
        className={cn(
          "group mt-auto mb-3 relative overflow-hidden rounded-2xl bg-brand p-4 text-left text-white shadow-glow cursor-pointer hover:-translate-y-0.5 transition-transform",
          foco,
        )}
      >
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />
        <IconeAlvi
          size={36}
          className="relative ring-2 ring-white/40 animate-float"
        />
        <p className="relative mt-2 text-sm font-bold">Precisa de ajuda?</p>
        <p className="relative text-xs text-white/80">
          Bora conversar com o Alvi ☀️
        </p>
      </button>

      {/* Único acesso ao perfil (o atalho duplicado do cabeçalho saiu: QA-04) */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-1">
        <NavLink
          to={`/${papel}/perfil`}
          onClick={fechar}
          className={cn(
            "flex-1 flex items-center gap-2.5 p-2 rounded-xl hover:bg-primary/5 min-w-0 transition-colors",
            foco,
          )}
        >
          <div className="w-9 h-9 rounded-full bg-brand text-white text-sm font-bold flex items-center justify-center shrink-0 ring-4 ring-primary/10">
            {inicial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{nome}</p>
            <p className="text-xs text-slate-500">{rotuloPapel[papel]}</p>
          </div>
        </NavLink>
        <button
          type="button"
          onClick={sair}
          title="Sair"
          aria-label="Sair"
          className={cn(
            "text-slate-500 hover:text-rose-500 hover:bg-rose-50",
            iconeBtn,
          )}
        >
          <LogOut size={17} />
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 h-[calc(100vh-2rem)] sticky top-4 m-4 mr-0 bg-white/90 backdrop-blur rounded-3xl shadow-flat-2 flex-col px-3 pb-3 shrink-0 overflow-y-auto animate-slide-in">
        {sidebar}
      </aside>

      {menuAberto && (
        <div
          className="md:hidden fixed inset-0 z-40"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm animate-fade-in"
            onClick={fechar}
          />
          <aside className="absolute left-3 top-3 bottom-3 w-72 max-w-[85vw] bg-white rounded-3xl shadow-2xl flex flex-col px-3 pb-3 overflow-y-auto animate-slide-in">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Fundo opaco no desktop: o conteúdo não aparece por baixo ao rolar (QA-02) */}
        <header className="sticky top-0 z-20 px-4 sm:px-6 lg:px-10 pt-4">
          <div className="h-16 flex items-center gap-3 px-4 rounded-2xl bg-white/95 backdrop-blur shadow-flat">
            <button
              type="button"
              onClick={() => setMenuAberto(true)}
              className={cn(
                "md:hidden -ml-1 text-slate-600 hover:bg-slate-100",
                iconeBtn,
              )}
              aria-label="Abrir menu"
              aria-expanded={menuAberto}
            >
              <Menu size={20} />
            </button>
            <h2
              key={paginaAtual}
              className="flex-1 min-w-0 text-lg md:text-2xl font-extrabold text-ink truncate animate-fade-in"
            >
              {paginaAtual}
            </h2>
            <BuscaPaginas papel={papel} />
          </div>
        </header>

        <main
          key={pathname}
          className="flex-1 px-4 sm:px-6 lg:px-10 py-6 overflow-x-hidden animate-fade-up"
        >
          <Outlet />
        </main>
      </div>

      {/* Botão flutuante de dúvidas */}
      <button
        type="button"
        onClick={abrir("duvidas")}
        aria-label="Central de Dúvidas"
        className={cn(
          "fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-brand text-white shadow-glow flex items-center justify-center cursor-pointer hover:scale-110 hover:rotate-12 transition-transform duration-300",
          foco,
        )}
      >
        <CircleHelp size={24} />
      </button>

      <Suspense fallback={null}>
        {carregados.has("ia") && (
          <AssistentePedagogicoModal
            isOpen={aberto === "ia"}
            onClose={fecharFerramenta}
          />
        )}
        {carregados.has("duvidas") && (
          <CentralDuvidasDrawer
            isOpen={aberto === "duvidas"}
            onClose={fecharFerramenta}
          />
        )}
        {carregados.has("calendario") && (
          <CalendarioModal
            isOpen={aberto === "calendario"}
            onClose={fecharFerramenta}
          />
        )}
      </Suspense>
    </div>
  );
};
