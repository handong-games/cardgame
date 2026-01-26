# Game Design Manager 시작 스크립트
# 사용법: .\tools\start-gamedesign.ps1

$ErrorActionPreference = "Stop"

Write-Host "Game Design Manager를 시작합니다..." -ForegroundColor Green

# gamedesign 디렉토리로 이동
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$gamedesignDir = Join-Path $scriptDir "gamedesign"

if (-not (Test-Path $gamedesignDir)) {
    Write-Host "오류: gamedesign 디렉토리를 찾을 수 없습니다." -ForegroundColor Red
    exit 1
}

Set-Location $gamedesignDir

# node_modules 확인
if (-not (Test-Path "node_modules")) {
    Write-Host "의존성을 설치합니다..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "서버를 시작합니다..." -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend:  http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "종료하려면 Ctrl+C를 누르세요." -ForegroundColor Gray
Write-Host ""

# 개발 서버 시작
npm run dev
