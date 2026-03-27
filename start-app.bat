@echo off
echo ============================================
echo MySwooop Activity Tracker - Quick Start
echo ============================================
echo.
echo This script will start both backend and frontend
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Using Vite for fast development!
echo.
echo Starting backend in new window...
start cmd /k "cd /d e:\myswoooptrack\backend && npm install && npm start"

timeout /t 3

echo Starting frontend in new window...
start cmd /k "cd /d e:\myswoooptrack\frontend && npm install && npm start"

echo.
echo Servers starting...
echo Wait a moment for both to fully load, then:
echo.
echo 1. Frontend will open automatically at http://localhost:3000
echo 2. Login with: admin / admin123
echo 3. Backend API at: http://localhost:5000
echo.
echo You are using Vite - much faster development!
echo.
pause
