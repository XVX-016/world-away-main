import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  radius: number;
  color: string;
  speed: number;
  name: string;
  distance: number;
  size: number;
  temperature: string;
  facts: string[];
  isActive: boolean;
  onClick: () => void;
}

const Planet: React.FC<PlanetProps> = ({ 
  position, 
  radius, 
  color, 
  speed, 
  name, 
  distance, 
  size, 
  temperature, 
  facts, 
  isActive, 
  onClick 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={isActive ? 1.5 : 1}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={isActive ? color : '#000000'}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </mesh>
      
      {isActive && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 backdrop-blur-lg border border-white/20 rounded-lg p-4 text-white text-sm max-w-xs">
            <h3 className="font-bold text-lg mb-2">{name}</h3>
            <div className="space-y-1">
              <div>Distance: {distance} AU</div>
              <div>Size: {size} R⊕</div>
              <div>Temperature: {temperature}</div>
            </div>
            <div className="mt-2">
              <div className="text-xs text-gray-300">Facts:</div>
              <div className="text-xs">{facts.join(', ')}</div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

const Sun: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial 
        color="#FFD700" 
        emissive="#FFA500"
        emissiveIntensity={0.5}
      />
      <pointLight intensity={2} color="#FFD700" />
    </mesh>
  );
};

const OrbitRing: React.FC<{ radius: number; color: string }> = ({ radius, color }) => {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} opacity={0.3} transparent />
    </line>
  );
};

interface InteractiveSolarSystemProps {
  currentPlanet: number;
  onPlanetSelect: (index: number) => void;
}

const InteractiveSolarSystem: React.FC<InteractiveSolarSystemProps> = ({ 
  currentPlanet, 
  onPlanetSelect 
}) => {
  const planets = [
    {
      name: 'Mercury',
      distance: 0.39,
      size: 0.38,
      color: '#8C7853',
      speed: 0.02,
      temperature: '427°C to -173°C',
      facts: ['No atmosphere', 'Extreme temperature variations', 'Fastest orbital speed']
    },
    {
      name: 'Venus',
      distance: 0.72,
      size: 0.95,
      color: '#FFC649',
      speed: 0.015,
      temperature: '462°C',
      facts: ['Hottest planet', 'Retrograde rotation', 'Dense atmosphere']
    },
    {
      name: 'Earth',
      distance: 1.0,
      size: 1.0,
      color: '#6B93D6',
      speed: 0.01,
      temperature: '15°C average',
      facts: ['Only planet with life', '71% water coverage', 'Protective magnetic field']
    },
    {
      name: 'Mars',
      distance: 1.52,
      size: 0.53,
      color: '#C1440E',
      speed: 0.008,
      temperature: '-65°C average',
      facts: ['Red due to iron oxide', 'Two small moons', 'Largest volcano in solar system']
    },
    {
      name: 'Jupiter',
      distance: 5.2,
      size: 11.2,
      color: '#D8CA9D',
      speed: 0.003,
      temperature: '-110°C',
      facts: ['Largest planet', 'Great Red Spot storm', '79+ moons']
    },
    {
      name: 'Saturn',
      distance: 9.58,
      size: 9.4,
      color: '#FAD5A5',
      speed: 0.002,
      temperature: '-140°C',
      facts: ['Famous ring system', 'Less dense than water', '82+ moons']
    },
    {
      name: 'Uranus',
      distance: 19.2,
      size: 4.0,
      color: '#4FD0E7',
      speed: 0.001,
      temperature: '-195°C',
      facts: ['Rotates on its side', 'Ice giant', 'Faint ring system']
    },
    {
      name: 'Neptune',
      distance: 30.1,
      size: 3.9,
      color: '#4B70DD',
      speed: 0.0005,
      temperature: '-200°C',
      facts: ['Strongest winds', 'Farthest planet', 'Dark blue color']
    }
  ];

  return (
    <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#FFD700" />
      
      <Sun />
      
      {/* Orbit Rings */}
      {planets.map((planet, index) => (
        <OrbitRing 
          key={`orbit-${index}`} 
          radius={planet.distance * 2} 
          color="#FFFFFF" 
        />
      ))}
      
      {/* Planets */}
      {planets.map((planet, index) => {
        const angle = (360 / planets.length) * index;
        const x = Math.cos((angle * Math.PI) / 180) * planet.distance * 2;
        const z = Math.sin((angle * Math.PI) / 180) * planet.distance * 2;
        
        return (
          <Planet
            key={planet.name}
            position={[x, 0, z]}
            radius={Math.max(0.1, planet.size * 0.1)}
            color={planet.color}
            speed={planet.speed}
            name={planet.name}
            distance={planet.distance}
            size={planet.size}
            temperature={planet.temperature}
            facts={planet.facts}
            isActive={index === currentPlanet}
            onClick={() => onPlanetSelect(index)}
          />
        );
      })}
      
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

export default InteractiveSolarSystem;
