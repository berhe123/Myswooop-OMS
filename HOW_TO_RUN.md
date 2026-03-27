# How to Run MySwooop Activity Tracker

## Quick Start (Two Terminal Windows)

### Terminal 1 - Backend (Node.js + Express)
```bash
cd d:\myswoooptrack\backend
npm start
```
- Backend runs on: **http://localhost:5000**
- API endpoints available at: `http://localhost:5000/api/`

### Terminal 2 - Frontend (React + Vite)
```bash
cd d:\myswoooptrack\frontend
npx vite --port 3000
```
- Frontend runs on: **http://localhost:3000**
- Opens automatically in your browser

## Login Credentials
- **Username:** admin
- **Password:** admin123

## Available Backend API Endpoints
- `POST /api/auth/login` - Login user
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/allocations` - Get task allocations
- `POST /api/allocations` - Create allocation
- `GET /api/products` - Get product tracking
- `POST /api/products` - Record product data
- `GET /api/health` - Health check

## Frontend Features
- **Admin Dashboard:** Complete control panel for managing employees, allocations, and product tracking
- **Employee Dashboard:** View assigned tasks and submit activity logs
- **Authentication:** JWT-based login system

## Cleaning Up (If Something Goes Wrong)

### Clean Install Backend
```bash
cd d:\myswoooptrack\backend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
npm start
```

### Clean Install Frontend
```bash
cd d:\myswoooptrack\frontend
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
npx vite --port 3000
```

## Key Project Structure

### Backend
- `server.js` - Main server file
- `db/database.js` - SQLite database setup
- `middleware/auth.js` - Authentication middleware
- `routes/` - API routes (auth, employees, allocations, products)

### Frontend
- `src/index.js` - React entry point
- `src/App.js` - Main App component
- `src/AdminDashboard.js` - Admin interface
- `src/EmployeeDashboard.js` - Employee interface
- `src/Login.js` - Login page

## Current Status
✅ Backend: Running on port 5000
✅ Frontend: Running on port 3000
✅ Database: SQLite initialized
✅ Authentication: Admin user created

Open your browser to **http://localhost:3000** and login!
