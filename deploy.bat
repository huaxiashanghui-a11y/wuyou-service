@echo off
REM ============================================
REM 无忧服务 - 一键部署脚本
REM ============================================

echo.
echo ============================================
echo  无忧服务 - 一键部署到 Vercel
echo ============================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js 已安装
node --version

REM 安装 Vercel CLI (如果未安装)
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo 正在安装 Vercel CLI...
    npm install -g vercel
)

echo.
echo [OK] Vercel CLI 已安装
vercel --version

echo.
echo ============================================
echo  开始部署到 Vercel...
echo ============================================
echo.

REM 部署到生产环境
vercel --prod --yes

echo.
echo ============================================
echo  部署完成！
echo ============================================
echo.
echo 请访问以下网址：
echo   前台: https://wuyou-service.vercel.app
echo   后台: https://wuyou-service.vercel.app/admin/login
echo.
echo 登录账号:
echo   管理员: admin / admin123
echo   超级管理员: superadmin / super123
echo.

pause
