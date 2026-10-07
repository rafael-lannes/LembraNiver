import { Person, GiftItem, GiftHistoryItem, BirthdayTemplate, CustomReminder, AppSettings } from '../types';
import { DEFAULT_TEMPLATES } from '../utils/messageGenerator';

export const INITIAL_PERSONS: Person[] = [
  {
    id: 'person-1',
    name: 'Mariana Souza',
    nickname: 'Mari',
    phone: '11987654321',
    birthdate: '1998-10-07', // Aniversariante de HOJE!
    relationship: 'Amigo(a)',
    wantToGift: true,
    notes: 'Calçado 36, blusa M. Ama perfumes florais, skincare e papelaria fofa.',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'person-2',
    name: 'Carlos Eduardo Oliveira',
    nickname: 'Pai',
    phone: '11991234567',
    birthdate: '1968-10-09', // Aniversário em 2 dias!
    relationship: 'Pai',
    wantToGift: true,
    notes: 'Camisa G, sapato 41. Gosta de café especial, ferramentas manuais e vinhos tintos secos.',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'person-3',
    name: 'Juliana Rocha Silva',
    nickname: 'Jú',
    phone: '11976543210',
    birthdate: '1995-10-19', // Aniversário em 12 dias
    relationship: 'Cônjuge',
    wantToGift: true,
    notes: 'Vestido P, anel aro 16. Ama literatura contemporânea, café com baunilha e fones sem fio.',
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'person-4',
    name: 'Helena Maria Souza',
    nickname: 'Mãe',
    phone: '11981112233',
    birthdate: '1972-11-01', // Aniversário em 25 dias
    relationship: 'Mãe',
    wantToGift: true,
    notes: 'Sandália 37, roupas GG confortáveis. Gosta de plantas/suculentas e bolsas práticas.',
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'person-5',
    name: 'Lucas Gabriel Souza',
    nickname: 'Luquinhas',
    birthdate: '2018-11-16', // 8 anos (Dia das Crianças e Aniversário)
    relationship: 'Filho(a)',
    wantToGift: true,
    notes: 'Calçado infantil 32, roupa tam 10. Apaixonado por Lego, dinossauros e jogos de videogame.',
    createdAt: '2026-02-01T12:00:00Z',
    updatedAt: '2026-02-01T12:00:00Z',
  },
  {
    id: 'person-6',
    name: 'Sebastião Moreira',
    nickname: 'Vovô Tião',
    phone: '11998887766',
    birthdate: '1944-12-06',
    relationship: 'Avô/Avó',
    wantToGift: true,
    notes: 'Gosta de chapéu Panamá, doces caseiros sem açúcar e relógios analógicos.',
    createdAt: '2026-02-10T14:00:00Z',
    updatedAt: '2026-02-10T14:00:00Z',
  },
  {
    id: 'person-7',
    name: 'Rodrigo Brandão',
    nickname: 'Rodrigão',
    phone: '11971239876',
    birthdate: '1992-12-18',
    relationship: 'Colega de Trabalho',
    wantToGift: false,
    notes: 'Gosta de canecas de café e artigos de programação.',
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-03-01T11:00:00Z',
  },
];

export const INITIAL_GIFTS: GiftItem[] = [
  {
    id: 'gift-1',
    personId: 'person-1', // Mari
    title: 'Kit Skincare Facial Hidratante',
    description: 'Kit com sérum de ácido hialurônico e hidratante facial calmante',
    url: 'https://www.belezanaweb.com.br/skincare',
    estimatedPrice: 139.90,
    actualPrice: 129.90,
    priority: 'alta',
    status: 'comprado',
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-10-02T15:00:00Z',
  },
  {
    id: 'gift-2',
    personId: 'person-2', // Carlos (Pai)
    title: 'Moedor de Café Manual Inox',
    description: 'Moedor cônico com regulagem de moagem para café especial',
    url: 'https://www.amazon.com.br/dp/B08X123456',
    estimatedPrice: 180.00,
    priority: 'alta',
    status: 'ideia',
    createdAt: '2026-09-25T14:00:00Z',
    updatedAt: '2026-09-25T14:00:00Z',
  },
  {
    id: 'gift-3',
    personId: 'person-3', // Juliana
    title: 'Kindle Paperwhite 16GB',
    description: 'Leitor digital com iluminação ajustável e à prova d’água',
    url: 'https://www.amazon.com.br/dp/B08N41Y4Q2',
    estimatedPrice: 650.00,
    actualPrice: 599.00,
    priority: 'alta',
    status: 'ideia',
    createdAt: '2026-09-10T11:00:00Z',
    updatedAt: '2026-09-10T11:00:00Z',
  },
  {
    id: 'gift-4',
    personId: 'person-5', // Lucas (Filho)
    title: 'Lego Minecraft A Casa da Raposa',
    description: 'Conjunto de montar com blocos temáticos e minifiguras',
    url: 'https://www.rihappy.com.br/lego-minecraft',
    estimatedPrice: 220.00,
    priority: 'alta',
    status: 'comprado',
    createdAt: '2026-09-28T09:00:00Z',
    updatedAt: '2026-10-04T16:00:00Z',
  },
  {
    id: 'gift-5',
    personId: 'person-4', // Helena (Mãe)
    title: 'Difusor de Aromas Ultrassônico',
    description: 'Aparelho elétrico com luz suave e óleos essenciais de lavanda',
    url: 'https://www.amazon.com.br/dp/B07Y123999',
    estimatedPrice: 120.00,
    priority: 'media',
    status: 'ideia',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z',
  },
];

export const INITIAL_GIFT_HISTORY: GiftHistoryItem[] = [
  {
    id: 'hist-1',
    personId: 'person-1', // Mariana
    title: 'Perfume Floratta Red O Boticário',
    occasion: 'Aniversário',
    deliveredDate: '2025-10-07',
    pricePaid: 149.90,
    reactionNotes: 'Ficou radiante! Disse que é a fragrância favorita do dia a dia.',
    createdAt: '2025-10-07T20:00:00Z',
  },
  {
    id: 'hist-2',
    personId: 'person-2', // Carlos (Pai)
    title: 'Kit Vinho Chileno Tinto Reserva',
    occasion: 'Dia dos Pais',
    deliveredDate: '2026-08-09',
    pricePaid: 175.00,
    reactionNotes: 'Amou o presente e abriu no almoço em família.',
    createdAt: '2026-08-09T18:00:00Z',
  },
  {
    id: 'hist-3',
    personId: 'person-4', // Dona Helena (Mãe)
    title: 'Bolsa Tiracolo em Couro Caramelo',
    occasion: 'Dia das Mães',
    deliveredDate: '2026-05-10',
    pricePaid: 219.00,
    reactionNotes: 'Usa sempre para ir ao shopping e aos passeios.',
    createdAt: '2026-05-10T19:00:00Z',
  },
  {
    id: 'hist-4',
    personId: 'person-3', // Juliana
    title: 'Livro de Cabeceira Edição Especial Tapa Dura',
    occasion: 'Dia dos Namorados',
    deliveredDate: '2026-06-12',
    pricePaid: 95.00,
    reactionNotes: 'Adorou o marcador artesanal e a dedicatória que fiz.',
    createdAt: '2026-06-12T21:00:00Z',
  },
];

export const INITIAL_REMINDERS: CustomReminder[] = [
  {
    id: 'rem-1',
    personId: 'person-1',
    title: 'Entregar presente da Mari e mandar parabéns',
    dateTime: '2026-10-07T18:00',
    notes: 'Passar na casa dela no final da tarde com o kit embalado!',
    isCompleted: false,
    createdAt: '2026-10-05T08:00:00Z',
  },
  {
    id: 'rem-2',
    personId: 'person-2',
    title: 'Confirmar almoço de aniversário do Pai',
    dateTime: '2026-10-08T12:00',
    notes: 'Reservar mesa na churrascaria para o sábado.',
    isCompleted: false,
    createdAt: '2026-10-04T10:00:00Z',
  },
  {
    id: 'rem-3',
    personId: 'person-5',
    title: 'Embalar brinquedo do Luquinhas para Dia das Crianças',
    dateTime: '2026-10-11T20:00',
    notes: 'Esconder no armário até domingo de manhã.',
    isCompleted: false,
    createdAt: '2026-10-06T11:00:00Z',
  },
];

export const INITIAL_SETTINGS: AppSettings = {
  darkMode: false,
  notificationsEnabled: true,
  notifyFirstDayOfMonth: true,
  notify15DaysBefore: true,
  notify3DaysBefore: true,
  notifyOnDay: true,
};
