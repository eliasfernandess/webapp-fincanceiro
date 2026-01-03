# Script para iniciar o servidor de desenvolvimento
# Execute este script sempre que quiser iniciar a aplicação

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Plano Financeiro" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Atualizar PATH para incluir Node.js
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version 2>$null
    $npmVersion = npm --version 2>$null
    
    if ($nodeVersion -and $npmVersion) {
        Write-Host "✅ Node.js encontrado!" -ForegroundColor Green
        Write-Host "   Node.js: $nodeVersion" -ForegroundColor Gray
        Write-Host "   npm: $npmVersion" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
        Write-Host "   Por favor, instale o Node.js primeiro." -ForegroundColor Yellow
        Write-Host "   Acesse: https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Erro ao verificar Node.js" -ForegroundColor Red
    Write-Host "   Por favor, instale o Node.js primeiro." -ForegroundColor Yellow
    exit 1
}

# Navegar para o diretório do projeto
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host "📁 Diretório: $projectPath" -ForegroundColor Cyan
Write-Host ""

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Iniciar servidor de desenvolvimento
Write-Host "🚀 Iniciando servidor de desenvolvimento..." -ForegroundColor Green
Write-Host ""
Write-Host "   A aplicação estará disponível em:" -ForegroundColor Cyan
Write-Host "   http://localhost:5173" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""
Write-Host "   Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

npm run dev

