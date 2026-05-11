# Aqar Platform - Startup Script
# This script starts both backend and frontend servers

Write-Host "🚀 Starting Aqar Platform..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Start Backend
Write-Host ""
Write-Host "📦 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\Khaled\Desktop\Aqar project\aqar\server'; Write-Host '🔧 Backend Server' -ForegroundColor Green; npm run dev"

# Wait a bit for backend to start
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Start Frontend
Write-Host ""
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\Khaled\Desktop\Aqar project\aqar\client'; Write-Host '🎨 Frontend Server' -ForegroundColor Cyan; npm run dev"

# Wait for frontend to start
Write-Host "⏳ Waiting for frontend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 8

# Open browser
Write-Host ""
Write-Host "🌐 Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✅ Aqar Platform Started Successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend:  http://localhost:5000/api" -ForegroundColor White
Write-Host "📍 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "💡 Two PowerShell windows opened:" -ForegroundColor Cyan
Write-Host "   - Backend Server (port 5000)" -ForegroundColor Gray
Write-Host "   - Frontend Server (port 5173)" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  Keep both windows open while using the platform" -ForegroundColor Yellow
Write-Host "🛑 Press Ctrl+C in each window to stop the servers" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
