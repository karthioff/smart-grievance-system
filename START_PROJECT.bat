@echo off
title Grievance System - Launcher
color 0E
echo.
echo ========================================================
echo        SMART PUBLIC GRIEVANCE ESCALATION SYSTEM
echo ========================================================
echo.
echo Starting both servers...
echo.
echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd backend-node && npm start"
timeout /t 3 /nobreak >nul
echo.
echo [2/2] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"
echo.
echo ========================================================
echo   SERVERS STARTING...
echo ========================================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Admin Login: http://localhost:3000/admin/login
echo   Email: admin@grievance.com
echo   Password: admin123
echo.
echo ========================================================
echo.
echo Press any key to exit this window...
echo (Keep the other 2 windows open!)
echo.
pause >nul
