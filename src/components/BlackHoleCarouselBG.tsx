import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

type OrbitingShipProps = {
  radius?: number;
  speed?: number;
};

function BlackHoleModel(props: JSX.IntrinsicElements['group']) {
  // Load from project root "Black hole/black_hole.glb" via Vite URL resolution
  const gltf = useGLTF(new URL('../../Black hole/black_hole.glb', import.meta.url).href);
  const group = useRef<THREE.Group>(null);
  const scale = 1.1;

  return (
    <group ref={group} scale={scale} {...props}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function HermesShip(props: JSX.IntrinsicElements['group']) {
  // Use a lightweight Hermes OBJ module to represent the ship
  // Served from public at /models/**
  const obj = useLoader(OBJLoader, '/models/Modules1.obj');
  const group = useRef<THREE.Group>(null);

  // Convert OBJ materials to MeshStandardMaterial for better PBR with soft lights
  const standardized = useMemo(() => {
    const root = obj.clone(true);
    root.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const baseColor = (mesh.material as any)?.color?.getHex ? (mesh.material as any).color.getHex() : 0xb0b0b0;
        mesh.material = new THREE.MeshStandardMaterial({
          color: baseColor,
          metalness: 0.7,
          roughness: 0.35,
          transparent: true,
          opacity: 1,
        });
      }
    });
    return root;
  }, [obj]);

  return (
    <group ref={group} {...props}>
      <primitive object={standardized} />
      {/* Subtle engine glow */}
      <mesh position={[0, 0, -0.8]}> 
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#ff6a00" transparent opacity={0.45} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function OrbitingShip({ radius = 3.4, speed = 0.18 }: OrbitingShipProps) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Fade params
  const fadeStartZ = 0.0; // begin fading when z > 0 (behind the black hole relative to camera at +z)
  const fadeEndZ = radius * 0.7; // fully transparent deeper behind

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = t * speed;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.sin(t * 0.6) * 0.15; // subtle bob

    if (!group.current) return;

    group.current.position.set(x, y, z);
    // Always face the black hole at origin
    group.current.lookAt(0, 0, 0);

    // Smooth fade when behind the black hole based on z-depth relative to camera view
    const worldPos = new THREE.Vector3();
    group.current.getWorldPosition(worldPos);

    // Assuming camera looks towards origin from +z; behind means worldPos.z > 0
    const behindAmount = Math.max(0, worldPos.z - fadeStartZ);
    let opacity = 1 - THREE.MathUtils.clamp((behindAmount) / Math.max(0.0001, (fadeEndZ - fadeStartZ)), 0, 1);
    // Apply ease for smoother transition
    opacity = THREE.MathUtils.smoothstep(opacity, 0, 1);

    group.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.Material | THREE.Material[];
        if (Array.isArray(mat)) {
          mat.forEach((m) => {
            if ('transparent' in m) {
              (m as THREE.MeshStandardMaterial).transparent = true;
              (m as THREE.MeshStandardMaterial).opacity = opacity;
              (m as THREE.MeshStandardMaterial).depthWrite = true;
            }
          });
        } else if (mat && 'transparent' in mat) {
          (mat as THREE.MeshStandardMaterial).transparent = true;
          (mat as THREE.MeshStandardMaterial).opacity = opacity;
          (mat as THREE.MeshStandardMaterial).depthWrite = true;
        }
      }
    });
  });

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        <HermesShip scale={0.15} />
      </Suspense>
    </group>
  );
}

export function BlackHoleCarouselBG() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        shadows={false}
      >
        {/* Soft lighting */}
        <ambientLight intensity={0.35} />
        <hemisphereLight intensity={0.6} groundColor={new THREE.Color('#0a0a12')} />
        <directionalLight position={[3, 4, 5]} intensity={0.6} />
        <directionalLight position={[-3, -2, -5]} intensity={0.25} />

        {/* Scene content */}
        <Suspense fallback={<Html center>loading…</Html>}>
          <group position={[0, -0.2, 0]}>
            <BlackHoleModel />
          </group>
        </Suspense>

        <Suspense fallback={null}>
          <OrbitingShip radius={3.8} speed={0.2} />
        </Suspense>

        {/* Subtle background stars for depth without heavy cost */}
        <mesh position={[0, 0, -20]}>
          <planeGeometry args={[200, 200]} />
          <meshBasicMaterial color="#02030a" />
        </mesh>
      </Canvas>
    </div>
  );
}

useGLTF.preload(new URL('../../Black hole/black_hole.glb', import.meta.url).href);

export default BlackHoleCarouselBG;


