/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  CalendarDays, 
  DollarSign, 
  AlertTriangle, 
  Play, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  ChevronRight, 
  TrendingUp, 
  Activity,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { Agendamento, Paciente, Procedimento, FinanceiroLancamento } from '../types';

interface DashboardViewProps {
  agendamentos: Agendamento[];
  pacientes: Paciente[];
  procedimentos: Procedimento[];
  lancamentos: FinanceiroLancamento[];
  onIniciarAtendimento: (agendamentoId: string) => void;
  onNavigate: (tab: string) => void;
  onQuickAgendar: () => void;
  onQuickPaciente: () => void;
}

export default function DashboardView({
  agendamentos,
  pacientes,
  procedimentos,
  lancamentos,
  onIniciarAtendimento,
  onNavigate,
  onQuickAgendar,
  onQuickPaciente
}: DashboardViewProps) {
  // Helpers
  const getPacienteNome = (id: string) => pacientes.find(p => p.id === id)?.nome || 'Paciente não cadastrado';
  const getProcedimentoNome = (id: string) => procedimentos.find(p => p.id === id)?.nome || 'Procedimento avulso';
  const getProcedimentoCor = (id: string) => {
    const proc = procedimentos.find(p => p.id === id);
    if (!proc) return 'bg-gray-100 text-gray-700';
    if (proc.cor === 'emerald') return 'bg-teal-50 text-teal-700 border border-teal-200';
    if (proc.cor === 'blue') return 'bg-blue-50 text-blue-700 border border-blue-200';
    if (proc.cor === 'amber') return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (proc.cor === 'violet') return 'bg-purple-50 text-purple-700 border border-purple-200';
    if (proc.cor === 'rose') return 'bg-rose-50 text-rose-700 border border-rose-200';
    return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
  };

  // Filtrar apenas agendamentos de hoje (2026-06-05) que não sejam bloqueios
  const totalAgendadosHoje = agendamentos.filter(ag => !ag.bloqueio && ag.data_hora_inicio.startsWith('2026-06-05')).length;
  const concluidosHoje = agendamentos.filter(ag => !ag.bloqueio && ag.data_hora_inicio.startsWith('2026-06-05') && ag.status === 'Concluido').length;
  
  // Próximos 3 pacientes do dia (Agendado, Confirmado ou Na Sala de Espera)
  const proximosPacientes = agendamentos
    .filter(ag => !ag.bloqueio && ag.data_hora_inicio.startsWith('2026-06-05') && ag.status !== 'Concluido' && ag.status !== 'Faltou')
    .sort((a, b) => a.data_hora_inicio.localeCompare(b.data_hora_inicio))
    .slice(0, 3);

  // Faturamento bruto do mês (soma de lançamentos de entrada 'Pago' em Junho de 2026)
  const totalFaturamentoMensal = lancamentos
    .filter(l => l.tipo === 'entrada' && l.status === 'Pago' && l.data_vencimento.startsWith('2026-06'))
    .reduce((sum, current) => sum + current.valor, 0);

  // Inadimplência do mês: (Pendente Atrasado do tipo entrada / (Pago + Pendente Entrada)) * 100
  const entradasPagasPendente = lancamentos.filter(l => l.tipo === 'entrada');
  const pagasEEntradasTotal = entradasPagasPendente.reduce((sum, item) => sum + item.valor, 0);
  const atrasadasTotal = entradasPagasPendente.filter(l => l.status === 'Atrasado').reduce((sum, item) => sum + item.valor, 0);
  const percentualInadimplencia = pagasEEntradasTotal > 0 ? parseFloat(((atrasadasTotal / pagasEEntradasTotal) * 100).toFixed(1)) : 0;

  // Lançamentos do dia
  const doDiaLancamentos = lancamentos.filter(l => l.data_vencimento === '2026-06-05');
  const entradasDoDia = doDiaLancamentos.filter(l => l.tipo === 'entrada').reduce((sum, item) => sum + item.valor, 0);
  const saidasDoDia = doDiaLancamentos.filter(l => l.tipo === 'saida').reduce((sum, item) => sum + item.valor, 0);

  // Estado interativo para exibir tooltips no gráfico de fluxo de caixa
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Categoria de despesas/receitas agrupadas para o gráfico do dia
  const financeiroGraficoData = [
    { label: 'Entradas (Tratamentos)', valor: entradasDoDia, cor: '#0d9488' },
    { label: 'Saídas (Insumos/Custos)', valor: saidasDoDia, cor: '#e11d48' },
  ];

  return (
    <div id="dashboard-view" className="space-y-6">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 font-sans">
            Olá, Dr. Carlos Eduardo
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Aqui está o resumo da sua clínica para hoje, <span className="font-medium text-gray-700">05 de Junho de 2026</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-3 self-start md:self-center">
          <button 
            id="btn-quick-paciente"
            onClick={onQuickPaciente}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-gray-500" />
            Novo Paciente Rápido
          </button>
          
          <button 
            id="btn-quick-agendar"
            onClick={onQuickAgendar}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <CalendarDays className="w-4 h-4" />
            Nova Consulta
          </button>
        </div>
      </div>

      {/* Cards de Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metrica 1: Consultas Hoje */}
        <div id="metric-consultas" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:border-teal-100 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-500">Consultas de Hoje</span>
            <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-gray-900 font-sans">{totalAgendadosHoje}</span>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-teal-700 font-medium bg-teal-50/50 px-2 py-0.5 rounded-md w-max">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{concluidosHoje} concluídas</span>
            </div>
          </div>
        </div>

        {/* Metrica 2: Novos Pacientes */}
        <div id="metric-pacientes" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:border-blue-100 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-500">Novos Pacientes</span>
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-gray-900 font-sans">+{pacientes.length}</span>
            <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% que o mês anterior</span>
            </div>
          </div>
        </div>

        {/* Metrica 3: Faturamento Bruto */}
        <div id="metric-faturamento" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:border-emerald-100 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-500">Faturamento Mensal</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-gray-900 font-sans">
              {totalFaturamentoMensal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Meta de Junho 68% batida</span>
            </div>
          </div>
        </div>

        {/* Metrica 4: Inadimplência */}
        <div id="metric-inadimplencia" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:border-rose-100 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-500">Inadimplência clínica</span>
            <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-gray-900 font-sans">{percentualInadimplencia}%</span>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-700 font-medium bg-rose-50/50 px-2 py-0.5 rounded-md w-max">
              <Clock className="w-3.5 h-3.5" />
              <span>R$ {(atrasadasTotal).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} em aberto</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid Principal (Agenda Resumida vs Caixa do Dia) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Agenda Resumida (Foco no Dentista/Secretária) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-semibold text-gray-900">Agenda de Atendimento (Próximos)</h2>
              </div>
              <button 
                onClick={() => onNavigate('agenda')} 
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                Ver agenda completa
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {proximosPacientes.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <CalendarDays className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm font-medium">Não há novos agendamentos para hoje.</p>
                  <p className="text-xs text-gray-400">Todos os pacientes já foram atendidos ou faltaram.</p>
                </div>
              ) : (
                proximosPacientes.map((ag) => {
                  const hora = ag.data_hora_inicio.split('T')[1]?.substring(0, 5) || ag.data_hora_inicio.substring(11, 16);
                  const pac = pacientes.find(p => p.id === ag.paciente_id);
                  const proc = procedimentos.find(pr => pr.id === ag.procedimento_id);
                  const isAlergico = pac?.anamnese?.alergias && pac.anamnese.alergias.toLowerCase() !== 'nenhuma';

                  return (
                    <div 
                      key={ag.id} 
                      className={`p-4 border border-gray-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/75 transition-all ${
                        ag.status === 'Na Sala de Espera' ? 'border-amber-100 bg-amber-50/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center justify-center bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 min-w-[65px]">
                          <Clock className="w-4 h-4 text-gray-500 mb-0.5" />
                          <span className="text-sm font-bold text-gray-800 font-mono">{hora}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-900 tracking-tight">{getPacienteNome(ag.paciente_id)}</span>
                            {isAlergico && (
                              <span className="bg-rose-50 text-rose-700 text-[10px] px-1.5 py-0.5 rounded border border-rose-100 font-medium animate-pulse">
                                Alergia: {pac?.anamnese.alergias}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${getProcedimentoCor(ag.procedimento_id)}`}>
                              {getProcedimentoNome(ag.procedimento_id)}
                            </span>
                            <span className="text-xs text-gray-400">• Dur: {proc?.duracao_minutos || 40} min</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-gray-400">Status:</span>
                            <span className={`font-semibold ${
                              ag.status === 'Na Sala de Espera' ? 'text-amber-600' :
                              ag.status === 'Confirmado' ? 'text-emerald-600' :
                              ag.status === 'Em Atendimento' ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              {ag.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          id={`btn-iniciar-${ag.id}`}
                          onClick={() => onIniciarAtendimento(ag.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-lg text-xs font-semibold hover:shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-teal-700" />
                          Iniciar Atendimento
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 bg-gray-50 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <p className="text-xs font-medium text-gray-600">
                Atendimento ativo atualmente: <span className="text-teal-700 font-semibold">
                  {agendamentos.filter(ag => ag.status === 'Em Atendimento').map(ag => getPacienteNome(ag.paciente_id)).join(', ') || 'Nenhum paciente na cadeira'}
                </span>
              </p>
            </div>
            
            {agendamentos.some(ag => ag.status === 'Em Atendimento') && (
              <button 
                onClick={() => onNavigate('pacientes')}
                className="text-xs font-semibold text-teal-600 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                Ver Ficha do Paciente
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Fluxo de Caixa do Dia */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-emerald-600 w-5 h-5" />
                <h2 className="text-lg font-semibold text-gray-900">Fluxo de Caixa do Dia</h2>
              </div>
              <button 
                onClick={() => onNavigate('financeiro')} 
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                Gerenciar financeiro
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                <div className="flex items-center gap-1.5 text-teal-700 text-xs font-semibold uppercase tracking-wider">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Entradas de Hoje</span>
                </div>
                <p className="text-2xl font-bold text-teal-800 mt-1">
                  {entradasDoDia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>

              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                <div className="flex items-center gap-1.5 text-rose-700 text-xs font-semibold uppercase tracking-wider">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Saídas de Hoje</span>
                </div>
                <p className="text-2xl font-bold text-rose-800 mt-1">
                  {saidasDoDia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>

            {/* SVG Interactive Chart */}
            <div className="mt-6 flex flex-col items-center">
              <span className="text-xs text-gray-400 self-start mb-2">Comparativo Diário</span>
              <div className="relative w-full h-44 bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-end justify-around">
                {/* Linhas de grade estáticas */}
                <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-gray-200"></div>
                <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-gray-200"></div>
                <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-gray-200"></div>

                {financeiroGraficoData.map((bar, idx) => {
                  // Calcular percentual proporcional à maior barra
                  const maxVal = Math.max(entradasDoDia, saidasDoDia, 100);
                  const pct = Math.max((bar.valor / maxVal) * 100, 10); // min 10%
                  
                  return (
                    <div 
                      key={idx} 
                      className="relative flex flex-col items-center group cursor-pointer z-10"
                      onMouseEnter={() => setHoveredBar(bar.label)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Tooltip */}
                      {(hoveredBar === bar.label || !hoveredBar && idx === 0) && (
                        <div className="absolute -top-12 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg font-medium whitespace-nowrap text-center animate-fade-in pointer-events-none">
                          <span className="font-semibold block">{bar.label}</span>
                          <span className="font-mono text-[11px]">{bar.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                      )}

                      {/* Barra */}
                      <div 
                        className="w-16 rounded-t-lg transition-all duration-500 hover:brightness-105"
                        style={{ 
                          height: `${pct * 0.9}px`, 
                          backgroundColor: bar.cor,
                          boxShadow: `0 4px 12px ${bar.cor}25`
                        }}
                      ></div>
                      
                      <span className="text-xs font-semibold text-gray-600 mt-2 tracking-tight">
                        {idx === 0 ? 'Entradas' : 'Saídas'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Saldo Líquido Diário: <b>{(entradasDoDia - saidasDoDia).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
            </span>
            <span className="text-[11px] bg-gray-100 px-2 py-0.5 rounded font-mono">Competência: Competido</span>
          </div>

        </div>

      </div>

      {/* Seção Informativa de Produtividade */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-teal-500/15 pointer-events-none"></div>
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-emerald-500/15 pointer-events-none"></div>

        <div className="max-w-2xl relative z-10">
          <span className="bg-teal-500 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full mb-3.5 inline-block">
            SaaS de Alta Performance
          </span>
          <h3 className="text-xl font-bold font-sans tracking-tight">
            Economize até 4 horas semanais com a régua de confirmação via WhatsApp
          </h3>
          <p className="text-sm text-teal-100/90 mt-2 leading-relaxed">
            Diferente de sistemas legados, o <b>OdontoSaaS</b> envia disparos inteligentes na véspera de cada consulta. 
            O índice de Faltas cai em média 35%. Todas as confirmações dadas pelos clientes atualizam automaticamente os ícones da sua agenda em tempo real!
          </p>
          <div className="mt-4 flex items-center gap-4">
            <button 
              onClick={() => onNavigate('notificacoes')}
              className="px-4 py-2 bg-white text-teal-800 hover:bg-teal-50 active:scale-95 text-xs font-semibold rounded-lg shadow transition-all cursor-pointer"
            >
              Configurar Réguas de Mensagem
            </button>
            <span className="text-xs text-teal-200">
              Acesse a documentação clicando no ícone do banco para ver como isso é estruturado na base de dados.
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
