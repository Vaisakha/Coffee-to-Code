@echo off
title SynapseCollab Local Server
echo Starting SynapseCollab on http://localhost:3000...
start http://localhost:3000/
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 3000
pause
