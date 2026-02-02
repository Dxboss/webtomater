@echo off
echo Running build verification...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ---------------------------------------------------
    echo Build failed! 
    echo.
    echo NOTE: If this is just a Google Font connection error (EAI_AGAIN), 
    echo it is safe to ignore as Vercel will handle it.
    echo ---------------------------------------------------
    
    set /p ignore="Do you want to force ship anyway? (y/n): "
    if /i not "%ignore%"=="y" (
        echo Shipping aborted.
        exit /b %errorlevel%
    )
)

echo.
echo Shipping updates...
git add .
set /p msg="Enter commit message (default: 'Update'): "
if "%msg%"=="" set msg="Update"
git commit -m "%msg%"
git push origin main
echo Done!
