# MySwooop Activity Tracker

A web application for managing daily activities and employee task allocation at MySwooop company.

## Features

### Admin Dashboard
- **Employee Management**: Add, edit, and delete employees
- **Task Allocation**: Allocate OA or Franchise tasks to employees daily
- **Product Tracking**: Track incoming, tested, sold, repaired, and returned products
- **User Management**: Create employee accounts with login credentials

### Employee Dashboard
- **View Allocated Tasks**: See your daily task assignments
- **Task Types**: OA (Order Administration) or Franchise
- **Simple Interface**: Easy-to-understand task display

## Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite3** for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React 18**
- **Axios** for API calls
- **React Router** for navigation
- **CSS3** for styling

## Project Structure

```
myswoooptrack/
├── backend/
│   ├── db/
│   │   └── database.js          # Database initialization and methods
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Login/Register routes
│   │   ├── employees.js         # Employee CRUD routes
│   │   ├── allocations.js       # Task allocation routes
│   │   └── products.js          # Product tracking routes
│   ├── package.json
│   └── server.js                # Express server setup
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── Login.js             # Login page component
    │   ├── Login.css
    │   ├── AdminDashboard.js    # Admin panel component
    │   ├── AdminDashboard.css
    │   ├── EmployeeDashboard.js # Employee panel component
    │   ├── EmployeeDashboard.css
    │   ├── App.js               # Main app component
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js 14+ and npm installed
- Windows PowerShell or Command Prompt

### Backend Setup

1. Navigate to the backend directory:
```powershell
cd e:\myswoooptrack\backend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the backend server:
```powershell
npm start
```

The backend server will run on `http://localhost:5000`

The database will be automatically initialized with an admin user:
- **Username**: admin
- **Password**: admin123

### Frontend Setup

1. In a new terminal, navigate to the frontend directory:
```powershell
cd e:\myswoooptrack\frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the React development server:
```powershell
npm start
```

The frontend will open automatically at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username and password
- `POST /api/auth/register` - Register new user (admin only)

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get specific employee
- `POST /api/employees` - Create new employee (admin only)
- `PUT /api/employees/:id` - Update employee (admin only)
- `DELETE /api/employees/:id` - Delete employee (admin only)

### Allocations
- `GET /api/allocations` - Get all allocations
- `GET /api/allocations/employee/:employeeId` - Get employee's allocations
- `POST /api/allocations` - Create new allocation (admin only)
- `DELETE /api/allocations/:id` - Delete allocation (admin only)

### Products
- `GET /api/products/daily/:date` - Get daily product stats
- `POST /api/products/daily/:date` - Update daily product stats (admin only)

## Usage Guide

### For Admins

1. **Login**:
   - Username: `admin`
   - Password: `admin123`

2. **Manage Employees**:
   - Click "Manage Employees" tab
   - Click "Add New Employee" button
   - Fill in employee details (Name, Email, Phone, Username)
   - Click "Add Employee"

3. **Delete Employees**:
   - Go to "Manage Employees" tab
   - Click "Delete" button next to employee

4. **Allocate Tasks**:
   - Click "Allocate Tasks" tab
   - Click "Allocate Task" button next to an employee
   - Choose either "OA (Order Administration)" or "Franchise"
   - Task is saved and employee can see it in their dashboard

5. **Track Products**:
   - Click "Track Products" tab
   - Select date
   - Enter numbers for:
     - Incoming Products
     - Tested Products
     - Sold Products
     - Repaired Products
     - Return Products
   - Click "Save Products"

### For Employees

1. **Login**:
   - Use the username and password provided by admin
   - Default password: `employee123` (can be changed by admin)

2. **View Tasks**:
   - Your dashboard shows allocated tasks for today
   - Task type shows either "OA" or "Franchise"
   - See task details including allocation date/time

3. **Department Info**:
   - Scroll down to see information about different departments

## Default Credentials

**Admin Account**:
- Username: `admin`
- Password: `admin123`

Use the admin account to create employee accounts.

## Key Features Explained

### 1. Four Departments
- **OA (Order Administration)** - Order processing and administrative tasks
- **Franchise** - Franchise-related operations
- **Return Products** - Tracked in product statistics
- **Repair** - Tracked in product statistics

### 2. Daily Task Allocation
- Admin allocates tasks to employees each morning
- Only OA and Franchise tasks are allocated to employees
- Return Products and Repair are tracked in overall statistics

### 3. Product Tracking
- Track 5 metrics daily:
  - Incoming: Products received
  - Tested: Products that passed testing
  - Sold: Products sold
  - Repaired: Products repaired
  - Return Products: Products returned

### 4. Employee Dashboard
- Employees see their name and allocated task type
- Shows allocation date and time
- Simple, clean interface focused on task visibility

## Troubleshooting

### Backend won't start
- Ensure port 5000 is available: `netstat -ano | findstr :5000`
- Check Node.js is installed: `node --version`

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS is enabled (already configured)

### Database errors
- Delete `backend/db/myswooop.db` to reset the database
- Run the backend again to reinitialize

### Port already in use
- Backend: Change PORT in server.js
- Frontend: Set PORT=3001 in environment or use: `set PORT=3001 && npm start`

## Development Notes

### Adding a New Employee Type
Modify the allocation routes to support new task types:
1. Update `/api/allocations` POST route
2. Update EmployeeDashboard.js to display new task type

### Customizing Departments
Edit the task types in AdminDashboard.js allocation modal and database schema as needed.

## Future Enhancements

- Employee shift management
- Attendance tracking
- Performance analytics
- Email notifications for task allocation
- Mobile app version
- Task completion tracking
- Department-wise reporting
- Export data to CSV/PDF

## License

This project is for internal use at MySwooop company.

## Support

For issues or questions, contact the development team.
