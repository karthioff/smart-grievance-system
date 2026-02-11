import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Users, LogOut, Shield, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, complaintsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/admin/complaints', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data.stats);
      setComplaints(complaintsRes.data.complaints);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/complaints/${complaintId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-progress';
      case 'Resolved':
      case 'Closed': return 'status-resolved';
      case 'Escalated': return 'status-escalated';
      default: return '';
    }
  };

  return (
    <div className="admin-dashboard-container">
      <nav className="admin-nav">
        <div className="nav-brand">
          <Shield size={28} />
          <h2>Admin Dashboard</h2>
        </div>
        <div className="nav-user">
          <Shield size={20} />
          <span>{user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="admin-content">
        <motion.div
          className="welcome-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Welcome, Admin!</h1>
          <p>Manage all grievances and monitor system statistics</p>
        </motion.div>

        <div className="stats-grid">
          <motion.div className="stat-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="stat-icon users">
              <Users size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </motion.div>

          <motion.div className="stat-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="stat-icon total">
              <FileText size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalComplaints}</h3>
              <p>Total Complaints</p>
            </div>
          </motion.div>

          <motion.div className="stat-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="stat-icon pending">
              <Clock size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </motion.div>

          <motion.div className="stat-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="stat-icon progress">
              <TrendingUp size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </motion.div>

          <motion.div className="stat-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div className="stat-icon resolved">
              <CheckCircle size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.resolved}</h3>
              <p>Resolved</p>
            </div>
          </motion.div>

          <motion.div className="stat-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <div className="stat-icon high">
              <AlertCircle size={32} />
            </div>
            <div className="stat-info">
              <h3>{stats.highPriority}</h3>
              <p>High Priority</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="complaints-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2>All Complaints</h2>
          
          {loading ? (
            <div className="loading">Loading complaints...</div>
          ) : complaints.length === 0 ? (
            <div className="empty-state">No complaints found</div>
          ) : (
            <div className="complaints-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint.id}>
                      <td>{complaint.id}</td>
                      <td>
                        <div className="user-info">
                          <strong>{complaint.user_name}</strong>
                          <small>{complaint.user_email}</small>
                        </div>
                      </td>
                      <td>{complaint.title}</td>
                      <td>{complaint.category}</td>
                      <td>
                        <span className={`badge ${getPriorityClass(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusClass(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td>{new Date(complaint.created_at).toLocaleDateString()}</td>
                      <td>
                        <select
                          value={complaint.status}
                          onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                          <option value="Escalated">Escalated</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
