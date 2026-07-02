import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Coffee, LogOut, Key, User } from 'lucide-react';

const Navbar = ({ onChangePasswordClick }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="glass-panel" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      borderRadius: '0 0 16px 16px',
      borderTop: 'none',
      marginBottom: '32px',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'var(--accent)',
          padding: '8px',
          borderRadius: '10px',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Coffee size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, var(--text-primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AromaRate
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-4px', fontWeight: 500 }}>
            Premium Cafe Ratings
          </p>
        </div>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'var(--bg-glass-light)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-glass)'
            }}>
              <User size={18} className="star-filled" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user.name}
              </span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'var(--accent)',
                background: 'var(--accent-light)',
                padding: '1px 8px',
                borderRadius: '12px',
                marginTop: '2px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {user.role}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {user.role !== 'System Administrator' && (
              <button 
                onClick={onChangePasswordClick}
                className="btn btn-secondary" 
                style={{ padding: '8px 12px', fontSize: '0.85rem', height: '38px' }}
                title="Change Password"
              >
                <Key size={16} style={{ marginRight: '4px' }} />
                Password
              </button>
            )}
            
            <button 
              onClick={logout}
              className="btn btn-danger" 
              style={{ padding: '8px 12px', fontSize: '0.85rem', height: '38px' }}
            >
              <LogOut size={16} style={{ marginRight: '4px' }} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
