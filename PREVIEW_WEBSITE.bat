@echo off
setlocal

set PORT=8080

echo ======================================================
echo          BHOPAL DANCE HOUSE - SITE PREVIEW
echo ======================================================
echo.
echo  Starting local preview server...
echo  Please keep this window open while viewing the site.
echo.

for /f %%P in ('powershell -NoProfile -Command "$p=8080; while (Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue) { $p++ }; Write-Output $p"') do set PORT=%%P

start "" "http://localhost:%PORT%/"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port %PORT%

pause
