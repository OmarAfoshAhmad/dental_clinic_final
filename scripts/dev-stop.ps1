param(
  [int[]]$Ports = @(3000, 3001)
)

$ErrorActionPreference = 'SilentlyContinue'

foreach ($port in $Ports) {
  $connections = Get-NetTCPConnection -LocalPort $port -State Listen

  foreach ($connection in $connections) {
    $pidToStop = $connection.OwningProcess

    if ($pidToStop -and $pidToStop -ne $PID) {
      $process = Get-Process -Id $pidToStop

      if ($process) {
        Write-Host "Stopping process $($process.ProcessName) (PID $pidToStop) on port $port..." -ForegroundColor Yellow
        Stop-Process -Id $pidToStop -Force
      }
    }
  }
}

Start-Sleep -Milliseconds 500

$remaining = @()
foreach ($port in $Ports) {
  if (Get-NetTCPConnection -LocalPort $port -State Listen) {
    $remaining += $port
  }
}

if ($remaining.Count -gt 0) {
  Write-Host "Could not free ports: $($remaining -join ', ')" -ForegroundColor Red
  exit 1
}

Write-Host "Development ports are free." -ForegroundColor Green
