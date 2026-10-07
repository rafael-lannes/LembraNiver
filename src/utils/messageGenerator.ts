import { BirthdayTemplate, Person } from '../types';
import { getDaysUntilNextBirthday, sanitizePhoneForWhatsApp } from './dateUtils';

export const DEFAULT_TEMPLATES: BirthdayTemplate[] = [
  // Clássicas / Carinhosas
  {
    id: 'classica-1',
    category: 'classica',
    title: 'Carinho e bênçãos',
    text: 'Querido(a) {apelido}! Parabéns pelo seu aniversário! Que Deus continue abençoando seus passos com muita saúde, paz e realizações. É um privilégio ter você na minha vida. Feliz aniversário! 🎉🎂✨',
  },
  {
    id: 'classica-2',
    category: 'classica',
    title: 'Gratidão e admiração',
    text: '{nome}, hoje é um dia muito especial! Celebrar os seus {idade} anos é celebrar uma pessoa incrível, de luz e generosidade. Te desejo um novo ciclo repleto de momentos felizes e sonhos conquistados! Um grande abraço! ❤️',
  },
  {
    id: 'classica-3',
    category: 'classica',
    title: 'Afeto e votos de sucesso',
    text: 'Feliz aniversário, {nome}! Que o seu dia seja cercado de sorrisos, abraços sinceros e muito amor. Obrigado(a) por sua amizade e carinho de sempre. Parabéns! 🥂🎈',
  },

  // Bem-humoradas / Engraçadas
  {
    id: 'humorada-1',
    category: 'humorada',
    title: 'Vinho nobre envelhecido',
    text: 'Parabéns, {apelido}! Você não está ficando mais velho(a), só está se tornando um clássico vintage de edição limitada! 🍷🎂 Que os seus {idade} anos tragam juízo (ou pelo menos histórias boas pra contar)! Feliz dia!',
  },
  {
    id: 'humorada-2',
    category: 'humorada',
    title: 'Bolo e juízo',
    text: 'Feliz aniversário, {nome}! Vim te dar os parabéns e garantir meu pedaço de bolo! 🍰 Que a vida continue te presenteando com boletos pagos e paciência infinita. Aproveita muito!',
  },
  {
    id: 'humorada-3',
    category: 'humorada',
    title: 'Contagem regressiva dos 100',
    text: 'E lá se vão {idade} aninhos, {apelido}! Quem diria, hein?! A boa notícia é que você continua com aquela carinha de jovem... pelo menos de longe! 😂 Brincadeiras à parte, parabéns e muita saúde!',
  },

  // Curtas / Diretas
  {
    id: 'curta-1',
    category: 'curta',
    title: 'Parabéns direto e afetuoso',
    text: 'Feliz aniversário, {apelido}! Muita saúde, paz e sucesso no seu novo ciclo! Parabéns! 🎂🎉',
  },
  {
    id: 'curta-2',
    category: 'curta',
    title: 'Votos rápidos',
    text: 'Parabéns pelos {idade} anos, {nome}! Que seu dia seja fantástico e repleto de alegrias! 🥳🎈',
  },
  {
    id: 'curta-3',
    category: 'curta',
    title: 'Grande abraço',
    text: 'Passando pra te desejar um feliz aniversário, {apelido}! Tudo de melhor hoje e sempre! Abraço forte! 🚀✨',
  },
];

/**
 * Preenche placeholders {nome}, {apelido}, {idade} no texto
 */
export function fillTemplateVariables(
  templateText: string,
  person: Person,
  referenceDate: Date = new Date()
): string {
  const { nextAge } = getDaysUntilNextBirthday(person.birthdate, referenceDate);
  const preferredName = person.nickname?.trim() || person.name.split(' ')[0] || person.name;

  return templateText
    .replace(/{nome}/g, person.name.trim())
    .replace(/{apelido}/g, preferredName)
    .replace(/{idade}/g, String(nextAge));
}

/**
 * Gera deep link para WhatsApp com mensagem codificada
 */
export function generateWhatsAppLink(phone: string | undefined, message: string): string | null {
  if (!phone) return null;
  const sanitized = sanitizePhoneForWhatsApp(phone);
  if (!sanitized) return null;
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${sanitized}?text=${encodedText}`;
}
