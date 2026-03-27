import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import { useRef, useState } from 'react';

function GeometricShape({ position, color, geometry: Geometry }) {
    const mesh = useRef();

    useFrame((state, delta) => {
        mesh.current.rotation.x += delta * 0.2;
        mesh.current.rotation.y += delta * 0.3;
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh ref={mesh} position={position}>
                <Geometry args={[0.8, 0]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
            </mesh>
        </Float>
    );
}

export default function FloatingShapes() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
            <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <GeometricShape position={[-4, 2, 0]} color="#3B82F6" geometry={(props) => <octahedronGeometry {...props} />} />
                <GeometricShape position={[4, -2, -2]} color="#8B5CF6" geometry={(props) => <torusGeometry args={[0.6, 0.2, 16, 32]} {...props} />} />
                <GeometricShape position={[0, -3, 0]} color="#14B8A6" geometry={(props) => <dodecahedronGeometry {...props} />} />

                <Environment preset="city" />
                <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
            </Canvas>
        </div>
    );
}
