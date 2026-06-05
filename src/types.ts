/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Dentista {
  id: string;
  nome: string;
  cro: string;
  especialidade: string;
  cor: string; // Tailwind bg color or border color prefix
  agenda_config: {
    hora_inicio: string; // e.g. "08:00"
    hora_fim: string;    // e.g. "18:00"
    duracao_padrao: number; // e.g. 30 (minutos)
  };
}

export interface Paciente {
  id: string;
  nome: string;
  data_nascimento: string;
  cpf: string;
  telefone: string;
  email: string;
  anamnese: {
    alergias: string;
    doencas_cronicas: string;
    medicamentos: string;
    observacoes: string;
    atualizado_em: string;
  };
  odontograma: Record<number, {
    estado: 'saudavel' | 'carie' | 'canal' | 'restauracao' | 'extraido' | 'implante';
    observacoes?: string;
    atualizado_em?: string;
  }>;
}

export interface Procedimento {
  id: string;
  nome: string;
  valor_sugerido: number;
  duracao_minutos: number;
  cor: string;
}

export type StatusAgendamento = 'Agendado' | 'Confirmado' | 'Na Sala de Espera' | 'Em Atendimento' | 'Concluido' | 'Faltou';

export interface Agendamento {
  id: string;
  paciente_id: string;
  dentista_id: string;
  procedimento_id: string;
  data_hora_inicio: string; // ISO String or YYYY-MM-DDTHH:mm
  data_hora_fim: string;   // ISO String or YYYY-MM-DDTHH:mm
  status: StatusAgendamento;
  observacoes?: string;
  bloqueio?: boolean; // Se for bloqueio de horário (almoço, etc)
}

export type StatusFinanceiro = 'Pago' | 'Pendente' | 'Atrasado';
export type MeioPagamento = 'Pix' | 'Cartao de Credito' | 'Boleto' | 'Dinheiro';

export interface FinanceiroLancamento {
  id: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  data_vencimento: string; // YYYY-MM-DD
  data_pagamento?: string; // YYYY-MM-DD
  status: StatusFinanceiro;
  paciente_id?: string;
  procedimento_id?: string;
  descricao: string;
  metodo_pagamento?: MeioPagamento;
  categoria: string; // "Tratamento", "Aluguel", "Protese", "Limpeza", etc.
}

export interface RegrasNotificacao {
  enviar_24h_antes: boolean;
  enviar_2h_antes: boolean;
  canal_whatsapp: boolean;
  canal_email: boolean;
  template_whatsapp: string;
  template_email: string;
}
