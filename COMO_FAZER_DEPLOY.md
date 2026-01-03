# 🚀 Como Fazer Deploy - Passo a Passo Simples

## ✅ Build já está pronto!

A pasta `dist` foi criada com sucesso e está pronta para deploy!

---

## 🌟 Método Mais Fácil: Vercel (Recomendado)

### Passo 1: Acesse o Vercel
👉 https://vercel.com/new

### Passo 2: Faça Login
- Use sua conta Google, GitHub ou crie uma conta gratuita

### Passo 3: Deploy Manual
1. Na página do Vercel, você verá a opção **"Deploy"**
2. Clique em **"Browse"** ou **"Select Folder"**
3. Navegue até a pasta: `C:\Users\FSOS\Desktop\plano_financeiro\dist`
4. Selecione a pasta `dist`
5. Clique em **"Deploy"**

### Passo 4: Aguarde
- O deploy leva cerca de 1-2 minutos
- Você verá o progresso na tela

### Passo 5: Pronto! 🎉
- Você receberá um link tipo: `plano-financeiro-xxxxx.vercel.app`
- Seu site está online e funcionando!

---

## 🌐 Método Alternativo: Netlify

### Passo 1: Acesse o Netlify
👉 https://app.netlify.com/drop

### Passo 2: Arraste a Pasta
1. Abra o Explorador de Arquivos
2. Navegue até: `C:\Users\FSOS\Desktop\plano_financeiro\dist`
3. **Arraste a pasta `dist`** para a área de deploy do Netlify

### Passo 3: Aguarde
- O deploy é instantâneo (alguns segundos)

### Passo 4: Pronto! 🎉
- Você receberá um link tipo: `xxxxx.netlify.app`

---

## 💻 Método via Script (Automático)

### Para Vercel:
1. Clique com botão direito em `deploy-vercel.ps1`
2. Selecione "Executar com PowerShell"
3. Siga as instruções na tela

### Para Netlify:
1. Clique com botão direito em `deploy-netlify.ps1`
2. Selecione "Executar com PowerShell"
3. Siga as instruções na tela

---

## 📝 Resumo Rápido

1. ✅ Build já está feito (pasta `dist` pronta)
2. 🌐 Escolha uma plataforma (Vercel ou Netlify)
3. 📤 Faça upload da pasta `dist`
4. 🎉 Seu site está online!

---

## 🔄 Atualizar o Site

Sempre que fizer alterações:

1. **Faça o build novamente:**
   ```powershell
   $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
   cd C:\Users\FSOS\Desktop\plano_financeiro
   npm run build
   ```

2. **Faça upload da nova pasta `dist`** na plataforma escolhida

---

## 💡 Dica Pro

Se você usar **GitHub**:
- Crie um repositório no GitHub
- Faça push do código
- Conecte o repositório na Vercel/Netlify
- Cada push novo faz deploy automático!

---

**Pronto para fazer deploy! Escolha o método que preferir! 🚀**

