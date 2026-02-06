import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function DancingShape({ position, color, speed, distort }) {
    const ref = useRef();
    useFrame((state) => {
        // ref.current.distort = THREE.MathUtils.lerp(ref.current.distort, 0.4, 0.05)
    });
    return (
        <Float speed={speed} rotationIntensity={1} floatIntensity={1.5} position={position}>
            <Sphere args={[1, 32, 32]}>
                <MeshDistortMaterial
                    color={color}
                    speed={speed}
                    distort={distort}
                    radius={1}
                    roughness={0}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    )
}

const Scene7 = () => {
    return (
        <section className="page-section page7" style={{ background: '#000' }}>
            <h2 className="scene-heading">Vibe Check! 💃</h2>
            <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={2} color="#ff00ff" />
                <directionalLight position={[-10, -10, -5]} intensity={2} color="#00ffff" />

                <DancingShape position={[0, 0, 0]} color="#ff1493" speed={3} distort={0.6} />
                <DancingShape position={[-3, 2, -2]} color="#00ffff" speed={2} distort={0.4} />
                <DancingShape position={[3, -2, -2]} color="#ffff00" speed={2} distort={0.4} />
                <DancingShape position={[3, 2, -4]} color="#ff69b4" speed={4} distort={0.5} />
                <DancingShape position={[-3, -2, -4]} color="#9932cc" speed={4} distort={0.5} />
            </Canvas>
            <p className="scene-instruction">Let's dance the night away!</p>
        </section>
    );
};

export default Scene7;
