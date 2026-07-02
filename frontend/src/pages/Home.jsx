import React, { useState } from 'react';
import { Coffee, Star, MapPin, Award, CheckCircle, Mail, Send, ChevronRight } from 'lucide-react';

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

  return (
    <div className="animate-fade-in" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* 1. Public Navbar */}
      <nav className="glass-panel" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderRadius: '0 0 16px 16px',
        borderTop: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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

        {/* Links */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>Home</button>
          <button onClick={() => scrollToSection('features')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>Features</button>
          <button onClick={() => scrollToSection('about')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>About Us</button>
          <button onClick={() => scrollToSection('contact')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>Contact</button>
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onLoginClick} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Sign In
          </button>
          <button className="btn btn-primary" onClick={onRegisterClick} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section style={{
        padding: '60px 24px 100px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '40px',
        minHeight: 'calc(100vh - 120px)'
      }}>
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <span style={{
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '6px 12px',
            borderRadius: '20px',
            alignSelf: 'flex-start'
          }}>
            ☕ Discover Your Perfect Brew
          </span>
          
          <h1 style={{
            fontSize: '3.6rem',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Discover & Rate the Finest Local Cafes
          </h1>
          
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '580px', lineHeight: 1.6 }}>
            AromaRate connects coffee lovers with premier roasters and cozy espresso bars. Share your feedback, update ratings, and find top-rated cups of coffee near you.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <button className="btn btn-primary" onClick={onLoginClick} style={{ padding: '14px 28px', fontSize: '1rem', gap: '10px' }}>
              Explore Cafes
              <ChevronRight size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => scrollToSection('about')} style={{ padding: '14px 28px', fontSize: '1rem' }}>
              Learn More
            </button>
          </div>
        </div>

        {/* Hero Interactive Mockup */}
        <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '380px',
            padding: '24px',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass-hover)',
            boxShadow: 'var(--shadow-lg)',
            transform: 'rotate(2deg)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'var(--accent)', padding: '6px', borderRadius: '8px', color: '#000' }}>
                  <Coffee size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>The Daily Grind Roasters</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Espresso Bar</p>
                </div>
              </div>
              <span style={{
                background: 'var(--accent-light)',
                color: 'var(--accent)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                Open
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              "Exceptional micro-lot single origins. The latte art is pristine and the seating is perfect for reading."
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', color: 'var(--accent)' }}>
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} style={{ fill: 'var(--accent)' }} />)}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>5.0 (148 reviews)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                <MapPin size={12} />
                <span>Downtown Seattle, WA</span>
              </div>
              <button className="btn btn-primary" onClick={onLoginClick} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                Rate Now
              </button>
            </div>
          </div>

          {/* Decorative backdrop blobs */}
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            opacity: 0.15,
            top: '-30px',
            right: '-10px',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--text-muted) 0%, transparent 70%)',
            opacity: 0.1,
            bottom: '-50px',
            left: '-20px',
            zIndex: 1
          }} />
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" style={{ padding: '80px 24px', borderTop: '1px solid var(--border-glass)', background: 'rgba(24, 18, 14, 0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>Engineered for Coffee Enthusiasts</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            A unified platform featuring customized portals for coffee aficionados, cafe managers, and administrators.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center' }}>
              <Star size={24} style={{ fill: 'var(--accent)' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Interactive Star Ratings</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Submit clean ratings on a scale of 1 to 5 stars. Preview overall shop performance and modify your rating dynamically.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'hsl(210, 80%, 65%)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center' }}>
              <Coffee size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Cafe Dashboards</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Cafe owners can log in to view customers feedback lists, evaluate average rating score, and manage shop locations.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center' }}>
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Admin Oversight</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Administrators get aggregate platform metrics, manage user roles, and apply searches and sorting on lists.
            </p>
          </div>
        </div>
      </section>

      {/* 4. About Us Section */}
      <section id="about" style={{ padding: '80px 24px', borderTop: '1px solid var(--border-glass)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>About AromaRate</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
                AromaRate was founded with a single mission: to spotlight premium coffee houses and help local beans get the recognition they deserve. We believe that finding a perfect double-espresso or a cozy flat-white corner shouldn't be guesswork.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
                Our rating platform is completely transparent. By allowing verified normal users to leave direct ratings, and cafe owners to review customer listings, we maintain a clean feedback ecosystem that fosters quality and community.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={16} className="star-filled" />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Strict Verification Constraints</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={16} className="star-filled" />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Interactive UI Sorting & Searches</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={16} className="star-filled" />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Premium Cafe Manager Portals</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '32px', background: 'var(--bg-glass-light)', maxWidth: '440px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '12px' }}>
                "Great coffee is not just a drink; it's a craft, a workspace, and a community."
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Whether you're looking for high-energy coffee shops to work from, roasters specializing in single-origins, or quiet corners to drink a macchiato, AromaRate is your digital companion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact Us Section */}
      <section id="contact" style={{ padding: '80px 24px', borderTop: '1px solid var(--border-glass)', background: 'rgba(24, 18, 14, 0.2)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>Get in Touch</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Have questions, feedback, or need help registering your cafe? Send us a message!
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Message</label>
                <textarea
                  className="form-input"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="How can we help you?"
                  rows={4}
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '10px' }}>
                Send Message
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 24px',
        borderTop: '1px solid var(--border-glass)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Coffee size={16} className="star-filled" />
          <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>AromaRate Portal</span>
        </div>
        <p>© 2026 AromaRate. All rights reserved. Crafted with passion for premium brews.</p>
      </footer>
    </div>
  );
};

export default Home;
