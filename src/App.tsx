import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { NavigationTabs, TabType } from './components/common/NavigationTabs';
import { ToastContainer } from './components/common/ToastContainer';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { PersonsView } from './components/persons/PersonsView';
import { GiftsView } from './components/gifts/GiftsView';
import { CalendarView } from './components/calendar/CalendarView';
import { RemindersView } from './components/reminders/RemindersView';

// Modals
import { SendMessageModal } from './components/modals/SendMessageModal';
import { PersonFormModal } from './components/modals/PersonFormModal';
import { GiftFormModal } from './components/modals/GiftFormModal';
import { MarkDeliveredModal } from './components/modals/MarkDeliveredModal';
import { BackupModal } from './components/modals/BackupModal';
import { ReminderFormModal } from './components/modals/ReminderFormModal';

import { Person, GiftItem } from './types';

const MainApp: React.FC = () => {
  const { gifts } = useApp();

  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // Modals state
  const [sendMessagePerson, setSendMessagePerson] = useState<Person | null>(null);
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [personToEdit, setPersonToEdit] = useState<Person | null>(null);

  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [giftToEdit, setGiftToEdit] = useState<GiftItem | null>(null);
  const [defaultGiftPersonId, setDefaultGiftPersonId] = useState<string | undefined>(undefined);

  const [deliveredGift, setDeliveredGift] = useState<GiftItem | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  // Handlers para Pessoas
  const handleOpenNewPerson = () => {
    setPersonToEdit(null);
    setIsPersonModalOpen(true);
  };

  const handleEditPerson = (p: Person) => {
    setPersonToEdit(p);
    setIsPersonModalOpen(true);
  };

  // Handlers para Presentes
  const handleOpenNewGift = (personId?: string) => {
    setGiftToEdit(null);
    setDefaultGiftPersonId(personId);
    setIsGiftModalOpen(true);
  };

  const handleEditGift = (g: GiftItem) => {
    setGiftToEdit(g);
    setDefaultGiftPersonId(undefined);
    setIsGiftModalOpen(true);
  };

  const handleMarkDelivered = (g: GiftItem) => {
    setDeliveredGift(g);
  };

  // Handlers para Mensagens
  const handleOpenSendMessage = (p: Person) => {
    setSendMessagePerson(p);
  };

  const handleGiftsForPerson = (personId: string) => {
    setDefaultGiftPersonId(personId);
    setCurrentTab('gifts');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors w-full overflow-x-hidden">
      {/* Header global */}
      <Header
        onOpenNewPerson={handleOpenNewPerson}
        onOpenBackup={() => setIsBackupModalOpen(true)}
      />

      {/* Navegação por abas */}
      <NavigationTabs
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        giftsBadgeCount={gifts.length}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 pt-4 sm:pt-5 pb-24 md:pb-16 overflow-x-hidden">
        {currentTab === 'dashboard' && (
          <DashboardView
            onOpenSendMessage={handleOpenSendMessage}
            onOpenNewPerson={handleOpenNewPerson}
            onOpenNewGift={handleOpenNewGift}
            onNavigateToPersons={() => setCurrentTab('persons')}
            onNavigateToGifts={() => setCurrentTab('gifts')}
            onNavigateToCalendar={() => setCurrentTab('calendar')}
          />
        )}

        {currentTab === 'persons' && (
          <PersonsView
            onOpenNewPerson={handleOpenNewPerson}
            onEditPerson={handleEditPerson}
            onOpenSendMessage={handleOpenSendMessage}
            onOpenGiftsForPerson={handleGiftsForPerson}
          />
        )}

        {currentTab === 'gifts' && (
          <GiftsView
            onOpenNewGift={handleOpenNewGift}
            onEditGift={handleEditGift}
            onMarkDelivered={handleMarkDelivered}
            filterByPersonId={defaultGiftPersonId}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarView
            onOpenSendMessage={handleOpenSendMessage}
            onOpenNewReminder={() => setIsReminderModalOpen(true)}
          />
        )}

        {currentTab === 'reminders' && (
          <RemindersView onOpenNewReminder={() => setIsReminderModalOpen(true)} />
        )}
      </main>

      {/* Modais Globais */}
      <SendMessageModal
        person={sendMessagePerson}
        isOpen={Boolean(sendMessagePerson)}
        onClose={() => setSendMessagePerson(null)}
      />

      <PersonFormModal
        isOpen={isPersonModalOpen}
        onClose={() => setIsPersonModalOpen(false)}
        personToEdit={personToEdit}
      />

      <GiftFormModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        giftToEdit={giftToEdit}
        defaultPersonId={defaultGiftPersonId}
      />

      <MarkDeliveredModal
        gift={deliveredGift}
        isOpen={Boolean(deliveredGift)}
        onClose={() => setDeliveredGift(null)}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />

      <ReminderFormModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
      />

      {/* Container de Toasts para Notificações Flutuantes */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
