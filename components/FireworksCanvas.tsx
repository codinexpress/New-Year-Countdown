
import React, { useEffect, useRef, useCallback } from 'react';
import { Particle, Firework, AppSettings, ParticleShape } from '../types';
import { audioEngine } from '../utils/audio';

interface FireworksCanvasProps {
  settings: AppSettings;
  triggerRef: React.MutableRefObject<(() => void) | null>;
}

const FireworksCanvas: React.FC<FireworksCanvasProps> = ({ settings, triggerRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworks = useRef<Firework[]>([]);

  const createParticles = (x: number, y: number, color: string) => {
    const particles: Particle[] = [];
    const count = settings.particleDensity;
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

  const launchFirework = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const targetY = Math.random() * (canvas.height * 0.5) + 50;
    const color = settings.fireworkColors[Math.floor(Math.random() * settings.fireworkColors.length)];

    fireworks.current.push({
      x,
      y,
      targetY,
      color,
      speed: Math.random() * 2 + 5,
      exploded: false,
      particles: [],
    });

    if (settings.soundEnabled) audioEngine.playLaunch();
  }, [settings.fireworkColors, settings.soundEnabled]);

  useEffect(() => {
    triggerRef.current = launchFirework;
  }, [launchFirework, triggerRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let animationId: number;
    let lastAutoLaunch = 0;

    const animate = (time: number) => {
      // Trail effect determined by trailLength setting
      ctx.fillStyle = `rgba(2, 6, 23, ${settings.trailLength})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (settings.autoLaunch && time - lastAutoLaunch > 1500) {
        launchFirework();
        lastAutoLaunch = time;
      }

      fireworks.current.forEach((fw, fwIdx) => {
        if (!fw.exploded) {
          fw.y -= fw.speed;
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = fw.color;
          ctx.fill();
          ctx.shadowBlur = 0;

          if (fw.y <= fw.targetY) {
            fw.exploded = true;
            fw.particles = createParticles(fw.x, fw.y, fw.color);
            if (settings.soundEnabled) audioEngine.playExplosion();
          }
        } else {
          fw.particles.forEach((p) => {
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.vy += settings.gravity; // Custom gravity
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            p.rotation += 0.05;

            if (p.alpha > 0) {
              drawShape(ctx, p, settings.particleShape);
            }
          });

          fw.particles = fw.particles.filter(p => p.alpha > 0);
          if (fw.particles.length === 0) {
            fireworks.current.splice(fwIdx, 1);
          }
        }
      });

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
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};

export default FireworksCanvas;
