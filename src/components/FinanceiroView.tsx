/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  QrCode, 
  CreditCard, 
  Briefcase, 
  Users, 
  X,
  Sparkles,
  ChevronRight,
  ClipboardCheck,
  Building
} from 'lucide-react';
import { FinanceiroLancamento, Paciente, Procedimento, MeioPagamento, StatusFinanceiro } from '../types';

interface FinanceiroViewProps {
  lancamentos: FinanceiroLancamento[];
  pacientes: Paciente[];
  procedimentos: Procedimento[];
  onAddLancamento: (novo: FinanceiroLancamento) => void;
  onUpdateLancamento: (updated: FinanceiroLancamento) => void;
}

export default function FinanceiroView({
  lancamentos,
  pacientes,
  procedimentos,
  onAddLancamento,
  onUpdateLancamento
}: FinanceiroViewProps) {
  // Tabs and general query inputs
  const [activeFinanceFilter, setActiveFinanceFilter] = useState<'todos' | 'entradas' | 'saidas'>('todos');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pago' | 'Pendente' | 'Atrasado'>('all');
  const [financeSearchField, setFinanceSearchField] = useState('');

  // Transaction construction state
  const [isOpenTransactionModal, setIsOpenTransactionModal] = useState(false);
  const [modalType, setModalType] = useState<'entrada' | 'saida'>('entrada');
  const [modalVal, setModalVal] = useState<number>(150);
  const [modalDate, setModalDate] = useState('2026-06-05');
  const [modalDesc, setModalDesc] = useState('');
  const [modalCat, setModalCat] = useState('Tratamento');
  const [modalMethod, setModalMethod] = useState<MeioPagamento>('Pix');
  const [modalStatus, setModalStatus] = useState<StatusFinanceiro>('Pendente');
  const [modalPacienteId, setModalPacienteId] = useState('');
  const [modalParcelas, setModalParcelas] = useState(1);

  // Pix payment simulation modal
  const [activePixSimulationItem, setActivePixSimulationItem] = useState<FinanceiroLancamento | null>(null);
  const [activeCardSimulationItem, setActiveCardSimulationItem] = useState<FinanceiroLancamento | null>(null);

  // Sum helpers
  const totalEntradasPago = lancamentos
    .filter(l => l.tipo === 'entrada' && l.status === 'Pago')
    .reduce((sum, item) => sum + item.valor, 0);

  const totalEntradasPrevisto = lancamentos
    .filter(l => l.tipo === 'entrada')
    .reduce((sum, item) => sum + item.valor, 0);

  const totalSaidasPago = lancamentos
    .filter(l => l.tipo === 'saida' && l.status === 'Pago')
    .reduce((sum, item) => sum + item.valor, 0);

  const totalSaidasPrevisto = lancamentos
    .filter(l => l.tipo === 'saida')
    .reduce((sum, item) => sum + item.valor, 0);

  const saldoLiquidoAtual = totalEntradasPago - totalSaidasPago;

  const totalAtrasado = lancamentos
    .filter(l => l.status === 'Atrasado' && l.tipo === 'entrada')
    .reduce((sum, item) => sum + item.valor, 0);

  // Filter listings
  const filteredLancamentos = lancamentos.filter(item => {
    const matchesTab = activeFinanceFilter === 'todos' 
      ? true 
      : activeFinanceFilter === 'entradas' 
        ? item.tipo === 'entrada' 
        : item.tipo === 'saida';

    const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
    
    const term = financeSearchField.toLowerCase();
    const matchesSearch = item.descricao.toLowerCase().includes(term) || item.categoria.toLowerCase().includes(term);

    return matchesTab && matchesStatus && matchesSearch;
  });

  const getPacienteName = (id?: string) => {
    if (!id) return '';
    return pacientes.find(p => p.id === id)?.nome || '';
  };

  // Immediate settlement helper
  const handleConfirmSettlePayment = (item: FinanceiroLancamento, method: MeioPagamento) => {
    onUpdateLancamento({
      ...item,
      status: 'Pago',
      data_pagamento: '2026-06-05',
      metodo_pagamento: method
    });
    alert(`Lançamento liquidado via ${method}!`);
    setActivePixSimulationItem(null);
    setActiveCardSimulationItem(null);
  };

  // Create customized transaction ledger
  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalDesc.trim()) return alert('Insira uma descrição!');

    // Handle optional installments/parcelas by multiplying and generating segmented ledger objects
    if (modalParcelas > 1 && modalType === 'entrada') {
      const valuePerInstallment = parseFloat((modalVal / modalParcelas).toFixed(2));
      for (let i = 1; i <= modalParcelas; i++) {
        // Increment date for subsequent installments
        const baseDate = new Date(modalDate);
        baseDate.setMonth(baseDate.getMonth() + (i - 1));
        const finalDateStr = baseDate.toISOString().substring(0, 10);

        const installmentEntry: FinanceiroLancamento = {
          id: `fin_parc_${Date.now()}_${i}`,
          tipo: 'entrada',
          valor: valuePerInstallment,
          data_vencimento: finalDateStr,
          status: 'Pendente',
          descricao: `${modalDesc} (Parc. ${i}/${modalParcelas})`,
          categoria: modalCat,
          paciente_id: modalPacienteId || undefined,
          metodo_pagamento: modalMethod
        };
        onAddLancamento(installmentEntry);
      }
      alert(`Parcelamento efetuado! ${modalParcelas} parcelas de R$ ${valuePerInstallment.toLocaleString('pt-BR')} cadastradas.`);
    } else {
      const singleEntry: FinanceiroLancamento = {
        id: `fin_${Date.now()}`,
        tipo: modalType,
        valor: modalVal,
        data_vencimento: modalDate,
        data_pagamento: modalStatus === 'Pago' ? modalDate : undefined,
        status: modalStatus,
        descricao: modalDesc,
        categoria: modalCat,
        paciente_id: modalPacienteId || undefined,
        metodo_pagamento: modalStatus === 'Pago' ? modalMethod : undefined
      };
      onAddLancamento(singleEntry);
      alert('Lançamento financeiro adicionado com sucesso!');
    }

    setIsOpenTransactionModal(false);
    setModalDesc('');
    setModalPacienteId('');
    setModalParcelas(1);
  };

  const getStatusBadgeClass = (status: StatusFinanceiro) => {
    switch (status) {
      case 'Pago': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pendente': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Atrasado': return 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
    }
  };

  return (
    <div id="finance-ledger-view" className="space-y-6">
      
      {/* Cards de Desempenho Financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Entradas */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 block uppercase tracking-wider">Entradas Liquidada (Mês)</span>
            <p className="text-2xl font-black text-teal-800 font-sans">
              {totalEntradasPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <span className="text-[10px] text-gray-400 block">Previsto total: {totalEntradasPrevisto.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="p-3 bg-teal-50 rounded-2xl text-teal-600">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Saídas */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 block uppercase tracking-wider">Saídas Totais (Mês)</span>
            <p className="text-2xl font-black text-rose-800 font-sans">
              {totalSaidasPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <span className="text-[10px] text-gray-400 block">Orçado previsto: {totalSaidasPrevisto.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        {/* Saldo Líquido */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 block uppercase tracking-wider">Saldo em Conta</span>
            <p className={`text-2xl font-black font-sans ${saldoLiquidoAtual >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
              {saldoLiquidoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <span className="text-[10px] text-gray-400 block">Metas operacionais superadas</span>
          </div>
          <div className={`p-3 rounded-2xl ${saldoLiquidoAtual >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Total em Atraso */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 block uppercase tracking-wider">Inadimplência Bruta</span>
            <p className="text-2xl font-black text-red-700 font-sans animate-pulse">
              {totalAtrasado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <span className="text-[10px] text-gray-400 block">Cobranças WhatsApp pendentes</span>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Tabela de Lançamentos, Filtros e Ações */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        
        {/* Barra de Filtros Customizada */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-gray-100 gap-4">
          
          <div className="flex flex-wrap items-center gap-2">
            
            {/* View Tab selector */}
            <div className="bg-gray-100 p-0.8 rounded-lg flex mr-2">
              {[
                { val: 'todos', label: 'Todos Lançamentos' },
                { val: 'entradas', label: 'Contas a Receber' },
                { val: 'saidas', label: 'Contas a Pagar' }
              ].map(f => (
                <button
                  key={f.val}
                  onClick={() => setActiveFinanceFilter(f.val as any)}
                  className={`px-3 py-1.2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    activeFinanceFilter === f.val 
                      ? 'bg-white text-gray-900 shadow-xs' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Status direct filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs bg-white border border-gray-205 p-1.5 rounded-lg font-semibold text-gray-600"
            >
              <option value="all">Filtro Status (Todos)</option>
              <option value="Pago">Pago</option>
              <option value="Pendente">Pendente</option>
              <option value="Atrasado">Atrasado</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={financeSearchField}
                onChange={(e) => setFinanceSearchField(e.target.value)}
                placeholder="Filtrar por nome/categoria..."
                className="text-xs pl-8 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-teal-500 font-semibold"
              />
            </div>

            <button
              id="btn-register-payment"
              onClick={() => setIsOpenTransactionModal(true)}
              className="inline-flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Lançamento
            </button>
          </div>

        </div>

        {/* Ledger table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider bg-gray-50/50">
                <th className="py-3 px-4">Lançamento / Categoria</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Status / Met.</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLancamentos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 italic">
                    Nenhum lançamento financeiro corresponde a estes filtros operacionais...
                  </td>
                </tr>
              ) : (
                filteredLancamentos.map(item => {
                  const isEntrada = item.tipo === 'entrada';
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors font-sans">
                      
                      {/* Descri */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${isEntrada ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-700'}`}>
                            {isEntrada ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block tracking-tight">{item.descricao}</span>
                            <span className="text-[10px] text-gray-405 text-teal-750 font-bold bg-teal-50 px-1.5 py-0.2 rounded mt-0.5 inline-block">{item.categoria}</span>
                          </div>
                        </div>
                      </td>

                      {/* Paciente */}
                      <td className="py-3.5 px-4">
                        {item.paciente_id ? (
                          <span className="font-semibold text-gray-700 inline-flex items-center gap-1 text-[11px]">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            {getPacienteName(item.paciente_id)}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-[10px]">Custo Geral Consultório</span>
                        )}
                      </td>

                      {/* Vencimento */}
                      <td className="py-3.5 px-4 font-mono font-medium text-gray-500">
                        {item.data_vencimento.split('-').reverse().join('/')}
                      </td>

                      {/* Valor */}
                      <td className="py-3.5 px-4 font-bold text-gray-950 font-mono text-sm">
                        {isEntrada ? '+' : '-'} {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>

                      {/* Status / Metodo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(item.status)}`}>
                            {item.status}
                          </span>
                          {item.metodo_pagamento && (
                            <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold font-mono uppercase">{item.metodo_pagamento}</span>
                          )}
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-4 text-center">
                        {item.status !== 'Pago' ? (
                          <div className="flex justify-center gap-1.5 items-center">
                            <button
                              onClick={() => {
                                if (item.metodo_pagamento === 'Pix' || isEntrada) {
                                  setActivePixSimulationItem(item);
                                } else {
                                  setActiveCardSimulationItem(item);
                                }
                              }}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-xs cursor-pointer inline-flex items-center gap-0.5"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Liquidar
                            </button>
                            
                            {isEntrada && (
                              <button
                                onClick={() => setActivePixSimulationItem(item)}
                                className="p-1 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-lg cursor-pointer"
                                title="Mostrar Código PIX"
                              >
                                <QrCode className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-semibold inline-flex items-center gap-0.5" title="Pago">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Pago em {item.data_pagamento?.split('-').reverse().join('/') || '---'}
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* MODAL 5: REGISTRAR LANÇAMENTO FINANCEIRO */}
      {isOpenTransactionModal && (
        <div id="modal-finance" className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsOpenTransactionModal(false)}></div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-150 max-w-md w-full z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold tracking-tight">Efetuar Lançamento no Fluxo</h3>
              </div>
              <button 
                onClick={() => setIsOpenTransactionModal(false)}
                className="hover:bg-slate-800 p-1.5 rounded-lg text-white/95 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTransaction} className="p-5 space-y-4 text-xs font-sans">
              
              {/* Seletor Tipo */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">Tipo de Movimentação</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setModalType('entrada'); setModalCat('Tratamento'); }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      modalType === 'entrada'
                        ? 'bg-teal-50 border-teal-500 text-teal-800'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Entrada (Procedimento/Receita)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setModalType('saida'); setModalCat('Insumos Clínicos'); }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      modalType === 'saida'
                        ? 'bg-rose-50 border-rose-500 text-rose-800'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Saída (Despesa/Investimento)
                  </button>
                </div>
              </div>

              {/* Descricao */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1 uppercase">Descrição do Lançamento *</label>
                <input
                  type="text"
                  required
                  value={modalDesc}
                  onChange={(e) => setModalDesc(e.target.value)}
                  placeholder="Ex: Parcela 1 canal Ana Julia ou Provisão de Luvas Látex"
                  className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              {/* Valor / Parcelas */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-gray-500 block mb-1">Valor Total (BRL) *</label>
                  <input
                    type="number"
                    required
                    value={modalVal}
                    onChange={(e) => setModalVal(parseFloat(e.target.value))}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1">Parcelas (Rec.)</label>
                  <input
                    type="number"
                    disabled={modalType === 'saida'}
                    value={modalParcelas}
                    onChange={(e) => setModalParcelas(parseInt(e.target.value) || 1)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Paciente opcional */}
              {modalType === 'entrada' && (
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1">Vincular Paciente (Opcional)</label>
                  <select
                    value={modalPacienteId}
                    onChange={(e) => setModalPacienteId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-350 rounded-lg"
                  >
                    <option value="">Não vincular (Custo Avulso)</option>
                    {pacientes.map(pac => (
                      <option key={pac.id} value={pac.id}>{pac.nome}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Data, Categoria, Meio */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1">Vencimento *</label>
                  <input
                    type="date"
                    required
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1">Categoria</label>
                  <select
                    value={modalCat}
                    onChange={(e) => setModalCat(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                  >
                    {modalType === 'entrada' ? (
                      <>
                        <option value="Tratamento">Tratamento</option>
                        <option value="Manutenção">Manutenção</option>
                        <option value="Prevenção">Prevenção</option>
                        <option value="Implantodontia">Implantodontia</option>
                      </>
                    ) : (
                      <>
                        <option value="Insumos Clínicos">Insumos Clínicos</option>
                        <option value="Laboratório">Laboratório</option>
                        <option value="Custos Fixos">Custos Fixos</option>
                        <option value="Marketing">Marketing</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Meio de pagamento e status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1 font-sans">Meio de Liquidação</label>
                  <select
                    value={modalMethod}
                    onChange={(e) => setModalMethod(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                  >
                    <option value="Pix">Pix Instantâneo</option>
                    <option value="Cartao de Credito">Cartão de Crédito</option>
                    <option value="Boleto">Boleto</option>
                    <option value="Dinheiro">Dinheiro Espécie</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-1 font-sans">Status Provisório</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago/Liquidado</option>
                    <option value="Atrasado">Atrasado em Cobrança</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpenTransactionModal(false)}
                  className="px-4.5 py-2.5 border border-gray-205 text-xs font-semibold text-gray-500 hover:bg-gray-50 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  Consolidar Lançamento
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL SIMULADOR 6: GERADOR PIX QR CODE INTERATIVO */}
      {activePixSimulationItem && (
        <div id="modal-pix" className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setActivePixSimulationItem(null)}></div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-150 max-w-sm w-full z-15 overflow-hidden">
            <div className="bg-emerald-700 text-white p-4.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-300" />
                <span className="font-bold text-xs">Terminal de Recebimento PIX</span>
              </div>
              <button onClick={() => setActivePixSimulationItem(null)} className="text-white hover:opacity-80 font-bold">X</button>
            </div>

            <div className="p-5 flex flex-col items-center justify-center space-y-4 text-center">
              
              <span className="text-[10px] bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-bold uppercase">
                Aguardando Pagamento do Paciente
              </span>

              <div className="bg-slate-100 p-4.5 rounded-xl border-2 border-dashed border-emerald-500 w-44 h-44 flex items-center justify-center relative">
                {/* Simulated dynamic QR code */}
                <div className="grid grid-cols-4 gap-1 w-32 h-32 opacity-85">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded ${
                        (i * 7 + 13) % 2 === 0 ? 'bg-emerald-800' : (i * 3 + 22) % 5 === 0 ? 'bg-teal-500' : 'bg-transparent'
                      }`}
                    ></div>
                  ))}
                </div>
                
                {/* Centered logo */}
                <div className="absolute bg-white p-1 rounded-md border text-[10px] font-bold text-emerald-700">
                  PIX
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-gray-900 text-sm">
                  {activePixSimulationItem.descricao}
                </p>
                <p className="text-xl font-black text-emerald-800 font-mono">
                  {activePixSimulationItem.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-150 p-3 rounded-lg w-full text-left">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Chave PIX Copia e Cola</span>
                <p className="text-[10px] text-gray-600 font-mono select-all truncate mt-0.5">
                  00020126580014BR.GOV.BCB.PIX0136odontosaaskey20260605prodBRL
                </p>
              </div>

              <div className="flex gap-2 w-full text-xs">
                <button
                  type="button"
                  onClick={() => setActivePixSimulationItem(null)}
                  className="flex-1 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-500 font-bold transition-all cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmSettlePayment(activePixSimulationItem, 'Pix')}
                  className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition-transform active:scale-95 inline-flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  Simular Confirmação PIX
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL SIMULADOR 7: CARTÃO DE CRÉDITO DE CONSULTÓRIO */}
      {activeCardSimulationItem && (
        <div id="modal-card" className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setActiveCardSimulationItem(null)}></div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-150 max-w-sm w-full z-15 overflow-hidden">
            <div className="bg-gray-900 text-white p-4.5 flex items-center justify-between">
              <span className="font-bold text-xs text-teal-400">Terminal Maquininha - Crédito/Débito</span>
              <button onClick={() => setActiveCardSimulationItem(null)} className="text-white hover:opacity-85 font-bold">X</button>
            </div>

            <div className="p-5 flex flex-col items-center justify-center space-y-4 text-center text-xs">
              
              <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-teal-400 p-5 rounded-2xl w-full text-left space-y-8 shadow-md">
                <div className="flex items-center justify-between">
                  <CreditCard className="w-8 h-8 opacity-80" />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-white">Odonto Sênior</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-mono">•••• •••• •••• 4545</span>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">Maquininha Integrada</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-gray-500">Valor a liquidar:</p>
                <p className="text-2xl font-black text-gray-900 font-mono">
                  {activeCardSimulationItem.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>

              <div className="flex gap-2 w-full">
                <button
                  onClick={() => handleConfirmSettlePayment(activeCardSimulationItem, 'Cartao de Credito')}
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Confirmar Passagem de Cartão
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
