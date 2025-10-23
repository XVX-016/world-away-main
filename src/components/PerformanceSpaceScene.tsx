import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import gsap from 'gsap';

// Hook to detect mobile devices
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
}

// ---------- Optimized Accretion Disk (simplified for mobile) ----------
function OptimizedAccretionDisk({ radius = 2.6, tube = 0.35, isMobile = false }) {
  const ref = useRef();
  const materialRef = useRef();
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z += 0.0008;
    }
    
    if (materialRef.current) {
      const time = clock.getElapsedTime();
      const hue = (time * 0.3) % 1;
      materialRef.current.color.setHSL(hue, 0.8, 0.6);
      materialRef.current.opacity = 0.7 + Math.sin(time * 2) * 0.2;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, tube, isMobile ? 32 : 64, isMobile ? 64 : 128]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#ff6b6b"
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ---------- Black hole core ----------
function BlackHoleCore({ radius = 1.15 }) {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.scale.setScalar(1.0 + Math.sin(t*2.0)*0.01);
    }
  });
  
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial color="#000000" />
    </mesh>
  );
}

// ---------- Optimized Spaceship ----------
function OptimizedSpaceship({ radius = 4.0, isMobile = false }) {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!ref.current) return;
    
    const angle = t * 0.15 + Math.PI * 0.25;
    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.z = Math.sin(angle) * radius;
    ref.current.position.y = -1.5 + Math.sin(t * 0.1) * 0.3;
    
    ref.current.lookAt(0, 0, 0);
  });

  const scale = isMobile ? 0.3 : 0.4;

  return (
    <group ref={ref} scale={[scale, scale, scale]}>
      {/* Simplified spaceship for mobile */}
      <mesh>
        <boxGeometry args={[0.5, 0.2, 1.5]} />
        <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[0, 0, 0.8]}>
        <coneGeometry args={[0.3, 0.5, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
      </mesh>
      
      {/* Engine glow - simplified for mobile */}
      <mesh position={[0, 0, -1.5]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial 
          color="#ff4400" 
          transparent 
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ---------- Optimized Stars ----------
function OptimizedStars({ isMobile = false }) {
  const pointsRef = useRef<THREE.Points>(null);
  const starCount = isMobile ? 2000 : 5000;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      const radius = Math.random() * 300 + 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.1, 0.2 + Math.random() * 0.2, 0.7 + Math.random() * 0.3);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return [positions, colors];
  }, [starCount]);

  useFrame(() => {
    if (pointsRef.current) {
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
        size={isMobile ? 0.2 : 0.3}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ---------- Camera controller ----------
function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    gsap.to(camera.position, {
      x: 0,
      y: 0.5,
      z: 4,
      duration: 5,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, [camera]);

  return null;
}

// ---------- Main Performance Space Scene Component ----------
export default function PerformanceSpaceScene() {
  const isMobile = useIsMobile();
  
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 60 }}
        gl={{ 
          antialias: !isMobile, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={isMobile ? 1 : 2}
      >
        <color attach="background" args={["#000010"]} />
        
        {/* Optimized Lighting */}
        <ambientLight intensity={0.25} />
        <pointLight position={[6, 6, 6]} intensity={isMobile ? 1.0 : 1.4} />
        
        {/* Scene Objects */}
        <OptimizedStars isMobile={isMobile} />
        <BlackHoleCore />
        <OptimizedAccretionDisk isMobile={isMobile} />
        <OptimizedSpaceship isMobile={isMobile} />
        <CameraController />
        
        {/* Optimized Post-processing */}
        {!isMobile && (
          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.8} 
              intensity={1.0}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
