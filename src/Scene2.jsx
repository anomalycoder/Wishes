import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Your image paths
const imageUrls = [
  '/images/img1.jpg',
  '/images/img2.jpg',
  '/images/img3.jpg',
  '/images/img4.jpg',
  '/images/img5.jpg',
  '/images/img6.jpg',
];

// Photo card with image on BOTH sides
function PhotoCard({ url, position, rotation }) {
  const texture = useTexture(url);
  
  return (
    <group position={position} rotation={rotation}>
      
      {/* PINK BORDER - Shows on both sides */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1.9, 2.4]} />
        <meshBasicMaterial 
          color="#ff4081" 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* FRONT SIDE - Image on front */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1.7, 2.2]} />
        <meshBasicMaterial 
          map={texture}
          side={THREE.FrontSide}
          toneMapped={false}
        />
      </mesh>
      
      {/* BACK SIDE - Same image on back */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.7, 2.2]} />
        <meshBasicMaterial 
          map={texture}
          side={THREE.FrontSide}
          toneMapped={false}
        />
      </mesh>
      
    </group>
  );
}

function Gallery({ galleryRef }) {
  return (
    <group ref={galleryRef}>
      {imageUrls.map((url, i) => {
        const angle = (i / imageUrls.length) * Math.PI * 2;
        const radius = 2.5;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        return (
          <Suspense key={i} fallback={null}>
            <PhotoCard
              url={url}
              position={[x, 0, z]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            />
          </Suspense>
        );
      })}
    </group>
  );
}

const Scene2 = () => {
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startRotation = useRef(0);
  const galleryRef = useRef();

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.clientX;
    if (galleryRef.current) {
      startRotation.current = galleryRef.current.rotation.y;
    }
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !galleryRef.current) return;
    
    const deltaX = e.clientX - startX.current;
    const newRotation = startRotation.current + (deltaX * 0.01);
    
    gsap.to(galleryRef.current.rotation, {
      y: newRotation,
      duration: 0.15,
      ease: 'power1.out',
      overwrite: true,
    });
  };

  return (
    <section 
      className="page-section page2"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ 
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    >
      <h2 className="scene-heading">A few of my favorite moments...</h2>
      
      <Canvas 
        camera={{ 
          position: [0, 0, 5],
          fov: 60,
          near: 0.1,
          far: 100
        }}
      >
        {/* Bright lighting from all angles */}
        <ambientLight intensity={3} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, -5, -5]} intensity={1.5} />
        
        {/* SPARKLES BACKGROUND - NEW! */}
        <Sparkles
          count={200}               // Number of sparkle particles
          scale={15}                // Size of the sparkle area
          size={3}                  // Size of each sparkle dot
          speed={0.3}               // Animation speed
          opacity={0.6}             // Transparency
          color="#ffffff"           // White sparkles
        />
        
        {/* Another layer of colored sparkles */}
        <Sparkles
          count={100}
          scale={12}
          size={2}
          speed={0.2}
          opacity={0.4}
          color="#ff69b4"           // Pink sparkles to match theme
        />
        
        <Suspense fallback={null}>
          <Gallery galleryRef={galleryRef} />
        </Suspense>
      </Canvas>
      
      <p className="scene-instruction">
        ← Drag to rotate →
      </p>
    </section>
  );
};

export default Scene2;
