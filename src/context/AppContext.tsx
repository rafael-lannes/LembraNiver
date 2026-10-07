import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Person,
  GiftItem,
  GiftHistoryItem,
  BirthdayTemplate,
  CustomReminder,
  AppSettings,
  BackupPayload,
} from '../types';
import {
  INITIAL_PERSONS,
  INITIAL_GIFTS,
  INITIAL_GIFT_HISTORY,
  INITIAL_REMINDERS,
  INITIAL_SETTINGS,
} from '../data/mockData';
import { DEFAULT_TEMPLATES } from '../utils/messageGenerator';
import { applyBackupRestore } from '../services/backupService';
import { getDaysUntilNextBirthday } from '../utils/dateUtils';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: 'birthday-today' | 'birthday-3days' | 'birthday-15days' | 'monthly-summary' | 'custom-reminder';
  personId?: string;
  date: string;
  isRead: boolean;
}

interface AppContextType {
  persons: Person[];
  gifts: GiftItem[];
  history: GiftHistoryItem[];
  templates: BirthdayTemplate[];
  reminders: CustomReminder[];
  settings: AppSettings;
  toasts: ToastMessage[];
  notifications: AppNotification[];
  unreadNotificationCount: number;

  // Actions
  addPerson: (data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => Person;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;

  addGift: (data: Omit<GiftItem, 'id' | 'createdAt' | 'updatedAt'>) => GiftItem;
  updateGift: (id: string, updates: Partial<GiftItem>) => void;
  deleteGift: (id: string) => void;
  markGiftAsDelivered: (
    giftId: string,
    data: {
      occasion: string;
      deliveredDate: string;
      pricePaid?: number;
      reactionNotes?: string;
    }
  ) => void;
  deleteGiftHistory: (id: string) => void;

  addTemplate: (data: Omit<BirthdayTemplate, 'id'>) => BirthdayTemplate;
  updateTemplate: (id: string, updates: Partial<BirthdayTemplate>) => void;
  deleteTemplate: (id: string) => void;
  resetTemplatesToDefault: () => void;

  addReminder: (data: Omit<CustomReminder, 'id' | 'createdAt'>) => CustomReminder;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;

  updateSettings: (updates: Partial<AppSettings>) => void;
  showToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  requestWebNotificationPermission: () => Promise<boolean>;
  testNotification: () => void;

  restoreData: (payload: BackupPayload, mode: 'replace' | 'merge') => void;
  resetToSampleData: () => void;
  loadDemoData: () => void;
  clearAllData: () => void;
}

const STORAGE_KEYS = {
  PERSONS: 'lembraniver_persons_v1',
  GIFTS: 'lembraniver_gifts_v1',
  HISTORY: 'lembraniver_history_v1',
  TEMPLATES: 'lembraniver_templates_v1',
  REMINDERS: 'lembraniver_reminders_v1',
  SETTINGS: 'lembraniver_settings_v1',
  READ_NOTIFS: 'lembraniver_read_notifs_v1',
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialização: primeiro uso inicia vazio; modo demo pode ser acionado a qualquer momento
  const [persons, setPersons] = useState<Person[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PERSONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [gifts, setGifts] = useState<GiftItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GIFTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<GiftHistoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  const [templates, setTemplates] = useState<BirthdayTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
  });

  const [reminders, setReminders] = useState<CustomReminder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SETTINGS;
      }
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return { ...INITIAL_SETTINGS, darkMode: prefersDark };
  });

  const [readNotifIds, setReadNotifIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.READ_NOTIFS);
    return saved ? JSON.parse(saved) : [];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Salvar no LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(persons));
  }, [persons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GIFTS, JSON.stringify(gifts));
  }, [gifts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    // Sincroniza Dark Mode no <html> tag
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.READ_NOTIFS, JSON.stringify(readNotifIds));
  }, [readNotifIds]);

  // Toast System
  const showToast = useCallback(
    (title: string, message?: string, type: ToastMessage['type'] = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Lembretes & Notificações Automáticas Inteligentes
  const notifications = useMemo(() => {
    const notifs: AppNotification[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Aniversariantes de Hoje
    if (settings.notifyOnDay) {
      // Meu Aniversário
      if (settings.userBirthdate) {
        const myCalc = getDaysUntilNextBirthday(settings.userBirthdate, today);
        if (myCalc.isToday) {
          notifs.push({
            id: `notif-today-me-${today.toISOString().split('T')[0]}`,
            title: `🎉 Parabéns! Hoje é o SEU aniversário!`,
            description: `Você está completando ${myCalc.nextAge} anos hoje! Que seu dia seja fantástico!`,
            type: 'birthday-today',
            date: today.toISOString(),
            isRead: readNotifIds.includes(`notif-today-me-${today.toISOString().split('T')[0]}`),
          });
        }
      }

      persons.forEach((person) => {
        const calc = getDaysUntilNextBirthday(person.birthdate, today);
        if (calc.isToday) {
          notifs.push({
            id: `notif-today-${person.id}-${today.toISOString().split('T')[0]}`,
            title: `🎂 Hoje é aniversário de ${person.name}!`,
            description: `Completando ${calc.nextAge} anos hoje. Não se esqueça de mandar parabéns!`,
            type: 'birthday-today',
            personId: person.id,
            date: today.toISOString(),
            isRead: readNotifIds.includes(`notif-today-${person.id}-${today.toISOString().split('T')[0]}`),
          });
        }
      });
    }

    // 2. Alerta com 3 dias de antecedência (Urgente para comprar presente)
    if (settings.notify3DaysBefore) {
      persons.forEach((person) => {
        if (!person.wantToGift) return;
        const calc = getDaysUntilNextBirthday(person.birthdate, today);
        if (calc.daysUntil === 3) {
          notifs.push({
            id: `notif-3d-${person.id}-${calc.nextDate.toISOString().split('T')[0]}`,
            title: `🎁 Faltam 3 dias: Aniversário de ${person.name}`,
            description: `Hora de garantir o presente! Verifique sua Wishlist para ${person.nickname || person.name}.`,
            type: 'birthday-3days',
            personId: person.id,
            date: today.toISOString(),
            isRead: readNotifIds.includes(`notif-3d-${person.id}-${calc.nextDate.toISOString().split('T')[0]}`),
          });
        }
      });
    }

    // 3. Alerta com 15 dias de antecedência
    if (settings.notify15DaysBefore) {
      persons.forEach((person) => {
        if (!person.wantToGift) return;
        const calc = getDaysUntilNextBirthday(person.birthdate, today);
        if (calc.daysUntil === 15) {
          notifs.push({
            id: `notif-15d-${person.id}-${calc.nextDate.toISOString().split('T')[0]}`,
            title: `📅 Faltam 15 dias: Aniversário de ${person.name}`,
            description: `Tempo ideal para pesquisar ideias de presente com calma e entrega sem atraso.`,
            type: 'birthday-15days',
            personId: person.id,
            date: today.toISOString(),
            isRead: readNotifIds.includes(`notif-15d-${person.id}-${calc.nextDate.toISOString().split('T')[0]}`),
          });
        }
      });
    }

    // 4. Notificação de 1º dia do mês para presentear
    if (settings.notifyFirstDayOfMonth) {
      const currentMonth = today.getMonth() + 1;
      const monthPersons = persons.filter((p) => {
        if (!p.wantToGift) return false;
        const m = parseInt(p.birthdate.split('-')[1], 10);
        return m === currentMonth;
      });

      if (monthPersons.length > 0) {
        notifs.push({
          id: `notif-month-${today.getFullYear()}-${currentMonth}`,
          title: `🎈 Aniversariantes para presentear este mês`,
          description: `Você tem ${monthPersons.length} pessoa(s) para presentear neste mês (${monthPersons.map((p) => p.nickname || p.name).join(', ')}).`,
          type: 'monthly-summary',
          date: today.toISOString(),
          isRead: readNotifIds.includes(`notif-month-${today.getFullYear()}-${currentMonth}`),
        });
      }
    }

    // 5. Lembretes personalizados não concluídos cuja data já chegou
    reminders.forEach((r) => {
      if (!r.isCompleted) {
        const remDate = new Date(r.dateTime);
        if (remDate.getTime() <= today.getTime() + 86400000) {
          notifs.push({
            id: `notif-rem-${r.id}`,
            title: `⏰ Lembrete: ${r.title}`,
            description: r.notes || 'Lembrete agendado no LembraNiver',
            type: 'custom-reminder',
            personId: r.personId,
            date: r.dateTime,
            isRead: readNotifIds.includes(`notif-rem-${r.id}`),
          });
        }
      }
    });

    return notifs;
  }, [persons, reminders, settings, readNotifIds]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const markNotificationAsRead = useCallback((id: string) => {
    setReadNotifIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setReadNotifIds(notifications.map((n) => n.id));
  }, [notifications]);

  const requestWebNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      showToast('Aviso', 'Seu navegador não suporta notificações de sistema.', 'warning');
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showToast('Notificações ativadas!', 'Você receberá avisos importantes do LembraNiver.', 'success');
        setSettings((prev) => ({ ...prev, notificationsEnabled: true }));
        return true;
      } else {
        showToast('Permissão negada', 'As notificações de sistema foram desativadas.', 'info');
        setSettings((prev) => ({ ...prev, notificationsEnabled: false }));
        return false;
      }
    } catch {
      return false;
    }
  }, [showToast]);

  const testNotification = useCallback(async () => {
    // 1. Dispara feedback visual imediato via Toast dentro do aplicativo
    showToast(
      '🔔 Teste de Notificação',
      'As notificações do LembraNiver estão ativas e funcionando perfeitamente!',
      'success'
    );

    // 2. Se a API de Notificações do sistema estiver disponível, tenta notificação nativa
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification('LembraNiver: Teste com Sucesso! 🎁', {
            body: 'Você receberá avisos automáticos de aniversários e lembretes aqui!',
            icon: '/favicon.svg',
          });
        } catch {
          // Ignora erro em ambientes com políticas restritas de WebView
        }
      } else if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification('LembraNiver: Notificações Ativadas! 🎉', {
            body: 'Tudo pronto! Seus lembretes de presentes serão entregues.',
            icon: '/favicon.svg',
          });
        }
      }
    }
  }, [showToast]);

  // Ações de Pessoas
  const addPerson = useCallback(
    (data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Person => {
      const now = new Date().toISOString();
      const newPerson: Person = {
        ...data,
        id: `person-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setPersons((prev) => [newPerson, ...prev]);
      showToast('Pessoa cadastrada!', `${newPerson.name} adicionado(a) com sucesso.`, 'success');
      return newPerson;
    },
    [showToast]
  );

  const updatePerson = useCallback(
    (id: string, updates: Partial<Person>) => {
      setPersons((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        )
      );
      showToast('Atualizado!', 'Dados salvos com sucesso.', 'success');
    },
    [showToast]
  );

  const deletePerson = useCallback(
    (id: string) => {
      const person = persons.find((p) => p.id === id);
      setPersons((prev) => prev.filter((p) => p.id !== id));
      // Remove presentes e lembretes vinculados
      setGifts((prev) => prev.filter((g) => g.personId !== id));
      setReminders((prev) => prev.filter((r) => r.personId !== id));
      showToast('Removido', `${person?.name || 'Registro'} foi excluído.`, 'info');
    },
    [persons, showToast]
  );

  // Ações de Presentes
  const addGift = useCallback(
    (data: Omit<GiftItem, 'id' | 'createdAt' | 'updatedAt'>): GiftItem => {
      const now = new Date().toISOString();
      const newGift: GiftItem = {
        ...data,
        id: `gift-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setGifts((prev) => [newGift, ...prev]);
      showToast('Presente adicionado!', `Item "${newGift.title}" salvo na lista.`, 'success');
      return newGift;
    },
    [showToast]
  );

  const updateGift = useCallback(
    (id: string, updates: Partial<GiftItem>) => {
      setGifts((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
        )
      );
      showToast('Presente atualizado!', 'Alterações salvas.', 'success');
    },
    [showToast]
  );

  const deleteGift = useCallback(
    (id: string) => {
      setGifts((prev) => prev.filter((g) => g.id !== id));
      showToast('Item excluído', 'Presente removido da lista.', 'info');
    },
    [showToast]
  );

  const markGiftAsDelivered = useCallback(
    (
      giftId: string,
      deliveryData: {
        occasion: string;
        deliveredDate: string;
        pricePaid?: number;
        reactionNotes?: string;
      }
    ) => {
      const gift = gifts.find((g) => g.id === giftId);
      if (!gift) return;

      const now = new Date().toISOString();
      const newHistoryItem: GiftHistoryItem = {
        id: `hist-${Date.now()}`,
        personId: gift.personId,
        title: gift.title,
        occasion: deliveryData.occasion,
        deliveredDate: deliveryData.deliveredDate,
        pricePaid: deliveryData.pricePaid !== undefined ? deliveryData.pricePaid : gift.actualPrice || gift.estimatedPrice,
        reactionNotes: deliveryData.reactionNotes,
        originalGiftId: gift.id,
        createdAt: now,
      };

      // Adiciona ao histórico e remove ou atualiza status da lista ativa
      setHistory((prev) => [newHistoryItem, ...prev]);
      setGifts((prev) => prev.filter((g) => g.id !== giftId));

      showToast(
        '🎁 Presente arquivado no histórico!',
        `"${gift.title}" registrado como entregue em ${deliveryData.occasion}.`,
        'success'
      );
    },
    [gifts, showToast]
  );

  const deleteGiftHistory = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((h) => h.id !== id));
      showToast('Registro removido', 'Item excluído do histórico.', 'info');
    },
    [showToast]
  );

  // Ações de Templates de Mensagem
  const addTemplate = useCallback(
    (data: Omit<BirthdayTemplate, 'id'>): BirthdayTemplate => {
      const newTemplate: BirthdayTemplate = {
        ...data,
        id: `tpl-${Date.now()}`,
        isCustom: true,
      };
      setTemplates((prev) => [...prev, newTemplate]);
      showToast('Template salvo!', 'Novo modelo de mensagem cadastrado.', 'success');
      return newTemplate;
    },
    [showToast]
  );

  const updateTemplate = useCallback(
    (id: string, updates: Partial<BirthdayTemplate>) => {
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
      showToast('Template atualizado!', 'Modelo de mensagem editado.', 'success');
    },
    [showToast]
  );

  const deleteTemplate = useCallback(
    (id: string) => {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      showToast('Template removido', 'Modelo de mensagem excluído.', 'info');
    },
    [showToast]
  );

  const resetTemplatesToDefault = useCallback(() => {
    setTemplates(DEFAULT_TEMPLATES);
    showToast('Templates restaurados', 'Padrões de fábrica reaplicados.', 'info');
  }, [showToast]);

  // Ações de Lembretes Customizados
  const addReminder = useCallback(
    (data: Omit<CustomReminder, 'id' | 'createdAt'>): CustomReminder => {
      const newRem: CustomReminder = {
        ...data,
        id: `rem-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setReminders((prev) => [newRem, ...prev]);
      showToast('Lembrete criado!', newRem.title, 'success');
      return newRem;
    },
    [showToast]
  );

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  }, []);

  const deleteReminder = useCallback(
    (id: string) => {
      setReminders((prev) => prev.filter((r) => r.id !== id));
      showToast('Lembrete excluído', '', 'info');
    },
    [showToast]
  );

  // Configurações
  const updateSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...updates }));
      showToast('Configurações salvas!', '', 'success');
    },
    [showToast]
  );

  // Restauração de Backup
  const restoreData = useCallback(
    (payload: BackupPayload, mode: 'replace' | 'merge') => {
      const current = {
        persons,
        gifts,
        history,
        templates,
        reminders,
        settings,
      };

      const restored = applyBackupRestore(payload, mode, current);

      setPersons(restored.persons);
      setGifts(restored.gifts);
      setHistory(restored.history);
      setTemplates(restored.templates);
      setReminders(restored.reminders);
      setSettings(restored.settings);

      const modeText = mode === 'replace' ? 'Substituição total realizada' : 'Mesclagem realizada';
      showToast('Backup restaurado!', `${modeText} com sucesso.`, 'success');
    },
    [persons, gifts, history, templates, reminders, settings, showToast]
  );

  // Restaurar / Carregar dados de demonstração
  const loadDemoData = useCallback(() => {
    setPersons(INITIAL_PERSONS);
    setGifts(INITIAL_GIFTS);
    setHistory(INITIAL_GIFT_HISTORY);
    setTemplates(DEFAULT_TEMPLATES);
    setReminders(INITIAL_REMINDERS);
    setSettings(INITIAL_SETTINGS);
    setReadNotifIds([]);
    showToast('Modo de demonstração carregado!', 'Contatos e presentes de teste adicionados.', 'success');
  }, [showToast]);

  const resetToSampleData = loadDemoData;

  const clearAllData = useCallback(() => {
    setPersons([]);
    setGifts([]);
    setHistory([]);
    setReminders([]);
    setReadNotifIds([]);
    showToast('Dados limpos', 'Todos os contatos e presentes foram removidos.', 'info');
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        persons,
        gifts,
        history,
        templates,
        reminders,
        settings,
        toasts,
        notifications,
        unreadNotificationCount,
        addPerson,
        updatePerson,
        deletePerson,
        addGift,
        updateGift,
        deleteGift,
        markGiftAsDelivered,
        deleteGiftHistory,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        resetTemplatesToDefault,
        addReminder,
        toggleReminder,
        deleteReminder,
        updateSettings,
        showToast,
        removeToast,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        requestWebNotificationPermission,
        testNotification,
        restoreData,
        resetToSampleData,
        loadDemoData,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};
