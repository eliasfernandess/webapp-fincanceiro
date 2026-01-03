# 💰 Plano Financeiro

Uma aplicação completa e moderna para gerenciamento de planejamento financeiro pessoal, com foco em contas a pagar e receber, incluindo sistema de notificações inteligente.

## ✨ Funcionalidades

### 📊 Dashboard Completo
- **Resumo Financeiro**: Visualização rápida de saldo, despesas, receitas e contas vencidas
- **Gráficos Interativos**: 
  - Evolução mensal de receitas e despesas
  - Comparativo mensal em barras
  - Análise por categorias
- **Próximos Vencimentos**: Lista de contas que vencem nos próximos 7 dias

### 💸 Contas a Pagar
- CRUD completo (Criar, Ler, Atualizar, Excluir)
- Filtros por status (Pendente, Pago, Vencida)
- Filtros por categoria
- Busca por descrição
- Resumo de valores pendentes e pagos
- Marcação rápida de pagamento

### 💵 Contas a Receber
- CRUD completo
- Filtros por status (Pendente, Recebido, Vencida)
- Filtros por categoria
- Busca por descrição
- Resumo de valores pendentes e recebidos
- Marcação rápida de recebimento

### 🏷️ Sistema de Categorias
- Categorias personalizadas para despesas e receitas
- Cores e ícones customizáveis
- Categorias pré-configuradas incluídas

### 🔔 Sistema de Notificações Inteligente
- **Notificação 3 dias antes** do vencimento
- **Notificação no dia** do vencimento
- **Notificação de contas vencidas** com contagem de dias
- Notificações não lidas destacadas
- Histórico completo de notificações

### ⚙️ Configurações
- **Tema Claro/Escuro**: Alternância entre modos
- **Exportação de Dados**: Backup em JSON
- **Importação de Dados**: Restauração de backup
- Gerenciamento de notificações
- Limpeza de dados (com confirmação)

### 📱 Design Responsivo
- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptativo
- **Mobile**: Menu hambúrguer e interface otimizada
- **PWA**: Funciona offline e pode ser instalado como app

## 🚀 Como Usar

### Instalação

1. Clone o repositório ou extraia os arquivos
2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse `http://localhost:5173` no seu navegador

### Build para Produção

```bash
npm run build
```

Os arquivos estarão na pasta `dist/`

### Preview da Build

```bash
npm run preview
```

## 📦 Tecnologias Utilizadas

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Estilização utilitária
- **React Router** - Roteamento
- **Recharts** - Gráficos e visualizações
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones modernos
- **LocalStorage** - Persistência de dados local

## 🎨 Recursos de Design

- Interface moderna e limpa
- Tema escuro/claro com transições suaves
- Cores semânticas (verde para receitas, vermelho para despesas)
- Cards com hover effects
- Animações suaves
- Design system consistente

## 💾 Armazenamento de Dados

Todos os dados são armazenados localmente no navegador usando **LocalStorage**. Isso significa:
- ✅ Dados privados (não enviados para servidor)
- ✅ Funciona offline
- ✅ Rápido e responsivo
- ⚠️ Dados são específicos do navegador/dispositivo
- ⚠️ Limpar cache do navegador apaga os dados

**Recomendação**: Faça backups regulares usando a função de exportação!

## 🔒 Privacidade

Esta aplicação é 100% local. Nenhum dado é enviado para servidores externos. Tudo funciona no seu navegador.

## 📝 Estrutura do Projeto

```
plano_financeiro/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── context/         # Context API para estado global
│   ├── pages/           # Páginas da aplicação
│   ├── types/           # Definições TypeScript
│   ├── utils/           # Funções utilitárias
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Entry point
├── public/              # Arquivos estáticos
├── index.html           # HTML principal
└── package.json         # Dependências
```

## 🎯 Funcionalidades Extras Implementadas

1. **Filtros Avançados**: Por status, categoria e busca textual
2. **Estatísticas em Tempo Real**: Cálculos automáticos de totais
3. **Validação de Formulários**: Campos obrigatórios e validação
4. **Confirmações de Ações**: Para exclusões e ações destrutivas
5. **Formatação Brasileira**: Moeda (R$) e datas (DD/MM/YYYY)
6. **Indicadores Visuais**: Cores para status, badges, ícones
7. **Responsividade Total**: Funciona em qualquer tamanho de tela
8. **Acessibilidade**: Contraste adequado, labels descritivos

## 🔮 Melhorias Futuras Sugeridas

- [ ] Sincronização em nuvem (opcional)
- [ ] Relatórios em PDF
- [ ] Metas e orçamentos
- [ ] Lembretes por email/SMS
- [ ] Múltiplas contas/carteiras
- [ ] Anexos de comprovantes
- [ ] Recorrência automática de contas
- [ ] Análise de tendências com IA

## 📄 Licença

Este projeto é de código aberto e está disponível para uso pessoal e comercial.

## 👨‍💻 Desenvolvido com ❤️

Aplicação criada para facilitar o controle financeiro pessoal de forma simples, completa e bonita.

---

**Versão**: 1.0.0  
**Última atualização**: 2024

