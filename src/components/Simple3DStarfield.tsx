import React, { useRef, useEffect, useState } from 'react';

const Simple3DStarfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
      const stars = [];
      const starCount = 3000;
      let mouseX = 0;
      let mouseY = 0;
      
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          speed: 0.1 + Math.random() * 0.5,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2
        });
        stars[i].originalX = stars[i].x;
        stars[i].originalY = stars[i].y;
      }

      const animate = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
          star.z -= star.speed;
          star.opacity = (1000 - star.z) / 1000;
          
          if (star.z <= 0) {
            star.z = 1000;
            star.x = Math.random() * canvas.width;
            star.y = Math.random() * canvas.height;
            star.originalX = star.x;
            star.originalY = star.y;
          }

          const parallax = ((1000 - star.z) / 1000) * 20;
          const x = (star.x - canvas.width / 2) * (1000 / star.z) + canvas.width / 2 + (mouseX - canvas.width / 2) * (parallax / 100);
          const y = (star.y - canvas.height / 2) * (1000 / star.z) + canvas.height / 2 + (mouseY - canvas.height / 2) * (parallax / 100);
          const size = (1000 - star.z) / 1000 * star.size;

          if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        requestAnimationFrame(animate);
      };

      resizeCanvas();
      animate();
      setIsLoaded(true);
    };

    initStars();

    const onMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      // store on the canvas element for access in animate closure
      (canvas as any)._mouseX = e.clientX;
      (canvas as any)._mouseY = e.clientY;
    };

    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};

export default Simple3DStarfield;
