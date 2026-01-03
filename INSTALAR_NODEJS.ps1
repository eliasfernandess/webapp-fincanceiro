# Script de Instalação do Node.js para Windows
# Execute este script como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instalador do Node.js para Windows" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se já está instalado
try {
    $nodeVersion = node --version 2>$null
    $npmVersion = npm --version 2>$null
    
    if ($nodeVersion -and $npmVersion) {
        Write-Host "✅ Node.js já está instalado!" -ForegroundColor Green
        Write-Host "   Node.js: $nodeVersion" -ForegroundColor Green
        Write-Host "   npm: $npmVersion" -ForegroundColor Green
        Write-Host ""
        Write-Host "Você pode prosseguir com: npm install" -ForegroundColor Yellow
        exit 0
    }
} catch {
    Write-Host "Node.js não encontrado. Prosseguindo com instruções..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Node.js não está instalado no seu sistema." -ForegroundColor Yellow
Write-Host ""
Write-Host "Para instalar o Node.js, você tem 3 opções:" -ForegroundColor White
Write-Host ""
Write-Host "OPÇÃO 1 - Site Oficial (Recomendado):" -ForegroundColor Cyan
Write-Host "  1. Acesse: https://nodejs.org/" -ForegroundColor White
Write-Host "  2. Baixe a versão LTS para Windows" -ForegroundColor White
Write-Host "  3. Execute o instalador .msi" -ForegroundColor White
Write-Host "  4. Reinicie o terminal após instalar" -ForegroundColor White
Write-Host ""
Write-Host "OPÇÃO 2 - Via Winget (Windows 11/10):" -ForegroundColor Cyan
Write-Host "  Execute: winget install OpenJS.NodeJS.LTS" -ForegroundColor White
Write-Host ""
Write-Host "OPÇÃO 3 - Via Chocolatey:" -ForegroundColor Cyan
Write-Host "  Execute: choco install nodejs-lts" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Após instalar, REINICIE o terminal e execute:" -ForegroundColor Yellow
Write-Host "  npm install" -ForegroundColor Green
Write-Host ""

# Tentar abrir o site do Node.js
$response = Read-Host "Deseja abrir o site do Node.js agora? (S/N)"
if ($response -eq "S" -or $response -eq "s") {
    Start-Process "https://nodejs.org/"
}

