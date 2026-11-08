import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface FireworksHandle {
  launchSalvo: (count?: number) => void;
  launchAt: (x: number, y: number) => void;
}

interface FireworksCanvasProps {
  intensity?: 'welcome' | 'celebration';
  soundEnabled?: boolean;
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  secondaryColor: string;
  trail: { x: number; y: number; alpha: number }[];
  burstType: 'chrysanthemum' | 'ring' | 'willow' | 'double';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
  gravity: number;
  drag: number;
  sparkle: boolean;
  trail: { x: number; y: number }[];
}

interface FloatingSparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  color: string;
}

const FESTIVE_PALETTES = [
  { primary: '#FFD700', secondary: '#FFF3B0' }, // Royal Gold & Champagne
  { primary: '#FF7A00', secondary: '#FFD700' }, // Marigold Orange & Gold
  { primary: '#FF2A54', secondary: '#FFB3C1' }, // Kumkum Red & Rose
  { primary: '#C084FC', secondary: '#F5D0FE' }, // Royal Amethyst Purple
  { primary: '#FF499E', secondary: '#FFD700' }, // Festive Lotus Pink & Gold
];

export const FireworksCanvas = forwardRef<FireworksHandle, FireworksCanvasProps>(
  ({ intensity = 'celebration', soundEnabled = false }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rocketsRef = useRef<Rocket[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const sparklesRef = useRef<FloatingSparkle[]>([]);
    const soundEnabledRef = useRef(soundEnabled);
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
      soundEnabledRef.current = soundEnabled;
    }, [soundEnabled]);

    const playBurstSound = () => {
      if (!soundEnabledRef.current) return;
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Soft festive crackle + warm bell harmonic
        const now = ctx.currentTime;
        const bufferSize = ctx.sampleRate * 0.18;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(950 + Math.random() * 500, now);
        filter.Q.setValueAtTime(1.5, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        whiteNoise.start(now);
      } catch {
        // Ignore audio errors if blocked by browser
      }
    };

    const spawnRocket = (customX?: number, customTargetY?: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      const palette = FESTIVE_PALETTES[Math.floor(Math.random() * FESTIVE_PALETTES.length)];
      const startX = customX ?? w * (0.12 + Math.random() * 0.76);
      const targetY = customTargetY ?? h * (0.12 + Math.random() * 0.42);
      const distanceY = h - targetY;
      const speed = Math.sqrt(2 * 0.16 * distanceY) * (0.95 + Math.random() * 0.1);

      const burstTypes: Rocket['burstType'][] = ['chrysanthemum', 'ring', 'willow', 'double'];
      const burstType = burstTypes[Math.floor(Math.random() * burstTypes.length)];

      rocketsRef.current.push({
        x: startX,
        y: h,
        vx: (Math.random() - 0.5) * 1.6,
        vy: -speed,
        targetY,
        color: palette.primary,
        secondaryColor: palette.secondary,
        trail: [],
        burstType,
      });
    };

    const explodeRocket = (rocket: Rocket) => {
      playBurstSound();
      const count = rocket.burstType === 'willow' ? 78 : rocket.burstType === 'double' ? 90 : 68;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.08;
        let speed = 2.2 + Math.random() * 4.8;
        let color = Math.random() > 0.3 ? rocket.color : rocket.secondaryColor;

        if (rocket.burstType === 'ring') {
          speed = 4.2 + (Math.random() - 0.5) * 0.45;
        } else if (rocket.burstType === 'double') {
          const isInner = i % 2 === 0;
          speed = isInner ? 2.6 + Math.random() * 0.6 : 5.2 + Math.random() * 0.8;
          color = isInner ? rocket.secondaryColor : rocket.color;
        } else if (rocket.burstType === 'willow') {
          speed = 1.8 + Math.random() * 4.2;
        }

        particlesRef.current.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          decay: rocket.burstType === 'willow' ? 0.008 + Math.random() * 0.006 : 0.012 + Math.random() * 0.01,
          size: rocket.burstType === 'willow' ? 2.4 : 2 + Math.random() * 1.4,
          gravity: rocket.burstType === 'willow' ? 0.048 : 0.065,
          drag: 0.975,
          sparkle: Math.random() > 0.35,
          trail: [],
        });
      }
    };

    useImperativeHandle(ref, () => ({
      launchSalvo: (count = 6) => {
        for (let i = 0; i < count; i++) {
          setTimeout(() => {
            spawnRocket();
          }, i * 160);
        }
      },
      launchAt: (x: number, y: number) => {
        spawnRocket(x, y);
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const handleResize = () => {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      // Initialize ambient floating golden sparkles
      const sparkleCount = 42;
      sparklesRef.current = Array.from({ length: sparkleCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.25 - Math.random() * 0.45,
        size: 1.2 + Math.random() * 2.2,
        alpha: 0.2 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.3 ? '#FFD700' : '#FF8C42',
      }));

      // Initial celebratory burst
      const initialCount = intensity === 'celebration' ? 5 : 2;
      for (let i = 0; i < initialCount; i++) {
        setTimeout(() => spawnRocket(), i * 280);
      }

      let animId: number;
      let lastAutoLaunch = performance.now();

      const render = (now: number) => {
        animId = requestAnimationFrame(render);

        // Semi-transparent clear for luminous trails
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = 'lighter';

        // Periodic automatic fireworks
        const launchInterval = intensity === 'celebration' ? 950 : 2100;
        if (now - lastAutoLaunch > launchInterval) {
          spawnRocket();
          if (intensity === 'celebration' && Math.random() > 0.55) {
            setTimeout(() => spawnRocket(), 220);
          }
          lastAutoLaunch = now;
        }

        // Update & draw ambient floating golden sparkles
        for (const sp of sparklesRef.current) {
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.phase += 0.04;
          if (sp.y < -10) sp.y = canvas.height + 10;
          if (sp.x < -10) sp.x = canvas.width + 10;
          if (sp.x > canvas.width + 10) sp.x = -10;

          const currentAlpha = sp.alpha * (0.6 + 0.4 * Math.sin(sp.phase));
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fillStyle = sp.color;
          ctx.globalAlpha = currentAlpha;
          ctx.fill();
        }

        // Update & draw rockets
        for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
          const r = rocketsRef.current[i];
          r.trail.push({ x: r.x, y: r.y, alpha: 0.9 });
          if (r.trail.length > 8) r.trail.shift();

          r.x += r.vx;
          r.y += r.vy;
          r.vy += 0.15;

          // Draw rocket trail
          for (let t = 0; t < r.trail.length; t++) {
            const pt = r.trail[t];
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.8 * (t / r.trail.length), 0, Math.PI * 2);
            ctx.fillStyle = '#FFD700';
            ctx.globalAlpha = (t / r.trail.length) * 0.75;
            ctx.fill();
          }

          // Draw rocket head
          ctx.beginPath();
          ctx.arc(r.x, r.y, 2.8, 0, Math.PI * 2);
          ctx.fillStyle = '#FFF8EB';
          ctx.globalAlpha = 1;
          ctx.fill();

          if (r.vy >= -0.8 || r.y <= r.targetY) {
            explodeRocket(r);
            rocketsRef.current.splice(i, 1);
          }
        }

        // Update & draw explosion particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 4) p.trail.shift();

          p.vx *= p.drag;
          p.vy *= p.drag;
          p.vy += p.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          if (p.alpha <= 0.02) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          const twinkle = p.sparkle ? (Math.sin(now * 0.03 + i) > 0 ? 1 : 0.45) : 1;

          // Draw micro-trail
          if (p.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size * 0.75;
            ctx.globalAlpha = p.alpha * 0.45 * twinkle;
            ctx.stroke();
          }

          // Outer glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.22 * twinkle;
          ctx.fill();

          // Bright core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.alpha > 0.65 ? '#FFFDF5' : p.color;
          ctx.globalAlpha = p.alpha * twinkle;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      };

      animId = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
      };
    }, [intensity]);

    return (
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-10 w-full h-full"
      />
    );
  }
);

FireworksCanvas.displayName = 'FireworksCanvas';
