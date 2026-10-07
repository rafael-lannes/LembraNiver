import { z } from 'zod';
import {
  BackupPayload,
  Person,
  GiftItem,
  GiftHistoryItem,
  BirthdayTemplate,
  CustomReminder,
  AppSettings,
  RelationshipType,
} from '../types';

const RelationshipTypeEnum = z.enum([
  'Mãe',
  'Pai',
  'Filho(a)',
  'Avô/Avó',
  'Irmão(ã)',
  'Cônjuge',
  'Namorado(a)',
  'Amigo(a)',
  'Colega de Trabalho',
  'Sogro(a)',
  'Sobrinho(a)',
  'Tio(a)',
  'Primo(a)',
  'Outro',
]);

export const PersonSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nickname: z.string().optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data deve ser YYYY-MM-DD'),
  relationship: RelationshipTypeEnum,
  wantToGift: z.boolean(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const GiftItemSchema = z.object({
  id: z.string().min(1),
  personId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  url: z.string().optional(),
  estimatedPrice: z.number().optional(),
  actualPrice: z.number().optional(),
  priority: z.enum(['baixa', 'media', 'alta']),
  status: z.enum(['ideia', 'comprado', 'entregue']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const GiftHistoryItemSchema = z.object({
  id: z.string().min(1),
  personId: z.string().min(1),
  title: z.string().min(1),
  occasion: z.string().min(1),
  deliveredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data deve ser YYYY-MM-DD'),
  pricePaid: z.number().optional(),
  reactionNotes: z.string().optional(),
  originalGiftId: z.string().optional(),
  createdAt: z.string(),
});

export const BirthdayTemplateSchema = z.object({
  id: z.string().min(1),
  category: z.enum(['classica', 'humorada', 'curta']),
  title: z.string().min(1),
  text: z.string().min(1),
  isCustom: z.boolean().optional(),
});

export const CustomReminderSchema = z.object({
  id: z.string().min(1),
  personId: z.string().optional(),
  title: z.string().min(1),
  dateTime: z.string(),
  notes: z.string().optional(),
  isCompleted: z.boolean(),
  createdAt: z.string(),
});

export const AppSettingsSchema = z.object({
  darkMode: z.boolean(),
  notificationsEnabled: z.boolean(),
  notifyFirstDayOfMonth: z.boolean(),
  notify15DaysBefore: z.boolean(),
  notify3DaysBefore: z.boolean(),
  notifyOnDay: z.boolean(),
  userName: z.string().optional(),
  userBirthdate: z.string().optional(),
});

export const BackupPayloadSchema = z.object({
  version: z.number().int().positive(),
  appName: z.literal('LembraNiver'),
  exportedAt: z.string(),
  data: z.object({
    persons: z.array(PersonSchema),
    gifts: z.array(GiftItemSchema),
    history: z.array(GiftHistoryItemSchema),
    templates: z.array(BirthdayTemplateSchema),
    reminders: z.array(CustomReminderSchema),
    settings: AppSettingsSchema,
  }),
});

export interface BackupValidationResult {
  valid: boolean;
  payload?: BackupPayload;
  errorMessage?: string;
  summary?: {
    personsCount: number;
    giftsCount: number;
    historyCount: number;
    remindersCount: number;
    templatesCount: number;
    exportedAt: string;
    version: number;
  };
}

/**
 * Cria o payload consolidado de backup
 */
export function generateBackupPayload(data: {
  persons: Person[];
  gifts: GiftItem[];
  history: GiftHistoryItem[];
  templates: BirthdayTemplate[];
  reminders: CustomReminder[];
  settings: AppSettings;
}): BackupPayload {
  return {
    version: 1,
    appName: 'LembraNiver',
    exportedAt: new Date().toISOString(),
    data,
  };
}

/**
 * Faz download do arquivo de backup em JSON no navegador
 */
export function downloadBackupFile(payload: BackupPayload): string {
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const todayIso = new Date().toISOString().split('T')[0];
  const filename = `lembraniver_backup_${todayIso}.json`;
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return filename;
}

/**
 * Compartilha o arquivo de backup usando a Web Share API se suportada
 */
export async function shareBackupFile(payload: BackupPayload): Promise<boolean> {
  const jsonString = JSON.stringify(payload, null, 2);
  const todayIso = new Date().toISOString().split('T')[0];
  const filename = `lembraniver_backup_${todayIso}.json`;
  const file = new File([jsonString], filename, { type: 'application/json' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Backup LembraNiver',
        text: `Backup completo do LembraNiver exportado em ${todayIso}`,
      });
      return true;
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Falha ao compartilhar backup:', err);
      }
      return false;
    }
  }

  // Fallback para download direto caso share não suporte arquivos
  downloadBackupFile(payload);
  return true;
}

/**
 * Validação rigorosa do JSON de backup usando Zod
 */
export function validateBackupJson(jsonString: string): BackupValidationResult {
  try {
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      return { valid: false, errorMessage: 'Arquivo corrompido: não é um JSON válido.' };
    }

    const validation = BackupPayloadSchema.safeParse(parsed);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      const pathStr = firstIssue.path.join('.');
      return {
        valid: false,
        errorMessage: `Erro de validação no campo "${pathStr}": ${firstIssue.message}`,
      };
    }

    const payload = validation.data as BackupPayload;

    return {
      valid: true,
      payload,
      summary: {
        personsCount: payload.data.persons.length,
        giftsCount: payload.data.gifts.length,
        historyCount: payload.data.history.length,
        remindersCount: payload.data.reminders.length,
        templatesCount: payload.data.templates.length,
        exportedAt: payload.exportedAt,
        version: payload.version,
      },
    };
  } catch (err: unknown) {
    return {
      valid: false,
      errorMessage: `Erro inesperado na validação do backup: ${(err as Error).message}`,
    };
  }
}

/**
 * Executa a restauração nos modos "Substituição Total" ou "Mesclagem (Merge)"
 */
export function applyBackupRestore(
  incoming: BackupPayload,
  mode: 'replace' | 'merge',
  currentData: {
    persons: Person[];
    gifts: GiftItem[];
    history: GiftHistoryItem[];
    templates: BirthdayTemplate[];
    reminders: CustomReminder[];
    settings: AppSettings;
  }
): {
  persons: Person[];
  gifts: GiftItem[];
  history: GiftHistoryItem[];
  templates: BirthdayTemplate[];
  reminders: CustomReminder[];
  settings: AppSettings;
} {
  if (mode === 'replace') {
    return {
      persons: incoming.data.persons,
      gifts: incoming.data.gifts,
      history: incoming.data.history,
      templates: incoming.data.templates,
      reminders: incoming.data.reminders,
      settings: incoming.data.settings,
    };
  }

  // Modo Merge (Mesclagem sem sobrepor IDs existentes)
  const currentPersonIds = new Set(currentData.persons.map((p) => p.id));
  const newPersons = [...currentData.persons];
  incoming.data.persons.forEach((p) => {
    if (!currentPersonIds.has(p.id)) {
      newPersons.push(p);
      currentPersonIds.add(p.id);
    }
  });

  const currentGiftIds = new Set(currentData.gifts.map((g) => g.id));
  const newGifts = [...currentData.gifts];
  incoming.data.gifts.forEach((g) => {
    if (!currentGiftIds.has(g.id)) {
      newGifts.push(g);
      currentGiftIds.add(g.id);
    }
  });

  const currentHistoryIds = new Set(currentData.history.map((h) => h.id));
  const newHistory = [...currentData.history];
  incoming.data.history.forEach((h) => {
    if (!currentHistoryIds.has(h.id)) {
      newHistory.push(h);
      currentHistoryIds.add(h.id);
    }
  });

  const currentTemplateIds = new Set(currentData.templates.map((t) => t.id));
  const newTemplates = [...currentData.templates];
  incoming.data.templates.forEach((t) => {
    if (!currentTemplateIds.has(t.id)) {
      newTemplates.push(t);
      currentTemplateIds.add(t.id);
    }
  });

  const currentReminderIds = new Set(currentData.reminders.map((r) => r.id));
  const newReminders = [...currentData.reminders];
  incoming.data.reminders.forEach((r) => {
    if (!currentReminderIds.has(r.id)) {
      newReminders.push(r);
      currentReminderIds.add(r.id);
    }
  });

  return {
    persons: newPersons,
    gifts: newGifts,
    history: newHistory,
    templates: newTemplates,
    reminders: newReminders,
    settings: incoming.data.settings || currentData.settings,
  };
}
