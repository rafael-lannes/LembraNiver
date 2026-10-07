/**
 * Utilitários de Data e Formatação Brasileira para LembraNiver
 */

export interface BirthdayCalculation {
  daysUntil: number;
  nextAge: number;
  nextDate: Date;
  isToday: boolean;
  birthYear: number;
}

export function parseISODate(dateStr: string): { year: number; month: number; day: number } {
  // Espera formato YYYY-MM-DD
  const parts = dateStr.split('-');
  return {
    year: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    day: parseInt(parts[2], 10),
  };
}

export function getDaysUntilNextBirthday(
  birthdateStr: string,
  referenceDate: Date = new Date()
): BirthdayCalculation {
  const { year: birthYear, month: birthMonth, day: birthDay } = parseISODate(birthdateStr);

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const currentYear = today.getFullYear();

  // Verifica se o aniversário já ocorreu este ano
  let nextBday = new Date(currentYear, birthMonth - 1, birthDay, 0, 0, 0, 0);
  
  // Tratamento especial para 29 de fevereiro em anos não-bissextos
  if (birthMonth === 2 && birthDay === 29) {
    const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    if (!isLeapYear(currentYear)) {
      nextBday = new Date(currentYear, 1, 28, 0, 0, 0, 0); // 28 de fevereiro
    }
  }

  let nextYear = currentYear;
  if (nextBday.getTime() < today.getTime()) {
    nextYear = currentYear + 1;
    nextBday = new Date(nextYear, birthMonth - 1, birthDay, 0, 0, 0, 0);
    if (birthMonth === 2 && birthDay === 29) {
      const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      if (!isLeapYear(nextYear)) {
        nextBday = new Date(nextYear, 1, 28, 0, 0, 0, 0);
      }
    }
  }

  const diffMs = nextBday.getTime() - today.getTime();
  const daysUntil = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const isToday = daysUntil === 0;
  const nextAge = nextYear - birthYear;

  return {
    daysUntil,
    nextAge,
    nextDate: nextBday,
    isToday,
    birthYear,
  };
}

export function formatDateBR(dateInput: string | Date, includeYear = true): string {
  if (!dateInput) return '';
  let d: Date;
  if (typeof dateInput === 'string') {
    if (dateInput.includes('T')) {
      d = new Date(dateInput);
    } else {
      const { year, month, day } = parseISODate(dateInput);
      d = new Date(year, month - 1, day);
    }
  } else {
    d = dateInput;
  }

  const day = String(d.getDate()).padStart(2, '0');
  const monthNames = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ];
  const monthName = monthNames[d.getMonth()];

  if (includeYear) {
    return `${day} de ${monthName} de ${d.getFullYear()}`;
  }
  return `${day} de ${monthName}`;
}

export function formatDateNumericBR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function formatCurrencyBRL(value?: number): string {
  if (value === undefined || value === null || isNaN(value)) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatPhoneBR(rawPhone?: string): string {
  if (!rawPhone) return '';
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return rawPhone;
}

export function sanitizePhoneForWhatsApp(phone?: string): string {
  if (!phone) return '';
  let digits = phone.replace(/\D/g, '');
  // Se não começa com código de país 55 e tem 10 ou 11 dígitos, adiciona 55
  if (digits.length === 10 || digits.length === 11) {
    digits = `55${digits}`;
  }
  return digits;
}

export const MONTH_NAMES_BR = [
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

export const WEEKDAYS_BR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
