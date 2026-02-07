import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Sparkles, Environment, Float, ContactShadows } from '@react-three/drei';
import ConfettiExplosion from 'react-confetti-explosion';
import gsap from 'gsap';

import cakeUrl from './cake.glb?url'; // Use explicit relative import from same folder

// --- Improved Cake Model with Rotation Logic ---
function CakeModel({ cakeRef, isAutoRotate }) {
  const { scene } = useGLTF(cakeUrl); // Use the resolved URL from import

  // Auto-rotation continues unless manually controlled
  useFrame((state, delta) => {
    if (cakeRef.current && isAutoRotate) {
      cakeRef.current.rotation.y += delta * 0.5;
    }
  });

  // High-fidelity scale and position for impactful display
  return <primitive ref={cakeRef} object={scene} scale={2.5} position={[0, -120, 0]} />;
}

// --- Enhanced Fireworks Effect using Sparkles ---
function Fireworks({ isActive }) {
  if (!isActive) return null;

  return (
    <>
      <Sparkles count={500} scale={150} size={20} speed={4} opacity={1} color="#ff0000" position={[0, 80, 0]} />
      <Sparkles count={500} scale={150} size={20} speed={4} opacity={1} color="#FFD700" position={[120, 100, 120]} />
      <Sparkles count={500} scale={150} size={20} speed={4} opacity={1} color="#00ff00" position={[-120, 100, -120]} />
      <Sparkles count={500} scale={150} size={20} speed={4} opacity={1} color="#ff69b4" position={[120, 80, -120]} />
      <Sparkles count={500} scale={150} size={20} speed={4} opacity={1} color="#00ffff" position={[-120, 120, 120]} />
    </>
  );
}

const Scene3 = () => {
  const [isCakeCut, setIsCakeCut] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  const startX = useRef(0);
  const startY = useRef(0);
  const startRotation = useRef(0);
  const cakeRef = useRef();
  const autoRotateTimeout = useRef(null);

  const handleCutCake = () => {
    setIsCakeCut(true);
    setShowFireworks(true);
    // Fireworks celebratory duration
    setTimeout(() => setShowFireworks(false), 6000);
  };

  // --- Interaction Logics (GSAP + Logic) ---
  const handleTouchStart = (e) => {
    if (e.target.closest('.cut-cake-button')) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    setIsHorizontalSwipe(false);
    if (autoRotateTimeout.current) clearTimeout(autoRotateTimeout.current);
    if (cakeRef.current) startRotation.current = cakeRef.current.rotation.y;
  };

  const handleTouchMove = (e) => {
    if (!cakeRef.current) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - startX.current;
    const deltaY = currentY - startY.current;

    if (!isHorizontalSwipe && !isDragging) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 15) {
        setIsHorizontalSwipe(true);
        setIsDragging(true);
        setIsAutoRotate(false);
      }
      return;
    }

    if (isHorizontalSwipe && isDragging) {
      const newRotation = startRotation.current + (deltaX * 0.015);
      gsap.to(cakeRef.current.rotation, {
        y: newRotation,
        duration: 0.1,
        ease: 'power1.out',
        overwrite: true
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsHorizontalSwipe(false);
    autoRotateTimeout.current = setTimeout(() => setIsAutoRotate(true), 3000);
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.cut-cake-button')) return;
    setIsDragging(true);
    setIsAutoRotate(false);
    startX.current = e.clientX;
    if (autoRotateTimeout.current) clearTimeout(autoRotateTimeout.current);
    if (cakeRef.current) startRotation.current = cakeRef.current.rotation.y;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    autoRotateTimeout.current = setTimeout(() => setIsAutoRotate(true), 3000);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !cakeRef.current) return;
    const deltaX = e.clientX - startX.current;
    const newRotation = startRotation.current + (deltaX * 0.015);
    gsap.to(cakeRef.current.rotation, {
      y: newRotation,
      duration: 0.2,
      ease: 'power1.out',
      overwrite: true
    });
  };

  return (
    <section
      className="page-section page3"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'pan-y'
      }}
    >
      {/* Top Heading - Unified Style from App.css */}
      <h2 className="final-message-top">
        {isCakeCut ? 'Happy Birthday, Aarohi! 🎉' : 'Make a wish! ✨'}
      </h2>

      <Canvas
        camera={{ position: [-120, 100, -200], fov: 75 }}
        style={{ pointerEvents: 'none' }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={2} />
          <Environment preset="night" />
          <pointLight position={[0, 80, 0]} intensity={300} color="#ff4081" />
          <directionalLight position={[150, 150, 150]} intensity={2.5} />

          {/* Enhanced floating movement */}
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <CakeModel cakeRef={cakeRef} isAutoRotate={isAutoRotate} />
          </Float>

          {/* Premium ground contact shadows - Optimized for performance */}
          <ContactShadows resolution={512} scale={100} blur={2} opacity={0.4} far={20} color="#ff69b4" position={[0, -122, 0]} frames={1} />

          {/* Magical background sparkles */}
          <Sparkles count={250} scale={400} size={6} speed={0.8} color="#ff69b4" opacity={0.7} />

          <Fireworks isActive={showFireworks} />
        </Suspense>
      </Canvas>

      {/* High-Impact Confetti Explosion */}
      {isCakeCut && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', zIndex: 100, transform: 'translate(-50%, -50%)' }}>
          <ConfettiExplosion
            force={1.0}
            duration={5000}
            particleCount={400}
            width={2500}
            colors={['#ff4081', '#ffD700', '#ffffff', '#ff1493', '#ff69b4']}
          />
        </div>
      )}

      {/* Integrated Button - disappearing after interaction */}
      {!isCakeCut && (
        <button className="cut-cake-button" onClick={handleCutCake}>
          🎂 Cut the Cake! 🎂
        </button>
      )}

      {/* Bottom Message Card style */}
      {isCakeCut && (
        <p className="celebration-text">
          ✨ Wishing you the most magical year ahead! ✨
        </p>
      )}

      {/* Dynamic Instruction */}
      <p className="scene-instruction" style={{ opacity: isDragging ? 0 : 0.6, transition: 'opacity 0.3s' }}>
        ← Swipe to spin the cake →
      </p>

      {/* Enhancement: Magical Overlay Glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: isCakeCut ? 'radial-gradient(circle, rgba(255,105,180,0.15) 0%, transparent 70%)' : 'none',
        transition: 'background 2s ease'
      }} />

    </section>
  );
};

export default Scene3;