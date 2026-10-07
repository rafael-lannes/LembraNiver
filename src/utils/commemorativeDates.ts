import { CommemorativeDate, Person, RelationshipType } from '../types';

/**
 * Retorna o N-ésimo domingo de um mês específico
 */
function getNthSundayOfMonth(year: number, month: number, nth: number): { day: number; month: number; year: number } {
  // month é 1-12
  let count = 0;
  for (let day = 1; day <= 31; day++) {
    const d = new Date(year, month - 1, day);
    if (d.getMonth() !== month - 1) break; // Passou do mês
    if (d.getDay() === 0) { // 0 = Domingo
      count++;
      if (count === nth) {
        return { day, month, year };
      }
    }
  }
  return { day: 1, month, year };
}

/**
 * Cálculo do Domingo de Páscoa (Algoritmo de Meeus/Jones/Butcher)
 */
function getEasterSunday(year: number): { day: number; month: number; year: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { day, month, year };
}

export const COMMEMORATIVE_DEFINITIONS: CommemorativeDate[] = [
  {
    id: 'dia-das-maes',
    name: 'Dia das Mães',
    description: 'Celebração com mães e avós queridas (2º Domingo de Maio)',
    isFixed: false,
    getCalculatedDate: (year) => getNthSundayOfMonth(year, 5, 2),
    associatedRelationships: ['Mãe', 'Avô/Avó', 'Sogro(a)'],
  },
  {
    id: 'dia-dos-namorados',
    name: 'Dia dos Namorados',
    description: 'Data romântica para casais e cônjuges (12 de Junho)',
    isFixed: true,
    fixedDay: 12,
    fixedMonth: 6,
    associatedRelationships: ['Cônjuge', 'Namorado(a)'],
  },
  {
    id: 'dia-do-amigo',
    name: 'Dia do Amigo',
    description: 'Momento especial para presentear e celebrar grandes amizades (20 de Julho)',
    isFixed: true,
    fixedDay: 20,
    fixedMonth: 7,
    associatedRelationships: ['Amigo(a)', 'Colega de Trabalho'],
  },
  {
    id: 'dia-dos-avos',
    name: 'Dia dos Avós',
    description: 'Carinho especial aos vovôs e vovós (26 de Julho)',
    isFixed: true,
    fixedDay: 26,
    fixedMonth: 7,
    associatedRelationships: ['Avô/Avó'],
  },
  {
    id: 'dia-dos-pais',
    name: 'Dia dos Pais',
    description: 'Celebração com pais e avós da família (2º Domingo de Agosto)',
    isFixed: false,
    getCalculatedDate: (year) => getNthSundayOfMonth(year, 8, 2),
    associatedRelationships: ['Pai', 'Avô/Avó', 'Sogro(a)'],
  },
  {
    id: 'dia-dos-irmaos',
    name: 'Dia dos Irmãos',
    description: 'Lembrança carinhosa para irmãos e irmãs (5 de Setembro)',
    isFixed: true,
    fixedDay: 5,
    fixedMonth: 9,
    associatedRelationships: ['Irmão(ã)', 'Primo(a)'],
  },
  {
    id: 'dia-das-criancas',
    name: 'Dia das Crianças',
    description: 'Presentes e brincadeiras para a garotada (12 de Outubro)',
    isFixed: true,
    fixedDay: 12,
    fixedMonth: 10,
    associatedRelationships: ['Filho(a)', 'Sobrinho(a)'],
  },
  {
    id: 'pascoa',
    name: 'Páscoa',
    description: 'Chocolates e lembranças de Páscoa',
    isFixed: false,
    getCalculatedDate: (year) => getEasterSunday(year),
    associatedRelationships: ['Filho(a)', 'Sobrinho(a)', 'Irmão(ã)', 'Cônjuge'],
  },
  {
    id: 'natal',
    name: 'Natal',
    description: 'A maior festa do ano com troca de presentes para quem amamos (25 de Dezembro)',
    isFixed: true,
    fixedDay: 25,
    fixedMonth: 12,
    associatedRelationships: [
      'Mãe',
      'Pai',
      'Filho(a)',
      'Avô/Avó',
      'Irmão(ã)',
      'Cônjuge',
      'Namorado(a)',
      'Amigo(a)',
      'Sogro(a)',
      'Sobrinho(a)',
      'Tio(a)',
      'Primo(a)',
    ],
    appliesToAllGifting: true,
  },
];

export interface CommemorativeInstance {
  id: string;
  name: string;
  description: string;
  date: Date;
  daysRemaining: number;
  matchedPersons: Person[];
  appliesToAllGifting?: boolean;
}

/**
 * Obtém as próximas ocorrências de datas comemorativas a partir de uma data de referência
 */
export function getUpcomingCommemorativeDates(
  persons: Person[],
  referenceDate: Date = new Date(),
  limitDays: number = 365
): CommemorativeInstance[] {
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);

  const results: CommemorativeInstance[] = [];

  // Analisa o ano atual e o próximo ano
  const currentYear = ref.getFullYear();
  const years = [currentYear, currentYear + 1];

  for (const def of COMMEMORATIVE_DEFINITIONS) {
    for (const yr of years) {
      let day = 1;
      let month = 1;

      if (def.isFixed && def.fixedDay && def.fixedMonth) {
        day = def.fixedDay;
        month = def.fixedMonth;
      } else if (def.getCalculatedDate) {
        const calc = def.getCalculatedDate(yr);
        day = calc.day;
        month = calc.month;
      }

      const eventDate = new Date(yr, month - 1, day, 0, 0, 0, 0);
      const diffMs = eventDate.getTime() - ref.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= limitDays) {
        // Encontra pessoas associadas
        const matched = persons.filter((p) => {
          if (def.appliesToAllGifting && p.wantToGift) {
            return true;
          }
          return def.associatedRelationships.includes(p.relationship);
        });

        results.push({
          id: `${def.id}-${yr}`,
          name: def.name,
          description: def.description,
          date: eventDate,
          daysRemaining: diffDays,
          matchedPersons: matched,
          appliesToAllGifting: def.appliesToAllGifting,
        });
      }
    }
  }

  // Ordena por dias restantes mais próximos
  results.sort((a, b) => a.daysRemaining - b.daysRemaining);
  return results;
}
