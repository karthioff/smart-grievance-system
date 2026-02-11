# 🔗 HOW TO CONNECT MySQL WORKBENCH TO YOUR PROJECT

## 📋 Overview
This guide will help you connect MySQL Workbench to your project's database so you can view and manage all complaint data visually.

---

## 🎯 STEP-BY-STEP CONNECTION GUIDE

### **STEP 1: Open MySQL Workbench (Already Done!)**
✅ You already have MySQL Workbench open - Great!

### **STEP 2: Create New Connection**

1. **Look for the "+" icon** next to "MySQL Connections" on the home screen
2. **Click the "+" icon** to create a new connection

### **STEP 3: Configure Connection Settings**

**Fill in these details:**

**Connection Name**: `Grievance System Database`

**Connection Method**: `Standard (TCP/IP)`

**Hostname**: `localhost` (or `127.0.0.1`)

**Port**: `3306` (default MySQL port)

**Username**: `root`

**Password**: Click "Store in Vault..." and enter: `root123`

**Default Schema**: `grievance_system`

### **STEP 4: Test Connection**

1. **Click "Test Connection" button**
2. **If successful**: You'll see "Successfully made the MySQL connection"
3. **If failed**: Check your MySQL service is running

### **STEP 5: Save and Connect**

1. **Click "OK"** to save the connection
2. **Double-click** the new connection tile to connect
3. **You should now see the database interface**

---

## 🗄️ STEP 6: EXPLORE YOUR PROJECT DATABASE

### **Once connected, you'll see:**

**Left Panel - Navigator:**
- **Schemas** section
- **grievance_system** database
- **4 Tables**:
  - `users` (all registered users)
  - `complaints` (all submitted complaints)
  - `escalation_log` (escalation history)
  - `notifications` (system notifications)

### **To View Data:**

1. **Expand "grievance_system"** in the left panel
2. **Expand "Tables"**
3. **Right-click on any table** (e.g., `complaints`)
4. **Select "Select Rows - Limit 1000"**
5. **See all your data!**

---

## 📊 USEFUL QUERIES FOR YOUR PROJECT

### **Query 1: See All Complaints with User Names**
```sql
SELECT 
    c.id AS 'Complaint ID',
    u.name AS 'User Name',
    u.email AS 'Email',
    c.title AS 'Title',
    c.description AS 'Description',
    c.category AS 'Category',
    c.priority AS 'Priority',
    c.status AS 'Status',
    c.created_at AS 'Date Submitted'
FROM complaints c
JOIN users u ON c.user_id = u.id
ORDER BY c.created_at DESC;
```

### **Query 2: Count Complaints by Priority**
```sql
SELECT 
    priority,
    COUNT(*) as 'Number of Complaints'
FROM complaints 
GROUP BY priority
ORDER BY 
    CASE priority 
        WHEN 'High' THEN 1 
        WHEN 'Medium' THEN 2 
        WHEN 'Low' THEN 3 
    END;
```

### **Query 3: Count Complaints by Status**
```sql
SELECT 
    status,
    COUNT(*) as 'Number of Complaints'
FROM complaints 
GROUP BY status;
```

### **Query 4: See All Users**
```sql
SELECT 
    id,
    name,
    email,
    phone,
    role,
    created_at
FROM users
ORDER BY created_at DESC;
```

### **Query 5: Recent Complaints (Last 7 days)**
```sql
SELECT 
    c.title,
    u.name AS 'User Name',
    c.priority,
    c.status,
    c.created_at
FROM complaints c
JOIN users u ON c.user_id = u.id
WHERE c.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY c.created_at DESC;
```

---

## 🎯 HOW TO RUN QUERIES

### **Method 1: Query Tab**
1. **Click the "SQL" icon** in the toolbar (or Ctrl+T)
2. **Type your query** in the editor
3. **Click the lightning bolt** icon to execute
4. **See results** in the bottom panel

### **Method 2: Right-click Tables**
1. **Right-click on table name** (e.g., `complaints`)
2. **Select "Select Rows - Limit 1000"**
3. **Instant data view**

---

## 🔧 TROUBLESHOOTING

### **Problem: "Can't connect to MySQL server"**
**Solutions:**
1. **Check MySQL service is running**:
   - Press `Win + R`, type `services.msc`
   - Find "MySQL96" service
   - Right-click → Start (if not running)

2. **Verify credentials**:
   - Username: `root`
   - Password: `root123`
   - Port: `3306`

### **Problem: "Access denied for user 'root'"**
**Solution:**
- Double-check password: `root123`
- Try connecting without password first
- Reset MySQL root password if needed

### **Problem: "Database 'grievance_system' doesn't exist"**
**Solution:**
1. **Start your backend server first**:
   ```cmd
   cd backend-node
   npm start
   ```
2. **The database is created automatically when backend starts**

### **Problem: "No tables visible"**
**Solution:**
1. **Refresh the schema**:
   - Right-click "grievance_system" → Refresh All
2. **Make sure backend has run at least once**

---

## 📱 DEMO FOR YOUR REVIEW

### **Show Database Connection During Review:**

1. **Open MySQL Workbench**
2. **Connect to grievance_system database**
3. **Show the 4 tables**
4. **Run Query 1** to show all complaints with user names
5. **Explain**: "This is where all complaint data is stored"
6. **Show**: Real-time data from your web application

### **Key Points to Mention:**
- "All data from the web app is stored here"
- "We can see user information and complaint details"
- "Priority levels assigned by our AI system"
- "Admin can update status, and it reflects here"
- "Database has proper relationships between tables"

---

## 🎨 WORKBENCH FEATURES TO SHOW

### **Visual Database Design:**
1. **Go to "Database" menu → "Reverse Engineer"**
2. **Select your connection**
3. **Choose "grievance_system"**
4. **See visual diagram of table relationships**

### **Data Export:**
1. **Go to "Server" menu → "Data Export"**
2. **Select "grievance_system"**
3. **Export all data as backup**

### **Performance Monitoring:**
1. **Go to "Performance" tab**
2. **See database performance metrics**

---

## 📊 WHAT YOU'LL SEE IN WORKBENCH

### **Users Table Data:**
```
id | name      | email           | phone      | role    | created_at
1  | Admin     | admin@...       | 9999999999 | admin   | 2024-02-09
2  | John Doe  | john@...        | 1234567890 | citizen | 2024-02-09
```

### **Complaints Table Data:**
```
id | user_id | title              | priority | status  | created_at
1  | 2       | Street Light Issue | High     | Pending | 2024-02-09
2  | 2       | Broken Sidewalk    | Medium   | Pending | 2024-02-09
```

---

## ✅ CONNECTION SUCCESS CHECKLIST

After connecting, you should be able to:
- [ ] See "grievance_system" database in left panel
- [ ] Expand and see 4 tables (users, complaints, escalation_log, notifications)
- [ ] Right-click tables and view data
- [ ] Run SQL queries successfully
- [ ] See data that matches your web application
- [ ] Export data if needed

---

## 🎓 BENEFITS OF WORKBENCH CONNECTION

1. **Visual Data Management**: See all data in tables
2. **Advanced Queries**: Run complex SQL queries
3. **Database Design**: View table relationships
4. **Data Export**: Backup your data
5. **Performance Monitoring**: Check database performance
6. **Professional Tool**: Industry-standard database management

---

## 🚀 ADVANCED FEATURES (OPTIONAL)

### **Create Views for Common Queries:**
```sql
CREATE VIEW complaint_summary AS
SELECT 
    c.id,
    u.name,
    c.title,
    c.priority,
    c.status,
    c.created_at
FROM complaints c
JOIN users u ON c.user_id = u.id;
```

### **Add Indexes for Better Performance:**
```sql
CREATE INDEX idx_complaint_priority ON complaints(priority);
CREATE INDEX idx_complaint_status ON complaints(status);
```

---

## 🎯 QUICK REFERENCE

**Connection Details:**
- Host: `localhost`
- Port: `3306`
- Username: `root`
- Password: `root123`
- Database: `grievance_system`

**Essential Queries:**
- All complaints: `SELECT * FROM complaints;`
- All users: `SELECT * FROM users;`
- Complaints with users: See Query 1 above

**Troubleshooting:**
- Start MySQL service if connection fails
- Start backend server to create database
- Refresh schema if tables not visible

---

## 🎉 SUCCESS!

Once connected, you'll have:
✅ Visual access to all your project data
✅ Ability to run advanced queries
✅ Professional database management interface
✅ Perfect tool for demonstrating data storage in your review

**MySQL Workbench is now connected to your Smart Public Grievance Escalation System!** 🚀

---

*Use this connection to show the technical depth of your project during reviews and presentations.*