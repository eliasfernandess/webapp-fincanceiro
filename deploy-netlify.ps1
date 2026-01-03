# Script para fazer deploy no Netlify
# Execute este script para fazer deploy automático

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploy no Netlify - Plano Financeiro" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Atualizar PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verificar se está na pasta correta
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host "📁 Diretório: $projectPath" -ForegroundColor Cyan
Write-Host ""

# Verificar se Netlify CLI está instalado
try {
    $netlifyVersion = netlify --version 2>$null
    Write-Host "✅ Netlify CLI encontrado: $netlifyVersion" -ForegroundColor Green
} catch {
    Write-Host "📦 Instalando Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
    Write-Host ""
}

# Fazer build primeiro
Write-Host "🔨 Fazendo build do projeto..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build! Corrija os erros antes de fazer deploy." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
Write-Host ""

# Fazer deploy
Write-Host "🚀 Iniciando deploy no Netlify..." -ForegroundColor Green
Write-Host ""
Write-Host "   Você precisará fazer login na primeira vez." -ForegroundColor Yellow
Write-Host "   Siga as instruções na tela." -ForegroundColor Yellow
Write-Host ""

netlify deploy --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Seu site está online! 🎉" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Erro no deploy. Verifique as mensagens acima." -ForegroundColor Red
}

