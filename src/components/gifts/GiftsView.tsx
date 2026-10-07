import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { GiftItem, GiftHistoryItem, GiftPriority, GiftStatus, Person } from '../../types';
import { formatCurrencyBRL, formatDateBR } from '../../utils/dateUtils';
import { Avatar } from '../common/Avatar';
import {
  Gift,
  Plus,
  ExternalLink,
  CheckCircle,
  Clock,
  History,
  ShoppingBag,
  Trash2,
  Edit2,
  Tag,
  AlertTriangle,
  Smile,
  DollarSign,
  Sparkles,
} from 'lucide-react';

interface GiftsViewProps {
  onOpenNewGift: (defaultPersonId?: string) => void;
  onEditGift: (gift: GiftItem) => void;
  onMarkDelivered: (gift: GiftItem) => void;
  filterByPersonId?: string;
}

export const GiftsView: React.FC<GiftsViewProps> = ({
  onOpenNewGift,
  onEditGift,
  onMarkDelivered,
  filterByPersonId,
}) => {
  const { persons, gifts, history, deleteGift, deleteGiftHistory, loadDemoData } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [selectedPersonId, setSelectedPersonId] = useState<string>(filterByPersonId || 'todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPriority, setSelectedPriority] = useState<string>('todos');

  // Filtra presentes ativos
  const filteredActiveGifts = useMemo(() => {
    return gifts.filter((g) => {
      if (selectedPersonId !== 'todos' && g.personId !== selectedPersonId) return false;
      if (selectedStatus !== 'todos' && g.status !== selectedStatus) return false;
      if (selectedPriority !== 'todos' && g.priority !== selectedPriority) return false;
      return true;
    });
  }, [gifts, selectedPersonId, selectedStatus, selectedPriority]);

  // Filtra históricos
  const filteredHistory = useMemo(() => {
    return history.filter((h) => {
      if (selectedPersonId !== 'todos' && h.personId !== selectedPersonId) return false;
      return true;
    });
  }, [history, selectedPersonId]);

  const handleDeleteGift = (id: string, title: string) => {
    if (confirm(`Remover "${title}" da Wishlist?`)) {
      deleteGift(id);
    }
  };

  const handleDeleteHistory = (id: string, title: string) => {
    if (confirm(`Remover o histórico de entrega de "${title}"?`)) {
      deleteGiftHistory(id);
    }
  };

  const getRecipient = (personId: string): Person | undefined => {
    return persons.find((p) => p.id === personId);
  };

  const handleOpenUrl = (url?: string) => {
    if (!url) return;
    const targetUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Top Header & Abas Principais */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Presentes & Wishlist
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Acompanhe ideias, compras e consulte o histórico de presentes dados
          </p>
        </div>

        <button
          onClick={() => onOpenNewGift(selectedPersonId !== 'todos' ? selectedPersonId : undefined)}
          className="self-start sm:self-center px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Nova Ideia
        </button>
      </div>

      {/* Switcher de Abas: Wishlist vs Histórico */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'active'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Wishlist & Compras Ativas ({gifts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'history'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Histórico de Entregues ({history.length})</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap gap-2.5 items-center">
        {/* Filtro por Pessoa */}
        <select
          value={selectedPersonId}
          onChange={(e) => setSelectedPersonId(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all"
        >
          <option value="todos">Todas as Pessoas</option>
          {persons.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} {p.nickname ? `(${p.nickname})` : ''}
            </option>
          ))}
        </select>

        {activeTab === 'active' && (
          <>
            {/* Filtro por Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all"
            >
              <option value="todos">Todos os Status</option>
              <option value="ideia">Ideia (Wishlist)</option>
              <option value="comprado">Já Comprado</option>
            </select>

            {/* Filtro por Prioridade */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all"
            >
              <option value="todos">Todas as Prioridades</option>
              <option value="alta">Prioridade Alta</option>
              <option value="media">Prioridade Média</option>
              <option value="baixa">Prioridade Baixa</option>
            </select>
          </>
        )}
      </div>

      {/* CONTEÚDO DA ABA 1: WISHLIST ATIVA */}
      {activeTab === 'active' && (
        <>
          {gifts.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Wishlist Vazia
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Adicione ideias de presentes, links de lojas ou carregue dados de demonstração para testar.
                </p>
              </div>
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xs mx-auto">
                <button
                  onClick={() => onOpenNewGift()}
                  className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Nova Ideia
                </button>
                <button
                  onClick={loadDemoData}
                  className="w-full sm:w-auto px-3.5 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Carregar Demonstração
                </button>
              </div>
            </div>
          ) : filteredActiveGifts.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
              <Gift className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              Nenhum presente ativo encontrado com os filtros atuais.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredActiveGifts.map((gift) => {
                const recipient = getRecipient(gift.personId);

                return (
                  <div
                    key={gift.id}
                    className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div>
                      {/* Topo: Pessoa presenteada e Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {recipient ? (
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar
                              name={recipient.name}
                              avatarUrl={recipient.avatar}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <span className="font-semibold text-xs text-slate-900 dark:text-white truncate block">
                                {recipient.name}
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                {recipient.relationship}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Pessoa desvinculada</span>
                        )}

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Badge de Status */}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              gift.status === 'comprado'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {gift.status === 'comprado' ? 'Comprado' : 'Ideia'}
                          </span>

                          {/* Badge de Prioridade */}
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                              gift.priority === 'alta'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {gift.priority}
                          </span>
                        </div>
                      </div>

                      {/* Título & Descrição */}
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {gift.title}
                      </h4>

                      {gift.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {gift.description}
                        </p>
                      )}

                      {/* Preço e Link da Loja */}
                      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {gift.actualPrice ? (
                            <span>{formatCurrencyBRL(gift.actualPrice)}</span>
                          ) : gift.estimatedPrice ? (
                            <span className="text-slate-500 dark:text-slate-400">
                              Est.: {formatCurrencyBRL(gift.estimatedPrice)}
                            </span>
                          ) : (
                            <span className="text-slate-400">Sem valor</span>
                          )}
                        </div>

                        {gift.url && (
                          <button
                            onClick={() => handleOpenUrl(gift.url)}
                            className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Ver na Loja
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Ações do Card */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditGift(gift)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Editar presente"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGift(gift.id, gift.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Excluir presente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => onMarkDelivered(gift)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Marcar como Entregue
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* CONTEÚDO DA ABA 2: HISTÓRICO DE PRESENTES DADOS */}
      {activeTab === 'history' && (
        <>
          {filteredHistory.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
              <History className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              Nenhum presente entregue no histórico ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((item) => {
                const recipient = getRecipient(item.personId);

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {item.occasion}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          {recipient && (
                            <span className="font-semibold text-rose-600 dark:text-rose-400">
                              Para: {recipient.name}
                            </span>
                          )}
                          <span>•</span>
                          <span>Entregue em {formatDateBR(item.deliveredDate, true)}</span>
                          {item.pricePaid && (
                            <>
                              <span>•</span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {formatCurrencyBRL(item.pricePaid)}
                              </span>
                            </>
                          )}
                        </div>

                        {item.reactionNotes && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl mt-1.5 italic">
                            "{item.reactionNotes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteHistory(item.id, item.title)}
                      className="self-end sm:self-center p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Excluir do histórico"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
