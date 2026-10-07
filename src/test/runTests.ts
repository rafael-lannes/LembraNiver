import { validateBackupJson, applyBackupRestore, generateBackupPayload } from '../services/backupService';
import { checkRepeatGift, checkSimilarity } from '../utils/giftUtils';
import { getDaysUntilNextBirthday, formatDateBR, formatPhoneBR, sanitizePhoneForWhatsApp } from '../utils/dateUtils';
import { getUpcomingCommemorativeDates } from '../utils/commemorativeDates';
import { fillTemplateVariables, generateWhatsAppLink } from '../utils/messageGenerator';
import { INITIAL_PERSONS, INITIAL_GIFTS, INITIAL_GIFT_HISTORY, INITIAL_SETTINGS, INITIAL_REMINDERS } from '../data/mockData';
import { DEFAULT_TEMPLATES } from '../utils/messageGenerator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
  console.log(`✓ PASS: ${message}`);
}

async function runAllTests() {
  console.log('--- EXECUTANDO TESTES DO LEMBRANIVER ---');

  // 1. Testes de Cálculo de Aniversário
  const refDate = new Date(2026, 9, 7); // 07 de Outubro de 2026
  
  // Mariana nasceu em 1998-10-07 -> É HOJE!
  const mariBday = getDaysUntilNextBirthday('1998-10-07', refDate);
  assert(mariBday.isToday === true, 'Mariana faz aniversário hoje (isToday === true)');
  assert(mariBday.daysUntil === 0, 'Mariana tem 0 dias restantes');
  assert(mariBday.nextAge === 28, 'Mariana completa 28 anos');

  // Carlos nasceu em 1968-10-09 -> Em 2 dias
  const carlosBday = getDaysUntilNextBirthday('1968-10-09', refDate);
  assert(carlosBday.isToday === false, 'Carlos não faz aniversário hoje');
  assert(carlosBday.daysUntil === 2, 'Carlos faz aniversário em 2 dias');
  assert(carlosBday.nextAge === 58, 'Carlos completa 58 anos');

  // 2. Testes de Formatação e WhatsApp
  assert(formatDateBR('1998-10-07', false) === '07 de out', 'Data formatada sem ano');
  assert(sanitizePhoneForWhatsApp('11987654321') === '5511987654321', 'Sanitização de telefone com 55');
  const waLink = generateWhatsAppLink('11987654321', 'Parabéns Mari!');
  assert(waLink !== null && waLink.includes('https://wa.me/5511987654321'), 'Deep link do WhatsApp gerado');

  // 3. Teste de Templates Dinâmicos
  const mari = INITIAL_PERSONS[0];
  const renderedMsg = fillTemplateVariables('Parabéns {nome} ({apelido}) pelos seus {idade} anos!', mari, refDate);
  assert(renderedMsg.includes('Mariana Souza'), 'Placeholder {nome} substituído');
  assert(renderedMsg.includes('Mari'), 'Placeholder {apelido} substituído');
  assert(renderedMsg.includes('28'), 'Placeholder {idade} substituído');

  // 4. Teste de Detecção Inteligente de Presente Repetido
  // Mariana já recebeu "Perfume Floratta Red O Boticário"
  const checkPerfume = checkRepeatGift('Perfume Floratta Red', 'person-1', INITIAL_GIFT_HISTORY);
  assert(checkPerfume.hasConflict === true, 'Detectou presente similar com sucesso');
  assert(checkPerfume.warningMessage !== undefined && checkPerfume.warningMessage.includes('Perfume Floratta Red'), 'Mensagem de alerta contém o presente histórico');

  const checkUnrelated = checkRepeatGift('Livro de Ficção Científica', 'person-1', INITIAL_GIFT_HISTORY);
  assert(checkUnrelated.hasConflict === false, 'Não acusa conflito em presente inédito');

  // 5. Teste de Motor de Datas Comemorativas
  const comms = getUpcomingCommemorativeDates(INITIAL_PERSONS, refDate, 365);
  assert(comms.length > 0, 'Encontrou datas comemorativas futuras');
  // Em 07/10/2026, a próxima data é Dia das Crianças (12/10/2026, faltam 5 dias)
  const diaCriancas = comms.find(c => c.name === 'Dia das Crianças');
  assert(diaCriancas !== undefined, 'Dia das Crianças presente na lista');
  assert(diaCriancas!.daysRemaining === 5, 'Dia das Crianças calculado para daqui a 5 dias');
  assert(diaCriancas!.matchedPersons.some(p => p.relationship === 'Filho(a)'), 'Filho(a) vinculado ao Dia das Crianças');

  // 6. Testes do Backup Service e Validação Zod
  const payload = generateBackupPayload({
    persons: INITIAL_PERSONS,
    gifts: INITIAL_GIFTS,
    history: INITIAL_GIFT_HISTORY,
    templates: DEFAULT_TEMPLATES,
    reminders: INITIAL_REMINDERS,
    settings: INITIAL_SETTINGS,
  });

  const jsonStr = JSON.stringify(payload);
  const validResult = validateBackupJson(jsonStr);
  assert(validResult.valid === true, 'JSON de backup válido passa na validação Zod');
  assert(validResult.summary?.personsCount === INITIAL_PERSONS.length, 'Contagem correta de pessoas no resumo');

  // Teste de JSON inválido
  const invalidResult = validateBackupJson('{"version": 1, "appName": "OutroApp"}');
  assert(invalidResult.valid === false, 'JSON com formato ou appName incorreto é rejeitado');

  // Teste de Restauração Merge
  const newPersonTest = {
    ...INITIAL_PERSONS[0],
    id: 'person-test-unique-99',
    name: 'Tia Zilda',
  };
  const mockIncoming = {
    ...payload,
    data: {
      ...payload.data,
      persons: [newPersonTest],
    },
  };
  const restoredMerge = applyBackupRestore(mockIncoming, 'merge', {
    persons: INITIAL_PERSONS,
    gifts: INITIAL_GIFTS,
    history: INITIAL_GIFT_HISTORY,
    templates: DEFAULT_TEMPLATES,
    reminders: INITIAL_REMINDERS,
    settings: INITIAL_SETTINGS,
  });
  assert(restoredMerge.persons.length === INITIAL_PERSONS.length + 1, 'Modo Merge somou o novo registro sem apagar os existentes');

  console.log('--- TODOS OS TESTES PASSARAM COM 100% DE SUCESSO! ---');
}

runAllTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
