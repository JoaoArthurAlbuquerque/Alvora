import type {
  ChamadaPIN,
  RegistroPresenca,
  ResultadoValidacaoPIN,
  StatusPresenca,
} from "../types";
import { gravar, ler } from "./storage";
import { regrasService } from "./regrasService";

const hoje = () => new Date().toISOString().slice(0, 10);
const chamadas = () => ler<ChamadaPIN[]>("chamadas", []);
const registros = () => ler<RegistroPresenca[]>("registros", []);

/** PIN criptograficamente aleatório, sem repetir entre chamadas ativas */
function gerarPIN(digitos: number): string {
  const ativos = new Set(
    chamadas()
      .filter(estaAtiva)
      .map((c) => c.pin),
  );
  let pin: string;
  do {
    const n = crypto.getRandomValues(new Uint32Array(1))[0] % 10 ** digitos;
    pin = String(n).padStart(digitos, "0");
  } while (ativos.has(pin));
  return pin;
}

export const estaAtiva = (c: ChamadaPIN) =>
  !c.encerrada && Date.now() < c.expiraEm;

export const presencaService = {
  abrirChamada(
    dados: Pick<
      ChamadaPIN,
      "turmaId" | "disciplinaId" | "disciplinaNome" | "professorId"
    >,
    minutos = regrasService.obter().validadePinMinutos,
  ): ChamadaPIN {
    // Só uma chamada ativa por turma
    const lista = chamadas().map((c) =>
      c.turmaId === dados.turmaId && estaAtiva(c)
        ? { ...c, encerrada: true }
        : c,
    );
    const agora = Date.now();
    const nova: ChamadaPIN = {
      ...dados,
      id: crypto.randomUUID(),
      pin: gerarPIN(regrasService.obter().digitosPin),
      abertaEm: agora,
      expiraEm: agora + minutos * 60_000,
      encerrada: false,
    };
    gravar("chamadas", [...lista, nova]);
    return nova;
  },

  encerrarChamada(id: string) {
    gravar(
      "chamadas",
      chamadas().map((c) => (c.id === id ? { ...c, encerrada: true } : c)),
    );
  },

  /** Chamadas ativas nas turmas informadas (banner do aluno / tela do professor) */
  chamadasAtivas: (turmasIds: string[]) =>
    chamadas().filter((c) => estaAtiva(c) && turmasIds.includes(c.turmaId)),

  validarPIN(
    alunoId: string,
    turmasDoAluno: string[],
    pinDigitado: string,
  ): ResultadoValidacaoPIN {
    const pin = pinDigitado.trim();
    const candidatas = chamadas().filter((c) => c.pin === pin);
    if (!candidatas.length) return "PIN_INCORRETO";

    const daTurma = candidatas.filter((c) => turmasDoAluno.includes(c.turmaId));
    if (!daTurma.length) return "NAO_MATRICULADO";

    const chamada = daTurma.find(estaAtiva);
    if (!chamada) return "PIN_EXPIRADO";

    const lista = registros();
    const data = hoje();
    const existente = lista.find(
      (r) =>
        r.alunoId === alunoId &&
        r.turmaId === chamada.turmaId &&
        r.data === data,
    );
    if (existente?.status.startsWith("PRESENTE")) return "JA_REGISTRADO";

    const novo: RegistroPresenca = {
      id: crypto.randomUUID(),
      alunoId,
      turmaId: chamada.turmaId,
      disciplinaId: chamada.disciplinaId,
      data,
      status: "PRESENTE_PIN",
      chamadaId: chamada.id,
      registradoEm: Date.now(),
    };
    gravar("registros", [...lista.filter((r) => r !== existente), novo]);
    return "SUCESSO";
  },

  /** Lançamento manual do professor (PIN esquecido, sem internet, justificativa) */
  lancarManual(
    alunoId: string,
    turmaId: string,
    disciplinaId: string,
    status: StatusPresenca,
    justificativa?: string,
    data = hoje(),
  ) {
    const lista = registros().filter(
      (r) =>
        !(r.alunoId === alunoId && r.turmaId === turmaId && r.data === data),
    );
    lista.push({
      id: crypto.randomUUID(),
      alunoId,
      turmaId,
      disciplinaId,
      data,
      status,
      justificativa,
      registradoEm: Date.now(),
    });
    gravar("registros", lista);
  },

  confirmadosNaChamada: (chamadaId: string) =>
    registros().filter((r) => r.chamadaId === chamadaId),

  registrosDoDia: (turmaId: string, data = hoje()) =>
    registros().filter((r) => r.turmaId === turmaId && r.data === data),

  historicoAluno: (alunoId: string) =>
    registros().filter((r) => r.alunoId === alunoId),

  /** % de frequência: falta justificada não conta contra o aluno */
  percentual(alunoId: string, turmaId: string): number {
    const rs = registros().filter(
      (r) =>
        r.alunoId === alunoId &&
        r.turmaId === turmaId &&
        r.status !== "FALTA_JUSTIFICADA",
    );
    if (!rs.length) return 100;
    return (
      Math.round(
        (rs.filter((r) => r.status.startsWith("PRESENTE")).length / rs.length) *
          1000,
      ) / 10
    );
  },
};
