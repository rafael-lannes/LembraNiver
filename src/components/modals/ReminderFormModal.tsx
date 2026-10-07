import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomReminder } from '../../types';
import { X, BellRing, Save } from 'lucide-react';

interface ReminderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminderToEdit?: CustomReminder | null;
  defaultPersonId?: string;
}

export const ReminderFormModal: React.FC<ReminderFormModalProps> = ({
  isOpen,
  onClose,
  reminderToEdit,
  defaultPersonId,
}) => {
  const { persons, addReminder } = useApp();

  const [title, setTitle] = useState('');
  const [personId, setPersonId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (reminderToEdit) {
      setTitle(reminderToEdit.title);
      setPersonId(reminderToEdit.personId || '');
      setDateTime(reminderToEdit.dateTime);
      setNotes(reminderToEdit.notes || '');
    } else {
      setTitle('');
      setPersonId(defaultPersonId || '');
      // Data padrão: amanhã às 09:00
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      const iso = tomorrow.toISOString().slice(0, 16);
      setDateTime(iso);
      setNotes('');
    }
    setErrors({});
  }, [isOpen, reminderToEdit, defaultPersonId]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!title.trim()) {
      errs.title = 'O título do lembrete é obrigatório.';
    }
    if (!dateTime) {
      errs.dateTime = 'Defina a data e horário do lembrete.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addReminder({
      title: title.trim(),
      personId: personId || undefined,
      dateTime,
      notes: notes.trim() || undefined,
      isCompleted: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Novo Lembrete Personalizado
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Agende avisos para não perder datas importantes
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              O que você precisa lembrar? *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Comprar embalagem de presente e laço"
              className={`w-full px-3.5 py-2 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-all ${
                errors.title
                  ? 'border-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-amber-500'
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Vincular a uma pessoa (opcional)
            </label>
            <select
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-amber-500 transition-all"
            >
              <option value="">Nenhuma pessoa específica</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.relationship})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Data e Horário *
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-amber-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Notas adicionais
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Pegar na loja do centro antes das 18h."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-amber-500 transition-all leading-relaxed"
            />
          </div>

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
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Salvar Lembrete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
