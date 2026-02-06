import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function ApologyText() {
    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <Text
                color="#aeb8fe" // Light blue/lavender to stand out against dark blue
                fontSize={1}
                maxWidth={200}
                lineHeight={1}
                letterSpacing={0.02}
                textAlign="center"
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                anchorX="center"
                anchorY="middle"
                position={[0, 0.5, 0]}
            >
                I'm Sorry I'm Late...
            </Text>
            <Text
                color="#ffffff"
                fontSize={0.4}
                maxWidth={8}
                lineHeight={1.2}
                textAlign="center"
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                anchorX="center"
                anchorY="top"
                position={[0, -0.5, 0]}
            >
                Belated Happy 18th Birthday, Aarohi!
                {"\n"}
                Sending you all the love and best wishes.
            </Text>
        </Float>
    );
}

function FloatingHeart({ position, color, scale }) {
    const mesh = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mesh.current.position.y += Math.sin(t + position[0]) * 0.002;
        mesh.current.rotation.y += 0.01;
    });

    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.5, y + 0.5);
    shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    shape.bezierCurveTo(x + 1.3, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
    shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

    const geometry = new THREE.ShapeGeometry(shape);

    return (
        <mesh ref={mesh} position={position} scale={scale} rotation={[0, 0, Math.PI]}>
            <primitive object={geometry} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
    );
}

const Scene4 = () => {
    return (
        <section className="page-section page4">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="#88ccff" />

                <ApologyText />

                {/* Floating Hearts */}
                <FloatingHeart position={[-2, -1, 0]} color="#5d3fd3" scale={0.3} />
                <FloatingHeart position={[2, 1, -1]} color="#4169e1" scale={0.4} />
                <FloatingHeart position={[-3, 2, -2]} color="#00008b" scale={0.2} />
                <FloatingHeart position={[3, -2, -1]} color="#1e90ff" scale={0.3} />
            </Canvas>
            <p className="scene-instruction" style={{ bottom: '20px' }}>
                (Scroll back up to relive the memories)
            </p>
        </section>
    );
};

export default Scene4;
