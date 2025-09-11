@echo off
echo 🔄 Verific portul 5000...

FOR /F "tokens=5" %%a IN ('netstat -ano ^| findstr :5000') DO taskkill /PID %%a /F >nul 2>&1

echo ✅ Port 5000 este liber acum.
echo 🚀 Pornesc aplicatia ImobiliaMarket...

:: Deschide backend-ul intr-o fereastra noua
start cmd /k "cd backend && npm run dev"

:: Deschide frontend-ul intr-o alta fereastra noua
start cmd /k "cd frontend && npm run dev"

echo ✅ Totul a fost pornit!
