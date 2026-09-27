import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Sparkles,
  CircleHelp,
  CalendarDays,
} from "lucide-react";
import { useAuthStore } from "../core/auth/useAuthStore";
import { cn } from "../core/lib/utils";
import { navPorPapel, acoesExtras, rotuloPapel } from "./navegacao";
import { AssistentePedagogicoModal } from "../modules/assistente-pedagogico/AssistentePedagogicoModal";
import { CentralDuvidasDrawer } from "../modules/central-duvidas/CentralDuvidasDrawer";
import { CalendarioModal } from "../modules/calendario/CalendarioModal";

const titulos = {
  aluno: "Portal do Estudante",
  professor: "Ambiente do Professor",
  gestor: "Painel de Gestão Educacional",
} as const;

const botaoAcao =
  "w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all";

export const AppLayout: React.FC = () => {
  const { usuario, logout } = useAuthStore();
  const navigate = useNavigate();

  const [menuAberto, setMenuAberto] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isDuvidasOpen, setIsDuvidasOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  if (!usuario) return null;
  const papel = usuario.papel;

  const fecharMenu = () => setMenuAberto(false);

  const sair = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const irPara = (path: string) => {
    fecharMenu();
    navigate(path);
  };

  // Fecha o drawer antes de abrir modais/drawers
  const abrir = (setter: (v: boolean) => void) => () => {
    fecharMenu();
    setter(true);
  };

  const conteudoSidebar = (
    <>
      <div className="flex items-center justify-between px-2 py-3 mb-4">
        <img src="/alvora_blue.svg" alt="Alvora" className="h-8 w-auto" />
        <button
          onClick={fecharMenu}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-primary/10"
          aria-label="Fechar menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="space-y-1">
        {navPorPapel[papel].map(({ label, path, icone: Icone }) => (
          <NavLink
            key={path}
            to={path}
            end={path === `/${papel}`}
            onClick={fecharMenu}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-flat-sm"
                  : "text-slate-600 hover:bg-primary/10 hover:text-primary",
              )
            }
          >
            <Icone size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-2 pt-4 border-t border-primary/10">
        <p className="px-3 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
          Ações Rápidas
        </p>
        {acoesExtras[papel].map(({ label, path, icone: Icone }) => (
          <button
            key={label}
            onClick={() => irPara(path)}
            className={cn(
              botaoAcao,
              "bg-primary/5 text-slate-700 hover:bg-primary/10",
            )}
          >
            <Icone size={15} className="text-primary" /> {label}
          </button>
        ))}
        <button
          onClick={abrir(setIsAiOpen)}
          className={cn(
            botaoAcao,
            "bg-primary/10 text-primary hover:bg-primary/15",
          )}
        >
          <Sparkles size={15} /> Assistente IA
          <span className="ml-auto text-xs bg-white px-1.5 py-0.5 rounded-md shadow-2xs">
            IA
          </span>
        </button>
        <button
          onClick={abrir(setIsDuvidasOpen)}
          className={cn(
            botaoAcao,
            "bg-primary/5 text-slate-700 hover:bg-primary/10",
          )}
        >
          <CircleHelp size={15} className="text-primary" /> Central de Dúvidas
        </button>
        <button
          onClick={abrir(setIsCalendarOpen)}
          className={cn(
            botaoAcao,
            "bg-primary/5 text-slate-700 hover:bg-primary/10",
          )}
        >
          <CalendarDays size={15} className="text-primary" /> Calendário
        </button>
      </div>

      <div className="pt-4 mt-4 border-t border-primary/10 flex items-center justify-between">
        <NavLink
          to={`/${papel}/perfil`}
          onClick={fecharMenu}
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <div className="w-9 h-9 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-sm shrink-0">
            {usuario.nome.replace(/^(Prof\.|Profa\.|Dra?\.)\s*/, "").charAt(0)}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-slate-900 truncate">
              {usuario.nome}
            </p>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
              {rotuloPapel[papel]}
            </span>
          </div>
        </NavLink>
        <button
          onClick={sair}
          title="Sair"
          className="text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-colors"
        >
          <LogOut size={17} />
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-primary-soft">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 h-screen sticky top-0 bg-white border-r border-primary/10 flex-col p-5 shadow-flat shrink-0 z-20 overflow-y-auto">
        {conteudoSidebar}
      </aside>

      {/* Drawer mobile */}
      {menuAberto && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={fecharMenu}
          />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white flex flex-col p-5 shadow-flat overflow-y-auto">
            {conteudoSidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-primary/10 px-4 md:px-8 flex items-center justify-between gap-3 sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMenuAberto(true)}
              className="md:hidden p-2.5 -ml-2 rounded-xl text-primary hover:bg-primary/10"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wide truncate">
              {titulos[papel]}
            </h2>
          </div>
          <span className="shrink-0 text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
            Ano Letivo 2026
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <AssistentePedagogicoModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />
      <CentralDuvidasDrawer
        isOpen={isDuvidasOpen}
        onClose={() => setIsDuvidasOpen(false)}
      />
      <CalendarioModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
    </div>
  );
};
