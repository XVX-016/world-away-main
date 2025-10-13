import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  radius: number;
  color: string;
  speed: number;
  name: string;
  orbitRadius: number;
}

const Planet: React.FC<PlanetProps> = ({ position, radius, color, speed, name, orbitRadius }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate around the sun
      const time = state.clock.getElapsedTime();
      const angle = time * speed;
      meshRef.current.position.x = Math.cos(angle) * orbitRadius;
      meshRef.current.position.z = Math.sin(angle) * orbitRadius;
      
      // Rotate the planet on its axis
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      <Sphere
        ref={meshRef}
        position={position}
        args={[radius, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </Sphere>
      {hovered && (
        <Text
          position={[position[0], position[1] + radius + 0.5, position[2]]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      )}
    </group>
  );
};

const Sun: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]}>
      <meshStandardMaterial 
        color="#FFD700" 
        emissive="#FFA500"
        emissiveIntensity={0.3}
      />
    </Sphere>
  );
};

const OrbitRing: React.FC<{ radius: number; color: string }> = ({ radius, color }) => {
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ));
  }

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.3} />
    </line>
  );
};

export const SolarSystem: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-black" />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={1} color="#FFD700" />
        
        {/* Sun */}
        <Sun />
        
        {/* Orbit Rings */}
        <OrbitRing radius={3} color="#4A90E2" />
        <OrbitRing radius={5} color="#7B68EE" />
        <OrbitRing radius={7} color="#32CD32" />
        <OrbitRing radius={9} color="#FF6347" />
        <OrbitRing radius={12} color="#FFD700" />
        <OrbitRing radius={15} color="#87CEEB" />
        <OrbitRing radius={18} color="#4169E1" />
        <OrbitRing radius={21} color="#1E90FF" />
        
        {/* Planets */}
        <Planet
          position={[3, 0, 0]}
          radius={0.2}
          color="#8C7853"
          speed={0.02}
          name="Mercury"
          orbitRadius={3}
        />
        <Planet
          position={[5, 0, 0]}
          radius={0.3}
          color="#FFC649"
          speed={0.015}
          name="Venus"
          orbitRadius={5}
        />
        <Planet
          position={[7, 0, 0]}
          radius={0.4}
          color="#6B93D6"
          speed={0.01}
          name="Earth"
          orbitRadius={7}
        />
        <Planet
          position={[9, 0, 0]}
          radius={0.3}
          color="#C1440E"
          speed={0.008}
          name="Mars"
          orbitRadius={9}
        />
        <Planet
          position={[12, 0, 0]}
          radius={0.8}
          color="#D8CA9D"
          speed={0.005}
          name="Jupiter"
          orbitRadius={12}
        />
        <Planet
          position={[15, 0, 0]}
          radius={0.7}
          color="#FAD5A5"
          speed={0.004}
          name="Saturn"
          orbitRadius={15}
        />
        <Planet
          position={[18, 0, 0]}
          radius={0.5}
          color="#4FD0E7"
          speed={0.003}
          name="Uranus"
          orbitRadius={18}
        />
        <Planet
          position={[21, 0, 0]}
          radius={0.5}
          color="#4B70DD"
          speed={0.002}
          name="Neptune"
          orbitRadius={21}
        />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};
