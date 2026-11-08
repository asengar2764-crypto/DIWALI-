import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface GoldenConfettiHandle {
  triggerConfetti: (count?: number) => void;
}

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
  tiltAngle: number;
  tiltSpeed: number;
  color: string;
  shimmerColor: string;
  alpha: number;
  decay: number;
  shape: 'ribbon' | 'diamond' | 'petal';
}

const GOLDEN_CONFETTI_COLORS = [
  { main: '#FFD700', shimmer: '#FFFBEB' }, // 24K Royal Gold
  { main: '#FACC15', shimmer: '#FEF08A' }, // Sovereign Gold
  { main: '#F59E0B', shimmer: '#FDE68A' }, // Warm Amber Gold
  { main: '#FB923C', shimmer: '#FFEDD5' }, // Marigold Saffron
  { main: '#FDE047', shimmer: '#FFFFFF' }, // Champagne Gold Foil
];

export const GoldenConfettiRain = forwardRef<GoldenConfettiHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const animIdRef = useRef<number | null>(null);

  const spawnConfettiBatch = (count = 135) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const shapes: ConfettiPiece['shape'][] = ['ribbon', 'diamond', 'petal'];

    for (let i = 0; i < count; i++) {
      const palette =
        GOLDEN_CONFETTI_COLORS[Math.floor(Math.random() * GOLDEN_CONFETTI_COLORS.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      piecesRef.current.push({
        x: Math.random() * width,
        y: -20 - Math.random() * (height * 0.45),
        vx: (Math.random() - 0.5) * 2.8,
        vy: 2.4 + Math.random() * 3.8,
        width: shape === 'ribbon' ? 11 + Math.random() * 6 : 8 + Math.random() * 5,
        height: shape === 'ribbon' ? 5 + Math.random() * 3 : 8 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.12,
        tiltAngle: Math.random() * Math.PI * 2,
        tiltSpeed: 0.06 + Math.random() * 0.09,
        color: palette.main,
        shimmerColor: palette.shimmer,
        alpha: 1,
        decay: 0.0022 + Math.random() * 0.0025,
        shape,
      });
    }
  };

  useImperativeHandle(ref, () => ({
    triggerConfetti: (count = 135) => {
      spawnConfettiBatch(count);
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

    const render = (now: number) => {
      animIdRef.current = requestAnimationFrame(render);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (piecesRef.current.length === 0) return;

      for (let i = piecesRef.current.length - 1; i >= 0; i--) {
        const p = piecesRef.current[i];

        p.tiltAngle += p.tiltSpeed;
        p.rotation += p.rotationSpeed;
        p.x += p.vx + Math.sin(p.tiltAngle) * 1.15;
        p.y += p.vy;
        p.vy = Math.min(p.vy + 0.025, 5.2);

        if (p.y > canvas.height * 0.78) {
          p.alpha -= p.decay * 3.2;
        } else {
          p.alpha -= p.decay * 0.4;
        }

        if (p.alpha <= 0.02 || p.y > canvas.height + 40) {
          piecesRef.current.splice(i, 1);
          continue;
        }

        const scaleY = Math.cos(p.tiltAngle);
        const isGlinting = Math.abs(scaleY) > 0.82 && Math.sin(now * 0.02 + i) > 0.3;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(1, scaleY);
        ctx.globalAlpha = Math.max(0, p.alpha);

        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = isGlinting ? 12 : 4;
        ctx.fillStyle = isGlinting ? p.shimmerColor : p.color;

        if (p.shape === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(0, -p.height);
          ctx.lineTo(p.width, 0);
          ctx.lineTo(0, p.height);
          ctx.lineTo(-p.width, 0);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'petal') {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.width * 0.7, p.height * 0.45, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        }

        ctx.restore();
      }
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
});

GoldenConfettiRain.displayName = 'GoldenConfettiRain';
