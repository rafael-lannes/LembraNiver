import React, { useState, useEffect } from 'react';
import { GiftItem, Person } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, Calendar, DollarSign, MessageCircleHeart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DatePicker } from '../common/DatePicker';

interface MarkDeliveredModalProps {
  gift: GiftItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_OCCASIONS = [
  'Aniversário',
  'Natal',
  'Dia das Mães',
  'Dia dos Pais',
  'Dia dos Namorados',
  'Dia das Crianças',
  'Formatura',
  'Casamento / Bodas',
  'Amigo Secreto',
  'Outro',
];

export const MarkDeliveredModal: React.FC<MarkDeliveredModalProps> = ({
  gift,
  isOpen,
  onClose,
}) => {
  const { persons, markGiftAsDelivered } = useApp();

  const [occasion, setOccasion] = useState('Aniversário');
  const [customOccasion, setCustomOccasion] = useState('');
  const [deliveredDate, setDeliveredDate] = useState('');
  const [pricePaid, setPricePaid] = useState<string>('');
  const [reactionNotes, setReactionNotes] = useState('');

  useEffect(() => {
    if (isOpen && gift) {
      const todayIso = new Date().toISOString().split('T')[0];
      setDeliveredDate(todayIso);
      setOccasion('Aniversário');
      setCustomOccasion('');
      setPricePaid(
        gift.actualPrice
          ? String(gift.actualPrice)
          : gift.estimatedPrice
          ? String(gift.estimatedPrice)
          : ''
      );
      setReactionNotes('');
    }
  }, [isOpen, gift]);

  if (!isOpen || !gift) return null;

  const recipient: Person | undefined = persons.find((p) => p.id === gift.personId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalOccasion = occasion === 'Outro' && customOccasion.trim() ? customOccasion.trim() : occasion;
    const finalPrice = pricePaid ? parseFloat(pricePaid.replace(',', '.')) : undefined;

    markGiftAsDelivered(gift.id, {
      occasion: finalOccasion,
      deliveredDate: deliveredDate || new Date().toISOString().split('T')[0],
      pricePaid: isNaN(finalPrice as number) ? undefined : finalPrice,
      reactionNotes: reactionNotes.trim() || undefined,
    });

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                Marcar como Entregue
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Arquivar "{gift.title}" no histórico de presentes dados
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
          {/* Card Resumo */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Presente</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {gift.title}
              </span>
            </div>
            {recipient && (
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Presenteado(a)</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  {recipient.name} ({recipient.relationship})
                </span>
              </div>
            )}
          </div>

          {/* Ocasião / Evento */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Ocasião / Evento Comemorativo *
            </label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 transition-all"
            >
              {COMMON_OCCASIONS.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>

          {occasion === 'Outro' && (
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Especifique a ocasião
              </label>
              <input
                type="text"
                value={customOccasion}
                onChange={(e) => setCustomOccasion(e.target.value)}
                placeholder="Ex: Conquista de novo emprego"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          )}

          {/* Data de Entrega */}
          <div>
            <DatePicker
              label="Data da Entrega"
              value={deliveredDate}
              onChange={setDeliveredDate}
              required
              minYear={2015}
              maxYear={new Date().getFullYear() + 1}
            />
          </div>

          {/* Valor Final Pago */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Valor Final Pago (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={pricePaid}
              onChange={(e) => setPricePaid(e.target.value)}
              placeholder="Ex: 149,90"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Notas de Reação */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Notas sobre a Reação / Feedback
            </label>
            <textarea
              rows={3}
              value={reactionNotes}
              onChange={(e) => setReactionNotes(e.target.value)}
              placeholder="Ex: Ficou muito emocionado(a)! Gostou muito da cor e começou a usar no mesmo dia."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 transition-all leading-relaxed"
            />
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              Confirmar Entrega
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
