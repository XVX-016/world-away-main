import React, { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { HermesSpaceship, SimpleSpaceship } from './HermesSpaceship';

// 🌌 Nebula Clouds
function NebulaClouds() {
  const cloudRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.001;
      cloudRef.current.rotation.x += 0.0005;
      
      // Animate opacity
      const material = cloudRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={cloudRef}>
      <sphereGeometry args={[50, 32, 32]} />
      <meshBasicMaterial
        color="#400060"
        transparent
        opacity={0.3}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// 🌌 Warping Starfield with Motion Blur
function WarpingStars() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(10000 * 3);
    const colors = new Float32Array(10000 * 3);
    
    for (let i = 0; i < 10000; i++) {
      // Create a more dynamic starfield
      const radius = Math.random() * 200 + 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Color variation
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 0.3 + Math.random() * 0.3, 0.5 + Math.random() * 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return [positions, colors];
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      // Create warp effect by moving stars towards center
      const time = clock.getElapsedTime();
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        
        // Calculate distance from center
        const distance = Math.sqrt(x * x + y * y + z * z);
        
        // Move stars towards center (warp effect)
        const warpFactor = 0.02;
        positions[i] -= x * warpFactor;
        positions[i + 1] -= y * warpFactor;
        positions[i + 2] -= z * warpFactor;
        
        // Reset stars that get too close to center
        if (distance < 10) {
          const radius = Math.random() * 200 + 50;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          positions[i] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i + 2] = radius * Math.cos(phi);
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Rotate the entire starfield
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
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
        ref={materialRef}
        size={0.5}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// ⚫ Black Hole with Gravitational Lensing Effect
function BlackHole() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const ringMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x += 0.001;
      
      // Pulsing effect
      const scale = 1 + Math.sin(time * 2) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.01;
      ringRef.current.rotation.x += 0.005;
    }
    
    if (materialRef.current) {
      // Animate emissive color
      const hue = (time * 0.1) % 1;
      materialRef.current.emissive.setHSL(hue, 0.8, 0.3);
      materialRef.current.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.3;
    }
    
    if (ringMaterialRef.current) {
      // Animate ring opacity
      ringMaterialRef.current.opacity = 0.6 + Math.sin(time * 2) * 0.2;
    }
  });

  return (
    <group>
      {/* Main black hole sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#000000"
          emissive="#400060"
          metalness={1}
          roughness={0.1}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Accretion disk ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.5, 0.3, 32, 128]} />
        <meshBasicMaterial
          ref={ringMaterialRef}
          color="#ff6b6b"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.2, 0.1, 16, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
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
      <HermesSpaceship scale={0.05} />
    </Suspense>
  );
}

// 🎥 Dynamic Camera Movement
function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    // Smooth camera movement
    gsap.to(camera.position, {
      x: 0,
      y: 2,
      z: 8,
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });
    
    // Camera look at animation
    gsap.to(camera, {
      lookAt: { x: 0, y: 0, z: 0 },
      duration: 2,
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
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Background */}
        <color attach="background" args={["#000000"]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#400060" />
        
        {/* Scene Objects */}
        <NebulaClouds />
        <WarpingStars />
        <BlackHole />
        <SpaceshipWithFallback />
        <CameraController />
        
        {/* Post-processing Effects */}
        <EffectComposer>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
          <DepthOfField
            focusDistance={0}
            focalLength={0.02}
            bokehScale={2}
          />
        </EffectComposer>
        
        {/* Optional: Orbit controls for debugging */}
        {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>
    </div>
  );
}
