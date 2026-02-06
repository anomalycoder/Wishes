import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import ConfettiExplosion from 'react-confetti-explosion';

function InnerHeart({ color }) {
    const mesh = useRef();
    useFrame((state) => {
        mesh.current.rotation.y += 0.02;
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
        <mesh ref={mesh} position={[0, -0.2, 0]} scale={0.3} rotation={[0, 0, Math.PI]}>
            <primitive object={geometry} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
    );
}

const Bubble = ({ text, position, color, scale = 1, isCenter = false, onPop }) => {
    const meshRef = useRef();
    const [hovered, setHover] = useState(false);
    const [popped, setPopped] = useState(false);
    const [isPopping, setIsPopping] = useState(false);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Popping Animation
        if (isPopping) {
            meshRef.current.scale.multiplyScalar(1.2); // Expand rapidly
            if (meshRef.current.scale.x > scale * 1.5) {
                setPopped(true);
                setIsPopping(false);
                if (onPop) onPop(color);
            }
            return;
        }

        if (popped) return;

        const t = state.clock.getElapsedTime();
        const offset = position[0] * 5 + position[1] * 5;
        // Gentle floating
        meshRef.current.position.y += Math.sin(t + offset) * 0.001;
    });

    const handlePop = (e) => {
        e.stopPropagation();
        if (!popped && !isPopping) {
            setIsPopping(true);
        }
    };

    return (
        <group position={position}>
            {popped && (
                <Float speed={2} floatIntensity={1}>
                    <InnerHeart color={color} />
                    <Text
                        position={[0, 0.6, 0]}
                        fontSize={isCenter ? 0.7 : 0.4}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                        outlineWidth={0.02}
                        outlineColor={color}
                    >
                        {text}
                    </Text>
                </Float>
            )}

            {!popped && (
                <group
                    ref={meshRef}
                    scale={hovered ? scale * 1.1 : scale}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                    onClick={handlePop}
                    cursor="pointer"
                >
                    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
                        <mesh>
                            <sphereGeometry args={[isCenter ? 1.3 : 1, 64, 64]} />
                            <meshPhysicalMaterial
                                color={color}
                                roughness={0}
                                metalness={0}
                                transmission={0.95}
                                transparent={true}
                                opacity={1}
                                thickness={0.1}
                                ior={1.33}
                                iridescence={1}
                                iridescenceIOR={1.33}
                                iridescenceThicknessRange={[100, 500]}
                                clearcoat={1}
                                clearcoatRoughness={0}
                                side={THREE.DoubleSide}
                                attenuationColor={color}
                                attenuationDistance={5}
                                toneMapped={false}
                            />
                        </mesh>
                        <Sparkles count={isCenter ? 20 : 8} scale={1.4} size={4} color={color} speed={0.4} opacity={0.6} />
                    </Float>
                </group>
            )}
        </group>
    );
};

const Scene5 = () => {
    const [confettiColor, setConfettiColor] = useState(null);
    const [confettiKey, setConfettiKey] = useState(0);

    const handleBubblePop = (color) => {
        setConfettiColor(color);
        setConfettiKey(prev => prev + 1);
    };

    // 1 Center + 11 Ring = 12 Bubbles total

    // Fixed positions for "Random" look but safe from overlap
    const bubbles = [
        // Center Bubble
        { text: "Aarohi ❤️", pos: [0, -1, 0], color: "#4361ee", isCenter: true, scale: 2.2 },
        // Left Side
        { text: "Kindness", pos: [-15, 2, 0], color: "#ff006e", isCenter: false, scale: 1.6 },
        { text: "Grace", pos: [-11, -5, 0], color: "#8338ec", isCenter: false, scale: 1.5 },
        { text: "Joy", pos: [-9, 3, 0], color: "#fb5607", isCenter: false, scale: 1.3 },
        { text: "Glow", pos: [-6, -7, 0], color: "#ffbe0b", isCenter: false, scale: 1.4 },
        { text: "Dream", pos: [-15, -4, 0], color: "#3a86ff", isCenter: false, scale: 1.5 },
        // Right Side
        { text: "Smile", pos: [14, 3, 0], color: "#3a0ca3", isCenter: false, scale: 1.5 }, // Moved down slightly
        { text: "Smart", pos: [11, -6, 0], color: "#e36414", isCenter: false, scale: 1.4 },
        { text: "Magic", pos: [11, 2, 0], color: "#00f5d4", isCenter: false, scale: 1.7 },
        { text: "Hope", pos: [6, -7, 0], color: "#9b5de5", isCenter: false, scale: 1.5 },
        { text: "Cute", pos: [16, -2, 0], color: "#f15bb5", isCenter: false, scale: 1.6 },
        { text: "Love", pos: [-5, -4, 0], color: "#fee440", isCenter: false, scale: 1.2 },
        // Top Corners
        { text: "Peace", pos: [-16, 7, 0], color: "#00b4d8", isCenter: false, scale: 1.3 },
        { text: "Fun", pos: [16, 7, 0], color: "#ff9e00", isCenter: false, scale: 1.3 }
    ];


    return (
        <section className="page-section page5">
            <h2 className="scene-heading" style={{ top: '5%', pointerEvents: 'none', zIndex: 10 }}>
                Tap the Bubbles from Memories!
            </h2>

            {/* Global Confetti - Top Corners */}
            {confettiColor && (
                <>
                    <div key={`left-${confettiKey}`} style={{ position: 'fixed', top: '10%', left: '5%', pointerEvents: 'none', zIndex: 1000 }}>
                        <ConfettiExplosion force={0.5} duration={2500} particleCount={40} width={600} colors={[confettiColor, confettiColor, '#ffffff']} />
                    </div>
                    <div key={`right-${confettiKey}`} style={{ position: 'fixed', top: '10%', right: '5%', pointerEvents: 'none', zIndex: 1000 }}>
                        <ConfettiExplosion force={0.5} duration={2500} particleCount={40} width={600} colors={[confettiColor, confettiColor, '#ffffff']} />
                    </div>
                </>
            )}

            {/* Zoom out (Z=20) to see full spread */}
            <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
                <pointLight position={[-10, -10, 5]} intensity={1} color="#aaaaff" />
                <directionalLight position={[0, 10, 5]} intensity={1.5} />

                <Sparkles count={500} scale={40} size={2} speed={0.4} opacity={0.5} color="#ffffff" />

                {bubbles.map((b, i) => (
                    <Bubble
                        key={i}
                        text={b.text}
                        position={b.pos}
                        color={b.color}
                        scale={b.scale}
                        isCenter={b.isCenter}
                        onPop={handleBubblePop}
                    />
                ))}

                <Environment preset="city" />
            </Canvas>
        </section>
    );
};

export default Scene5;
