import React, { useState, useEffect } from 'react';
import { Person, BirthdayTemplate, TemplateCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  fillTemplateVariables,
  generateWhatsAppLink,
} from '../../utils/messageGenerator';
import { getDaysUntilNextBirthday, formatPhoneBR } from '../../utils/dateUtils';
import { X, Send, Copy, Sparkles, MessageCircle, Heart, Smile, Zap, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SendMessageModalProps {
  person: Person | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
  person,
  isOpen,
  onClose,
}) => {
  const { templates, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('classica');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen && person) {
      // Explode confetti when modal opens
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Fallback silently
      }

      // Preenche com o primeiro template da categoria clássica
      const categoryTemplates = templates.filter((t) => t.category === 'classica');
      if (categoryTemplates.length > 0) {
        setSelectedTemplateId(categoryTemplates[0].id);
        setCustomMessage(fillTemplateVariables(categoryTemplates[0].text, person));
      }
    }
  }, [isOpen, person, templates]);

  if (!isOpen || !person) return null;

  const birthdayCalc = getDaysUntilNextBirthday(person.birthdate);

  const handleSelectTemplate = (template: BirthdayTemplate) => {
    setSelectedTemplateId(template.id);
    setCustomMessage(fillTemplateVariables(template.text, person));
  };

  const handleCategoryChange = (category: TemplateCategory) => {
    setSelectedCategory(category);
    const categoryTemplates = templates.filter((t) => t.category === category);
    if (categoryTemplates.length > 0) {
      setSelectedTemplateId(categoryTemplates[0].id);
      setCustomMessage(fillTemplateVariables(categoryTemplates[0].text, person));
    }
  };

  const handleCopyToClipboard = async () => {
    if (!customMessage.trim()) return;
    try {
      await navigator.clipboard.writeText(customMessage);
      showToast('Copiado para a área de transferência!', 'Cole onde desejar.', 'success');
    } catch {
      showToast('Erro ao copiar', 'Selecione e copie manualmente o texto.', 'error');
    }
  };

  const handleShareText = async () => {
    if (!customMessage.trim()) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Parabéns ${person.nickname || person.name}!`,
          text: customMessage,
        });
        showToast('Compartilhado com sucesso!', 'Mensagem enviada.', 'success');
      } catch (err: unknown) {
        // Ignora abort do usuário ao cancelar o share dialog
        if ((err as Error)?.name !== 'AbortError') {
          handleCopyToClipboard();
        }
      }
    } else {
      // Fallback para cópia automática caso o navegador não ofereça menu nativo de compartilhamento
      handleCopyToClipboard();
    }
  };

  const handleSendWhatsApp = () => {
    if (!person.phone) {
      showToast(
        'Telefone não cadastrado',
        'Adicione o telefone/WhatsApp no cadastro desta pessoa para disparo direto.',
        'warning'
      );
      return;
    }
    const link = generateWhatsAppLink(person.phone, customMessage);
    if (link) {
      window.open(link, '_blank');
      showToast('Abrindo WhatsApp...', 'Disparando mensagem.', 'info');
    }
  };

  const currentCategoryTemplates = templates.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-rose-500/10 via-transparent to-pink-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                Enviar Parabéns para {person.nickname || person.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {birthdayCalc.isToday
                  ? `Completando ${birthdayCalc.nextAge} anos hoje! 🎉`
                  : `Completará ${birthdayCalc.nextAge} anos em ${birthdayCalc.daysUntil} dias`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Seletor de Categoria de Tom */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Selecione o Tom da Mensagem
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('classica')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  selectedCategory === 'classica'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-semibold shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Carinhosa</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('humorada')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  selectedCategory === 'humorada'
                    ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-semibold shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                <span>Engraçada</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('curta')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  selectedCategory === 'curta'
                    ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-semibold shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-sky-500" />
                <span>Curta</span>
              </button>
            </div>
          </div>

          {/* Lista de Modelos da Categoria */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Modelos Rápidos
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {currentCategoryTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTemplate(t)}
                  className={`px-3 py-1.5 text-xs rounded-lg border whitespace-nowrap transition-all ${
                    selectedTemplateId === t.id
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>

          {/* Campo de Texto Editável */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Texto Personalizável
              </label>
              <span className="text-[11px] text-slate-400">
                {customMessage.length} caracteres
              </span>
            </div>
            <textarea
              rows={5}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all leading-relaxed"
              placeholder="Escreva sua mensagem com carinho..."
            />
          </div>

          {/* Informação do Contato */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">
                WhatsApp: {person.phone ? formatPhoneBR(person.phone) : 'Sem número cadastrado'}
              </span>
            </div>
            {!person.phone && (
              <span className="text-amber-500 text-[11px] font-medium">
                (Apenas cópia disponível)
              </span>
            )}
          </div>
        </div>

        {/* Modal Footer com Botões de Ação */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCopyToClipboard}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copiar
          </button>

          {person.phone && (
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs sm:text-sm font-semibold active:scale-95 transition-all"
              title="Disparo direto no WhatsApp"
            >
              <Send className="w-4 h-4" />
              WhatsApp
            </button>
          )}

          <button
            type="button"
            onClick={handleShareText}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/25 active:scale-95 transition-all"
            title="Abrir menu de compartilhamento padrão do aparelho (Telegram, Instagram, E-mail, etc.)"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar Texto
          </button>
        </div>
      </div>
    </div>
  );
};
