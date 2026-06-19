@echo off
cd /d "%~dp0"

:: Detect Python (la version la plus recente disponible)
set PY=python
py -3.13 -c "exit()" >nul 2>&1
if not errorlevel 1 (
    set PY=py -3.13
    goto :found
)
py -3 -c "exit()" >nul 2>&1
if not errorlevel 1 (
    set PY=py -3
    goto :found
)
python -c "exit()" >nul 2>&1
if not errorlevel 1 goto :found
echo Python introuvable. Installe Python 3.10+ depuis https://python.org
pause
exit /b 1

:found
if not exist ".venv\Scripts\python.exe" (
    echo [1/2] Creation du venv...
    %PY% -m venv .venv
    if errorlevel 1 (
        echo Erreur lors de la creation du venv.
        pause
        exit /b 1
    )
)

echo [2/2] Installation des dependances...
.venv\Scripts\python.exe -m pip install --upgrade -r requirements.txt
if errorlevel 1 (
    echo.
    echo Erreur lors de l'installation des dependances.
    pause
    exit /b 1
)

echo.
echo MarkItDown demarre sur http://127.0.0.1:8000
echo.
.venv\Scripts\python.exe -m uvicorn app.server:app --host 127.0.0.1 --port 8000

echo.
echo Le serveur s'est arrete.
pause
