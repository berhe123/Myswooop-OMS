# MySwooop Activity Tracker - Windows Installation Guide

## Step-by-Step Setup

### 1. Install Node.js
1. Download Node.js from https://nodejs.org/ (LTS version recommended)
2. Run the installer
3. Follow the installation wizard (keep default settings)
4. Verify installation by opening PowerShell and typing:
   ```
   node --version
   npm --version
   ```

### 2. Install Backend Dependencies

1. Open PowerShell
2. Navigate to backend folder:
   ```powershell
   cd e:\myswoooptrack\backend
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```
   This will install:
   - express (web framework)
   - sqlite3 (database)
   - bcryptjs (password hashing)
   - jsonwebtoken (authentication)
   - cors (cross-origin support)
   - nodemon (development tool)

### 3. Install Frontend Dependencies

1. Open another PowerShell window
2. Navigate to frontend folder:
   ```powershell
   cd e:\myswoooptrack\frontend
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```
   This will install:
   - react (UI library)
   - react-dom (React rendering)
   - react-router-dom (navigation)
   - axios (HTTP requests)

### 4. Running the Application

#### Option A: Using the Batch File (Easy)
1. In PowerShell, run:
   ```powershell
   e:\myswoooptrack\start-app.bat
   ```
2. This will open two new windows for backend and frontend
3. Wait for both to start (2-3 minutes)
4. Frontend will open automatically at http://localhost:3000

#### Option B: Manual Setup

**Terminal 1 - Backend:**
```powershell
cd e:\myswoooptrack\backend
npm start
```
You'll see: `Server running on port 5000`

**Terminal 2 - Frontend:**
```powershell
cd e:\myswoooptrack\frontend
npm start
```
The browser will automatically open at http://localhost:3000

### 5. Login

Use these credentials to login:
- **Username**: admin
- **Password**: admin123

## What Each Component Does

### Backend (Port 5000)
- Handles user authentication
- Manages employee data
- Processes task allocations
- Tracks product statistics
- Uses SQLite database stored in `backend/db/myswooop.db`

### Frontend (Port 3000)
- User login interface
- Admin dashboard for managing employees
- Task allocation interface
- Product tracking dashboard
- Employee dashboard showing assigned tasks

## Troubleshooting

### "npm: The term 'npm' is not recognized"
- Node.js is not installed properly
- Reinstall Node.js from https://nodejs.org/
- Restart PowerShell after installation

### Port 5000 or 3000 already in use
1. Find what's using the port:
   ```powershell
   netstat -ano | findstr :5000
   ```
2. Kill the process (replace XXXXX with PID from above):
   ```powershell
   taskkill /PID XXXXX /F
   ```

### "Cannot find module" errors
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

### Database errors
1. Close the application
2. Delete `backend/db/myswooop.db`
3. Start the backend again (it will recreate the database)

### Frontend won't connect to backend
1. Verify backend is running on port 5000
2. Check no firewall is blocking connections
3. In frontend folder, verify `.env` or proxy in `package.json` points to `http://localhost:5000`

## Key Concepts

### Login System
- Admin and employees share the same login page
- Admin role: manage employees, allocate tasks, track products
- Employee role: view assigned tasks

### Employee Management
- Only admins can create/edit/delete employees
- Each employee gets a unique username and password
- Default password for new employees is "employee123"

### Task Allocation
- Admins allocate one task type per day per employee
- Task types: "OA" (Order Administration) or "Franchise"
- Employees see their daily allocation in their dashboard

### Product Tracking
- Tracks 5 metrics daily: Incoming, Tested, Sold, Repaired, Return Products
- Only admins can update product numbers
- Data persists in the database

## File Locations

- **Backend code**: `e:\myswoooptrack\backend\`
- **Frontend code**: `e:\myswoooptrack\frontend\`
- **Database file**: `e:\myswoooptrack\backend\db\myswooop.db`
- **ReadMe**: `e:\myswoooptrack\README.md`

## Next Steps

1. Start both servers
2. Login as admin (admin/admin123)
3. Create some test employees
4. Allocate tasks to employees
5. Login as an employee to see their dashboard
6. Track products from admin dashboard

## Getting Help

Check the main README.md for:
- API endpoint documentation
- Complete feature list
- Feature explanations
- Development notes

## Performance Notes

- First run takes longer (npm installs packages)
- Subsequent runs start faster
- Frontend compiles on first load (2-3 minutes on first run)
- Keep terminals open while using the app

Enjoy using MySwooop Activity Tracker!
