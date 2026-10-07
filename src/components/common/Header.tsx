import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Gift,
  Bell,
  Sun,
  Moon,
  Plus,
  Database,
  Check,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { formatDateBR } from '../../utils/dateUtils';

interface HeaderProps {
  onOpenNewPerson: () => void;
  onOpenBackup: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewPerson, onOpenBackup }) => {
  const {
    settings,
    updateSettings,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    requestWebNotificationPermission,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo & Marca */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                Lembra<span className="text-rose-500">Niver</span>
              </span>
              <span className="text-[10px] uppercase font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 px-1.5 py-0.5 rounded">
                Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Presentes & Datas Especiais
            </p>
          </div>
        </div>

        {/* Ações do Topo */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Botão Novo Cadastro (Destaque) */}
          <button
            onClick={onOpenNewPerson}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-medium rounded-xl shadow-sm transition-all"
            title="Cadastrar nova pessoa"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Pessoa</span>
            <span className="sm:hidden">Novo</span>
          </button>

          {/* Botão Notificações */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Dropdown de Notificações */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95">
                <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      Central de Lembretes
                    </span>
                    {unreadNotificationCount > 0 && (
                      <span className="text-xs bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded-full font-medium">
                        {unreadNotificationCount} novos
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Marcar lidos
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      <Sparkles className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                      Nenhum alerta pendente no momento!
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 ${
                          !n.isRead ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                        }`}
                      >
                        <div className="mt-0.5 text-base shrink-0">
                          {n.type === 'birthday-today' && '🎂'}
                          {n.type === 'birthday-3days' && '🎁'}
                          {n.type === 'birthday-15days' && '📅'}
                          {n.type === 'monthly-summary' && '🎈'}
                          {n.type === 'custom-reminder' && '⏰'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {n.description}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDateBR(n.date, false)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer do Dropdown com ativação de notificações nativas */}
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={requestWebNotificationPermission}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-medium flex items-center gap-1.5"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    Ativar no navegador
                  </button>
                  <button
                    onClick={onOpenBackup}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    Configurações
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Botão Backup */}
          <button
            onClick={onOpenBackup}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Backup e Restauração"
            aria-label="Backup"
          >
            <Database className="w-5 h-5" />
          </button>

          {/* Toggle Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Alternar tema escuro/claro"
            title={settings.darkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {settings.darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
