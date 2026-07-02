import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, MapPin, Lock, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

const Register = ({ onNavigateToLogin, onNavigateToHome }) => {
  const { registerUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Normal User'); // 'Normal User' or 'Store Owner'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Name validation: Only verify it is not empty
    if (!name || name.trim().length === 0) {
      setError('Name is required.');
      return;
    }

    // 2. Email validation: pattern check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    // 3. Address validation: Only verify it is present for Cafe Owners
    if (role === 'Store Owner' && (!address || address.trim().length === 0)) {
      setError('Store Address is required for Cafe Owners.');
      return;
    }

    // 4. Password validation: 8-16 characters, 1 uppercase, 1 special character
    if (password.length < 8 || password.length > 16) {
      setError('Password must be between 8 and 16 characters.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>_#\-\+\=\[\]\/\\]/.test(password)) {
      setError('Password must contain at least one special character.');
      return;
    }

    const finalAddress = role === 'Store Owner' ? address : '';

    setSubmitting(true);
    const result = await registerUser(name, email, finalAddress, password, role);
    setSubmitting(false);

    if (result.success) {
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        onNavigateToLogin();
      }, 2000);
    } else {
      setError(result.error);
    }
  };

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
          maxWidth: '480px',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{
          background: 'var(--accent)',
          padding: '12px',
          borderRadius: '16px',
          color: '#000',
          marginBottom: '16px'
        }}>
          <UserPlus size={28} />
        </div>
        
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px', textAlign: 'center' }}>
          Join AromaRate
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '28px', textAlign: 'center' }}>
          Create an account to browse cafes and submit ratings.
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

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-group">
            <label className="form-label">Register As</label>
            <select 
              className="form-input"
              value={role}
              onChange={(e) => { setRole(e.target.value); setError(''); }}
              style={{ background: 'var(--bg-glass-light)', cursor: 'pointer' }}
            >
              <option value="Normal User">Normal User (Customer)</option>
              <option value="Store Owner">Cafe Owner (Store Owner)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} /> {role === 'Store Owner' ? 'Cafe / Store Name' : 'Full Name'}
            </label>
            <input 
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'Store Owner' ? 'e.g. Blue Bottle Coffee Shop' : 'e.g. Alice Wonderland'}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} /> Email Address
            </label>
            <input 
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@gmail.com"
              required
            />
          </div>

          {/* Show Address input field ONLY for Store Owners */}
          {role === 'Store Owner' && (
            <div className="form-group animate-fade-in">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} /> Store Address
              </label>
              <textarea 
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 789 Latte Boulevard, San Francisco, CA"
                rows={2}
                style={{ resize: 'vertical' }}
                required
              />
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} /> Password (8-16 chars, 1 uppercase, 1 special char)
            </label>
            <input 
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. Secure@Password123"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', gap: '10px' }}
            disabled={submitting}
          >
            {submitting ? 'Registering...' : 'Create Account'}
            {!submitting && <UserPlus size={18} />}
          </button>
        </form>

        <p style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button 
            onClick={onNavigateToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent)',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
