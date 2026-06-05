/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Save, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Clock,
  UserCheck
} from 'lucide-react';
import { RegrasNotificacao, Paciente, Dentista } from '../types';

interface NotificacoesViewProps {
  notificacoesConfig: RegrasNotificacao;
  pacientes: Paciente[];
  dentistas: Dentista[];
  onUpdateConfig: (updated: RegrasNotificacao) => void;
}

export default function NotificacoesView({
  notificacoesConfig,
  pacientes,
  dentistas,
  onUpdateConfig
}: NotificacoesViewProps) {
  // Config state
  const [enviar24h, setEnviar24h] = useState(notificacoesConfig.enviar_24h_antes);
  const [enviar2h, setEnviar2h] = useState(notificacoesConfig.enviar_2h_antes);
  const [whatsappAtivo, setWhatsappAtivo] = useState(notificacoesConfig.canal_whatsapp);
  const [emailAtivo, setEmailAtivo] = useState(notificacoesConfig.canal_email);
  const [templateWhatsapp, setTemplateWhatsapp] = useState(notificacoesConfig.template_whatsapp);
  const [templateEmail, setTemplateEmail] = useState(notificacoesConfig.template_email);

  // Preview selectors
  const [previewPacienteId, setPreviewPacienteId] = useState(pacientes[0]?.id || '');
  const [previewDentistaId, setPreviewDentistaId] = useState(dentistas[0]?.id || '');
  const [previewTime, setPreviewTime] = useState('14:30');

  // Process template string
  const renderTemplatePreview = (text: string) => {
    const activePac = pacientes.find(p => p.id === previewPacienteId) || pacientes[0];
    const activeDent = dentistas.find(d => d.id === previewDentistaId) || dentistas[0];
    
    let rendered = text
      .replace(/{{nome_paciente}}/g, activePac?.nome || 'Ana Julia Martins')
      .replace(/{{data}}/g, '06/06/2026')
      .replace(/{{hora}}/g, previewTime)
      .replace(/{{nome_dentista}}/g, activeDent?.nome || 'Dr. Carlos Eduardo');

    // Parse simple WhatsApp style markdown like *textRef* into JSX tags in preview
    return rendered;
  };

  const handleSaveConfig = () => {
    onUpdateConfig({
      enviar_24h_antes: enviar24h,
      enviar_2h_antes: enviar2h,
      canal_whatsapp: whatsappAtivo,
      canal_email: emailAtivo,
      template_whatsapp: templateWhatsapp,
      template_email: templateEmail
    });
    alert('Configurações de réguas e alertas gravados com sucesso!');
  };

  // Internal simulated alerts
  const ALERTA_INTERNOS = [
    {
      id: 'alert_1',
      tipo: 'atraso',
      titulo: 'Mensalidade atrasada',
      corpo: 'Paciente Beatriz Vasconcellos está com a Parcela 1 em atraso desde 25/05/2026 (R$ 500,00).',
      hora: 'Ontem às 10:15',
      lido: false
    },
    {
      id: 'alert_2',
      tipo: 'confirmacao',
      titulo: 'Confirmação automática WhatsApp',
      corpo: 'Paciente Ana Julia Martins confirmou consulta para dia 05/06 às 09:00 clicando no botão do Whats.',
      hora: 'Hoje às 08:30',
      lido: true
    },
    {
      id: 'alert_3',
      tipo: 'agendamento_externo',
      titulo: 'Agendamento via Link Externo',
      corpo: 'Gisela Maria solicitou reagendamento de controle ortodôntico para segunda-feira às 15:30.',
      hora: 'Há 25 min',
      lido: false
    }
  ];

  return (
    <div id="notificações-config-view" className="space-y-6">
      
      {/* Grid Principal - Configs / Canal vs Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Lado Esquerdo: Parâmetros Editáveis */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 inline-flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              Configuração das Réguas Ativas
            </h2>
            <button
              onClick={handleSaveConfig}
              className="inline-flex items-center gap-1.5 px-4.5 py-1.8 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar Réguas
            </button>
          </div>

          {/* Trigger rules toggles */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Regras de Tempo (Triggers)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 border rounded-xl transition-all ${enviar24h ? 'border-teal-200 bg-teal-50/10' : 'border-gray-200 bg-gray-50/20'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">Régua 24h Antes</span>
                  <input
                    type="checkbox"
                    checked={enviar24h}
                    onChange={(e) => setEnviar24h(e.target.checked)}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 rounded"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  Dispara uma confirmação automática na véspera da consulta. Solicita confirmação de presença (1 ou 2).
                </p>
              </div>

              <div className={`p-4 border rounded-xl transition-all ${enviar2h ? 'border-teal-200 bg-teal-50/10' : 'border-gray-200 bg-gray-50/20'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">Régua 2h Antes</span>
                  <input
                    type="checkbox"
                    checked={enviar2h}
                    onChange={(e) => setEnviar2h(e.target.checked)}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 rounded"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  Lembrete expedido no próprio dia do atendimento. Reduz esquecimentos pontuais em consultório.
                </p>
              </div>
            </div>
          </div>

          {/* Channels toggles */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Canais Ativos de Disparo</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => setWhatsappAtivo(!whatsappAtivo)}
                className={`p-4 border rounded-xl transition-all cursor-pointer flex items-center gap-3 ${
                  whatsappAtivo ? 'border-emerald-500/50 bg-emerald-50/10' : 'border-gray-250 opacity-60'
                }`}
              >
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-950 block">WhatsApp Business API</span>
                  <span className="text-[10px] text-gray-400">Verificado • 95% de taxa de abertura</span>
                </div>
              </div>

              <div 
                onClick={() => setEmailAtivo(!emailAtivo)}
                className={`p-4 border rounded-xl transition-all cursor-pointer flex items-center gap-3 ${
                  emailAtivo ? 'border-blue-500/50 bg-blue-50/10' : 'border-gray-250 opacity-60'
                }`}
              >
                <div className="p-2 bg-blue-105 bg-blue-100 text-blue-800 rounded-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-950 block">E-mail Clínico</span>
                  <span className="text-[10px] text-gray-400">Servidor OdontoSaaS SMTP • 42% abertura</span>
                </div>
              </div>
            </div>
          </div>

          {/* Template editor */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Editor de Modelos (Templates)</p>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Cópia Mensagem WhatsApp</label>
                <textarea
                  value={templateWhatsapp}
                  onChange={(e) => setTemplateWhatsapp(e.target.value)}
                  rows={4}
                  className="w-full text-xs p-2.8 bg-gray-50 border border-gray-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                ></textarea>
                <span className="text-[10px] text-gray-400 mt-1 block">Variáveis aceitas: <code>{"{{nome_paciente}}"}</code>, <code>{"{{data}}"}</code>, <code>{"{{hora}}"}</code>, <code>{"{{nome_dentista}}"}</code></span>
              </div>
            </div>
          </div>

        </div>

        {/* Lado Direito: Previewer Interativo de WhatsApp (Visual de Celular) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <div className="pb-3 border-b border-gray-100 mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">Visualização de Celular em Tempo Real</span>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>

            {/* Preview settings */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <div>
                <label className="text-[10px] text-gray-400 block font-bold mb-0.5 uppercase">Paciente Teste</label>
                <select
                  value={previewPacienteId}
                  onChange={(e) => setPreviewPacienteId(e.target.value)}
                  className="bg-white p-1 rounded border text-[11px] w-full"
                >
                  {pacientes.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block font-bold mb-0.5 uppercase">Dentista Teste</label>
                <select
                  value={previewDentistaId}
                  onChange={(e) => setPreviewDentistaId(e.target.value)}
                  className="bg-white p-1 rounded border text-[11px] w-full"
                >
                  {dentistas.map(d => (
                    <option key={d.id} value={d.id}>{d.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cellphone visual simulator */}
            <div className="mx-auto max-w-[280px] border-8 border-gray-950 rounded-[35px] bg-slate-900 overflow-hidden shadow-xl min-h-[420px] flex flex-col justify-between">
              
              {/* Cel Top Bar */}
              <div className="bg-slate-950 text-white text-[9px] py-1.5 px-4 flex justify-between items-center font-mono">
                <span>09:41</span>
                <span className="text-emerald-500 font-bold">OdontoSaaS Chat</span>
              </div>

              {/* Chat Canvas (WhatsApp layout) */}
              <div className="p-3 bg-neutral-100 flex-1 space-y-3 flex flex-col justify-start">
                
                {/* Header chat profile */}
                <div className="bg-white p-2 rounded-lg shadow-2xs flex items-center gap-2 border">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">O</div>
                  <div>
                    <p className="font-bold text-[10px] text-gray-900 leading-none">Consultório Clínico</p>
                    <span className="text-[8px] text-emerald-600 font-semibold">• Online</span>
                  </div>
                </div>

                {/* Message Bubble */}
                {whatsappAtivo ? (
                  <div className="bg-emerald-50 text-gray-800 text-[10.5px] p-2.5 rounded-l-xl rounded-br-xl shadow-2xs border border-emerald-100 max-w-[90%] self-start space-y-1 relative">
                    <p className="whitespace-pre-line leading-relaxed">
                      {renderTemplatePreview(templateWhatsapp)}
                    </p>
                    <span className="text-[8px] text-gray-400 text-right block">09:41 ✓✓</span>
                  </div>
                ) : (
                  <div className="py-20 text-center text-gray-400 italic text-[10px]">
                    Canal WhatsApp desligado nas configurações à esquerda.
                  </div>
                )}

              </div>

              {/* Fake keyboard marker */}
              <div className="bg-white p-2.5 flex items-center justify-between border-t text-[10px] text-gray-400">
                <span>Mensagem de confirmação...</span>
                <Send className="w-3.5 h-3.5 text-emerald-600" />
              </div>

            </div>
          </div>

          {/* Alertas Internos do Sistema */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <div className="pb-3 border-b border-gray-100 mb-3 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-teal-600" />
                Alertas do Sistema (Feedback Secretária)
              </span>
              <span className="bg-rose-50 text-rose-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                {ALERTA_INTERNOS.filter(a => !a.lido).length} novos
              </span>
            </div>

            <div className="space-y-2">
              {ALERTA_INTERNOS.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 border rounded-xl flex items-start gap-2 text-xs transition-colors ${
                    !alert.lido ? 'bg-amber-550/5 border-amber-100 bg-amber-50/30' : 'bg-gray-50 border-gray-150 opacity-80'
                  }`}
                >
                  <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${alert.tipo === 'atraso' ? 'text-red-550 text-red-600' : 'text-teal-600'}`} />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 block">{alert.titulo}</span>
                      <span className="text-[9px] text-gray-400 font-mono">• {alert.hora}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{alert.corpo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
