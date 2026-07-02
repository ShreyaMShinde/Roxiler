import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Table from '../components/Table';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';
import { Search, Star, AlertCircle, CheckCircle, Coffee, MapPin } from 'lucide-react';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  // Rating Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isModifying, setIsModifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [searchName, searchAddress]);

  const fetchStores = async () => {
    try {
      const params = {};
      if (searchName) params.name = searchName;
      if (searchAddress) params.address = searchAddress;

      const response = await api.get('/stores', { params });
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleOpenRateModal = (store, oldRating) => {
    setSelectedStore(store);
    setError('');
    setSuccess('');
    
    if (oldRating) {
      setSelectedRating(oldRating);
      setIsModifying(true);
    } else {
      setSelectedRating(0);
      setIsModifying(false);
    }
    
    setIsModalOpen(true);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedRating < 1 || selectedRating > 5) {
      setError('Please select a rating between 1 and 5 stars.');
      return;
    }

    setSubmitting(true);
    try {
      if (isModifying) {
        await api.put('/ratings', {
          store_id: selectedStore.id,
          rating: selectedRating,
        });
        setSuccess('Rating updated successfully!');
      } else {
        await api.post('/ratings', {
          store_id: selectedStore.id,
          rating: selectedRating,
        });
        setSuccess('Rating submitted successfully!');
      }

      fetchStores();
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess('');
      }, 1200);
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting rating.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Cafe Name', sortable: true },
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
    },
    {
      key: 'user_rating',
      label: 'Your Rating',
      sortable: true,
      render: (userRating) => {
        if (!userRating) {
          return <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Not Rated Yet</span>;
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StarRating rating={Number(userRating)} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>
              ({userRating}/5)
            </span>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Rating Action',
      sortable: false,
      render: (_, row) => {
        const hasRated = !!row.user_rating;
        return (
          <button
            onClick={() => handleOpenRateModal(row, row.user_rating)}
            className={`btn ${hasRated ? 'btn-secondary' : 'btn-primary'}`}
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <Star size={14} style={{ marginRight: '4px', fill: hasRated ? 'none' : '#000' }} />
            {hasRated ? 'Modify Rating' : 'Rate Cafe'}
          </button>
        );
      }
    }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px 40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Explore Registered Cafes</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Browse cafes, read overall scores, and cast your ratings below.</p>
      </div>

      {/* Search filters */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Search size={16} className="star-filled" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Search Cafes</h4>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Coffee size={12} /> Cafe Name
            </label>
            <input
              type="text"
              className="form-input"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search by cafe name..."
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} /> Location / Address
            </label>
            <input
              type="text"
              className="form-input"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Search by location..."
            />
          </div>
        </div>
      </div>

      {/* Table listing */}
      <Table columns={columns} data={stores} emptyMessage="No cafes found matching your searches." />

      {/* Rate/Modify Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isModifying ? `Modify Rating: ${selectedStore?.name}` : `Submit Rating: ${selectedStore?.name}`}
      >
        {error && (
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

        <form onSubmit={handleSubmitRating} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textAlign: 'center' }}>
            {isModifying 
              ? 'Update your rating score below by clicking on the stars:' 
              : 'Choose a rating rating score from 1 (poor) to 5 (excellent) stars:'}
          </p>

          <div style={{ padding: '12px', background: 'var(--bg-glass-light)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <StarRating 
              rating={selectedRating} 
              interactive={true} 
              onRatingChange={setSelectedRating} 
              size={36} 
            />
          </div>

          {selectedRating > 0 && (
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)' }}>
              {selectedRating} Star{selectedRating > 1 ? 's' : ''} Selected
            </span>
          )}

          <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting || selectedRating === 0} style={{ flex: 1 }}>
              {submitting ? 'Submitting...' : isModifying ? 'Update Rating' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserDashboard;
