@echo off
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing dependencies. Make sure Node.js is installed.
    pause
    exit /b 1
)

echo.
echo Starting development server...
echo The website will open automatically in your browser.
echo Press Ctrl+C to stop the server.
echo.
call npm run dev
