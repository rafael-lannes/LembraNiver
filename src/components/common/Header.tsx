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
  Cake,
  BellRing,
} from 'lucide-react';
import { formatDateBR } from '../../utils/dateUtils';

interface HeaderProps {
  onOpenNewPerson: () => void;
  onOpenBackup: () => void;
  onOpenAbout?: () => void;
  onOpenMyBirthday?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewPerson,
  onOpenBackup,
  onOpenAbout,
  onOpenMyBirthday,
}) => {
  const {
    settings,
    updateSettings,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    requestWebNotificationPermission,
    testNotification,
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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors safe-top w-full shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-16 sm:h-18 flex items-center justify-between gap-2">
        {/* Logo & Marca (Ao clicar, abre o modal "Sobre o App") */}
        <button
          onClick={onOpenAbout}
          type="button"
          className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink text-left group hover:opacity-90 active:scale-98 transition-all"
          title="Sobre o LembraNiver (versão, desenvolvedor e GitHub)"
          aria-label="Sobre o LembraNiver"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 shrink-0 group-hover:scale-105 transition-transform">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight truncate block group-hover:text-rose-500 transition-colors">
              Lembra<span className="text-rose-500">Niver</span>
            </span>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden md:block truncate">
              Presentes & Datas Especiais • v0.1
            </p>
          </div>
        </button>

        {/* Ações do Topo */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Botão "Meu Aniversário" */}
          <button
            onClick={onOpenMyBirthday}
            className="p-1.5 sm:px-3 sm:py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-xl transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
            title="Cadastrar Meu Aniversário"
            aria-label="Cadastrar Meu Aniversário"
          >
            <Cake className="w-4 h-4" />
            <span className="hidden md:inline text-xs font-semibold">Meu Niver</span>
          </button>

          {/* Botão Novo Cadastro */}
          <button
            onClick={onOpenNewPerson}
            className="p-1.5 sm:px-3 sm:py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0"
            title="Cadastrar nova pessoa"
            aria-label="Cadastrar nova pessoa"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-semibold">Nova Pessoa</span>
          </button>

          {/* Botão Notificações */}
          <div className="relative shrink-0" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
              aria-label="Notificações"
              title="Notificações"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-rose-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Dropdown de Notificações com posicionamento z-[999] e Testar Notificação */}
            {showNotifications && (
              <div className="fixed sm:absolute right-2 sm:right-0 top-18 sm:top-full mt-1 w-[calc(100vw-16px)] sm:w-80 md:w-96 max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[999] animate-in fade-in zoom-in-95">
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Central de Lembretes
                    </span>
                    {unreadNotificationCount > 0 && (
                      <span className="text-[10px] sm:text-xs bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300 px-1.5 py-0.5 rounded-full font-medium">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
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
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      <Sparkles className="w-5 h-5 mx-auto mb-1.5 text-slate-400" />
                      Nenhum alerta pendente no momento!
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-2.5 ${
                          !n.isRead ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                        }`}
                      >
                        <div className="text-sm shrink-0 mt-0.5">
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

                {/* Ações da Central: Testar Notificação e Configurações */}
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      testNotification();
                    }}
                    className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                    title="Enviar notificação de teste agora"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    Testar Notificação
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={requestWebNotificationPermission}
                      className="text-[11px] text-slate-600 dark:text-slate-400 hover:text-rose-600 transition-colors font-medium"
                    >
                      Permissão
                    </button>
                    <button
                      onClick={onOpenBackup}
                      className="text-[11px] text-slate-600 dark:text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      Ajustes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botão Backup */}
          <button
            onClick={onOpenBackup}
            className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            title="Backup e Restauração"
            aria-label="Backup"
          >
            <Database className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Toggle Dark Mode (100% visível em qualquer largura) */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            aria-label="Alternar tema claro/escuro"
            title={settings.darkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {settings.darkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
