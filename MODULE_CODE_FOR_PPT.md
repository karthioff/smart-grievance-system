# MODULE CODE FOR PPT PRESENTATION

---

## MODULE I – USER MANAGEMENT MODULE

### Backend Code (Node.js + Express)

```javascript
// User Registration API
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const [existing] = await pool.query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password using bcrypt (Security)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await pool.query(
      'INSERT INTO users (name, email, phone, password, address, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())',
      [name, email, phone, hashedPassword, address]
    );

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login API
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in database
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    );
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password using bcrypt
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token (Security)
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});
```

### Frontend Code (React.js)

```javascript
// Registration Component
const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.register(formData);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Full Name" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="tel" name="phone" placeholder="Phone" required />
      <input type="password" name="password" placeholder="Password" required />
      <textarea name="address" placeholder="Address" />
      <button type="submit">Register</button>
    </form>
  );
};

// Login Component
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(formData);
      login(response.data.user, response.data.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};
```

---

## MODULE II – GRIEVANCE SUBMISSION MODULE

### Backend Code (Node.js + Express)

```javascript
// Submit Complaint API with AI Priority Assignment
app.post('/api/complaints', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({ 
        error: 'Title, description, and category are required' 
      });
    }

    // AI-based Priority Assignment (Rule-Based Logic)
    const priority = assignPriority(description, category);

    // Insert complaint into database
    const [result] = await pool.query(
      `INSERT INTO complaints 
       (user_id, title, description, category, location, priority, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [req.userId, title, description, category, location, priority, 'Pending']
    );

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint_id: result.insertId,
      priority
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit complaint' });
  }
});

// Rule-Based AI Priority Assignment Function
function assignPriority(description, category) {
  const descLower = description.toLowerCase();
  
  // High Priority Keywords and Categories
  const highKeywords = ['urgent', 'emergency', 'critical', 'danger', 
                        'life', 'death', 'severe', 'immediate'];
  const highCategories = ['health', 'safety', 'water', 'electricity'];
  
  if (highKeywords.some(keyword => descLower.includes(keyword)) || 
      highCategories.includes(category.toLowerCase())) {
    return 'High';
  }
  
  // Medium Priority Keywords
  const mediumKeywords = ['problem', 'issue', 'broken', 'damaged', 
                          'not working'];
  if (mediumKeywords.some(keyword => descLower.includes(keyword))) {
    return 'Medium';
  }
  
  // Default: Low Priority
  return 'Low';
}

// Get User's Complaints API
app.get('/api/complaints', authenticateToken, async (req, res) => {
  try {
    const [complaints] = await pool.query(
      'SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );

    res.json({ complaints });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});
```

### Frontend Code (React.js)

```javascript
// Submit Complaint Component
const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', location: ''
  });

  const categories = [
    'Water Supply', 'Electricity', 'Roads', 'Sanitation',
    'Health', 'Safety', 'Education', 'Transportation', 'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await complaintAPI.submitComplaint(formData);
      toast.success(
        `Complaint submitted! Priority: ${response.data.priority}`
      );
      navigate('/complaints');
    } catch (error) {
      toast.error('Failed to submit complaint');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="title" 
        placeholder="Complaint Title" 
        required 
      />
      
      <select name="category" required>
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      
      <input 
        type="text" 
        name="location" 
        placeholder="Location" 
      />
      
      <textarea 
        name="description" 
        placeholder="Describe your complaint..." 
        rows="6" 
        required 
      />
      
      <button type="submit">Submit Complaint</button>
    </form>
  );
};
```

---

## KEY FEATURES IMPLEMENTED

### Module I - User Management:
✅ User Registration with validation
✅ Password encryption using bcryptjs
✅ User Login with JWT authentication
✅ Secure token-based session management
✅ User data stored in MySQL database

### Module II - Grievance Submission:
✅ Complaint submission form with categories
✅ AI-based priority assignment (High/Medium/Low)
✅ Rule-based keyword analysis
✅ Store complaints in database
✅ Link complaints to user accounts
✅ View submitted complaints

---

## SECURITY FEATURES IN CODE

1. **bcryptjs**: Password hashing before storage
2. **JWT**: Token-based authentication
3. **Parameterized Queries**: SQL injection prevention
4. **CORS**: Cross-origin protection
5. **dotenv**: Environment variable protection

---

## DATABASE SCHEMA

```sql
-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  address TEXT,
  role ENUM('citizen', 'officer', 'admin') DEFAULT 'citizen',
  created_at DATETIME NOT NULL
);

-- Complaints Table
CREATE TABLE complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  priority ENUM('High', 'Medium', 'Low') DEFAULT 'Low',
  status ENUM('Pending', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Pending',
  created_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## TECHNOLOGY STACK

**Frontend**: React.js, Framer Motion, Axios, React Router
**Backend**: Node.js, Express.js, JWT, bcryptjs
**Database**: MySQL
**Security**: 5 security tools implemented
**AI Logic**: Rule-based priority assignment

---
