$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Resetting development ports..." -ForegroundColor Cyan
& "$PSScriptRoot\dev-stop.ps1"

if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Write-Host "Starting Dental Clinic development environment..." -ForegroundColor Green
npm run dev
