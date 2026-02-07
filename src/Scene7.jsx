import React, { useState, useRef, Suspense, useLayoutEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, Float, Stars, Cylinder, Sphere, Box, Torus, Sparkles, Environment, MeshReflectorMaterial, useTexture, Html } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

// --- Hyper-Realistic 3D Bat Component ---
const HyperRealisticBat = ({ swing }) => {
    const { rotation } = useSpring({
        rotation: swing ? [0, 0, -Math.PI / 2.2] : [0, 0, Math.PI / 8],
        config: { mass: 1, tension: 180, friction: 12 }
    });

    return (
        <animated.group rotation={rotation} position={[0.5, -0.8, 2]}>
            <Cylinder args={[0.07, 0.07, 1.2, 32]} position={[0, 1.5, 0]}>
                <meshStandardMaterial color="#d4a373" roughness={0.9} />
            </Cylinder>
            {Array.from({ length: 12 }).map((_, i) => (
                <Cylinder key={i} args={[0.09, 0.09, 0.05, 32]} position={[0, 1.2 + i * 0.08, 0]}>
                    <meshStandardMaterial color={i % 2 === 0 ? "#004BA0" : "#003a80"} roughness={0.4} metalness={0.1} />
                </Cylinder>
            ))}
            <Cylinder args={[0.1, 0.09, 0.1, 32]} position={[0, 2.1, 0]}><meshStandardMaterial color="#004BA0" /></Cylinder>
            <group position={[0, -0.4, 0]}>
                <Box args={[0.85, 2.8, 0.25]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#fdf2d5" roughness={0.5} />
                </Box>
                <Box args={[0.4, 2.2, 0.1]} position={[0, -0.2, -0.15]}>
                    <meshStandardMaterial color="#fdf2d5" />
                </Box>
                <Box args={[0.87, 0.12, 0.27]} position={[0, -1.4, 0]}>
                    <meshStandardMaterial color="#222" roughness={0.8} />
                </Box>
            </group>
            <group position={[0, -0.3, 0.13]}>
                <Box args={[0.65, 2.1, 0.015]}>
                    <meshStandardMaterial color="#004BA0" metalness={0.7} roughness={0.2} />
                </Box>
                <Text position={[0, 0.2, 0.02]} rotation={[0, 0, -Math.PI / 2]} fontSize={0.28} color="#D1AB3E" fontWeight="900">
                    HITMAN 45
                </Text>
                <Box args={[0.7, 0.35, 0.015]} position={[0, -0.85, 0.01]}>
                    <meshStandardMaterial color="#D1AB3E" metalness={0.8} />
                </Box>
                <Text position={[0, -0.85, 0.03]} fontSize={0.1} color="#000" fontWeight="900">
                    PALTAN SPECIAL
                </Text>
            </group>
        </animated.group>
    );
};

// --- Updated Jumbotron Screen with Z-Fighting Fix ---
const StadiumScreen = () => {
    const texture = useTexture("/images/img5.png");

    useLayoutEffect(() => {
        if (texture) {
            texture.colorSpace = THREE.SRGBColorSpace;
            // Set filtering to avoid moiré/lines
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.needsUpdate = true;
        }
    }, [texture]);

    return (
        <group position={[17, 4, -20]} rotation={[0, -Math.PI / 5, 0]}>
            {/* Screen Frame - Pushed further back to avoid z-fighting */}
            <mesh position={[0, 0, -0.2]}>
                <boxGeometry args={[10, 7, 0.3]} />
                <meshStandardMaterial color="#050505" metalness={1} roughness={0} />
            </mesh>

            {/* The Image Plane - Moved forward to z=0.01 to eliminate black lines (Z-fighting) */}
            <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[9.5, 6.5]} />
                <meshBasicMaterial map={texture} toneMapped={false} color="#ffffff" />
            </mesh>

            {/* Support Pillar */}
            <mesh position={[0, -6.5, -0.3]}>
                <cylinderGeometry args={[0.15, 0.15, 12, 32]} />
                <meshStandardMaterial color="#111" metalness={0.9} />
            </mesh>
        </group>
    );
};

const Scene7Content = ({ setHit, hit }) => {
    return (
        <>
            <ambientLight intensity={1.5} />
            <Stars radius={100} count={3000} factor={4} />
            <Environment preset="night" />
            <spotLight position={[5, 10, 10]} intensity={25} color="#D1AB3E" bias={-0.001} />

            <Float speed={2} rotationIntensity={0.15} floatIntensity={0.2}>
                <HyperRealisticBat swing={hit} />
            </Float>

            <animated.group position={hit ? [-15, 30, -90] : [3, -3, 2]}>
                <Sphere args={[0.16, 32, 32]}><meshStandardMaterial color="#fff" /></Sphere>
                <Torus args={[0.16, 0.012, 16, 32]} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial color="#ff0000" /></Torus>
            </animated.group>

            <StadiumScreen />

            {/* SIXER Text Group - Always mounted, heavily optimized */}
            <group position={[-5, 2, -2]} visible={hit}>
                <Text fontSize={2.5} color="#D1AB3E" anchorX="center" anchorY="middle">SIXER!</Text>
                <Sparkles count={hit ? 100 : 0} scale={15} size={8} speed={1} />
            </group>

            {/* Optimized Floor - Replaced heavy Reflector with Standard Material to prevent crashes */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.5, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial
                    color="#000510"
                    roughness={0.8}
                    metalness={0.2}
                    transparent
                    opacity={0.9}
                />
            </mesh>
        </>
    );
};

const Scene7 = () => {
    const [hit, setHit] = useState(false);

    const handleHit = () => {
        if (!hit) {
            setHit(true);
            setTimeout(() => setHit(false), 2500);
        }
    };

    return (
        <section className="page-section page7" style={{
            background: 'url(/images/img4.png) center center / cover no-repeat fixed',
            position: 'relative',
            overflow: 'hidden',
            height: '100vh',
            width: '100vw'
        }} onClick={handleHit}>

            <div style={{ position: 'absolute', top: '20px', width: '100%', textAlign: 'center', zIndex: 10 }}>
                <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '4.5rem', color: '#D1AB3E', margin: 0, textShadow: '0 0 20px #000, 0 0 40px #000' }}>
                    Aarohi's MI Corner 💙
                </h2>
            </div>

            <Canvas shadows camera={{ position: [0, 2, 16], fov: 40 }} gl={{ toneMapping: THREE.NoToneMapping }} style={{ zIndex: 2 }}>
                <Suspense fallback={<Html center><div style={{ color: '#D1AB3E', fontSize: '2rem' }}>Opening Wankhede... 🏟️</div></Html>}>
                    <Scene7Content setHit={setHit} hit={hit} />
                </Suspense>
            </Canvas>

            <div style={{
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                maxWidth: '350px',
                textAlign: 'right',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                padding: '20px',
                borderRadius: '20px',
                border: '1px solid rgba(209, 171, 62, 0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                animation: 'fadeInUp 1s ease-out'
            }}>
                <p style={{ color: '#fff', fontSize: '1rem', lineHeight: '1.6', margin: 0, fontStyle: 'italic', fontWeight: '300' }}>
                    "Sorry I wasn't able to take you to meet up with Rohit, but I hope this little corner brings that Hitman magic to you... 💙🏏"
                </p>
            </div>

            <div style={{ position: 'absolute', bottom: '20px', left: '30px', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', letterSpacing: '2px', zIndex: 10 }}>
                JERSEY #18 • PALTAN • MUMBAI INDIANS
            </div>

            <p className="scene-instruction" style={{ bottom: '8%', color: '#D1AB3E', textAlign: 'center', width: '100%', position: 'absolute', textTransform: 'uppercase', letterSpacing: '4px', zIndex: 10, textShadow: '2px 2px 10px black' }}>
                TAP TO SMASH IT! 🏏
            </p>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
};

export default Scene7;
