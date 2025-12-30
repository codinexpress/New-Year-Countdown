
import React, { useEffect, useRef, useCallback } from 'react';
import { Particle, Firework, AppSettings, ParticleShape } from '../types.ts';
import { audioEngine } from '../utils/audio.ts';

interface FireworksCanvasProps {
  settings: AppSettings;
  triggerRef: React.MutableRefObject<((x?: number, y?: number) => void) | null>;
}

const FireworksCanvas: React.FC<FireworksCanvasProps> = ({ settings, triggerRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworks = useRef<Firework[]>([]);
  const isMobile = useRef(window.innerWidth < 768);

  const MAX_PARTICLES = isMobile.current ? 1500 : 5000;

  const getTotalParticles = () => {
    return fireworks.current.reduce((acc, fw) => acc + fw.particles.length, 0);
  };

  const createParticles = (x: number, y: number, color: string) => {
    const currentCount = getTotalParticles();
    if (currentCount >= MAX_PARTICLES) return [];

    const particles: Particle[] = [];
    const available = MAX_PARTICLES - currentCount;
    const count = Math.min(settings.particleDensity, available);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * settings.explosionPower + 2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        size: Math.random() * 3 + 1,
        decay: Math.random() * 0.01 + 0.005,
        rotation: Math.random() * Math.PI * 2,
      });
    }
    return particles;
  };

  const drawShape = (ctx: CanvasRenderingContext2D, p: Particle, shape: ParticleShape) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    
    // Add glow effect to particles
    ctx.shadowBlur = settings.particleDensity > 100 ? 5 : 2;
    ctx.shadowColor = p.color;

    ctx.fillStyle = p.color.replace('rgb', 'rgba').replace(')', `, ${p.alpha})`);
    
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === 'square') {
      ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
    } else if (shape === 'star') {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * p.size * 2,
                   -Math.sin((18 + i * 72) / 180 * Math.PI) * p.size * 2);
        ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * p.size,
                   -Math.sin((54 + i * 72) / 180 * Math.PI) * p.size);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  };

  const launchFirework = useCallback((targetX?: number, targetY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (fireworks.current.length > (isMobile.current ? 15 : 30)) return;

    const x = targetX ?? Math.random() * canvas.width;
    const y = canvas.height;
    const finalTargetY = targetY ?? (Math.random() * (canvas.height * 0.6) + 50);
    const color = settings.fireworkColors[Math.floor(Math.random() * settings.fireworkColors.length)];

    fireworks.current.push({
      x,
      y,
      targetY: finalTargetY,
      color,
      speed: Math.random() * 3 + 7,
      exploded: false,
      particles: [],
    });

    if (settings.soundEnabled) audioEngine.playLaunch();
  }, [settings.fireworkColors, settings.soundEnabled]);

  useEffect(() => {
    triggerRef.current = launchFirework;
  }, [launchFirework, triggerRef]);

  const handleCanvasClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!settings.interactiveEnabled) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    launchFirework(x, y);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      isMobile.current = window.innerWidth < 768;
    };
    window.addEventListener('resize', resize);
    resize();

    let animationId: number;
    let lastAutoLaunch = 0;

    const animate = (time: number) => {
      // Background clear with trail
      ctx.fillStyle = `rgba(2, 6, 23, ${settings.trailLength})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (settings.autoLaunch && time - lastAutoLaunch > (isMobile.current ? 700 : 350)) {
        launchFirework();
        if (!isMobile.current && Math.random() > 0.4) launchFirework(); 
        lastAutoLaunch = time;
      }

      for (let i = fireworks.current.length - 1; i >= 0; i--) {
        const fw = fireworks.current[i];
        if (!fw.exploded) {
          fw.y -= fw.speed;
          
          // Rocket trail
          ctx.beginPath();
          ctx.moveTo(fw.x, fw.y + 15);
          ctx.lineTo(fw.x, fw.y);
          ctx.strokeStyle = fw.color;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Rocket head
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.shadowBlur = 15;
          ctx.shadowColor = fw.color;
          ctx.fill();
          ctx.shadowBlur = 0;

          if (fw.y <= fw.targetY) {
            fw.exploded = true;
            fw.particles = createParticles(fw.x, fw.y, fw.color);
            if (settings.soundEnabled) audioEngine.playExplosion();
          }
        } else {
          for (let j = fw.particles.length - 1; j >= 0; j--) {
            const p = fw.particles[j];
            p.vx *= 0.985;
            p.vy *= 0.985;
            p.vy += settings.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            p.rotation += 0.08;

            if (p.alpha > 0) {
              drawShape(ctx, p, settings.particleShape);
            } else {
              fw.particles.splice(j, 1);
            }
          }

          if (fw.particles.length === 0) {
            fireworks.current.splice(i, 1);
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [settings, launchFirework]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleCanvasClick}
      onTouchStart={handleCanvasClick}
      className={`absolute inset-0 z-0 ${settings.interactiveEnabled ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'}`}
    />
  );
};

export default FireworksCanvas;
