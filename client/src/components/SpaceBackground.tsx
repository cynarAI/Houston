import { useEffect, useState, useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
  twinkleDuration: number;
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
}

export function SpaceBackground() {
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  // Generate static stars (memoized to prevent re-renders)
  const stars = useMemo<Star[]>(() => {
    const starCount = 150;
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleDelay: Math.random() * 5,
      twinkleDuration: Math.random() * 3 + 2,
    }));
  }, []);

  // Shooting stars effect
  useEffect(() => {
    const createShootingStar = () => {
      const newStar: ShootingStar = {
        id: Date.now(),
        x: Math.random() * 70 + 10,
        y: Math.random() * 30,
        angle: Math.random() * 30 + 15,
      };
      
      setShootingStars(prev => [...prev, newStar]);
      
      // Remove after animation
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== newStar.id));
      }, 2000);
    };

    // Random interval for shooting stars (every 4-10 seconds)
    const scheduleNext = () => {
      const delay = Math.random() * 6000 + 4000;
      return setTimeout(() => {
        createShootingStar();
        scheduleNext();
      }, delay);
    };

    const timeout = scheduleNext();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          {/* Glow filter for brighter stars */}
          <filter id="starGlowLanding" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {stars.map((star) => (
          <circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="white"
            opacity={star.opacity}
            filter={star.size > 1.5 ? "url(#starGlowLanding)" : undefined}
            className="animate-twinkle"
            style={{
              animationDelay: `${star.twinkleDelay}s`,
              animationDuration: `${star.twinkleDuration}s`,
            }}
          />
        ))}
      </svg>

      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-shooting-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            transform: `rotate(${star.angle}deg)`,
          }}
        >
          <div className="w-24 h-[2px] bg-gradient-to-r from-white via-white/80 to-transparent rounded-full" />
        </div>
      ))}

      {/* Nebula-like color overlay */}
      <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-[#FF6B9D]/10 via-[#C44FE2]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-[#00D4FF]/10 via-[#C44FE2]/5 to-transparent blur-3xl pointer-events-none" />
    </>
  );
}
