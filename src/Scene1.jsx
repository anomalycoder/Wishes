import React, { useEffect } from 'react';
import Countdown from './Countdown';

const Scene1 = () => {
  // Assuming the special day is today or very soon
  // You can adjust this date to her actual birthday!
  const targetDate = "2026-02-07T00:00:00";

  useEffect(() => {
    const heartInterval = setInterval(() => {
      const bg = document.querySelector('.page1-background');
      if (!bg) return;
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDuration = `${Math.random() * 5 + 5}s`;
      bg.appendChild(heart);
      setTimeout(() => heart.remove(), 10000);
    }, 300);
    return () => clearInterval(heartInterval);
  }, []);

  return (
    <section className="page-section page1">
      <div className="page1-background"></div>

      <div style={{ zIndex: 10, textAlign: 'center' }}>
        <h1 className="main-heading">Happy Birthday, Aarohi!</h1>

        {/* Added the Countdown touch */}
        <div style={{ marginTop: '20px', animation: 'fadeIn 2s ease' }}>
          <Countdown targetDate={targetDate} />
        </div>

        <p className="scroll-up-anim" style={{
          marginTop: '40px',
          fontSize: '1.2rem',
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '3px'
        }}>
          YOUR JOURNEY BEGINS
        </p>
      </div>

      <div className="scroll-down-prompt">
        <span>Scroll Down</span>
        <div style={{
          width: '2px',
          height: '30px',
          background: 'white',
          margin: '10px auto',
          animation: 'scrollLine 2s infinite'
        }}></div>
      </div>

      <style>{`
        @keyframes scrollLine {
            0% { transform: scaleY(0); transform-origin: top; }
            50% { transform: scaleY(1); transform-origin: top; }
            51% { transform: scaleY(1); transform-origin: bottom; }
            100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default Scene1;
