/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Trash2, 
  Filter, 
  Check, 
  FileText, 
  Search, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  AlertTriangle,
  X,
  Stethoscope
} from 'lucide-react';
import { Agendamento, Paciente, Procedimento, Dentista, StatusAgendamento } from '../types';

interface AgendaViewProps {
  agendamentos: Agendamento[];
  pacientes: Paciente[];
  procedimentos: Procedimento[];
  dentistas: Dentista[];
  onAddAgendamento: (novo: Agendamento) => void;
  onUpdateAgendamento: (updatedAtendimento: Agendamento) => void;
  onDeleteAgendamento: (id: string) => void;
  onAddPacienteRapido: (novo: Paciente) => void;
  initialOpenModal?: boolean;
}

export default function AgendaView({
  agendamentos,
  pacientes,
  procedimentos,
  dentistas,
  onAddAgendamento,
  onUpdateAgendamento,
  onDeleteAgendamento,
  onAddPacienteRapido,
  initialOpenModal = false
}: AgendaViewProps) {
  // Calendar States
  const [activeTab, setActiveTab] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [selectedDentistaId, setSelectedDentistaId] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-05'); // Active focus date matches metadata

  // Appointment Modal States
  const [isOpenModal, setIsOpenModal] = useState(initialOpenModal);
  const [searchPacValue, setSearchPacValue] = useState('');
  const [selectedPacienteId, setSelectedPacienteId] = useState('');
  const [selectedDentistaIdModal, setSelectedDentistaIdModal] = useState(dentistas[0]?.id || '');
  const [selectedProcedimentoIdModal, setSelectedProcedimentoIdModal] = useState(procedimentos[0]?.id || '');
  const [modalDate, setModalDate] = useState('2026-06-05');
  const [modalTime, setModalTime] = useState('08:00');
  const [modalDuration, setModalDuration] = useState(30);
  const [modalStatus, setModalStatus] = useState<StatusAgendamento>('Agendado');
  const [modalObs, setModalObs] = useState('');
  const [isNewPatientFast, setIsNewPatientFast] = useState(false);
  const [fastPatientNome, setFastPatientNome] = useState('');
  const [fastPatientTel, setFastPatientTel] = useState('');

  // Edit Appointment Modal
  const [selectedAgendamentoEdit, setSelectedAgendamentoEdit] = useState<Agendamento | null>(null);

  // Sync initial modal state
  useEffect(() => {
    if (initialOpenModal) {
      setIsOpenModal(true);
    }
  }, [initialOpenModal]);

  // Assist Duration Autopopulate
  useEffect(() => {
    const selectedProc = procedimentos.find(p => p.id === selectedProcedimentoIdModal);
    if (selectedProc) {
      setModalDuration(selectedProc.duracao_minutos);
    }
  }, [selectedProcedimentoIdModal, procedimentos]);

  // Filter schedules
  const filteredAgendamentos = agendamentos.filter(ag => {
    const matchesDentista = selectedDentistaId === 'all' || ag.dentista_id === selectedDentistaId;
    return matchesDentista;
  });

  // Predictive Paciente Search Options
  const matchedPacientes = searchPacValue.trim() === '' 
    ? [] 
    : pacientes.filter(p => p.nome.toLowerCase().includes(searchPacValue.toLowerCase()));

  // Time slots for Day View (from 08:00 to 18:00 in increments)
  const HOURLY_GRID = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:45', '12:00',
    '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  // Map dates for Week View (Starting June 1st to June 7th, 2026)
  const SEGUNDATOR_WEEK = [
    { label: 'Segunda 01', date: '2026-06-01' },
    { label: 'Terça 02', date: '2026-06-02' },
    { label: 'Quarta 03', date: '2026-06-03' },
    { label: 'Quinta 04', date: '2026-06-04' },
    { label: 'Sexta 05', date: '2026-06-05', active: true },
    { label: 'Sábado 06', date: '2026-06-06' },
    { label: 'Domingo 07', date: '2026-06-07' }
  ];

  // Handle addition of standard booking
  const handleSaveAgendamento = (e: React.FormEvent) => {
    e.preventDefault();
    let finalPacId = selectedPacienteId;

    if (isNewPatientFast) {
      if (!fastPatientNome.trim()) return alert('Insira o nome do novo paciente!');
      const novoPac: Paciente = {
        id: `pac_${Date.now()}`,
        nome: fastPatientNome,
        cpf: '--- Rápido ---',
        data_nascimento: '1990-01-01',
        telefone: fastPatientTel || '(00) 00000-0000',
        email: 'cadastro_rapido@mail.com',
        anamnese: {
          alergias: 'Não preenchido',
          doencas_cronicas: 'Não preenchido',
          medicamentos: 'Não preenchido',
          observacoes: 'Cadastrado direto pela agenda.',
          atualizado_em: '2026-06-05'
        },
        odontograma: {}
      };
      onAddPacienteRapido(novoPac);
      finalPacId = novoPac.id;
    }

    if (!finalPacId && !isNewPatientFast) {
      alert('Selecione ou cadastre um paciente!');
      return;
    }

    // Calcular data hora fim baseado no tempo de duração
    const dateObj = new Date(`${modalDate}T${modalTime}`);
    const dateEndObj = new Date(dateObj.getTime() + modalDuration * 60 * 1000);
    const modalEndTime = dateEndObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }).substring(0, 5);

    const novoAg: Agendamento = {
      id: `ag_${Date.now()}`,
      paciente_id: finalPacId,
      dentista_id: selectedDentistaIdModal,
      procedimento_id: selectedProcedimentoIdModal,
      data_hora_inicio: `${modalDate}T${modalTime}`,
      data_hora_fim: `${modalDate}T${modalEndTime}`,
      status: modalStatus,
      observacoes: modalObs
    };

    onAddAgendamento(novoAg);
    
    // Reset states
    setIsOpenModal(false);
    setSearchPacValue('');
    setSelectedPacienteId('');
    setModalObs('');
    setIsNewPatientFast(false);
    setFastPatientNome('');
    setFastPatientTel('');
  };

  const handleUpdateStatus = (newStatus: StatusAgendamento) => {
    if (selectedAgendamentoEdit) {
      onUpdateAgendamento({
        ...selectedAgendamentoEdit,
        status: newStatus
      });
      setSelectedAgendamentoEdit(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleDelete = () => {
    if (selectedAgendamentoEdit && confirm('Deseja excluir este agendamento?')) {
      onDeleteAgendamento(selectedAgendamentoEdit.id);
      setSelectedAgendamentoEdit(null);
    }
  };

  // Status visual colors
  const getStatusStyle = (status: StatusAgendamento) => {
    switch (status) {
      case 'Agendado': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Confirmado': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Na Sala de Espera': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Em Atendimento': return 'bg-sky-100 text-sky-800 border-sky-300 shadow-xs animate-pulse';
      case 'Concluido': return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'Faltou': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getDentistBadgeColor = (dentId: string) => {
    const d = dentistas.find(dent => dent.id === dentId);
    return d?.id === 'dent_1' ? 'bg-blue-600' : 'bg-emerald-600';
  };

  return (
    <div id="agenda-component" className="space-y-6">
      
      {/* Filtros de Topo & Switcher de visualização */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-xs gap-4">
        
        {/* Filtro do Dentista */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-widest mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtro Profissional</span>
          </div>

          <button
            onClick={() => setSelectedDentistaId('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              selectedDentistaId === 'all' 
                ? 'bg-gray-900 border-gray-900 text-white' 
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todos Profesionais
          </button>

          {dentistas.map(dent => (
            <button
              key={dent.id}
              onClick={() => setSelectedDentistaId(dent.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all inline-flex items-center gap-2 cursor-pointer ${
                selectedDentistaId === dent.id
                  ? dent.id === 'dent_1'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedDentistaId === dent.id ? 'bg-white' : dent.id === 'dent_1' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
              {dent.nome.split(' ').slice(0, 2).join(' ')}
            </button>
          ))}
        </div>

        {/* Visualização de Visualizador (Tabs) */}
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-1 rounded-xl flex">
            {['dia', 'semana', 'mes'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveTab(view as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === view 
                    ? 'bg-white text-gray-900 shadow-xs' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsOpenModal(true)}
            className="inline-flex items-center gap-1.5 px-4.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </button>
        </div>

      </div>

      {/* Grid Principal: Calendário por Modo */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Mini Sidebar esquerdo - Navegador e Bloqueios */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <span className="text-sm font-bold text-gray-800">Seletor de Data</span>
              <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-mono">2026-Jun</span>
            </div>
            
            <div className="space-y-1">
              {SEGUNDATOR_WEEK.map(day => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold border flex items-center justify-between transition-all cursor-pointer ${
                    selectedDate === day.date
                      ? 'bg-teal-50 border-teal-200 text-teal-800 shadow-xs'
                      : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="font-sans">{day.label}</span>
                  {day.active && <span className="bg-teal-600 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full animate-pulse">Hoje</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Bloqueador de Horário rápido */}
          <div>
            <div className="pb-3 border-b border-gray-100 mb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">Avisos & Bloqueios</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            </div>
            
            <div className="space-y-2">
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-amber-800">Intervalo de Almoço</p>
                <p className="text-[10px] text-amber-700 leading-relaxed">
                  Os horários das 12:00 às 13:30 para ambos os dentistas estão bloqueados por padrão.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-[11px] font-bold text-blue-800">Capacidade da Clínica</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-blue-600">Ocupação de hoje:</span>
                  <span className="text-xs font-bold text-blue-800">
                    {Math.round((filteredAgendamentos.filter(a => !a.bloqueio && a.data_hora_inicio.startsWith(selectedDate)).length / 10) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quadro Calendário correspondente às Tabs */}
        <div id="calendar-canvas" className="lg:col-span-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs min-h-[580px]">

          {/* Visualização de DIA */}
          {activeTab === 'dia' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-3 mb-4 border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-gray-800">
                    Horários para Dia {selectedDate.split('-').reverse().join('/')}
                  </h3>
                </div>
                <span className="text-xs text-gray-400">Clique para detalhar ou editar status</span>
              </div>

              <div className="relative border-l border-gray-100 pl-4 space-y-3">
                {HOURLY_GRID.map(time => {
                  const agsNoHorario = filteredAgendamentos.filter(ag => {
                    const agDate = ag.data_hora_inicio.split('T')[0];
                    const agTime = ag.data_hora_inicio.split('T')[1]?.substring(0, 5);
                    return agDate === selectedDate && agTime === time;
                  });

                  return (
                    <div key={time} className="relative group min-h-[45px] flex items-start gap-4">
                      {/* Timeline marker */}
                      <div className="text-right w-12 text-xs font-bold text-gray-400 font-mono pt-1.5">
                        {time}
                      </div>

                      {/* Conteúdo (se houver agendamento) */}
                      <div className="flex-1 space-y-2">
                        {agsNoHorario.length === 0 ? (
                          <div 
                            onClick={() => {
                              setModalTime(time);
                              setModalDate(selectedDate);
                              setIsOpenModal(true);
                            }}
                            className="p-2 border border-dashed border-gray-100 rounded-xl text-left hover:border-teal-200 hover:bg-teal-50/20 text-gray-300 hover:text-teal-600 transition-all cursor-pointer text-xs flex items-center gap-1 min-h-[40px] italic"
                          >
                            <Plus className="w-3.5 h-3.5 opacity-60" />
                            Slot livre
                          </div>
                        ) : (
                          agsNoHorario.map(ag => {
                            const pac = pacientes.find(p => p.id === ag.paciente_id);
                            const proc = procedimentos.find(p => p.id === ag.procedimento_id);
                            
                            // Se for bloqueio
                            if (ag.bloqueio) {
                              return (
                                <div 
                                  key={ag.id} 
                                  className="p-2.5 bg-repeating-stripes border border-gray-200 rounded-xl flex items-center justify-between text-gray-500 opacity-80"
                                >
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-bold uppercase">{ag.observacoes}</span>
                                  </div>
                                  <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">Bloqueado</span>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={ag.id}
                                onClick={() => setSelectedAgendamentoEdit(ag)}
                                className={`p-3 bg-white rounded-xl border-l-4 border-y border-r shadow-xs text-left hover:shadow-md hover:scale-[1.005] duration-150 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-2 border-gray-200 ${
                                  getDentistBadgeColor(ag.dentista_id)
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-900 tracking-tight">
                                      {pac?.nome || 'Paciente avulso'}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusStyle(ag.status)}`}>
                                      {ag.status}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-[11px] text-gray-500 font-sans">
                                    <span className="font-semibold text-teal-700">{proc?.nome || 'Procedimento'}</span>
                                    <span>• Prof: {dentistas.find(d => d.id === ag.dentista_id)?.nome.split(' ').slice(0, 2).join(' ')}</span>
                                  </div>
                                </div>

                                {ag.observacoes && (
                                  <p className="text-[10px] max-w-sm text-gray-400 truncate hidden md:block italic">
                                    "{ag.observacoes}"
                                  </p>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Visualização de SEMANA */}
          {activeTab === 'semana' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-gray-800">Visualização de Agenda Semanal</h3>
                </div>
                <span className="text-xs text-gray-400">Período: 01 a 07 de Junho, 2026</span>
              </div>

              <div className="grid grid-cols-7 gap-2 overflow-x-auto min-w-[600px] border border-gray-100 p-2 rounded-xl bg-gray-50/50">
                {SEGUNDATOR_WEEK.map(day => {
                  const agsDoDia = filteredAgendamentos.filter(ag => ag.data_hora_inicio.startsWith(day.date));
                  
                  return (
                    <div key={day.date} className="min-h-[400px] flex flex-col space-y-2">
                      <div className={`p-2 rounded-lg text-center ${day.active ? 'bg-teal-600 text-white shadow-xs' : 'bg-white text-gray-700 border border-gray-200'}`}>
                        <p className="text-[10px] font-semibold uppercase">{day.label.split(' ')[0]}</p>
                        <p className="text-xs font-bold leading-none mt-1">{day.label.split(' ')[1]}</p>
                      </div>

                      <div className="flex-1 space-y-1.5 flex flex-col justify-start">
                        {agsDoDia.length === 0 ? (
                          <div className="text-[10px] text-gray-300 text-center py-10 bg-white/50 border border-dashed border-gray-200 rounded-lg italic flex-1 flex items-center justify-center">
                            Sem consultas
                          </div>
                        ) : (
                          agsDoDia.map(ag => {
                            if (ag.bloqueio) return null;
                            const pac = pacientes.find(p => p.id === ag.paciente_id);
                            const hora = ag.data_hora_inicio.split('T')[1]?.substring(0, 5) || '';

                            return (
                              <div
                                key={ag.id}
                                onClick={() => setSelectedAgendamentoEdit(ag)}
                                className={`p-2 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02] bg-white border-gray-200 text-ellipsis overflow-hidden`}
                                style={{ borderLeftWidth: '3px', borderLeftColor: ag.dentista_id === 'dent_1' ? '#3b82f6' : '#10b981' }}
                              >
                                <p className="text-[10px] font-bold text-gray-800 truncate">{pac?.nome.split(' ')[0]}</p>
                                <div className="flex items-center justify-between text-[9px] text-gray-400 font-mono mt-1">
                                  <span>{hora}</span>
                                  <span className="font-semibold text-teal-700">{ag.status.charAt(0)}</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Visualização de MÊS */}
          {activeTab === 'mes' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-gray-800">Agenda Mensal Estendida</h3>
                </div>
                <span className="text-xs text-gray-400">Junho de 2026</span>
              </div>

              {/* 35 day grid layout structure with mockup dots */}
              <div className="grid grid-cols-7 gap-1 border border-gray-200 p-1.5 rounded-xl bg-gray-50/70">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map(dayTitle => (
                  <div key={dayTitle} className="text-center font-bold text-[10px] text-gray-400 py-1.5">
                    {dayTitle}
                  </div>
                ))}

                {/* Blank slots to offset starting Sunday/Monday of June 2026 */}
                {Array.from({ length: 1 }).map((_, i) => (
                  <div key={`blank-${i}`} className="min-h-[70px] bg-white/20 border border-gray-100 opacity-40"></div>
                ))}

                {/* Days representation */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
                  const fullDateStr = `2026-06-${dayStr}`;
                  const appointmentsOnDay = filteredAgendamentos.filter(ag => !ag.bloqueio && ag.data_hora_inicio.startsWith(fullDateStr));
                  const isToday = fullDateStr === '2026-06-05';

                  return (
                    <div 
                      key={dayNum} 
                      onClick={() => {
                        setSelectedDate(fullDateStr);
                        setActiveTab('dia');
                      }}
                      className={`min-h-[70px] bg-white border border-gray-100 rounded-lg p-1.5 text-left hover:bg-teal-50/35 transition-all cursor-pointer flex flex-col justify-between ${
                        isToday ? 'outline-2 outline-teal-600 ring-2 ring-teal-500/10' : ''
                      }`}
                    >
                      <span className={`text-[11px] font-bold ${isToday ? 'bg-teal-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-sans' : 'text-gray-400'}`}>
                        {dayNum}
                      </span>

                      {/* Display dots */}
                      {appointmentsOnDay.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex gap-1 flex-wrap">
                            {appointmentsOnDay.slice(0, 3).map(ap => (
                              <span 
                                key={ap.id} 
                                className={`w-1.5 h-1.5 rounded-full ${ap.dentista_id === 'dent_1' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                              ></span>
                            ))}
                          </div>
                          <span className="text-[9px] font-bold text-gray-500 leading-none">
                            {appointmentsOnDay.length} {appointmentsOnDay.length === 1 ? 'cons.' : 'cons.'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* MODAL 1: NOVO AGENDAMENTO */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsOpenModal(false)}></div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <h3 className="font-bold tracking-tight">Novo Agendamento Clínico</h3>
              </div>
              <button 
                onClick={() => setIsOpenModal(false)}
                className="hover:bg-teal-600/50 p-1.5 rounded-lg text-white/95 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAgendamento} className="p-5 space-y-4">
              
              {/* Opção de Paciente novo rápido vs Busca preditiva */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Identificação do Paciente</span>
                  <button 
                    type="button"
                    onClick={() => setIsNewPatientFast(!isNewPatientFast)}
                    className="text-xs text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {isNewPatientFast ? 'Buscar Paciente Existente' : '＋ Cadastrar Rápido'}
                  </button>
                </div>

                {isNewPatientFast ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1.5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Nome Completo *</label>
                      <input 
                        type="text" 
                        required
                        value={fastPatientNome}
                        onChange={(e) => setFastPatientNome(e.target.value)}
                        placeholder="Ex: Pedro de Moraes"
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Telefone WhatsApp</label>
                      <input 
                        type="text" 
                        value={fastPatientTel}
                        onChange={(e) => setFastPatientTel(e.target.value)}
                        placeholder="Ex: (41) 99999-5555"
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative pt-1.5">
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Pesquisar Paciente *</label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input 
                        type="text"
                        value={searchPacValue}
                        onChange={(e) => setSearchPacValue(e.target.value)}
                        placeholder="Digite o nome, CPF ou iniciais do paciente..."
                        className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                      />
                    </div>

                    {/* Predictive options card */}
                    {matchedPacientes.length > 0 && (
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-40 overflow-y-auto">
                        {matchedPacientes.map(pac => (
                          <div
                            key={pac.id}
                            onClick={() => {
                              setSelectedPacienteId(pac.id);
                              setSearchPacValue(pac.nome);
                            }}
                            className="p-2 text-xs font-semibold hover:bg-teal-50/50 cursor-pointer flex items-center justify-between border-b last:border-0 border-gray-50"
                          >
                            <span>{pac.nome}</span>
                            <span className="text-[10px] text-gray-400">{pac.cpf}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedPacienteId && (
                      <div className="mt-2 p-2 bg-teal-50 rounded-lg flex items-center justify-between">
                        <span className="text-[11px] text-teal-800 font-bold">✓ Paciente selecionado com sucesso</span>
                        <button 
                          type="button" 
                          onClick={() => { setSelectedPacienteId(''); setSearchPacValue(''); }}
                          className="text-xs text-red-600 font-bold cursor-pointer hover:underline"
                        >
                          Limpar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Parâmetros do Procedimento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Dentista Responsável *</label>
                  <select 
                    value={selectedDentistaIdModal}
                    onChange={(e) => setSelectedDentistaIdModal(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                  >
                    {dentistas.map(d => (
                      <option key={d.id} value={d.id}>{d.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Procedimento *</label>
                  <select 
                    value={selectedProcedimentoIdModal}
                    onChange={(e) => setSelectedProcedimentoIdModal(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                  >
                    {procedimentos.map(p => (
                      <option key={p.id} value={p.id}>{p.nome} - R$ {p.valor_sugerido}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data, Horário e Estimativa */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Data *</label>
                  <input 
                    type="date"
                    required
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Hora Início *</label>
                  <input 
                    type="time"
                    required
                    value={modalTime}
                    onChange={(e) => setModalTime(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Duração (Minutos)</label>
                  <input 
                    type="number"
                    value={modalDuration}
                    onChange={(e) => setModalDuration(parseInt(e.target.value))}
                    placeholder="Tempo"
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                    title="Tempo estimado preenchido automaticamente de acordo com o plano do procedimento."
                  />
                </div>
              </div>

              {/* Status Inicial do Agendamento */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Status de Triagem Inicial</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Agendado', 'Confirmado', 'Na Sala de Espera'] as StatusAgendamento[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setModalStatus(st)}
                      className={`py-2 text-xs font-semibold rounded-lg uppercase tracking-wider border transition-all cursor-pointer ${
                        modalStatus === st 
                          ? 'bg-teal-50 border-teal-500 text-teal-800' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Observações Editoriais</label>
                <textarea
                  value={modalObs}
                  onChange={(e) => setModalObs(e.target.value)}
                  placeholder="Ex: Paciente com asma moderada. Necessita consultar canais anteriores."
                  rows={2}
                  className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                ></textarea>
              </div>

              {/* Botões do Formulário */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4.5 py-2.5 border border-gray-205 text-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95 cursor-pointer"
                >
                  Agendar Consulta
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITAR / ALTERAR STATUS DO ATENDIMENTO ATIVO */}
      {selectedAgendamentoEdit && (
        <div id="modal-edit-appointment" className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedAgendamentoEdit(null)}></div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-150 max-w-md w-full z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gray-900 text-white p-4.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-sm">Painel de Gerenciamento Clínico</span>
              </div>
              <button 
                onClick={() => setSelectedAgendamentoEdit(null)}
                className="hover:bg-gray-800 p-1.5 rounded-lg text-white/90 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              
              {/* Paciente Info */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Paciente</p>
                <h4 className="font-bold text-gray-900 text-sm">
                  {pacientes.find(p => p.id === selectedAgendamentoEdit.paciente_id)?.nome || 'Paciente de encaixe'}
                </h4>
                <div className="text-xs text-teal-700 font-semibold bg-white border border-teal-100 px-2 py-1 rounded w-max">
                  Procedimento: {procedimentos.find(p => p.id === selectedAgendamentoEdit.procedimento_id)?.nome || 'Procedimento avulso'}
                </div>
              </div>

              {/* Status Action Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Alterar Status do Atendimento</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Agendado', 'Confirmado', 'Na Sala de Espera', 'Em Atendimento', 'Concluido', 'Faltou'] as StatusAgendamento[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(st)}
                      className={`p-2.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer ${
                        selectedAgendamentoEdit.status === st
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {selectedAgendamentoEdit.observacoes && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Observações Clínicas</span>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 italic">
                    "{selectedAgendamentoEdit.observacoes}"
                  </p>
                </div>
              )}

              {/* Ações adicionais */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-3 py-1.8 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir Consulta
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAgendamentoEdit(null)}
                  className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 text-xs font-semibold rounded-lg shadow cursor-pointer"
                >
                  Concluir Visualização
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
