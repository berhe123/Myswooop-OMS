# NPM Setup Guide - Vite Configuration

## 📦 NPM Configuration Explained

### What is NPM?
NPM (Node Package Manager) manages all your JavaScript dependencies. It's controlled by the `package.json` file.

---

## 🔧 Your Current Setup

### Frontend package.json (Vite)

```json
{
  "name": "myswooop-frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.0"
  },
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### What Each Part Means:

**`"name"`** - Project name
**`"version"`** - Version number

**`"type": "module"`** - Tells Node.js to use ES6 import/export syntax

**`"dependencies"`** - Packages your app needs to run:
- `react` - UI library
- `react-dom` - React rendering
- `react-router-dom` - Navigation
- `axios` - HTTP requests

**`"devDependencies"`** - Packages only needed for development:
- `vite` - Build tool (fast development server)
- `@vitejs/plugin-react` - React support for Vite

**`"scripts"`** - Commands you can run:
- `npm run dev` - Start development server (fast)
- `npm start` - Same as dev (alias)
- `npm run build` - Create optimized production build
- `npm run preview` - Preview production build

---

## 🚀 How to Install and Run

### Step 1: Install Dependencies
```powershell
cd e:\myswoooptrack\frontend
npm install
```

This command:
- Reads package.json
- Downloads all packages listed
- Creates `node_modules` folder (~300 MB)
- Creates `package-lock.json` (locks versions)

### Step 2: Run Development Server
```powershell
npm start
```
or
```powershell
npm run dev
```

This:
- Starts Vite development server on port 3000
- Opens browser automatically
- Hot-reloads when you save files (instant changes!)
- Much faster than react-scripts

### Step 3: Build for Production
```powershell
npm run build
```

This:
- Creates optimized production build
- Outputs to `dist` folder
- Ready to deploy to a server

---

## 🔄 Backend Setup (No Changes)

### Backend package.json stays the same:

```json
{
  "name": "myswooop-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

### Install & Run Backend:
```powershell
cd e:\myswoooptrack\backend
npm install
npm start
```

---

## 📋 Complete Setup Commands

### First Time Setup (Do Once)

```powershell
# Backend
cd e:\myswoooptrack\backend
npm install

# Frontend (in new terminal)
cd e:\myswoooptrack\frontend
npm install
```

### Every Time You Want to Run

```powershell
# Terminal 1 - Backend
cd e:\myswoooptrack\backend
npm start

# Terminal 2 - Frontend
cd e:\myswoooptrack\frontend
npm start
```

---

## 🎯 Vite vs React-Scripts Comparison

| Feature | React-Scripts | Vite |
|---------|---------------|------|
| Start Time | 3-5 minutes | 0.5-1 second |
| Hot Reload | 2-3 seconds | Instant |
| Build Time | 2-3 minutes | 30-60 seconds |
| Bundle Size | Larger | Smaller |
| Development | Slower | Much Faster |

**Vite is ~10x faster!**

---

## 📁 New Files Created

1. **vite.config.js** - Vite configuration
   - Sets port to 3000
   - Enables auto-open browser
   - Configures API proxy to backend
   - Defines build settings

2. **.env** - Environment variables
   - `VITE_API_URL=http://localhost:5000`
   - Tells frontend where backend is

3. **Updated package.json** - Removed react-scripts, added Vite

4. **Updated index.html** - Added script tag for Vite

---

## 🔗 API Proxy Configuration

In `vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
  }
}
```

This means:
- When frontend calls `/api/employees`
- It automatically goes to `http://localhost:5000/api/employees`
- No need to hardcode the full URL

---

## 📊 Dependency Versions

Versions use symbols:
- `^4.0.0` - Any version 4.x.x (but not 5.x)
- `~4.0.0` - Any version 4.0.x (but not 4.1)
- `4.0.0` - Exactly version 4.0.0

All dependencies are pinned with `^` for flexibility while ensuring compatibility.

---

## 🛠️ Common NPM Commands

```powershell
# Install all dependencies
npm install

# Run development server
npm start
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install specific package
npm install package-name

# Update all packages
npm update

# Remove package
npm uninstall package-name

# Clear cache
npm cache clean --force

# View installed packages
npm list
```

---

## ⚡ Quick Start (Easiest)

Just run:
```powershell
e:\myswoooptrack\start-app.bat
```

This automatically:
1. Installs dependencies (if needed)
2. Starts backend on port 5000
3. Starts frontend on port 3000
4. Opens browser to localhost:3000

---

## 🚨 Troubleshooting

### "vite not found"
```powershell
npm install
```

### "Port 3000 already in use"
```powershell
# Kill the process
taskkill /F /IM node.exe

# Or use different port
set VITE_PORT=3001
npm start
```

### "node_modules too large"
This is normal (~300 MB). Add to `.gitignore` before committing.

### Changes not showing
- Refresh browser (F5)
- Check console for errors (F12)
- Restart dev server

---

## 📈 Performance Improvements with Vite

**Before (react-scripts):**
- Start: 3-5 minutes
- Edit to reload: 2-3 seconds
- Build: 2-3 minutes

**After (Vite):**
- Start: 0.5-1 second ✨
- Edit to reload: Instant ⚡
- Build: 30-60 seconds 🚀

You'll notice huge speed improvement!

---

## 🎓 What Happens When You Run npm start

1. **npm start** reads package.json
2. Finds script `"start": "vite"`
3. Runs Vite development server
4. Loads vite.config.js
5. Starts on port 3000
6. Opens http://localhost:3000
7. Watches for file changes
8. Hot-reloads when you save

---

## 📝 Summary

### Package.json Structure
```
{
  name: App name
  version: App version
  type: Module type (ES6)
  dependencies: Required packages
  devDependencies: Development-only packages
  scripts: npm commands
}
```

### Installation
```
npm install → downloads packages → creates node_modules
```

### Running
```
npm start → runs development server → opens browser
```

### Building
```
npm run build → creates production build → creates dist folder
```

---

## ✅ You're All Set!

Everything is configured for Vite. Just run:

```powershell
cd e:\myswoooptrack\frontend
npm install
npm start
```

Or use the batch file for one-click startup!

---

**Vite Setup Complete! Enjoy the speed!** ⚡
