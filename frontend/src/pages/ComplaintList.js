import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, AlertCircle } from 'lucide-react';
import { complaintAPI } from '../services/api';
import './ComplaintList.css';

const ComplaintList = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await complaintAPI.getComplaints();
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'In Progress':
        return 'status-progress';
      case 'Resolved':
      case 'Closed':
        return 'status-resolved';
      case 'Escalated':
        return 'status-escalated';
      default:
        return '';
    }
  };

  return (
    <div className="complaint-list-container">
      <div className="complaint-list-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </div>

      <motion.div
        className="complaint-list-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-header">
          <h1>My Complaints</h1>
          <p>View and track all your submitted grievances</p>
        </div>

        {loading ? (
          <div className="loading">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={64} />
            <h3>No complaints found</h3>
            <p>You haven't submitted any complaints yet</p>
            <button onClick={() => navigate('/submit-complaint')} className="submit-new-btn">
              Submit Your First Complaint
            </button>
          </div>
        ) : (
          <div className="complaints-grid">
            {complaints.map((complaint, index) => (
              <motion.div
                key={complaint.id}
                className="complaint-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="complaint-header">
                  <h3>{complaint.title}</h3>
                  <div className="badges">
                    <span className={`badge ${getPriorityClass(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                    <span className={`badge ${getStatusClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                </div>

                <div className="complaint-body">
                  <p className="category">Category: {complaint.category}</p>
                  {complaint.location && (
                    <p className="location">Location: {complaint.location}</p>
                  )}
                  <p className="description">{complaint.description}</p>
                  <p className="date">Submitted: {new Date(complaint.created_at).toLocaleDateString()}</p>
                </div>

                <button
                  onClick={() => navigate(`/complaints/${complaint.id}`)}
                  className="view-btn"
                >
                  <Eye size={18} />
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ComplaintList;
