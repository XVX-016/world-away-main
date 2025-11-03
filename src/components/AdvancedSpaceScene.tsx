import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Stars, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import gsap from "gsap";

// ---------- Accretion Disk ShaderMaterial ----------
const AccretionMaterial = shaderMaterial(
  // uniforms
  {
    time: 0,
    colorA: new THREE.Color(0xff6b6b),
    colorB: new THREE.Color(0x8b5cf6),
    intensity: 1.5,
  },
  // vertex shader
  /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // fragment shader
  /* glsl */ `
  uniform float time;
  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform float intensity;
  varying vec2 vUv;
  varying vec3 vPos;

  // classic noise function
  float hash(float n) { return fract(sin(n)*43758.5453123); }
  float noise(in vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i.x + i.y*57.0);
    float b = hash(i.x + 1.0 + i.y*57.0);
    float c = hash(i.x + (i.y+1.0)*57.0);
    float d = hash(i.x + 1.0 + (i.y+1.0)*57.0);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
  }

  void main() {
    // radial coordinate
    float r = length(vPos.xy);
    // base banding
    float bands = sin((r * 15.0) - (time * 2.0)) * 0.5 + 0.5;
    // add noise for turbulence
    float n = noise(vUv * 10.0 + vec2(time*0.1, time*0.08));
    float glow = pow(1.0 - smoothstep(0.6, 1.6, r), 1.5);
    vec3 col = mix(colorA, colorB, bands * (0.7 + n*0.6));
    col += vec3(1.0,0.4,0.2) * pow(glow, 1.6) * intensity;
    // falloff toward center
    float centerCut = smoothstep(0.0, 0.95, r);
    gl_FragColor = vec4(col * centerCut, 1.0 - smoothstep(0.0, 1.5, r)*0.9);
  }
  `
);

extend({ AccretionMaterial });

// ---------- Warp distortion shader (kept for reference) ----------
// If you want to apply this as a postprocessing pass, add it via a proper
// ShaderPass/primitive after ensuring the postprocessing package exports it.
// const WarpShader = { ... }

// ---------- Accretion disk with shader ----------
function AccretionDisk({ radius = 2.6, tube = 0.35 }) {
  const meshRef = useRef(null);
  const matRef = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // update shader uniform via material prop (drei's shaderMaterial maps uniforms)
    if (matRef.current) {
      // shaderMaterial exposes uniforms as props, so set .time
      matRef.current.time = t;
    }
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.0008;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, tube, 128, 256]} />
      {/* attach material and keep a ref to update `time` */}
      <accretionMaterial ref={matRef} />
    </mesh>
  );
}

// ---------- Black hole core ----------
function BlackHoleCore({ radius = 1.15 }) {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      const scale = 1.0 + Math.sin(t * 2.0) * 0.01;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshBasicMaterial color="#000000" />
    </mesh>
  );
}

// ---------- Spaceship with safe fallback (no hook errors) ----------
function SpaceshipOrbit({ radius = 4.0 }) {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!ref.current) return;

    // Position in bottom right area
    const angle = t * 0.15 + Math.PI * 0.25;
    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.z = Math.sin(angle) * radius;
    ref.current.position.y = -1.5 + Math.sin(t * 0.1) * 0.3;

    // Always face the black hole
    ref.current.lookAt(0, 0, 0);
  });

  // NOTE: If you want to load a GLTF model, do it *with* Suspense in the parent:
  // <Suspense fallback={null}><SpaceshipWithModel /></Suspense>
  // and inside that component call useGLTF('/models/spaceship.glb')
  // For safety here, we render a procedural fallback so we never break hooks/render.

  return (
    <group ref={ref} scale={[0.4, 0.4, 0.4]}>
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

      {/* Engine with dramatic glow */}
      <mesh position={[0, 0, -1.2]}>
        <cylinderGeometry args={[0.15, 0.1, 0.3, 8]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff00" emissiveIntensity={0.3} />
      </mesh>

      {/* Engine glow effect */}
      <mesh position={[0, 0, -1.5]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial
          color="#ff4400"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Engine trail */}
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
    </group>
  );
}

// ---------- Distant stars ----------
function DistantStars() {
  const pointsRef = useRef(null);

  const [positions, colors] = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
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
  }, []);

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
      <pointsMaterial size={0.3} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// ---------- Camera controller ----------
function CameraController() {
  const { camera } = useThree();
  const tlRef = useRef(null);

  useEffect(() => {
    // animate camera position; always look at origin in useFrame (below)
    tlRef.current = gsap.to(camera.position, {
      x: 0,
      y: 0.5,
      z: 4,
      duration: 5,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, [camera]);

  useFrame(() => {
    // keep camera pointed at center
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ---------- Main Space Scene Component ----------
export default function AdvancedSpaceScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0.5, 4], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={["#000010"]} />

        {/* Lighting */}
        <ambientLight intensity={0.25} />
        <pointLight position={[6, 6, 6]} intensity={1.4} />

        {/* Scene Objects */}
        <DistantStars />
        <BlackHoleCore />
        <AccretionDisk />
        <SpaceshipOrbit />
        <CameraController />

        {/* Post-processing Effects */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.8} intensity={1.3} />
          {/* If you want a custom shader pass (warp), add it here using a proper ShaderPass/primitive
              after ensuring the package exports it or register it with `extend`. */}
        </EffectComposer>
      </Canvas>
    </div>
  );
}
