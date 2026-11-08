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
}

export function FloatingDiyasBackground() {
  const [cursorSparks, setCursorSparks] = useState<CursorSpark[]>([]);

  useEffect(() => {
    let lastSpawn = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastSpawn < 55) return;
      lastSpawn = now;
      const sparkId = now + Math.random();
      setCursorSparks((prev) => [
        ...prev.slice(-14),
        { id: sparkId, x: e.clientX, y: e.clientY },
      ]);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
        @keyframes cursorSparkFade {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -10px) scale(0.2);
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
            {/* Soft warm golden aura */}
            <div className="absolute -top-2 w-10 h-10 rounded-full bg-amber-400/35 blur-md" />
            <svg
              width="38"
              height="36"
              viewBox="0 0 60 56"
              className="drop-shadow-[0_0_10px_rgba(251,191,36,0.65)]"
            >
              {/* Flame outer & core */}
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
              {/* Glowing diya bowl */}
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

      {/* Subtle Festive Golden Cursor Sparkle Trail */}
      {cursorSparks.map((spark) => (
        <div
          key={spark.id}
          style={{
            left: spark.x,
            top: spark.y,
            animation: 'cursorSparkFade 650ms ease-out forwards',
          }}
          className="fixed w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_10px_#FACC15] pointer-events-none"
        />
      ))}
    </div>
  );
}
