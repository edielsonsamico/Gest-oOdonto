/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Database, 
  FolderTree, 
  Clipboard, 
  Check, 
  Code, 
  ShieldAlert, 
  FileCode, 
  Activity, 
  HelpCircle 
} from 'lucide-react';
import { ESTRUTURA_DE_PASTAS_DOC, ESQUEMA_BANCO_DE_DADOS_DOC } from '../data/mockData';

export default function DatabaseSchemaView() {
  const [copiedFolder, setCopiedFolder] = useState(false);
  const [copiedSQL, setCopiedSQL] = useState(false);

  const handleCopyFolder = () => {
    navigator.clipboard.writeText(ESTRUTURA_DE_PASTAS_DOC);
    setCopiedFolder(true);
    setTimeout(() => setCopiedFolder(false), 2000);
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(ESQUEMA_BANCO_DE_DADOS_DOC);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  return (
    <div id="database-schema-interactive" className="space-y-6">
      
      {/* Cabçalho técnico */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 p-6 rounded-2xl shadow">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 rounded-xl text-sky-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Arquitetura de Software & Banco de Dados Relacional</h1>
            <p className="text-xs text-slate-400 mt-1">
              Documentação completa e scripts SQL recomendados para implantação da infraestrutura do OdontoSaaS.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Lado Esquerdo: Árvore de Diretórios (UX) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <h2 className="text-sm font-bold text-gray-900 inline-flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-teal-650 text-teal-600" />
              1. Estrutura de Pastas do SaaS
            </h2>
            <button
              onClick={handleCopyFolder}
              className="p-1 px-2.2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer transition-all"
            >
              {copiedFolder ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clipboard className="w-3.5 h-3.5" />}
              {copiedFolder ? 'Copiado!' : 'Copiar'}
            </button>
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed">
            Organização modular recomendada para o ecossistema completo de front-end React com Vite e roteamentos segregados:
          </p>

          <pre className="text-[11.5px] font-mono text-slate-800 bg-slate-50 p-4 border border-gray-205 rounded-xl whitespace-pre overflow-x-auto select-all max-h-[420px]">
            {ESTRUTURA_DE_PASTAS_DOC}
          </pre>
        </div>

        {/* Lado Direito: Esquema Relacional PostgreSQL */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <h2 className="text-sm font-bold text-gray-900 inline-flex items-center gap-1.5">
              <Code className="w-4 h-4 text-blue-600" />
              2. Esquema Relacional DDL (PostgreSQL)
            </h2>
            <button
              onClick={handleCopySQL}
              className="p-1 px-2.5 bg-gray-150 hover:bg-gray-200 text-gray-800 text-[11px] font-bold rounded-lg inline-flex items-center gap-1 cursor-pointer transition-all border border-gray-200"
            >
              {copiedSQL ? <Check className="w-4 h-4 text-emerald-600" /> : <Clipboard className="w-4 h-4" />}
              {copiedSQL ? 'Copiado!' : 'Copiar Script SQL'}
            </button>
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed">
            Script relacional robusto com UUID nativo como chave primária, integridade referencial com restrições de ON DELETE, indexações de performance para filtragens de horários/profissionais e armações JSONB do prontuário:
          </p>

          <pre className="text-[11px] font-mono text-slate-100 bg-slate-950 p-5 rounded-xl whitespace-pre overflow-x-auto select-all max-h-[420px] border border-slate-850 shadow-inner">
            {ESQUEMA_BANCO_DE_DADOS_DOC}
          </pre>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2 text-xs text-blue-800">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Dica de Produção</span>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                O campo de data/hora utiliza o tipo <code>TIMESTAMP WITH TIME ZONE</code> para salvaguardar fusos horários de clínicas distribuídas geograficamente. Os odontogramas utilizam <code>JSONB</code> para permitir diagnóstico dinâmico extensível sem forçar novas migrações na tabela.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
