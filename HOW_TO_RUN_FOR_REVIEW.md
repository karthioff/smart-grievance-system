# 🚀 HOW TO RUN PROJECT FOR REVIEW - STEP BY STEP

## 📋 Quick Overview
This guide will help you start the project manually for your review tomorrow.

---

## ⚡ QUICK START (2 Steps)

### Step 1: Start Backend Server
1. Open **Command Prompt** or **PowerShell**
2. Navigate to project folder:
   ```cmd
   cd "C:\Users\Administrator\Desktop\sgs 2"
   ```
3. Go to backend folder:
   ```cmd
   cd backend-node
   ```
4. Start the server:
   ```cmd
   npm start
   ```
5. Wait for this message:
   ```
   ✓ Grievance System Backend Server Running
   ✓ Server: http://localhost:5000
   ```
6. **KEEP THIS WINDOW OPEN!** Don't close it.

### Step 2: Start Frontend Server
1. Open **ANOTHER Command Prompt** window (new window)
2. Navigate to project folder:
   ```cmd
   cd "C:\Users\Administrator\Desktop\sgs 2"
   ```
3. Go to frontend folder:
   ```cmd
   cd frontend
   ```
4. Start the server:
   ```cmd
   npm start
   ```
5. Wait 30-60 seconds. Browser will automatically open at:
   ```
   http://localhost:3000
   ```
6. **KEEP THIS WINDOW OPEN TOO!**

---

## 🎯 DEMO ACCOUNTS FOR REVIEW

### 👤 User Account (Citizen)
You need to **register first** on the website:
- Go to http://localhost:3000/register
- Fill in any details
- Example:
  - Name: John Doe
  - Email: john@example.com
  - Phone: 1234567890
  - Password: password123

### 👨‍💼 Admin Account
**Already created for you!**
- Email: `admin@grievance.com`
- Password: `admin123`
- Login at: http://localhost:3000/admin/login

---

## 📝 DEMO FLOW FOR REVIEW

### Part 1: User Flow (5 minutes)

1. **Register User**
   - Go to http://localhost:3000
   - Click "Register here"
   - Fill form and submit

2. **Login as User**
   - Email: (your registered email)
   - Password: (your password)

3. **View Dashboard**
   - See statistics
   - Notice the clean UI

4. **Submit Complaint**
   - Click "Submit New Complaint"
   - Example complaint:
     - Title: "Street Light Not Working"
     - Category: "Electricity"
     - Location: "Main Street, Block A"
     - Description: "This is urgent and needs immediate attention"
   - Submit and notice **Priority = High** (automatic!)

5. **View Complaints**
   - Click "View All Complaints"
   - See your complaint with badges
   - Click "View Details"

### Part 2: Admin Flow (5 minutes)

1. **Logout from User**
   - Click logout button

2. **Login as Admin**
   - Go to http://localhost:3000/admin/login
   - Email: `admin@grievance.com`
   - Password: `admin123`

3. **View Admin Dashboard**
   - See all statistics:
     - Total Users
     - Total Complaints
     - Pending/In Progress/Resolved
     - Priority breakdown
   - Scroll down to see **ALL complaints from ALL users**

4. **Manage Complaints**
   - See table with all complaint details
   - See user information (name, email)
   - **Change status** using dropdown:
     - Select "In Progress" or "Resolved"
     - Status updates immediately!

5. **Show Features**
   - Point out user details in table
   - Show priority badges
   - Demonstrate status change

---

## 🎨 KEY FEATURES TO HIGHLIGHT IN REVIEW

### ✅ Completed Features (50%)

1. **User Management**
   - Registration with validation
   - Login with JWT authentication
   - Secure password hashing

2. **Complaint System**
   - Submit complaints with details
   - Automatic priority assignment
   - View all complaints
   - View detailed complaint info

3. **Admin Dashboard**
   - Login separately from users
   - View all system statistics
   - See all complaints from all users
   - Update complaint status
   - View user information

4. **Rule-Based Priority**
   - **High**: Keywords (urgent, emergency, critical) OR Categories (health, safety, water, electricity)
   - **Medium**: Keywords (problem, issue, broken, damaged)
   - **Low**: Default

5. **Beautiful UI**
   - Gradient backgrounds
   - Smooth animations
   - Responsive design
   - Toast notifications
   - Timeline view

6. **Database**
   - MySQL integration
   - 4 tables (users, complaints, escalation_log, notifications)
   - Proper relationships

---

## 🔧 TROUBLESHOOTING

### Problem: "Port 5000 already in use"
**Solution:**
```cmd
# Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Problem: "Port 3000 already in use"
**Solution:**
```cmd
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Problem: Backend won't start
**Solution:**
1. Make sure MySQL is running
2. Check if you're in the correct folder (`backend-node`)
3. Try: `npm install` then `npm start`

### Problem: Frontend won't start
**Solution:**
1. Check if you're in the correct folder (`frontend`)
2. Wait 60 seconds for compilation
3. Try: `npm install` then `npm start`

### Problem: Can't login as admin
**Solution:**
Run this command in backend-node folder:
```cmd
node create-admin.js
```

---

## 📊 WHAT TO SHOW IN REVIEW

### 1. Architecture (2 minutes)
- Show the workflow diagram
- Explain: User → Submit → Priority Assignment → Store → Admin View

### 2. User Demo (5 minutes)
- Register → Login → Dashboard → Submit Complaint → View Complaints

### 3. Admin Demo (5 minutes)
- Admin Login → Dashboard Stats → View All Complaints → Update Status

### 4. Technical Features (3 minutes)
- Rule-based priority assignment
- JWT authentication
- MySQL database
- Responsive UI with animations

### 5. Code Walkthrough (5 minutes)
- Show backend API (server.js)
- Show frontend components
- Show database schema

---

## 📁 PROJECT STRUCTURE

```
sgs 2/
├── backend-node/              ← Backend Server
│   ├── server.js             ← Main API file
│   ├── create-admin.js       ← Admin creation script
│   └── .env                  ← Database config
│
├── frontend/                  ← Frontend App
│   └── src/
│       ├── pages/            ← All pages
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── Dashboard.js
│       │   ├── AdminLogin.js
│       │   └── AdminDashboard.js
│       └── App.js            ← Routes
│
└── HOW_TO_RUN_FOR_REVIEW.md  ← This file!
```

---

## ⏱️ TIMELINE FOR TOMORROW

### Before Review (10 minutes)
1. Start backend server (2 min)
2. Start frontend server (2 min)
3. Create a test user account (2 min)
4. Submit 2-3 test complaints (2 min)
5. Test admin login (2 min)

### During Review (20 minutes)
1. Show architecture (2 min)
2. Demo user flow (5 min)
3. Demo admin flow (5 min)
4. Explain technical features (5 min)
5. Q&A (3 min)

---

## 🎯 IMPORTANT NOTES

1. **Keep both terminal windows open** during the review
2. **Don't close the browser** once it opens
3. **Admin credentials**: admin@grievance.com / admin123
4. **Backend**: http://localhost:5000
5. **Frontend**: http://localhost:3000
6. **Admin login**: http://localhost:3000/admin/login

---

## ✅ PRE-REVIEW CHECKLIST

- [ ] MySQL service is running
- [ ] Backend server starts successfully
- [ ] Frontend server starts successfully
- [ ] Can register a new user
- [ ] Can login as user
- [ ] Can submit a complaint
- [ ] Can view complaints
- [ ] Can login as admin (admin@grievance.com / admin123)
- [ ] Admin can see all complaints
- [ ] Admin can change complaint status
- [ ] Both servers are running during review

---

## 🎉 YOU'RE READY!

Just follow these steps tomorrow:
1. Open 2 command prompts
2. Start backend: `cd backend-node` → `npm start`
3. Start frontend: `cd frontend` → `npm start`
4. Open browser: http://localhost:3000
5. Show the demo!

**Good luck with your review! 🚀**
