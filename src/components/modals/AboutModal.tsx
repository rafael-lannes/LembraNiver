import React from 'react';
import { X, Gift, Heart, ShieldCheck, Sparkles, Code2, Smartphone, GitBranch } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <img
              src="/app-icon.png"
              alt="Ícone LembraNiver"
              className="w-10 h-10 rounded-2xl shadow-md shadow-indigo-950/20 object-cover ring-1 ring-slate-200 dark:ring-slate-800"
            />
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Sobre o Lembra<span className="text-rose-500">Niver</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium italic">
                "Mais presença na vida de quem você ama."
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

        {/* Body */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          {/* Versão e Status */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">Versão Atual</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold font-mono text-xs">
              v0.1
            </span>
          </div>

          {/* Desenvolvedor */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
              <Code2 className="w-4 h-4 text-indigo-500" />
              <span>Criado por Rafael Lannes</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
              Criado para que você nunca mais esqueça de parabenizar quem ama, com controle total de presentes, histórico de compras e integração direta com mensageiros.
            </p>
            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mobile-First • Offline-First • Privacidade Total</span>
            </div>
          </div>

          {/* Link para GitHub */}
          <a
            href="https://rafael-lannes.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-900 group transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-rose-500 transition-colors">
                  Página do GitHub
                </p>
                <p className="text-[11px] text-slate-400">rafael-lannes.github.io</p>
              </div>
            </div>
            <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform text-xs font-semibold">
              ↗
            </span>
          </a>

          {/* Rodapé / Direitos */}
          <div className="text-center pt-2 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
            <span>LembraNiver</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Feito com <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> para você
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
