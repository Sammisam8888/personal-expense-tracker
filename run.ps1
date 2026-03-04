$ErrorActionPreference = "Stop"

try {
    Write-Host "Starting Backend Server..." -ForegroundColor Green
    Push-Location backend
    
    # Check if inside a virtual environment for Windows, create if missing
    if (-Not (Test-Path "venv")) {
        Write-Host "Creating virtual environment and installing backend dependencies..." -ForegroundColor Yellow
        python -m venv venv
        . .\venv\Scripts\activate.ps1
        pip install fastapi "uvicorn[standard]" pydantic "pydantic[email]" motor beanie "passlib[bcrypt]" "bcrypt<4.0.0" pyjwt python-multipart
    } else {
        . .\venv\Scripts\activate.ps1
    }
    
    $backendProcess = Start-Process -FilePath "uvicorn" -ArgumentList "main:app", "--reload", "--port", "8000" -PassThru -NoNewWindow
    Pop-Location

    Write-Host "Starting Frontend Server..." -ForegroundColor Green
    Push-Location frontend
    
    if (-Not (Test-Path "node_modules")) {
        Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
        npm install
    }
    
    # Use npm.cmd on Windows
    $frontendProcess = Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev" -PassThru -NoNewWindow
    Pop-Location

    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host " Personal Expense & Income Tracker is running!" -ForegroundColor Yellow
    Write-Host "- **Frontend App**: ``http://localhost:5173``"
    Write-Host "- **Backend API Docs**: ``http://localhost:8000/docs``"
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop all servers."
    Write-Host ""

    # Keep script running to allow processes to execute in background
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    Write-Host "`nStopping servers..." -ForegroundColor Red
    if ($backendProcess) {
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue 
    }
    if ($frontendProcess) {
        Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue 
    }
}
