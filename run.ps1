# Claude Code 실행 스크립트 (Windows PowerShell)

$projectPath = "C:\Users\reg24\Favorites\claude\cardgame"
$logFile = "$env:USERPROFILE\claude.log"

Set-Location $projectPath

Write-Host "Claude Code 실행 중..."
Write-Host "Project: $projectPath"
Write-Host "Log: $logFile"

claude code *>&1 | Tee-Object -FilePath $logFile
