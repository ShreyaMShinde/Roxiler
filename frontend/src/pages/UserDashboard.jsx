import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';
import { Search, Star, AlertCircle, CheckCircle, Coffee, MapPin, ArrowDown, ArrowUp } from 'lucide-react';
import heroCoffee from '../assets/hero_coffee.png';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' (highest first), 'asc' (lowest first), 'none'

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

  // Sort stores on client-side dynamically based on selected order
  const sortedStores = useMemo(() => {
    const list = [...stores];
    if (sortOrder === 'desc') {
      return list.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortOrder === 'asc') {
      return list.sort((a, b) => Number(a.rating) - Number(b.rating));
    }
    return list;
  }, [stores, sortOrder]);

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

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px 40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Explore Registered Cafes</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Browse cafes, read overall scores, and cast your ratings below.</p>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search Inputs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            flex: '1 1 500px'
          }}>
            <div className="form-group" style={{ marginBottom: 0, flex: '1 1 220px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Search size={14} /> Search Cafe Name
              </label>
              <input
                type="text"
                className="form-input"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search by cafe name..."
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: '1 1 220px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} /> Search Location
              </label>
              <input
                type="text"
                className="form-input"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Search by address..."
              />
            </div>
          </div>

          {/* Sort Controls */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'flex-start'
          }}>
            <span className="form-label">Sort by Ratings</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'none' : 'desc')}
                className="btn"
                style={{
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  background: sortOrder === 'desc' ? 'var(--accent)' : 'var(--bg-glass-light)',
                  color: sortOrder === 'desc' ? '#000' : 'var(--text-primary)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowDown size={16} />
                Highest Rating First
              </button>
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'none' : 'asc')}
                className="btn"
                style={{
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  background: sortOrder === 'asc' ? 'var(--accent)' : 'var(--bg-glass-light)',
                  color: sortOrder === 'asc' ? '#000' : 'var(--text-primary)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowUp size={16} />
                Lowest Rating First
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Cafe Cards */}
      {sortedStores.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '24px'
        }}>
          {sortedStores.map((store) => {
            const hasRated = !!store.user_rating;
            return (
              <div 
                key={store.id} 
                className="glass-panel animate-fade-in"
                style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'transform var(--transition-normal), border-color var(--transition-normal)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--border-glass-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-glass)';
                }}
              >
                {/* Cafe Header Image Card */}
                <div style={{
                  height: '160px',
                  position: 'relative',
                  backgroundImage: `url(${heroCoffee})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  {/* Backdrop Gradient for text overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(10, 8, 7, 0.1) 40%, rgba(10, 8, 7, 0.85) 100%)'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px'
                  }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {store.name}
                    </h3>
                  </div>
                </div>

                {/* Cafe Card Details */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '16px' }}>
                  {/* Address */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <MapPin size={16} className="star-filled" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ lineHeight: 1.4 }}>{store.address || 'No address registered'}</span>
                  </div>

                  {/* Ratings Row */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    background: 'rgba(24, 18, 14, 0.3)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-glass)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Overall Score</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {Number(store.rating) > 0 ? Number(store.rating).toFixed(1) : '0.0'}
                        </span>
                        <Star size={12} className="star-filled" />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <StarRating rating={Number(store.rating)} size={14} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {Number(store.rating) > 0 ? 'Verified rating' : 'No ratings yet'}
                      </span>
                    </div>
                  </div>

                  {/* User's Rating Badge */}
                  {hasRated ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'var(--accent-light)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--accent)'
                    }}>
                      <span>Your Submitted Rating:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <span>{store.user_rating}</span>
                        <Star size={12} style={{ fill: 'var(--accent)' }} />
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(218, 192, 163, 0.05)',
                      border: '1px dotted var(--border-glass)',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      color: 'var(--text-muted)'
                    }}>
                      You haven't rated this cafe yet
                    </div>
                  )}

                  {/* Submit / Modify Action */}
                  <button
                    onClick={() => handleOpenRateModal(store, store.user_rating)}
                    className={`btn ${hasRated ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ width: '100%', marginTop: 'auto', padding: '10px' }}
                  >
                    <Star size={16} style={{ marginRight: '6px', fill: hasRated ? 'none' : '#000' }} />
                    {hasRated ? 'Modify My Rating' : 'Rate Cafe'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Coffee size={36} style={{ marginBottom: '12px' }} />
          <p>No cafes found matching your search criteria.</p>
        </div>
      )}

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
              : 'Choose a rating score from 1 (poor) to 5 (excellent) stars:'}
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
