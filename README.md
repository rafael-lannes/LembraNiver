<div align="center">

  <img src="public/app-icon.png" alt="LembraNiver Logo" width="130" />

  # LembraNiver
  ### *"Mais presença na vida de quem você ama."*

  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Capacitor Android](https://img.shields.io/badge/Capacitor-Android-1192E8?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
  [![License](https://img.shields.io/badge/Licen%C3%A7a-MIT-rose?style=for-the-badge)](LICENSE)

  <p align="center">
    O <b>LembraNiver</b> é um aplicativo moderno, completo e <i>offline-first</i> para você nunca mais esquecer de parabenizar quem ama, controlar ideias de presentes, evitar compras repetidas e celebrar datas comemorativas especiais.
  </p>

</div>

---

## 🌟 Principais Funcionalidades

### 1. 👥 Gestão Completa de Pessoas & Relações
- **Cadastro Detalhado:** Nome, apelido, número de WhatsApp/telefone, data de nascimento e grau de parentesco (`Mãe`, `Pai`, `Filho(a)`, `Avô/Avó`, `Irmão(ã)`, `Cônjuge`, `Amigo(a)`, etc.).
- **Flag "Quero Presentear":** Ativa o cálculo de lembretes automáticos e associação em datas especiais.
- **Notas de Preferências:** Anote tamanhos de roupas, calçados, hobbies, marcas favoritas e restrições.

### 2. 🎂 "Meu Aniversário"
- Registro da data de aniversário do próprio usuário com contagem regressiva dedicada, idade a ser completada e notificações especiais de celebração no seu dia!

### 3. 💌 Gerador Dinâmico de Mensagens de Parabéns
- **Banco de Mensagens Categorizado:** Tons *Clássicas / Carinhosas*, *Bem-humoradas / Engraçadas* e *Curtas / Diretas*.
- **Placeholders Inteligentes:** Substituição automática de `{nome}`, `{apelido}` e `{idade}`.
- **Compartilhamento Nativo:**
  - Botão **Compartilhar Texto** compatível com o menu padrão do sistema (WhatsApp, Telegram, Instagram, E-mail, SMS, etc.).
  - Atalho rápido direto para o **WhatsApp** e botão **Copiar Mensagem**.

### 4. 🎁 Wishlist & Prevenção Inteligente de Repetição
- **Wishlist & Ideias de Presentes:** Links diretos para lojas, preços estimados, prioridades (`Baixa`, `Média`, `Alta`) e status (`Ideia`, `Comprado`, `Entregue`).
- **Prevenção de Repetição:** O sistema alerta em tempo real caso você tente presentear alguém com algo similar ao que já entregou em anos ou datas anteriores (ex: *"Você já deu este item no Natal de 2024"*).
- **Histórico de Entregas:** Registro de data, valor pago, ocasião e notas sobre a reação de quem recebeu.

### 5. 📅 Motor de Datas Comemorativas Brasileiras
- Cálculo automático para datas fixas e móveis brasileiras:
  - Dia das Mães (2º domingo de maio)
  - Dia dos Pais (2º domingo de agosto)
  - Dia dos Namorados (12 de junho)
  - Dia dos Avós (26 de julho)
  - Dia das Crianças (12 de outubro)
  - Páscoa e Natal
- Associação automática de contatos conforme parentesco e preferência de presente.

### 6. 📆 Calendário Interativo do Mês
- Visão mensal com marcadores coloridos por evento (azul para aniversários, verde para comemorações e laranja para lembretes).
- Toque em qualquer dia para ver os eventos e acessar atalhos rápidos de envio.

### 7. 🔔 Central de Lembretes & Notificações
- Alertas matinais no dia do evento.
- Alertas com 15 dias de antecedência para pesquisar com calma.
- Alertas com 3 dias de antecedência para compra urgente.
- Criação de lembretes customizados com data e hora.
- Botão **Testar Notificação** para validação imediata no dispositivo.

### 8. 💾 Backup & Restauração Completa (Offline-First)
- Exportação em arquivo `.json` versionado e validado com schema rigoroso via **Zod**.
- Restauração com modos **Substituir Base** ou **Mesclar Dados (Merge)**.
- Total privacidade: seus contatos e anotações ficam salvos 100% no seu dispositivo.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Vite 8
- **Estilização:** Tailwind CSS (Dark Mode & Light Mode responsivo)
- **Ícones:** Lucide React
- **Validação:** Zod
- **Mobile Nativo:** Capacitor 8 (Android SDK 34 / Java 17)
- **Animações:** Canvas Confetti

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- (Opcional para Android) Android SDK e JDK 17

### Passo a Passo

```bash
# 1. Clonar o repositório
git clone https://github.com/rafael-lannes/LembraNiver.git
cd LembraNiver

# 2. Instalar dependências
npm install

# 3. Rodar em ambiente de desenvolvimento
npm run dev

# 4. Executar os testes automatizados
npm test

# 5. Compilar build para produção
npm run build
```

---

## 📱 Aplicativo Android (APK)

O build compilado em formato APK está disponível na raiz do repositório:
- [`LembraNiver-debug.apk`](LembraNiver-debug.apk)

Para gerar um novo build nativo Android:
```bash
npm run android:sync
npm run android:build
```

---

## 👨‍💻 Desenvolvedor

Criado com carinho por **Rafael Lannes**.

- 🌐 **Página Pessoal / Portfólio:** [rafael-lannes.github.io](https://rafael-lannes.github.io/)
- 🐙 **GitHub:** [@rafael-lannes](https://github.com/rafael-lannes)

---

<div align="center">
  <sub>LembraNiver © 2026 • Feito para conectar pessoas com mais carinho e presença.</sub>
</div>
