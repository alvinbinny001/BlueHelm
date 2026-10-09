param(
    [switch]$Login
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendRoot = Join-Path $projectRoot "backend"
$pythonPath = Join-Path $projectRoot ".venv\Scripts\python.exe"
$port = 8000
$url = "http://localhost:$port"
$startUrl = if ($Login) { "$url/login" } else { $url }

if (-not (Test-Path $pythonPath)) {
    Write-Host "Virtual environment not found. Creating .venv and installing dependencies..." -ForegroundColor Cyan
    try {
        python -m venv (Join-Path $projectRoot ".venv")
        if (Test-Path $pythonPath) {
            Write-Host "Installing requirements..." -ForegroundColor Cyan
            & $pythonPath -m pip install --upgrade pip
            & $pythonPath -m pip install -r (Join-Path $backendRoot "requirements.txt")
        }
    } catch {
        Write-Warning "Auto-setup failed: $_"
    }
    if (-not (Test-Path $pythonPath)) {
        throw "Project virtual environment not found at $pythonPath. Please run: python -m venv .venv && .venv\Scripts\pip install -r backend\requirements.txt"
    }
}

$existingServer = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($existingServer) {
    Write-Host "NEURONEX is already running at $url" -ForegroundColor Yellow
    Start-Process $startUrl
    exit 0
}

if (-not (Test-Path (Join-Path $backendRoot "main.py"))) {
    throw "Backend entrypoint not found at $backendRoot\main.py"
}

Start-Process $startUrl
Write-Host "Starting NEURONEX at $startUrl" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Gray

Push-Location $backendRoot
try {
    & $pythonPath -m uvicorn main:app --host 0.0.0.0 --port $port --reload
}
finally {
    Pop-Location
}
