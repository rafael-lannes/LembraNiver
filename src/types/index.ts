export type RelationshipType =
  | 'Mãe'
  | 'Pai'
  | 'Filho(a)'
  | 'Avô/Avó'
  | 'Irmão(ã)'
  | 'Cônjuge'
  | 'Namorado(a)'
  | 'Amigo(a)'
  | 'Colega de Trabalho'
  | 'Sogro(a)'
  | 'Sobrinho(a)'
  | 'Tio(a)'
  | 'Primo(a)'
  | 'Outro';

export interface Person {
  id: string;
  name: string;
  nickname?: string;
  phone?: string; // Formato (XX) XXXXX-XXXX ou apenas números com DDD
  avatar?: string; // Imagem URL ou identificador de emoji/avatar
  birthdate: string; // YYYY-MM-DD
  relationship: RelationshipType;
  wantToGift: boolean; // Flag "Quero presentear"
  notes?: string; // Tamanhos de roupa/calçado, gostos, hobbies, restrições
  createdAt: string;
  updatedAt: string;
}

export type GiftPriority = 'baixa' | 'media' | 'alta';
export type GiftStatus = 'ideia' | 'comprado' | 'entregue';

export interface GiftItem {
  id: string;
  personId: string;
  title: string;
  description?: string;
  url?: string;
  estimatedPrice?: number;
  actualPrice?: number;
  priority: GiftPriority;
  status: GiftStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GiftHistoryItem {
  id: string;
  personId: string;
  title: string;
  occasion: string; // ex: "Aniversário", "Natal", "Dia das Mães", "Dia dos Pais"
  deliveredDate: string; // YYYY-MM-DD
  pricePaid?: number;
  reactionNotes?: string;
  originalGiftId?: string;
  createdAt: string;
}

export type TemplateCategory = 'classica' | 'humorada' | 'curta';

export interface BirthdayTemplate {
  id: string;
  category: TemplateCategory;
  title: string;
  text: string; // Suporta {nome}, {apelido}, {idade}
  isCustom?: boolean;
}

export interface CustomReminder {
  id: string;
  personId?: string;
  title: string;
  dateTime: string; // YYYY-MM-DDTHH:mm
  notes?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface AppSettings {
  darkMode: boolean;
  notificationsEnabled: boolean;
  notifyFirstDayOfMonth: boolean;
  notify15DaysBefore: boolean;
  notify3DaysBefore: boolean;
  notifyOnDay: boolean;
}

export interface BackupPayload {
  version: number;
  appName: 'LembraNiver';
  exportedAt: string;
  data: {
    persons: Person[];
    gifts: GiftItem[];
    history: GiftHistoryItem[];
    templates: BirthdayTemplate[];
    reminders: CustomReminder[];
    settings: AppSettings;
  };
}

export interface CommemorativeDate {
  id: string;
  name: string;
  description: string;
  isFixed: boolean;
  fixedDay?: number;
  fixedMonth?: number; // 1 - 12
  getCalculatedDate?: (year: number) => { day: number; month: number; year: number };
  associatedRelationships: RelationshipType[];
  appliesToAllGifting?: boolean;
}
