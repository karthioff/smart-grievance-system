# 🚀 Quick Start Guide

## ✅ Project is Currently RUNNING!

### Running Services:
- **Backend**: http://localhost:5000 ✅
- **Frontend**: http://localhost:3000 ✅

### 🌐 Access the Application

**Open your browser and go to:**
```
http://localhost:3000
```

### 📝 Quick Test

1. **Register a new account**:
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Password: password123

2. **Login** with the credentials above

3. **Submit a test complaint**:
   - Title: "Street Light Not Working"
   - Category: "Electricity"
   - Location: "Main Street"
   - Description: "This is urgent and needs immediate attention"
   - Notice: Priority will be automatically set to "High"!

4. **View your complaints** from the dashboard

---

## 🔄 If You Need to Restart

### Stop Servers:
```cmd
# Press Ctrl+C in both terminal windows
```

### Start Backend:
```cmd
cd backend-node
npm start
```

### Start Frontend (in new terminal):
```cmd
cd frontend
npm start
```

---

## 📊 Current Status

✅ **50% Complete - Ready for First Review**

**Working Features:**
- User Registration & Login
- Submit Complaints
- View All Complaints
- View Complaint Details
- Automatic Priority Assignment
- Beautiful Animated UI
- MySQL Database Integration

**Coming in Full Version:**
- Officer Dashboard
- Admin Panel
- SLA Tracking
- Automatic Escalation
- Notifications
- Analytics & Reports

---

## 🎯 Project Highlights

### Rule-Based Priority System
The system automatically assigns priority based on:

**High Priority** 🔴
- Keywords: urgent, emergency, critical, danger, life, death, severe, immediate
- Categories: health, safety, water, electricity

**Medium Priority** 🟡
- Keywords: problem, issue, broken, damaged, not working

**Low Priority** 🟢
- All other complaints

### Beautiful UI Features
- Smooth gradient backgrounds
- Animated transitions
- Hover effects
- Responsive design
- Toast notifications
- Timeline view

---

## 📞 Need Help?

### Check Server Status:
```cmd
# Backend health check
curl http://localhost:5000/api/health

# Should return: {"status":"ok","message":"Server is running"}
```

### Common Issues:

**Port Already in Use:**
- Close other applications using ports 3000 or 5000
- Or change ports in configuration files

**MySQL Connection Error:**
- Ensure MySQL service is running
- Check credentials in `backend-node/.env`

**Frontend Not Loading:**
- Wait 30-60 seconds for compilation
- Check terminal for errors
- Try refreshing browser

---

## 🎉 Enjoy Your Grievance System!

The project is fully set up and running. Test all features and prepare for your first review!

When ready for 100% completion, just say: **"Complete full project"**
