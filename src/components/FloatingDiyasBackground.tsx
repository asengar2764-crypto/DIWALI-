import React, { useEffect, useState } from 'react';

interface FloatingDiyaItem {
  id: number;
  left: number; // percentage 2% - 96%
  duration: number; // seconds 15s - 30s
  delay: number; // seconds 0s - 18s
  scale: number; // 0.45 - 0.95
  maxOpacity: number; // 0.22 - 0.65
  swayAmplitude: number; // px
}

const FLOATING_DIYAS: FloatingDiyaItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: ((i * 19 + 7) % 92) + 4,
  duration: 16 + ((i * 7) % 15),
  delay: -((i * 3.7) % 22),
  scale: 0.45 + ((i * 13) % 50) / 100,
  maxOpacity: 0.22 + ((i * 11) % 42) / 100,
  swayAmplitude: 12 + ((i * 5) % 18),
}));

interface CursorSpark {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
}

const SPARK_COLORS = ['#FEF08A', '#FACC15', '#FB923C', '#FFD700'];

export function FloatingDiyasBackground() {
  const [cursorSparks, setCursorSparks] = useState<CursorSpark[]>([]);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let lastSpawn = 0;

    const spawnAt = (clientX: number, clientY: number, burstCount = 2) => {
      setPointerPos({ x: clientX, y: clientY });
      const now = performance.now();
      if (now - lastSpawn < 40 && burstCount <= 2) return;
      lastSpawn = now;

      const newSparks: CursorSpark[] = Array.from({ length: burstCount }, (_, idx) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 10 + Math.random() * 24;
        return {
          id: now + Math.random() + idx,
          x: clientX,
          y: clientY,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed - 6,
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
        };
      });

      setCursorSparks((prev) => [...prev.slice(-22), ...newSparks]);
    };

    const handleMouseMove = (e: MouseEvent) => {
      spawnAt(e.clientX, e.clientY, 2);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        spawnAt(touch.clientX, touch.clientY, 3);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        spawnAt(touch.clientX, touch.clientY, 6);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      <style>{`
        @keyframes floatDiyaUpward {
          0% {
            transform: translate3d(0px, 108vh, 0) scale(var(--diya-scale, 0.7));
            opacity: 0;
          }
          12% {
            opacity: var(--diya-opacity, 0.45);
          }
          50% {
            transform: translate3d(var(--diya-sway, 16px), 48vh, 0) scale(var(--diya-scale, 0.7));
            opacity: var(--diya-opacity, 0.45);
          }
          88% {
            opacity: var(--diya-opacity, 0.45);
          }
          100% {
            transform: translate3d(calc(var(--diya-sway, 16px) * -0.6), -12vh, 0) scale(var(--diya-scale, 0.7));
            opacity: 0;
          }
        }
        @keyframes cursorSparkBurst {
          0% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.95;
          }
          100% {
            transform: translate(calc(-50% + var(--spark-dx, 0px)), calc(-50% + var(--spark-dy, -12px))) scale(0.15);
            opacity: 0;
          }
        }
        .floating-diya-item {
          animation-name: floatDiyaUpward;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .floating-diya-item {
            animation: none !important;
            display: none;
          }
        }
      `}</style>

      {/* Upward Floating Glowing Diya Icons Across Depth Layers */}
      {FLOATING_DIYAS.map((item) => (
        <div
          key={item.id}
          className="floating-diya-item absolute top-0"
          style={
            {
              left: `${item.left}%`,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`,
              '--diya-scale': item.scale,
              '--diya-opacity': item.maxOpacity,
              '--diya-sway': `${item.id % 2 === 0 ? item.swayAmplitude : -item.swayAmplitude}px`,
            } as React.CSSProperties
          }
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute -top-2 w-10 h-10 rounded-full bg-amber-400/35 blur-md" />
            <svg
              width="38"
              height="36"
              viewBox="0 0 60 56"
              className="drop-shadow-[0_0_10px_rgba(251,191,36,0.65)]"
            >
              <path
                d="M30 4 C24 13 23 21 30 28 C37 21 36 13 30 4 Z"
                fill="#F97316"
              />
              <path
                d="M30 8 C26 15 25 20 30 26 C35 20 34 15 30 8 Z"
                fill="#FACC15"
              />
              <path
                d="M30 13 C28 17 28 21 30 25 C32 21 32 17 30 13 Z"
                fill="#FFFBEB"
              />
              <ellipse cx="30" cy="30" rx="18" ry="4.5" fill="#F59E0B" />
              <path
                d="M10 30 C10 46 21 51 30 51 C39 51 50 46 50 30 Q30 36 10 30 Z"
                fill="#B45309"
                stroke="#FDE047"
                strokeWidth="1.5"
              />
              <circle cx="30" cy="40" r="2" fill="#FEF08A" />
            </svg>
          </div>
        </div>
      ))}

      {/* Cursor-Following Golden Light Aura */}
      {pointerPos && (
        <div
          style={{
            transform: `translate3d(${pointerPos.x - 64}px, ${pointerPos.y - 64}px, 0)`,
          }}
          className="fixed top-0 left-0 w-32 h-32 rounded-full bg-amber-400/15 blur-2xl pointer-events-none transition-transform duration-75"
        />
      )}

      {/* Cursor & Touch Firecracker Particle Sparks */}
      {cursorSparks.map((spark) => (
        <div
          key={spark.id}
          style={
            {
              left: spark.x,
              top: spark.y,
              backgroundColor: spark.color,
              '--spark-dx': `${spark.dx}px`,
              '--spark-dy': `${spark.dy}px`,
              animation: 'cursorSparkBurst 620ms ease-out forwards',
            } as React.CSSProperties
          }
          className="fixed w-2 h-2 rounded-full shadow-[0_0_10px_#FACC15] pointer-events-none"
        />
      ))}
    </div>
  );
}
