@echo off
echo Running build verification...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ---------------------------------------------------
    echo Build failed! Fix errors before shipping.
    echo ---------------------------------------------------
    exit /b %errorlevel%
)

echo.
echo Build passed. Shipping updates...
git add .
set /p msg="Enter commit message (default: 'Update'): "
if "%msg%"=="" set msg="Update"
git commit -m "%msg%"
git push origin main
echo Done!
