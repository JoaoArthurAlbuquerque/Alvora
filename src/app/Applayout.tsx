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
import { navPorPapel, acoesExtras, rotuloPapel } from "./navegacao";

// Modais carregados sob demanda
const AssistentePedagogicoModal = lazy(() =>
  import("../modules/assistente-pedagogico/AssistentePedagogicoModal").then(
    (m) => ({ default: m.AssistentePedagogicoModal }),
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

const itemBase =
  "group relative w-full flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-medium transition-all duration-200";
const itemInativo =
  "text-slate-500 hover:text-primary hover:bg-primary/5 hover:translate-x-1";

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

  // Papel inválido/ausente no perfil → encerra a sessão (fora do render)
  useEffect(() => {
    if (usuario && !nav) logout();
  }, [usuario, nav, logout]);

  if (!usuario || !nav || !papel) return <Navigate to="/login" replace />;

  const nome =
    usuario.nome?.trim() || usuario.email?.split("@")[0] || "Usuário";
  const primeiroNome = nome.split(" ")[0];
  const inicial = nome
    .replace(/^(Prof\.|Profa\.|Dra?\.)\s*/, "")
    .charAt(0)
    .toUpperCase();

  const paginaAtual =
    [...nav]
      .sort((a, b) => b.path.length - a.path.length)
      .find((i) => pathname.startsWith(i.path))?.label ??
    (pathname.endsWith("/perfil") ? "Meu Perfil" : "");

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

  const ferramentas = [
    { label: "Assistente IA", icone: Sparkles, onClick: abrir("ia") },
    { label: "Calendário", icone: CalendarDays, onClick: abrir("calendario") },
  ];

  const sidebar = (
    <>
      <div className="flex items-center justify-between h-16 px-3">
        <img src="/alvora_blue.svg" alt="Alvora" className="h-8 w-auto" />
        <button
          onClick={fechar}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-100"
          aria-label="Fechar menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="mt-4 space-y-1 stagger">
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
                <Icone size={18} strokeWidth={isActive ? 2.4 : 2} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={15} className="opacity-80" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8">
        <p className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
          Ferramentas
        </p>
        <div className="space-y-1">
          {(acoesExtras[papel] ?? []).map(({ label, path, icone: Icone }) => (
            <button
              key={label}
              onClick={() => {
                fechar();
                navigate(path);
              }}
              className={cn(itemBase, itemInativo)}
            >
              <Icone size={18} /> {label}
            </button>
          ))}
          {ferramentas.map(({ label, icone: Icone, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className={cn(itemBase, itemInativo)}
            >
              <Icone size={18} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Card promocional da IA */}
      <button
        onClick={abrir("ia")}
        className="group mt-auto mb-3 relative overflow-hidden rounded-2xl bg-brand p-4 text-left text-white shadow-glow hover:-translate-y-0.5 transition-transform"
      >
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 group-hover:scale-125 transition-transform duration-500" />
        <Sparkles size={20} className="relative animate-float" />
        <p className="relative mt-2 text-sm font-bold">Precisa de ajuda?</p>
        <p className="relative text-xs text-white/80">
          Pergunte ao Assistente IA ✨
        </p>
      </button>

      <div className="pt-3 border-t border-slate-100 flex items-center gap-1">
        <NavLink
          to={`/${papel}/perfil`}
          onClick={fechar}
          className="flex-1 flex items-center gap-2.5 p-2 rounded-xl hover:bg-primary/5 min-w-0"
        >
          <div className="w-9 h-9 rounded-full bg-brand text-white text-sm font-bold flex items-center justify-center shrink-0 ring-4 ring-primary/10">
            {inicial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{nome}</p>
            <p className="text-xs text-slate-400">{rotuloPapel[papel]}</p>
          </div>
        </NavLink>
        <button
          onClick={sair}
          title="Sair"
          aria-label="Sair"
          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
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
        <div className="md:hidden fixed inset-0 z-40">
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
        <header className="sticky top-0 z-10 px-4 sm:px-6 lg:px-10 pt-4">
          <div className="h-16 flex items-center gap-3 px-4 md:px-2 rounded-2xl bg-white/70 md:bg-transparent backdrop-blur md:backdrop-blur-none shadow-flat md:shadow-none">
            <button
              onClick={() => setMenuAberto(true)}
              className="md:hidden p-2 -ml-1 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <h2
              key={paginaAtual}
              className="text-lg md:text-2xl font-extrabold text-ink truncate animate-fade-in"
            >
              {paginaAtual}
            </h2>
            <div className="ml-auto hidden lg:flex items-center gap-2 h-10 w-72 px-4 rounded-full bg-white border border-primary/10 shadow-flat-sm focus-within:ring-4 focus-within:ring-primary/15 transition">
              <Search size={16} className="text-slate-400" />
              <input
                placeholder="Buscar..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <NavLink
              to={`/${papel}/perfil`}
              className="hidden md:flex items-center gap-2 h-10 pl-1 pr-4 rounded-full bg-brand text-white text-sm font-semibold shadow-glow hover:-translate-y-0.5 transition-transform"
            >
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                {inicial}
              </span>
              {primeiroNome}
            </NavLink>
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
        onClick={abrir("duvidas")}
        aria-label="Central de Dúvidas"
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-brand text-white shadow-glow flex items-center justify-center hover:scale-110 hover:rotate-12 transition-transform duration-300"
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
