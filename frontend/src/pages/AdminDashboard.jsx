import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';
import { Users, Coffee, Star, Plus, Search, Filter, AlertCircle, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'stores', 'all'
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Search/Filter states
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('Normal User');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchStats();
    fetchListings();
  }, [activeTab, filterName, filterEmail, filterAddress, filterRole]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const fetchListings = async () => {
    try {
      const params = {};
      if (filterName) params.name = filterName;
      if (filterEmail) params.email = filterEmail;
      if (filterAddress) params.address = filterAddress;
      if (filterRole) params.role = filterRole;

      if (activeTab === 'users') {
        const response = await api.get('/admin/users', { params });
        setUsers(response.data);
      } else if (activeTab === 'stores') {
        const response = await api.get('/admin/stores', { params });
        setStores(response.data);
      } else if (activeTab === 'all') {
        const response = await api.get('/admin/all-users', { params });
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error('Error loading listings:', error);
    }
  };

  const handleClearFilters = () => {
    setFilterName('');
    setFilterEmail('');
    setFilterAddress('');
    setFilterRole('');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Validations
    if (newName.trim().length < 20 || newName.trim().length > 60) {
      setFormError('Name must be between 20 and 60 characters.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      setFormError('Please enter a valid email.');
      return;
    }
    if (newAddress.trim().length > 400) {
      setFormError('Address must not exceed 400 characters.');
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 16) {
      setFormError('Password must be 8-16 characters.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setFormError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>_#\-\+\=\[\]\/\\]/.test(newPassword)) {
      setFormError('Password must contain at least one special character.');
      return;
    }

    setFormSubmitting(true);
    try {
      await api.post('/admin/users', {
        name: newName,
        email: newEmail,
        address: newAddress,
        password: newPassword,
        role: newRole
      });

      setFormSuccess(`${newRole} added successfully!`);
      // Reset form
      setNewName('');
      setNewEmail('');
      setNewAddress('');
      setNewPassword('');
      setNewRole('Normal User');

      // Refresh stats & list
      fetchStats();
      fetchListings();

      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess('');
      }, 1500);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Error creating user.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Table Columns Setup
  const userColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (role) => (
        <span style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          background: role === 'System Administrator' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
          color: role === 'System Administrator' ? 'hsl(350, 75%, 65%)' : 'hsl(210, 80%, 65%)',
          padding: '2px 8px',
          borderRadius: '12px'
        }}>
          {role}
        </span>
      )
    }
  ];

  const storeColumns = [
    { key: 'name', label: 'Cafe Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'rating',
      label: 'Overall Rating',
      sortable: true,
      render: (rating) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StarRating rating={Number(rating)} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {Number(rating) > 0 ? Number(rating).toFixed(1) : 'No Ratings'}
          </span>
        </div>
      )
    }
  ];

  const allColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (role) => (
        <span style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          background: role === 'System Administrator' ? 'rgba(239, 68, 68, 0.15)' : role === 'Store Owner' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
          color: role === 'System Administrator' ? 'hsl(350, 75%, 65%)' : role === 'Store Owner' ? 'var(--accent)' : 'hsl(210, 80%, 65%)',
          padding: '2px 8px',
          borderRadius: '12px'
        }}>
          {role}
        </span>
      )
    },
    {
      key: 'rating',
      label: 'Cafe Rating',
      sortable: true,
      render: (rating, row) => {
        if (row.role !== 'Store Owner') {
          return <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>N/A (Not Cafe)</span>;
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StarRating rating={Number(rating)} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {Number(rating) > 0 ? Number(rating).toFixed(1) : 'No Ratings'}
            </span>
          </div>
        );
      }
    }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px 40px 20px' }}>
      {/* 1. Metric stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '16px', borderRadius: '12px' }}>
            <Users size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Total Users</h3>
            <p style={{ fontSize: '2rem', fontWeight: 800, marginTop: '2px' }}>{stats.totalUsers}</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'hsl(210, 80%, 65%)', padding: '16px', borderRadius: '12px' }}>
            <Coffee size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Total Cafes</h3>
            <p style={{ fontSize: '2rem', fontWeight: 800, marginTop: '2px' }}>{stats.totalStores}</p>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', padding: '16px', borderRadius: '12px' }}>
            <Star size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Submitted Ratings</h3>
            <p style={{ fontSize: '2rem', fontWeight: 800, marginTop: '2px' }}>{stats.totalRatings}</p>
          </div>
        </div>
      </div>

      {/* Header and Add User Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>System Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Create users, cafes, and inspect ratings lists.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Store or User
        </button>
      </div>

      {/* Tab Selectors */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-glass)',
        marginBottom: '24px',
        gap: '16px'
      }}>
        <button
          onClick={() => { setActiveTab('users'); handleClearFilters(); }}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'users' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'users' ? 'var(--text-primary)' : 'var(--text-secondary)',
            padding: '12px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'all var(--transition-fast)'
          }}
        >
          Normal & Admin Users
        </button>
        <button
          onClick={() => { setActiveTab('stores'); handleClearFilters(); }}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'stores' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'stores' ? 'var(--text-primary)' : 'var(--text-secondary)',
            padding: '12px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'all var(--transition-fast)'
          }}
        >
          Registered Cafes
        </button>
        <button
          onClick={() => { setActiveTab('all'); handleClearFilters(); }}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'all' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
            padding: '12px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'all var(--transition-fast)'
          }}
        >
          All Accounts (Detailed)
        </button>
      </div>

      {/* 2. Filters */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Filter size={16} className="star-filled" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Filter Listings</h4>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          alignItems: 'end'
        }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Name</label>
            <input
              type="text"
              className="form-input"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Filter by name..."
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Email</label>
            <input
              type="text"
              className="form-input"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
              placeholder="Filter by email..."
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Address</label>
            <input
              type="text"
              className="form-input"
              value={filterAddress}
              onChange={(e) => setFilterAddress(e.target.value)}
              placeholder="Filter by address..."
            />
          </div>
          {activeTab !== 'stores' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Role</label>
              <select
                className="form-input"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                style={{ background: 'var(--bg-glass-light)', cursor: 'pointer' }}
              >
                <option value="">All Roles</option>
                <option value="Normal User">Normal User</option>
                <option value="System Administrator">System Administrator</option>
                {activeTab === 'all' && <option value="Store Owner">Store Owner</option>}
              </select>
            </div>
          )}
          <button className="btn btn-secondary" onClick={handleClearFilters} style={{ height: '45px' }}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* 3. Listings */}
      {activeTab === 'users' && (
        <Table columns={userColumns} data={users} emptyMessage="No normal or admin users found matching the query." />
      )}
      {activeTab === 'stores' && (
        <Table columns={storeColumns} data={stores} emptyMessage="No cafes found matching the query." />
      )}
      {activeTab === 'all' && (
        <Table columns={allColumns} data={allUsers} emptyMessage="No user or store listings found matching the query." />
      )}

      {/* Modal for adding user/cafe */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Account">
        {formError && (
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
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
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
            <span>{formSuccess}</span>
          </div>
        )}

        <form onSubmit={handleAddUser}>
          <div className="form-group">
            <label className="form-label">Account Role</label>
            <select
              className="form-input"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              style={{ background: 'var(--bg-glass-light)', cursor: 'pointer' }}
            >
              <option value="Normal User">Normal User</option>
              <option value="System Administrator">System Administrator</option>
              <option value="Store Owner">Store Owner (Cafe)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              {newRole === 'Store Owner' ? 'Cafe / Store Name (Min 20 characters)' : 'Full Name (Min 20 characters)'}
            </label>
            <input
              type="text"
              className="form-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Blue Bottle Coffee Shop Seattle"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="e.g. bluebottle@cafe.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {newRole === 'Store Owner' ? 'Store Address (Max 400 characters)' : 'Home Address (Max 400 characters)'}
            </label>
            <textarea
              className="form-input"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="e.g. 789 Latte Boulevard, San Francisco, CA"
              rows={2}
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Password (8-16 chars, 1 uppercase, 1 special char)</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="e.g. Cafe@Owner2026"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
              {formSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
