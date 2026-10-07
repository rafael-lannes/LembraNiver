# 🎁 LembraNiver - Gerenciador de Presentes, Datas Especiais e Aniversários

O **LembraNiver** é uma aplicação completa, moderna e offline-first desenvolvida para garantir que você nunca mais esqueça de parabenizar ou presentear pessoas queridas em datas especiais, aniversários e comemorações brasileiras.

---

## 🚀 Tecnologias Utilizadas

- **Frontend & Framework:** React 19 + TypeScript + Vite 8
- **Estilização & Design System:** Tailwind CSS (com suporte nativo a Dark Mode e paleta de alto contraste)
- **Ícones:** Lucide React
- **Validação de Schema & Integridade:** Zod
- **Celebração & Feedback Visual:** Canvas Confetti + Sistema de Toasts reativo
- **Armazenamento & Offline-first:** LocalStorage estruturado com fallback inteligente
- **Compartilhamento & Exportação:** Web Share API com fallback para download de arquivo JSON nativo
- **Notificações:** Web Notifications API com central de notificações in-app

---

## 📋 Regras de Negócio Implementadas

### 1. Gestão de Pessoas & Relações
- **Cadastro completo:** Nome, Apelido, Telefone/WhatsApp (com DDD), Foto/Avatar com iniciais coloridas automáticas, Data de Nascimento e Vínculo/Parentesco (`Mãe`, `Pai`, `Filho(a)`, `Avô/Avó`, `Irmão(ã)`, `Cônjuge`, `Namorado(a)`, `Amigo(a)`, `Colega de Trabalho`, etc.).
- **Flag "Quero Presentear":** Toggle para ativar/desativar lembretes de compra e vínculos automáticos com datas comemorativas.
- **Preferências & Notas:** Registro detalhado de tamanhos de calçado/roupa, preferências de presentes, hobbies e restrições.

### 2. Gerador Dinâmico de Mensagens de Aniversário
- **Banco de Templates:** Modelos categorizados em:
  - *Clássicas / Carinhosas*
  - *Bem-humoradas / Engraçadas*
  - *Curtas / Diretas*
- **Placeholders dinâmicos:** `{nome}`, `{apelido}`, `{idade}` substituídos em tempo real.
- **Ação Direta:**
  - Botão **"Enviar via WhatsApp"** disparando Deep Link oficial (`https://wa.me/{telefone}?text={encoded}`).
  - Botão **"Copiar Mensagem"** com feedback visual via Toast.

### 3. Wishlist, Compras & Histórico de Presentes Entregues
- **Lista Ativa / Wishlist:**
  - Título, descrição, prioridade (`baixa`, `media`, `alta`) e status (`ideia`, `comprado`).
  - Link de loja/produto com validação e atalho direto "Abrir no navegador".
  - Preço estimado e preço real.
- **Prevenção de Repetição Inteligente:**
  - Analisador de similaridade que compara em tempo real o novo presente com presentes dados no passado para aquela pessoa.
  - Alerta em destaque caso um item similar já tenha sido entregue em ocasiões anteriores (ex: *"Você já deu este item no Aniversário de 2025"*).
- **Ação "Marcar como Entregue" & Histórico:**
  - Arquiva o item no histórico registrando: Data de entrega, Ocasião/Evento (`Aniversário`, `Natal`, `Dia das Mães`, etc.), valor pago e notas da reação.

### 4. Painel Principal (Dashboard & Feed)
- **Banner de Aniversariantes de Hoje:** Destaque vibrante quando alguém faz aniversário na data atual, com 1-clique para envio de parabéns e consulta de presentes.
- **Próximas Datas Comemorativas:** Card em destaque com a comemoração mais próxima, contagem regressiva de dias e lista de pessoas associadas.
- **Feed de Próximos Aniversários:** Lista cronológica dos aniversariantes nos próximos 60–90 dias, com badge de contagem regressiva e idade a ser completada.

### 5. Calendário Interativo do Mês
- Grade mensal com navegação entre meses e botão de retorno para "Hoje".
- Badges coloridos por tipo de evento:
  - 🔵 **Azul:** Aniversários
  - 🟢 **Verde:** Datas Comemorativas Brasileiras
  - 🟠 **Laranja:** Lembretes Customizados
- Painel lateral com detalhes completos do dia selecionado e atalho rápido de envio de parabéns.

### 6. Motor de Datas Comemorativas Brasileiras
- Cálculo dinâmico para qualquer ano de datas fixas e móveis:
  - Dia das Mães (2º domingo de maio)
  - Dia dos Pais (2º domingo de agosto)
  - Dia dos Namorados (12 de junho)
  - Dia dos Avós (26 de julho)
  - Dia do Amigo (20 de julho)
  - Dia dos Irmãos (5 de setembro)
  - Dia das Crianças (12 de outubro)
  - Páscoa (cálculo de Meeus/Jones/Butcher)
  - Natal (25 de dezembro)
- Mapeamento automático com pessoas cadastradas conforme parentesco e flag de presente.

### 7. Sistema Inteligente de Lembretes & Notificações
- Central de notificações com alertas de:
  - Aniversariantes de hoje.
  - Alerta com 15 dias de antecedência para pesquisa de presente.
  - Alerta com 3 dias de antecedência para compra urgente.
  - Resumo no 1º dia do mês com aniversariantes marcados com "Quero presentear".
  - Lembretes personalizados agendados pelo usuário.

### 8. 💾 Backup & Restauração com Schema Zod
- **Exportação:** Arquivo JSON padronizado e versionado (`lembraniver_backup_YYYY-MM-DD.json`) com consolidação completa de pessoas, listas, históricos, templates e configurações.
- **Compartilhamento:** Suporte a `Web Share API` e download direto.
- **Importação:** Leitura de arquivo com validação rigorosa via Zod.
- **Modos de Restauração:**
  1. *Mesclagem (Merge):* Adiciona novos dados sem sobrepor IDs já existentes.
  2. *Substituição Total:* Limpa a base local e restaura o estado idêntico do arquivo.

---

## 🛠️ Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento local
npm run dev

# Executar suite de testes de regras de negócio
npm test

# Gerar build de produção
npm run build

# Pré-visualizar build de produção
npm run preview

# Sincronizar alterações da aplicação com o projeto Android nativo
npm run android:sync

# Compilar novo pacote APK Android nativo (assembleDebug)
npm run android:build

# Abrir projeto nativo no Android Studio
npm run android:open
```

### 📱 Pacote APK Nativo Pronto para Instalação
O pacote APK gerado está disponível na raiz do projeto:
- **Arquivo direto:** `LembraNiver-debug.apk` (ou em `android/app/build/outputs/apk/debug/app-debug.apk`)
- **Instalação via ADB no celular ou emulador:**
  ```bash
  adb install LembraNiver-debug.apk
  ```

---

## 📁 Estrutura de Diretórios

```
src/
├── components/
│   ├── common/         # Header, Navigation, Avatar, ToastContainer
│   ├── dashboard/      # DashboardView (Banner hoje, cards, feed 90d)
│   ├── persons/        # PersonsView (Listagem, filtros, tamanhos)
│   ├── gifts/          # GiftsView (Wishlist, compras, histórico de entregas)
│   ├── calendar/       # CalendarView (Grade mensal interativa, badges)
│   ├── reminders/      # RemindersView (Banco de templates e lembretes)
│   └── modals/         # Modais de Mensagens, Formulários, Backup e Entrega
├── context/
│   └── AppContext.tsx  # Estado global, persistência e motor de notificações
├── data/
│   └── mockData.ts     # Dados brasileiros para testes imediatos
├── services/
│   └── backupService.ts# Exportação, importação e validação via Zod
├── test/
│   └── runTests.ts     # Suite de testes automatizados
├── types/
│   └── index.ts        # Modelos TypeScript do domínio
└── utils/
    ├── commemorativeDates.ts # Motor de datas brasileiras fixas e móveis
    ├── dateUtils.ts          # Cálculos de aniversário e formatações BR
    ├── giftUtils.ts          # Prevenção inteligente de repetição de presentes
    └── messageGenerator.ts   # Templates dinâmicos e Deep Link WhatsApp
```
