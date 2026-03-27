# MySwooop Activity Tracker - Quick Reference

## Start the Application

### Easiest Way:
```powershell
cd e:\myswoooptrack
.\start-app.bat
```

### Manual Way:
1. Open PowerShell Terminal 1:
   ```
   cd e:\myswoooptrack\backend && npm start
   ```

2. Open PowerShell Terminal 2:
   ```
   cd e:\myswoooptrack\frontend && npm start
   ```

3. Wait 2-3 minutes for everything to load
4. Browser opens automatically to http://localhost:3000

## Login Information

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Employee | (created by admin) | employee123 |

## Admin Tasks - Step by Step

### Adding an Employee
1. Click "Manage Employees" tab
2. Click "Add New Employee" button
3. Fill in:
   - Name: Full name of employee
   - Email: Work email
   - Phone: Phone number
   - Username: Login username for employee
4. Click "Add Employee"
5. Employee can now login with username/password

### Deleting an Employee
1. Go to "Manage Employees" tab
2. Find employee in the list
3. Click "Delete" button
4. Confirm deletion

### Editing an Employee
1. Go to "Manage Employees" tab
2. Click "Edit" button next to employee
3. Update information
4. Click save

### Allocating a Daily Task
1. Click "Allocate Tasks" tab
2. Find the employee in the list
3. Click "Allocate Task" button
4. A popup appears with two options:
   - **OA** (Order Administration)
   - **Franchise**
5. Click your choice
6. Task is saved immediately
7. Employee sees it in their dashboard

### Tracking Daily Products
1. Click "Track Products" tab
2. Select the date using date picker
3. Enter numbers for each category:
   - **Incoming**: How many products arrived
   - **Tested**: How many were tested
   - **Sold**: How many were sold
   - **Repaired**: How many were repaired
   - **Return Products**: How many were returned
4. Click "Save Products"

## Employee Tasks - Step by Step

### Logging In
1. Use username/password provided by admin
2. Click Login
3. Dashboard displays immediately

### Viewing Allocated Tasks
1. After login, you see "Your Allocated Tasks"
2. If a task is allocated, you see:
   - Your name
   - Task type: OA or Franchise
   - When it was allocated
3. If no tasks: Check back later or contact admin

### Understanding Department Roles

**OA (Order Administration)**
- Responsible for managing orders
- Administrative tasks
- Order processing

**Franchise**
- Franchise-related activities
- Franchise management
- Franchise operations

## Common Issues & Solutions

### "Server is not running"
- Ensure backend terminal shows "Server running on port 5000"
- If not, terminal may have errors - check the output

### "Can't login"
- Check username/password spelling (case-sensitive)
- Make sure admin created the employee account first

### "Allocation not showing"
- Refresh employee's browser (F5)
- Check allocation date is today's date

### Port already in use
```powershell
# Kill process on port 5000
taskkill /F /IM node.exe

# Or find specific process:
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

### Database errors
- Delete: `e:\myswoooptrack\backend\db\myswooop.db`
- Restart backend (database will recreate)

## File Locations

| What | Where |
|------|-------|
| Backend code | `e:\myswoooptrack\backend\` |
| Frontend code | `e:\myswoooptrack\frontend\` |
| Database | `e:\myswoooptrack\backend\db\myswooop.db` |
| Documentation | `e:\myswoooptrack\*.md` |
| Quick start | `e:\myswoooptrack\start-app.bat` |

## API URLs

| Function | URL | Method |
|----------|-----|--------|
| Login | `/api/auth/login` | POST |
| Get employees | `/api/employees` | GET |
| Add employee | `/api/employees` | POST |
| Allocate task | `/api/allocations` | POST |
| Get allocations | `/api/allocations` | GET |
| Track products | `/api/products/daily/:date` | POST |
| Get products | `/api/products/daily/:date` | GET |

## Browser Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/

## Daily Routine

### Morning (As Admin)
1. Start both servers
2. Login to dashboard
3. Allocate tasks to employees for the day
4. Employees can see their tasks

### Throughout Day
- Update product statistics as needed
- Add new employees if required

### Managing Employees
- Can add/edit/delete at any time
- Changes take effect immediately

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Refresh page | F5 |
| Clear cache | Ctrl+Shift+Delete |
| Open DevTools | F12 |
| Logout | Click "Logout" button |

## Database Reset (If Needed)

```powershell
# Go to backend
cd e:\myswoooptrack\backend

# Delete database file
Remove-Item db\myswooop.db

# Restart backend
npm start
```

Database will recreate with admin account.

## Need Help?

- **Installation**: Read `INSTALLATION.md`
- **Features**: Read `README.md`
- **Architecture**: Read `PROJECT_SUMMARY.md`
- **Errors**: Check terminal output for error messages

## Performance Tips

- Keep both servers running in background
- Use modern browsers (Chrome/Edge)
- Clear browser cache if data looks wrong
- Database is local - performance is instant

## Security Reminders

- Change admin password after setup (requires code modification)
- Don't share admin credentials
- Use strong passwords for employee accounts
- Regularly backup database file

## What Can Be Tracked

### Departments (4 Total)
1. **OA** - Order Administration
2. **Franchise** - Franchise Operations
3. **Return Products** - Tracked in daily stats
4. **Repair** - Tracked in daily stats

### Products (5 Metrics)
- Incoming (new arrivals)
- Tested (passed quality check)
- Sold (completed sales)
- Repaired (fixed products)
- Return Products (returned by customers)

### Employees
- Name, Email, Phone
- Assigned Department
- Daily Task (OA or Franchise)
- User Account (login)

---

**Version**: 1.0
**Last Updated**: March 2026
**For**: MySwooop Company Activity Tracking
