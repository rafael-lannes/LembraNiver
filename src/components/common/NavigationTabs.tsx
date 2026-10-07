import React from 'react';
import { LayoutDashboard, Users, Gift, CalendarDays, MessageSquareHeart } from 'lucide-react';

export type TabType = 'dashboard' | 'persons' | 'gifts' | 'calendar' | 'reminders';

interface NavigationTabsProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  giftsBadgeCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  currentTab,
  onSelectTab,
  giftsBadgeCount = 0,
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Início',
      icon: LayoutDashboard,
    },
    {
      id: 'persons' as TabType,
      label: 'Pessoas',
      icon: Users,
    },
    {
      id: 'gifts' as TabType,
      label: 'Presentes',
      icon: Gift,
      badge: giftsBadgeCount > 0 ? giftsBadgeCount : undefined,
    },
    {
      id: 'calendar' as TabType,
      label: 'Calendário',
      icon: CalendarDays,
    },
    {
      id: 'reminders' as TabType,
      label: 'Mensagens',
      icon: MessageSquareHeart,
    },
  ];

  return (
    <>
      {/* Desktop / Tablet Navigation (Segmented pill bar below header) */}
      <div className="hidden md:block border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center">
          <nav className="inline-flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl shadow-inner gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white leading-none">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation (Floating dock on bottom of screen) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1 safe-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-rose-600 dark:text-rose-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 mb-0.5" />
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 text-[9px] font-bold px-1 py-0.2 rounded-full bg-rose-500 text-white leading-none">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px]">{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-0.5 bg-rose-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
