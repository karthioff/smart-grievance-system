# Smart Public Grievance System - Code & Logic Study Guide

## 📋 TABLE OF CONTENTS
1. Project Architecture Overview
2. Backend Code Explanation
3. Frontend Code Explanation
4. Database Schema
5. AI Priority System Logic
6. Authentication & Security
7. API Endpoints Reference
8. Key Features Implementation

---

## 1. PROJECT ARCHITECTURE OVERVIEW

### Technology Stack
- **Backend**: Node.js + Express.js (Port 5000)
- **Frontend**: React 18 (Port 3000)
- **Database**: MySQL (grievance_system)
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **Security**: CORS, parameterized queries, password hashing

### Project Structure
```
sgs 2/
├── backend-node/          # Node.js Backend
│   ├── server.js          # Main server file
│   ├── .env               # Environment variables
│   └── package.json       # Dependencies
├── frontend/              # React Frontend
│   ├── src/
│   │   ├── pages/         # All page components
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   └── services/      # API service
│   └── package.json
└── Documentation files
```

---

## 2. BACKEND CODE EXPLANATION (server.js)

### A. Server Setup & Dependencies
```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
```

**Purpose**: 
- Express: Web framework for creating REST API
- mysql2: Database connection with promise support
- bcryptjs: Password hashing for security
- jsonwebtoken: Token-based authentication
- cors: Allow frontend (port 3000) to access backend (port 5000)

### B. Database Connection
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'grievance_system',
  waitForConnections: true,
  connectionLimit: 10
});
```
**Logic**: Connection pool manages multiple database connections efficiently

### C. Authentication Middleware
```javascript
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```
**Logic**: 
1. Extract JWT token from Authorization header
2. Verify token validity
3. If valid, attach user info to request and proceed
4. If invalid, return 403 error

### D. AI Priority Assignment Logic
```javascript
function calculatePriority(category, description) {
  const highPriorityKeywords = ['urgent', 'emergency', 'critical', 'danger'];
  const highPriorityCategories = ['Health', 'Safety', 'Emergency'];
  
  const descLower = description.toLowerCase();
  const hasUrgentKeyword = highPriorityKeywords.some(kw => descLower.includes(kw));
  
  if (highPriorityCategories.includes(category) || hasUrgentKeyword) {
    return 'High';
  } else if (category === 'Infrastructure' || category === 'Public Services') {
    return 'Medium';
  }
  return 'Low';
}
```

**Logic Explanation**:
1. **High Priority**: Assigned if category is Health/Safety/Emergency OR description contains urgent keywords
2. **Medium Priority**: Infrastructure or Public Services categories
3. **Low Priority**: All other cases
4. **Rule-Based AI**: Uses predefined rules, not machine learning

---

## 3. FRONTEND CODE EXPLANATION

### A. Authentication Context (AuthContext.js)
```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```
**Logic**:
- Stores user data and token in localStorage
- Provides login/logout functions to all components
- Automatically restores session on page reload

### B. API Service (api.js)
```javascript
const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const submitComplaint = async (complaintData) => {
  const response = await fetch(`${API_URL}/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(complaintData)
  });
  return response.json();
};
```

**Logic**: Centralized API calls with automatic token attachment

### C. Protected Routes (PrivateRoute.js)
```javascript
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return user ? children : <Navigate to="/login" />;
};
```
**Logic**: Redirects to login if user not authenticated

---

## 4. DATABASE SCHEMA

### Table: users
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role ENUM('citizen', 'admin') DEFAULT 'citizen',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: complaints
```sql
CREATE TABLE complaints (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Low',
  status ENUM('Pending', 'In Progress', 'Resolved', 'Escalated') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Table: escalation_log
```sql
CREATE TABLE escalation_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  complaint_id INT NOT NULL,
  escalated_from VARCHAR(100),
  escalated_to VARCHAR(100),
  reason TEXT,
  escalated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id)
);
```

### Table: notifications
```sql
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  complaint_id INT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (complaint_id) REFERENCES complaints(id)
);
```

---

## 5. AI PRIORITY SYSTEM LOGIC (DETAILED)


### Rule-Based Classification System

**Step 1: Keyword Analysis**
- Scans complaint description for urgent keywords
- Keywords: 'urgent', 'emergency', 'critical', 'danger', 'immediate'
- Case-insensitive matching

**Step 2: Category-Based Rules**
```
High Priority Categories:
- Health
- Safety  
- Emergency

Medium Priority Categories:
- Infrastructure
- Public Services

Low Priority Categories:
- Others (Environment, Corruption, etc.)
```

**Step 3: Priority Decision Tree**
```
IF (category IN [Health, Safety, Emergency]) OR (description contains urgent keywords)
  THEN priority = High
ELSE IF category IN [Infrastructure, Public Services]
  THEN priority = Medium
ELSE
  priority = Low
```

**Example Cases**:
1. Category: "Health", Description: "Hospital needs equipment"
   → Result: **High** (category-based)

2. Category: "Environment", Description: "URGENT: Chemical spill"
   → Result: **High** (keyword-based)

3. Category: "Infrastructure", Description: "Road repair needed"
   → Result: **Medium** (category-based)

4. Category: "Others", Description: "Street light not working"
   → Result: **Low** (default)

---

## 6. AUTHENTICATION & SECURITY

### A. Password Security
```javascript
// Registration - Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Login - Compare passwords
const validPassword = await bcrypt.compare(password, user.password);
```
**Logic**: 
- Passwords never stored in plain text
- bcrypt uses salt rounds (10) for strong hashing
- One-way encryption (cannot reverse)

### B. JWT Token System
```javascript
// Generate token on login
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  JWT_SECRET,
  { expiresIn: '24h' }
);
```
**Token Structure**:
- Header: Algorithm (HS256)
- Payload: User data (id, email, role)
- Signature: Encrypted with secret key
- Expiry: 24 hours

### C. Security Features
1. **CORS Protection**: Only allows requests from localhost:3000
2. **SQL Injection Prevention**: Parameterized queries
3. **XSS Protection**: Input sanitization
4. **Token Expiry**: Automatic logout after 24 hours
5. **Role-Based Access**: Admin vs Citizen permissions

---

## 7. API ENDPOINTS REFERENCE


### Authentication Endpoints

**POST /api/register**
- Purpose: Create new user account
- Input: { name, email, password, phone, address }
- Output: { message, userId }
- Logic: Hash password → Insert into users table

**POST /api/login**
- Purpose: User login
- Input: { email, password }
- Output: { token, user: { id, name, email, role } }
- Logic: Verify credentials → Generate JWT token

**POST /api/admin/login**
- Purpose: Admin login
- Input: { email, password }
- Output: { token, user: { id, name, email, role } }
- Logic: Same as login but checks role = 'admin'

### Complaint Endpoints (Protected)

**POST /api/complaints**
- Purpose: Submit new complaint
- Auth: Required (JWT token)
- Input: { title, description, category, location }
- Output: { message, complaintId, priority }
- Logic: Calculate priority → Insert complaint → Return result

**GET /api/complaints**
- Purpose: Get user's complaints
- Auth: Required
- Output: Array of complaints with user info
- Logic: Fetch complaints WHERE user_id = current user

**GET /api/complaints/:id**
- Purpose: Get single complaint details
- Auth: Required
- Output: Complaint object with full details
- Logic: Fetch complaint by ID, verify ownership

**PUT /api/complaints/:id/status**
- Purpose: Update complaint status (Admin only)
- Auth: Required (Admin role)
- Input: { status }
- Output: { message }
- Logic: Update status → Log in escalation_log if escalated

### Admin Endpoints

**GET /api/admin/complaints**
- Purpose: Get all complaints (Admin dashboard)
- Auth: Required (Admin role)
- Output: Array of all complaints with user details
- Logic: JOIN complaints with users table

**GET /api/admin/stats**
- Purpose: Get system statistics
- Auth: Required (Admin role)
- Output: { totalUsers, totalComplaints, pendingCount, resolvedCount, highPriorityCount }
- Logic: COUNT queries on database tables

---

## 8. KEY FEATURES IMPLEMENTATION

### Feature 1: User Registration Flow
```
1. User fills registration form
2. Frontend validates input
3. POST request to /api/register
4. Backend hashes password with bcrypt
5. Insert user into database
6. Return success message
7. Redirect to login page
```

### Feature 2: Complaint Submission Flow
```
1. User fills complaint form (title, description, category, location)
2. Frontend sends POST to /api/complaints with JWT token
3. Backend authenticates token
4. AI system calculates priority based on category + keywords
5. Insert complaint with status='Pending'
6. Return complaint ID and assigned priority
7. Show success message to user
```


### Feature 3: Admin Dashboard Flow
```
1. Admin logs in with admin credentials
2. Frontend stores token + role in localStorage
3. Dashboard loads with GET /api/admin/stats
4. Display statistics cards (total, pending, resolved, high priority)
5. Load all complaints with GET /api/admin/complaints
6. Display in table format with status dropdown
7. Admin can update status via PUT /api/admin/complaints/:id/status
8. Real-time update in UI
```

### Feature 4: Status Update Flow
```
1. Admin selects new status from dropdown
2. Frontend sends PUT request with new status
3. Backend updates complaint status in database
4. If status = 'Escalated', log entry in escalation_log table
5. Update updated_at timestamp
6. Return success response
7. Frontend refreshes complaint list
```

---

## 9. DATA FLOW DIAGRAM

```
USER ACTIONS → FRONTEND (React) → API CALLS → BACKEND (Express) → DATABASE (MySQL)
                    ↓                              ↓
              localStorage                    JWT Verification
              (token, user)                   AI Priority Logic
                    ↓                              ↓
              UI Updates ← JSON Response ← Query Results
```

### Example: Submit Complaint Data Flow
```
1. User Input: Form data (title, description, category, location)
   ↓
2. Frontend: Validate → Add JWT token → POST /api/complaints
   ↓
3. Backend: Verify token → Extract user_id → Calculate priority
   ↓
4. AI Logic: Analyze category + keywords → Assign priority
   ↓
5. Database: INSERT INTO complaints (user_id, title, description, category, location, priority, status)
   ↓
6. Response: { message: "Success", complaintId: 123, priority: "High" }
   ↓
7. Frontend: Show success message → Redirect to complaints list
```

---

## 10. CODE WALKTHROUGH - KEY FILES

### A. server.js (Backend Main File)
**Lines 1-20**: Import dependencies and setup
**Lines 21-30**: Database connection pool
**Lines 31-50**: Middleware (CORS, JSON parser, auth)
**Lines 51-100**: Authentication routes (register, login)
**Lines 101-150**: Complaint routes (create, read, update)
**Lines 151-200**: Admin routes (stats, all complaints)
**Lines 201-220**: AI priority calculation function
**Lines 221-240**: Server startup and error handling

### B. App.js (Frontend Main File)
**Lines 1-20**: Import React Router and components
**Lines 21-40**: Route definitions
**Lines 41-60**: Protected route wrappers
**Lines 61-80**: Public routes (login, register)
**Lines 81-100**: Admin routes

### C. Dashboard.js (User Dashboard)
**Lines 1-30**: State management (stats, loading)
**Lines 31-60**: useEffect to fetch data on mount
**Lines 61-100**: Display statistics cards
**Lines 101-150**: Action buttons (submit, view complaints)
**Lines 151-200**: Responsive design and styling

---

## 11. IMPORTANT CONCEPTS FOR REVIEW


### A. REST API Principles
- **GET**: Retrieve data (read-only)
- **POST**: Create new resource
- **PUT**: Update existing resource
- **DELETE**: Remove resource

### B. JWT Authentication
- **Stateless**: Server doesn't store session
- **Token-based**: Client sends token with each request
- **Secure**: Encrypted with secret key
- **Expirable**: Automatic logout after time limit

### C. React Hooks Used
- **useState**: Manage component state
- **useEffect**: Side effects (API calls, data fetching)
- **useContext**: Share data across components (Auth)
- **useNavigate**: Programmatic navigation

### D. Async/Await Pattern
```javascript
const fetchData = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    setData(data);
  } catch (error) {
    console.error(error);
  }
};
```
**Purpose**: Handle asynchronous operations cleanly

### E. SQL Relationships
- **One-to-Many**: One user → Many complaints
- **Foreign Keys**: Maintain data integrity
- **JOIN Operations**: Combine data from multiple tables

---

## 12. TESTING THE APPLICATION

### Manual Testing Steps

**Test 1: User Registration**
1. Go to http://localhost:3000/register
2. Fill form with valid data
3. Click Register
4. Verify redirect to login
5. Check MySQL: SELECT * FROM users;

**Test 2: User Login**
1. Go to http://localhost:3000/login
2. Enter registered credentials
3. Click Login
4. Verify redirect to dashboard
5. Check localStorage for token

**Test 3: Submit Complaint**
1. Login as user
2. Click "Submit New Complaint"
3. Fill form with category "Health" and description "urgent medical supplies"
4. Submit
5. Verify priority assigned as "High"
6. Check MySQL: SELECT * FROM complaints;

**Test 4: Admin Functions**
1. Go to http://localhost:3000/admin/login
2. Login with admin@grievance.com / admin123
3. View all complaints in table
4. Change status of a complaint
5. Verify update in database

---

## 13. COMMON ISSUES & SOLUTIONS

### Issue 1: "Cannot connect to database"
**Solution**: 
- Check MySQL is running
- Verify password in .env file
- Ensure database 'grievance_system' exists

### Issue 2: "Token expired"
**Solution**: 
- Logout and login again
- Token expires after 24 hours

### Issue 3: "CORS error"
**Solution**: 
- Backend must be running on port 5000
- Frontend must be on port 3000
- Check CORS configuration in server.js

### Issue 4: "Priority not assigned correctly"
**Solution**: 
- Check category spelling matches exactly
- Verify keywords in description
- Review calculatePriority() function logic

---

## 14. PROJECT COMPLETION STATUS (50%)


### ✅ Completed Features (50%)
1. User Registration & Login
2. Admin Login & Dashboard
3. Submit Complaint Form
4. View Complaints List
5. View Complaint Details
6. AI Priority Assignment (Rule-based)
7. Admin Status Update
8. Database Schema & Tables
9. JWT Authentication
10. Password Hashing
11. CORS Security
12. Responsive UI Design

### 🔄 Remaining Features (50%)
1. Officer Dashboard
2. SLA (Service Level Agreement) Timer
3. Automatic Escalation System
4. Email/SMS Notifications
5. Complaint History Tracking
6. File Upload (Images/Documents)
7. Real-time Status Updates
8. Advanced Search & Filters
9. Reports & Analytics
10. Multi-language Support

---

## 15. QUICK REFERENCE - IMPORTANT COMMANDS

### Start Project
```bash
# Terminal 1 - Backend
cd backend-node
node server.js

# Terminal 2 - Frontend
cd frontend
npm start
```

### Database Commands
```sql
-- View all users
SELECT * FROM users;

-- View all complaints
SELECT * FROM complaints;

-- View complaints with user info
SELECT c.*, u.name, u.email 
FROM complaints c 
JOIN users u ON c.user_id = u.id;

-- Count by status
SELECT status, COUNT(*) 
FROM complaints 
GROUP BY status;

-- Count by priority
SELECT priority, COUNT(*) 
FROM complaints 
GROUP BY priority;
```

### Git Commands
```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main
```

---

## 16. REVIEW PRESENTATION TIPS

### What to Explain
1. **Architecture**: 3-tier (Frontend, Backend, Database)
2. **Technology Stack**: React, Node.js, MySQL
3. **Security**: JWT, bcrypt, CORS, SQL injection prevention
4. **AI Logic**: Rule-based priority assignment algorithm
5. **Database Design**: 4 tables with relationships
6. **User Flow**: Registration → Login → Submit → Track
7. **Admin Flow**: Login → View all → Update status

### Demo Flow
1. Show project structure in VS Code
2. Start both servers
3. Register new user
4. Login and submit complaint
5. Show priority assignment
6. Login as admin
7. Show admin dashboard
8. Update complaint status
9. Show database tables in MySQL

### Key Points to Mention
- **Scalable**: Connection pooling, modular code
- **Secure**: Industry-standard authentication
- **User-friendly**: Clean UI, responsive design
- **Efficient**: Fast API responses, optimized queries
- **Maintainable**: Well-organized code structure

---

## 17. STUDY CHECKLIST FOR REVIEW

### Must Know
- [ ] How JWT authentication works
- [ ] AI priority calculation logic
- [ ] Database schema and relationships
- [ ] API endpoints and their purposes
- [ ] React component structure
- [ ] Security features implemented
- [ ] How to start the project
- [ ] Admin vs User differences

### Should Know
- [ ] bcrypt password hashing process
- [ ] CORS configuration
- [ ] SQL query optimization
- [ ] React hooks (useState, useEffect, useContext)
- [ ] Async/await pattern
- [ ] Error handling approach
- [ ] Token expiry mechanism

### Good to Know
- [ ] Connection pooling benefits
- [ ] Middleware execution order
- [ ] React Router navigation
- [ ] localStorage usage
- [ ] CSS styling approach
- [ ] Git version control

---

## 18. FINAL NOTES

### Project Strengths
✅ Clean, minimal UI design
✅ Secure authentication system
✅ Intelligent priority assignment
✅ Role-based access control
✅ Well-structured codebase
✅ Comprehensive documentation

### Areas for Improvement (Future)
🔄 Add real-time notifications
🔄 Implement SLA tracking
🔄 Add file upload capability
🔄 Create officer dashboard
🔄 Add email integration
🔄 Implement advanced analytics

---

**Good luck with your review tomorrow! 🚀**

**Quick Access URLs:**
- User Login: http://localhost:3000/login
- Admin Login: http://localhost:3000/admin/login
- Backend API: http://localhost:5000/api
- Admin Credentials: admin@grievance.com / admin123
