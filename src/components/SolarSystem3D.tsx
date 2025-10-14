import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface SolarSystem3DProps {
  currentPlanet: number;
  onPlanetSelect: (index: number) => void;
}

const SolarSystemModel: React.FC<SolarSystem3DProps> = ({ currentPlanet, onPlanetSelect }) => {
  const { scene } = useGLTF('/solar-system/source/solar_system_animation.glb');
  const modelRef = useRef<THREE.Group>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<number | null>(null);

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001;
    }
  });

  const handlePlanetClick = (planetIndex: number) => {
    onPlanetSelect(planetIndex);
  };

  return (
    <group ref={modelRef} scale={[2, 2, 2]}>
      <primitive 
        object={scene} 
        onClick={(event: any) => {
          // Handle planet clicks here
          const planetIndex = Math.floor(Math.random() * 8); // Temporary - replace with actual planet detection
          handlePlanetClick(planetIndex);
        }}
        onPointerOver={(event: any) => {
          setHoveredPlanet(currentPlanet);
        }}
        onPointerOut={() => {
          setHoveredPlanet(null);
        }}
      />
    </group>
  );
};

const SolarSystem3D: React.FC<SolarSystem3DProps> = ({ currentPlanet, onPlanetSelect }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#FFD700" />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      <SolarSystemModel 
        currentPlanet={currentPlanet} 
        onPlanetSelect={onPlanetSelect} 
      />
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
};

export default SolarSystem3D;
