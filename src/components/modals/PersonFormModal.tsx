import React, { useState, useEffect } from 'react';
import { Person, RelationshipType } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Save, HeartHandshake } from 'lucide-react';

interface PersonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  personToEdit?: Person | null;
}

const RELATIONSHIPS: RelationshipType[] = [
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
];

export const PersonFormModal: React.FC<PersonFormModalProps> = ({
  isOpen,
  onClose,
  personToEdit,
}) => {
  const { addPerson, updatePerson } = useApp();

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [relationship, setRelationship] = useState<RelationshipType>('Amigo(a)');
  const [wantToGift, setWantToGift] = useState(true);
  const [notes, setNotes] = useState('');
  const [avatar, setAvatar] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (personToEdit) {
      setName(personToEdit.name);
      setNickname(personToEdit.nickname || '');
      setPhone(personToEdit.phone || '');
      setBirthdate(personToEdit.birthdate);
      setRelationship(personToEdit.relationship);
      setWantToGift(personToEdit.wantToGift);
      setNotes(personToEdit.notes || '');
      setAvatar(personToEdit.avatar || '');
    } else {
      setName('');
      setNickname('');
      setPhone('');
      setBirthdate('');
      setRelationship('Amigo(a)');
      setWantToGift(true);
      setNotes('');
      setAvatar('');
    }
    setErrors({});
  }, [isOpen, personToEdit]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) {
      errs.name = 'O nome é obrigatório.';
    }
    if (!birthdate) {
      errs.birthdate = 'A data de nascimento é obrigatória.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (personToEdit) {
      updatePerson(personToEdit.id, {
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        phone: phone.trim() || undefined,
        birthdate,
        relationship,
        wantToGift,
        notes: notes.trim() || undefined,
        avatar: avatar.trim() || undefined,
      });
    } else {
      addPerson({
        name: name.trim(),
        nickname: nickname.trim() || undefined,
        phone: phone.trim() || undefined,
        birthdate,
        relationship,
        wantToGift,
        notes: notes.trim() || undefined,
        avatar: avatar.trim() || undefined,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              {personToEdit ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {personToEdit ? 'Editar Pessoa' : 'Nova Pessoa'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cadastre informações e preferências para não esquecer de presentear
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Nome & Apelido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mariana Souza"
                className={`w-full px-3 py-2 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-all ${
                  errors.name
                    ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-rose-500'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Apelido / Como chama
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Ex: Mari"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all"
              />
            </div>
          </div>

          {/* Data de Nascimento & Parentesco */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Data de Nascimento *
              </label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none transition-all ${
                  errors.birthdate
                    ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-rose-500'
                }`}
              />
              {errors.birthdate && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.birthdate}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Vínculo / Parentesco
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as RelationshipType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all"
              >
                {RELATIONSHIPS.map((rel) => (
                  <option key={rel} value={rel}>
                    {rel}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Telefone / WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                WhatsApp / Telefone (com DDD)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 11987654321"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                Foto / Avatar URL (opcional)
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://exemplo.com/foto.jpg"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all"
              />
            </div>
          </div>

          {/* Toggle "Quero Presentear" */}
          <div className="p-3.5 rounded-2xl border border-rose-200 dark:border-rose-950/80 bg-rose-50/50 dark:bg-rose-950/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <HeartHandshake className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Quero presentear esta pessoa
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Gera lembretes de compra e inclui em datas comemorativas
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={wantToGift}
                onChange={(e) => setWantToGift(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          {/* Notas e Preferências */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Notas & Preferências (Tamanhos de roupa/calçado, gostos, hobbies, restrições)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Calçado 38, camisa M. Gosta de livros de ficção, café e não come derivados de leite."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-rose-500 transition-all leading-relaxed"
            />
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
            >
              {personToEdit ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
