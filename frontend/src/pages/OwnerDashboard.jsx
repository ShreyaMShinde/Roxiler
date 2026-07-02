import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import StarRating from '../components/StarRating';
import { Star, MessageSquare, Calendar, User, Mail, MapPin } from 'lucide-react';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({ averageRating: '0.0', totalRatings: 0, raters: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/owner/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading owner dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Customer Name',
      sortable: true,
      render: (name) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={14} className="star-filled" />
          <span style={{ fontWeight: 600 }}>{name}</span>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email Address',
      sortable: true,
      render: (email) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Mail size={12} style={{ color: 'var(--text-muted)' }} />
          <span>{email}</span>
        </div>
      )
    },
    {
      key: 'address',
      label: 'Customer Location',
      sortable: true,
      render: (address) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
          <span style={{ display: 'inline-block', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={address}>
            {address}
          </span>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating Submitted',
      sortable: true,
      render: (rating) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StarRating rating={Number(rating)} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)' }}>
            ({rating}/5)
          </span>
        </div>
      )
    },
    {
      key: 'updated_at',
      label: 'Submitted Date',
      sortable: true,
      render: (dateStr) => {
        const date = new Date(dateStr);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Calendar size={12} />
            <span>{date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        );
      }
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Cafe statistics...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px 40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Cafe Operations Hub</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Monitor customer feedback, overall performance metrics, and rating scores.</p>
      </div>

      {/* Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* Average Rating Card */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              Overall Store Score
            </span>
            <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '10px', borderRadius: '10px' }}>
              <Star size={20} style={{ fill: 'var(--accent)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{stats.averageRating}</span>
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 5.0</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StarRating rating={Math.round(Number(stats.averageRating))} size={20} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              (Average of all submissions)
            </span>
          </div>
        </div>

        {/* Total Feedback Card */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              Feedback Submissions
            </span>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'hsl(210, 80%, 65%)', padding: '10px', borderRadius: '10px' }}>
              <MessageSquare size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{stats.totalRatings}</span>
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Reviews</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Total unique customers who rated your shop.
          </p>
        </div>
      </div>

      {/* Rater Listing */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Customer Ratings Log</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Full record of ratings submitted for your cafe (sorted by latest).</p>
      </div>

      <Table 
        columns={columns} 
        data={stats.raters} 
        emptyMessage="No customer feedback has been submitted for your cafe yet." 
      />
    </div>
  );
};

export default OwnerDashboard;
