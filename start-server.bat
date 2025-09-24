@echo off
echo ============================================================
echo 🚀 STARTING CARDIOLOGY HOSPITAL BACKEND SERVER
echo ============================================================
echo.
echo 📁 Current Directory: %CD%
echo 📄 Looking for server.js...
if not exist "server.js" (
    echo ❌ ERROR: server.js not found in current directory
    echo 💡 Make sure you're in the CardiologyWebsite_backend folder
    echo 📁 Expected location: ...\CardiologyWebsite_backend\server.js
    pause
    exit /b 1
)
echo ✅ Found server.js
echo.
echo 🔌 Starting server...
echo ============================================================
node server.js
