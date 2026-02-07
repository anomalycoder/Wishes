import React from 'react';

const Scene4 = () => {
  return (
    <section style={{
      padding: '60px 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'transparent', // Blends with the background of the app
      position: 'relative'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '30px',
        width: '100%',
        maxWidth: '500px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        transition: 'transform 0.3s ease',
        cursor: 'default'
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{
          fontSize: '3rem',
          marginBottom: '15px'
        }}>
          🕰️
        </div>
        <h3 style={{
          fontSize: '1.8rem',
          color: '#FFB6C1',
          marginBottom: '10px',
          fontWeight: 400,
          fontFamily: "'Great Vibes', cursive"
        }}>
          A little note...
        </h3>
        <p style={{
          fontSize: '1.1rem',
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: 1.6,
          marginBottom: '0'
        }}>
          I know the wishes are slightly late, but they were crafted with so much heart. <br />
          <span style={{ color: '#FF69B4', fontWeight: 600 }}>Hope you can forgive me?</span>
        </p>

        {/* Visual indicator of CTA */}
        <div style={{
          marginTop: '25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          <div style={{ height: '1px', width: '30px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
          Scroll for the finale
          <div style={{ height: '1px', width: '30px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
        </div>
      </div>
    </section>
  );
};

export default Scene4;