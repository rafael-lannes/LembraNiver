import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Person, CommemorativeDate } from '../../types';
import {
  MONTH_NAMES_BR,
  WEEKDAYS_BR,
  formatDateBR,
  getDaysUntilNextBirthday,
  parseISODate,
} from '../../utils/dateUtils';
import { COMMEMORATIVE_DEFINITIONS } from '../../utils/commemorativeDates';
import { Avatar } from '../common/Avatar';
import {
  ChevronLeft,
  ChevronRight,
  Cake,
  Calendar as CalendarIcon,
  BellRing,
  Send,
  Plus,
  Sparkles,
} from 'lucide-react';

interface CalendarViewProps {
  onOpenSendMessage: (person: Person) => void;
  onOpenNewReminder: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onOpenSendMessage,
  onOpenNewReminder,
}) => {
  const { persons, reminders } = useApp();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(() => new Date().getDate());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0 - 11

  // Navegação
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDayNumber(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDayNumber(1);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDayNumber(today.getDate());
  };

  // Cálculo da grade do mês
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Domingo
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Mapeamento de Eventos para o Mês Atual
  // 1. Aniversariantes do mês
  const monthBirthdaysByDay = useMemo(() => {
    const map = new Map<number, Person[]>();
    persons.forEach((person) => {
      const { month, day } = parseISODate(person.birthdate);
      if (month === currentMonth + 1) {
        const list = map.get(day) || [];
        list.push(person);
        map.set(day, list);
      }
    });
    return map;
  }, [persons, currentMonth]);

  // 2. Datas Comemorativas do mês
  const monthCommemorativesByDay = useMemo(() => {
    const map = new Map<number, { name: string; description: string }[]>();

    COMMEMORATIVE_DEFINITIONS.forEach((def) => {
      let day = 1;
      let month = 1;

      if (def.isFixed && def.fixedDay && def.fixedMonth) {
        day = def.fixedDay;
        month = def.fixedMonth;
      } else if (def.getCalculatedDate) {
        const calc = def.getCalculatedDate(currentYear);
        day = calc.day;
        month = calc.month;
      }

      if (month === currentMonth + 1) {
        const list = map.get(day) || [];
        list.push({ name: def.name, description: def.description });
        map.set(day, list);
      }
    });

    return map;
  }, [currentYear, currentMonth]);

  // 3. Lembretes customizados do mês
  const monthRemindersByDay = useMemo(() => {
    const map = new Map<number, typeof reminders>();
    reminders.forEach((r) => {
      const d = new Date(r.dateTime);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const day = d.getDate();
        const list = map.get(day) || [];
        list.push(r);
        map.set(day, list);
      }
    });
    return map;
  }, [reminders, currentYear, currentMonth]);

  // Eventos do dia selecionado
  const selectedDayBirthdays = monthBirthdaysByDay.get(selectedDayNumber) || [];
  const selectedDayCommemoratives = monthCommemorativesByDay.get(selectedDayNumber) || [];
  const selectedDayReminders = monthRemindersByDay.get(selectedDayNumber) || [];

  const selectedDateObject = new Date(currentYear, currentMonth, selectedDayNumber);

  return (
    <div className="space-y-5 pb-20">
      {/* Header do Calendário */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Calendário do Mês
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Visão integrada de aniversários, datas comemorativas e lembretes
          </p>
        </div>

        {/* Controles de Navegação */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Hoje
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold min-w-[140px] text-center text-slate-800 dark:text-slate-200">
            {MONTH_NAMES_BR[currentMonth]} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legenda de Badges */}
      <div className="flex flex-wrap items-center gap-4 text-xs p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <span className="font-semibold text-slate-400">Legenda:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-slate-600 dark:text-slate-300">Aniversários (Azul)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-600 dark:text-slate-300">Datas Comemorativas (Verde)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-600 dark:text-slate-300">Lembretes (Laranja)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Grade Mensal (2 Colunas no Desktop) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm">
          {/* Cabeçalho dos Dias da Semana */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {WEEKDAYS_BR.map((wd, i) => (
              <div
                key={wd}
                className={`text-xs font-bold py-1.5 ${
                  i === 0 ? 'text-rose-500' : 'text-slate-400'
                }`}
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Grade de Dias */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Espaços vazios antes do 1º dia */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-16 sm:h-20 rounded-2xl bg-transparent" />
            ))}

            {/* Dias do Mês */}
            {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const hasBirthdays = monthBirthdaysByDay.has(day);
              const hasCommemorative = monthCommemorativesByDay.has(day);
              const hasReminders = monthRemindersByDay.has(day);

              const isSelected = selectedDayNumber === day;
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentMonth &&
                new Date().getFullYear() === currentYear;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDayNumber(day)}
                  className={`h-16 sm:h-20 p-1.5 rounded-2xl border flex flex-col justify-between items-start transition-all relative text-left ${
                    isSelected
                      ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/40 dark:bg-rose-950/30'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-rose-600 text-white shadow-sm'
                          : isSelected
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {day}
                    </span>
                  </div>

                  {/* Indicadores / Badges Coloridos */}
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {hasBirthdays && (
                      <span
                        className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-blue-500"
                        title="Aniversário no dia"
                      />
                    )}
                    {hasCommemorative && (
                      <span
                        className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500"
                        title="Data comemorativa no dia"
                      />
                    )}
                    {hasReminders && (
                      <span
                        className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-amber-500"
                        title="Lembrete no dia"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Painel do Dia Selecionado */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Eventos do Dia
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {formatDateBR(selectedDateObject, true)}
              </h3>
            </div>
            <button
              onClick={onOpenNewReminder}
              className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-colors"
              title="Adicionar lembrete neste dia"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto">
            {selectedDayBirthdays.length === 0 &&
            selectedDayCommemoratives.length === 0 &&
            selectedDayReminders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Nenhum evento registrado para este dia.
              </div>
            ) : (
              <>
                {/* 1. Aniversariantes */}
                {selectedDayBirthdays.map((p) => {
                  const bday = getDaysUntilNextBirthday(p.birthdate);
                  return (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar name={p.name} avatarUrl={p.avatar} size="sm" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {p.name}
                          </h4>
                          <span className="text-[11px] text-blue-700 dark:text-blue-300 block">
                            Fará {bday.nextAge} anos ({p.relationship})
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenSendMessage(p)}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shrink-0 shadow-sm transition-all flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Parabéns
                      </button>
                    </div>
                  );
                })}

                {/* 2. Datas Comemorativas */}
                {selectedDayCommemoratives.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60"
                  >
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{c.name}</span>
                    </div>
                    <p className="text-[11px] text-emerald-900/80 dark:text-emerald-200/80 mt-1">
                      {c.description}
                    </p>
                  </div>
                ))}

                {/* 3. Lembretes Customizados */}
                {selectedDayReminders.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60"
                  >
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold text-xs">
                      <BellRing className="w-3.5 h-3.5" />
                      <span>{r.title}</span>
                    </div>
                    {r.notes && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                        {r.notes}
                      </p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
