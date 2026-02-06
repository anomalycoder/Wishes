import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles, OrbitControls, DragControls, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// 1. Image URL
const imgSrc = '/images/img1.jpg';

// Helper to load image
function useImagePixelColors(src, gridSize = 6) { // Ultra Reduced resolution for ~25-30 pixels
  const [pixels, setPixels] = useState([]);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const aspect = img.width / img.height;
      let w = gridSize;
      let h = gridSize;

      if (aspect > 1) h = Math.round(gridSize / aspect);
      else w = Math.round(gridSize * aspect);

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      const tempPixels = [];
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a > 50) {
            const color = new THREE.Color(`rgb(${r},${g},${b})`);
            tempPixels.push({
              x: (x - w / 2) * 1.2, // Gap spacing
              y: -(y - h / 2) * 1.2,
              z: 0,
              color: color
            });
          }
        }
      }
      setPixels(tempPixels);
    };
  }, [src, gridSize]);

  return pixels;
}

const InteractiveCube = ({ position, color }) => {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);

  useCursor(hovered);

  const handleClick = (e) => {
    e.stopPropagation();
    // Random rotation on click
    gsap.to(mesh.current.rotation, {
      x: mesh.current.rotation.x + (Math.random() > 0.5 ? Math.PI / 2 : 0),
      y: mesh.current.rotation.y + (Math.random() > 0.5 ? Math.PI / 2 : 0),
      duration: 0.5,
      ease: "back.out(1.7)"
    });
  };

  return (
    <mesh
      ref={mesh}
      position={[position.x, position.y, position.z]}
      onClick={handleClick}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
    </mesh>
  );
};

const Scene2 = () => {
  const pixels = useImagePixelColors(imgSrc, 7); // Approx 7x6 = 40 or less

  return (
    <section className="page-section page2" style={{ background: '#000' }}>
      <h2 className="scene-heading">Interactive Voxel Memories</h2>

      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -5, 5]} intensity={1} color="#ff00ff" />
        <Sparkles count={200} scale={20} size={4} opacity={0.4} />

        {/* DragControls wrapper allows moving the children */}
        {/* We wrap the cubes in DragControls so user can "move single single pixel" */}
        {pixels.length > 0 && (
          <DragControls>
            {pixels.map((p, i) => (
              <InteractiveCube key={i} position={p} color={p.color} />
            ))}
          </DragControls>
        )}

        <OrbitControls makeDefault />
      </Canvas>

      <p className="scene-instruction" style={{ color: '#aaa', bottom: '20px' }}>
        Drag to Move • Click to Rotate
      </p>
    </section>
  );
};

export default Scene2;
