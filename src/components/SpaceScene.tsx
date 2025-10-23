import { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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

// ⚫ Crisp Black Hole with Rim Colors
function BlackHole() {
  const eventHorizonRef = useRef<THREE.Mesh>(null);
  const rimRef = useRef<THREE.Mesh>(null);
  const outerRimRef = useRef<THREE.Mesh>(null);
  const lensingRef = useRef<THREE.Mesh>(null);
  
  const eventHorizonMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const rimMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const outerRimMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const lensingMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (eventHorizonRef.current) {
      eventHorizonRef.current.rotation.y += 0.001;
    }
    
    if (rimRef.current) {
      rimRef.current.rotation.y += 0.008;
    }
    
    if (outerRimRef.current) {
      outerRimRef.current.rotation.y += 0.005;
    }
    
    if (lensingRef.current) {
      lensingRef.current.rotation.y += 0.003;
    }
    
    // Animate rim colors
    if (rimMaterialRef.current) {
      const hue = (time * 0.3) % 1;
      rimMaterialRef.current.color.setHSL(hue, 0.9, 0.6);
      rimMaterialRef.current.opacity = 0.8 + Math.sin(time * 2) * 0.2;
    }
    
    if (outerRimMaterialRef.current) {
      const hue = (time * 0.2) % 1;
      outerRimMaterialRef.current.color.setHSL(hue, 0.7, 0.5);
      outerRimMaterialRef.current.opacity = 0.6 + Math.sin(time * 1.5) * 0.2;
    }
    
    if (lensingMaterialRef.current) {
      lensingMaterialRef.current.opacity = 0.3 + Math.sin(time * 1) * 0.1;
    }
  });

  return (
    <group>
      {/* Event Horizon - Pure Black Sphere */}
      <mesh ref={eventHorizonRef}>
        <sphereGeometry args={[0.6, 64, 64]} />
        <meshBasicMaterial
          ref={eventHorizonMaterialRef}
          color="#000000"
        />
      </mesh>
      
      {/* Inner Rim - Bright Hot Colors */}
      <mesh ref={rimRef}>
        <torusGeometry args={[0.8, 0.15, 32, 128]} />
        <meshBasicMaterial
          ref={rimMaterialRef}
          color="#ff0080"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer Rim - Cooler Colors */}
      <mesh ref={outerRimRef}>
        <torusGeometry args={[1.2, 0.1, 32, 128]} />
        <meshBasicMaterial
          ref={outerRimMaterialRef}
          color="#0080ff"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Gravitational Lensing Effect */}
      <mesh ref={lensingRef}>
        <torusGeometry args={[1.5, 0.05, 16, 64]} />
        <meshBasicMaterial
          ref={lensingMaterialRef}
          color="#ffffff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
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
    // Position camera to match the image perspective
    gsap.to(camera.position, {
      x: 0,
      y: 0.5,
      z: 4,
      duration: 5,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });
    
    // Camera look at animation - focus on black hole
    gsap.to(camera, {
      lookAt: { x: 0, y: 0, z: 0 },
      duration: 4,
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
        camera={{ position: [0, 0.5, 4], fov: 60 }}
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
            intensity={1.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.8}
          />
          <DepthOfField
            focusDistance={0}
            focalLength={0.03}
            bokehScale={2}
          />
        </EffectComposer>
        
        {/* Optional: Orbit controls for debugging */}
        {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>
    </div>
  );
}
