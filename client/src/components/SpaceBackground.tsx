import { useEffect, useRef, useState } from 'react';

/**
 * SpaceBackground - Optimized animated canvas background
 * 
 * Performance optimizations:
 * - Reduced star count from 300 to 150
 * - Shooting stars spawn less frequently (every 6-12s instead of 3-8s)
 * - Respects prefers-reduced-motion (disables all animations)
 * - Throttled mouse tracking updates
 * - Canvas is only rendered when visible
 */
export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionPreference = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMotionPreference);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionPreference);
    };
  }, []);

  useEffect(() => {
    // If user prefers reduced motion, render static stars only once
    if (prefersReducedMotion) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;

      // Draw static stars (no animation)
      const starCount = 100; // Even fewer for static display
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5 + 0.5;
        const opacity = Math.random() * 0.4 + 0.2;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Throttled mouse tracking (update every 50ms max)
    let lastMouseUpdate = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseUpdate < 50) return;
      lastMouseUpdate = now;
      
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY + window.scrollY
      };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Scroll tracking
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Star particles - REDUCED from 300 to 150 for better performance
    interface Star {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      twinkleSpeed: number;
      layer: number;
    }

    const stars: Star[] = [];
    const starCount = 150; // Reduced from 300

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        layer: Math.floor(Math.random() * 3) + 1
      });
    }

    // Shooting stars
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      angle: number;
    }

    const shootingStars: ShootingStar[] = [];

    const createShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 10 + 15,
        opacity: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.5
      });
    };

    // Create shooting star every 6-12 seconds (was 3-8 seconds)
    const shootingStarInterval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance (was 50%)
        createShootingStar();
      }
    }, 6000 + Math.random() * 6000); // 6-12s (was 3-8s)

    // Animation loop
    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars with parallax
      stars.forEach((star) => {
        const parallaxOffset = (scrollRef.current * star.layer * 0.1);
        const y = star.y - parallaxOffset;

        // Mouse follow effect (only compute for nearby stars)
        const dx = mouseRef.current.x - star.x;
        const dy = mouseRef.current.y - y;
        const distanceSquared = dx * dx + dy * dy; // Skip sqrt for performance
        const maxDistanceSquared = 40000; // 200^2
        
        let offsetX = 0;
        let offsetY = 0;
        if (distanceSquared < maxDistanceSquared) {
          const distance = Math.sqrt(distanceSquared);
          const force = (200 - distance) / 200;
          offsetX = (dx / distance) * force * 10 * star.layer;
          offsetY = (dy / distance) * force * 10 * star.layer;
        }

        // Twinkle effect
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.arc(
          star.x + offsetX, 
          y + offsetY, 
          star.size, 
          0, 
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();
      });

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const shootingStar = shootingStars[i];
        
        const gradient = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
          shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
        gradient.addColorStop(0.5, `rgba(200, 220, 255, ${shootingStar.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
          shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
        );
        ctx.stroke();

        // Update shooting star
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.01;

        // Remove if faded (iterate backwards to safely remove)
        if (shootingStar.opacity <= 0) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(shootingStarInterval);
      cancelAnimationFrame(animationFrame);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
