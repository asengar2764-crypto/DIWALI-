import React, { useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function MarigoldToranHeader() {
  const scallops = [0, 1, 2, 3, 4, 5];

  return (
    <div className="pointer-events-none fixed top-0 left-0 right-0 z-30 overflow-hidden select-none" aria-hidden="true">
      {/* Top golden fairy string lights bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600 shadow-[0_0_18px_rgba(251,191,36,0.85)]" />

      {/* Marigold Flower Garland (Toran / Bandhanwar) */}
      <div className="relative w-full flex justify-between items-start">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-20 md:h-24 drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)]"
        >
          <defs>
            <radialGradient id="marigoldOrange" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF099" />
              <stop offset="45%" stopColor="#FF9E00" />
              <stop offset="100%" stopColor="#D9480F" />
            </radialGradient>
            <radialGradient id="marigoldGold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="55%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#CA8A04" />
            </radialGradient>
            <linearGradient id="mangoLeaf" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#15803D" />
              <stop offset="100%" stopColor="#14532D" />
            </linearGradient>
          </defs>

          {/* Mango leaves along top beam */}
          {Array.from({ length: 36 }).map((_, idx) => {
            const x = idx * 40 + 20;
            return (
              <path
                key={`leaf-${idx}`}
                d={`M ${x - 8} 0 Q ${x} 28 ${x} 34 Q ${x} 28 ${x + 8} 0 Z`}
                fill="url(#mangoLeaf)"
                stroke="#F59E0B"
                strokeWidth="0.6"
                opacity="0.9"
              />
            );
          })}

          {/* 6 Draped Marigold Garland Scallops */}
          {scallops.map((s) => {
            const startX = s * 240;
            const midX = startX + 120;
            const endX = startX + 240;
            const flowers = [0, 0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88, 1];

            return (
              <g key={`scallop-${s}`}>
                {/* Golden thread */}
                <path
                  d={`M ${startX} 6 Q ${midX} 92 ${endX} 6`}
                  fill="none"
                  stroke="#FDE047"
                  strokeWidth="2.5"
                />
                {/* Marigold blossoms along the curve */}
                {flowers.map((t, fIdx) => {
                  const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
                  const y = (1 - t) * (1 - t) * 6 + 2 * (1 - t) * t * 92 + t * t * 6;
                  const isGold = (s + fIdx) % 2 === 0;
                  return (
                    <g key={`flower-${s}-${fIdx}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r="11"
                        fill={isGold ? 'url(#marigoldGold)' : 'url(#marigoldOrange)'}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill="none"
                        stroke={isGold ? '#FEF08A' : '#FDBA74'}
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    </g>
                  );
                })}

                {/* Hanging tassel and brass bell at scallop junction */}
                <line
                  x1={endX}
                  y1={6}
                  x2={endX}
                  y2={78}
                  stroke="#FACC15"
                  strokeWidth="2"
                />
                <circle cx={endX} cy={32} r="8" fill="url(#marigoldOrange)" />
                <circle cx={endX} cy={50} r="7" fill="url(#marigoldGold)" />
                <path
                  d={`M ${endX - 7} 78 L ${endX + 7} 78 L ${endX + 4} 66 L ${endX - 4} 66 Z`}
                  fill="#FBBF24"
                />
                <circle cx={endX} cy={82} r="3.5" fill="#FEF08A" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hanging Ornate Brass & Silk Lanterns (Left & Right) */}
      <div className="hidden sm:block fixed top-2 left-6 lg:left-14 animate-lantern">
        <HangingLantern color="crimson" />
      </div>
      <div className="hidden md:block fixed top-2 left-28 lg:left-40 animate-lantern-delayed scale-75 origin-top">
        <HangingLantern color="gold" />
      </div>
      <div className="hidden sm:block fixed top-2 right-6 lg:right-14 animate-lantern-delayed">
        <HangingLantern color="crimson" />
      </div>
      <div className="hidden md:block fixed top-2 right-28 lg:right-40 animate-lantern scale-75 origin-top">
        <HangingLantern color="gold" />
      </div>
    </div>
  );
}

function HangingLantern({ color = 'crimson' }: { color?: 'crimson' | 'gold' }) {
  const mainFill = color === 'crimson' ? '#991B1B' : '#B45309';
  const glowColor = color === 'crimson' ? 'rgba(251, 146, 60, 0.55)' : 'rgba(253, 224, 71, 0.6)';

  return (
    <div className="relative flex flex-col items-center">
      {/* Radial lantern glow */}
      <div
        className="absolute top-16 w-28 h-28 rounded-full blur-2xl animate-halo pointer-events-none"
        style={{ background: glowColor }}
      />
      <svg width="72" height="175" viewBox="0 0 72 175" className="overflow-visible">
        <line x1="36" y1="0" x2="36" y2="38" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 2" />
        <path d="M22 44 Q36 30 50 44 Z" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1" />
        <polygon
          points="22,44 50,44 62,74 50,108 22,108 10,74"
          fill={mainFill}
          stroke="#FBBF24"
          strokeWidth="2"
        />
        <polygon
          points="27,50 45,50 53,74 45,100 27,100 19,74"
          fill="#FEF08A"
          opacity="0.92"
        />
        <line x1="36" y1="44" x2="36" y2="108" stroke="#B45309" strokeWidth="1.5" />
        <line x1="15" y1="74" x2="57" y2="74" stroke="#B45309" strokeWidth="1.5" />
        <path d="M22 108 L50 108 L44 118 L28 118 Z" fill="#D97706" stroke="#FEF08A" strokeWidth="1" />
        <line x1="28" y1="118" x2="24" y2="156" stroke="#F59E0B" strokeWidth="1.8" />
        <line x1="36" y1="118" x2="36" y2="166" stroke="#FACC15" strokeWidth="2.2" />
        <line x1="44" y1="118" x2="48" y2="156" stroke="#F59E0B" strokeWidth="1.8" />
        <circle cx="24" cy="158" r="2.5" fill="#FEF08A" />
        <circle cx="36" cy="168" r="3" fill="#FEF08A" />
        <circle cx="48" cy="158" r="2.5" fill="#FEF08A" />
      </svg>
    </div>
  );
}

interface GlowingDiyaProps {
  size?: 'sm' | 'md' | 'lg';
  isLit?: boolean;
  onClick?: () => void;
  label?: string;
  flameIndex?: number;
  showSparklesWhenLit?: boolean;
}

const DIYA_SPARK_OFFSETS = [
  { cx: 36, cy: 18, r: 1.8, delay: '0s', dur: '1.8s' },
  { cx: 84, cy: 20, r: 1.6, delay: '0.4s', dur: '2.1s' },
  { cx: 45, cy: 8, r: 1.4, delay: '0.8s', dur: '1.6s' },
  { cx: 75, cy: 10, r: 1.7, delay: '0.25s', dur: '2.3s' },
  { cx: 28, cy: 34, r: 1.5, delay: '0.6s', dur: '1.9s' },
  { cx: 92, cy: 32, r: 1.5, delay: '1.1s', dur: '2.0s' },
];

export function GlowingDiya({
  size = 'md',
  isLit = true,
  onClick,
  label,
  flameIndex = 0,
  showSparklesWhenLit = true,
}: GlowingDiyaProps) {
  const uid = useId();
  const dimensions =
    size === 'lg'
      ? 'w-24 h-24 sm:w-32 sm:h-32'
      : size === 'md'
      ? 'w-20 h-20 sm:w-24 sm:h-24'
      : 'w-14 h-14';

  // Separate flame animation duration & delay for each diya so they never move in mechanical lockstep
  const flameDuration = `${2.1 + (flameIndex % 4) * 0.32}s`;
  const flameDelay = `-${(flameIndex % 5) * 0.45}s`;

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-pressed={onClick ? isLit : undefined}
      aria-label={
        label
          ? `${label} (${isLit ? 'Lit' : 'Tap to light diya'})`
          : onClick
          ? isLit
            ? 'Lit Diya lamp'
            : 'Unlit Diya lamp — tap to light'
          : undefined
      }
      className={`group relative flex flex-col items-center justify-center select-none ${
        onClick
          ? 'min-w-[80px] min-h-[80px] cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400 rounded-2xl p-1.5 transition-transform duration-200 hover:scale-105 active:scale-95 touch-manipulation'
          : ''
      }`}
    >
      {/* Warm Radiant Halo Behind Lit Diya */}
      <AnimatePresence>
        {isLit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute -top-3 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-400/45 blur-xl animate-halo pointer-events-none"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <svg
        viewBox="0 0 120 110"
        className={`${dimensions} overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]`}
      >
        <defs>
          <radialGradient id={`flameOuter-${uid}`} cx="50%" cy="65%" r="55%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="45%" stopColor="#FACC15" />
            <stop offset="80%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`clayBowl-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="45%" stopColor="#9A3412" />
            <stop offset="100%" stopColor="#431407" />
          </linearGradient>
          <linearGradient id={`goldRim-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="50%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>

        {/* Cotton wick */}
        <path
          d="M60 54 Q60 44 60 38"
          stroke={isLit ? '#F59E0B' : '#78350F'}
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Animated Wick Ignition & Multi-layered Flickering Flame */}
        <AnimatePresence>
          {isLit ? (
            <motion.g
              key="lit-flame"
              initial={{ opacity: 0, scale: 0.15, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.2, y: 12 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: '60px 44px' }}
            >
              <g
                className="animate-flame"
                style={{
                  animationDuration: flameDuration,
                  animationDelay: flameDelay,
                }}
              >
                {/* Outer warm aura */}
                <ellipse
                  cx="60"
                  cy="24"
                  rx="20"
                  ry="26"
                  fill={`url(#flameOuter-${uid})`}
                  opacity="0.75"
                />
                {/* Main golden-orange teardrop flame */}
                <path
                  d="M60 3 C48 19 45 32 60 44 C75 32 72 19 60 3 Z"
                  fill="#F97316"
                />
                <path
                  d="M60 8 C51 21 49 31 60 42 C71 31 69 21 60 8 Z"
                  fill="#FACC15"
                />
                {/* White-hot inner core */}
                <path
                  d="M60 17 C55 26 55 33 60 40 C65 33 65 26 60 17 Z"
                  fill="#FFFBEB"
                />
              </g>

              {/* Tiny Sparkling Particles Around the Lit Diya */}
              {showSparklesWhenLit &&
                DIYA_SPARK_OFFSETS.map((sp, idx) => (
                  <circle
                    key={idx}
                    cx={sp.cx}
                    cy={sp.cy}
                    r={sp.r}
                    fill="#FEF08A"
                    className="animate-sparkle"
                    style={{
                      animationDelay: sp.delay,
                      animationDuration: sp.dur,
                    }}
                  />
                ))}
            </motion.g>
          ) : (
            <g key="unlit-wick" className="opacity-70 group-hover:opacity-100 transition-opacity">
              {/* Subtle ember tip on unlit wick inviting a tap */}
              <circle
                cx="60"
                cy="37"
                r="3.2"
                fill="#F59E0B"
                className="group-hover:fill-yellow-300 transition-colors"
              />
              <circle
                cx="60"
                cy="37"
                r="7"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.55"
              />
            </g>
          )}
        </AnimatePresence>

        {/* Glowing oil surface inside bowl */}
        <ellipse
          cx="60"
          cy="56"
          rx="36"
          ry="9"
          fill={isLit ? '#F59E0B' : '#2E1005'}
          stroke={`url(#goldRim-${uid})`}
          strokeWidth="2.5"
        />

        {/* Terracotta & Brass ornate Diya Bowl */}
        <path
          d="M18 56 C18 88 42 98 60 98 C78 98 102 88 102 56 Q60 68 18 56 Z"
          fill={`url(#clayBowl-${uid})`}
          stroke={`url(#goldRim-${uid})`}
          strokeWidth="2"
        />

        {/* Decorative golden floral motifs on the Diya body */}
        <path
          d="M32 69 Q60 80 88 69"
          fill="none"
          stroke="#FDE047"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="60" cy="80" r="4" fill="#FACC15" />
        <circle cx="44" cy="77" r="2.5" fill="#FDE047" />
        <circle cx="76" cy="77" r="2.5" fill="#FDE047" />

        {/* Base pedestal */}
        <ellipse cx="60" cy="98" rx="22" ry="4.5" fill={`url(#goldRim-${uid})`} />
      </svg>

      {label && (
        <span
          className={`mt-1.5 text-xs font-semibold tracking-wide whitespace-nowrap transition-colors ${
            isLit ? 'text-amber-200' : 'text-amber-200/60 group-hover:text-amber-200'
          }`}
        >
          {label}
        </span>
      )}
    </Wrapper>
  );
}

export function RangoliMandala({ className = '' }: { className?: string }) {
  const petals = Array.from({ length: 12 });
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className={`select-none pointer-events-none ${className}`}
    >
      <defs>
        <radialGradient id="rangoliGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FACC15" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#F97316" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#9333EA" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="url(#rangoliGrad)" />
      <circle cx="200" cy="200" r="175" fill="none" stroke="#FBBF24" strokeWidth="1" strokeDasharray="6 6" opacity="0.5" />
      <circle cx="200" cy="200" r="140" fill="none" stroke="#FB923C" strokeWidth="1.5" opacity="0.45" />
      <circle cx="200" cy="200" r="95" fill="none" stroke="#FDE047" strokeWidth="1.2" opacity="0.55" />

      {petals.map((_, idx) => {
        const angle = idx * 30;
        return (
          <g key={idx} transform={`rotate(${angle} 200 200)`}>
            <path
              d="M200 25 C222 70 222 115 200 160 C178 115 178 70 200 25 Z"
              fill="none"
              stroke="#FACC15"
              strokeWidth="1.4"
              opacity="0.5"
            />
            <path
              d="M200 65 C212 95 212 125 200 155 C188 125 188 95 200 65 Z"
              fill="#F97316"
              fillOpacity="0.14"
              stroke="#FB923C"
              strokeWidth="1"
              opacity="0.6"
            />
            <circle cx="200" cy="42" r="3.5" fill="#FDE047" opacity="0.7" />
          </g>
        );
      })}
      <circle cx="200" cy="200" r="28" fill="#F59E0B" fillOpacity="0.2" stroke="#FEF08A" strokeWidth="2" />
    </svg>
  );
}
