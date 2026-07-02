import React, { useContext, useState } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import { Key, AlertCircle, CheckCircle } from 'lucide-react';

const AppContent = () => {
  const { user, loading, updatePassword } = useContext(AuthContext);
  const [view, setView] = useState('home'); // 'home', 'login', 'register' (when logged out)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdSubmitting, setPwdSubmitting] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (newPassword !== confirmPassword) {
      setPwdError('Passwords do not match.');
      return;
    }

    // Validation
    if (newPassword.length < 8 || newPassword.length > 16) {
      setPwdError('Password must be between 8 and 16 characters.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setPwdError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>_#\-\+\=\[\]\/\\]/.test(newPassword)) {
      setPwdError('Password must contain at least one special character.');
      return;
    }

    setPwdSubmitting(true);
    const result = await updatePassword(newPassword);
    setPwdSubmitting(false);

    if (result.success) {
      setPwdSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPwdSuccess('');
      }, 1500);
    } else {
      setPwdError(result.error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--border-glass)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Loading session...</p>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  // Logged-out views
  if (!user) {
    if (view === 'home') {
      return (
        <Home 
          onLoginClick={() => setView('login')} 
          onRegisterClick={() => setView('register')} 
        />
      );
    }
    
    if (view === 'login') {
      return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Login 
            onNavigateToRegister={() => setView('register')} 
            onNavigateToHome={() => setView('home')} 
          />
        </div>
      );
    }
    
    if (view === 'register') {
      return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Register 
            onNavigateToLogin={() => setView('login')} 
            onNavigateToHome={() => setView('home')} 
          />
        </div>
      );
    }
  }

  // Logged-in views based on roles
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <Navbar onChangePasswordClick={() => setIsPasswordModalOpen(true)} />

      {/* Render appropriate dashboard */}
      {user.role === 'System Administrator' && <AdminDashboard />}
      {user.role === 'Normal User' && <UserDashboard />}
      {user.role === 'Store Owner' && <OwnerDashboard />}

      {/* Reusable modal for Password Updates */}
      <Modal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        title="Update Account Password"
      >
        {pwdError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--danger)',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{pwdError}</span>
          </div>
        )}

        {pwdSuccess && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            color: 'var(--success)',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem'
          }}>
            <CheckCircle size={16} style={{ flexShrink: 0 }} />
            <span>{pwdSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Choose a strong new password containing 8-16 characters with at least one uppercase letter and one special character.
          </p>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} /> New Password
            </label>
            <input 
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} /> Confirm Password
            </label>
            <input 
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsPasswordModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={pwdSubmitting}>
              {pwdSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
