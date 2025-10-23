import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpaceshipGeneratorProps {
  scale?: number;
  position?: [number, number, number];
  orbitRadius?: number;
  orbitSpeed?: number;
}

export function SpaceshipGenerator({ 
  scale = 0.4, 
  position = [0, 0, 0],
  orbitRadius = 4.0,
  orbitSpeed = 0.15
}: SpaceshipGeneratorProps) {
  const groupRef = useRef<THREE.Group>(null);
  const engineGlowRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const t = clock.getElapsedTime();
    const angle = t * orbitSpeed + Math.PI * 0.25;
    
    groupRef.current.position.x = Math.cos(angle) * orbitRadius;
    groupRef.current.position.z = Math.sin(angle) * orbitRadius;
    groupRef.current.position.y = -1.5 + Math.sin(t * 0.1) * 0.3;
    
    groupRef.current.lookAt(0, 0, 0);
    
    // Animate engine glow
    if (engineGlowRef.current) {
      const glowIntensity = 0.6 + Math.sin(t * 3) * 0.3;
      const material = engineGlowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = glowIntensity;
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={position}>
      {/* Main Hull */}
      <mesh>
        <boxGeometry args={[0.5, 0.2, 1.5]} />
        <meshStandardMaterial 
          color="#cccccc" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Command Module */}
      <mesh position={[0, 0, 0.8]}>
        <coneGeometry args={[0.3, 0.5, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Fuel Tanks */}
      <mesh position={[0, 0, -0.8]}>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 8]} />
        <meshStandardMaterial 
          color="#ff6b6b" 
          emissive="#ff0000" 
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Solar Panels */}
      <mesh position={[-0.4, 0, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.8]} />
        <meshStandardMaterial 
          color="#ffd700" 
          metalness={0.5} 
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0.4, 0, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.8]} />
        <meshStandardMaterial 
          color="#ffd700" 
          metalness={0.5} 
          roughness={0.5}
        />
      </mesh>
      
      {/* Ion Drive */}
      <mesh position={[0, 0, -1.2]}>
        <cylinderGeometry args={[0.15, 0.1, 0.3, 8]} />
        <meshStandardMaterial 
          color="#00ff88" 
          emissive="#00ff00" 
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Engine Glow */}
      <mesh ref={engineGlowRef} position={[0, 0, -1.5]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial 
          color="#ff4400" 
          transparent 
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Engine Trail */}
      <mesh position={[0, 0, -2]}>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshBasicMaterial 
          color="#ff6600" 
          transparent 
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Navigation Lights */}
      <mesh position={[0.25, 0.1, 0.3]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial 
          color="#00ff00" 
          emissive="#00ff00" 
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[-0.25, 0.1, 0.3]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
