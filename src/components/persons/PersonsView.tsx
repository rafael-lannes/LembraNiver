import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Person, RelationshipType } from '../../types';
import { getDaysUntilNextBirthday, formatDateBR, formatPhoneBR } from '../../utils/dateUtils';
import { Avatar } from '../common/Avatar';
import {
  Search,
  Plus,
  Send,
  Gift,
  MoreVertical,
  Edit2,
  Trash2,
  HeartHandshake,
  Cake,
  Phone,
  Tag,
  Sparkles,
} from 'lucide-react';

interface PersonsViewProps {
  onOpenNewPerson: () => void;
  onEditPerson: (person: Person) => void;
  onOpenSendMessage: (person: Person) => void;
  onOpenGiftsForPerson: (personId: string) => void;
}

export const PersonsView: React.FC<PersonsViewProps> = ({
  onOpenNewPerson,
  onEditPerson,
  onOpenSendMessage,
  onOpenGiftsForPerson,
}) => {
  const { persons, gifts, deletePerson, loadDemoData } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState<string>('todos');
  const [onlyGifting, setOnlyGifting] = useState(false);

  const filteredPersons = useMemo(() => {
    return persons.filter((p) => {
      // Busca
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.nickname && p.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.notes && p.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchSearch) return false;

      // Filtro de Parentesco
      if (selectedRelationship !== 'todos' && p.relationship !== selectedRelationship) {
        return false;
      }

      // Filtro Quero Presentear
      if (onlyGifting && !p.wantToGift) {
        return false;
      }

      return true;
    });
  }, [persons, searchTerm, selectedRelationship, onlyGifting]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir ${name}? Todos os presentes e históricos vinculados serão removidos.`)) {
      deletePerson(id);
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Pessoas & Relações
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gerencie perfis, preferências de presente e datas comemorativas
          </p>
        </div>

        <button
          onClick={onOpenNewPerson}
          className="self-start sm:self-center px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Pessoa
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Busca Textual */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, apelido ou gostos..."
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all"
            />
          </div>

          {/* Filtro Parentesco */}
          <select
            value={selectedRelationship}
            onChange={(e) => setSelectedRelationship(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all"
          >
            <option value="todos">Todos os Vínculos</option>
            <option value="Mãe">Mãe</option>
            <option value="Pai">Pai</option>
            <option value="Filho(a)">Filho(a)</option>
            <option value="Avô/Avó">Avô/Avó</option>
            <option value="Irmão(ã)">Irmão(ã)</option>
            <option value="Cônjuge">Cônjuge</option>
            <option value="Namorado(a)">Namorado(a)</option>
            <option value="Amigo(a)">Amigo(a)</option>
            <option value="Colega de Trabalho">Colega de Trabalho</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        {/* Toggle Quero Presentear */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyGifting}
              onChange={(e) => setOnlyGifting(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
            />
            <span className="font-medium flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
              Filtrar apenas "Quero presentear"
            </span>
          </label>

          <span className="text-[11px] text-slate-400">
            {filteredPersons.length} de {persons.length} pessoas
          </span>
        </div>
      </div>

      {/* Grid de Pessoas */}
      {persons.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center mx-auto">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Nenhuma pessoa cadastrada
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cadastre amigos e familiares para organizar datas e presentes, ou carregue dados de demonstração para testar.
            </p>
          </div>
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xs mx-auto">
            <button
              onClick={onOpenNewPerson}
              className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Pessoa
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
      ) : filteredPersons.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 text-xs">
          Nenhuma pessoa encontrada com os filtros selecionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredPersons.map((person) => {
            const bday = getDaysUntilNextBirthday(person.birthdate);
            const personGifts = gifts.filter((g) => g.personId === person.id);

            return (
              <div
                key={person.id}
                className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
              >
                <div>
                  {/* Topo do Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        name={person.name}
                        avatarUrl={person.avatar}
                        size="lg"
                        className="shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                            {person.name}
                          </h3>
                        </div>
                        {person.nickname && (
                          <span className="text-xs text-rose-600 dark:text-rose-400 font-medium block">
                            "{person.nickname}"
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                          <Tag className="w-3 h-3" />
                          {person.relationship}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditPerson(person)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Editar pessoa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(person.id, person.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Excluir pessoa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Detalhes de Aniversário & Telefone */}
                  <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Nascimento</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                        <Cake className="w-3.5 h-3.5 text-rose-500" />
                        {formatDateBR(person.birthdate, false)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">Próximo Niver</span>
                      <span
                        className={`font-bold mt-0.5 block ${
                          bday.isToday
                            ? 'text-rose-600 dark:text-rose-400 animate-pulse'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {bday.isToday ? 'HOJE! 🎉' : `Em ${bday.daysUntil}d (${bday.nextAge} anos)`}
                      </span>
                    </div>
                  </div>

                  {/* Notas & Tamanhos */}
                  {person.notes && (
                    <div className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 bg-rose-50/40 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-100 dark:border-rose-950">
                      <span className="font-semibold text-rose-700 dark:text-rose-300 block text-[11px] mb-0.5">
                        Preferências & Tamanhos:
                      </span>
                      <p className="line-clamp-2 leading-relaxed">{person.notes}</p>
                    </div>
                  )}
                </div>

                {/* Footer do Card com Botões de Ação */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenGiftsForPerson(person.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Gift className="w-3.5 h-3.5 text-amber-500" />
                    <span>Presentes ({personGifts.length})</span>
                  </button>

                  <button
                    onClick={() => onOpenSendMessage(person)}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-3.5 py-1.5 rounded-xl shadow-sm active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Parabéns</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
