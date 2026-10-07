import { GiftHistoryItem } from '../types';
import { formatDateBR } from './dateUtils';

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

/**
 * Calcula a similaridade entre duas frases baseando-se em tokens significativos
 */
export function checkSimilarity(textA: string, textB: string): number {
  const normA = normalizeString(textA);
  const normB = normalizeString(textB);

  if (normA === normB) return 1.0;
  if (normA.includes(normB) || normB.includes(normA)) {
    const minLen = Math.min(normA.length, normB.length);
    const maxLen = Math.max(normA.length, normB.length);
    if (minLen >= 4 && minLen / maxLen > 0.45) return 0.85;
  }

  const stopWords = new Set(['de', 'da', 'do', 'das', 'dos', 'em', 'um', 'uma', 'para', 'com', 'o', 'a', 'os', 'as', 'e']);
  const tokensA = new Set(normA.split(/\s+/).filter((t) => t.length > 2 && !stopWords.has(t)));
  const tokensB = new Set(normB.split(/\s+/).filter((t) => t.length > 2 && !stopWords.has(t)));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let commonCount = 0;
  tokensA.forEach((token) => {
    if (tokensB.has(token)) {
      commonCount++;
    }
  });

  const jaccard = commonCount / Math.max(tokensA.size, tokensB.size);
  return jaccard;
}

export interface RepeatGiftCheckResult {
  hasConflict: boolean;
  matchedHistoryItem?: GiftHistoryItem;
  warningMessage?: string;
}

/**
 * Verifica se um presente que está sendo cadastrado/planejado já foi entregue anteriormente à pessoa
 */
export function checkRepeatGift(
  title: string,
  personId: string,
  history: GiftHistoryItem[]
): RepeatGiftCheckResult {
  if (!title || title.trim().length < 3) {
    return { hasConflict: false };
  }

  // Filtra históricos apenas dessa pessoa
  const personHistory = history.filter((h) => h.personId === personId);

  for (const hist of personHistory) {
    const similarity = checkSimilarity(title, hist.title);
    if (similarity >= 0.5) {
      const formattedDate = formatDateBR(hist.deliveredDate, true);
      const occasionText = hist.occasion ? ` no ${hist.occasion}` : '';
      return {
        hasConflict: true,
        matchedHistoryItem: hist,
        warningMessage: `Atenção: Você já entregou um presente similar ("${hist.title}")${occasionText} em ${formattedDate}.`,
      };
    }
  }

  return { hasConflict: false };
}
