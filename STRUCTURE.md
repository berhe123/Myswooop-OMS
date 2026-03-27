e:\myswoooptrack
│
├── README.md                          # Main project documentation
├── INSTALLATION.md                    # Step-by-step installation guide
├── PROJECT_SUMMARY.md                 # Complete project overview
├── QUICK_REFERENCE.md                 # Quick command reference
├── .gitignore                         # Git ignore rules
├── start-app.bat                      # Batch file to start both servers
│
├── backend/                           # Node.js Express Backend
│   │
│   ├── package.json                   # Backend dependencies and scripts
│   ├── server.js                      # Main Express application
│   │
│   ├── db/
│   │   └── database.js                # SQLite database setup and methods
│   │                                   # Creates 4 tables:
│   │                                   # - users (admin/employee accounts)
│   │                                   # - employees (employee info)
│   │                                   # - allocations (daily tasks)
│   │                                   # - daily_products (tracking stats)
│   │
│   ├── middleware/
│   │   └── auth.js                    # JWT authentication & role verification
│   │
│   └── routes/
│       ├── auth.js                    # Login/Register endpoints
│       ├── employees.js               # Employee CRUD operations
│       ├── allocations.js             # Task allocation endpoints
│       └── products.js                # Product tracking endpoints
│
└── frontend/                          # React Frontend
    │
    ├── package.json                   # Frontend dependencies and scripts
    │
    ├── public/
    │   └── index.html                 # HTML entry point
    │
    └── src/
        ├── index.js                   # React app initialization
        ├── index.css                  # Base styles
        ├── App.js                     # Main router component
        ├── App.css                    # App styles
        │
        ├── Login.js                   # Login page component
        ├── Login.css                  # Login styles
        │
        ├── AdminDashboard.js          # Admin management interface
        │                               # Features:
        │                               # - Manage employees (add/edit/delete)
        │                               # - Allocate daily tasks
        │                               # - Track product statistics
        ├── AdminDashboard.css         # Admin styles
        │
        ├── EmployeeDashboard.js       # Employee task view
        │                               # Features:
        │                               # - View allocated tasks
        │                               # - See task type (OA/Franchise)
        │                               # - Department info
        └── EmployeeDashboard.css      # Employee styles

═══════════════════════════════════════════════════════════════════

DATA FLOW DIAGRAM:

Browser (Port 3000)
    ↓
React Frontend
    ├── Login Component
    ├── Admin Dashboard (if role=admin)
    │   ├── Employee Management
    │   ├── Task Allocation
    │   └── Product Tracking
    └── Employee Dashboard (if role=employee)
        └── View Allocated Tasks
    ↓
HTTP/CORS/axios
    ↓
Express Backend (Port 5000)
    ├── /api/auth (login, register)
    ├── /api/employees (CRUD)
    ├── /api/allocations (task management)
    └── /api/products (daily tracking)
    ↓
SQLite Database (myswooop.db)
    ├── users table
    ├── employees table
    ├── allocations table
    └── daily_products table

═══════════════════════════════════════════════════════════════════

DATABASE SCHEMA:

users (Authentication)
├── id (PRIMARY KEY)
├── username (UNIQUE)
├── password (hashed)
├── email
├── role (admin/employee)
└── createdAt

employees (Employee Information)
├── id (PRIMARY KEY)
├── userId (FOREIGN KEY → users)
├── name
├── email
├── phone
├── department
└── createdAt

allocations (Daily Task Assignments)
├── id (PRIMARY KEY)
├── employeeId (FOREIGN KEY → employees)
├── taskType (OA/Franchise)
└── allocatedDate

daily_products (Product Statistics)
├── id (PRIMARY KEY)
├── date (UNIQUE)
├── incoming
├── tested
├── sold
├── repaired
├── returnProducts
└── createdAt

═══════════════════════════════════════════════════════════════════

COMPONENT HIERARCHY:

App
├── Login (Not Authenticated)
├── AdminDashboard (if user.role == 'admin')
│   ├── Header
│   ├── Tabs (Manage/Allocate/Products)
│   ├── Employee Management
│   │   ├── Employee Form
│   │   └── Employees Table
│   ├── Task Allocation
│   │   ├── Employee List
│   │   └── Allocation Modal
│   └── Product Tracking
│       └── Products Form
│
└── EmployeeDashboard (if user.role == 'employee')
    ├── Header
    └── Tasks Display
        ├── Task Cards
        └── Department Info

═══════════════════════════════════════════════════════════════════

API ENDPOINT STRUCTURE:

POST /api/auth/login
├── Input: { username, password }
└── Output: { token, user }

GET /api/employees
├── Auth Required: YES
└── Output: [employees array]

POST /api/employees
├── Auth Required: YES (admin only)
├── Input: { name, email, phone, username, password }
└── Output: { employee object }

PUT /api/employees/:id
├── Auth Required: YES (admin only)
├── Input: { name, email, phone }
└── Output: { updated employee }

DELETE /api/employees/:id
├── Auth Required: YES (admin only)
└── Output: { success message }

POST /api/allocations
├── Auth Required: YES (admin only)
├── Input: { employeeId, taskType }
└── Output: { allocation object }

GET /api/allocations
├── Auth Required: YES
└── Output: [allocations array]

GET /api/products/daily/:date
├── Auth Required: YES
└── Output: { products object }

POST /api/products/daily/:date
├── Auth Required: YES (admin only)
├── Input: { incoming, tested, sold, repaired, returnProducts }
└── Output: { updated products }

═══════════════════════════════════════════════════════════════════

FILE PURPOSES:

BACKEND:
- server.js: Starts Express, loads routes, initializes database
- db/database.js: SQLite wrapper, creates tables, manages queries
- middleware/auth.js: JWT verification, role checks
- routes/auth.js: Login endpoint
- routes/employees.js: Add/edit/delete employees
- routes/allocations.js: Manage task allocations
- routes/products.js: Track daily products

FRONTEND:
- index.js: ReactDOM render
- App.js: Router, conditional rendering
- Login.js: Login page, token handling
- AdminDashboard.js: Complete admin UI
- EmployeeDashboard.js: Employee task view

═══════════════════════════════════════════════════════════════════

REQUIRED NODE_MODULES (Installed via npm):

Backend:
- express: Web framework
- cors: Cross-origin support
- sqlite3: Database
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- dotenv: Environment variables
- nodemon: Dev auto-restart (dev only)

Frontend:
- react: UI library
- react-dom: React rendering
- react-router-dom: Navigation
- axios: HTTP requests
- react-scripts: Build tools

═══════════════════════════════════════════════════════════════════

PORTS:
- Frontend: 3000 (http://localhost:3000)
- Backend: 5000 (http://localhost:5000)

DATABASE:
- Location: e:\myswoooptrack\backend\db\myswooop.db
- Type: SQLite3
- Initial user: admin/admin123

═══════════════════════════════════════════════════════════════════
