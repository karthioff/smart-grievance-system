const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Twilio client configuration
let twilioClient = null;
try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_ACCOUNT_SID !== 'your-twilio-account-sid') {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('✓ Twilio SMS configured');
  }
} catch (error) {
  console.log('⚠ Twilio not configured (SMS disabled)');
}

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'grievance_system'
};

// Create database connection pool
let pool;

async function initializeDatabase() {
  try {
    // First connect without database to create it
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    console.log('✓ Database created/verified');
    await tempConnection.end();

    // Create connection pool
    pool = mysql.createPool(dbConfig);

    // Create tables
    await createTables();
    console.log('✓ All tables created/verified');
  } catch (error) {
    console.error('Database initialization error:', error.message);
    console.log('\n⚠ Please check your MySQL credentials in .env file');
    process.exit(1);
  }
}

async function createTables() {
  const connection = await pool.getConnection();

  try {
    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        address TEXT,
        role ENUM('citizen', 'officer', 'admin') DEFAULT 'citizen',
        department VARCHAR(100),
        created_at DATETIME NOT NULL,
        INDEX idx_email (email),
        INDEX idx_role (role)
      )
    `);

    // Complaints table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS complaints (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        location VARCHAR(255),
        priority ENUM('High', 'Medium', 'Low') DEFAULT 'Low',
        status ENUM('Pending', 'In Progress', 'Resolved', 'Closed', 'Escalated') DEFAULT 'Pending',
        assigned_to INT,
        sla_deadline DATETIME,
        created_at DATETIME NOT NULL,
        updated_at DATETIME,
        resolved_at DATETIME,
        escalation_level INT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_priority (priority),
        INDEX idx_assigned_to (assigned_to),
        INDEX idx_sla_deadline (sla_deadline)
      )
    `);

    // Escalation log table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS escalation_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        complaint_id INT NOT NULL,
        escalated_from INT,
        escalated_to INT,
        reason TEXT,
        escalated_at DATETIME NOT NULL,
        FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
        INDEX idx_complaint_id (complaint_id)
      )
    `);

    // Notifications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        complaint_id INT,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_is_read (is_read)
      )
    `);
  } finally {
    connection.release();
  }
}

// Rule-based priority assignment
function assignPriority(description, category) {
  const descLower = description.toLowerCase();
  const catLower = category.toLowerCase();

  // High priority keywords in description
  const highKeywords = ['urgent', 'emergency', 'critical', 'danger', 'life', 'death', 'severe', 'immediate', 'accident', 'fire', 'flood', 'leak'];

  // High priority categories - check if category CONTAINS these words
  const highCategories = ['health', 'safety', 'water', 'electricity'];

  if (
    highKeywords.some(keyword => descLower.includes(keyword)) ||
    highCategories.some(cat => catLower.includes(cat))
  ) {
    return 'High';
  }

  // Medium priority categories first (more specific)
  const mediumCategories = ['roads', 'sanitation', 'transportation'];

  if (mediumCategories.some(cat => catLower.includes(cat))) {
    return 'Medium';
  }

  // Medium priority keywords (only if not already categorized)
  const mediumKeywords = ['broken', 'damaged', 'not working', 'repair', 'fix', 'bad', 'poor', 'faulty'];

  if (mediumKeywords.some(keyword => descLower.includes(keyword))) {
    return 'Medium';
  }

  return 'Low';
}

// Calculate SLA deadline based on priority
function calculateSLADeadline(priority) {
  const now = new Date();
  let hours = 72; // Default 3 days for Low priority

  if (priority === 'High') {
    hours = 24; // 1 day for High priority
  } else if (priority === 'Medium') {
    hours = 48; // 2 days for Medium priority
  }

  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

// Auto-assign officer based on category
async function autoAssignOfficer(category) {
  try {
    const [officers] = await pool.query(
      'SELECT id FROM users WHERE role = "officer" AND department = ? ORDER BY RAND() LIMIT 1',
      [category]
    );

    if (officers.length > 0) {
      return officers[0].id;
    }

    // If no officer for specific department, assign to any officer
    const [anyOfficer] = await pool.query(
      'SELECT id FROM users WHERE role = "officer" ORDER BY RAND() LIMIT 1'
    );

    return anyOfficer.length > 0 ? anyOfficer[0].id : null;
  } catch (error) {
    console.error('Auto-assign error:', error);
    return null;
  }
}

// Create notification
async function createNotification(userId, complaintId, message, type = 'info') {
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, complaint_id, message, type, created_at) VALUES (?, ?, ?, ?, NOW())',
      [userId, complaintId, message, type]
    );
  } catch (error) {
    console.error('Notification error:', error);
  }
}

// Send Email Notification
async function sendEmailNotification(subject, message, complaintDetails) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('⚠ Email credentials not configured');
      return;
    }

    const mailOptions = {
      from: `"Grievance System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🔔 New Complaint Alert</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin-top: 0;">${message}</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0;">Complaint Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Complaint ID:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">#${complaintDetails.id}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Title:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${complaintDetails.title}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Category:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${complaintDetails.category}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Priority:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                    <span style="background: ${complaintDetails.priority === 'High' ? '#fee2e2' : complaintDetails.priority === 'Medium' ? '#fef3c7' : '#d1fae5'}; 
                                 color: ${complaintDetails.priority === 'High' ? '#dc2626' : complaintDetails.priority === 'Medium' ? '#d97706' : '#059669'}; 
                                 padding: 4px 12px; border-radius: 12px; font-weight: 600;">
                      ${complaintDetails.priority}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Location:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${complaintDetails.location || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>User Name:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${complaintDetails.userName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>User Email:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${complaintDetails.userEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>User Phone:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${complaintDetails.userPhone}</td>
                </tr>
                <tr>
                  <td style="padding: 10px;"><strong>Description:</strong></td>
                  <td style="padding: 10px;">${complaintDetails.description}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:3000/admin" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        font-weight: 600;
                        display: inline-block;">
                View in Admin Dashboard
              </a>
            </div>
          </div>
          <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">Smart Public Grievance Escalation System</p>
            <p style="margin: 5px 0 0 0;">This is an automated notification. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };

    await emailTransporter.sendMail(mailOptions);
    console.log('✓ Email notification sent to admin');
  } catch (error) {
    console.error('Email notification error:', error.message);
  }
}

// Send SMS Notification (Using Fast2SMS - Free for India)
async function sendSMSNotification(message) {
  try {
    // Method 1: Fast2SMS (if configured)
    if (process.env.FAST2SMS_API_KEY && process.env.FAST2SMS_API_KEY !== 'your-fast2sms-api-key') {
      const axios = require('axios');
      const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
        route: 'v3',
        sender_id: 'TXTIND',
        message: message,
        language: 'english',
        flash: 0,
        numbers: process.env.ADMIN_PHONE
      }, {
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      console.log('✓ SMS notification sent to admin via Fast2SMS');
      return;
    }

    // Method 2: Twilio (if configured)
    if (twilioClient) {
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${process.env.ADMIN_PHONE}`
      });
      console.log('✓ SMS notification sent to admin via Twilio');
      return;
    }

    // No SMS service configured
    console.log('⚠ SMS not configured - Install Fast2SMS (free) or Twilio');
    console.log('📱 SMS would have been sent to:', process.env.ADMIN_PHONE);
    console.log('📝 Message:', message.substring(0, 100) + '...');

  } catch (error) {
    console.error('SMS notification error:', error.message);
    console.log('📱 Failed to send SMS to:', process.env.ADMIN_PHONE);
  }
}

// Notify Admin about new complaint
async function notifyAdminAboutComplaint(complaintDetails) {
  try {
    // Get admin user
    const [admins] = await pool.query('SELECT id FROM users WHERE role = "admin" LIMIT 1');

    if (admins.length > 0) {
      // Create in-app notification for admin
      await createNotification(
        admins[0].id,
        complaintDetails.id,
        `New ${complaintDetails.priority} priority complaint: "${complaintDetails.title}" from ${complaintDetails.userName}`,
        'warning'
      );
    }

    // Send Email
    await sendEmailNotification(
      `🚨 New ${complaintDetails.priority} Priority Complaint #${complaintDetails.id}`,
      `A new complaint has been submitted and requires your attention.`,
      complaintDetails
    );

    // Send SMS
    const smsMessage = `🚨 New ${complaintDetails.priority} Priority Complaint #${complaintDetails.id}\nTitle: ${complaintDetails.title}\nCategory: ${complaintDetails.category}\nFrom: ${complaintDetails.userName}\nView: http://localhost:3000/admin`;
    await sendSMSNotification(smsMessage);

  } catch (error) {
    console.error('Admin notification error:', error);
  }
}

// Check and escalate overdue complaints
async function checkAndEscalateComplaints() {
  try {
    const [overdueComplaints] = await pool.query(`
      SELECT c.*, u.id as user_id 
      FROM complaints c
      JOIN users u ON c.user_id = u.id
      WHERE c.status NOT IN ('Resolved', 'Closed') 
      AND c.sla_deadline < NOW()
      AND c.escalation_level < 2
    `);

    for (const complaint of overdueComplaints) {
      const newLevel = complaint.escalation_level + 1;

      await pool.query(
        'UPDATE complaints SET status = "Escalated", escalation_level = ?, updated_at = NOW() WHERE id = ?',
        [newLevel, complaint.id]
      );

      await pool.query(
        'INSERT INTO escalation_log (complaint_id, escalated_from, escalated_to, reason, escalated_at) VALUES (?, ?, ?, ?, NOW())',
        [complaint.id, complaint.assigned_to, null, 'SLA deadline exceeded',]
      );

      await createNotification(
        complaint.user_id,
        complaint.id,
        `Your complaint #${complaint.id} has been escalated due to SLA breach.`,
        'warning'
      );
    }
  } catch (error) {
    console.error('Escalation check error:', error);
  }
}

// Run escalation check every 5 minutes
setInterval(checkAndEscalateComplaints, 5 * 60 * 1000);

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.userId = user.id;
    next();
  });
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await pool.query(
      'INSERT INTO users (name, email, phone, password, address, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, email, phone, hashedPassword, address]
    );

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Submit complaint
app.post('/api/complaints', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    const priority = assignPriority(description, category);
    const slaDeadline = calculateSLADeadline(priority);
    const assignedOfficer = await autoAssignOfficer(category);

    const [result] = await pool.query(
      'INSERT INTO complaints (user_id, title, description, category, location, priority, status, assigned_to, sla_deadline, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [req.userId, title, description, category, location, priority, 'Pending', assignedOfficer, slaDeadline]
    );

    // Get user details for admin notification
    const [users] = await pool.query('SELECT name, email, phone FROM users WHERE id = ?', [req.userId]);
    const user = users[0];

    // Create notification for user
    await createNotification(
      req.userId,
      result.insertId,
      `Your complaint "${title}" has been submitted successfully with ${priority} priority.`,
      'success'
    );

    // Notify assigned officer if exists
    if (assignedOfficer) {
      await createNotification(
        assignedOfficer,
        result.insertId,
        `New ${priority} priority complaint assigned to you: "${title}"`,
        'info'
      );
    }

    // Notify Admin via Email, SMS, and In-App
    await notifyAdminAboutComplaint({
      id: result.insertId,
      title,
      description,
      category,
      location,
      priority,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone
    });

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint_id: result.insertId,
      priority,
      sla_deadline: slaDeadline,
      assigned_to: assignedOfficer
    });
  } catch (error) {
    console.error('Submit complaint error:', error);
    res.status(500).json({ error: 'Failed to submit complaint' });
  }
});

// Get all complaints for user
app.get('/api/complaints', authenticateToken, async (req, res) => {
  try {
    const [complaints] = await pool.query(
      'SELECT * FROM complaints WHERE user_id = ? AND is_deleted = FALSE ORDER BY created_at DESC',
      [req.userId]
    );

    res.json({ complaints });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Soft delete complaint
app.delete('/api/complaints/:id', authenticateToken, async (req, res) => {
  try {
    const [complaints] = await pool.query(
      'SELECT * FROM complaints WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (complaints.length === 0) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const complaint = complaints[0];
    if (complaint.status !== 'Resolved' && complaint.status !== 'Closed') {
      return res.status(400).json({ error: 'Only resolved or closed complaints can be deleted' });
    }

    await pool.query(
      'UPDATE complaints SET is_deleted = TRUE WHERE id = ?',
      [req.params.id]
    );

    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
});

// Get single complaint
app.get('/api/complaints/:id', authenticateToken, async (req, res) => {
  try {
    const [complaints] = await pool.query(
      'SELECT * FROM complaints WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (complaints.length === 0) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json({ complaint: complaints[0] });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ error: 'Failed to fetch complaint' });
  }
});

// Admin Routes

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find admin user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, 'admin']);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const user = users[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all complaints (Admin only)
app.get('/api/admin/complaints', authenticateToken, async (req, res) => {
  try {
    const [complaints] = await pool.query(`
      SELECT c.*, u.name as user_name, u.email as user_email, u.phone as user_phone
      FROM complaints c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `);

    res.json({ complaints });
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Get complaint statistics (Admin only)
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "citizen"');
    const [totalOfficers] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "officer"');
    const [totalComplaints] = await pool.query('SELECT COUNT(*) as count FROM complaints');
    const [pendingComplaints] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE status = "Pending"');
    const [inProgressComplaints] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE status = "In Progress"');
    const [resolvedComplaints] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE status IN ("Resolved", "Closed")');
    const [escalatedComplaints] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE status = "Escalated"');
    const [highPriority] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE priority = "High"');
    const [mediumPriority] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE priority = "Medium"');
    const [lowPriority] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE priority = "Low"');
    const [overdueComplaints] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE sla_deadline < NOW() AND status NOT IN ("Resolved", "Closed")');

    // Average resolution time
    const [avgResolution] = await pool.query(`
      SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_hours 
      FROM complaints 
      WHERE resolved_at IS NOT NULL
    `);

    res.json({
      stats: {
        totalUsers: totalUsers[0].count,
        totalOfficers: totalOfficers[0].count,
        totalComplaints: totalComplaints[0].count,
        pending: pendingComplaints[0].count,
        inProgress: inProgressComplaints[0].count,
        resolved: resolvedComplaints[0].count,
        escalated: escalatedComplaints[0].count,
        highPriority: highPriority[0].count,
        mediumPriority: mediumPriority[0].count,
        lowPriority: lowPriority[0].count,
        overdue: overdueComplaints[0].count,
        avgResolutionHours: avgResolution[0].avg_hours ? Math.round(avgResolution[0].avg_hours) : 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Update complaint status (Admin only)
app.put('/api/admin/complaints/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const complaintId = req.params.id;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    // Get complaint details
    const [complaints] = await pool.query('SELECT * FROM complaints WHERE id = ?', [complaintId]);
    if (complaints.length === 0) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const complaint = complaints[0];
    const updateData = { status, updated_at: new Date() };

    // If resolved or closed, set resolved_at
    if (status === 'Resolved' || status === 'Closed') {
      updateData.resolved_at = new Date();
    }

    await pool.query(
      'UPDATE complaints SET status = ?, updated_at = NOW(), resolved_at = ? WHERE id = ?',
      [status, updateData.resolved_at || null, complaintId]
    );

    // Notify user about status change
    await createNotification(
      complaint.user_id,
      complaintId,
      `Your complaint #${complaintId} status has been updated to: ${status}`,
      status === 'Resolved' ? 'success' : 'info'
    );

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Get notifications for user
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const [notifications] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.userId]
    );

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification error:', error);
    res.status(500).json({ error: 'Failed to mark notification' });
  }
});

// Mark all notifications as read
app.put('/api/notifications/read-all', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
      [req.userId]
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications error:', error);
    res.status(500).json({ error: 'Failed to mark notifications' });
  }
});

// Get unread notification count
app.get('/api/notifications/unread-count', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [req.userId]
    );

    res.json({ count: result[0].count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to fetch count' });
  }
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log('✓ Grievance System Backend Server Running');
    console.log(`✓ Server: http://localhost:${PORT}`);
    console.log(`✓ Health Check: http://localhost:${PORT}/api/health`);
    console.log('='.repeat(60) + '\n');
  });
});
