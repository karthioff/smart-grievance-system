# Quick Setup Guide - Smart Public Grievance Escalation System

## Step-by-Step Installation (Windows)

### Step 1: Install MySQL (If not already installed)
1. MySQL Community Server should already be installed on your laptop
2. Remember your MySQL root password
3. Start MySQL service from Windows Services or MySQL Workbench

### Step 2: Configure Backend

1. Open Command Prompt in the project directory

2. Navigate to backend folder:
```cmd
cd backend
```

3. Create Python virtual environment:
```cmd
python -m venv venv
```

4. Activate virtual environment:
```cmd
venv\Scripts\activate
```

5. Install Python packages:
```cmd
pip install -r requirements.txt
```

6. Edit the `.env` file and add your MySQL password:
   - Open `backend\.env` in notepad
   - Change `DB_PASSWORD=` to `DB_PASSWORD=your_mysql_root_password`
   - Save the file

7. Create database and tables:
```cmd
python database_setup.py
```

You should see:
```
✓ Database 'grievance_system' created successfully
✓ Table 'users' created successfully
✓ Table 'complaints' created successfully
✓ Table 'escalation_log' created successfully
✓ Table 'notifications' created successfully
```

8. Start the backend server:
```cmd
python app.py
```

Backend is now running on `http://localhost:5000`

### Step 3: Setup Frontend

1. Open a NEW Command Prompt window

2. Navigate to frontend folder:
```cmd
cd frontend
```

3. Install Node packages:
```cmd
npm install
```

This will take a few minutes to download all dependencies.

4. Start the frontend development server:
```cmd
npm start
```

Frontend will automatically open in your browser at `http://localhost:3000`

## Testing the Application

### 1. Register a New User
- Click "Register here" on the login page
- Fill in your details:
  - Full Name: Test User
  - Email: test@example.com
  - Phone: 1234567890
  - Address: Test Address
  - Password: password123
- Click "Register"

### 2. Login
- Use the credentials you just created
- Email: test@example.com
- Password: password123
- Click "Login"

### 3. Submit a Complaint
- Click "Submit New Complaint" on the dashboard
- Fill in the form:
  - Title: "Street Light Not Working"
  - Category: "Electricity"
  - Location: "Main Street, Block A"
  - Description: "The street light has been broken for 3 days. This is urgent and needs immediate attention."
- Click "Submit Complaint"
- Notice the priority is automatically set to "High" (because of keywords: urgent, immediate, and category: electricity)

### 4. View Complaints
- Click "View All Complaints" on the dashboard
- You'll see your submitted complaint with priority and status badges
- Click "View Details" to see the full complaint information

## Troubleshooting

### Problem: "pip is not recognized"
**Solution**: Install Python from python.org and make sure to check "Add Python to PATH" during installation

### Problem: "npm is not recognized"
**Solution**: Install Node.js from nodejs.org

### Problem: "Access denied for user 'root'@'localhost'"
**Solution**: 
1. Open `backend\.env`
2. Update `DB_PASSWORD=your_actual_mysql_password`
3. Restart the backend server

### Problem: "Can't connect to MySQL server"
**Solution**: 
1. Open Windows Services (Win + R, type `services.msc`)
2. Find "MySQL" service
3. Right-click and select "Start"

### Problem: Frontend shows "Network Error"
**Solution**: Make sure the backend server is running on port 5000

### Problem: Port 3000 or 5000 already in use
**Solution**: 
- For backend: Edit `app.py` and change port number in the last line
- For frontend: Set PORT environment variable: `set PORT=3001` then `npm start`

## What's Working (50% Complete)

✅ User registration and login
✅ JWT authentication
✅ Submit complaints
✅ Automatic priority assignment (High/Medium/Low)
✅ View all complaints
✅ View complaint details
✅ Responsive design with animations
✅ Status tracking

## What's Coming Next (50% Remaining)

⏳ Officer dashboard
⏳ Admin panel
⏳ SLA timer and tracking
⏳ Automatic escalation
⏳ Email/SMS notifications
⏳ Complaint assignment
⏳ Status updates by officers
⏳ Analytics and reports

## Default MySQL Configuration

If you're using default MySQL installation:
- Host: localhost
- Port: 3306
- User: root
- Password: (your MySQL root password)
- Database: grievance_system (will be created automatically)

## Need Help?

1. Check if both backend and frontend servers are running
2. Check the console/terminal for error messages
3. Verify MySQL is running
4. Make sure all dependencies are installed
5. Check the `.env` file has correct MySQL credentials

## Quick Commands Reference

### Backend
```cmd
cd backend
venv\Scripts\activate
python app.py
```

### Frontend
```cmd
cd frontend
npm start
```

### Database Reset (if needed)
```cmd
cd backend
venv\Scripts\activate
python database_setup.py
```

This will recreate all tables (existing data will be preserved if tables already exist).
