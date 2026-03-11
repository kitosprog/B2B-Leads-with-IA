@echo off
echo Setting up Company Scraper SaaS...
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo Node.js detected
echo.

echo Installing dependencies...
echo.

cd backend
echo Installing backend dependencies...
call npm install
cd ..

cd frontend
echo Installing frontend dependencies...
call npm install
cd ..

echo.
echo Setting up environment variables...
echo.

if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo Created backend\.env
)

if not exist frontend\.env (
    copy frontend\.env.example frontend\.env
    echo Created frontend\.env
)

echo.
echo Database setup:
echo Run the following commands to set up your database:
echo   createdb company_scraper
echo   psql -U postgres -d company_scraper -f database/schema.sql
echo.

echo Setup complete!
echo.
echo To start the development servers:
echo   npm run dev
echo.

pause
