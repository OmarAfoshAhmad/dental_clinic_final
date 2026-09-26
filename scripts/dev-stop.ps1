param(
  [int[]]$Ports = @(3000, 3001)
)

function Get-ListeningConnections {
  param([int]$Port)

  return @(
    Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  )
}

foreach ($port in $Ports) {
  $connections = Get-ListeningConnections -Port $port

  if ($connections.Count -eq 0) {
    Write-Host "Port $port is already free." -ForegroundColor DarkGray
    continue
  }

  foreach ($connection in $connections) {
    $pidToStop = $connection.OwningProcess

    if (-not $pidToStop -or $pidToStop -eq $PID) {
      continue
    }

    $process = Get-Process -Id $pidToStop -ErrorAction SilentlyContinue

    if ($process) {
      Write-Host "Stopping process $($process.ProcessName) (PID $pidToStop) on port $port..." -ForegroundColor Yellow
      Stop-Process -Id $pidToStop -Force -ErrorAction SilentlyContinue
    }
  }
}

Start-Sleep -Milliseconds 500

$remaining = @()

foreach ($port in $Ports) {
  $connections = Get-ListeningConnections -Port $port

  if ($connections.Count -gt 0) {
    $remaining += $port
  }
}

if ($remaining.Count -gt 0) {
  Write-Host "Could not free ports: $($remaining -join ', ')" -ForegroundColor Red
  exit 1
}

Write-Host "Development ports are free." -ForegroundColor Green
exit 0
