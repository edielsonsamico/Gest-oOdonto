/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dentista, Paciente, Procedimento, Agendamento, FinanceiroLancamento, RegrasNotificacao } from '../types';

export const PROCEDIMENTOS_PADRAO: Procedimento[] = [
  { id: 'proc_1', nome: 'Limpeza e Profilaxia', valor_sugerido: 180, duracao_minutos: 40, cor: 'emerald' },
  { id: 'proc_2', nome: 'Restauração de Resina', valor_sugerido: 250, duracao_minutos: 45, cor: 'blue' },
  { id: 'proc_3', nome: 'Tratamento de Canal', valor_sugerido: 750, duracao_minutos: 60, cor: 'amber' },
  { id: 'proc_4', nome: 'Implante Dentário', valor_sugerido: 2800, duracao_minutos: 90, cor: 'violet' },
  { id: 'proc_5', nome: 'Extração de Siso', valor_sugerido: 380, duracao_minutos: 50, cor: 'rose' },
  { id: 'proc_6', nome: 'Manutenção de Aparelho', valor_sugerido: 150, duracao_minutos: 30, cor: 'indigo' },
];

export const DENTISTAS_PADRAO: Dentista[] = [
  {
    id: 'dent_1',
    nome: 'Dr. Carlos Eduardo Malta',
    cro: 'PR-45210',
    especialidade: 'Implantodontia e Prótese',
    cor: 'border-l-4 border-l-blue-500',
    agenda_config: { hora_inicio: '08:00', hora_fim: '18:00', duracao_padrao: 45 }
  },
  {
    id: 'dent_2',
    nome: 'Dra. Mariana Santos Costa',
    cro: 'PR-39824',
    especialidade: 'Ortodontia e Odontopediatria',
    cor: 'border-l-4 border-l-emerald-500',
    agenda_config: { hora_inicio: '08:30', hora_fim: '18:30', duracao_padrao: 30 }
  }
];

export const PACIENTES_PADRAO: Paciente[] = [
  {
    id: 'pac_1',
    nome: 'Ana Julia de Oliveira Martins',
    data_nascimento: '1995-10-12',
    cpf: '123.456.789-00',
    telefone: '(41) 99876-5432',
    email: 'anajulia@mail.com',
    anamnese: {
      alergias: 'Alergia a Penicilina e Dipirona',
      doencas_cronicas: 'Nenhuma',
      medicamentos: 'Nenhum',
      observacoes: 'Paciente relata grande receio de agulhas. Necessita de conversa prévia antes da anestesia.',
      atualizado_em: '2026-05-15'
    },
    odontograma: {
      16: { estado: 'carie', observacoes: 'Cárie oclusal profunda identificada em exame clínico.', atualizado_em: '2026-06-01' },
      22: { estado: 'canal', observacoes: 'Necessidade de tratamento endodôntico por fratura coronária.', atualizado_em: '2026-06-02' },
      36: { estado: 'restauracao', observacoes: 'Restauração de resina em ótimo estado.', atualizado_em: '2026-04-10' },
      46: { estado: 'extraido', observacoes: 'Perda do dente há 4 anos. Indicada reabilitação com implante.', atualizado_em: '2026-05-20' }
    }
  },
  {
    id: 'pac_2',
    nome: 'Marcos Vinicius Rezende da Silva',
    data_nascimento: '1988-03-24',
    cpf: '234.567.890-11',
    telefone: '(41) 99765-4321',
    email: 'marcosv.rezende@mail.com',
    anamnese: {
      alergias: 'Látex',
      doencas_cronicas: 'Hipertensão Controlada',
      medicamentos: 'Losartana 50mg/dia',
      observacoes: 'Aferir a pressão arterial no início de cada consulta cirúrgica.',
      atualizado_em: '2026-05-12'
    },
    odontograma: {
      18: { estado: 'extraido', observacoes: 'Siso extraído preventivamente.', atualizado_em: '2025-06-12' },
      28: { estado: 'extraido', observacoes: 'Siso extraído preventivamente.', atualizado_em: '2025-06-12' },
      38: { estado: 'extraido', observacoes: 'Siso extraído preventivamente.', atualizado_em: '2025-06-12' },
      48: { estado: 'extraido', observacoes: 'Siso extraído preventivamente.', atualizado_em: '2025-06-12' }
    }
  },
  {
    id: 'pac_3',
    nome: 'Gisela Maria Albuquerque',
    data_nascimento: '2001-07-08',
    cpf: '345.678.901-22',
    telefone: '(41) 99123-4567',
    email: 'gisela.alb@mail.com',
    anamnese: {
      alergias: 'Nenhuma',
      doencas_cronicas: 'Nenhuma',
      medicamentos: 'Contraceptivo oral',
      observacoes: 'Faz tratamento ortodôntico contínuo. Excelente higiene oral.',
      atualizado_em: '2026-05-01'
    },
    odontograma: {
      11: { estado: 'saudavel' },
      21: { estado: 'saudavel' }
    }
  },
  {
    id: 'pac_4',
    nome: 'Pedro Henrique Guedes',
    data_nascimento: '2016-12-05',
    cpf: '456.789.012-33',
    telefone: '(41) 99234-5678',
    email: 'pedroguedes.pais@mail.com',
    anamnese: {
      alergias: 'Nenhuma',
      doencas_cronicas: 'Asma moderada',
      medicamentos: 'Aerolin spray SOS',
      observacoes: 'Acompanhado pela mãe. Paciente infantil um pouco agitado mas colaborativo. Gosta de desenhos animados.',
      atualizado_em: '2026-05-20'
    },
    odontograma: {
      51: { estado: 'saudavel' },
      52: { estado: 'carie', observacoes: 'Elemento decíduo com cárie de esmalte rasa.', atualizado_em: '2026-06-03' }
    }
  },
  {
    id: 'pac_5',
    nome: 'Roberto Carlos Sanches',
    data_nascimento: '1962-02-14',
    cpf: '567.890.123-44',
    telefone: '(41) 98877-6655',
    email: 'roberto.sanches@mail.com',
    anamnese: {
      alergias: 'Aspirina (AAS)',
      doencas_cronicas: 'Diabetes Tipo 2',
      medicamentos: 'Metformina 850mg',
      observacoes: 'Glicemia atualizada de 110mg/dL reportada em consulta. Cicatrização normal.',
      atualizado_em: '2026-05-30'
    },
    odontograma: {
      14: { estado: 'implante', observacoes: 'Implante instalado e cicatrizado.', atualizado_em: '2025-11-10' },
      15: { estado: 'implante', observacoes: 'Implante instalado e cicatrizado.', atualizado_em: '2025-11-10' }
    }
  },
  {
    id: 'pac_6',
    nome: 'Beatriz Vasconcellos de Souza',
    data_nascimento: '1993-05-30',
    cpf: '678.901.234-55',
    telefone: '(41) 98111-2222',
    email: 'bia.vasco@mail.com',
    anamnese: {
      alergias: 'Nenhuma',
      doencas_cronicas: 'Nenhuma',
      medicamentos: 'Nenhum',
      observacoes: 'Pretende fazer clareamento dental após término das restaurações pendentes.',
      atualizado_em: '2026-06-01'
    },
    odontograma: {
      44: { estado: 'carie', observacoes: 'Cárie de fóssula detectada.', atualizado_em: '2026-06-01' }
    }
  }
];

export const AGENDAMENTOS_PADRAO: Agendamento[] = [
  {
    id: 'ag_1',
    paciente_id: 'pac_1',
    dentista_id: 'dent_1',
    procedimento_id: 'proc_3', // Canal
    data_hora_inicio: '2026-06-05T09:00',
    data_hora_fim: '2026-06-05T10:00',
    status: 'Confirmado',
    observacoes: 'Sessão 2 do canal do dente 22.'
  },
  {
    id: 'ag_2',
    paciente_id: 'pac_2',
    dentista_id: 'dent_1',
    procedimento_id: 'proc_1', // Limpeza
    data_hora_inicio: '2026-06-05T10:15',
    data_hora_fim: '2026-06-05T11:00',
    status: 'Na Sala de Espera',
    observacoes: 'Chegou 15 minutos adiantado. Pressão aferida: 125/80 mmHg.'
  },
  {
    id: 'ag_block_1',
    paciente_id: '',
    dentista_id: 'dent_1',
    procedimento_id: '',
    data_hora_inicio: '2026-06-05T12:00',
    data_hora_fim: '2026-06-05T13:00',
    status: 'Concluido',
    observacoes: 'Bloqueio de Horário - Almoço Dr. Carlos',
    bloqueio: true
  },
  {
    id: 'ag_3',
    paciente_id: 'pac_3',
    dentista_id: 'dent_2',
    procedimento_id: 'proc_6', // Aparelho
    data_hora_inicio: '2026-06-05T09:30',
    data_hora_fim: '2026-06-05T10:00',
    status: 'Concluido',
    observacoes: 'Manutenção realizada com sucesso, trocadas as borrachinhas.'
  },
  {
    id: 'ag_4',
    paciente_id: 'pac_4',
    dentista_id: 'dent_2',
    procedimento_id: 'proc_2', // Restauração
    data_hora_inicio: '2026-06-05T11:00',
    data_hora_fim: '2026-06-05T11:45',
    status: 'Agendado',
    observacoes: 'Dente 52 decíduo.'
  },
  {
    id: 'ag_block_2',
    paciente_id: '',
    dentista_id: 'dent_2',
    procedimento_id: '',
    data_hora_inicio: '2026-06-05T12:30',
    data_hora_fim: '2026-06-05T13:30',
    status: 'Concluido',
    observacoes: 'Bloqueio de Horário - Intervalo de Almoço Dra. Mariana',
    bloqueio: true
  },
  {
    id: 'ag_5',
    paciente_id: 'pac_5',
    dentista_id: 'dent_1',
    procedimento_id: 'proc_4', // Implante
    data_hora_inicio: '2026-06-05T14:00',
    data_hora_fim: '2026-06-05T15:30',
    status: 'Agendado',
    observacoes: 'Cirurgia agendada. Termo de consentimento já assinado.'
  },
  {
    id: 'ag_6',
    paciente_id: 'pac_6',
    dentista_id: 'dent_2',
    procedimento_id: 'proc_2', // Restauração dente 44
    data_hora_inicio: '2026-06-05T16:00',
    data_hora_fim: '2026-06-05T16:45',
    status: 'Em Atendimento',
    observacoes: 'Paciente na cadeira.'
  }
];

export const FINANCEIRO_PADRAO: FinanceiroLancamento[] = [
  {
    id: 'fin_1',
    tipo: 'entrada',
    valor: 750,
    data_vencimento: '2026-06-05',
    data_pagamento: '2026-06-05',
    status: 'Pago',
    paciente_id: 'pac_1',
    procedimento_id: 'proc_3',
    descricao: 'Pagamento Integral - Tratamento de Canal',
    metodo_pagamento: 'Pix',
    categoria: 'Tratamento'
  },
  {
    id: 'fin_2',
    tipo: 'entrada',
    valor: 150,
    data_vencimento: '2026-06-05',
    data_pagamento: '2026-06-05',
    status: 'Pago',
    paciente_id: 'pac_3',
    procedimento_id: 'proc_6',
    descricao: 'Manutenção de Aparelho - Gisela',
    metodo_pagamento: 'Dinheiro',
    categoria: 'Manutenção'
  },
  {
    id: 'fin_3',
    tipo: 'saida',
    valor: 240,
    data_vencimento: '2026-06-05',
    data_pagamento: '2026-06-05',
    status: 'Pago',
    descricao: 'Compra de Material Descartável (Luvas e Máscaras)',
    categoria: 'Insumos Clínicos'
  },
  {
    id: 'fin_4',
    tipo: 'entrada',
    valor: 180,
    data_vencimento: '2026-06-05',
    status: 'Pendente',
    paciente_id: 'pac_2',
    procedimento_id: 'proc_1',
    descricao: 'Profilaxia Marcos Rezende',
    categoria: 'Prevenção'
  },
  {
    id: 'fin_5',
    tipo: 'entrada',
    valor: 2800,
    data_vencimento: '2026-06-15',
    status: 'Pendente',
    paciente_id: 'pac_5',
    procedimento_id: 'proc_4',
    descricao: 'Entrada Cirurgia de Implante Dentário Roberto',
    categoria: 'Implantodontia'
  },
  {
    id: 'fin_6',
    tipo: 'saida',
    valor: 1600,
    data_vencimento: '2026-06-10',
    status: 'Pendente',
    descricao: 'Aluguel do Imóvel Comercial Consultório',
    categoria: 'Custos Fixos'
  },
  {
    id: 'fin_7',
    tipo: 'saida',
    valor: 450,
    data_vencimento: '2026-06-02',
    status: 'Atrasado',
    descricao: 'Material Protético Laboratório Dente 22',
    categoria: 'Laboratório'
  },
  {
    id: 'fin_8',
    tipo: 'entrada',
    valor: 500,
    data_vencimento: '2026-05-25',
    status: 'Atrasado',
    paciente_id: 'pac_6',
    descricao: 'Parcela 1 Tratamento Reabilitador Beatriz',
    categoria: 'Tratamento'
  }
];

export const NOTIFICACOES_PADRAO: RegrasNotificacao = {
  enviar_24h_antes: true,
  enviar_2h_antes: true,
  canal_whatsapp: true,
  canal_email: false,
  template_whatsapp: 'Olá, *{{nome_paciente}}*! Passando para confirmar seu atendimento amanhã ({{data}}) às *{{hora}}* com o *{{nome_dentista}}* na clínica OdontoSaaS. Responda com *1 para CONFIRMAR* ou *2 para REAGENDAR* ou falar conosco.',
  template_email: 'Prezado(a) {{nome_paciente}},\n\nLembramos que sua consulta está agendada para {{data}} às {{hora}} com o profissional {{nome_dentista}}.\n\nAtenciosamente,\nEquipe OdontoSaaS'
};

// Pastas recomendadas em formato de árvore para visualização
export const ESTRUTURA_DE_PASTAS_DOC = `dentos_saas/
├── src/
│   ├── types.ts              # Definições de Tipos e Interfaces
│   ├── main.tsx              # Ponto de entrada do React
│   ├── App.tsx               # Roteador Principal com Abas e Layout
│   ├── index.css             # Importação do Tailwind CSS v4
│   ├── data/
│   │   └── mockData.ts       # Dados mockados e modelos estáticos
│   ├── components/
│   │   ├── DashboardView.tsx # Dashboard com indicadores e fluxo de caixa
│   │   ├── AgendaView.tsx    # Agenda Interativa (Dia/Semana/Mês)
│   │   ├── ProntuarioView.tsx# Prontuário Clínico & Odontograma Interativo
│   │   ├── FinanceiroView.tsx# Gestão Financeira Completa do Caixa
│   │   └── NotificacoesView.tsx# Painel de Lembretes WhatsApp e Réguas
│   │   └── DatabaseSchemaView.tsx # Visualizador Interativo da Arquitetura de BD
├── package.json              # Configurações do npm e Scripts de build
└── vite.config.ts            # Configurações do Vite e plugins`;

// Código do Esquema de Banco de Dados de Produção para visualização rápida no app
export const ESQUEMA_BANCO_DE_DADOS_DOC = `-- =========================================================================
-- ESQUEMA DE BANCO DE DADOS POSTGRESQL (ODONTOSAAS)
-- Criação de tabelas, índices e restrições integradas
-- =========================================================================

-- Tabela de Dentistas
CREATE TABLE IF NOT EXISTS dentistas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    cro VARCHAR(20) UNIQUE NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    agenda_config JSONB NOT NULL DEFAULT '{
        "hora_inicio": "08:00",
        "hora_fim": "18:00",
        "duracao_padrao_minutos": 45
    }'::jsonb,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pacientes
CREATE TABLE IF NOT EXISTS pacientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    anamnese JSONB NOT NULL DEFAULT '{
        "alergias": "Nenhuma",
        "doencas_cronicas": "Nenhuma",
        "medicamentos": "Nenhuns",
        "observacoes": ""
    }'::jsonb,
    odontograma JSONB NOT NULL DEFAULT '{}'::jsonb,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Procedimentos Odontológicos
CREATE TABLE IF NOT EXISTS procedimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    valor_sugerido DECIMAL(10,2) NOT NULL,
    duracao_minutos INTEGER NOT NULL DEFAULT 30,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Agendamentos / Sessões clínicas
CREATE TABLE IF NOT EXISTS agendamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID REFERENCES pacientes(id) ON DELETE SET NULL,
    dentista_id UUID NOT NULL REFERENCES dentistas(id) ON DELETE CASCADE,
    procedimento_id UUID REFERENCES procedimentos(id) ON DELETE SET NULL,
    data_hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_hora_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('Agendado', 'Confirmado', 'Na Sala de Espera', 'Em Atendimento', 'Concluido', 'Faltou')),
    observacoes TEXT,
    bloqueio BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Lançamentos Financeiros (Fluxo de Caixa)
CREATE TABLE IF NOT EXISTS financeiro_lancamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    valor DECIMAL(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Pago', 'Pendente', 'Atrasado')),
    paciente_id UUID REFERENCES pacientes(id) ON DELETE SET NULL,
    procedimento_id UUID REFERENCES procedimentos(id) ON DELETE SET NULL,
    descricao VARCHAR(255) NOT NULL,
    metodo_pagamento VARCHAR(35) CHECK (metodo_pagamento IN ('Pix', 'Cartao de Credito', 'Boleto', 'Dinheiro')),
    categoria VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de Performance sugeridos para buscas
CREATE INDEX IF NOT EXISTS idx_agendamentos_datas ON agendamentos (data_hora_inicio, data_hora_fim);
CREATE INDEX IF NOT EXISTS idx_agendamentos_dentista ON agendamentos (dentista_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_nome ON pacientes (nome);
CREATE INDEX IF NOT EXISTS idx_pacientes_cpf ON pacientes (cpf);
CREATE INDEX IF NOT EXISTS idx_financeiro_vencimento ON financeiro_lancamentos (data_vencimento);
`;
