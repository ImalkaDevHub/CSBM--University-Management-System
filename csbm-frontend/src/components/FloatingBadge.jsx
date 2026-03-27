import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, MeshDistortMaterial, Sphere } from '@react-three/drei';

const AnimatedSphere = () => {
  const mesh = useRef(null);

  useFrame((state) => {
    // Gentle rotation
    if(mesh.current) {
        mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2;
        mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={mesh} scale={2.5}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#1890ff"
          attach="material"
          distort={0.4} // Makes it wobble like liquid
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
};

const FloatingBadge = () => {
  return (
    <div style={{ height: '300px', width: '100%', background: 'transparent' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <AnimatedSphere />
      </Canvas>
    </div>
  );
};

export default FloatingBadge;