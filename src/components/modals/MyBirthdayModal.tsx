import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DatePicker } from '../common/DatePicker';
import { X, UserCheck, Cake, Sparkles, Save, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MyBirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyBirthdayModal: React.FC<MyBirthdayModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, showToast } = useApp();
  const [userName, setUserName] = useState('');
  const [userBirthdate, setUserBirthdate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUserName(settings.userName || '');
      setUserBirthdate(settings.userBirthdate || '');
      setError('');
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userBirthdate) {
      setError('Por favor, selecione sua data de nascimento.');
      return;
    }

    updateSettings({
      userName: userName.trim() || undefined,
      userBirthdate,
    });

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignora fallback
    }

    showToast(
      'Meu Aniversário Salvo!',
      'O LembraNiver agora também celebrará o seu dia especial!',
      'success'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
                Meu Aniversário <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cadastre sua data para receber homenagens e contagem regressiva
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Seu Nome ou Como Quer Ser Chamado(a)
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Ex: Rafael"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all"
            />
          </div>

          <div>
            <DatePicker
              label="Data de Nascimento"
              value={userBirthdate}
              onChange={(val) => {
                setUserBirthdate(val);
                setError('');
              }}
              required
              error={error}
              helperText="Usada para a contagem do seu próximo aniversário e avisos no dia."
            />
          </div>

          <div className="p-3 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900/50 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <Heart className="w-4 h-4 shrink-0 text-rose-500 fill-rose-500" />
            <span>
              Você merece celebrar! Seu aniversário aparecerá com destaque especial na tela inicial.
            </span>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Salvar Meu Aniversário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
