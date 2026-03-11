# Smart Public Grievance Escalation System

## 🎯 Project Status: 100% COMPLETE

A full-stack web application for managing public grievances with AI-based priority assignment, automatic officer assignment, SLA tracking, and auto-escalation.

---

## ✨ Features

### Phase 1 (50%)
- ✅ User Registration & Login
- ✅ JWT Authentication & Security
- ✅ Submit Complaints
- ✅ AI-Based Priority Assignment (Rule-Based)
- ✅ Admin Dashboard
- ✅ Complaint Management
- ✅ Complaint History View

### Phase 2 (50%)
- ✅ Department Officer Management
- ✅ Auto-Assignment to Officers
- ✅ SLA Timer (24/48/72 hours)
- ✅ Automatic Escalation System
- ✅ In-App Notifications
- ✅ Enhanced Analytics Dashboard

---

## 🛠️ Technology Stack

**Frontend:**
- React.js 18
- Framer Motion (Animations)
- Axios (API calls)
- React Router (Navigation)

**Backend:**
- Node.js
- Express.js
- MySQL2 (Database driver)

**Database:**
- MySQL 8.4.0

**Security:**
- bcryptjs (Password hashing)
- JWT (Authentication)
- CORS (Access control)
- dotenv (Environment variables)
- Parameterized Queries (SQL injection prevention)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MySQL Server (v8.4+)
- npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/karthioff/smart-grievance-system.git
cd smart-grievance-system
```

2. **Setup Backend**
```bash
cd backend-node
npm install
```

3. **Configure Environment**
Create `.env` file in `backend-node/`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123
DB_NAME=grievance_system
JWT_SECRET_KEY=your-secret-key
PORT=5000
```

4. **Create Officers**
```bash
node create-officers.js
```

5. **Setup Frontend**
```bash
cd ../frontend
npm install
```

6. **Start Servers**
```bash
# Use the batch file (Windows)
START_PROJECT.bat

# Or manually:
# Terminal 1 - Backend
cd backend-node
node server.js

# Terminal 2 - Frontend
cd frontend
npm start
```

7. **Access Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin: http://localhost:3000/admin

---

## 👥 Default Credentials

### Admin
- Email: admin@grievance.com
- Password: admin123

### Officers
- Email: [department].officer@gov.in
- Password: officer123
- Departments: water, electricity, roads, health, sanitation, safety

---

## 📊 System Workflow

```
1. Citizen registers/logs in
2. Submits complaint with details
3. AI assigns priority (High/Medium/Low)
4. SLA deadline calculated automatically
5. Officer auto-assigned based on category
6. Notifications sent to user and officer
7. Officer/Admin updates status
8. If SLA exceeded → Auto-escalation
9. User receives notifications
10. Complaint resolved
```

---

## 🔔 Notification System

**Notifications created for:**
- Complaint submission
- Officer assignment
- Status updates
- Escalations

**Features:**
- Real-time bell icon with unread count
- Notification dropdown
- Mark as read functionality
- Auto-refresh every 30 seconds

---

## ⏰ SLA System

**Deadlines based on priority:**
- High Priority: 24 hours
- Medium Priority: 48 hours
- Low Priority: 72 hours

**Auto-Escalation:**
- Background job runs every 5 minutes
- Escalates overdue complaints
- Logs escalation history
- Notifies users

---

## 📈 Analytics

**Admin Dashboard Statistics:**
- Total Users
- Total Officers
- Total Complaints
- Pending Complaints
- In Progress
- Resolved
- Escalated
- High Priority Count
- Overdue (SLA Breach)
- Average Resolution Time

---

## 🔒 Security Features

1. **Password Hashing** - bcryptjs with salt rounds
2. **JWT Authentication** - 24-hour token expiry
3. **CORS Protection** - Controlled API access
4. **Environment Variables** - Sensitive data protection
5. **Parameterized Queries** - SQL injection prevention

---

## 📁 Project Structure

```
smart-grievance-system/
├── backend-node/
│   ├── server.js              # Main server file
│   ├── create-admin.js        # Admin creation script
│   ├── create-officers.js     # Officer creation script
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NotificationBell.js
│   │   │   └── PrivateRoute.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── SubmitComplaint.js
│   │   │   ├── ComplaintList.js
│   │   │   └── AdminDashboard.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.js
│   └── package.json
├── PHASE_2_IMPLEMENTATION.md
├── SETUP_PHASE_2.md
├── COMPLETE_REVIEW_GUIDE.md
└── README.md
```

---

## 🎓 API Endpoints

### Authentication
- POST `/api/register` - User registration
- POST `/api/login` - User login
- POST `/api/admin/login` - Admin login

### Complaints
- POST `/api/complaints` - Submit complaint
- GET `/api/complaints` - Get user complaints
- GET `/api/complaints/:id` - Get single complaint

### Admin
- GET `/api/admin/complaints` - Get all complaints
- GET `/api/admin/stats` - Get statistics
- PUT `/api/admin/complaints/:id/status` - Update status

### Notifications
- GET `/api/notifications` - Get notifications
- GET `/api/notifications/unread-count` - Get unread count
- PUT `/api/notifications/:id/read` - Mark as read
- PUT `/api/notifications/read-all` - Mark all as read

---

## 🐛 Troubleshooting

**Database Connection Error:**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

**Officers Not Assigned:**
- Run `node create-officers.js`
- Check officers exist in database

**Notifications Not Showing:**
- Clear browser cache
- Check browser console for errors
- Verify token is valid

---

## 📝 Documentation

- `PHASE_2_IMPLEMENTATION.md` - Detailed Phase 2 features
- `SETUP_PHASE_2.md` - Quick setup guide
- `COMPLETE_REVIEW_GUIDE.md` - Full project documentation

---

## 🎯 Future Enhancements

- Email/SMS notifications
- Officer-specific dashboard
- Charts and graphs
- WebSocket for real-time updates
- File upload for complaints
- Mobile app

---

## 👨‍💻 Developer

**GitHub:** https://github.com/karthioff/smart-grievance-system

---

## 📄 License

This project is for educational purposes.

---

## 🎉 Project Complete!

All features implemented and tested. Ready for deployment!

**Last Updated:** February 2026
