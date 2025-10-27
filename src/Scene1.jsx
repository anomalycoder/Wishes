import React, { useEffect } from 'react';

const Scene1 = () => {
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
      <h1 className="main-heading">Happy Birthday, Shree Saini!</h1>
      <p className="scroll-down-prompt">Scroll down...</p>
    </section>
  );
};

export default Scene1;
