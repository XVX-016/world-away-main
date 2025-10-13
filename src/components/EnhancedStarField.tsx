import React, { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  speed: number;
  size: number;
  color: string;
  twinkle: number;
}

export const EnhancedStarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initStars = () => {
      starsRef.current = [];
      const starCount = 300;
      
      for (let i = 0; i < starCount; i++) {
        const star: Star = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          speed: 0.2 + Math.random() * 0.8,
          size: Math.random() * 2 + 0.5,
          color: Math.random() > 0.7 ? '#87CEEB' : '#FFFFFF',
          twinkle: Math.random() * Math.PI * 2
        };
        starsRef.current.push(star);
      }
    };

    const animate = () => {
      // Create trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach(star => {
        // Update star position
        star.z -= star.speed;
        star.twinkle += 0.02;
        
        if (star.z <= 0) {
          star.z = 1000;
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
        }

        // Calculate screen position
        const x = (star.x - canvas.width / 2) * (1000 / star.z) + canvas.width / 2;
        const y = (star.y - canvas.height / 2) * (1000 / star.z) + canvas.height / 2;
        
        // Mouse interaction effect
        const mouseDistance = Math.sqrt(
          Math.pow(x - mousePos.x, 2) + Math.pow(y - mousePos.y, 2)
        );
        const mouseEffect = mouseDistance < 100 ? (100 - mouseDistance) / 100 : 0;
        
        const size = (1000 - star.z) / 1000 * star.size * (1 + mouseEffect * 0.5);
        const alpha = (1000 - star.z) / 1000 * (0.3 + Math.sin(star.twinkle) * 0.2);
        
        // Draw star
        ctx.beginPath();
        ctx.fillStyle = `${star.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect for larger stars
        if (size > 1.5) {
          ctx.beginPath();
          ctx.fillStyle = `${star.color}${Math.floor(alpha * 50).toString(16).padStart(2, '0')}`;
          ctx.arc(x, y, size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    resizeCanvas();
    initStars();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initStars();
    });
    
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 transition-opacity duration-500"
      style={{ 
        background: 'transparent',
        opacity: isHovered ? 1 : 0.8
      }}
    />
  );
};
