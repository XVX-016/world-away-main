import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Stars, useGLTF, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, ShaderPass } from '@react-three/postprocessing';
import gsap from 'gsap';

// ---------- Accretion Disk ShaderMaterial ----------
const AccretionMaterial = shaderMaterial(
  // uniforms
  { 
    time: 0, 
    colorA: new THREE.Color(0xff6b6b), 
    colorB: new THREE.Color(0x8b5cf6), 
    intensity: 1.5 
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

// register material
extend({ AccretionMaterial });

// ---------- Warp distortion shader ----------
const WarpShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    center: { value: new THREE.Vector2(0.5, 0.5) },
    strength: { value: 0.25 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform vec2 center;
    uniform float strength;
    varying vec2 vUv;

    void main(){
      vec2 uv = vUv;
      vec2 dir = uv - center;
      float dist = length(dir);
      // radial wobble over time and stronger near center
      float wobble = 0.2 * sin(time*1.2 + dist*30.0);
      float factor = 1.0 + (-strength * smoothstep(0.0, 0.7, 1.0 - dist)) + wobble * (1.0 - dist);
      vec2 sampleUV = center + dir * factor;
      vec4 color = texture2D(tDiffuse, sampleUV);
      // chromatic aberration
      vec4 colR = texture2D(tDiffuse, sampleUV + dir * 0.002);
      vec4 colB = texture2D(tDiffuse, sampleUV - dir * 0.002);
      gl_FragColor = vec4(colR.r, color.g, colB.b, color.a);
    }
  `
};

// ---------- Accretion disk with shader ----------
function AccretionDisk({ radius = 2.6, tube = 0.35 }) {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.uniforms.time.value = clock.getElapsedTime();
      ref.current.rotation.z += 0.0008;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, tube, 128, 256]} />
      <accretionMaterial />
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
      <sphereGeometry args={[radius, 64, 64]} />
      <meshBasicMaterial color="#000000" />
    </mesh>
  );
}

// ---------- Spaceship with GLTF fallback ----------
function SpaceshipOrbit({ radius = 4.0 }) {
  const ref = useRef();
  let gltf = null;
  
  try {
    gltf = useGLTF("/models/spaceship.glb");
  } catch (e) {
    gltf = null;
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!ref.current) return;
    
    // Position in bottom right area like in the image
    const angle = t * 0.15 + Math.PI * 0.25;
    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.z = Math.sin(angle) * radius;
    ref.current.position.y = -1.5 + Math.sin(t * 0.1) * 0.3;
    
    // Always face the black hole
    ref.current.lookAt(0, 0, 0);
  });

  return (
    <group ref={ref} scale={[0.4, 0.4, 0.4]}>
      {gltf ? (
        <primitive object={gltf.scene} />
      ) : (
        <group>
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
      )}
    </group>
  );
}

// ---------- Distant stars ----------
function DistantStars() {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    const colors = new Float32Array(5000 * 3);
    
    for (let i = 0; i < 5000; i++) {
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

// ---------- Main Space Scene Component ----------
export default function AdvancedSpaceScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
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
          <Bloom 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.8} 
            intensity={1.3} 
          />
          <ShaderPass 
            attach="warp"
            args={[WarpShader]}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
