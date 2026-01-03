# 🚀 Instruções Rápidas - Plano Financeiro

## ⚡ Iniciar a Aplicação (Método Mais Fácil)

### Opção 1: Usar o Script Automático (Recomendado)

1. **Clique com botão direito** no arquivo `iniciar.ps1`
2. Selecione **"Executar com PowerShell"**
3. Aguarde o servidor iniciar
4. Acesse: `http://localhost:5173`

### Opção 2: Manualmente no Terminal

1. Abra o PowerShell na pasta do projeto
2. Execute este comando para atualizar o PATH:
   ```powershell
   $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
   ```
3. Execute:
   ```powershell
   npm run dev
   ```
4. Acesse: `http://localhost:5173`

---

## ⚠️ Problema: "npm não é reconhecido"

Se você abrir um **novo terminal** e o npm não funcionar, é porque o PATH precisa ser atualizado naquela sessão.

### Solução Rápida:

Execute este comando **antes** de usar npm:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### Solução Permanente:

1. **Reinicie o computador** (após instalar o Node.js)
   - Isso atualiza o PATH permanentemente em todas as sessões

2. **OU** adicione manualmente ao PATH:
   - Pressione `Win + R`
   - Digite: `sysdm.cpl`
   - Vá em "Avançado" > "Variáveis de Ambiente"
   - Em "Variáveis do sistema", encontre "Path"
   - Adicione: `C:\Program Files\nodejs\`
   - Clique em OK e reinicie o terminal

---

## 📝 Comandos Úteis

```powershell
# Atualizar PATH (execute sempre em novo terminal)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Iniciar servidor
npm run dev

# Criar versão de produção
npm run build

# Ver versões instaladas
node --version
npm --version
```

---

## 🎯 Dica Pro

Crie um **atalho** no desktop para o arquivo `iniciar.ps1` para iniciar a aplicação com um duplo clique!

---

## ❓ Ainda com Problemas?

1. **Verifique se Node.js está instalado:**
   ```powershell
   node --version
   ```
   Se não funcionar, reinstale o Node.js.

2. **Reinicie o computador** após instalar o Node.js

3. **Use o script `iniciar.ps1`** - ele faz tudo automaticamente!

