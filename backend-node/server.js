const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
        created_at DATETIME NOT NULL,
        INDEX idx_email (email)
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
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_priority (priority)
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
        is_read BOOLEAN DEFAULT FALSE,
        created_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id)
      )
    `);
  } finally {
    connection.release();
  }
}

// Rule-based priority assignment
function assignPriority(description, category) {
  const descLower = description.toLowerCase();
  
  const highKeywords = ['urgent', 'emergency', 'critical', 'danger', 'life', 'death', 'severe', 'immediate'];
  const highCategories = ['health', 'safety', 'water', 'electricity'];
  
  if (highKeywords.some(keyword => descLower.includes(keyword)) || 
      highCategories.includes(category.toLowerCase())) {
    return 'High';
  }
  
  const mediumKeywords = ['problem', 'issue', 'broken', 'damaged', 'not working'];
  if (mediumKeywords.some(keyword => descLower.includes(keyword))) {
    return 'Medium';
  }
  
  return 'Low';
}

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

    const [result] = await pool.query(
      'INSERT INTO complaints (user_id, title, description, category, location, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [req.userId, title, description, category, location, priority, 'Pending']
    );

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint_id: result.insertId,
      priority
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
      'SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );

    res.json({ complaints });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
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
    const [totalComplaints] = await pool.query('SELECT COUNT(*) as count FROM complaints');
    const [pendingComplaints] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE status = "Pending"');
    const [inProgressComplaints] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE status = "In Progress"');
    const [resolvedComplaints] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE status IN ("Resolved", "Closed")');
    const [highPriority] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE priority = "High"');
    const [mediumPriority] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE priority = "Medium"');
    const [lowPriority] = await pool.query('SELECT COUNT(*) as count FROM complaints WHERE priority = "Low"');

    res.json({
      stats: {
        totalUsers: totalUsers[0].count,
        totalComplaints: totalComplaints[0].count,
        pending: pendingComplaints[0].count,
        inProgress: inProgressComplaints[0].count,
        resolved: resolvedComplaints[0].count,
        highPriority: highPriority[0].count,
        mediumPriority: mediumPriority[0].count,
        lowPriority: lowPriority[0].count
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

    await pool.query(
      'UPDATE complaints SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, complaintId]
    );

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
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
