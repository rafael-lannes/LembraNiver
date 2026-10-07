import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Person, GiftItem } from '../../types';
import { getDaysUntilNextBirthday, formatDateBR } from '../../utils/dateUtils';
import { getUpcomingCommemorativeDates } from '../../utils/commemorativeDates';
import { Avatar } from '../common/Avatar';
import {
  Gift,
  Cake,
  Calendar,
  Send,
  Sparkles,
  Users,
  ChevronRight,
  HeartHandshake,
  Clock,
  Plus,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenSendMessage: (person: Person) => void;
  onOpenNewPerson: () => void;
  onOpenNewGift: (personId?: string) => void;
  onNavigateToPersons: () => void;
  onNavigateToGifts: () => void;
  onNavigateToCalendar: () => void;
  onOpenMyBirthday?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenSendMessage,
  onOpenNewPerson,
  onOpenNewGift,
  onNavigateToPersons,
  onNavigateToGifts,
  onNavigateToCalendar,
  onOpenMyBirthday,
}) => {
  const { persons, gifts, history, loadDemoData, settings } = useApp();

  // Meu Aniversário
  const myBirthdayCalc = useMemo(() => {
    if (!settings.userBirthdate) return null;
    return getDaysUntilNextBirthday(settings.userBirthdate);
  }, [settings.userBirthdate]);

  // 1. Aniversariantes de Hoje
  const todayBirthdays = useMemo(() => {
    return persons.filter((p) => {
      const calc = getDaysUntilNextBirthday(p.birthdate);
      return calc.isToday;
    });
  }, [persons]);

  // 2. Próximos Aniversários (próximos 60–90 dias)
  const upcomingBirthdays = useMemo(() => {
    return persons
      .map((person) => {
        const calc = getDaysUntilNextBirthday(person.birthdate);
        return {
          person,
          ...calc,
        };
      })
      .filter((item) => !item.isToday && item.daysUntil <= 90)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [persons]);

  // 3. Próxima Data Comemorativa em destaque
  const upcomingCommemoratives = useMemo(() => {
    return getUpcomingCommemorativeDates(persons, new Date(), 365);
  }, [persons]);

  const nextCommemorative = upcomingCommemoratives[0] || null;

  // Presentes ativos na Wishlist (ideias ou comprados)
  const activeGiftsCount = gifts.length;

  return (
    <div className="space-y-6 pb-20">
      {/* 0. ONBOARDING / ESTADO INICIAL NO PRIMEIRO USO */}
      {persons.length === 0 && (
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-50/80 via-white to-pink-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/20 border border-rose-200 dark:border-rose-900/60 shadow-sm text-center space-y-4 animate-in fade-in">
          <img
            src="/app-icon.png"
            alt="LembraNiver"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl shadow-xl shadow-indigo-950/20 mx-auto object-cover ring-2 ring-rose-200 dark:ring-rose-900/40"
          />
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Bem-vindo ao LembraNiver!
            </h3>
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              Mais presença na vida de quem você ama.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Você ainda não possui pessoas cadastradas. Comece adicionando amigos e familiares para acompanhar aniversários e gerenciar presentes, ou ative o modo demonstração para testar todas as funcionalidades.
            </p>
          </div>
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-sm mx-auto">
            <button
              onClick={onOpenNewPerson}
              className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Pessoa
            </button>
            <button
              onClick={loadDemoData}
              className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Modo Demonstração
            </button>
          </div>
        </section>
      )}

      {/* BANNER / CARD DE MEU ANIVERSÁRIO */}
      {myBirthdayCalc && (
        <section
          onClick={onOpenMyBirthday}
          className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
            myBirthdayCalc.isToday
              ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white shadow-lg shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 border-amber-200/80 dark:border-amber-900/50 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  myBirthdayCalc.isToday
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                }`}
              >
                <Cake className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      myBirthdayCalc.isToday
                        ? 'bg-white/25 text-white'
                        : 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    Meu Aniversário
                  </span>
                  {myBirthdayCalc.isToday && (
                    <span className="text-xs font-black animate-pulse">🎂 É HOJE!</span>
                  )}
                </div>
                <h4
                  className={`font-bold text-sm sm:text-base mt-0.5 truncate ${
                    myBirthdayCalc.isToday ? 'text-white' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {settings.userName ? `Parabéns, ${settings.userName}!` : 'Seu Dia Especial!'}
                </h4>
                <p
                  className={`text-xs ${
                    myBirthdayCalc.isToday
                      ? 'text-white/90'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {myBirthdayCalc.isToday
                    ? `Completando ${myBirthdayCalc.nextAge} anos! Que seu dia seja incrível! 🎉`
                    : `Faltam ${myBirthdayCalc.daysUntil} dias para os seus ${myBirthdayCalc.nextAge} anos (${formatDateBR(myBirthdayCalc.nextDate, false)})`}
                </p>
              </div>
            </div>

            <button
              type="button"
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                myBirthdayCalc.isToday
                  ? 'bg-white text-rose-600 hover:bg-white/90'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-amber-500 group-hover:text-white'
              }`}
            >
              Editar
            </button>
          </div>
        </section>
      )}

      {/* 1. BANNER DE ANIVERSARIANTES DE HOJE */}
      {todayBirthdays.length > 0 && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white p-5 sm:p-7 shadow-xl shadow-rose-500/15 animate-in fade-in slide-in-from-top-4">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Aniversariante(s) de Hoje!
            </div>

            <div className="space-y-4">
              {todayBirthdays.map((person) => {
                const calc = getDaysUntilNextBirthday(person.birthdate);
                const personGifts = gifts.filter((g) => g.personId === person.id);

                return (
                  <div
                    key={person.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
                  >
                    <div className="flex items-center gap-3.5">
                      <Avatar
                        name={person.name}
                        avatarUrl={person.avatar}
                        size="lg"
                        className="ring-4 ring-white/30"
                      />
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">
                          {person.name} {person.nickname ? `(${person.nickname})` : ''}
                        </h3>
                        <p className="text-white/80 text-xs sm:text-sm mt-0.5 flex items-center gap-2">
                          <span>Completando {calc.nextAge} anos hoje!</span>
                          <span className="inline-block w-1 h-1 rounded-full bg-white/60" />
                          <span>{person.relationship}</span>
                        </p>
                        {personGifts.length > 0 && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/90 font-medium">
                            <Gift className="w-3.5 h-3.5" />
                            <span>
                              {personGifts.length} presente(s) planejado(s) na Wishlist
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onOpenSendMessage(person)}
                        className="px-4 py-2.5 rounded-xl bg-white text-rose-600 hover:bg-white/90 text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Enviar Parabéns
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Decoração de fundo */}
          <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        </section>
      )}

      {/* 2. STATS & RESUMO RÁPIDO */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={onNavigateToPersons}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-400 dark:hover:border-rose-500 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">
            {persons.length}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Pessoas Salvas</span>
        </div>

        <div
          onClick={onNavigateToGifts}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-400 dark:hover:border-rose-500 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <Gift className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">
            {activeGiftsCount}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Wishlist & Compras</span>
        </div>

        <div
          onClick={onNavigateToGifts}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-400 dark:hover:border-rose-500 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">
            {history.length}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Presentes Entregues</span>
        </div>

        <div
          onClick={onNavigateToCalendar}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-400 dark:hover:border-rose-500 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">
            {upcomingBirthdays.length}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Próximos em 90d</span>
        </div>
      </section>

      {/* 3. CARD EM DESTAQUE: PRÓXIMA DATA COMEMORATIVA */}
      {nextCommemorative && (
        <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  <Calendar className="w-3 h-3" />
                  Próxima Data Comemorativa
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {formatDateBR(nextCommemorative.date, true)}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {nextCommemorative.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
                {nextCommemorative.description}
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-center">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Faltam</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {nextCommemorative.daysRemaining === 0
                    ? 'HOJE!'
                    : `${nextCommemorative.daysRemaining} dias`}
                </span>
              </div>
            </div>
          </div>

          {/* Pessoas vinculadas a esta data comemorativa */}
          {nextCommemorative.matchedPersons.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Pessoas vinculadas para presentear ({nextCommemorative.matchedPersons.length}):
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {nextCommemorative.matchedPersons.map((p) => (
                  <div
                    key={p.id}
                    className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <Avatar name={p.name} avatarUrl={p.avatar} size="sm" />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {p.nickname || p.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{p.relationship}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. SEÇÃO: PRÓXIMOS ANIVERSÁRIOS (60–90 DIAS) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cake className="w-5 h-5 text-rose-500" />
              Próximos Aniversários
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lista cronológica dos próximos aniversariantes nos próximos 90 dias
            </p>
          </div>
          <button
            onClick={onNavigateToPersons}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            Ver todos ({persons.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingBirthdays.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
            <Cake className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            Nenhum aniversário nos próximos 90 dias.
            <div className="mt-3">
              <button
                onClick={onOpenNewPerson}
                className="px-3.5 py-2 bg-rose-600 text-white rounded-xl font-medium inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Cadastrar Pessoa
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upcomingBirthdays.map(({ person, daysUntil, nextAge, nextDate }) => {
              const personGifts = gifts.filter((g) => g.personId === person.id);

              return (
                <div
                  key={person.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={person.name} avatarUrl={person.avatar} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {person.name}
                        </h4>
                        {person.nickname && (
                          <span className="text-xs text-slate-400 truncate">
                            ({person.nickname})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{person.relationship}</span>
                        <span>•</span>
                        <span>Fará {nextAge} anos</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {formatDateBR(nextDate, false)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {/* Badge de Contagem Regressiva */}
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        daysUntil <= 7
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : daysUntil <= 30
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {daysUntil === 1 ? 'Amanhã!' : `Em ${daysUntil} dias`}
                    </span>

                    <div className="flex items-center gap-1">
                      {person.wantToGift && (
                        <button
                          onClick={() => onOpenNewGift(person.id)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Adicionar ideia de presente"
                        >
                          <Gift className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onOpenSendMessage(person)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Enviar parabéns"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
