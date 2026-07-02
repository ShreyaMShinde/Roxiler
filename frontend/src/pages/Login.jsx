import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, ShieldAlert, Coffee, User, Key, CheckCircle } from 'lucide-react';

const Login = ({ onNavigateToRegister, onNavigateToHome }) => {
  const { login, forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('Normal User'); // 'Normal User', 'Store Owner', 'System Administrator'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Password Recovery state
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic email validation check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      // Restore user details to check role match
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser.role !== activeTab) {
        // Log out immediately if the role doesn't match the portal selected
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError(`This account is not registered as a ${activeTab}. Please select the correct login portal.`);
        return;
      }
    } else {
      setError(result.error);
    }
  };

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recoveryEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    const result = await forgotPassword(recoveryEmail);
    setSubmitting(false);

    if (result.success) {
      setSuccess('A password reset email has been sent! Check your inbox.');
      setRecoveryEmail('');
    } else {
      setError(result.error);
    }
  };

  if (recoveryMode) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
        padding: '20px',
        flexDirection: 'column'
      }}>
        <div 
          className="glass-panel animate-fade-in"
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{
            background: 'var(--accent-light)',
            padding: '12px',
            borderRadius: '16px',
            color: 'var(--accent)',
            marginBottom: '16px'
          }}>
            <Key size={28} />
          </div>
          
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px', textAlign: 'center' }}>
            Recover Password
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px', textAlign: 'center' }}>
            Enter your registered email address to receive a reset link.
          </p>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--danger)',
              padding: '12px 16px',
              borderRadius: '8px',
              width: '100%',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              color: 'var(--success)',
              padding: '12px 16px',
              borderRadius: '8px',
              width: '100%',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem'
            }}>
              <CheckCircle size={16} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleRecoverySubmit} style={{ width: '100%' }}>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} /> Registered Email
              </label>
              <input 
                type="email"
                className="form-input"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', gap: '10px' }}
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <button 
            onClick={() => { setRecoveryMode(false); setError(''); setSuccess(''); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              marginTop: '24px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.85rem'
            }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 120px)',
      padding: '20px',
      flexDirection: 'column'
    }}>
      {/* Back to Home Button */}
      <button 
        onClick={onNavigateToHome}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          marginBottom: '20px',
          fontWeight: 600,
          textDecoration: 'underline'
        }}
      >
        ← Back to Homepage
      </button>

      <div 
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Portal Icon based on Active Tab */}
        <div style={{
          background: activeTab === 'System Administrator' ? 'rgba(239, 68, 68, 0.15)' : activeTab === 'Store Owner' ? 'var(--accent-light)' : 'rgba(59, 130, 246, 0.15)',
          padding: '12px',
          borderRadius: '16px',
          color: activeTab === 'System Administrator' ? 'hsl(350, 75%, 65%)' : activeTab === 'Store Owner' ? 'var(--accent)' : 'hsl(210, 80%, 65%)',
          marginBottom: '16px'
        }}>
          {activeTab === 'System Administrator' ? <ShieldAlert size={28} /> : activeTab === 'Store Owner' ? <Coffee size={28} /> : <User size={28} />}
        </div>
        
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px', textAlign: 'center' }}>
          Portal Sign In
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px', textAlign: 'center' }}>
          Select your account portal and enter details below.
        </p>

        {/* 3 Login Portal Tabs */}
        <div style={{
          display: 'flex',
          width: '100%',
          background: 'rgba(24, 18, 14, 0.4)',
          borderRadius: '10px',
          padding: '4px',
          border: '1px solid var(--border-glass)',
          marginBottom: '24px'
        }}>
          {['Normal User', 'Store Owner', 'System Administrator'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => { setActiveTab(tab); setError(''); }}
                style={{
                  flex: 1,
                  background: isActive ? 'var(--bg-secondary)' : 'none',
                  border: isActive ? '1px solid var(--border-glass-hover)' : 'none',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '8px 4px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab === 'System Administrator' ? 'Admin' : tab === 'Store Owner' ? 'Cafe Owner' : 'Normal User'}
              </button>
            );
          })}
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--danger)',
            padding: '12px 16px',
            borderRadius: '8px',
            width: '100%',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} /> {activeTab} Email
            </label>
            <input 
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={activeTab === 'System Administrator' ? 'admin@caferatings.com' : activeTab === 'Store Owner' ? 'owner@cafe.com' : 'user@gmail.com'}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} /> Password
            </label>
            <input 
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Forgot Password Link */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => { setRecoveryMode(true); setError(''); setSuccess(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', gap: '10px' }}
            disabled={submitting}
          >
            {submitting ? 'Connecting...' : `Login as ${activeTab === 'System Administrator' ? 'Admin' : activeTab === 'Store Owner' ? 'Owner' : 'User'}`}
            {!submitting && <LogIn size={18} />}
          </button>
        </form>

        {activeTab === 'Normal User' && (
          <p style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <button 
              onClick={onNavigateToRegister}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent)',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Create Account
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
