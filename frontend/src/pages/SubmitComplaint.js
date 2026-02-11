import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ArrowLeft, Send, FileText, Tag, MapPin } from 'lucide-react';
import { complaintAPI } from '../services/api';
import './SubmitComplaint.css';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'Water Supply',
    'Electricity',
    'Roads',
    'Sanitation',
    'Health',
    'Safety',
    'Education',
    'Transportation',
    'Other',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await complaintAPI.submitComplaint(formData);
      toast.success(`Complaint submitted successfully! Priority: ${response.data.priority}`);
      navigate('/complaints');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-complaint-container">
      <div className="submit-complaint-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </div>

      <motion.div
        className="submit-complaint-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-header">
          <FileText size={32} />
          <h1>Submit New Complaint</h1>
          <p>Fill in the details below to submit your grievance</p>
        </div>

        <form onSubmit={handleSubmit} className="complaint-form">
          <div className="form-group">
            <label>
              <FileText size={20} />
              Complaint Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief title of your complaint"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Tag size={20} />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <MapPin size={20} />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location of the issue"
            />
          </div>

          <div className="form-group">
            <label>
              <FileText size={20} />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your complaint in detail..."
              rows="6"
              required
            />
          </div>

          <div className="form-actions">
            <motion.button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              className="submit-btn"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                'Submitting...'
              ) : (
                <>
                  <Send size={20} />
                  Submit Complaint
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SubmitComplaint;
