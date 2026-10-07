import React, { useMemo } from 'react';
import { ChevronDown, Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  value: string; // formato 'YYYY-MM-DD' ou vazio ''
  onChange: (dateStr: string) => void;
  minYear?: number;
  maxYear?: number;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minYear = 1920,
  maxYear = new Date().getFullYear() + 5,
  label,
  required = false,
  error,
  helperText,
}) => {
  // Parsing da data atual YYYY-MM-DD
  const { currentDay, currentMonth, currentYear } = useMemo(() => {
    if (!value) {
      return { currentDay: '', currentMonth: '', currentYear: '' };
    }
    const parts = value.split('-');
    if (parts.length === 3) {
      return {
        currentYear: parts[0],
        currentMonth: String(parseInt(parts[1], 10)), // 1 a 12
        currentDay: String(parseInt(parts[2], 10)), // 1 a 31
      };
    }
    return { currentDay: '', currentMonth: '', currentYear: '' };
  }, [value]);

  // Quantidade de dias válidos no mês/ano selecionado
  const daysInMonth = useMemo(() => {
    const y = currentYear ? parseInt(currentYear, 10) : 2024; // ano bissexto por padrão
    const m = currentMonth ? parseInt(currentMonth, 10) : 1;
    return new Date(y, m, 0).getDate();
  }, [currentYear, currentMonth]);

  // Lista de anos em ordem decrescente (mais recentes primeiro para fácil rolagem)
  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      list.push(y);
    }
    return list;
  }, [minYear, maxYear]);

  // Lista de dias (1 a daysInMonth)
  const days = useMemo(() => {
    const list: number[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      list.push(d);
    }
    return list;
  }, [daysInMonth]);

  const handleDayChange = (newDay: string) => {
    if (!newDay) {
      if (!currentMonth && !currentYear) onChange('');
      return;
    }
    const m = currentMonth || '1';
    const y = currentYear || String(new Date().getFullYear());
    const dayPadded = newDay.padStart(2, '0');
    const monthPadded = m.padStart(2, '0');
    onChange(`${y}-${monthPadded}-${dayPadded}`);
  };

  const handleMonthChange = (newMonth: string) => {
    if (!newMonth) {
      if (!currentDay && !currentYear) onChange('');
      return;
    }
    const y = currentYear || String(new Date().getFullYear());
    const maxDaysForNewMonth = new Date(parseInt(y, 10), parseInt(newMonth, 10), 0).getDate();
    let d = currentDay ? parseInt(currentDay, 10) : 1;
    if (d > maxDaysForNewMonth) {
      d = maxDaysForNewMonth;
    }
    const dayPadded = String(d).padStart(2, '0');
    const monthPadded = newMonth.padStart(2, '0');
    onChange(`${y}-${monthPadded}-${dayPadded}`);
  };

  const handleYearChange = (newYear: string) => {
    if (!newYear) {
      if (!currentDay && !currentMonth) onChange('');
      return;
    }
    const m = currentMonth || '1';
    const maxDaysForNewMonth = new Date(parseInt(newYear, 10), parseInt(m, 10), 0).getDate();
    let d = currentDay ? parseInt(currentDay, 10) : 1;
    if (d > maxDaysForNewMonth) {
      d = maxDaysForNewMonth;
    }
    const dayPadded = String(d).padStart(2, '0');
    const monthPadded = m.padStart(2, '0');
    onChange(`${newYear}-${monthPadded}-${dayPadded}`);
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>{label}</span>
            {required && <span className="text-rose-500 font-bold">*</span>}
          </label>
          {value && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {currentDay.padStart(2, '0')}/{currentMonth.padStart(2, '0')}/{currentYear}
            </span>
          )}
        </div>
      )}

      {/* Grid de 3 Seletores com Rolagem: Dia / Mês / Ano */}
      <div className="grid grid-cols-3 gap-2">
        {/* DIA */}
        <div className="relative">
          <label className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-0.5 uppercase tracking-wider text-center">
            Dia
          </label>
          <div className="relative">
            <select
              value={currentDay}
              onChange={(e) => handleDayChange(e.target.value)}
              className={`w-full appearance-none pl-3 pr-7 py-2.5 rounded-xl border text-sm font-medium text-center bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-all cursor-pointer ${
                error
                  ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-rose-500 dark:focus:border-rose-500'
              }`}
            >
              <option value="" disabled>
                Dia
              </option>
              {days.map((d) => (
                <option key={d} value={String(d)}>
                  {String(d).padStart(2, '0')}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* MÊS */}
        <div className="relative">
          <label className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-0.5 uppercase tracking-wider text-center">
            Mês
          </label>
          <div className="relative">
            <select
              value={currentMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className={`w-full appearance-none pl-2 pr-7 py-2.5 rounded-xl border text-sm font-medium text-center bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-all cursor-pointer ${
                error
                  ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-rose-500 dark:focus:border-rose-500'
              }`}
            >
              <option value="" disabled>
                Mês
              </option>
              {MONTH_NAMES.map((name, idx) => (
                <option key={idx + 1} value={String(idx + 1)}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* ANO */}
        <div className="relative">
          <label className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-0.5 uppercase tracking-wider text-center">
            Ano
          </label>
          <div className="relative">
            <select
              value={currentYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className={`w-full appearance-none pl-2 pr-7 py-2.5 rounded-xl border text-sm font-medium text-center bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-all cursor-pointer ${
                error
                  ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-rose-500 dark:focus:border-rose-500'
              }`}
            >
              <option value="" disabled>
                Ano
              </option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {error ? (
        <p className="text-[11px] text-rose-500 mt-1 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};
