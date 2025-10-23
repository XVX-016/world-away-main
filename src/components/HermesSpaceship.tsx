import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

interface HermesSpaceshipProps {
  scale?: number;
  position?: [number, number, number];
}

export function HermesSpaceship({ scale = 0.1, position = [0, 0, 0] }: HermesSpaceshipProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<THREE.Mesh[]>([]);
  
  // Load the main Hermes model
  const hermesModel = useLoader(OBJLoader, '/models/Hermes.3ds');
  
  // Load additional modules
  const cmdModule = useLoader(OBJLoader, '/models/CmdModule.obj');
  const fuelModule = useLoader(OBJLoader, '/models/FuelModule.obj');
  const habWheel = useLoader(OBJLoader, '/models/HabWheel.obj');
  const ionDrive = useLoader(OBJLoader, '/models/IonDrive.obj');
  const solarModules = useLoader(OBJLoader, '/models/SolarModules.obj');
  
  useEffect(() => {
    if (groupRef.current) {
      // Clone the models to avoid sharing materials
      const hermesClone = hermesModel.clone();
      const cmdClone = cmdModule.clone();
      const fuelClone = fuelModule.clone();
      const habClone = habWheel.clone();
      const ionClone = ionDrive.clone();
      const solarClone = solarModules.clone();
      
      // Set up materials for each component
      const setupMaterial = (object: THREE.Object3D, color: string, metalness = 0.8, roughness = 0.2) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: color,
              metalness: metalness,
              roughness: roughness,
            });
            meshRefs.current.push(child);
          }
        });
      };
      
      // Configure each module
      setupMaterial(hermesClone, '#cccccc', 0.8, 0.2); // Main hull - silver
      setupMaterial(cmdClone, '#ffffff', 0.9, 0.1); // Command module - white
      setupMaterial(fuelClone, '#ff6b6b', 0.7, 0.3); // Fuel module - red
      setupMaterial(habClone, '#4a90e2', 0.6, 0.4); // Habitat wheel - blue
      setupMaterial(ionClone, '#00ff88', 0.9, 0.1); // Ion drive - green
      setupMaterial(solarClone, '#ffd700', 0.5, 0.5); // Solar panels - gold
      
      // Position modules relative to main hull
      cmdClone.position.set(0, 0, 2);
      fuelClone.position.set(0, 0, -2);
      habClone.position.set(1.5, 0, 0);
      ionClone.position.set(0, 0, -3);
      solarClone.position.set(0, 1, 0);
      
      // Add all modules to the group
      groupRef.current.add(hermesClone);
      groupRef.current.add(cmdClone);
      groupRef.current.add(fuelClone);
      groupRef.current.add(habClone);
      groupRef.current.add(ionClone);
      groupRef.current.add(solarClone);
    }
  }, [hermesModel, cmdModule, fuelModule, habWheel, ionDrive, solarModules]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      
      // Orbital motion around black hole
      const radius = 6;
      groupRef.current.position.x = Math.cos(time * 0.3) * radius;
      groupRef.current.position.z = Math.sin(time * 0.3) * radius;
      groupRef.current.position.y = Math.sin(time * 0.1) * 0.5;
      
      // Always face the black hole
      groupRef.current.lookAt(0, 0, 0);
      
      // Slight rotation for realism
      groupRef.current.rotation.z += 0.01;
      
      // Animate individual components
      meshRefs.current.forEach((mesh, index) => {
        if (mesh) {
          // Subtle component animations
          mesh.rotation.y += 0.001 * (index % 3 + 1);
          mesh.rotation.x += 0.0005 * (index % 2 + 1);
        }
      });
    }
  });

  return (
    <group ref={groupRef} scale={scale} position={position}>
      {/* The loaded models will be added here via useEffect */}
    </group>
  );
}

// Fallback simple spaceship if OBJ loading fails
export function SimpleSpaceship() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      
      // Orbital motion around black hole
      const radius = 6;
      groupRef.current.position.x = Math.cos(time * 0.3) * radius;
      groupRef.current.position.z = Math.sin(time * 0.3) * radius;
      groupRef.current.position.y = Math.sin(time * 0.1) * 0.5;
      
      // Always face the black hole
      groupRef.current.lookAt(0, 0, 0);
      
      // Slight rotation for realism
      groupRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main hull */}
      <mesh>
        <boxGeometry args={[0.5, 0.2, 1.5]} />
        <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Command module */}
      <mesh position={[0, 0, 0.8]}>
        <coneGeometry args={[0.3, 0.5, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
      </mesh>
      
      {/* Fuel tanks */}
      <mesh position={[0, 0, -0.8]}>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 8]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#ff0000" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Solar panels */}
      <mesh position={[-0.4, 0, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.8]} />
        <meshStandardMaterial color="#ffd700" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.4, 0, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.8]} />
        <meshStandardMaterial color="#ffd700" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Ion drive */}
      <mesh position={[0, 0, -1.2]}>
        <cylinderGeometry args={[0.15, 0.1, 0.3, 8]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff00" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}
