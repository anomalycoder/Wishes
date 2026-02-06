import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Cylinder, Text, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Lantern({ position, speed, delay }) {
    const group = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Constant upward movement
        group.current.position.y += speed * 0.01;
        // Gentle swaying
        group.current.position.x += Math.sin(t + delay) * 0.002;

        // Reset if too high
        if (group.current.position.y > 10) {
            group.current.position.y = -5;
        }
    });

    return (
        <group ref={group} position={position}>
            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.1}>
                {/* Lantern Body */}
                <Cylinder args={[0.3, 0.4, 0.6, 16]} position={[0, 0, 0]}>
                    <meshStandardMaterial
                        color="#ffaa00"
                        emissive="#ff4400"
                        emissiveIntensity={4}
                        transparent
                        opacity={0.8}
                        toneMapped={false}
                    />
                </Cylinder>
                {/* Light Glow */}
                <pointLight distance={3} intensity={5} color="#ffaa00" />
            </Float>
        </group>
    );
}

const Scene8 = () => {
    return (
        <section className="page-section page8" style={{ background: 'linear-gradient(to bottom, #000022, #1a0a2e)' }}>
            <h2 className="scene-heading" style={{ zIndex: 20 }}>Make a Wish...</h2>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.2} />
                <Stars count={2000} />

                {Array.from({ length: 30 }).map((_, i) => (
                    <Lantern
                        key={i}
                        position={[
                            (Math.random() - 0.5) * 10,
                            (Math.random() - 0.5) * 10,
                            (Math.random() - 0.5) * 5 - 2
                        ]}
                        speed={Math.random() * 2 + 0.5}
                        delay={Math.random() * 100}
                    />
                ))}

                <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
                    <Text
                        position={[0, 0, 1]}
                        fontSize={0.6}
                        maxWidth={6}
                        textAlign="center"
                        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                    >
                        May all your dreams come true, Aarohi.
                        {"\n"}
                        Always here for you. ❤️
                    </Text>
                </Float>

            </Canvas>
        </section>
    );
};

export default Scene8;
