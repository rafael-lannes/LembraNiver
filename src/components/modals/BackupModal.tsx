import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  generateBackupPayload,
  downloadBackupFile,
  shareBackupFile,
  validateBackupJson,
  BackupValidationResult,
} from '../../services/backupService';
import {
  X,
  Database,
  Download,
  Share2,
  Upload,
  AlertTriangle,
  CheckCircle,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { formatDateBR } from '../../utils/dateUtils';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const {
    persons,
    gifts,
    history,
    templates,
    reminders,
    settings,
    restoreData,
    resetToSampleData,
    showToast,
  } = useApp();

  const [importResult, setImportResult] = useState<BackupValidationResult | null>(null);
  const [restoreMode, setRestoreMode] = useState<'replace' | 'merge'>('merge');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportDownload = () => {
    const payload = generateBackupPayload({
      persons,
      gifts,
      history,
      templates,
      reminders,
      settings,
    });
    const filename = downloadBackupFile(payload);
    showToast('Backup exportado!', `Arquivo ${filename} baixado com sucesso.`, 'success');
  };

  const handleExportShare = async () => {
    const payload = generateBackupPayload({
      persons,
      gifts,
      history,
      templates,
      reminders,
      settings,
    });
    const shared = await shareBackupFile(payload);
    if (shared) {
      showToast('Compartilhando...', 'Janela do sistema aberta.', 'info');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const result = validateBackupJson(text);
        setImportResult(result);
        if (!result.valid) {
          showToast('Arquivo inválido', result.errorMessage || 'Falha ao validar JSON', 'error');
        } else {
          showToast('Backup validado!', 'Verifique o resumo antes de aplicar.', 'success');
        }
      } catch {
        showToast('Erro ao ler arquivo', 'Não foi possível processar o documento.', 'error');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmRestore = () => {
    if (!importResult || !importResult.payload) return;
    restoreData(importResult.payload, restoreMode);
    setImportResult(null);
    onClose();
  };

  const handleResetSample = () => {
    if (confirm('Deseja recarregar os dados de demonstração originais do LembraNiver?')) {
      resetToSampleData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                Backup & Restauração
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seus dados com segurança máxima e portabilidade total
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {/* Seção 1: Exportação */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Exportar Dados (Backup)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Consolida {persons.length} pessoas, {gifts.length} presentes ativos e{' '}
                  {history.length} históricos.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleExportDownload}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                Baixar Arquivo JSON
              </button>

              <button
                type="button"
                onClick={handleExportShare}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar / Salvar em Nuvem
              </button>
            </div>
          </div>

          {/* Seção 2: Importação & Restauração */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Restaurar Backup (Importar)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Selecione um arquivo de backup (.json) gerado anteriormente pelo LembraNiver.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-indigo-400/50 hover:border-indigo-500 dark:border-indigo-600/40 bg-white dark:bg-slate-800/80 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-all w-full justify-center"
            >
              <Upload className="w-4 h-4" />
              {isProcessing ? 'Validando estrutura...' : 'Selecionar arquivo de backup .json'}
            </button>

            {/* Painel de Confirmação e Validação do Arquivo Carregado */}
            {importResult && (
              <div className="mt-3 p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all animate-in fade-in">
                {importResult.valid && importResult.summary ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>Arquivo válido! Versão do schema: v{importResult.summary.version}</span>
                    </div>

                    {/* Resumo das entidades */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Pessoas</span>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                          {importResult.summary.personsCount}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Presentes Wishlist</span>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                          {importResult.summary.giftsCount}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Histórico de Entregas</span>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                          {importResult.summary.historyCount}
                        </span>
                      </div>
                    </div>

                    {/* Escolha do modo de restauração */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Modo de Restauração:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <label
                          className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                            restoreMode === 'merge'
                              ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name="restoreMode"
                            checked={restoreMode === 'merge'}
                            onChange={() => setRestoreMode('merge')}
                            className="mt-0.5"
                          />
                          <div>
                            <span className="font-bold block">Mesclagem (Merge)</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              Adiciona novos registros sem sobrescrever dados atuais.
                            </span>
                          </div>
                        </label>

                        <label
                          className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                            restoreMode === 'replace'
                              ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name="restoreMode"
                            checked={restoreMode === 'replace'}
                            onChange={() => setRestoreMode('replace')}
                            className="mt-0.5"
                          />
                          <div>
                            <span className="font-bold block text-rose-600 dark:text-rose-400">
                              Substituição Total
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              Limpa o banco local e restaura o estado idêntico do arquivo.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmRestore}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirmar e Aplicar Restauração
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                    <div>
                      <p className="font-bold">Validação falhou!</p>
                      <p className="text-[11px] mt-0.5">{importResult.errorMessage}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Seção 3: Dados de Demonstração */}
          <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Resetar para Demonstração
              </span>
              <span className="text-[11px] text-slate-400">
                Recarrega contatos e presentes fictícios para testes.
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetSample}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Resetar
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
