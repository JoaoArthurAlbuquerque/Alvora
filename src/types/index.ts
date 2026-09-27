export type TabAluno =
  | "dashboard"
  | "disciplinas"
  | "frequencia"
  | "boletim"
  | "secretaria";
export type TabProfessor =
  | "dashboard"
  | "diario"
  | "notas"
  | "conteudos"
  | "atendimento";
export type TabGestor =
  | "dashboard"
  | "radar_risco"
  | "diarios_docentes"
  | "comunicados";

export interface User {
  id: string;
  nome: string;
  email: string;
  role: "aluno" | "professor" | "gestor";
}

export interface SessaoFrequenciaAoVivo {
  id: string;
  disciplinaId: string;
  disciplinaNome: string;
  pinCode: string;
  tempoLimiteSegundos: number;
  ativa: boolean;
  alunosPresentesIds: string[];
}

export interface HistoricoFrequenciaItem {
  disciplinaId: string;
  disciplinaNome: string;
  totalAulas: number;
  presencas: number;
  faltas: number;
  percentualFrequencia: number;
}

export interface Aluno extends User {
  matricula: string;
  curso: string;
  mediaGeral: number;
  historicoFrequencia: HistoricoFrequenciaItem[];
}

export interface AlunoEmRisco {
  id: string;
  nome: string;
  matricula: string;
  curso: string;
  disciplinaNome: string;
  percentualFrequencia: number;
  faltasAcumuladas: number;
  maxFaltasPermitidas: number;
  mediaAtual: number;
  motivoRisco: "FALTAS" | "NOTA" | "AMBOS";
}

export interface AvaliacaoUnidade {
  unidade: string;
  nota: number | null;
  peso: number;
}

export interface BoletimDisciplina {
  id: string;
  disciplinaNome: string;
  professorNome: string;
  av1: number;
  av2: number | null;
  atividadesContinuas: number;
  mediaParcial: number;
  status: "Aprovado" | "Em Andamento" | "Em Risco";
}

export interface RequerimentoSecretaria {
  id: string;
  titulo: string;
  protocolo: string;
  dataSolicitacao: string;
  status: "Concluído" | "Em Análise" | "Pendente";
}

export interface BoletoFinanceiro {
  id: string;
  referencia: string;
  vencimento: string;
  valor: number;
  status: "Pago" | "A Vencer" | "Em Atraso";
}

export interface DiarioDocenteStatus {
  id: string;
  disciplinaNome: string;
  turma: string;
  professorNome: string;
  aulasMinistradas: number;
  aulasPrevistas: number;
  statusDiario: "Em Dia" | "Pendente (3d)" | "Atrasado";
  frequenciaMediaTurma: number;
}
