import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Sparkles } from '@react-three/drei';
import ConfettiExplosion from 'react-confetti-explosion';

function CakeModel(props) {
  const { scene } = useGLTF('/cake.glb');
  const cakeRef = useRef();
  
  // Continuous 360° rotation
  useFrame((state, delta) => {
    if (cakeRef.current) {
      cakeRef.current.rotation.y += delta * 0.5; // Smooth rotation speed
    }
  });
  
  return <primitive ref={cakeRef} object={scene} {...props} />;
}

// Custom Fireworks component using Sparkles
function Fireworks({ isActive }) {
  if (!isActive) return null;
  
  return (
    <>
      {/* Multiple sparkle bursts for fireworks effect */}
      <Sparkles
        count={300}
        scale={10}
        size={6}
        speed={2}
        opacity={1}
        color="#ff0000"
        position={[0, 2, 0]}
      />
      <Sparkles
        count={300}
        scale={10}
        size={6}
        speed={2}
        opacity={1}
        color="#00ff00"
        position={[2, 2, 2]}
      />
      <Sparkles
        count={300}
        scale={10}
        size={6}
        speed={2}
        opacity={1}
        color="#0000ff"
        position={[-2, 2, -2]}
      />
      <Sparkles
        count={300}
        scale={10}
        size={6}
        speed={2}
        opacity={1}
        color="#ffff00"
        position={[2, 2, -2]}
      />
      <Sparkles
        count={300}
        scale={10}
        size={6}
        speed={2}
        opacity={1}
        color="#ff00ff"
        position={[-2, 2, 2]}
      />
    </>
  );
}

const Scene3 = () => {
  const [isCakeCut, setIsCakeCut] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleCutCake = () => {
    setIsCakeCut(true);
    setShowFireworks(true);
    
    // Stop fireworks after 5 seconds
    setTimeout(() => {
      setShowFireworks(false);
    }, 5000);
  };

  return (
    <section className="page-section page3">
      {/* Text at the top */}
      <h2 className="final-message-top">
        {isCakeCut ? '🎉 Happy Birthday! 🎉' : 'Make a wish!'}
      </h2>
      
      {/* 3D Canvas */}
      <Canvas camera={{ position: [-120,100,-200], fov: 75 }}>
        {/* Enhanced lighting */}
        <ambientLight intensity={1.8} />
        <pointLight position={[0, 2, 0]} intensity={40} color="#ff9a21" />
        <directionalLight position={[5, 5, 5]} intensity={2.5} />
        <directionalLight position={[-5, 5, -5]} intensity={1.5} />
        
        <Suspense fallback={null}>
          {/* Rotating Cake */}
          <CakeModel scale={2.5} position={[0, -120, 0]} />
          
          {/* Background sparkles (always on) */}
          <Sparkles
            count={100}
            scale={6}
            size={2}
            speed={0.3}
            color="#ff4081"
          />
          
          {/* Fireworks (when cake is cut) */}
          <Fireworks isActive={showFireworks} />
        </Suspense>
        
        {/* OrbitControls allows manual rotation if desired */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate={false} // Manual rotation is handled in CakeModel
        />
      </Canvas>
      
      {/* Confetti explosion overlay */}
      {isCakeCut && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', zIndex: 100 }}>
          <ConfettiExplosion
            force={0.8}
            duration={3000}
            particleCount={250}
            width={1600}
            colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']}
          />
        </div>
      )}
      
      {/* Cut the Cake Button */}
      {!isCakeCut && (
        <button className="cut-cake-button" onClick={handleCutCake}>
          🎂 Cut the Cake! 🎂
        </button>
      )}
      
      {/* Success message after cutting */}
      {isCakeCut && (
        <p className="celebration-text">
          ✨ Wishing you the best birthday ever! ✨
        </p>
      )}
    </section>
  );
};

export default Scene3;
