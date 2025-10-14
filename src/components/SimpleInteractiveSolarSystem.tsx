import React, { useState, useRef, useEffect } from 'react';

interface Planet {
  name: string;
  distance: number;
  size: number;
  color: string;
  speed: number;
  temperature: string;
  facts: string[];
}

interface SimpleInteractiveSolarSystemProps {
  currentPlanet: number;
  onPlanetSelect: (index: number) => void;
}

const SimpleInteractiveSolarSystem: React.FC<SimpleInteractiveSolarSystemProps> = ({ 
  currentPlanet, 
  onPlanetSelect 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef<number>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const planets: Planet[] = [
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 4;

      // Draw orbital rings
      planets.forEach((planet, index) => {
        const radius = planet.distance * scale;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw Sun
      ctx.beginPath();
      ctx.fillStyle = '#FFD700';
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Add glow effect to sun
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20);
      gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(centerX - 20, centerY - 20, 40, 40);

      // Draw planets
      planets.forEach((planet, index) => {
        const radius = planet.distance * scale;
        const angle = (timeRef.current * planet.speed) + (index * Math.PI / 4);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const planetSize = Math.max(4, planet.size * 3);
        const isActive = index === currentPlanet;

        // Check if mouse is over planet
        const mouseDistance = Math.sqrt((x - mousePos.x) ** 2 + (y - mousePos.y) ** 2);
        const isHovered = mouseDistance < planetSize + 10;

        // Draw planet
        ctx.beginPath();
        ctx.fillStyle = planet.color;
        ctx.arc(x, y, planetSize, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect for active planet
        if (isActive || isHovered) {
          const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, planetSize * 2);
          glowGradient.addColorStop(0, `${planet.color}40`);
          glowGradient.addColorStop(1, `${planet.color}00`);
          ctx.fillStyle = glowGradient;
          ctx.fillRect(x - planetSize * 2, y - planetSize * 2, planetSize * 4, planetSize * 4);
        }

        // Draw planet name for active planet
        if (isActive) {
          ctx.fillStyle = 'white';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(planet.name, x, y - planetSize - 15);
        }
      });

      timeRef.current += 0.01;
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 4;

      planets.forEach((planet, index) => {
        const radius = planet.distance * scale;
        const angle = (timeRef.current * planet.speed) + (index * Math.PI / 4);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const planetSize = Math.max(4, planet.size * 3);

        const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
        if (distance < planetSize + 10) {
          onPlanetSelect(index);
        }
      });
    };

    resizeCanvas();
    animate();

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [currentPlanet, onPlanetSelect, mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-pointer"
      style={{ background: 'transparent' }}
    />
  );
};

export default SimpleInteractiveSolarSystem;
