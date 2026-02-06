import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import ConfettiExplosion from 'react-confetti-explosion';

function GiftBox({ onOpen, isOpen }) {
    const lidRef = useRef();

    useFrame((state, delta) => {
        if (isOpen && lidRef.current.position.y < 2) {
            lidRef.current.position.y += delta * 2;
            lidRef.current.rotation.x -= delta * 0.5;
        }
    });

    return (
        <group onClick={onOpen} cursor="pointer">
            {/* Box Body */}
            <mesh position={[0, -0.5, 0]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="#ff1493" roughness={0.3} metallic={0.1} />
            </mesh>

            {/* Ribbon Vertical */}
            <mesh position={[0, -0.5, 0]}>
                <boxGeometry args={[0.2, 2.01, 2.01]} />
                <meshStandardMaterial color="#ffd700" metalness={0.5} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.5, 0]}>
                <boxGeometry args={[2.01, 2.01, 0.2]} />
                <meshStandardMaterial color="#ffd700" metalness={0.5} roughness={0.2} />
            </mesh>

            {/* Box Lid */}
            <group ref={lidRef} position={[0, 0.5, 0]}>
                <mesh position={[0, 0.2, 0]}>
                    <boxGeometry args={[2.2, 0.4, 2.2]} />
                    <meshStandardMaterial color="#ff69b4" roughness={0.3} metallic={0.1} />
                </mesh>
                {/* Bow */}
                <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
                    <torusKnotGeometry args={[0.4, 0.1, 100, 16]} />
                    <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.2} />
                </mesh>
            </group>

            {isOpen && (
                <Float speed={4} rotationIntensity={1} floatIntensity={1}>
                    <Text
                        position={[0, 1.5, 0]}
                        fontSize={3}
                        color="#ffffff"
                        anchorY="bottom"
                    >
                        👑
                    </Text>
                    <Text
                        position={[0, 0.5, 0]}
                        fontSize={0.5}
                        color="#ffffff"
                        anchorY="top"
                    >
                        Queen Aarohi
                    </Text>
                </Float>
            )}
        </group>
    );
}

const Scene6 = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="page-section page6" style={{ background: '#1a0a2e' }}>
            <h2 className="scene-heading">A Special Gift...</h2>

            <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 7]} intensity={2} />
                <Sparkles count={200} scale={10} size={4} speed={0.4} opacity={0.5} color="#ffd700" />

                <GiftBox isOpen={isOpen} onOpen={() => setIsOpen(true)} />
            </Canvas>

            {isOpen && <ConfettiExplosion particleCount={300} duration={3000} force={0.8} width={1600} />}

            {!isOpen && <p className="scene-instruction">Tap the box to open!</p>}
        </section>
    );
};

export default Scene6;
