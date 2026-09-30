import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Mail,
  IdCard,
  KeyRound,
  RefreshCw,
  Bell,
  Moon,
} from "lucide-react";
import { Card } from "../../core/ui/Card";
import { PageHeader } from "../../core/ui/PageHeader";
import { Badge } from "../../core/ui/Badge";
import { Button } from "../../core/ui/Button";
import { cn } from "../../core/lib/utils";
import { useAuthStore } from "../../core/auth/useAuthStore";
import { supabase } from "../../lib/supabase";
import { ler, gravar } from "../../services/storage";
import { iniciais } from "../gestor/constantes";

const PAPEIS = {
  aluno: { label: "Aluno", variant: "primary", frase: "Bora aprender! 📚" },
  professor: {
    label: "Professor",
    variant: "warning",
    frase: "Transformando vidas 🍎",
  },
  gestor: {
    label: "Gestor",
    variant: "success",
    frase: "No comando da nave 🚀",
  },
} as const;

type Prefs = { notificacoes: boolean; modoFoco: boolean };
const PREFS_PADRAO: Prefs = { notificacoes: true, modoFoco: false };

const OPCOES: { k: keyof Prefs; label: string; icon: React.ReactNode }[] = [
  { k: "notificacoes", label: "Notificações", icon: <Bell size={16} /> },
  { k: "modoFoco", label: "Modo foco", icon: <Moon size={16} /> },
];

export const PerfilPage: React.FC = () => {
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);
  const recarregar = useAuthStore((s) => s.recarregarPerfil);
  const navigate = useNavigate();

  const chavePrefs = `prefs:${usuario?.id}`;
  const [prefs, setPrefs] = useState<Prefs>(() => ({
    ...PREFS_PADRAO,
    ...ler(chavePrefs, PREFS_PADRAO),
  }));
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);
  const [ocupado, setOcupado] = useState<"senha" | "sync" | "sair" | null>(
    null,
  );

  if (!usuario) return null;
  const papel = PAPEIS[usuario.papel as keyof typeof PAPEIS];

  const alternar = (k: keyof Prefs) =>
    setPrefs((p) => {
      const novo = { ...p, [k]: !p[k] };
      gravar(chavePrefs, novo);
      return novo;
    });

  const trocarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha.length < 6)
      return setMsg({ ok: false, texto: "Mínimo de 6 caracteres." });
    if (senha !== confirma)
      return setMsg({ ok: false, texto: "As senhas não conferem." });
    setOcupado("senha");
    const { error } = await supabase.auth.updateUser({ password: senha });
    setOcupado(null);
    setMsg(
      error
        ? { ok: false, texto: error.message }
        : { ok: true, texto: "Senha atualizada! 🔐" },
    );
    if (!error) {
      setSenha("");
      setConfirma("");
    }
  };

  const sincronizar = async () => {
    setOcupado("sync");
    await recarregar();
    setOcupado(null);
  };

  const sair = async () => {
    setOcupado("sair");
    await logout();
    navigate("/login", { replace: true });
  };

  const input =
    "w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-primary/20";

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        titulo="Meu perfil"
        descricao={papel?.frase}
        acao={
          <Button
            variant="outline"
            size="sm"
            onClick={sincronizar}
            disabled={!!ocupado}
            icon={
              <RefreshCw
                size={14}
                className={cn(ocupado === "sync" && "animate-spin")}
              />
            }
          >
            Atualizar dados
          </Button>
        }
      />

      <Card>
        <div className="flex items-center gap-4 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-brand text-white text-xl font-extrabold flex items-center justify-center shadow-glow shrink-0">
            {iniciais(usuario.nome || "U")}
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            <h2 className="text-lg font-extrabold text-ink truncate">
              {usuario.nome}
            </h2>
            <p className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
              <Mail size={12} /> {usuario.email}
            </p>
            {usuario.matricula && (
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <IdCard size={12} /> Matrícula {usuario.matricula}
              </p>
            )}
          </div>
          {papel && <Badge variant={papel.variant}>{papel.label}</Badge>}
        </div>
      </Card>

      <Card>
        <p className="text-xs font-extrabold text-ink mb-3">Preferências</p>
        <div className="space-y-2">
          {OPCOES.map(({ k, label, icon }) => (
            <button
              key={k}
              role="switch"
              aria-checked={prefs[k]}
              onClick={() => alternar(k)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-primary/5 transition-colors"
            >
              <span className="text-primary">{icon}</span>
              <span className="flex-1 text-left text-xs font-semibold text-ink">
                {label}
              </span>
              <span
                className={cn(
                  "w-10 h-6 rounded-full p-0.5 transition-colors",
                  prefs[k] ? "bg-primary" : "bg-slate-300",
                )}
              >
                <span
                  className={cn(
                    "block w-5 h-5 rounded-full bg-white shadow transition-transform",
                    prefs[k] && "translate-x-4",
                  )}
                />
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <form onSubmit={trocarSenha} className="space-y-3">
          <p className="flex items-center gap-2 text-xs font-extrabold text-ink">
            <KeyRound size={14} className="text-primary" /> Alterar senha
          </p>
          <input
            type="password"
            placeholder="Nova senha"
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={input}
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            autoComplete="new-password"
            value={confirma}
            onChange={(e) => setConfirma(e.target.value)}
            className={input}
          />
          {msg && (
            <p
              className={cn(
                "text-xs font-semibold",
                msg.ok ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {msg.texto}
            </p>
          )}
          <Button type="submit" size="sm" disabled={!senha || !!ocupado}>
            {ocupado === "senha" ? "Salvando..." : "Salvar senha"}
          </Button>
        </form>
      </Card>

      <Button
        variant="danger"
        className="w-full rounded-full"
        onClick={sair}
        disabled={!!ocupado}
        icon={<LogOut size={16} />}
      >
        {ocupado === "sair" ? "Saindo..." : "Sair da conta"}
      </Button>
    </div>
  );
};
