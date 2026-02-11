# Smart Public Grievance Escalation System

A comprehensive web application for managing public grievances with automatic priority assignment, SLA tracking, and escalation management.

## Features

### Current Implementation (50% Complete)
- ✅ User Registration & Authentication (JWT-based)
- ✅ Citizen Login/Logout
- ✅ Submit Grievance/Complaint
- ✅ Rule-Based Priority Assignment (High/Medium/Low)
- ✅ Store Complaints in MySQL Database
- ✅ View All Complaints
- ✅ View Complaint Details
- ✅ Responsive UI with Smooth Animations
- ✅ Real-time Status Tracking

### Upcoming Features (Next 50%)
- ⏳ Officer Dashboard & Login
- ⏳ Admin Dashboard
- ⏳ SLA Timer & Tracking
- ⏳ Automatic Escalation System
- ⏳ Email/SMS Notifications
- ⏳ Complaint Assignment to Officers
- ⏳ Status Update by Officers
- ⏳ Escalation History & Logs
- ⏳ Analytics & Reports

## Tech Stack

### Backend
- Python Flask
- MySQL Database
- JWT Authentication
- Flask-CORS
- Flask-Bcrypt

### Frontend
- React 18
- React Router v6
- Framer Motion (Animations)
- Axios (API calls)
- React Toastify (Notifications)
- Lucide React (Icons)

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL Community Server

### Backend Setup

1. Navigate to backend directory:
```cmd
cd backend
```

2. Create virtual environment:
```cmd
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies:
```cmd
pip install -r requirements.txt
```

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update MySQL credentials in `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=grievance_system
JWT_SECRET_KEY=your-secret-key-here
```

5. Setup database:
```cmd
python database_setup.py
```

6. Run the backend server:
```cmd
python app.py
```

Backend will run on: `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```cmd
cd frontend
```

2. Install dependencies:
```cmd
npm install
```

3. Start the development server:
```cmd
npm start
```

Frontend will run on: `http://localhost:3000`

## Database Schema

### Users Table
- id (Primary Key)
- name
- email (Unique)
- phone
- password (Hashed)
- address
- role (citizen/officer/admin)
- created_at

### Complaints Table
- id (Primary Key)
- user_id (Foreign Key)
- title
- description
- category
- location
- priority (High/Medium/Low)
- status (Pending/In Progress/Resolved/Closed/Escalated)
- assigned_to
- sla_deadline
- created_at
- updated_at
- resolved_at

### Escalation Log Table
- id (Primary Key)
- complaint_id (Foreign Key)
- escalated_from
- escalated_to
- reason
- escalated_at

### Notifications Table
- id (Primary Key)
- user_id (Foreign Key)
- complaint_id (Foreign Key)
- message
- is_read
- created_at

## Rule-Based Priority Assignment

The system automatically assigns priority based on:

### High Priority
- Keywords: urgent, emergency, critical, danger, life, death, severe, immediate
- Categories: health, safety, water, electricity

### Medium Priority
- Keywords: problem, issue, broken, damaged, not working

### Low Priority
- Default for all other complaints

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Complaints
- `POST /api/complaints` - Submit new complaint (Protected)
- `GET /api/complaints` - Get all user complaints (Protected)
- `GET /api/complaints/:id` - Get complaint details (Protected)

### Health Check
- `GET /api/health` - Server health check

## Project Structure

```
grievance-system/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── database_setup.py      # Database initialization
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Environment variables template
│   └── .env                  # Your environment variables (create this)
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── SubmitComplaint.js
│   │   │   ├── ComplaintList.js
│   │   │   ├── ComplaintDetail.js
│   │   │   └── *.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## Usage

1. **Register**: Create a new account with your details
2. **Login**: Sign in with your credentials
3. **Dashboard**: View statistics and quick actions
4. **Submit Complaint**: Fill in the complaint form with title, category, location, and description
5. **View Complaints**: See all your submitted complaints with status and priority
6. **Track Status**: Click on any complaint to view detailed information and timeline

## Troubleshooting

### MySQL Connection Issues
- Ensure MySQL server is running
- Verify credentials in `.env` file
- Check if port 3306 is available

### Backend Not Starting
- Activate virtual environment
- Install all dependencies: `pip install -r requirements.txt`
- Check Python version (3.8+)

### Frontend Not Starting
- Clear node_modules: `rmdir /s /q node_modules`
- Reinstall: `npm install`
- Check Node version (16+)

### CORS Issues
- Ensure backend is running on port 5000
- Check Flask-CORS configuration in `app.py`

## Development Notes

- Backend runs on port 5000
- Frontend runs on port 3000
- JWT tokens expire after 24 hours
- All passwords are hashed using bcrypt
- API requires Bearer token for protected routes

## Next Steps for Full Implementation

1. Implement Officer Dashboard
2. Add Admin Panel
3. Create SLA Timer System
4. Build Automatic Escalation Logic
5. Integrate Notification Service
6. Add File Upload for Complaints
7. Implement Search & Filter
8. Add Analytics Dashboard
9. Create Mobile Responsive Views
10. Add Unit Tests

## License

This project is for educational purposes.

## Support

For issues or questions, please contact the development team.
