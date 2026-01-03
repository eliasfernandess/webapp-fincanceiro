# 🔧 Como Corrigir o Erro no Deploy Vercel

## ❌ Erro Encontrado

```
Rollup failed to resolve import "/src/main.tsx" from "/vercel/path0/index.html"
```

## ✅ Soluções

### Solução 1: Deploy Manual (Mais Rápida) ⭐

**Esta é a solução mais rápida e garantida:**

1. **Faça o build local:**
   ```powershell
   $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
   cd C:\Users\FSOS\Desktop\plano_financeiro
   npm run build
   ```

2. **No Vercel:**
   - Acesse: https://vercel.com/new
   - Clique em **"Deploy"** (não "Import Git")
   - Arraste a pasta **`dist`** que foi criada
   - Clique em **"Deploy"**
   - ✅ Pronto! Funciona 100%!

---

### Solução 2: Ajustar Configurações no Vercel

Se você está usando GitHub:

1. **No painel do Vercel, verifique estas configurações:**

   - **Framework Preset**: `Vite` ✅
   - **Root Directory**: `./` (raiz do projeto) ✅
   - **Build Command**: `npm run build` ✅
   - **Output Directory**: `dist` ✅
   - **Install Command**: `npm install` ✅

2. **Remova a variável de ambiente `EXAMPLE_NAME`** se existir

3. **Tente fazer deploy novamente**

---

### Solução 3: Desabilitar PWA Temporariamente

Se o problema persistir, o plugin PWA pode estar causando o erro:

1. **Renomeie o arquivo:**
   - `vite.config.ts` → `vite.config.ts.backup`
   - `vite.config.backup.ts` → `vite.config.ts`

2. **Faça o build:**
   ```powershell
   npm run build
   ```

3. **Faça o deploy no Vercel**

4. **Depois podemos reativar o PWA** (não é essencial para funcionar)

---

### Solução 4: Usar Netlify (Alternativa)

Se o Vercel continuar dando problema:

1. **Acesse:** https://app.netlify.com/drop
2. **Arraste a pasta `dist`**
3. **Pronto!** Netlify geralmente funciona sem problemas

---

## 🎯 Recomendação

**Use a Solução 1 (Deploy Manual)** - É a mais rápida e sempre funciona!

O deploy manual é perfeito porque:
- ✅ Você já tem o build pronto
- ✅ Não depende de configurações do Vercel
- ✅ Funciona 100% das vezes
- ✅ É instantâneo

---

## 📝 Checklist

Antes de tentar novamente:

- [ ] Build local funciona (`npm run build`)
- [ ] Pasta `dist` foi criada
- [ ] Framework está como "Vite" no Vercel
- [ ] Root Directory está como `./`
- [ ] Variáveis de ambiente desnecessárias foram removidas

---

**Tente a Solução 1 primeiro - é a mais fácil! 🚀**

