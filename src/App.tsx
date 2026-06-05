/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  DollarSign, 
  BellRing, 
  Database,
  Stethoscope,
  Heart,
  Clock,
  LogOut,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

// Import Types
import { Paciente, Agendamento, Procedimento, Dentista, FinanceiroLancamento, RegrasNotificacao } from './types';

// Import Mock Data
import { 
  PROCEDIMENTOS_PADRAO, 
  DENTISTAS_PADRAO, 
  PACIENTES_PADRAO, 
  AGENDAMENTOS_PADRAO, 
  FINANCEIRO_PADRAO, 
  NOTIFICACOES_PADRAO 
} from './data/mockData';

// Import Views
import DashboardView from './components/DashboardView';
import AgendaView from './components/AgendaView';
import ProntuarioView from './components/ProntuarioView';
import FinanceiroView from './components/FinanceiroView';
import NotificacoesView from './components/NotificacoesView';
import DatabaseSchemaView from './components/DatabaseSchemaView';

export default function App() {
  // Global States (synchronized with localStorage where convenient)
  const [pacientes, setPacientes] = useState<Paciente[]>(() => {
    const local = localStorage.getItem('odontosaas_pacientes');
    return local ? JSON.parse(local) : PACIENTES_PADRAO;
  });

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() => {
    const local = localStorage.getItem('odontosaas_agendamentos');
    return local ? JSON.parse(local) : AGENDAMENTOS_PADRAO;
  });

  const [lancamentos, setLancamentos] = useState<FinanceiroLancamento[]>(() => {
    const local = localStorage.getItem('odontosaas_lancamentos');
    return local ? JSON.parse(local) : FINANCEIRO_PADRAO;
  });

  const [notificacoesConfig, setNotificacoesConfig] = useState<RegrasNotificacao>(() => {
    const local = localStorage.getItem('odontosaas_notif_config');
    return local ? JSON.parse(local) : NOTIFICACOES_PADRAO;
  });

  // Read-only parameters
  const procedimentos = PROCEDIMENTOS_PADRAO;
  const dentistas = DENTISTAS_PADRAO;

  // Active Tab/Router state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Responsive sidebar toggles
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Quick action shortcut state: tells AgendaView to boot with modal open
  const [bootAgendaWithModal, setBootAgendaWithModal] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('odontosaas_pacientes', JSON.stringify(pacientes));
  }, [pacientes]);

  useEffect(() => {
    localStorage.setItem('odontosaas_agendamentos', JSON.stringify(agendamentos));
  }, [agendamentos]);

  useEffect(() => {
    localStorage.setItem('odontosaas_lancamentos', JSON.stringify(lancamentos));
  }, [lancamentos]);

  useEffect(() => {
    localStorage.setItem('odontosaas_notif_config', JSON.stringify(notificacoesConfig));
  }, [notificacoesConfig]);

  // Handle immediate starting treatment transition
  const handleIniciarAtendimento = (agendamentoId: string) => {
    // 1. Locate appointment
    const targetAg = agendamentos.find(ag => ag.id === agendamentoId);
    if (!targetAg) return;

    // 2. Update status of appointment to "Em Atendimento" if not already there
    const updatedAgs = agendamentos.map(ag => {
      if (ag.id === agendamentoId) {
        return { ...ag, status: 'Em Atendimento' as const };
      }
      return ag;
    });
    setAgendamentos(updatedAgs);

    // 3. Switch to records / 'pacientes' tab automatically
    setActiveTab('pacientes');
    
    // Alert feedback
    const pacName = pacientes.find(p => p.id === targetAg.paciente_id)?.nome || 'Paciente';
    alert(`O atendimento clínico do(a) paciente ${pacName} começou! Redirecionando para o prontuário eletrônico.`);
  };

  // State modification helpers passed down to child views
  const handleAddAgendamento = (novo: Agendamento) => {
    setAgendamentos(prev => [novo, ...prev]);
  };

  const handleUpdateAgendamento = (updated: Agendamento) => {
    setAgendamentos(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const handleDeleteAgendamento = (id: string) => {
    setAgendamentos(prev => prev.filter(item => item.id !== id));
  };

  const handleAddPaciente = (novo: Paciente) => {
    setPacientes(prev => [novo, ...prev]);
  };

  const handleUpdatePaciente = (updated: Paciente) => {
    setPacientes(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const handleAddLancamento = (novo: FinanceiroLancamento) => {
    setLancamentos(prev => [novo, ...prev]);
  };

  const handleUpdateLancamento = (updated: FinanceiroLancamento) => {
    setLancamentos(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  // Switch tabs securely and reset quick flags
  const handleNavigate = (tab: string) => {
    setBootAgendaWithModal(false);
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleQuickAgendar = () => {
    setBootAgendaWithModal(true);
    setActiveTab('agenda');
  };

  return (
    <div id="odontosaas-app" className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-gray-800 antialiased font-sans">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-teal-400" />
          <span className="font-extrabold tracking-tight text-sm">OdontoSaaS</span>
        </div>
        
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 bg-slate-800 rounded-lg text-teal-400 hover:text-white"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar - Navigation Layout */}
      <aside 
        className={`fixed md:relative inset-y-0 left-0 bg-slate-900 text-slate-100 w-64 p-5 flex flex-col justify-between z-45 transition-transform duration-300 transform md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Logo element */}
          <div className="flex items-center gap-2.5 pb-4.5 border-b border-slate-800">
            <div className="p-1.8 bg-teal-500/10 rounded-xl text-teal-400">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-base tracking-tight text-white leading-none">OdontoSaaS</h2>
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block mt-1">SaaS de Gestão</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard Geral', icon: LayoutDashboard },
              { id: 'agenda', label: 'Agenda Inteligente', icon: CalendarDays },
              { id: 'pacientes', label: 'Prontuários & EHR', icon: Users },
              { id: 'financeiro', label: 'Fluxo Financeiro', icon: DollarSign },
              { id: 'notificacoes', label: 'WhatsApp & Lembretes', icon: BellRing },
              { id: 'database', label: 'Arquitetura & BD', icon: Database },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    isActive 
                      ? 'bg-teal-600 text-white shadow shadow-teal-500/15' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-600 border border-teal-500 flex items-center justify-center text-white font-extrabold text-xs">
              CE
            </div>
            <div>
              <p className="font-bold text-xs text-white">Dr. Carlos Eduardo</p>
              <span className="text-[10px] text-gray-400">CRO: PR-45210</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 text-center font-mono py-1.5 bg-slate-950/40 rounded-lg">
            Versão 1.4.0 (Dev)
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-x-hidden">
        
        {/* Top Header metrics (hidden on small dashboard to save height, shown elsewhere) */}
        <header className="hidden md:flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block font-mono">
              Clínica OdontoSaaS • Sênior Portal
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              Sincronizado: <b>Local (Simulado)</b>
            </span>
            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px] border border-emerald-150 animate-pulse">
              Servidor Ativo
            </span>
          </div>
        </header>

        {/* View switching panel */}
        <div className="transition-all duration-300">
          {activeTab === 'dashboard' && (
            <DashboardView 
              agendamentos={agendamentos}
              pacientes={pacientes}
              procedimentos={procedimentos}
              lancamentos={lancamentos}
              onIniciarAtendimento={handleIniciarAtendimento}
              onNavigate={handleNavigate}
              onQuickAgendar={handleQuickAgendar}
              onQuickPaciente={() => handleNavigate('pacientes')}
            />
          )}

          {activeTab === 'agenda' && (
            <AgendaView 
              agendamentos={agendamentos}
              pacientes={pacientes}
              procedimentos={procedimentos}
              dentistas={dentistas}
              onAddAgendamento={handleAddAgendamento}
              onUpdateAgendamento={handleUpdateAgendamento}
              onDeleteAgendamento={handleDeleteAgendamento}
              onAddPacienteRapido={handleAddPaciente}
              initialOpenModal={bootAgendaWithModal}
            />
          )}

          {activeTab === 'pacientes' && (
            <ProntuarioView 
              pacientes={pacientes}
              procedimentos={procedimentos}
              onAddPaciente={handleAddPaciente}
              onUpdatePaciente={handleUpdatePaciente}
            />
          )}

          {activeTab === 'financeiro' && (
            <FinanceiroView 
              lancamentos={lancamentos}
              pacientes={pacientes}
              procedimentos={procedimentos}
              onAddLancamento={handleAddLancamento}
              onUpdateLancamento={handleUpdateLancamento}
            />
          )}

          {activeTab === 'notificacoes' && (
            <NotificacoesView 
              notificacoesConfig={notificacoesConfig}
              pacientes={pacientes}
              dentistas={dentistas}
              onUpdateConfig={setNotificacoesConfig}
            />
          )}

          {activeTab === 'database' && (
            <DatabaseSchemaView />
          )}
        </div>

      </main>

    </div>
  );
}
