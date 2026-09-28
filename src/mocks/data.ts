import {
  SessaoFrequenciaAoVivo,
  Aluno,
  AlunoEmRisco,
  BoletimDisciplina,
  RequerimentoSecretaria,
  BoletoFinanceiro,
  DiarioDocenteStatus,
} from "../types";
import { calcularPercentual } from "../utils/frequencia";

/** Monta um item de frequência consistente: faltas e % são calculados. */
const freq = (
  disciplinaId: string,
  disciplinaNome: string,
  totalAulas: number,
  presencas: number,
) => ({
  disciplinaId,
  disciplinaNome,
  totalAulas,
  presencas,
  faltas: totalAulas - presencas,
  percentualFrequencia: calcularPercentual(presencas, totalAulas),
});

export const sessaoFrequenciaAtiva: SessaoFrequenciaAoVivo = {
  id: "sessao-1",
  disciplinaId: "1",
  disciplinaNome: "Desenvolvimento Front-End Especializado",
  pinCode: "8492",
  tempoLimiteSegundos: 300,
  ativa: true,
  alunosPresentesIds: ["aluno-2", "aluno-3"],
};

export const alunoLogadoMock: Aluno = {
  id: "aluno-1",
  nome: "João Arthur Albuquerque",
  email: "aluno@alvora.edu.br",
  role: "aluno",
  matricula: "202410842",
  curso: "Análise e Desenvolvimento de Sistemas",
  mediaGeral: 8.9,
  historicoFrequencia: [
    freq("1", "Desenvolvimento Front-End Especializado", 40, 38),
    freq("2", "Engenharia de Software e Arquitetura", 40, 40),
    freq("3", "Sistemas Distribuídos e Cloud", 36, 28), // ✅ 77.8
  ],
};

export interface AlunoTurma {
  id: string;
  nome: string;
  matricula: string;
  presente: boolean;
}

export const listaAlunosTurmaMock: AlunoTurma[] = [
  { id: "aluno-1", nome: "João Arthur Albuquerque", matricula: "202410842", presente: false },
  { id: "aluno-2", nome: "Ana Beatriz Souza", matricula: "202410843", presente: true },
  { id: "aluno-3", nome: "Carlos Eduardo Lima", matricula: "202410844", presente: true },
  { id: "aluno-4", nome: "Mariana Costa", matricula: "202410845", presente: false },
  { id: "aluno-5", nome: "Lucas Mendonça Silva", matricula: "202410846", presente: false },
];

// Na Etapa 5, estas funções vão buscar os dados no Supabase.

/** Turma completa (por enquanto, só mocks). */
export function listarAlunosTurma(): AlunoTurma[] {
  return listaAlunosTurmaMock;
}

/** Hook da turma. A referência é estável porque o array é constante. */
export function useAlunosTurma(): AlunoTurma[] {
  return listaAlunosTurmaMock;
}

export const alunosEmRiscoMock: AlunoEmRisco[] = [
  {
    id: "aluno-102",
    nome: "Gabriel Santos Ferreira",
    matricula: "202410112",
    curso: "Engenharia de Software",
    disciplinaNome: "Sistemas Distribuídos e Cloud",
    percentualFrequencia: 72.5,
    faltasAcumuladas: 11,
    maxFaltasPermitidas: 10,
    mediaAtual: 5.2,
    motivoRisco: "AMBOS",
  },
  {
    id: "aluno-105",
    nome: "Camila Rocha Ramos",
    matricula: "202410304",
    curso: "Análise e Desenvol. de Sistemas",
    disciplinaNome: "Desenvolvimento Front-End Especializado",
    percentualFrequencia: 74.0,
    faltasAcumuladas: 10,
    maxFaltasPermitidas: 10,
    mediaAtual: 7.8,
    motivoRisco: "FALTAS",
  },
  {
    id: "aluno-109",
    nome: "Mateus Oliveira Filho",
    matricula: "202410408",
    curso: "Ciência da Computação",
    disciplinaNome: "Bancos de Dados Relacionais",
    percentualFrequencia: 88.0,
    faltasAcumuladas: 4,
    maxFaltasPermitidas: 10,
    mediaAtual: 4.8,
    motivoRisco: "NOTA",
  },
];

export const boletimAlunoMock: BoletimDisciplina[] = [
  {
    id: "1",
    disciplinaNome: "Desenvolvimento Front-End Especializado",
    professorNome: "Prof. Marcos Vinícius",
    av1: 9.0,
    av2: 8.5,
    atividadesContinuas: 9.5,
    mediaParcial: 8.9,
    status: "Aprovado",
  },
  {
    id: "2",
    disciplinaNome: "Engenharia de Software e Arquitetura",
    professorNome: "Profa. Renata Silveira",
    av1: 8.5,
    av2: null,
    atividadesContinuas: 9.0,
    mediaParcial: 8.7,
    status: "Em Andamento",
  },
  {
    id: "3",
    disciplinaNome: "Sistemas Distribuídos e Cloud",
    professorNome: "Prof. André Albuquerque",
    av1: 6.0,
    av2: null,
    atividadesContinuas: 7.0,
    mediaParcial: 6.3,
    status: "Em Risco",
  },
];

export const requerimentosMock: RequerimentoSecretaria[] = [
  {
    id: "req-1",
    titulo: "Declaração de Matrícula Atualizada",
    protocolo: "20260925-001",
    dataSolicitacao: "20/09/2026",
    status: "Concluído",
  },
  {
    id: "req-2",
    titulo: "Histórico Escolar Parcial Assinado",
    protocolo: "20260922-014",
    dataSolicitacao: "22/09/2026",
    status: "Em Análise",
  },
];

export const boletosMock: BoletoFinanceiro[] = [
  {
    id: "bol-1",
    referencia: "Mensalidade Setembro / 2026",
    vencimento: "10/09/2026",
    valor: 780.0,
    status: "Pago",
  },
  {
    id: "bol-2",
    referencia: "Mensalidade Outubro / 2026",
    vencimento: "10/10/2026",
    valor: 780.0,
    status: "A Vencer",
  },
];

export const diariosDocentesMock: DiarioDocenteStatus[] = [
  {
    id: "dir-1",
    disciplinaNome: "Desenvolvimento Front-End Especializado",
    turma: "ADS - 4º Período A",
    professorNome: "Prof. Marcos Vinícius",
    aulasMinistradas: 32,
    aulasPrevistas: 40,
    statusDiario: "Em Dia",
    frequenciaMediaTurma: 94.2,
  },
  {
    id: "dir-2",
    disciplinaNome: "Sistemas Distribuídos e Cloud",
    turma: "ADS - 4º Período B",
    professorNome: "Prof. André Albuquerque",
    aulasMinistradas: 24,
    aulasPrevistas: 40,
    statusDiario: "Pendente (3d)",
    frequenciaMediaTurma: 81.5,
  },
  {
    id: "dir-3",
    disciplinaNome: "Bancos de Dados Relacionais",
    turma: "CC - 2º Período A",
    professorNome: "Prof. Fernando Dantas",
    aulasMinistradas: 18,
    aulasPrevistas: 40,
    statusDiario: "Atrasado",
    frequenciaMediaTurma: 76.0,
  },
];

export interface HistoricoBase {
  totalAulas: number;
  presencas: number;
  faltas: number;
}

// Histórico base da Turma A em Front-End (disciplinaId "1")
export const historicoBaseTurmaMock: Record<string, HistoricoBase> = {
  "aluno-1": { totalAulas: 40, presencas: 38, faltas: 2 },
  "aluno-2": { totalAulas: 40, presencas: 36, faltas: 4 },
  "aluno-3": { totalAulas: 40, presencas: 34, faltas: 6 },
  "aluno-4": { totalAulas: 40, presencas: 30, faltas: 10 }, // 25% → já em risco
  "aluno-5": { totalAulas: 40, presencas: 32, faltas: 8 }, // 20% → mais uma falta e entra no risco 😬
};

/** Histórico de qualquer aluno. Quem não tem histórico recebe o mesmo do João (mock). */
export const historicoBase = (alunoId: string): HistoricoBase =>
  historicoBaseTurmaMock[alunoId] ?? historicoBaseTurmaMock["aluno-1"];
