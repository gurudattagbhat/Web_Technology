import React from 'react';
import { EVENT_TYPES, VENUES, COLLEGE_FEST_INFO } from '../data/eventData';
import { 
  ArrowRight, Sparkles, MapPin, Users, Star, 
  CheckCircle2, Clock, Calendar, GraduationCap, Trophy, Music, Code, Flame, Gamepad2, Cpu
} from 'lucide-react';

const iconMap = {
  Music: Music,
  Code: Code,
  Sparkles: Sparkles,
  Gamepad2: Gamepad2,
  Flame: Flame,
  Cpu: Cpu
};

export default function Dashboard({ navigateTo, onSelectVenue, recentBookings, onViewBookingDetails }) {
  // Correctly mapped images with top-positioned badges & non-colliding labels
  const festImages = [
    { src: '/images/image1.webp', title: 'Alliance ONE 2026 Flagship Fest', badge: 'Official Banner', category: '3 Days Mega Fest' },
    { src: '/images/images (2).jpeg', title: 'Battle of Bands Live Night', badge: 'Main Amphitheatre', category: 'Cultural Night' },
    { src: '/images/images.jpeg', title: 'HackAlliance 24h Hackathon', badge: 'Tech Park', category: 'Hackathon' },
    { src: '/images/download.jpeg', title: 'Esports Arena & Pro-Night', badge: 'Pro Night', category: 'Live Concert' }
  ];

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '80px', width: '100%' }}>
      {/* Alliance ONE Hero Section with Full Event Background Image */}
      <section style={{ 
        padding: '70px 0 60px', 
        position: 'relative',
        backgroundImage: 'url("/images/images (1).jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden'
      }}>
        {/* Rich Ambient Gradient Tint */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(15, 26, 21, 0.78) 0%, rgba(27, 45, 38, 0.68) 100%)',
          zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'center'
          }}>
            {/* Left Column: Glassmorphism Card Overlay */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              padding: '40px',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.6)'
            }}>
              <div className="badge badge-emerald" style={{ marginBottom: '16px' }}>
                <GraduationCap size={14} /> Official Registration Portal — {COLLEGE_FEST_INFO.universityName}
              </div>
              
              <h1 style={{ 
                fontSize: '3.3rem', 
                letterSpacing: '-1.5px', 
                marginBottom: '18px',
                color: 'var(--text-primary)',
                lineHeight: 1.15
              }}>
                Alliance <span style={{ color: 'var(--accent-primary)' }}>ONE 2026</span>
              </h1>

              <div style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--accent-gold)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Calendar size={20} /> {COLLEGE_FEST_INFO.dates} • Bengaluru Campus
              </div>

              <p style={{ 
                fontSize: '1.08rem', 
                color: 'var(--text-secondary)', 
                marginBottom: '32px',
                lineHeight: 1.7 
              }}>
                Join South India’s biggest inter-college cultural, technical, and esports extravaganza! Register solo or form your college team for 35+ competitions, pro-nights, and workshops.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => navigateTo('register')}
                >
                  Reg Page / Register for Events <ArrowRight size={20} />
                </button>
                <a 
                  href="#events-list"
                  className="btn btn-secondary btn-lg"
                >
                  Explore Competitions
                </a>
              </div>

              {/* Statistics Bar */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '16px', 
                marginTop: '36px',
                paddingTop: '24px',
                borderTop: '1px solid var(--border-color)'
              }}>
                <div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {COLLEGE_FEST_INFO.stats.participants}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Delegates</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    {COLLEGE_FEST_INFO.stats.colleges}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Colleges</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--accent-sage)' }}>
                    {COLLEGE_FEST_INFO.stats.eventsCount}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Events</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {COLLEGE_FEST_INFO.stats.prizePool}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Prize Pool</div>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Gallery Cards over Event Background */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Card 1: Official Banner */}
                <div className="card" style={{ overflow: 'hidden', height: '240px', position: 'relative', boxShadow: '0 12px 30px rgba(0,0,0,0.3)' }}>
                  <img 
                    src={festImages[0].src} 
                    alt={festImages[0].title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 10 }}>
                    <span className="badge badge-gold" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
                      {festImages[0].badge}
                    </span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 24, 20, 0.92) 0%, rgba(15, 24, 20, 0.3) 50%, transparent 100%)',
                    padding: '18px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    color: '#FFFFFF'
                  }}>
                    <strong style={{ fontSize: '1.05rem', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                      {festImages[0].title}
                    </strong>
                  </div>
                </div>

                {/* Card 2: Battle of Bands */}
                <div className="card" style={{ overflow: 'hidden', height: '200px', position: 'relative', boxShadow: '0 12px 30px rgba(0,0,0,0.3)' }}>
                  <img 
                    src={festImages[1].src} 
                    alt={festImages[1].title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 10 }}>
                    <span className="badge badge-emerald" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
                      {festImages[1].badge}
                    </span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 24, 20, 0.92) 0%, rgba(15, 24, 20, 0.3) 50%, transparent 100%)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    color: '#FFFFFF'
                  }}>
                    <strong style={{ fontSize: '0.98rem', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                      {festImages[1].title}
                    </strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '24px' }}>
                {/* Card 3: HackAlliance */}
                <div className="card" style={{ overflow: 'hidden', height: '200px', position: 'relative', boxShadow: '0 12px 30px rgba(0,0,0,0.3)' }}>
                  <img 
                    src={festImages[2].src} 
                    alt={festImages[2].title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 10 }}>
                    <span className="badge badge-amber" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
                      {festImages[2].badge}
                    </span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 24, 20, 0.92) 0%, rgba(15, 24, 20, 0.3) 50%, transparent 100%)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    color: '#FFFFFF'
                  }}>
                    <strong style={{ fontSize: '0.98rem', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                      {festImages[2].title}
                    </strong>
                  </div>
                </div>

                {/* Card 4: Esports Arena */}
                <div className="card" style={{ overflow: 'hidden', height: '240px', position: 'relative', boxShadow: '0 12px 30px rgba(0,0,0,0.3)' }}>
                  <img 
                    src={festImages[3].src} 
                    alt={festImages[3].title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 10 }}>
                    <span className="badge badge-emerald" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
                      {festImages[3].badge}
                    </span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 24, 20, 0.92) 0%, rgba(15, 24, 20, 0.3) 50%, transparent 100%)',
                    padding: '18px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    color: '#FFFFFF'
                  }}>
                    <strong style={{ fontSize: '1.05rem', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                      {festImages[3].title}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Student Registrations Quick Preview Widget */}
      {recentBookings && recentBookings.length > 0 && (
        <section style={{ padding: '24px 0' }}>
          <div className="container">
            <div className="card" style={{ 
              padding: '28px', 
              backgroundColor: 'var(--accent-primary-light)', 
              borderColor: 'var(--accent-primary)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Trophy size={22} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Active Student Registration Pass</h3>
                </div>
                <span className="badge badge-sage">
                  <CheckCircle2 size={14} /> {recentBookings[0].bookingStatus}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Pass Reference ID</span>
                  <div style={{ fontWeight: 800, color: 'var(--accent-primary)' }}>{recentBookings[0].id}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Delegate & College</span>
                  <div style={{ fontWeight: 600 }}>{recentBookings[0].customerName} ({recentBookings[0].collegeName || 'Alliance Univ'})</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Registered Event</span>
                  <div style={{ fontWeight: 600 }}>{recentBookings[0].eventTypeName} @ {recentBookings[0].venueName}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Event Date & Slot</span>
                  <div style={{ fontWeight: 600 }}>{recentBookings[0].eventDate} ({recentBookings[0].startTime})</div>
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => onViewBookingDetails(recentBookings[0])}
                >
                  View Official Fest Entry Pass <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Alliance ONE Events Showcase */}
      <section id="events-list" style={{ padding: '50px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 44px' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '10px' }}>Competitions & Showdowns</span>
            <h2 style={{ fontSize: '2.2rem' }}>Alliance ONE 2026 Events Lineup</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Select your competition format. Choose between solo entry or team registrations.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '28px' 
          }}>
            {EVENT_TYPES.map((type) => {
              const IconComp = iconMap[type.icon] || Trophy;
              return (
                <div 
                  key={type.id} 
                  className="card"
                  style={{ 
                    padding: '28px', 
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                  onClick={() => navigateTo('register', { eventType: type.id })}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ 
                        width: '52px', 
                        height: '52px', 
                        borderRadius: '14px', 
                        backgroundColor: 'var(--accent-primary-light)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'var(--accent-primary)'
                      }}>
                        <IconComp size={26} />
                      </div>
                      <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                        {type.category}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{type.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                      {type.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ 
                      fontSize: '0.84rem', 
                      color: 'var(--text-muted)', 
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span>Format: <strong>{type.teamType}</strong></span>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                        Base Fee: ₹{type.baseFee}
                      </span>
                    </div>

                    <button 
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%' }}
                    >
                      Register for {type.name} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Alliance Campus Locations & Venues */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 44px' }}>
            <span className="badge badge-gold" style={{ marginBottom: '10px' }}>Campus Map & Arenas</span>
            <h2 style={{ fontSize: '2.2rem' }}>Alliance University Event Venues</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              State-of-the-art auditoriums, tech labs, open grounds, and amphitheatres across campus.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
            gap: '32px' 
          }}>
            {VENUES.map((venue) => (
              <div key={venue.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '220px', position: 'relative' }}>
                  <img 
                    src={venue.image} 
                    alt={venue.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ 
                    position: 'absolute', 
                    top: '14px', 
                    right: '14px', 
                    backgroundColor: '#FFFFFF',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: 'var(--shadow-card)'
                  }}>
                    <Star size={14} color="var(--accent-gold)" fill="var(--accent-gold)" /> {venue.rating} Campus Rating
                  </div>
                </div>

                <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>{venue.name}</h3>
                    <div style={{ 
                      fontSize: '0.88rem', 
                      color: 'var(--text-secondary)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      marginBottom: '18px' 
                    }}>
                      <MapPin size={15} color="var(--accent-primary)" /> {venue.location}, {venue.city}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                      {venue.features.map((feat, idx) => (
                        <span key={idx} style={{ 
                          fontSize: '0.8rem', 
                          backgroundColor: 'var(--bg-primary)',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          color: 'var(--text-secondary)'
                        }}>
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ 
                    borderTop: '1px solid var(--border-color)', 
                    paddingTop: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Arena Capacity</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                        {venue.capacity} Delegates
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => onSelectVenue(venue.id)}
                    >
                      Select Venue & Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
