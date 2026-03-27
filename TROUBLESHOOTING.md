# Troubleshooting Guide - MySwooop Activity Tracker

## Common Problems and Solutions

### 1. PORT ALREADY IN USE

**Problem**: Error "port 5000 is already in use" or "port 3000 is already in use"

**Solutions**:

**Option A - Kill all Node processes:**
```powershell
taskkill /F /IM node.exe
```

**Option B - Find specific process:**
```powershell
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

**Option C - Use different port:**
- Edit `backend/server.js` line with `const PORT`
- Change `5000` to `8000` (or another port)
- Restart backend

---

### 2. "npm: The term 'npm' is not recognized"

**Problem**: Command not found when typing `npm install`

**Cause**: Node.js not installed properly

**Solution**:
1. Download Node.js from https://nodejs.org/ (LTS version)
2. Run the installer
3. Restart PowerShell
4. Verify: `node --version` and `npm --version`

---

### 3. "Cannot find module" errors

**Problem**: Error like "Cannot find module 'express'"

**Solution**:
```powershell
# Delete node_modules
Remove-Item -Recurse node_modules

# Delete package lock
Remove-Item package-lock.json

# Reinstall
npm install
```

---

### 4. Frontend won't load / Blank page

**Problem**: See blank white page or loading forever

**Solutions**:

1. **Check backend is running:**
   - Terminal should show "Server running on port 5000"
   - If not, restart backend with `npm start`

2. **Clear browser cache:**
   - Press `Ctrl+Shift+Delete`
   - Clear all cache
   - Refresh page with `F5`

3. **Check console for errors:**
   - Press `F12` to open Developer Tools
   - Click Console tab
   - See error messages
   - Take screenshot and check troubleshooting

4. **Restart both servers:**
   ```powershell
   # In backend terminal
   Ctrl+C
   npm start

   # In frontend terminal  
   Ctrl+C
   npm start
   ```

---

### 5. Can't Login - "Invalid credentials"

**Problem**: Login fails even with correct username/password

**Cause**: Wrong credentials or user doesn't exist

**Solutions**:

1. **Check username/password spelling:**
   - Both are case-sensitive
   - Default: admin / admin123

2. **If locked out of admin account:**
   - Delete database: `e:\myswoooptrack\backend\db\myswooop.db`
   - Restart backend
   - Login with: admin / admin123

3. **For employee accounts:**
   - Make sure admin created the account first
   - Use exact username admin created
   - Default password: employee123

---

### 6. Employee can't see allocated task

**Problem**: Task was allocated but employee doesn't see it

**Solutions**:

1. **Refresh page:**
   - Press `F5` in employee's browser
   - Wait 2 seconds

2. **Logout and login again:**
   - Click Logout
   - Wait 5 seconds
   - Login again

3. **Check allocation was saved:**
   - Go to admin "Allocate Tasks" tab
   - Verify employee is listed
   - Try allocating again

4. **Check date is today:**
   - Employee only sees today's tasks
   - If allocated for different date, won't show

---

### 7. DATABASE ERRORS

**Problem**: Error about database or SQLite issues

**Solution - Reset database:**
```powershell
# Go to backend folder
cd e:\myswoooptrack\backend

# Delete database file
Remove-Item db\myswooop.db

# Restart backend
npm start
```

Database will recreate automatically with admin user.

---

### 8. Frontend won't start

**Problem**: Error when running `npm start` in frontend folder

**Solutions**:

1. **Check Node modules are installed:**
   ```powershell
   cd e:\myswoooptrack\frontend
   npm install
   ```

2. **Check port 3000 is free:**
   ```powershell
   netstat -ano | findstr :3000
   ```

3. **Clear npm cache:**
   ```powershell
   npm cache clean --force
   npm install
   npm start
   ```

4. **Check package.json is valid:**
   - Verify file isn't corrupted
   - Check JSON syntax

---

### 9. Backend won't start

**Problem**: Error when running `npm start` in backend folder

**Solutions**:

1. **Install dependencies:**
   ```powershell
   cd e:\myswoooptrack\backend
   npm install
   ```

2. **Check port 5000 is free:**
   ```powershell
   netstat -ano | findstr :5000
   ```

3. **Check database folder exists:**
   ```powershell
   # Create if missing
   md db
   ```

4. **Check server.js for syntax errors:**
   - Open `server.js`
   - Look for red underlines
   - Check line numbers in error message

---

### 10. Adding employee fails

**Problem**: Can't add new employee through admin panel

**Solutions**:

1. **Check all fields are filled:**
   - Name (required)
   - Email (required)
   - Phone (optional but recommended)
   - Username (required, must be unique)

2. **Check username is unique:**
   - Each employee needs different username
   - Can't duplicate existing usernames
   - Try adding numbers: "john1", "john2"

3. **Check backend is responding:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Add employee again
   - Look for request to `/api/employees`
   - Should show "200" status (success)

4. **Check database:**
   - May be out of space
   - Try resetting database (see #7)

---

### 11. Task allocation fails

**Problem**: Allocated task but then get error

**Solutions**:

1. **Check employee exists:**
   - Employee must exist in database
   - Allocate only to listed employees

2. **Check task type is valid:**
   - Only "OA" or "Franchise" allowed
   - Case-sensitive

3. **Check network connection:**
   - Ping backend: `curl http://localhost:5000/api/health`
   - Should return JSON response

---

### 12. Product tracking won't save

**Problem**: Numbers saved but don't appear on reload

**Solutions**:

1. **Check date format:**
   - Use the date picker (don't type)
   - Format should be YYYY-MM-DD

2. **Verify numbers are valid:**
   - Use whole numbers only (no decimals)
   - Can be zero

3. **Check for error message:**
   - Error may appear at top of form
   - Read error carefully

4. **Try again:**
   - Click "Save Products" multiple times
   - Should succeed after a few tries

---

### 13. Slow performance / Freezing

**Problem**: App is slow or freezes

**Solutions**:

1. **Close other applications:**
   - Free up RAM
   - Reduce system load

2. **Restart servers:**
   ```powershell
   # Close both terminals
   # Restart backend and frontend
   npm start
   ```

3. **Clear browser cache:**
   - Ctrl+Shift+Delete
   - Clear all data
   - Refresh

4. **Check system resources:**
   - Open Task Manager (Ctrl+Shift+Esc)
   - Check CPU and Memory usage
   - Close other applications if needed

---

### 14. Browser shows "Cannot GET /"

**Problem**: Frontend shows error page

**Cause**: Frontend dev server not running

**Solution**:
```powershell
cd e:\myswoooptrack\frontend
npm start
```

---

### 15. Page shows "Refused to connect"

**Problem**: Can't reach the server

**Solutions**:

1. **Check servers are running:**
   - Backend terminal shows: "Server running on port 5000"
   - Frontend terminal shows: "Compiled successfully"

2. **Check localhost spelling:**
   - http://localhost:3000 (correct)
   - http://127.0.0.1:3000 (also works)

3. **Restart both servers:**
   ```powershell
   Ctrl+C in both terminals
   npm start (in each)
   ```

---

### 16. Mixed up admin/employee view

**Problem**: Logged in but seeing wrong dashboard

**Solution**:
```powershell
# Clear all browser data
1. Press Ctrl+Shift+Delete
2. Clear all cookies and cache
3. Log out and log back in
```

---

### 17. Employee password forgotten

**Problem**: Employee can't login, forgot password

**Solution - Reset Database:**
1. Delete `backend/db/myswooop.db`
2. Restart backend
3. All employees reset
4. Re-add employee with new password

Or admin recreates account with same username.

---

### 18. Multiple logins on same account

**Problem**: Admin and another user logged in same account

**Solution**: Each person should use own credentials
- Admin uses: admin/admin123
- Employee uses their own username/password
- Don't share credentials

---

### 19. Changes not appearing immediately

**Problem**: Added/changed something but doesn't show

**Solutions**:

1. **Refresh page:**
   - Press F5

2. **Logout and login:**
   - Logout button
   - Login again

3. **Clear cache:**
   - Ctrl+Shift+Delete
   - Clear all

4. **Restart frontend:**
   - Close frontend terminal
   - Run `npm start` again

---

### 20. File not found errors

**Problem**: Error about missing files

**Cause**: Files in wrong location or not created

**Solution**:
```powershell
# Check files exist
cd e:\myswoooptrack
dir /s *.js

# Files should be in:
# .\backend\server.js
# .\backend\routes\*.js
# .\frontend\src\*.js
```

---

## Emergency Fixes

### Complete Reset
```powershell
# Backend
cd e:\myswoooptrack\backend
Remove-Item -Recurse node_modules
Remove-Item package-lock.json
Remove-Item db\myswooop.db
npm install
npm start

# Frontend (in another terminal)
cd e:\myswoooptrack\frontend
Remove-Item -Recurse node_modules
Remove-Item package-lock.json
npm install
npm start
```

### Kill all Node processes
```powershell
taskkill /F /IM node.exe
```

### Clear all browser data
1. Press Ctrl+Shift+Delete
2. Select "All time"
3. Check all boxes
4. Click Clear

### Check ports
```powershell
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

---

## Getting More Help

1. **Check terminal output** - Error messages usually explain the problem
2. **Open browser DevTools** - F12 → Console to see JavaScript errors
3. **Check file locations** - Ensure files are in correct directories
4. **Read error messages carefully** - They usually point to the solution

---

## Support Resources

- **Installation Help**: See `INSTALLATION.md`
- **Project Overview**: See `README.md`
- **Quick Reference**: See `QUICK_REFERENCE.md`
- **File Structure**: See `STRUCTURE.md`

---

**Last Updated**: March 2026
**For MySwooop Activity Tracker v1.0**
