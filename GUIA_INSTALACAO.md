# 📦 Guia de Instalação - Plano Financeiro

## ⚠️ Pré-requisito: Instalar Node.js

O Node.js não está instalado no seu sistema. Siga os passos abaixo para instalar:

### Opção 1: Instalação via Site Oficial (Recomendado)

1. **Acesse o site oficial do Node.js:**
   - Vá para: https://nodejs.org/
   - Ou diretamente: https://nodejs.org/pt-br/download/

2. **Baixe a versão LTS (Long Term Support):**
   - Clique em "Baixar para Windows (x64)" - versão LTS
   - A versão LTS é mais estável e recomendada

3. **Execute o instalador:**
   - Execute o arquivo `.msi` baixado
   - Siga o assistente de instalação
   - **IMPORTANTE**: Marque a opção "Automatically install the necessary tools" se aparecer
   - Clique em "Next" até finalizar

4. **Reinicie o PowerShell/Terminal:**
   - Feche e abra novamente o PowerShell ou CMD
   - Isso é necessário para carregar as variáveis de ambiente

5. **Verifique a instalação:**
   ```powershell
   node --version
   npm --version
   ```
   - Deve mostrar as versões instaladas (ex: v20.x.x e 10.x.x)

### Opção 2: Instalação via Winget (Windows 11/10)

Se você tem Windows 11 ou Windows 10 com Winget instalado:

```powershell
winget install OpenJS.NodeJS.LTS
```

Depois reinicie o terminal e verifique:
```powershell
node --version
npm --version
```

### Opção 3: Instalação via Chocolatey

Se você tem Chocolatey instalado:

```powershell
choco install nodejs-lts
```

---

## 🚀 Após Instalar o Node.js

### 1. Instalar as Dependências do Projeto

No terminal, dentro da pasta do projeto, execute:

```powershell
npm install
```

Isso vai instalar todas as dependências necessárias (React, TypeScript, Tailwind, etc.)

### 2. Iniciar o Servidor de Desenvolvimento

```powershell
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

### 3. Abrir no Navegador

Abra seu navegador e acesse: `http://localhost:5173`

---

## 📝 Comandos Disponíveis

Após instalar as dependências, você pode usar:

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Verifica erros no código

---

## ❓ Problemas Comuns

### "npm não é reconhecido" mesmo após instalar

1. **Reinicie o terminal** completamente (feche e abra novamente)
2. **Verifique se o Node.js está no PATH:**
   - Pressione `Win + R`
   - Digite `sysdm.cpl` e pressione Enter
   - Vá em "Avançado" > "Variáveis de Ambiente"
   - Verifique se `C:\Program Files\nodejs\` está em "Path"
   - Se não estiver, adicione manualmente

3. **Reinicie o computador** (último recurso)

### Erro de permissão no Windows

Execute o PowerShell como Administrador:
- Clique com botão direito no PowerShell
- Selecione "Executar como administrador"
- Execute `npm install` novamente

---

## ✅ Verificação Final

Após instalar tudo, execute estes comandos para verificar:

```powershell
node --version    # Deve mostrar: v20.x.x ou similar
npm --version     # Deve mostrar: 10.x.x ou similar
npm install       # Deve instalar todas as dependências sem erros
npm run dev       # Deve iniciar o servidor na porta 5173
```

---

## 🎉 Pronto!

Depois de seguir estes passos, sua aplicação estará rodando e pronta para uso!

Se tiver algum problema, verifique:
- Node.js está instalado corretamente
- Terminal foi reiniciado após instalação
- Está na pasta correta do projeto (`plano_financeiro`)

