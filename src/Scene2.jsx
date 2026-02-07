import React, { useMemo, useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Environment, PerspectiveCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

// --- Configuration ---
const GRID_SIZE = 16;
const CUBE_SIZE = 0.45;
const GAP = 0.04;
const SCATTER_RADIUS = 18; // Wide scatter

const CUTE_MESSAGES = [
  "You're magical! ✨",
  "Wishing you joy! 💖",
  "Dream Big! 🌟",
  "You're the best! 👑",
  "So precious! 💎",
  "Keep smiling! 😊",
  "Infinite happiness! 🌈",
  "Enjoy your day! 🎂",
  "Piece by piece! 🧩",
  "A masterpiece! 🎨",
  "Shine bright! ✨",
  "Make a wish! 🌠",
  "Stay wonderful! 🌸"
];

const Voxel = ({ finalPosition, uv, texture, index, assembledProgress, onHover, onClick }) => {
  const mesh = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Random initial params for scattered look
  const initialPos = useMemo(() => new THREE.Vector3(
    (Math.random() - 0.5) * SCATTER_RADIUS,
    (Math.random() - 0.5) * SCATTER_RADIUS,
    (Math.random() - 0.5) * SCATTER_RADIUS
  ), []);

  const initialRot = useMemo(() => [
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2
  ], []);

  const { position, rotation, scale, color } = useSpring({
    position: [
      initialPos.x + (finalPosition[0] - initialPos.x) * assembledProgress,
      initialPos.y + (finalPosition[1] - initialPos.y) * assembledProgress,
      initialPos.z + (finalPosition[2] - initialPos.z) * assembledProgress
    ],
    rotation: [
      initialRot[0] * (1 - assembledProgress),
      initialRot[1] * (1 - assembledProgress),
      initialRot[2] * (1 - assembledProgress)
    ],
    // "Zoomed bits" - keep them somewhat substantial even when unassembled
    scale: hovered ? [1.2, 1.2, 1.2] : (assembledProgress > 0.8 ? [1, 1, 1] : [0.85, 0.85, 0.85]),
    color: hovered ? '#ff69b4' : (assembledProgress > 0.8 ? '#ffffff' : '#e0e0e0'),
    config: { mass: 1, tension: 100, friction: 30 }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const u = uv[0];
    const v = uv[1];
    const step = 1 / GRID_SIZE;
    const uvAttribute = geo.attributes.uv;
    const uvs = uvAttribute.array;
    const normals = geo.attributes.normal.array;

    for (let i = 0; i < uvs.length; i += 2) {
      const vertexIndex = i / 2;
      const nz = normals[vertexIndex * 3 + 2];
      if (nz < -0.5) {
        uvs[i] = (1 - (u + step)) + uvs[i] * step;
        uvs[i + 1] = v + uvs[i + 1] * step;
      } else {
        uvs[i] = u + uvs[i] * step;
        uvs[i + 1] = v + uvs[i + 1] * step;
      }
    }
    geo.attributes.uv.needsUpdate = true;
    return geo;
  }, [uv]);

  useFrame((state) => {
    if (!mesh.current) return;
    // Float animation for unassembled blocks
    if (assembledProgress < 0.9) {
      mesh.current.position.y += Math.sin(state.clock.elapsedTime + index * 0.1) * 0.003;
      mesh.current.rotation.x += 0.001;
    }
  });

  return (
    <animated.mesh
      ref={mesh}
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(index); }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      castShadow
      receiveShadow
    >
      <animated.meshStandardMaterial map={texture} color={color} roughness={0.3} metalness={0.1} />
    </animated.mesh>
  );
};

const ImageVoxels = ({ setLoaded, onComplete, onInteract }) => {
  const texture = useTexture('images/img1.jpg');
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const targetProgress = useRef(0);

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      if (setLoaded) setLoaded(true);
    }
  }, [texture, setLoaded]);

  useFrame((state, delta) => {
    if (progress < targetProgress.current) {
      const speed = 2.5 * delta;
      setProgress(p => {
        const next = p + (targetProgress.current - p) * speed;
        if (next > 0.99) return 1;
        return next;
      });
    }
    if (targetProgress.current < 1 && progress < 0.1) {
      setProgress(p => Math.min(p + 0.02 * delta, 0.1));
    }
    if (progress >= 0.99 && !complete) {
      setComplete(true);
      if (onComplete) onComplete();
    }
  });

  const handleInteraction = () => {
    targetProgress.current = Math.min(targetProgress.current + 0.15, 1);
    if (onInteract) onInteract();
  };

  const voxels = useMemo(() => {
    const temp = [];
    const startX = -((GRID_SIZE * (CUBE_SIZE + GAP)) / 2) + CUBE_SIZE / 2;
    const startY = -((GRID_SIZE * (CUBE_SIZE + GAP)) / 2) + CUBE_SIZE / 2;

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const x = startX + i * (CUBE_SIZE + GAP);
        const y = startY + j * (CUBE_SIZE + GAP);
        const u = i / GRID_SIZE;
        const v = j / GRID_SIZE;
        temp.push({ position: [x, y, 0], uv: [u, v], id: `voxel-${i}-${j}` });
      }
    }
    return temp;
  }, []);

  // Removed global window listener

  return (
    <group>
      {/* Background Catcher for clicks that miss voxels */}
      <mesh onClick={(e) => { e.stopPropagation(); handleInteraction(); }}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0.0} />
      </mesh>

      {/* Voxels */}
      <group onClick={(e) => { e.stopPropagation(); handleInteraction(); }}>
        {voxels.map((voxel, index) => (
          <Voxel key={voxel.id} index={index} assembledProgress={progress} finalPosition={voxel.position} uv={voxel.uv} texture={texture} onHover={() => { }} onClick={handleInteraction} />
        ))}
      </group>
      {complete && <Sparkles count={80} scale={10} color="#00008B" opacity={0.8} size={8} />}
    </group>
  );
};

const Scene2 = () => {
  // Start with the hint, then switch to cute messages
  const [instruction, setInstruction] = useState("(Tap repeatedly to assemble!)");
  const [isCuteMode, setIsCuteMode] = useState(false);

  // Scoped interaction handler
  const handleSceneClick = () => {
    const randomMsg = CUTE_MESSAGES[Math.floor(Math.random() * CUTE_MESSAGES.length)];
    setInstruction(randomMsg);
    setIsCuteMode(true);
  };

  return (
    <section className="page-section page2" style={{ background: '#000', position: 'relative' }} onClick={handleSceneClick}>
      {/* Title Overlay */}
      <div className="scene-content" style={{ pointerEvents: 'none', position: 'absolute', zIndex: 10, width: '100%', height: '100%', top: 0, left: 0 }}>
        {/* ... (Keep title code same, just abbreviated for matching) ... */}
        <h2 className="scene-heading" style={{
          position: 'absolute', width: '100%', textAlign: 'center', top: '5%', fontSize: '3rem', margin: 0, color: '#ff69b4'
        }}>
          Interactive Memory
        </h2>

        <p className={`scene-instruction ${isCuteMode ? "cute-text-anim" : ""}`}
          key={instruction} /* Force re-render for animation */
          style={{
            position: 'absolute',
            bottom: '20%',
            width: '100%',
            textAlign: 'center',
            color: isCuteMode ? '#ff69b4' : 'rgba(255, 255, 255, 0.8)',
            fontSize: isCuteMode ? '2rem' : '1.2rem',
            transition: 'all 0.3s ease',
            textShadow: isCuteMode ? '0 0 20px rgba(255, 105, 180, 0.8)' : 'none'
          }}>
          {instruction}
        </p>
      </div>

      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 14], fov: 50 }}>
        <ambientLight intensity={0.8} color="#fff0f5" />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <PerspectiveCamera makeDefault position={[0, 0, 14]} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
        <Suspense fallback={null}>
          <ImageVoxels onInteract={handleSceneClick} />
        </Suspense>
        <Sparkles count={150} scale={20} size={5} opacity={0.4} color="#ffffff" />
      </Canvas>
    </section>
  );
};
export default Scene2;