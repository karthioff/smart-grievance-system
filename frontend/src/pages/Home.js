import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Users, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleActionClick = () => {
        if (user) {
            navigate('/submit-complaint');
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <div className="home-container">
            <nav className="home-navbar">
                <div className="logo">
                    <Shield className="logo-icon" size={32} />
                    <span>VoiceIt</span>
                </div>
                <div className="nav-links">
                    {user ? (
                        <Link to="/dashboard" className="nav-link" style={{ fontWeight: '700', color: 'var(--primary-color)' }}>Go to Dashboard</Link>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-btn primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </nav>

            <main className="home-main">
                <section className="hero-section">
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="hero-title">Your Voice Matters</h1>
                        <p className="hero-subtitle">
                            A smarter, faster, and more transparent way to resolve public grievances.
                            Report issues directly to the authorities and automatically track their progress in real-time.
                        </p>
                        <div className="hero-actions">
                            <button onClick={handleActionClick} className="btn-primary huge">
                                Submit a Complaint
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                </section>

                <section className="features-section">
                    <motion.div
                        className="feature-card"
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="feature-icon bg-indigo"><Clock /></div>
                        <h3>Real-time Tracking</h3>
                        <p>Monitor your complaint status with live timeline updates.</p>
                    </motion.div>
                    <motion.div
                        className="feature-card"
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="feature-icon bg-emerald"><Shield /></div>
                        <h3>Transparent Routing</h3>
                        <p>Smart auto-assignment ensures your issue reaches the right department officer.</p>
                    </motion.div>
                    <motion.div
                        className="feature-card"
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="feature-icon bg-amber"><Users /></div>
                        <h3>Automated Escalation</h3>
                        <p>Overdue SLAs automatically escalate to higher authorities.</p>
                    </motion.div>
                </section>
            </main>

            <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Home;
