import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Environment, Html, Sparkles, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

// --- Configuration ---
const COLORS = [
    '#FF1493', '#FFD700', '#00FFFF', '#FF4500', '#32CD32', '#9370DB',
    '#FF69B4', '#1E90FF', '#00FA9A', '#FF6347', '#BA55D3', '#00CED1',
    '#F08080', '#20B2AA', '#FFDAB9', '#E6E6FA'
];

const MESSAGES = [
    "Joy", "Wisdom", "Success", "Love", "Peace",
    "Adventure", "Health", "Dreams", "Beauty", "Glory", "Hope",
    "Laughter", "Magic", "Shine", "Grace", "Strength"
];

// --- High Quality Bubble Component ---
const Bubble3D = React.memo(({ position, size, text, color, isCenter = false }) => {
    const [popped, setPopped] = useState(false);
    const [hovered, setHovered] = useState(false);

    const handlePointerDown = (e) => {
        e.stopPropagation();
        if (!popped) setPopped(true);
    };

    return (
        <Float speed={isCenter ? 2 : 1.5} rotationIntensity={1} floatIntensity={isCenter ? 0.5 : 1} floatingRange={[-0.1, 0.1]}>
            <group position={position}>
                {!popped && (
                    <mesh onClick={handlePointerDown} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} scale={hovered ? 1.05 : 1}>
                        <sphereGeometry args={[size, 40, 40]} />
                        <MeshTransmissionMaterial backside samples={4} resolution={256} transmission={1} roughness={0} thickness={isCenter ? 1.2 : 0.6} ior={1.3} chromaticAberration={0.06} anisotropy={0.1} distortion={0.1} distortionScale={0.3} temporalDistortion={0.5} color={color} bg="#000000" />
                    </mesh>
                )}
                {popped && (
                    <>
                        <Sparkles count={20} scale={size * 4} size={5} speed={0.4} opacity={1} color={color} />
                        <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
                            <div className="revealed-text" style={{ color: color, fontSize: isCenter ? '3rem' : '1.4rem', width: isCenter ? '250px' : '150px', textAlign: 'center', textShadow: '0 0 10px rgba(255,255,255, 0.8), 0 0 20px currentColor' }}>
                                {text}
                            </div>
                        </Html>
                    </>
                )}
            </group>
        </Float>
    );
});

const Scene5 = () => {
    const bubbles = useMemo(() => {
        const items = [];
        const count = 18; // Increased slightly for a "fuller" screen look
        let seed = 54321;
        const seededRandom = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        const centerPos = [0, -0.3, 0];
        const centerSize = 1.0;

        let attempts = 0;
        while (items.length < count && attempts < 2000) {
            attempts++;
            // Spreading across the wider area of the frustum
            const x = (seededRandom() - 0.5) * 12; // Wider X spread
            const y = (seededRandom() - 0.5) * 7;  // Wider Y spread
            const z = (seededRandom() - 0.5) * 3;
            const size = 0.35 + seededRandom() * 0.4;

            // 1. Check distance against the Center Bubble
            const dxCenter = x - centerPos[0];
            const dyCenter = y - centerPos[1];
            const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);

            if (distCenter < (centerSize + size + 0.5)) continue;

            // 2. Check overlap against existing items
            let overlaps = false;
            for (const item of items) {
                const dx = x - item.position[0];
                const dy = y - item.position[1];
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < (size + item.size + 0.4)) {
                    overlaps = true;
                    break;
                }
            }

            if (!overlaps) {
                items.push({
                    id: items.length,
                    text: MESSAGES[items.length % MESSAGES.length],
                    color: COLORS[items.length % COLORS.length],
                    position: [x, y, z],
                    size: size
                });
            }
        }
        return items;
    }, []);

    return (
        <section className="page-section page5" style={{ background: '#000', position: 'relative' }}>
            <div style={{ pointerEvents: 'none', position: 'absolute', zIndex: 10, width: '100%', top: '0', display: 'flex', justifyContent: 'center' }}>
                <h2 className="scene-heading" style={{ color: '#ff69b4', textShadow: '0 0 20px rgba(255,105,180,0.5)', marginTop: '40px' }}>Memories & Wishes</h2>
            </div>

            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 40 }}>
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <Sparkles count={50} scale={12} size={3} speed={0.2} opacity={0.5} color="#fff" />
                <Bubble3D position={[0, -0.3, 0]} size={1.0} text="Aarohi 💙" color="#00008B" isCenter />
                {bubbles.map(b => <Bubble3D key={b.id} {...b} />)}
            </Canvas>

            <p className="scene-instruction" style={{ bottom: '10%', opacity: 0.6, fontSize: '1.2rem' }}>
                (Tap the bubbles to pop your birthday wishes!)
            </p>

            <style>{`
                .revealed-text { font-family: 'Great Vibes', cursive; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; white-space: nowrap; font-weight: bold; }
                @keyframes popIn { from { opacity: 0; transform: scale(0); filter: blur(5px); } to { opacity: 1; transform: scale(1); filter: blur(0); } }
            `}</style>
        </section>
    );
};

export default Scene5;
