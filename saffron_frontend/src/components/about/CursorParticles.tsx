import { useEffect, useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
}

const CursorParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const isMobile = useIsMobile();

  const createParticle = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.random();
    return {
      id,
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 40,
      opacity: 0.12 + Math.random() * 0.03,
      scale: 0.3 + Math.random() * 0.4,
      rotation: Math.random() * 360,
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let lastX = 0;
    let lastY = 0;
    let frameCount = 0;

    const handleMouseMove = (e: MouseEvent | any) => {
      frameCount++;
      
      // Only create particle every 8 frames for sparse effect
      if (frameCount % 8 !== 0) return;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2)
      );
      
      // Only create particles when moving significantly
      if (distance < 30) return;
      
      lastX = e.clientX;
      lastY = e.clientY;

      const newParticle = createParticle(e.clientX, e.clientY);
      
      setParticles((prev) => {
        const updated = [...prev, newParticle].slice(-6); // Max 6 particles
        return updated;
      });

      // Remove particle after animation
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile, createParticle]);

  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-particle-float"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.opacity,
            transform: `scale(${particle.scale}) rotate(${particle.rotation}deg)`,
          }}
        >
          {/* Saffron strand SVG */}
          <svg
            width="24"
            height="60"
            viewBox="0 0 24 60"
            fill="none"
            className="text-gold"
          >
            <path
              d="M12 0C12 0 8 20 10 35C11 42 12 50 12 60"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M12 0C12 0 16 18 14 32C13 40 12 50 12 60"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            <ellipse
              cx="12"
              cy="4"
              rx="3"
              ry="4"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default CursorParticles;
