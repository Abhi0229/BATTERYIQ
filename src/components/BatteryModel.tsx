import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function RotatingBattery() {
  const group = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.3;
      group.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    }
    if (ring1.current) {
      ring1.current.rotation.z = t * 0.5;
      ring1.current.rotation.x = t * 0.3;
    }
    if (ring2.current) {
      ring2.current.rotation.z = -t * 0.4;
      ring2.current.rotation.y = t * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#00e5ff" />
      <pointLight position={[-5, -3, -5]} intensity={0.8} color="#4ade80" />
      <pointLight position={[0, -5, 3]} intensity={0.5} color="#00b8d4" />
      
      <group ref={group}>
        <mesh ref={innerRef}>
          <dodecahedronGeometry args={[1.8, 0]} />
          <meshStandardMaterial color="#00e5ff" opacity={0.1} transparent emissive="#00e5ff" emissiveIntensity={0.2} />
        </mesh>
        <mesh ref={wireRef}>
          <dodecahedronGeometry args={[1.85, 0]} />
          <meshStandardMaterial color="#00e5ff" wireframe opacity={0.6} transparent />
        </mesh>
        <mesh>
          <dodecahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial color="#4ade80" opacity={0.08} transparent emissive="#4ade80" emissiveIntensity={0.3} />
        </mesh>
      </group>

      <mesh ref={ring1}>
        <torusGeometry args={[2.8, 0.015, 16, 100]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.5} opacity={0.4} transparent />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[3.2, 0.01, 16, 100]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.3} opacity={0.3} transparent />
      </mesh>
    </>
  );
}

function Particles() {
  const points = useRef<THREE.Points>(null);
  const count = 200;
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      points.current.rotation.x = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#00e5ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function BatteryModel() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <Suspense fallback={null}>
          <RotatingBattery />
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  );
}
