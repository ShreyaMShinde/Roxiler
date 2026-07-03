import React, { useState } from 'react';
import { Coffee, Star, MapPin, Award, CheckCircle, Mail, Send, ChevronRight, Clock, Users } from 'lucide-react';
import heroCoffee from '../assets/hero_coffee.png';

const Home = ({ onLoginClick, onRegisterClick }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [formSent, setFormSent] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactName && contactEmail && contactMessage) {
      setFormSent(true);
      setTimeout(() => {
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setFormSent(false);
        alert('Thank you for contacting us! We will get back to you shortly.');
      }, 1000);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Color variables scoped for this light page
  const colors = {
    bg: '#fbf9f4',
    bgCard: '#f4ebd9',
    textDark: '#2b1b17',
    textMuted: '#5e4e4a',
    accent: '#8d5e44',
    accentLight: '#ebdccb',
    border: 'rgba(94, 78, 74, 0.15)',
    white: '#ffffff'
  };

  return (
    <div style={{ 
      backgroundColor: colors.bg, 
      color: colors.textDark, 
      fontFamily: "'Outfit', sans-serif",
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      {/* 1. Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 48px',
        backgroundColor: colors.accentLight,
        borderBottom: `1px solid ${colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: colors.textDark, letterSpacing: '-0.02em' }}>
            Coffee
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: 'none', border: 'none', color: colors.textDark, cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>Home</button>
          <button onClick={() => scrollToSection('features')} style={{ background: 'none', border: 'none', color: colors.textDark, cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>Features</button>
          <button onClick={() => scrollToSection('about')} style={{ background: 'none', border: 'none', color: colors.textDark, cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>Our Purpose</button>
          <button onClick={() => scrollToSection('gallery')} style={{ background: 'none', border: 'none', color: colors.textDark, cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>Local Highlights</button>
          <button onClick={() => scrollToSection('contact')} style={{ background: 'none', border: 'none', color: colors.textDark, cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>Contact</button>
        </div>

        {/* Auth Actions */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={onLoginClick} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: colors.textDark, 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            Log In
          </button>
          <button 
            onClick={onRegisterClick} 
            style={{ 
              backgroundColor: colors.accent, 
              color: '#fff', 
              border: 'none',
              padding: '8px 20px', 
              borderRadius: '20px', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header style={{
        display: 'flex',
        flexWrap: 'wrap',
        backgroundColor: colors.accentLight,
        minHeight: '520px',
        position: 'relative'
      }}>
        {/* Left Side Info */}
        <div style={{
          flex: '1 1 500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          gap: '24px',
          backgroundColor: '#261b17', // Dark espresso hero left side
          color: '#ffffff'
        }}>
          <h1 style={{
            fontSize: '3.3rem',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            fontFamily: "Playfair Display, Georgia, serif"
          }}>
            Rate Local Cafes, Coffee & Lattes!
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: 1.6,
            maxWidth: '460px'
          }}>
            A dedicated community hub where store owners register their shops for neighborhood outreach, and coffee enthusiasts discover, enjoy, and rate their favorite locality coffee cups.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <button 
              onClick={onRegisterClick}
              style={{
                backgroundColor: '#ffffff',
                color: colors.textDark,
                border: 'none',
                padding: '12px 28px',
                borderRadius: '30px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              Sign Up Now
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              style={{
                backgroundColor: colors.accent,
                color: '#ffffff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '30px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              Explore Features
            </button>
          </div>
        </div>

        {/* Right Side Image */}
        <div style={{
          flex: '1 1 500px',
          backgroundImage: `url(${heroCoffee})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '400px'
        }} />
      </header>

      {/* 3. Features Section */}
      <section id="features" style={{
        padding: '60px 48px',
        backgroundColor: colors.bg,
        borderBottom: `1px solid ${colors.border}`
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '40px',
          color: colors.textDark
        }}>
          How AromaRate Works
        </h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: '20px'
        }}>
          {/* Column 1 */}
          <div style={{
            flex: '1 1 220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px',
            borderRight: `1px solid ${colors.border}`
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: colors.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              marginBottom: '16px'
            }}>
              <MapPin size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Locate Shops</h4>
            <p style={{ fontSize: '0.85rem', color: colors.textMuted, lineHeight: 1.5 }}>
              Browse a directory of registered cafes in your immediate locality.
            </p>
          </div>

          {/* Column 2 */}
          <div style={{
            flex: '1 1 220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px',
            borderRight: `1px solid ${colors.border}`
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: colors.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              marginBottom: '16px'
            }}>
              <Star size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Rate Coffee & Lattes</h4>
            <p style={{ fontSize: '0.85rem', color: colors.textMuted, lineHeight: 1.5 }}>
              Submit 1-to-5 star scores based on latte art, coffee taste, and ambiance.
            </p>
          </div>

          {/* Column 3 */}
          <div style={{
            flex: '1 1 220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px',
            borderRight: `1px solid ${colors.border}`
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: colors.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              marginBottom: '16px'
            }}>
              <Users size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Reach Customers</h4>
            <p style={{ fontSize: '0.85rem', color: colors.textMuted, lineHeight: 1.5 }}>
              Cafe owners list their stores to expand locality visibility and build outreach.
            </p>
          </div>

          {/* Column 4 */}
          <div style={{
            flex: '1 1 220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: colors.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              marginBottom: '16px'
            }}>
              <Coffee size={24} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Refined Selections</h4>
            <p style={{ fontSize: '0.85rem', color: colors.textMuted, lineHeight: 1.5 }}>
              Check user feedback lists to order the absolute best espressos in town.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Split Promo Section */}
      <section id="about" style={{
        display: 'flex',
        flexWrap: 'wrap',
        borderBottom: `1px solid ${colors.border}`
      }}>
        {/* Left Side: For Coffee Lovers */}
        <div style={{
          flex: '1 1 500px',
          padding: '60px 80px',
          backgroundColor: '#382b26', // Warm deep brown card
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <span style={{
            fontSize: '0.85rem',
            color: colors.accentLight,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            For Coffee Lovers
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700 }}>Enjoy, Explore & Review</h2>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, maxWidth: '440px' }}>
            Find the nearest cafe serve and cast your rating. Keep track of your own rating scores and help others find the perfect specialty coffee.
          </p>
          <button
            onClick={onLoginClick}
            style={{
              alignSelf: 'flex-start',
              border: '1px solid #ffffff',
              backgroundColor: 'transparent',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '20px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Find Cafes
          </button>
        </div>

        {/* Right Side: For Store Owners */}
        <div style={{
          flex: '1 1 500px',
          padding: '60px 80px',
          backgroundColor: colors.bgCard,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <span style={{
            fontSize: '0.85rem',
            color: colors.accent,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            For Store Owners
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: colors.textDark }}>
            Boost Locality Outreach
          </h2>
          <p style={{ fontSize: '0.95rem', color: colors.textMuted, lineHeight: 1.6, maxWidth: '440px' }}>
            Register your store details, email, and address. Enable local users to locate your establishment, read your star score dashboard, and visit you for their morning caffeinated cups.
          </p>
          <button
            onClick={onRegisterClick}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.textDark,
              color: '#ffffff',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '20px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Register My Cafe
          </button>
        </div>
      </section>

      {/* 5. Locality Highlights Gallery */}
      <section id="gallery" style={{
        padding: '60px 48px',
        backgroundColor: colors.bg,
        borderBottom: `1px solid ${colors.border}`
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.8rem', color: colors.accent, fontWeight: 700, textTransform: 'uppercase' }}>
            Featured Local Cups
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '4px' }}>
            Morning Happy Highlights
          </h2>
        </div>

        {/* Gallery Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[1, 2, 3, 4].map((item) => (
            <div 
              key={item}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: colors.white,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: `1px solid ${colors.border}`
              }}
            >
              <div style={{
                height: '180px',
                backgroundImage: `url(${heroCoffee})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>
                  {item === 1 ? 'Macchiato Art' : item === 2 ? 'Espresso Tonic' : item === 3 ? 'Classic Flat White' : 'Pour Over Origin'}
                </h5>
                <span style={{ fontSize: '0.8rem', color: colors.accent, fontWeight: 600 }}>Locality Pick</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Contact Us Section */}
      <section id="contact" style={{ padding: '80px 48px', backgroundColor: colors.accentLight }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: colors.textDark }}>Send Us feedback</h2>
            <p style={{ color: colors.textMuted, fontSize: '0.95rem', marginTop: '4px' }}>
              We would love to hear from you. Register your cafe or ask a question!
            </p>
          </div>

          <div style={{
            backgroundColor: colors.bg,
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: `1px solid ${colors.border}`
          }}>
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ color: colors.textDark }}>Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Name"
                  style={{ backgroundColor: colors.white, borderColor: colors.border, color: colors.textDark }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: colors.textDark }}>Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  style={{ backgroundColor: colors.white, borderColor: colors.border, color: colors.textDark }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ color: colors.textDark }}>Message</label>
                <textarea
                  className="form-input"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Tell us what you think..."
                  rows={4}
                  style={{ resize: 'vertical', backgroundColor: colors.white, borderColor: colors.border, color: colors.textDark }}
                  required
                />
              </div>

              <button type="submit" style={{
                width: '100%',
                backgroundColor: colors.textDark,
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                Send Message
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 48px',
        backgroundColor: '#261b17', // Dark coffee footer
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Coffee size={16} style={{ color: colors.accent }} />
          <span style={{ fontWeight: 700, color: '#ffffff' }}>Coffee Ratings</span>
        </div>
        <p>© 2026 AromaRate. All rights reserved. Savor the Perfect Brew.</p>
      </footer>
    </div>
  );
};

export default Home;
