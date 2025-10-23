import React, { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { HermesSpaceship, SimpleSpaceship } from './HermesSpaceship';

// 🌌 Deep Space Background
function DeepSpaceBackground() {
  return (
    <mesh>
      <sphereGeometry args={[100, 32, 32]} />
      <meshBasicMaterial
        color="#000011"
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// 🌌 Distant Starfield
function DistantStars() {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    const colors = new Float32Array(5000 * 3);
    
    for (let i = 0; i < 5000; i++) {
      // Create distant stars
      const radius = Math.random() * 300 + 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // White/blue star colors
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.1, 0.2 + Math.random() * 0.2, 0.7 + Math.random() * 0.3);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return [positions, colors];
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      // Slow rotation for distant stars
      pointsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ⚫ Realistic Black Hole
function BlackHole() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const ringMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const innerRingMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      meshRef.current.rotation.x += 0.0005;
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.005;
    }
    
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y += 0.008;
    }
    
    if (materialRef.current) {
      // Subtle color variation
      materialRef.current.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.1;
    }
    
    if (ringMaterialRef.current) {
      // Animate ring opacity
      ringMaterialRef.current.opacity = 0.4 + Math.sin(time * 1.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Main black hole sphere - smaller and more realistic */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#000000"
          emissive="#001122"
          metalness={1}
          roughness={0.05}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Outer accretion disk */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.8, 0.2, 32, 128]} />
        <meshBasicMaterial
          ref={ringMaterialRef}
          color="#ffaa44"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner hot ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.2, 0.1, 16, 64]} />
        <meshBasicMaterial
          ref={innerRingMaterialRef}
          color="#ffffff"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// 🚀 Spaceship with Error Boundary
function SpaceshipWithFallback() {
  return (
    <Suspense fallback={<SimpleSpaceship />}>
      <HermesSpaceship scale={0.02} />
    </Suspense>
  );
}

// 🎥 Dynamic Camera Movement
function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    // Smooth camera movement - closer to the action
    gsap.to(camera.position, {
      x: 0,
      y: 1,
      z: 5,
      duration: 4,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });
    
    // Camera look at animation
    gsap.to(camera, {
      lookAt: { x: 0, y: 0, z: 0 },
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, [camera]);

  return null;
}

// 🌌 Main Space Scene Component
export default function SpaceScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Background */}
        <color attach="background" args={["#000000"]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.1} />
        <pointLight position={[3, 3, 3]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-3, -3, -3]} intensity={0.3} color="#001122" />
        
        {/* Scene Objects */}
        <DeepSpaceBackground />
        <DistantStars />
        <BlackHole />
        <SpaceshipWithFallback />
        <CameraController />
        
        {/* Post-processing Effects */}
        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
          <DepthOfField
            focusDistance={0}
            focalLength={0.05}
            bokehScale={1.5}
          />
        </EffectComposer>
        
        {/* Optional: Orbit controls for debugging */}
        {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>
    </div>
  );
}
