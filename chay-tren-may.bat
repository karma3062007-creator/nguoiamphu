@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Dang ghep trang...
node build.js || goto :eof
echo.
echo Mo may chu o cong 8080...
start "Am Phu Online - may chu" cmd /k node server.js
timeout /t 2 >nul
echo.
echo Mo link cong khai qua Cloudflare (link co dang https://....trycloudflare.com).
echo Gui link do cho ban be. Dong cua so nay la link tat.
cloudflared tunnel --url http://localhost:8080
