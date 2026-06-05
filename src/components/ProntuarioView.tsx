/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  Activity, 
  UserPlus,
  PenSquare,
  Save,
  Clock,
  Check
} from 'lucide-react';
import { Paciente, Procedimento } from '../types';

interface ProntuarioViewProps {
  pacientes: Paciente[];
  procedimentos: Procedimento[];
  onAddPaciente: (novo: Paciente) => void;
  onUpdatePaciente: (updatedPac: Paciente) => void;
}

export default function ProntuarioView({
  pacientes,
  procedimentos,
  onAddPaciente,
  onUpdatePaciente
}: ProntuarioViewProps) {
  // Search parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPacienteId, setSelectedPacienteId] = useState<string>(pacientes[0]?.id || '');

  // Patient creation states
  const [isOpenAddPatient, setIsOpenAddPatient] = useState(false);
  const [newPacNome, setNewPacNome] = useState('');
  const [newPacNasc, setNewPacNasc] = useState('');
  const [newPacCPF, setNewPacCPF] = useState('');
  const [newPacTel, setNewPacTel] = useState('');
  const [newPacEmail, setNewPacEmail] = useState('');
  const [newPacAlergias, setNewPacAlergias] = useState('');
  const [newPacDoencas, setNewPacDoencas] = useState('');
  const [newPacMedicamentos, setNewPacMedicamentos] = useState('');
  const [newPacObs, setNewPacObs] = useState('');

  // Anamnese Edit and Evolucao addition
  const [isEditingAnamnese, setIsEditingAnamnese] = useState(false);
  const [editAlergias, setEditAlergias] = useState('');
  const [editDoencas, setEditDoencas] = useState('');
  const [editMedicamentos, setEditMedicamentos] = useState('');
  const [editObs, setEditObs] = useState('');

  // New Clinical Evolution Timeline text
  const [newEvolutionText, setNewEvolutionText] = useState('');
  const [newEvolutionProcId, setNewEvolutionProcId] = useState(procedimentos[0]?.id || '');

  // Tooth selection state in Odontograma
  const [selectedToothN, setSelectedToothN] = useState<number | null>(null);
  const [tempToothEstado, setTempToothEstado] = useState<'saudavel' | 'carie' | 'canal' | 'restauracao' | 'extraido' | 'implante'>('saudavel');
  const [tempToothNote, setTempToothNote] = useState('');

  // Filtering list
  const filteredPacientes = pacientes.filter(p => {
    const q = searchQuery.toLowerCase();
    return p.nome.toLowerCase().includes(q) || p.cpf.includes(q) || p.telefone.includes(q);
  });

  const selectedPac = pacientes.find(p => p.id === selectedPacienteId) || pacientes[0];

  // Helper: calculate age based on date
  const calculateAge = (dobString: string) => {
    try {
      const birth = new Date(dobString);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 30;
    }
  };

  // Turn on edit mode for Anamnese
  const handleStartEditAnamnese = () => {
    if (selectedPac) {
      setEditAlergias(selectedPac.anamnese.alergias);
      setEditDoencas(selectedPac.anamnese.doencas_cronicas);
      setEditMedicamentos(selectedPac.anamnese.medicamentos);
      setEditObs(selectedPac.anamnese.observacoes);
      setIsEditingAnamnese(true);
    }
  };

  // Save Anamnese edits
  const handleSaveAnamnese = () => {
    if (selectedPac) {
      const updatedPac: Paciente = {
        ...selectedPac,
        anamnese: {
          alergias: editAlergias,
          doencas_cronicas: editDoencas,
          medicamentos: editMedicamentos,
          observacoes: editObs,
          atualizado_em: '2026-06-05'
        }
      };
      onUpdatePaciente(updatedPac);
      setIsEditingAnamnese(false);
    }
  };

  // Add customized progression note (Evolution card)
  const handleAddEvolutionNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvolutionText.trim() || !selectedPac) return;

    // Simulate appending to procedural records
    const selectedProc = procedimentos.find(p => p.id === newEvolutionProcId);
    
    // We can save clinical evolution logs into the observations or a designated object, 
    // or simulate this by appending text to the notes. Let's append directly to the observations log
    const updatedObs = (selectedPac.anamnese.observacoes ? selectedPac.anamnese.observacoes + '\n' : '') + 
      `[Reg: 05/06/2026 - Proc: ${selectedProc?.nome || 'Geral'}] ${newEvolutionText}`;

    onUpdatePaciente({
      ...selectedPac,
      anamnese: {
        ...selectedPac.anamnese,
        observacoes: updatedObs,
        atualizado_em: '2026-06-05'
      }
    });

    setNewEvolutionText('');
    alert('Nova evolução clínica integrada ao prontuário!');
  };

  // Select a dente tooth to edit condition
  const handleToothClick = (toothNum: number) => {
    setSelectedToothN(toothNum);
    const existing = selectedPac?.odontograma?.[toothNum];
    setTempToothEstado(existing?.estado || 'saudavel');
    setTempToothNote(existing?.observacoes || '');
  };

  // Save changes to the tooth (Odontograma digital update)
  const handleSaveToothConfig = () => {
    if (selectedPac && selectedToothN) {
      const newOdonto = { ...selectedPac.odontograma };
      newOdonto[selectedToothN] = {
        estado: tempToothEstado,
        observacoes: tempToothNote,
        atualizado_em: '2026-06-05'
      };

      onUpdatePaciente({
        ...selectedPac,
        odontograma: newOdonto
      });

      setSelectedToothN(null);
    }
  };

  // Save entire patient creation form
  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPacNome.trim() || !newPacCPF.trim()) return;

    const novo: Paciente = {
      id: `pac_${Date.now()}`,
      nome: newPacNome,
      data_nascimento: newPacNasc || '1990-01-01',
      cpf: newPacCPF,
      telefone: newPacTel || '(41) 99999-0000',
      email: newPacEmail || 'contato@mail.com',
      anamnese: {
        alergias: newPacAlergias || 'Nenhuma',
        doencas_cronicas: newPacDoencas || 'Nenhuma',
        medicamentos: newPacMedicamentos || 'Nenhum',
        observacoes: newPacObs || '',
        atualizado_em: '2026-06-05'
      },
      odontograma: {}
    };

    onAddPaciente(novo);
    setSelectedPacienteId(novo.id);
    setIsOpenAddPatient(false);

    // Reset fields
    setNewPacNome('');
    setNewPacNasc('');
    setNewPacCPF('');
    setNewPacTel('');
    setNewPacEmail('');
    setNewPacAlergias('');
    setNewPacDoencas('');
    setNewPacMedicamentos('');
    setNewPacObs('');
  };

  // Odontograma color presets
  const getToothColor = (estado: string) => {
    switch (estado) {
      case 'carie': return 'bg-rose-500 border-rose-600 shadow-rose-200 text-white';
      case 'canal': return 'bg-amber-500 border-amber-600 shadow-amber-200 text-white';
      case 'restauracao': return 'bg-blue-500 border-blue-600 shadow-blue-200 text-white';
      case 'extraido': return 'bg-gray-400 border-gray-500 line-through text-gray-100 opacity-60';
      case 'implante': return 'bg-purple-500 border-purple-600 shadow-purple-200 text-white';
      default: return 'bg-white border-emerald-500 shadow-emerald-50 text-emerald-800 hover:bg-emerald-50/20';
    }
  };

  // Tooth standard listing
  const UPPER_ARCH_LEFT = [18, 17, 16, 15, 14, 13, 12, 11];
  const UPPER_ARCH_RIGHT = [21, 22, 23, 24, 25, 26, 27, 28];
  const LOWER_ARCH_LEFT = [48, 47, 46, 45, 44, 43, 42, 41];
  const LOWER_ARCH_RIGHT = [31, 32, 33, 34, 35, 36, 37, 38];

  return (
    <div id="prontuario-page" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Coluna Esquerda: Listagem e Busca de Pacientes */}
      <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between min-h-[500px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 inline-flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              Pacientes Cadastrados
            </h2>
            <button
              onClick={() => setIsOpenAddPatient(true)}
              className="p-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Novo
            </button>
          </div>

          {/* Input busca */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nome, CPF ou celular..."
              className="w-full text-xs pl-9 pr-4 py-2.8 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all font-semibold"
            />
          </div>

          <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
            {filteredPacientes.length === 0 ? (
              <div className="py-10 text-center text-gray-400 italic text-xs">
                Nenhum paciente localizado...
              </div>
            ) : (
              filteredPacientes.map(pac => {
                const isActive = pac.id === selectedPac?.id;
                const isAlergico = pac.anamnese.alergias && pac.anamnese.alergias.toLowerCase() !== 'nenhuma';
                
                return (
                  <div
                    key={pac.id}
                    onClick={() => setSelectedPacienteId(pac.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                      isActive 
                        ? 'bg-teal-50/50 border-teal-200 shadow-xs' 
                        : 'bg-white border-gray-50 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900 text-xs truncate max-w-[200px]">{pac.nome}</p>
                      {isAlergico && (
                        <span className="bg-rose-50 border border-rose-100 text-[9px] text-rose-700 px-1.5 py-0.2 rounded font-bold uppercase animate-pulse">
                          Alergia
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400 font-mono">
                      <span>CPF: {pac.cpf}</span>
                      <span>{pac.telefone}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 bg-gray-50 p-3 rounded-xl text-[11px] text-gray-500">
          Atualmente gerenciando <b>{pacientes.length} fichas</b> ativas no consultório.
        </div>
      </div>

      {/* Coluna Direita: Ficha de Prontuário Completa */}
      <div className="lg:col-span-8 space-y-6">
        
        {selectedPac ? (
          <div className="space-y-6">
            
            {/* 1. Header do Paciente */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Ficha do Paciente
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">{selectedPac.nome}</h2>
                
                <div className="flex items-center gap-4 flex-wrap mt-2 text-xs text-gray-400">
                  <span>Nascimento: <b>{selectedPac.data_nascimento.split('-').reverse().join('/')}</b> ({calculateAge(selectedPac.data_nascimento)} anos)</span>
                  <span>CPF: <b>{selectedPac.cpf}</b></span>
                  <span>Cel: <b>{selectedPac.telefone}</b></span>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-100 p-3 rounded-xl text-xs text-teal-800 self-start md:self-center">
                <span className="font-bold block">E-mail de Contato</span>
                <span className="font-mono">{selectedPac.email}</span>
              </div>
            </div>

            {/* 2. Anamnese do Paciente */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 inline-flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-500" />
                  Triagem & Anamnese Clínica
                </h3>
                
                {isEditingAnamnese ? (
                  <button
                    onClick={handleSaveAnamnese}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Salvar Ficha
                  </button>
                ) : (
                  <button
                    onClick={handleStartEditAnamnese}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    <PenSquare className="w-3.5 h-3.5" />
                    Editar Anamnese
                  </button>
                )}
              </div>

              {isEditingAnamnese ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Alergias Conocidas</label>
                    <input 
                      type="text" 
                      value={editAlergias}
                      onChange={(e) => setEditAlergias(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Doenças Crônicas</label>
                    <input 
                      type="text" 
                      value={editDoencas}
                      onChange={(e) => setEditDoencas(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Medicamentos de uso contínuo</label>
                    <input 
                      type="text" 
                      value={editMedicamentos}
                      onChange={(e) => setEditMedicamentos(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                    <span className="text-[10px] uppercase font-bold text-red-700 block">Alergias</span>
                    <span className="text-xs font-semibold text-red-900 mt-1 block">
                      {selectedPac.anamnese.alergias}
                    </span>
                  </div>

                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                    <span className="text-[10px] uppercase font-bold text-amber-700 block">D. Crônicas</span>
                    <span className="text-xs font-semibold text-amber-900 mt-1 block">
                      {selectedPac.anamnese.doencas_cronicas}
                    </span>
                  </div>

                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <span className="text-[10px] uppercase font-bold text-blue-700 block">Medicamentos</span>
                    <span className="text-xs font-semibold text-blue-900 mt-1 block">
                      {selectedPac.anamnese.medicamentos}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Odontograma Digital Interativo (Grafismo inovador e colorido) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 animate-fade-in">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 inline-flex items-center gap-1.5">
                    <Activity className="text-teal-600 w-4 h-4" />
                    Odontograma Digital Interativo (Sistema FDI)
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Selecione qualquer dente para diagnosticar e marcar restaurações, cáries ou canais.</p>
                </div>

                <div className="flex gap-2 flex-wrap max-w-sm">
                  <span className="inline-flex items-center gap-1 text-[9px] bg-red-105 bg-rose-500 px-1.5 py-0.5 rounded text-white font-bold">Cárie</span>
                  <span className="inline-flex items-center gap-1 text-[9px] bg-amber-505 bg-amber-500 px-1.5 py-0.5 rounded text-white font-bold">Canal</span>
                  <span className="inline-flex items-center gap-1 text-[9px] bg-blue-550 bg-blue-500 px-1.5 py-0.5 rounded text-white font-bold">Resina</span>
                  <span className="inline-flex items-center gap-1 text-[9px] bg-purple-550 bg-purple-500 px-1.5 py-0.5 rounded text-white font-bold">Implante</span>
                  <span className="inline-flex items-center gap-1 text-[9px] bg-gray-450 bg-gray-400 px-1.5 py-0.5 rounded text-white font-bold">Extraído</span>
                </div>
              </div>

              {/* Graphical tooth boxes layout */}
              <div className="space-y-6 bg-gray-50/50 border border-gray-150 p-4 rounded-xl overflow-x-auto">
                
                {/* Arcada Superior */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold text-gray-400 text-center block tracking-widest">Arcada Superior (Quadrantes 1 e 2)</span>
                  
                  <div className="flex items-center justify-center gap-1.5 min-w-[500px]">
                    {/* Quadrante 1 - Superior Esquerdo (18 a 11) */}
                    {UPPER_ARCH_LEFT.map(num => {
                      const st = selectedPac.odontograma?.[num];
                      return (
                        <div
                          key={num}
                          onClick={() => handleToothClick(num)}
                          className={`w-9 h-11 border rounded-lg flex flex-col items-center justify-between py-1 shadow-xs transition-all duration-150 cursor-pointer hover:border-gray-900 text-center relative hover:scale-105 ${getToothColor(st?.estado)}`}
                          title={`Dente ${num}: ${st?.estado || 'Saudável'}. Observações: ${st?.observacoes || 'Nenhuma'}`}
                        >
                          <span className="text-[9px] font-bold leading-none">{num}</span>
                          <span className="text-[7px] tracking-tight uppercase leading-none font-semibold block scale-90">{st?.estado ? st.estado.substring(0, 5) : 'OK'}</span>
                        </div>
                      );
                    })}

                    {/* Divisória da Linha Média */}
                    <div className="w-0.5 h-10 bg-slate-400 mx-1"></div>

                    {/* Quadrante 2 - Superior Direito (21 a 28) */}
                    {UPPER_ARCH_RIGHT.map(num => {
                      const st = selectedPac.odontograma?.[num];
                      return (
                        <div
                          key={num}
                          onClick={() => handleToothClick(num)}
                          className={`w-9 h-11 border rounded-lg flex flex-col items-center justify-between py-1 shadow-xs transition-all duration-150 cursor-pointer hover:border-gray-900 text-center relative hover:scale-105 ${getToothColor(st?.estado)}`}
                          title={`Dente ${num}: ${st?.estado || 'Saudável'}`}
                        >
                          <span className="text-[9px] font-bold leading-none">{num}</span>
                          <span className="text-[7px] tracking-tight uppercase leading-none font-semibold block scale-90">{st?.estado ? st.estado.substring(0, 5) : 'OK'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Arcada Inferior */}
                <div className="space-y-2 pt-2 border-t border-dashed border-gray-200">
                  <span className="text-[9px] uppercase font-bold text-gray-400 text-center block tracking-widest">Arcada Inferior (Quadrantes 4 e 3)</span>
                  
                  <div className="flex items-center justify-center gap-1.5 min-w-[500px]">
                    {/* Quadrante 4 - Inferior Esquerdo (48 a 41) */}
                    {LOWER_ARCH_LEFT.map(num => {
                      const st = selectedPac.odontograma?.[num];
                      return (
                        <div
                          key={num}
                          onClick={() => handleToothClick(num)}
                          className={`w-9 h-11 border rounded-lg flex flex-col items-center justify-between py-1 shadow-xs transition-all duration-150 cursor-pointer hover:border-gray-900 text-center relative hover:scale-105 ${getToothColor(st?.estado)}`}
                          title={`Dente ${num}: ${st?.estado || 'Saudável'}`}
                        >
                          <span className="text-[9px] font-bold leading-none">{num}</span>
                          <span className="text-[7px] tracking-tight uppercase leading-none font-semibold block scale-90">{st?.estado ? st.estado.substring(0, 5) : 'OK'}</span>
                        </div>
                      );
                    })}

                    {/* Divisória da Linha Média */}
                    <div className="w-0.5 h-10 bg-slate-400 mx-1"></div>

                    {/* Quadrante 3 - Inferior Direito (31 a 38) */}
                    {LOWER_ARCH_RIGHT.map(num => {
                      const st = selectedPac.odontograma?.[num];
                      return (
                        <div
                          key={num}
                          onClick={() => handleToothClick(num)}
                          className={`w-9 h-11 border rounded-lg flex flex-col items-center justify-between py-1 shadow-xs transition-all duration-150 cursor-pointer hover:border-gray-900 text-center relative hover:scale-105 ${getToothColor(st?.estado)}`}
                          title={`Dente ${num}: ${st?.estado || 'Saudável'}`}
                        >
                          <span className="text-[9px] font-bold leading-none">{num}</span>
                          <span className="text-[7px] tracking-tight uppercase leading-none font-semibold block scale-90">{st?.estado ? st.estado.substring(0, 5) : 'OK'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Informações dos dentes acometidos */}
              <div className="mt-4 p-3.5 bg-gray-50 border border-gray-100 rounded-xl">
                <span className="text-xs font-bold text-gray-700 block mb-2">Diagnósticos e Alterações Clínicas Atuais</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedPac.odontograma || {}).filter(([_, val]) => val.estado !== 'saudavel').length === 0 ? (
                    <div className="text-gray-400 italic">Nenhum procedimento ou cárie registrado neste prontuário dental atualmente.</div>
                  ) : (
                    Object.entries(selectedPac.odontograma).filter(([_, val]) => val.estado !== 'saudavel').map(([num, val]) => (
                      <div key={num} className="bg-white p-2 border border-gray-200 rounded-lg flex justify-between items-center font-sans">
                        <div>
                          <span className="font-bold text-teal-800">Dente {num}</span>
                          <span className="text-gray-400 ml-1.5">• Estado: <b className="text-gray-700 uppercase tracking-tight">{val.estado}</b></span>
                        </div>
                        {val.observacoes && (
                          <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[150px]" title={val.observacoes}>
                            {val.observacoes}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* 4. Histórico de Evolução Clínica e Prontuários */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
              <div className="pb-3 border-b border-gray-100 mb-4 pr-1">
                <h3 className="text-sm font-bold text-gray-800 inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Histórico de Evolução Clínica
                </h3>
              </div>

              {/* Evolução form */}
              <form onSubmit={handleAddEvolutionNote} className="space-y-3.5 p-3.5 bg-gray-50 border border-gray-150 rounded-xl mb-4">
                <span className="text-xs font-bold text-gray-700 block">Registrar Novo Procedimento Realizado</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input 
                      type="text" 
                      required
                      value={newEvolutionText}
                      onChange={(e) => setNewEvolutionText(e.target.value)}
                      placeholder="Descrição sucinta, ex: Limpeza geral e polimento coronário efetuado"
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <select
                      value={newEvolutionProcId}
                      onChange={(e) => setNewEvolutionProcId(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                    >
                      {procedimentos.map(proc => (
                        <option key={proc.id} value={proc.id}>{proc.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4.5 py-1.8 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg shadow cursor-pointer transition-all inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Lançar Evolução Clínica
                </button>
              </form>

              {/* Timeline list */}
              <div className="relative border-l border-teal-200 pl-4.5 space-y-4 pt-1">
                
                {/* Evolution parsed from the observations field */}
                {selectedPac.anamnese.observacoes ? (
                  selectedPac.anamnese.observacoes.split('\n').map((line, idx) => {
                    const isEvolutionLine = line.startsWith('[Reg:');
                    
                    return (
                      <div key={idx} className="relative">
                        {/* Dot */}
                        <div className={`absolute -left-[24.5px] top-1 w-3 h-3 rounded-full border-2 bg-white ${isEvolutionLine ? 'border-teal-500' : 'border-gray-300'}`}></div>
                        
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-900 tracking-tight leading-relaxed">
                            {line}
                          </p>
                          <span className="text-[10px] text-gray-400 block font-mono">Assinado Digitalmente • Dr. Carlos Eduardo</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-2 text-xs text-gray-400 italic">Nenhum histórico estruturado gravado ainda para este paciente...</div>
                )}

              </div>
            </div>

          </div>
        ) : (
          <div className="py-24 text-center text-gray-400 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-150 shadow-xs">
            <Users className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="font-bold">Nenhum paciente selecionado</h3>
            <p className="text-xs text-gray-400">Clique na listagem ao lado para abrir a anamnese e fotos digitais do paciente.</p>
          </div>
        )}

      </div>

      {/* MODAL 3: NOVO PACIENTE (FICHA COMPLETA) */}
      {isOpenAddPatient && (
        <div id="modal-patient-creation" className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsOpenAddPatient(false)}></div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-150 max-w-xl w-full z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-bold tracking-tight">Cadastro de Novo Paciente</h3>
              </div>
              <button 
                onClick={() => setIsOpenAddPatient(false)}
                className="hover:bg-teal-600/50 p-1.5 rounded-lg text-white/95 cursor-pointer"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="p-5 space-y-4">
              
              <div className="font-bold text-xs uppercase text-gray-400 tracking-wider">Identificação Geral</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={newPacNome}
                    onChange={(e) => setNewPacNome(e.target.value)}
                    placeholder="Nome completo do paciente"
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    value={newPacCPF}
                    onChange={(e) => setNewPacCPF(e.target.value)}
                    placeholder="Ex: 000.000.000-00"
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Data Nascimento *</label>
                  <input
                    type="date"
                    required
                    value={newPacNasc}
                    onChange={(e) => setNewPacNasc(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">WhatsApp Telefone *</label>
                  <input
                    type="text"
                    required
                    value={newPacTel}
                    onChange={(e) => setNewPacTel(e.target.value)}
                    placeholder="Ex: (41) 99876-5432"
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 block mb-1">E-mail</label>
                  <input
                    type="email"
                    value={newPacEmail}
                    onChange={(e) => setNewPacEmail(e.target.value)}
                    placeholder="Ex: paciente@mail.com"
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="font-bold text-xs uppercase text-gray-400 tracking-wider">Histórico de Saúde / Triagem rápida</div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Alergias</label>
                  <input
                    type="text"
                    value={newPacAlergias}
                    onChange={(e) => setNewPacAlergias(e.target.value)}
                    placeholder="Ex: Dipirona, Latex"
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">D. Crônicas</label>
                  <input
                    type="text"
                    value={newPacDoencas}
                    onChange={(e) => setNewPacDoencas(e.target.value)}
                    placeholder="Ex: Hipertensão"
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Medicamentos</label>
                  <input
                    type="text"
                    value={newPacMedicamentos}
                    onChange={(e) => setNewPacMedicamentos(e.target.value)}
                    placeholder="Ex: Losartana"
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Notas de Triagem Clínicas</label>
                <textarea
                  value={newPacObs}
                  onChange={(e) => setNewPacObs(e.target.value)}
                  placeholder="Ex: Paciente possui medo de motorzinho. Indicado sedação consciente leve..."
                  rows={2}
                  className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpenAddPatient(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-500 rounded-xl cursor-pointer"
                >
                  Sair
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all"
                >
                  Efetuar Cadastro Paciente
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: DETALHE DO DENTE (SISTEMA ODONTOGRAMA DIGITAL) */}
      {selectedToothN && (
        <div id="modal-tooth-config" className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedToothN(null)}></div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-150 max-w-sm w-full z-15 overflow-hidden">
            <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
              <span className="font-bold text-sm">Ficha Clínica - Dente #{selectedToothN}</span>
              <button onClick={() => setSelectedToothN(null)} className="text-white hover:opacity-80 font-bold">X</button>
            </div>

            <div className="p-4 space-y-4">
              
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Diagnose / Estado do Dente</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'saudavel', label: 'Saudável (OK)' },
                    { val: 'carie', label: 'Cárie Recorrente' },
                    { val: 'canal', label: 'Tratamento Canal' },
                    { val: 'restauracao', label: 'Restauração Resina' },
                    { val: 'extraido', label: 'Perda/Extraído' },
                    { val: 'implante', label: 'Implante Prótese' }
                  ].map(option => (
                    <button
                      key={option.val}
                      type="button"
                      onClick={() => setTempToothEstado(option.val as any)}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer ${
                        tempToothEstado === option.val
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Notas Diagnósticas Especiais</label>
                <input 
                  type="text"
                  value={tempToothNote}
                  onChange={(e) => setTempToothNote(e.target.value)}
                  placeholder="Ex: Apresenta sensibilidade ao gelo."
                  className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => setSelectedToothN(null)}
                  className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-500 font-semibold cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  onClick={handleSaveToothConfig}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow cursor-pointer shadow-xs"
                >
                  Salvar Dente
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
