# 📊 WHERE TO SEE STORED COMPLAINT DATA ON YOUR LAPTOP

## 🎯 Overview
When users submit complaints through your system, the data is stored in your MySQL database. Here's how to view and access that stored data.

---

## 🗄️ DATA STORAGE LOCATION

**Database Name**: `grievance_system`
**Location**: MySQL Server on your laptop
**Tables**: 4 tables store all the data

---

## 🔍 METHOD 1: VIEW DATA THROUGH ADMIN DASHBOARD (EASIEST)

### **Step 1: Start Your Servers**
```cmd
# Terminal 1 - Backend
cd backend-node
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

### **Step 2: Login as Admin**
1. Go to: http://localhost:3000/admin/login
2. Email: `admin@grievance.com`
3. Password: `admin123`

### **Step 3: View All Stored Data**
- **Dashboard Statistics**: See total users, complaints, priorities
- **Complaints Table**: Scroll down to see ALL complaints from ALL users
- **User Information**: Name, email, phone of each user
- **Complaint Details**: Title, description, category, priority, status, date

**This shows you ALL the data stored in your database in a nice visual format!** ✅

---

## 🖥️ METHOD 2: MySQL WORKBENCH (DATABASE VIEWER)

### **Step 1: Open MySQL Workbench**
1. Search for "MySQL Workbench" in Windows Start Menu
2. Click to open it

### **Step 2: Connect to Database**
1. Click on "Local instance MySQL96" (or similar)
2. Enter your MySQL password: `root123`
3. Click "OK"

### **Step 3: Select Database**
1. In the left panel, look for "grievance_system"
2. Click the arrow to expand it
3. You'll see 4 tables:
   - `users`
   - `complaints` 
   - `escalation_log`
   - `notifications`

### **Step 4: View Data**
**To see all users:**
```sql
SELECT * FROM grievance_system.users;
```

**To see all complaints:**
```sql
SELECT * FROM grievance_system.complaints;
```

**To see complaints with user names:**
```sql
SELECT 
    c.id,
    c.title,
    c.description,
    c.category,
    c.priority,
    c.status,
    c.created_at,
    u.name as user_name,
    u.email as user_email
FROM grievance_system.complaints c
JOIN grievance_system.users u ON c.user_id = u.id
ORDER BY c.created_at DESC;
```

---

## 💻 METHOD 3: COMMAND LINE (MYSQL CLI)

### **Step 1: Open Command Prompt**
1. Press `Win + R`
2. Type `cmd` and press Enter

### **Step 2: Connect to MySQL**
```cmd
"C:\Program Files\MySQL\MySQL Server 9.6\bin\mysql.exe" -u root -p
```
Enter password: `root123`

### **Step 3: Use Database**
```sql
USE grievance_system;
```

### **Step 4: View Data**
```sql
-- See all tables
SHOW TABLES;

-- See all users
SELECT * FROM users;

-- See all complaints
SELECT * FROM complaints;

-- See complaints with user details
SELECT 
    c.id,
    c.title,
    c.description,
    c.priority,
    c.status,
    u.name,
    u.email
FROM complaints c 
JOIN users u ON c.user_id = u.id;
```

---

## 📁 METHOD 4: DATABASE FILES LOCATION

### **Physical Database Files**:
The actual database files are stored at:
```
C:\ProgramData\MySQL\MySQL Server 9.6\Data\grievance_system\
```

**Files you'll find:**
- `users.ibd` - User data file
- `complaints.ibd` - Complaints data file
- `escalation_log.ibd` - Escalation data file
- `notifications.ibd` - Notifications data file

**Note**: These are binary files, you can't read them directly. Use MySQL Workbench or command line instead.

---

## 📊 WHAT DATA IS STORED

### **Users Table**:
```
- id (unique number)
- name (full name)
- email (email address)
- phone (phone number)
- password (encrypted hash)
- address (user address)
- role (citizen/admin)
- created_at (registration date)
```

### **Complaints Table**:
```
- id (unique complaint number)
- user_id (who submitted it)
- title (complaint title)
- description (full complaint text)
- category (Water Supply, Electricity, etc.)
- location (where the issue is)
- priority (High/Medium/Low - assigned by AI)
- status (Pending/In Progress/Resolved/Closed)
- assigned_to (which officer, if any)
- created_at (when submitted)
- updated_at (when last modified)
```

---

## 🎯 DEMO FOR REVIEW - SHOW STORED DATA

### **During Your Review, Show This:**

1. **Submit a Test Complaint**:
   - Login as user
   - Submit complaint: "Emergency water leak, urgent help needed"
   - Note the priority assigned (should be High)

2. **Show Data in Admin Dashboard**:
   - Logout from user
   - Login as admin
   - Show the complaint appears in the table
   - Show user details are visible
   - Show priority was automatically assigned

3. **Show Data in MySQL Workbench** (Optional):
   - Open MySQL Workbench
   - Run query to show the same data
   - Explain this is where data is actually stored

### **Key Points to Mention**:
- "All complaint data is stored locally on this laptop"
- "Data includes user information and complaint details"
- "Priority is automatically assigned by our AI system"
- "Admin can see all complaints from all users"
- "Data is stored securely in MySQL database"

---

## 🔍 SAMPLE DATA QUERIES

### **See All Complaints with User Names**:
```sql
SELECT 
    c.id AS 'Complaint ID',
    u.name AS 'User Name',
    u.email AS 'Email',
    c.title AS 'Title',
    c.category AS 'Category',
    c.priority AS 'Priority',
    c.status AS 'Status',
    c.created_at AS 'Submitted Date'
FROM complaints c
JOIN users u ON c.user_id = u.id
ORDER BY c.created_at DESC;
```

### **Count Complaints by Priority**:
```sql
SELECT 
    priority,
    COUNT(*) as count
FROM complaints 
GROUP BY priority;
```

### **Count Complaints by Status**:
```sql
SELECT 
    status,
    COUNT(*) as count
FROM complaints 
GROUP BY status;
```

### **See Recent Complaints (Last 7 days)**:
```sql
SELECT 
    c.title,
    u.name,
    c.priority,
    c.created_at
FROM complaints c
JOIN users u ON c.user_id = u.id
WHERE c.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY c.created_at DESC;
```

---

## 📱 BACKUP YOUR DATA

### **To Export All Data**:
1. Open MySQL Workbench
2. Go to "Server" → "Data Export"
3. Select "grievance_system" database
4. Choose export location
5. Click "Start Export"

### **This creates a backup file with all your complaint data!**

---

## 🎓 TALKING POINTS FOR REVIEW

### **When asked "Where is the data stored?"**
**Answer**: "All complaint data is stored locally in a MySQL database on this laptop. The database is called 'grievance_system' and contains 4 tables: users, complaints, escalation_log, and notifications. We can view this data through the admin dashboard or directly through MySQL Workbench."

### **When asked "Can you show me the stored data?"**
**Answer**: "Absolutely! Let me show you in two ways:
1. Through our admin dashboard - this shows all complaints in a user-friendly format
2. Through MySQL Workbench - this shows the raw database data where everything is actually stored"

### **When asked "How much data can it store?"**
**Answer**: "MySQL can handle millions of records. Our current setup can easily store thousands of users and complaints. Each complaint includes the user's information, complaint details, priority level assigned by our AI, and status tracking."

---

## ✅ SUMMARY

**3 Easy Ways to See Stored Data:**

1. **Admin Dashboard** (Easiest): 
   - http://localhost:3000/admin/login
   - Login: admin@grievance.com / admin123
   - See all data in nice tables

2. **MySQL Workbench** (Visual):
   - Open MySQL Workbench
   - Connect to database
   - Run queries to see raw data

3. **Command Line** (Advanced):
   - Use MySQL CLI
   - Run SQL commands
   - See data in terminal

**The admin dashboard is the best way to show stored data during your review!** 🎯

---

*Use this guide to demonstrate how complaint data is stored and retrieved during your review presentation.*