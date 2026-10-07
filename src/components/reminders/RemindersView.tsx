import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BirthdayTemplate, TemplateCategory } from '../../types';
import { formatDateBR } from '../../utils/dateUtils';
import {
  MessageSquareHeart,
  Plus,
  Heart,
  Smile,
  Zap,
  Trash2,
  Edit2,
  CheckCircle,
  BellRing,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface RemindersViewProps {
  onOpenNewReminder: () => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({ onOpenNewReminder }) => {
  const {
    templates,
    reminders,
    persons,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    resetTemplatesToDefault,
    toggleReminder,
    deleteReminder,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'templates' | 'reminders'>('templates');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('classica');

  // Estado para Criar/Editar Template
  const [editingTemplate, setEditingTemplate] = useState<BirthdayTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [tplTitle, setTplTitle] = useState('');
  const [tplCategory, setTplCategory] = useState<TemplateCategory>('classica');
  const [tplText, setTplText] = useState('');

  const handleStartCreateTemplate = () => {
    setTplTitle('');
    setTplCategory(selectedCategory);
    setTplText('Parabéns {nome}! Te desejo muitos anos de vida com saúde e alegria! 🎉');
    setEditingTemplate(null);
    setIsCreatingTemplate(true);
  };

  const handleStartEditTemplate = (t: BirthdayTemplate) => {
    setEditingTemplate(t);
    setTplTitle(t.title);
    setTplCategory(t.category);
    setTplText(t.text);
    setIsCreatingTemplate(true);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplTitle.trim() || !tplText.trim()) return;

    if (editingTemplate) {
      updateTemplate(editingTemplate.id, {
        title: tplTitle.trim(),
        category: tplCategory,
        text: tplText.trim(),
      });
    } else {
      addTemplate({
        title: tplTitle.trim(),
        category: tplCategory,
        text: tplText.trim(),
      });
    }
    setIsCreatingTemplate(false);
    setEditingTemplate(null);
  };

  const filteredTemplates = templates.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-5 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Mensagens & Lembretes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Personalize templates de felicitações e gerencie alertas agendados
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'templates' ? (
            <button
              onClick={handleStartCreateTemplate}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Novo Modelo
            </button>
          ) : (
            <button
              onClick={onOpenNewReminder}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Novo Lembrete
            </button>
          )}
        </div>
      </div>

      {/* Switcher de Abas */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'templates'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquareHeart className="w-4 h-4" />
          <span>Banco de Templates ({templates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'reminders'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Lembretes Agendados ({reminders.length})</span>
        </button>
      </div>

      {/* ABA 1: BANCO DE TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          {/* Seletor de Categoria & Reset */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="grid grid-cols-3 gap-2 max-w-md w-full">
              <button
                type="button"
                onClick={() => setSelectedCategory('classica')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  selectedCategory === 'classica'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Carinhosas</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory('humorada')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  selectedCategory === 'humorada'
                    ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                <span>Engraçadas</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory('curta')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  selectedCategory === 'curta'
                    ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-sky-500" />
                <span>Curtas</span>
              </button>
            </div>

            <button
              onClick={resetTemplatesToDefault}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
              title="Restaurar templates de fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar originais
            </button>
          </div>

          {/* Dica de Placeholders Dinâmicos */}
          <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/60 rounded-2xl text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              Tags dinâmicas disponíveis:{' '}
              <code className="text-rose-600 dark:text-rose-400 font-bold">{'{nome}'}</code>,{' '}
              <code className="text-rose-600 dark:text-rose-400 font-bold">{'{apelido}'}</code> e{' '}
              <code className="text-rose-600 dark:text-rose-400 font-bold">{'{idade}'}</code>.
            </span>
          </div>

          {/* Formulário Inline de Criar / Editar Template */}
          {isCreatingTemplate && (
            <form
              onSubmit={handleSaveTemplate}
              className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-3xl border-2 border-rose-400/50 shadow-md space-y-3 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {editingTemplate ? 'Editar Modelo' : 'Novo Modelo de Mensagem'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsCreatingTemplate(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={tplTitle}
                  onChange={(e) => setTplTitle(e.target.value)}
                  placeholder="Título (ex: Abraço carinhoso)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                  required
                />

                <select
                  value={tplCategory}
                  onChange={(e) => setTplCategory(e.target.value as TemplateCategory)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                >
                  <option value="classica">Carinhosa</option>
                  <option value="humorada">Engraçada</option>
                  <option value="curta">Curta</option>
                </select>
              </div>

              <textarea
                rows={3}
                value={tplText}
                onChange={(e) => setTplText(e.target.value)}
                placeholder="Ex: Parabéns {apelido}! Muita saúde nos seus {idade} anos..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none leading-relaxed"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Salvar Modelo
                </button>
              </div>
            </form>
          )}

          {/* Cards de Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {template.title}
                    </span>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartEditTemplate(template)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                        title="Editar modelo"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Excluir modelo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {template.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 2: LEMBRETES AGENDADOS */}
      {activeTab === 'reminders' && (
        <div className="space-y-3">
          {reminders.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
              <BellRing className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              Nenhum lembrete agendado no momento.
            </div>
          ) : (
            reminders.map((reminder) => {
              const person = persons.find((p) => p.id === reminder.personId);

              return (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex items-start justify-between gap-3 ${
                    reminder.isCompleted
                      ? 'border-slate-200 dark:border-slate-800 opacity-60'
                      : 'border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleReminder(reminder.id)}
                      className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        reminder.isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                      }`}
                    >
                      {reminder.isCompleted && <CheckCircle className="w-3.5 h-3.5" />}
                    </button>

                    <div className="min-w-0 space-y-1">
                      <h4
                        className={`font-bold text-sm text-slate-900 dark:text-white ${
                          reminder.isCompleted ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {reminder.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{formatDateBR(reminder.dateTime, true)}</span>
                        {person && (
                          <>
                            <span>•</span>
                            <span className="text-rose-600 dark:text-rose-400 font-medium">
                              {person.name} ({person.relationship})
                            </span>
                          </>
                        )}
                      </div>

                      {reminder.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {reminder.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
