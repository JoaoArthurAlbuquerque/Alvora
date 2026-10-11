export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const SENHA_MIN = 8;

export const validarEmail = (e: string) =>
  !e.trim() ? "Informe seu e-mail." : EMAIL_RE.test(e.trim()) ? null : "E-mail inválido.";

export function validarSenha(s: string, confirmacao: string): string | null {
  if (s.length < SENHA_MIN) return `A senha precisa ter pelo menos ${SENHA_MIN} caracteres.`;
  if (!/[A-Za-z]/.test(s) || !/\d/.test(s)) return "Use letras e números na senha.";
  if (s !== confirmacao) return "As senhas não conferem.";
  return null;
}

export function erroAuth(e: { message?: string; status?: number } | null | undefined): string {
  const m = e?.message ?? "";
  if (e?.status === 429 || /rate limit|security purposes|only request/i.test(m))
    return "Muitas tentativas. Aguarde um minuto e tente de novo.";
  if (/different from the old/i.test(m)) return "A nova senha precisa ser diferente da atual.";
  if (/weak|at least|characters/i.test(m)) return "Senha fraca. Use mais caracteres, letras e números.";
  if (/session|jwt|expired|invalid/i.test(m)) return "Link inválido ou expirado. Peça um novo.";
  if (/fetch|network/i.test(m)) return "Sem conexão. Verifique sua internet.";
  return m || "Algo deu errado 😕";
}