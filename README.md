# Sistema de Envio de Documentos Fiscais - Frontend

**Versão:** 1.0  
**Data:** 03/08/2025

Frontend da aplicação para envio de emails com arquivos fiscais. Uma solução moderna e intuitiva construída com React 18 e TypeScript, oferecendo upload otimizado, validação em tempo real e experiência de usuário fluida.

## Histórico de Revisões

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 1.0 | 03/08/2025 | Ronaldo Junior | Documentação inicial do frontend com arquitetura React 18, sistema de upload avançado e integração com backend |

## Índice

1. [Introdução](#1-introdução)
   - 1.1. [Propósito](#11-propósito)
   - 1.2. [Público-alvo](#12-público-alvo)
   - 1.3. [Escopo](#13-escopo)
2. [Visão Geral do Produto](#2-visão-geral-do-produto)
3. [Arquitetura e Tecnologias](#3-arquitetura-e-tecnologias)
4. [Setup e Desenvolvimento](#4-setup-e-desenvolvimento)
5. [Funcionalidades](#5-funcionalidades)
6. [Estrutura do Projeto](#6-estrutura-do-projeto)
7. [Configuração Detalhada](#7-configuração-detalhada)
8. [Deploy](#8-deploy)

## 1. Introdução

### 1.1 Propósito

Este documento especifica a arquitetura, funcionalidades e processo de desenvolvimento do frontend do Sistema de Envio de Documentos Fiscais. Seu propósito é detalhar a implementação da interface de usuário, padrões de código e integração com o backend para que a equipe de desenvolvimento possa manter e evoluir a aplicação de forma eficaz.

### 1.2 Público-alvo

Este documento destina-se aos desenvolvedores frontend, arquitetos de software e stakeholders do projeto, servindo como a fonte principal de verdade para a implementação da interface de usuário e sua integração com o sistema.

### 1.3 Escopo

O escopo do frontend abrange o desenvolvimento de uma interface web moderna que inclui:

• **Interface de Upload**: Sistema avançado de upload com drag & drop, preview de arquivos, progress tracking e pause/resume  
• **Gerenciamento de Estado**: Estado global com Zustand, persistência local e sincronização com backend  
• **Experiência do Usuário**: Stepper navigation, feedback em tempo real, loading states e error handling  
• **Responsividade**: Interface adaptável para desktop, tablet e mobile com acessibilidade completa

## 2. Visão Geral do Produto

O frontend é uma aplicação web Single Page Application (SPA) projetada para otimizar a experiência do usuário no processo de envio de documentos fiscais. A interface permite upload intuitivo de arquivos, seleção de clientes, e acompanhamento em tempo real do status de envio, garantindo transparência e confiabilidade em todo o processo.

Desenvolvido com **React 18** e **TypeScript**, seguindo princípios de **Clean Code** e padrões modernos de desenvolvimento frontend. Utiliza **custom hooks** para lógica de negócio, **Zustand** para gerenciamento de estado global, e **componentes reutilizáveis** com foco em acessibilidade e performance.

## 3. Arquitetura e Tecnologias

### Core
• **[React 18](https://react.dev/)** - Biblioteca para construção da interface com Concurrent Features  
• **[TypeScript](https://typescriptlang.org/)** - Tipagem estática para maior segurança e DX  
• **[Vite](https://vitejs.dev/)** - Build tool moderna com Hot Module Replacement  
• **[React Router](https://reactrouter.com/)** - Roteamento declarativo com lazy loading  

### Estado e Integração
• **[Zustand](https://github.com/pmndrs/zustand)** - Gerenciamento de estado global minimalista  
• **[Axios](https://axios-http.com/)** - Cliente HTTP com interceptors e retry logic  

### Interface e Estilo
• **[Tailwind CSS](https://tailwindcss.com/)** - Framework utilitário para estilização  
• **[Lucide React](https://lucide.dev/)** - Ícones SVG otimizados e consistentes  
• **[Shadcn UI](https://ui.shadcn.com/)** - Sistema de componentes baseado em Radix UI  
• **[Origin UI](https://originui.com/)** - Componentes adicionais e templates modernos  

### Qualidade e Desenvolvimento
• **[Biome](https://biomejs.dev/)** - Linter e formatter ultra-rápido  
• **[Ultracite](https://github.com/rcnald/ultracite)** - Regras de qualidade e boas práticas  
• **[Vitest](https://vitest.dev/)** - Framework de testes com Vite  

## 4. Setup e Desenvolvimento

**Pré-requisitos:** [Node.js 18+](https://nodejs.org/) e [Git](https://git-scm.com/) instalados no sistema.

### 1. Clone o repositório:
```bash
git clone https://github.com/rcnald/email-send-frontend.git
```

### 2. Acesse a pasta do projeto:
```bash
cd email-send-frontend
```

### 3. Instale as dependências:
```bash
npm install
# ou
yarn install
```

### 4. Configure o ambiente:
Crie um arquivo `.env` na raiz do projeto e configure as variáveis com base no `.env.example`:

```env
VITE_API_URL=http://localhost:3333
VITE_MAX_FILE_SIZE=104857600
VITE_ALLOWED_EXTENSIONS=.zip,.xml,.pdf
```

### 5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em: **http://localhost:5173**

## 5. Funcionalidades

### 5.1 Sistema de Upload Avançado
• **Drag & Drop**: Interface intuitiva para arrastar arquivos  
• **Progress Tracking**: Acompanhamento visual do progresso de upload  
• **Pause/Resume**: Controle total sobre uploads em andamento  
• **Validação**: Verificação de tipo, tamanho e integridade de arquivos  

### 5.2 Gerenciamento de Estado
• **Estado Global**: Zustand com persistência automática  
• **Cache Inteligente**: Otimização de requisições repetidas  
• **Sincronização**: Estado sincronizado entre componentes  
• **Rollback**: Reversão automática em caso de erro  

### 5.3 Experiência do Usuário
• **Stepper Navigation**: Guia visual do progresso do usuário  
• **Feedback em Tempo Real**: Notificações instantâneas de status  
• **Loading States**: Indicadores visuais durante operações  
• **Error Handling**: Tratamento elegante de erros com recovery  
• **Responsividade**: Adaptação automática para todos os dispositivos  

### 5.4 Acessibilidade
• **WCAG 2.1 AA**: Conformidade com padrões internacionais  
• **Screen Readers**: Suporte completo a leitores de tela  
• **Navegação por Teclado**: Acesso total via teclado  
• **Alto Contraste**: Suporte a temas de alto contraste  
• **Focus Management**: Gerenciamento inteligente de foco  

## 6. Estrutura do Projeto

```
src/
├── components/             # Componentes reutilizáveis
│   ├── layouts/           # Layouts da aplicação 
│   ├── ui/               # Componentes base
│   ├── icons/            # Ícones customizados (FileArchive)
├── hooks/                 # Custom hooks
├── lib/                  # Utilitários e configurações
├── pages/                # Páginas da aplicação
├── services/             # Serviços externos
├── store/                # Gerenciamento de estado
└── types/                # Definições TypeScript
```

### Arquitetura de Componentes

## 7 Variáveis de Ambiente

```env
# API Configuration
VITE_API_URL="http://localhost:3333"              # Backend API base URL

# Upload Configuration  
VITE_MAX_FILE_SIZE=104857600                      # 100MB em bytes
VITE_ALLOWED_EXTENSIONS=".zip,.xml,.pdf"         # Extensões permitidas
VITE_MAX_FILE_COUNT=5                            # Máximo de arquivos permitidos

# Environment
VITE_ENVIRONMENT="development"                    # development | production
```

### 7.2 Scripts de Desenvolvimento

#### Desenvolvimento
```bash
# Servidor de desenvolvimento com HMR
npm run dev
yarn dev

# Preview da build de produção
npm run preview  
yarn preview
```

#### Build e Deploy
```bash
# Build otimizada para produção
npm run build
yarn build
```

#### Qualidade de Código
```bash
# Linting com Biome
npm run lint
yarn lint
```

## 8. Deploy

### 8.1 Build de Produção

```bash
# Gerar build otimizada
yarn build
npm run build
```

### 8.2 Variáveis de Ambiente (Produção)

```env
VITE_API_URL=https://api.yourdomain.com
VITE_MAX_FILE_SIZE=104857600
VITE_ALLOWED_EXTENSIONS=.zip,.xml,.pdf
VITE_ENVIRONMENT=production
```
---

**Repositório Backend:** [email-send-backend](https://github.com/rcnald/email-send-backend)  
**Desenvolvido com ❤️ por [rcnald](https://github.com/rcnald)**
