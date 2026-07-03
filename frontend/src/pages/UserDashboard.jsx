import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';
import { 
  Search, Star, AlertCircle, CheckCircle, Coffee, MapPin, 
  ArrowDown, ArrowUp, ThumbsUp, Shield, Check, Phone, 
  MessageCircle, Share2, Edit3, Send, ChevronDown, 
  ChevronUp, Image as ImageIcon, Map, Copy, Clock
} from 'lucide-react';
import heroCoffee from '../assets/hero_coffee.png';

const colors = {
  bg: '#fbf9f4',
  bgCard: '#ffffff',
  bgAccentCard: '#f4ebd9',
  textDark: '#2b1b17',
  textMuted: '#5e4e4a',
  accent: '#8d5e44',
  accentLight: '#ebdccb',
  border: 'rgba(94, 78, 74, 0.15)',
  white: '#ffffff',
  greenBadge: '#15803d',
  greenBadgeBg: '#dcfce7',
  orangeStar: '#ff6f00',
  blueLink: '#2563eb',
  blueLinkBg: '#eff6ff',
};

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc', 'asc', 'none'

  // Selected store and view details
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'quick_info', 'services', 'photos', 'reviews'

  // Diagnostic state for capturing rendering exceptions
  const [diagError, setDiagError] = useState(null);

  // Custom photo uploads simulated
  const [customPhotos, setCustomPhotos] = useState([]);

  // Timing widget open state
  const [timingsOpen, setTimingsOpen] = useState(false);

  // Address copy feedback state
  const [copied, setCopied] = useState(false);

  // Ask anything simulation
  const [askInput, setAskInput] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // Floating footer bar visibility
  const [showFloatingFooter, setShowFloatingFooter] = useState(false);

  // Rating Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isModifying, setIsModifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reviews filtering
  const [reviewFilter, setReviewFilter] = useState('relevant'); // 'relevant', 'latest', 'high_to_low'

  // Global error listener to print full stack trace on the screen if React crashes
  useEffect(() => {
    const handleGlobalError = (event) => {
      setDiagError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    };
    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, []);

  // Dynamic CSS variables setup for this component lifecycle
  useEffect(() => {
    const root = document.documentElement;
    
    // Save original styles
    const originalVars = {
      '--bg-primary': root.style.getPropertyValue('--bg-primary'),
      '--bg-secondary': root.style.getPropertyValue('--bg-secondary'),
      '--bg-glass': root.style.getPropertyValue('--bg-glass'),
      '--bg-glass-light': root.style.getPropertyValue('--bg-glass-light'),
      '--border-glass': root.style.getPropertyValue('--border-glass'),
      '--border-glass-hover': root.style.getPropertyValue('--border-glass-hover'),
      '--text-primary': root.style.getPropertyValue('--text-primary'),
      '--text-secondary': root.style.getPropertyValue('--text-secondary'),
      '--text-muted': root.style.getPropertyValue('--text-muted'),
      '--accent': root.style.getPropertyValue('--accent'),
      '--accent-hover': root.style.getPropertyValue('--accent-hover'),
      '--accent-light': root.style.getPropertyValue('--accent-light'),
    };

    // Set to light coffee colors
    root.style.setProperty('--bg-primary', '#fbf9f4');
    root.style.setProperty('--bg-secondary', '#f4ebd9');
    root.style.setProperty('--bg-glass', '#ffffff');
    root.style.setProperty('--bg-glass-light', '#f4ebd9');
    root.style.setProperty('--border-glass', 'rgba(94, 78, 74, 0.15)');
    root.style.setProperty('--border-glass-hover', 'rgba(94, 78, 74, 0.3)');
    root.style.setProperty('--text-primary', '#2b1b17');
    root.style.setProperty('--text-secondary', '#5e4e4a');
    root.style.setProperty('--text-muted', '#8c7b77');
    root.style.setProperty('--accent', '#8d5e44');
    root.style.setProperty('--accent-hover', '#2b1b17');
    root.style.setProperty('--accent-light', '#ebdccb');

    // Force body bg override
    document.body.style.background = '#fbf9f4';
    document.body.style.color = '#2b1b17';

    return () => {
      // Restore on exit
      Object.keys(originalVars).forEach(key => {
        root.style.setProperty(key, originalVars[key]);
      });
      document.body.style.background = '';
      document.body.style.color = '';
    };
  }, []);

  // Listen for scroll to toggle floating footer
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowFloatingFooter(true);
      } else {
        setShowFloatingFooter(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch initial stores list
  useEffect(() => {
    fetchStores();
  }, [searchName, searchAddress]);

  // Fetch detail store information when selectedStoreId changes
  useEffect(() => {
    if (selectedStoreId) {
      fetchStoreDetails(selectedStoreId);
      fetchStoreReviews(selectedStoreId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Reset detail views
      setActiveTab('overview');
      setAiAnswer('');
      setUserQuestion('');
      setAskInput('');
      setCustomPhotos([]);
    } else {
      setSelectedStore(null);
      setReviews([]);
    }
  }, [selectedStoreId]);

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

  const fetchStoreDetails = async (id) => {
    try {
      const response = await api.get(`/stores/${id}`);
      setSelectedStore(response.data);
    } catch (error) {
      console.error('Error fetching store details:', error);
    }
  };

  const fetchStoreReviews = async (id) => {
    try {
      const response = await api.get(`/stores/${id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching store reviews:', error);
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

  // Sort and filter store reviews
  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    if (reviewFilter === 'latest') {
      return list.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } else if (reviewFilter === 'high_to_low') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    // Default 'relevant' lists ratings with comments first, then by date
    return list.sort((a, b) => {
      const aHasComment = a.comment ? 1 : 0;
      const bHasComment = b.comment ? 1 : 0;
      if (aHasComment !== bHasComment) return bHasComment - aHasComment;
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
  }, [reviews, reviewFilter]);

  // Photo grid images setup
  const cafePhotos = [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop', // classic cafe interior
    'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop', // premium coffee cup
    'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=600&auto=format&fit=crop', // coffee and cakes on table
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop', // restaurant seating area
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop', // multiple coffee drinks
    'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop', // latte art close up
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop', // exterior
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=600&auto=format&fit=crop', // cozy cafe counter
  ];

  const allPhotos = [...customPhotos, ...cafePhotos];

  const handleOpenRateModal = (store, oldRating, oldComment) => {
    setSelectedStore(store);
    setError('');
    setSuccess('');
    
    if (oldRating) {
      setSelectedRating(oldRating);
      setCommentText(oldComment || '');
      setIsModifying(true);
    } else {
      setSelectedRating(0);
      setCommentText('');
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
          comment: commentText,
        });
        setSuccess('Rating and review updated successfully!');
      } else {
        await api.post('/ratings', {
          store_id: selectedStore.id,
          rating: selectedRating,
          comment: commentText,
        });
        setSuccess('Rating and review submitted successfully!');
      }

      // Refresh both list and active store details
      if (selectedStoreId) {
        await fetchStoreDetails(selectedStoreId);
        await fetchStoreReviews(selectedStoreId);
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

  // Timings Schedule
  const timings = [
    { day: 'Monday', hours: '09:00 AM - 10:00 PM' },
    { day: 'Tuesday', hours: '09:00 AM - 10:00 PM' },
    { day: 'Wednesday', hours: '09:00 AM - 10:00 PM' },
    { day: 'Thursday', hours: '09:00 AM - 10:00 PM' },
    { day: 'Friday', hours: '09:00 AM - 10:00 PM' },
    { day: 'Saturday', hours: '09:00 AM - 10:30 PM' },
    { day: 'Sunday', hours: '09:00 AM - 10:30 PM' },
  ];

  // Helper to copy address
  const handleCopyAddress = (address) => {
    navigator.clipboard.writeText(address || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to trigger custom simulated photo upload
  const handleAddPhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setCustomPhotos(prev => [url, ...prev]);
        alert("Upload Simulation Successful! The image has been added to this cafe's gallery.");
      }
    };
    input.click();
  };

  // AI Ask Anything Simulation
  const handleAskQuestion = (questionText) => {
    if (!questionText.trim()) return;
    setIsAsking(true);
    setAiAnswer('');
    setUserQuestion(questionText);
    
    setTimeout(() => {
      setIsAsking(false);
      const answers = [
        "Yes, they serve excellent thin crust options! Their Chocolate Biclate Pizza is their signature dessert pizza made with rich cocoa crust and fresh white chocolate shavings.",
        "Yes! They offer free home delivery within a 5km radius for orders above ₹300.",
        "They have a wide range of vegetarian and eggless options. All dessert cakes and chocolate pizzas are 100% pure vegetarian.",
        "Yes, they opens daily at 09:00 AM and close at 10:00 PM. They also have special brunch options during weekends.",
        "Absolutely! They have free high-speed Wi-Fi and power outlets near the window seats, making it a great spot for remote work."
      ];
      
      let answer = "Thank you for asking! Yes, this cafe is highly recommended for its premium quality pizzas, cakes, and coffee beverages. Feel free to contact them directly at 08460448549.";
      const lowerQ = questionText.toLowerCase();
      if (lowerQ.includes('cheese') || lowerQ.includes('pizza') || lowerQ.includes('biclate')) {
        answer = answers[0];
      } else if (lowerQ.includes('delivery') || lowerQ.includes('free') || lowerQ.includes('home')) {
        answer = answers[1];
      } else if (lowerQ.includes('veg') || lowerQ.includes('vegetarian') || lowerQ.includes('options')) {
        answer = answers[2];
      } else if (lowerQ.includes('time') || lowerQ.includes('open') || lowerQ.includes('hour')) {
        answer = answers[3];
      } else if (lowerQ.includes('work') || lowerQ.includes('wifi') || lowerQ.includes('internet')) {
        answer = answers[4];
      }
      setAiAnswer(answer);
    }, 800);
  };

  // Detail View Component
  const renderDetailView = () => {
    if (!selectedStore) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', color: colors.textMuted }}>
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid var(--border-glass)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px auto'
            }} />
            <p>Loading cafe details...</p>
          </div>
        </div>
      );
    }

    const { name, email, address, rating, user_rating, user_comment, ratings_count } = selectedStore;
    const formattedRating = Number(rating) > 0 ? Number(rating).toFixed(1) : '0.0';
    const isUserRated = user_rating !== null && user_rating !== undefined;

    return (
      <div className="animate-fade-in" style={{ padding: '0 20px 80px 20px', position: 'relative' }}>
        
        {/* 1. Breadcrumbs */}
        <div style={{
          fontSize: '0.85rem',
          color: colors.textMuted,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ cursor: 'pointer' }} onClick={() => setSelectedStoreId(null)}>Satara</span>
          <span>&gt;</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setSelectedStoreId(null)}>Pizza Outlets in Satara</span>
          <span>&gt;</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setSelectedStoreId(null)}>Pizza Outlets in Wai City</span>
          <span>&gt;</span>
          <span style={{ fontWeight: 700, color: colors.textDark }}>{name}</span>
        </div>

        {/* 2. Photo Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '8px',
          height: '350px',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          border: `1px solid ${colors.border}`
        }}>
          {/* Main big image on left */}
          <div style={{
            backgroundImage: `url(${allPhotos[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer'
          }} title="View main photo" />

          {/* Middle image */}
          <div style={{
            backgroundImage: `url(${allPhotos[1] || cafePhotos[1]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer'
          }} title="View interior" />

          {/* Right column stacked */}
          <div style={{
            display: 'grid',
            gridTemplateRows: '1fr 1fr',
            gap: '8px'
          }}>
            <div style={{
              backgroundImage: `url(${allPhotos[2] || cafePhotos[2]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: 'pointer'
            }} />
            <div style={{
              backgroundImage: `url(${allPhotos[3] || cafePhotos[3]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              cursor: 'pointer'
            }}>
              <div 
                onClick={handleAddPhoto}
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  gap: '4px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.6)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'}
              >
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>+{allPhotos.length - 3} More</span>
                <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <ImageIcon size={14} /> Add More Photo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Profile Information Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${colors.border}`,
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          {/* Left profile info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '1 1 500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                backgroundColor: colors.accentLight,
                color: colors.accent,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ThumbsUp size={16} style={{ fill: colors.accent }} />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: colors.textDark }}>
                {name}
              </h2>
            </div>

            {/* Badges line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{
                backgroundColor: '#16a34a',
                color: '#ffffff',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>{formattedRating}</span>
                <Star size={12} style={{ fill: '#fff', color: '#16a34a' }} />
              </div>
              <span style={{ fontSize: '0.85rem', color: colors.textMuted, fontWeight: 500 }}>
                {ratings_count || '288'} Ratings
              </span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffb300', fontSize: '0.85rem', fontWeight: 600 }}>
                <Shield size={14} style={{ fill: '#ffb300' }} />
                <span>Trust</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle size={14} style={{ fill: '#2563eb', color: '#fff' }} />
                <span>Verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2b1b17', fontSize: '0.85rem', fontWeight: 600 }}>
                <Check size={14} style={{ strokeWidth: 3 }} />
                <span>Claimed</span>
              </div>
            </div>

            {/* Timings and address indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: colors.textMuted, fontSize: '0.9rem', flexWrap: 'wrap', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} style={{ color: colors.accent }} />
                <span>Wai City, Satara</span>
              </div>
              <span>•</span>
              
              {/* Interactive timings dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setTimingsOpen(!timingsOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.textDark,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    padding: 0
                  }}
                >
                  <Clock size={16} style={{ color: colors.accent }} />
                  <span>Opens at 09:00 AM</span>
                  {timingsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {timingsOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '24px',
                    left: 0,
                    backgroundColor: '#ffffff',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    zIndex: 100,
                    minWidth: '240px'
                  }}>
                    <h5 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '0.85rem', color: colors.textDark }}>Opening Hours</h5>
                    {timings.map(t => (
                      <div key={t.day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '6px 0', borderBottom: `1px solid ${colors.border}` }}>
                        <span style={{ fontWeight: 600 }}>{t.day}</span>
                        <span style={{ color: colors.textMuted }}>{t.hours}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons row */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
              <a href="tel:08460448549" style={{
                backgroundColor: '#008000',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '12px 24px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                boxShadow: '0 2px 4px rgba(0, 128, 0, 0.15)'
              }}>
                <Phone size={16} /> 08460448549
              </a>
              <a href="https://wa.me/9108460448549" target="_blank" rel="noreferrer" style={{
                border: '1px solid #16a34a',
                color: '#16a34a',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '12px 24px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ffffff',
                textDecoration: 'none'
              }}>
                <MessageCircle size={16} /> WhatsApp
              </a>
              <button 
                onClick={() => {
                  const askBox = document.getElementById('ask-anything-input');
                  if (askBox) askBox.focus();
                }}
                style={{
                  border: '1px solid #2563eb',
                  color: '#2563eb',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <span>Ask Anything</span>
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-6px',
                  backgroundColor: '#ec4899',
                  color: '#fff',
                  fontSize: '0.6rem',
                  padding: '1px 4px',
                  borderRadius: '4px',
                  fontWeight: 700
                }}>AETA</span>
              </button>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Page URL copied to clipboard for sharing!");
                }}
                style={{
                  backgroundColor: '#f3f4f6', border: '1px solid rgba(0,0,0,0.1)', color: colors.textDark,
                  width: '42px', height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
                title="Share Cafe"
              >
                <Share2 size={16} />
              </button>
              <button 
                onClick={() => handleOpenRateModal(selectedStore, user_rating, user_comment)}
                style={{
                  backgroundColor: '#f3f4f6', border: '1px solid rgba(0,0,0,0.1)', color: colors.textDark,
                  width: '42px', height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
                title="Suggest Edit"
              >
                <Edit3 size={16} />
              </button>
            </div>
          </div>

          {/* Right rating action panel */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
            backgroundColor: '#fafaf9',
            padding: '16px',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            alignSelf: 'stretch',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: colors.textMuted }}>Click to Rate</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  onClick={() => handleOpenRateModal(selectedStore, star, user_comment)}
                  style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                  className={isUserRated && user_rating >= star ? 'star-filled' : 'star-empty'}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
            </div>
            {isUserRated ? (
              <span style={{ fontSize: '0.75rem', color: colors.accent, fontWeight: 700, marginTop: '4px' }}>
                Your Score: {user_rating} Stars
              </span>
            ) : (
              <span style={{ fontSize: '0.75rem', color: colors.textMuted, marginTop: '4px' }}>
                Not rated yet
              </span>
            )}
          </div>
        </div>

        {/* 4. Tab Navigation Bar */}
        <div style={{
          display: 'flex',
          borderBottom: `2px solid ${colors.border}`,
          marginBottom: '28px',
          gap: '24px',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}>
          {['overview', 'quick_info', 'services', 'photos', 'reviews'].map((tab) => {
            const isActive = activeTab === tab;
            const labels = {
              overview: 'Overview',
              quick_info: 'Quick Info',
              services: 'Services',
              photos: 'Photos',
              reviews: 'Reviews'
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? colors.accent : colors.textMuted,
                  fontWeight: isActive ? 800 : 500,
                  fontSize: '1rem',
                  padding: '10px 4px',
                  cursor: 'pointer',
                  borderBottom: isActive ? `3px solid ${colors.accent}` : '3px solid transparent',
                  marginBottom: '-2px',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* 5. Main Double Column Content Section */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '32px',
          alignItems: 'flex-start'
        }}>
          
          {/* Left Column: Switch Tab Content */}
          <div style={{ flex: '2 1 650px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Overview / Reviews Content Tab */}
            {(activeTab === 'overview' || activeTab === 'reviews') && (
              <>
                {/* Ask Anything AI Widget */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: `1px solid ${colors.border}`,
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: colors.textDark, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <MessageCircle size={18} style={{ color: colors.accent }} />
                    <span>Ask anything about this place</span>
                  </h4>
                  
                  {/* Text input with Send icon */}
                  <div style={{ display: 'flex', gap: '8px', position: 'relative', marginBottom: '16px' }}>
                    <input
                      id="ask-anything-input"
                      type="text"
                      className="form-input"
                      value={askInput}
                      onChange={(e) => setAskInput(e.target.value)}
                      placeholder="Ask about menu, home delivery, seating, timings..."
                      style={{
                        backgroundColor: '#ffffff',
                        borderColor: colors.border,
                        color: colors.textDark,
                        paddingRight: '48px',
                        height: '46px'
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion(askInput)}
                    />
                    <button
                      onClick={() => handleAskQuestion(askInput)}
                      style={{
                        position: 'absolute',
                        right: '4px',
                        top: '4px',
                        width: '38px',
                        height: '38px',
                        backgroundColor: colors.accent,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Send size={16} />
                    </button>
                  </div>

                  {/* Quick question suggestion tags */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {[
                      "Do you have cheese burst pizza?",
                      "Is home delivery free?",
                      "Do you have veg options?"
                    ].map(q => (
                      <button
                        key={q}
                        onClick={() => {
                          setAskInput(q);
                          handleAskQuestion(q);
                        }}
                        style={{
                          backgroundColor: '#ffffff',
                          border: `1px solid ${colors.border}`,
                          color: colors.textDark,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          borderRadius: '20px',
                          padding: '6px 14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.accent}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.border}
                      >
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>

                  {/* AI Response Display */}
                  {(isAsking || aiAnswer) && (
                    <div style={{
                      backgroundColor: '#fafaf9',
                      borderRadius: '8px',
                      padding: '16px',
                      borderLeft: `4px solid ${colors.accent}`,
                      marginTop: '16px',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      color: colors.textDark
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: colors.accent, marginBottom: '4px' }}>
                        <span>Question: "{userQuestion}"</span>
                      </div>
                      {isAsking ? (
                        <div style={{ color: colors.textMuted }}>AI answering...</div>
                      ) : (
                        <div style={{ fontWeight: 500 }}>{aiAnswer}</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Reviews & Ratings Section */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: `1px solid ${colors.border}`,
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: colors.textDark }}>
                    Reviews & Ratings
                  </h3>

                  {/* Score blocks grid */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '24px',
                    marginBottom: '28px',
                    alignItems: 'stretch'
                  }}>
                    {/* Big Average Box */}
                    <div style={{
                      backgroundColor: '#16a34a',
                      color: '#ffffff',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center',
                      flex: '1 1 180px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>
                        {formattedRating}
                      </span>
                      <div style={{ display: 'flex', gap: '2px', margin: '8px 0' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} size={14} style={{ fill: Number(rating) >= star ? '#fff' : 'none', color: '#fff' }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                        {ratings_count || '288'} Ratings
                      </span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '4px' }}>
                        Jd rating index across the web
                      </span>
                    </div>

                    {/* Interactive Start Review Box */}
                    <div style={{
                      backgroundColor: '#fafaf9',
                      borderRadius: '12px',
                      border: `1px solid ${colors.border}`,
                      padding: '20px',
                      flex: '1.5 1 240px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: colors.textDark }}>
                        Start your Review
                      </span>
                      <p style={{ fontSize: '0.8rem', color: colors.textMuted, margin: 0 }}>
                        Rate and share your detailed dining experience with other users.
                      </p>
                      <div style={{ display: 'flex', gap: '4px', margin: '4px 0' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={28}
                            onClick={() => handleOpenRateModal(selectedStore, star, user_comment)}
                            style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                            className="star-empty"
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Recent Rating Trend Box */}
                    <div style={{
                      backgroundColor: '#fafaf9',
                      borderRadius: '12px',
                      border: `1px solid ${colors.border}`,
                      padding: '20px',
                      flex: '1.5 1 240px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: colors.textDark }}>
                        Recent rating trend
                      </span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {[
                          ...reviews.slice(0, 5).map(r => Number(r.rating).toFixed(1)),
                          '5.0', '5.0', '4.5', '5.0', '5.0'
                        ].slice(0, 5).map((score, i) => (
                          <div
                            key={i}
                            style={{
                              backgroundColor: '#ffffff',
                              border: `1px solid ${colors.border}`,
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: colors.orangeStar
                            }}
                          >
                            <span>{score}</span>
                            <Star size={12} style={{ fill: colors.orangeStar, color: colors.orangeStar }} />
                          </div>
                        ))}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: colors.textMuted }}>Based on verified recent submissions</span>
                    </div>
                  </div>

                  {/* User Reviews list header & Filters */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `1px solid ${colors.border}`,
                    paddingBottom: '12px',
                    marginBottom: '20px'
                  }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: colors.textDark, margin: 0 }}>
                      User Reviews
                    </h4>
                    <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f3f4f6', padding: '3px', borderRadius: '8px' }}>
                      {[
                        { key: 'relevant', label: 'Relevant' },
                        { key: 'latest', label: 'Latest' },
                        { key: 'high_to_low', label: 'High to Low' }
                      ].map(filter => (
                        <button
                          key={filter.key}
                          onClick={() => setReviewFilter(filter.key)}
                          style={{
                            backgroundColor: reviewFilter === filter.key ? '#ffffff' : 'transparent',
                            color: reviewFilter === filter.key ? colors.textDark : colors.textMuted,
                            fontWeight: reviewFilter === filter.key ? 700 : 500,
                            fontSize: '0.8rem',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reviews List */}
                  {sortedReviews.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {sortedReviews.map((rev) => (
                        <div
                          key={rev.id}
                          style={{
                            paddingBottom: '20px',
                            borderBottom: `1px solid ${colors.border}`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '36px', height: '36px', borderRadius: '50%', backgroundColor: colors.accentLight,
                                color: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                              }}>
                                {rev.user_name ? rev.user_name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <h5 style={{ fontWeight: 800, margin: 0, color: colors.textDark, fontSize: '0.95rem' }}>
                                  {rev.user_name || 'Roxiler User'}
                                </h5>
                                <span style={{ fontSize: '0.75rem', color: colors.textMuted }}>
                                  {new Date(rev.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                            </div>

                            {/* Stars badge */}
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star
                                  key={s}
                                  size={14}
                                  className={Number(rev.rating) >= s ? 'star-filled' : 'star-empty'}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Review comment text */}
                          {rev.comment ? (
                            <p style={{ fontSize: '0.9rem', color: colors.textDark, margin: '4px 0 0 0', lineHeight: 1.5, fontWeight: 500 }}>
                              {rev.comment}
                            </p>
                          ) : (
                            <p style={{ fontSize: '0.85rem', color: colors.textMuted, fontStyle: 'italic', margin: '4px 0 0 0' }}>
                              Rated this outlet {rev.rating} out of 5 stars (no written commentary left).
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: colors.textMuted }}>
                      <Coffee size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                      <p style={{ fontSize: '0.9rem', margin: 0 }}>Be the first to rate and write a review for this cafe!</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Quick Info Content Tab */}
            {activeTab === 'quick_info' && (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: `1px solid ${colors.border}`,
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '24px'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>Type</span>
                  <p style={{ fontWeight: 700, margin: '4px 0 0 0', fontSize: '0.95rem', color: colors.textDark }}>Coffee Shops, Pizza Outlets</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>Serves</span>
                  <p style={{ fontWeight: 700, margin: '4px 0 0 0', fontSize: '0.95rem', color: colors.textDark }}>Coffee, Cakes, Fast Food</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>Services</span>
                  <p style={{ fontWeight: 700, margin: '4px 0 0 0', fontSize: '0.95rem', color: colors.textDark }}>Home Delivery, Dine-in, Takeaway</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>Average Cost</span>
                  <p style={{ fontWeight: 700, margin: '4px 0 0 0', fontSize: '0.95rem', color: colors.textDark }}>₹250 - ₹500 for two people</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>Payment Modes</span>
                  <p style={{ fontWeight: 700, margin: '4px 0 0 0', fontSize: '0.95rem', color: colors.textDark }}>Cash, Cards, UPI (GPay/Paytm)</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' }}>Facilities</span>
                  <p style={{ fontWeight: 700, margin: '4px 0 0 0', fontSize: '0.95rem', color: colors.textDark }}>Free High-Speed Wi-Fi, Air Conditioned</p>
                </div>
              </div>
            )}

            {/* Services Content Tab */}
            {activeTab === 'services' && (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: `1px solid ${colors.border}`,
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: colors.textDark, borderBottom: `1px solid ${colors.border}`, paddingBottom: '12px', margin: 0 }}>
                  Services Offered
                </h3>
                <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingLeft: '20px', color: colors.textDark, fontSize: '0.95rem' }}>
                  <li style={{ fontWeight: 600 }}>Home Delivery</li>
                  <li style={{ fontWeight: 600 }}>Catering Available</li>
                  <li style={{ fontWeight: 600 }}>Dine-in Indoor Seating</li>
                  <li style={{ fontWeight: 600 }}>Outdoor Street Seating</li>
                  <li style={{ fontWeight: 600 }}>Takeaway Available</li>
                  <li style={{ fontWeight: 600 }}>Customized Anniversary Cakes</li>
                </ul>
              </div>
            )}

            {/* Photos Content Tab */}
            {activeTab === 'photos' && (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: `1px solid ${colors.border}`,
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: colors.textDark, margin: 0 }}>
                    Photo Gallery
                  </h3>
                  <button 
                    onClick={handleAddPhoto}
                    style={{
                      backgroundColor: colors.accent,
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <ImageIcon size={14} /> Add photo
                  </button>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '12px'
                }}>
                  {allPhotos.map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundImage: `url(${p})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '140px',
                        borderRadius: '12px',
                        border: `1px solid ${colors.border}`,
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sidebar Info Widgets */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Contact Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: `1px solid ${colors.border}`,
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
            }}>
              <h4 style={{ fontWeight: 800, fontSize: '1rem', color: colors.textDark, marginBottom: '12px' }}>
                Contact
              </h4>
              <a href="tel:08460448549" style={{
                color: colors.blueLink,
                fontWeight: 700,
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}>
                <Phone size={18} style={{ color: colors.accent }} />
                <span>08460448549</span>
              </a>
            </div>

            {/* Address Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: `1px solid ${colors.border}`,
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
            }}>
              <h4 style={{ fontWeight: 800, fontSize: '1rem', color: colors.textDark, marginBottom: '12px' }}>
                Address
              </h4>
              <p style={{ fontSize: '0.85rem', color: colors.textDark, lineHeight: 1.4, margin: '0 0 16px 0', fontWeight: 500 }}>
                {address || 'Chocolate Biclate, Bramhnshahi, Pharande Chowk, Wai City, Satara-412803, Maharashtra'}
              </p>
              
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(address || name)}`} target="_blank" rel="noreferrer" style={{
                  color: colors.blueLink,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Map size={14} /> Get Directions
                </a>
                <button
                  onClick={() => handleCopyAddress(address || 'Chocolate Biclate, Bramhnshahi, Pharande Chowk, Wai City, Satara-412803, Maharashtra')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.blueLink,
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Timings Dropdown Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: `1px solid ${colors.border}`,
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: colors.textDark, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} style={{ color: colors.accent }} />
                  <span>Opens at 09:00 AM</span>
                </span>
                <button 
                  onClick={() => setTimingsOpen(!timingsOpen)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, padding: 0 }}
                >
                  {timingsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              
              {timingsOpen && (
                <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '8px' }}>
                  {timings.map(t => (
                    <div key={t.day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', padding: '4px 0' }}>
                      <span style={{ fontWeight: 600 }}>{t.day}</span>
                      <span style={{ color: colors.textMuted }}>{t.hours}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* General Actions List Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: `1px solid ${colors.border}`,
              padding: '16px 20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {[
                "Suggest New Timings",
                "Send Enquiry by Email",
                "Get info via SMS/Email",
                "Share",
                "Tap to rate",
                "Edit this Listing"
              ].map(action => (
                <button
                  key={action}
                  onClick={() => {
                    if (action === "Tap to rate") {
                      handleOpenRateModal(selectedStore, user_rating, user_comment);
                    } else if (action === "Send Enquiry by Email") {
                      window.location.href = `mailto:${email || 'dailygrind@cafe.com'}`;
                    } else {
                      alert(`Action "${action}" is simulated. Under development.`);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: colors.blueLink,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    padding: '2px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.accent}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.blueLink}
                >
                  <span>{action}</span>
                  <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>➔</span>
                </button>
              ))}
            </div>

            {/* Report An Error Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: `1px solid ${colors.border}`,
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: colors.textDark, margin: 0 }}>
                Report An Error
              </h4>
              <p style={{ fontSize: '0.75rem', color: colors.textMuted, margin: 0, lineHeight: 1.4 }}>
                Help us make AromaRate more updated and relevant for our local community.
              </p>
              <button 
                onClick={() => alert("Thank you! An administrator has been notified to check this outlet's information.")}
                style={{
                  border: `1px solid ${colors.blueLink}`,
                  color: colors.blueLink,
                  backgroundColor: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.blueLinkBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                Report Now
              </button>
            </div>

          </div>

        </div>

        {/* 6. Sticky Floating Footer Bar */}
        {showFloatingFooter && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderTop: `1px solid ${colors.border}`,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
            padding: '12px 48px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 999,
            animation: 'slideUp 0.3s ease-out forwards'
          }}>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
            `}} />
            
            {/* Left summary info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                backgroundColor: colors.accentLight,
                color: colors.accent,
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ThumbsUp size={16} style={{ fill: colors.accent }} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: colors.textDark }}>
                  {name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontSize: '0.8rem' }}>
                  <span style={{
                    backgroundColor: colors.greenBadgeBg,
                    color: colors.greenBadge,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    {formattedRating} ★
                  </span>
                  <span style={{ color: colors.textMuted }}>{ratings_count || '288'} Ratings</span>
                  <span style={{ color: colors.textMuted }}>|</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#ffb300', fontWeight: 700 }}>
                    <Shield size={12} style={{ fill: '#ffb300' }} /> Trust
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#2563eb', fontWeight: 700 }}>
                    <CheckCircle size={12} style={{ fill: '#2563eb', color: '#fff' }} /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Right quick actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a href="tel:08460448549" style={{
                backgroundColor: '#008000',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '10px 20px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}>
                <Phone size={16} /> 08460448549
              </a>
              <a href="https://wa.me/9108460448549" target="_blank" rel="noreferrer" style={{
                border: '1px solid #16a34a',
                color: '#16a34a',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '10px 20px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ffffff',
                textDecoration: 'none'
              }}>
                <MessageCircle size={16} /> WhatsApp
              </a>
              <button
                onClick={() => handleOpenRateModal(selectedStore, user_rating, user_comment)}
                className="btn btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                <Star size={16} style={{ fill: isUserRated ? '#000' : 'none' }} />
                {isUserRated ? 'Modify My Rating' : 'Rate Cafe'}
              </button>
            </div>
          </div>
        )}

      </div>
    );
  };

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', color: colors.textDark }}>
      
      {/* Conditionally Render Diagnostic Error overlay if React crashes */}
      {diagError && (
        <div style={{ padding: '40px', background: '#fee2e2', color: '#991b1b', border: '1px solid #f87171', borderRadius: '12px' }}>
          <h3>Diagnostic Error Captured during render:</h3>
          <p><strong>Message:</strong> {diagError.message}</p>
          <p><strong>Location:</strong> {diagError.filename}:{diagError.lineno}:{diagError.colno}</p>
          <pre style={{ overflow: 'auto', background: '#fff', padding: '12px', border: '1px solid #f87171', borderRadius: '6px', fontSize: '0.85rem' }}>
            {diagError.stack}
          </pre>
        </div>
      )}

      {/* Conditionally Render Detail View or Directory List View */}
      {selectedStoreId ? (
        <>
          {/* Back to directories link */}
          <div style={{ padding: '0 20px 10px 20px' }}>
            <button
              onClick={() => setSelectedStoreId(null)}
              style={{
                background: 'none',
                border: 'none',
                color: colors.accent,
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 0'
              }}
            >
              ← Back to Cafe Directory
            </button>
          </div>
          {renderDetailView()}
        </>
      ) : (
        <div className="animate-fade-in" style={{ padding: '0 20px 40px 20px' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: colors.textDark }}>
              Explore Registered Cafes
            </h2>
            <p style={{ color: colors.textMuted, fontSize: '1rem', fontWeight: 500 }}>
              Browse local cafes, read verified feedback scorecards, and rate your favorite coffees.
            </p>
          </div>

          {/* Search and Sort Toolbar */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}>
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
                  <label className="form-label" style={{ color: colors.textDark, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Search size={14} /> Search Cafe Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Search by cafe name..."
                    style={{ backgroundColor: '#ffffff', borderColor: colors.border, color: colors.textDark }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: '1 1 220px' }}>
                  <label className="form-label" style={{ color: colors.textDark, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> Search Location
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    placeholder="Search by address..."
                    style={{ backgroundColor: '#ffffff', borderColor: colors.border, color: colors.textDark }}
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
                <span className="form-label" style={{ color: colors.textDark, fontWeight: 600 }}>Sort by Ratings</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'none' : 'desc')}
                    className="btn"
                    style={{
                      padding: '10px 16px',
                      fontSize: '0.85rem',
                      background: sortOrder === 'desc' ? colors.accent : '#ffffff',
                      color: sortOrder === 'desc' ? '#ffffff' : colors.textDark,
                      border: `1px solid ${colors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 700
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
                      background: sortOrder === 'asc' ? colors.accent : '#ffffff',
                      color: sortOrder === 'asc' ? '#ffffff' : colors.textDark,
                      border: `1px solid ${colors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 700
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {sortedStores.map((store) => {
                const hasRated = store.user_rating !== null && store.user_rating !== undefined;
                return (
                  <div 
                    key={store.id} 
                    className="animate-fade-in"
                    style={{
                      backgroundColor: '#ffffff',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                      transition: 'transform 0.2s, border-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = colors.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = colors.border;
                    }}
                  >
                    {/* Cover photo */}
                    <div style={{
                      height: '160px',
                      position: 'relative',
                      backgroundImage: `url(${heroCoffee})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)'
                      }} />
                      <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.4)', margin: 0 }}>
                          {store.name}
                        </h3>
                      </div>
                    </div>

                    {/* Card contents */}
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: colors.textMuted, fontSize: '0.85rem' }}>
                        <MapPin size={16} style={{ color: colors.accent, flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ lineHeight: 1.4, fontWeight: 500 }}>{store.address || 'No address registered'}</span>
                      </div>

                      {/* Ratings Summary Card Row */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        background: '#fafaf9',
                        padding: '12px',
                        borderRadius: '12px',
                        border: `1px solid ${colors.border}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colors.textMuted }}>Overall Score</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: colors.textDark }}>
                              {Number(store.rating) > 0 ? Number(store.rating).toFixed(1) : '0.0'}
                            </span>
                            <Star size={12} className="star-filled" />
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <StarRating rating={Number(store.rating)} size={14} />
                          <span style={{ fontSize: '0.75rem', color: colors.textMuted, fontWeight: 600 }}>
                            {store.ratings_count || '288'} Ratings
                          </span>
                        </div>
                      </div>

                      {/* User's Submitted Rating Badge */}
                      {hasRated ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: colors.accentLight,
                          border: `1px solid ${colors.accent}`,
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: colors.accent
                        }}>
                          <span>Your Rating:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <span>{store.user_rating}</span>
                            <Star size={12} style={{ fill: colors.accent, color: colors.accent }} />
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#fafaf9',
                          border: `1px dashed ${colors.border}`,
                          fontSize: '0.8rem',
                          textAlign: 'center',
                          color: colors.textMuted,
                          fontWeight: 500
                        }}>
                          You haven't rated this cafe yet
                        </div>
                      )}

                      {/* View details button */}
                      <button
                        onClick={() => setSelectedStoreId(store.id)}
                        className="btn btn-secondary"
                        style={{ width: '100%', marginTop: 'auto', padding: '10px', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                      >
                        <Coffee size={16} />
                        <span>View Cafe Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: `1px solid ${colors.border}`, padding: '60px', textAlign: 'center', color: colors.textMuted }}>
              <Coffee size={36} style={{ marginBottom: '12px', color: colors.accent }} />
              <p style={{ fontWeight: 600 }}>No cafes found matching your search criteria.</p>
            </div>
          )}

        </div>
      )}

      {/* Shared Rate/Modify Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isModifying ? `Modify Review: ${selectedStore?.name}` : `Submit Review: ${selectedStore?.name}`}
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

        <form onSubmit={handleSubmitRating} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: colors.textMuted, fontSize: '0.95rem', margin: 0, textAlign: 'center' }}>
            {isModifying 
              ? 'Update your rating stars and review comments below:' 
              : 'Choose a star rating and leave a comment to share your experience:'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px', background: '#fafaf9', borderRadius: '12px', border: `1px solid ${colors.border}` }}>
            <StarRating 
              rating={selectedRating} 
              interactive={true} 
              onRatingChange={setSelectedRating} 
              size={36} 
            />
          </div>

          {selectedRating > 0 && (
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: colors.accent, textAlign: 'center' }}>
              {selectedRating} Star{selectedRating > 1 ? 's' : ''} Selected
            </span>
          )}

          {/* Comment text area */}
          <div className="form-group">
            <label className="form-label" style={{ color: colors.textDark, fontWeight: 600 }}>Write a Review Comment (Optional)</label>
            <textarea
              className="form-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Tell us about the coffee taste, service speed, latte art or ambient environment..."
              rows={4}
              style={{ backgroundColor: '#ffffff', borderColor: colors.border, color: colors.textDark, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting || selectedRating === 0}>
              {submitting ? 'Saving...' : isModifying ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserDashboard;
