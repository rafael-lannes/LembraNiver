import React, { useState, useEffect, useMemo } from 'react';
import { GiftItem, GiftPriority, GiftStatus, Person } from '../../types';
import { useApp } from '../../context/AppContext';
import { checkRepeatGift } from '../../utils/giftUtils';
import { X, Gift, ExternalLink, AlertTriangle, Sparkles } from 'lucide-react';

interface GiftFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftToEdit?: GiftItem | null;
  defaultPersonId?: string;
}

export const GiftFormModal: React.FC<GiftFormModalProps> = ({
  isOpen,
  onClose,
  giftToEdit,
  defaultPersonId,
}) => {
  const { persons, history, addGift, updateGift } = useApp();

  const [personId, setPersonId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<string>('');
  const [actualPrice, setActualPrice] = useState<string>('');
  const [priority, setPriority] = useState<GiftPriority>('media');
  const [status, setStatus] = useState<GiftStatus>('ideia');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (giftToEdit) {
      setPersonId(giftToEdit.personId);
      setTitle(giftToEdit.title);
      setDescription(giftToEdit.description || '');
      setUrl(giftToEdit.url || '');
      setEstimatedPrice(giftToEdit.estimatedPrice ? String(giftToEdit.estimatedPrice) : '');
      setActualPrice(giftToEdit.actualPrice ? String(giftToEdit.actualPrice) : '');
      setPriority(giftToEdit.priority);
      setStatus(giftToEdit.status);
    } else {
      setPersonId(defaultPersonId || (persons.length > 0 ? persons[0].id : ''));
      setTitle('');
      setDescription('');
      setUrl('');
      setEstimatedPrice('');
      setActualPrice('');
      setPriority('media');
      setStatus('ideia');
    }
    setErrors({});
  }, [isOpen, giftToEdit, defaultPersonId, persons]);

  // Alerta inteligente de repetição de presentes
  const repeatCheck = useMemo(() => {
    if (!personId || !title.trim()) return { hasConflict: false };
    return checkRepeatGift(title, personId, history);
  }, [title, personId, history]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!personId) {
      errs.personId = 'Selecione a pessoa presenteada.';
    }
    if (!title.trim()) {
      errs.title = 'O título do presente é obrigatório.';
    }
    if (url && !/^https?:\/\//i.test(url)) {
      errs.url = 'Insira um link válido com http:// ou https://';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const est = estimatedPrice ? parseFloat(estimatedPrice.replace(',', '.')) : undefined;
    const act = actualPrice ? parseFloat(actualPrice.replace(',', '.')) : undefined;

    if (giftToEdit) {
      updateGift(giftToEdit.id, {
        personId,
        title: title.trim(),
        description: description.trim() || undefined,
        url: url.trim() || undefined,
        estimatedPrice: isNaN(est as number) ? undefined : est,
        actualPrice: isNaN(act as number) ? undefined : act,
        priority,
        status,
      });
    } else {
      addGift({
        personId,
        title: title.trim(),
        description: description.trim() || undefined,
        url: url.trim() || undefined,
        estimatedPrice: isNaN(est as number) ? undefined : est,
        actualPrice: isNaN(act as number) ? undefined : act,
        priority,
        status,
      });
    }
    onClose();
  };

  const handleOpenUrl = () => {
    if (url) {
      const targetUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {giftToEdit ? 'Editar Presente' : 'Nova Ideia de Presente'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cadastre na Wishlist ou marque como comprado
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Pessoa Presenteada */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Para quem é o presente? *
            </label>
            <select
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-all ${
                errors.personId
                  ? 'border-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-rose-500'
              }`}
            >
              <option value="">Selecione uma pessoa...</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.nickname ? `(${p.nickname})` : ''} - {p.relationship}
                </option>
              ))}
            </select>
            {errors.personId && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.personId}</p>
            )}
          </div>

          {/* Título do Presente */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Nome / Título do Presente *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Fone de Ouvido Bluetooth JBL"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-all ${
                errors.title
                  ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-rose-500'
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* ALERTA INTELIGENTE DE REPETIÇÃO */}
          {repeatCheck.hasConflict && (
            <div className="p-3.5 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 flex items-start gap-2.5 text-xs animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{repeatCheck.warningMessage}</p>
                <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-300">
                  Dica: Verifique se a pessoa precisa de outro item ou prefere algo diferente desta vez.
                </p>
              </div>
            </div>
          )}

          {/* Descrição / Detalhes */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Detalhes / Modelo / Cor / Tamanho
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Cor preta, modelo com cancelamento de ruído, tamanho M."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all leading-relaxed"
            />
          </div>

          {/* Link da Loja / Produto */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Link da Loja / Produto (URL)
              </label>
              {url && (
                <button
                  type="button"
                  onClick={handleOpenUrl}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Abrir no navegador
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://amazon.com.br/item-exemplo"
                className={`w-full px-3.5 py-2 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-all ${
                  errors.url
                    ? 'border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-rose-500'
                }`}
              />
            </div>
            {errors.url && <p className="text-[11px] text-rose-500 mt-1">{errors.url}</p>}
          </div>

          {/* Preços */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Preço Estimado (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                placeholder="150,00"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Preço Real / Pago (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={actualPrice}
                onChange={(e) => setActualPrice(e.target.value)}
                placeholder="139,90"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all"
              />
            </div>
          </div>

          {/* Prioridade & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as GiftPriority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Status da Compra
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GiftStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all"
              >
                <option value="ideia">Ideia (Na Wishlist)</option>
                <option value="comprado">Comprado (Aguardando entrega)</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
            >
              {giftToEdit ? 'Salvar Alterações' : 'Salvar Presente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
