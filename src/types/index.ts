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

// ===== Perfis e Usuários =====
export type PapelUsuario = "aluno" | "professor" | "gestor";

export interface Usuario {
  id: string;
  nome: string; // nome completo (nome + sobrenome)
  sobrenome?: string; // 🆕
  matricula?: string; // 🆕 gerada automaticamente no Supabase
  email: string;
  papel: PapelUsuario;
  turmaOuCargo: string;
  turmasIds: string[]; // aluno: turmas matriculadas | professor: turmas que leciona
  fotoUrl?: string;
}

export interface Professor extends Usuario {
  papel: "professor";
  disciplinasIds: string[];
}

export interface Gestor extends Usuario {
  papel: "gestor";
  permissoes: string[];
}

// ===== Acadêmico =====
export interface Disciplina {
  id: string;
  nome: string;
  cargaHoraria: number;
  professorId: string;
}

export interface Turma {
  id: string;
  nome: string;
  curso: string;
  turno: "Matutino" | "Vespertino" | "Noturno";
  disciplinaId: string;
  professorId: string;
  alunosIds: string[];
}

// ===== Presença por PIN =====
export type StatusPresenca =
  | "PRESENTE_PIN"
  | "PRESENTE_MANUAL"
  | "FALTA"
  | "FALTA_JUSTIFICADA";

export interface ChamadaPIN {
  id: string;
  turmaId: string;
  disciplinaId: string;
  disciplinaNome: string;
  professorId: string;
  pin: string;
  abertaEm: number; // epoch ms
  expiraEm: number; // epoch ms
  encerrada: boolean;
}

export interface RegistroPresenca {
  id: string;
  alunoId: string;
  turmaId: string;
  disciplinaId: string;
  data: string; // AAAA-MM-DD
  status: StatusPresenca;
  chamadaId?: string;
  justificativa?: string;
  registradoEm: number;
}

export type ResultadoValidacaoPIN =
  | "SUCESSO"
  | "PIN_INCORRETO"
  | "PIN_EXPIRADO"
  | "JA_REGISTRADO"
  | "NAO_MATRICULADO";

// ===== Notas, Alertas, Calendário, Regras =====
export interface Nota {
  id: string;
  alunoId: string;
  turmaId: string;
  avaliacao: string; // "AV1", "AV2", "Atividades"...
  bimestre: 1 | 2 | 3 | 4;
  valor: number | null;
  peso: number;
}

export interface Alerta {
  id: string;
  alunoId: string;
  turmaId: string;
  motivo: "FALTAS" | "NOTA" | "AMBOS";
  criadoEm: number;
  notificado: { aluno: boolean; gestor: boolean };
  historico: { em: number; acao: string; porId: string }[];
}

export interface EventoCalendario {
  id: string;
  titulo: string;
  data: string; // AAAA-MM-DD
  horaInicio?: string;
  horaFim?: string;
  tipo: "AULA" | "PROVA" | "ENTREGA" | "FERIADO" | "EVENTO";
  turmaId?: string; // ausente = evento institucional
  descricao?: string;
}

export interface RegraFrequencia {
  frequenciaMinima: number; // %, ex: 75
  mediaMinima: number; // ex: 7
  pesosAvaliacoes: Record<string, number>;
  validadePinMinutos: number;
  digitosPin: 4 | 5 | 6;
  limiteAlertaFaltas: number; // % de faltas que dispara alerta
  prazoJustificativaDias: number;
}
