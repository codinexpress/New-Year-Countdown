
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  rotation: number;
}

export interface Firework {
  x: number;
  y: number;
  targetY: number;
  color: string;
  speed: number;
  exploded: boolean;
  particles: Particle[];
}

export type ParticleShape = 'circle' | 'star' | 'square';

export interface AppSettings {
  particleDensity: number;
  explosionPower: number;
  fireworkColors: string[];
  soundEnabled: boolean;
  autoLaunch: boolean;
  interactiveEnabled: boolean;
  targetYear: number;
  userMessage: string;
  gravity: number;
  trailLength: number;
  particleShape: ParticleShape;
  themeName: string;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}
