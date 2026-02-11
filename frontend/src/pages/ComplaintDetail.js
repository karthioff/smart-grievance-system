import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Tag, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { complaintAPI } from '../services/api';
import './ComplaintDetail.css';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const response = await complaintAPI.getComplaint(id);
      setComplaint(response.data.complaint);
    } catch (error) {
      console.error('Error fetching complaint:', error);
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

  if (loading) {
    return (
      <div className="complaint-detail-container">
        <div className="loading">Loading complaint details...</div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="complaint-detail-container">
        <div className="error-state">
          <AlertCircle size={64} />
          <h3>Complaint not found</h3>
          <button onClick={() => navigate('/complaints')} className="back-btn">
            Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="complaint-detail-container">
      <div className="complaint-detail-header">
        <button onClick={() => navigate('/complaints')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Complaints
        </button>
      </div>

      <motion.div
        className="complaint-detail-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="detail-header">
          <div className="header-content">
            <h1>{complaint.title}</h1>
            <div className="badges">
              <span className={`badge ${getPriorityClass(complaint.priority)}`}>
                {complaint.priority} Priority
              </span>
              <span className={`badge ${getStatusClass(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-body">
          <div className="info-section">
            <div className="info-item">
              <Tag size={20} />
              <div>
                <label>Category</label>
                <p>{complaint.category}</p>
              </div>
            </div>

            {complaint.location && (
              <div className="info-item">
                <MapPin size={20} />
                <div>
                  <label>Location</label>
                  <p>{complaint.location}</p>
                </div>
              </div>
            )}

            <div className="info-item">
              <Calendar size={20} />
              <div>
                <label>Submitted On</label>
                <p>{new Date(complaint.created_at).toLocaleString()}</p>
              </div>
            </div>

            {complaint.updated_at && (
              <div className="info-item">
                <Calendar size={20} />
                <div>
                  <label>Last Updated</label>
                  <p>{new Date(complaint.updated_at).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          <div className="description-section">
            <div className="section-header">
              <FileText size={24} />
              <h2>Description</h2>
            </div>
            <p>{complaint.description}</p>
          </div>

          <div className="status-timeline">
            <h3>Status Timeline</h3>
            <div className="timeline">
              <div className="timeline-item active">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Complaint Submitted</h4>
                  <p>{new Date(complaint.created_at).toLocaleString()}</p>
                </div>
              </div>

              {complaint.status !== 'Pending' && (
                <div className="timeline-item active">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Status: {complaint.status}</h4>
                    <p>{complaint.updated_at ? new Date(complaint.updated_at).toLocaleString() : 'In progress'}</p>
                  </div>
                </div>
              )}

              {(complaint.status === 'Resolved' || complaint.status === 'Closed') && complaint.resolved_at && (
                <div className="timeline-item active">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Complaint Resolved</h4>
                    <p>{new Date(complaint.resolved_at).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComplaintDetail;
