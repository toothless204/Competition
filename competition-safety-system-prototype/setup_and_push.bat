@echo off
echo ============================================
echo  AI Industrial Safety System — Setup Script
echo ============================================
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Install Python 3.10+ from python.org
    pause
    exit /b 1
)

REM Check Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Install from nodejs.org
    pause
    exit /b 1
)

echo [1/5] Installing Python dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] pip install failed. Check Python/pip installation.
    pause
    exit /b 1
)

echo.
echo [2/5] Installing Node dependencies...
cd ..\frontend
npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)

echo.
echo [3/5] Generating sample data...
cd ..\sample_data
python generate_data.py
cd ..

echo.
echo [4/5] Git setup...
git init >nul 2>&1
git add .
git commit -m "feat: AI industrial safety system - YOLOv8 + Claude NLP + realistic data"
git branch -M main

echo.
echo [5/5] Pushing to GitHub...
echo IMPORTANT: Make sure you have already created the repo on GitHub:
echo   https://github.com/toothless204/safety-system-prototype
echo.
git remote remove origin >nul 2>&1
git remote add origin https://github.com/toothless204/safety-system-prototype.git
git push -u origin main

echo.
echo ============================================
echo  Setup complete!
echo.
echo  To start the system:
echo    Terminal 1: cd backend ^&^& uvicorn main:app --reload
echo    Terminal 2: cd frontend ^&^& npm start
echo.
echo  Then open: http://localhost:3000
echo ============================================
pause
