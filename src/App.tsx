/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Flame,
  Copy,
  Check,
  Heart,
  Gift,
  MessageCircle,
  RotateCcw,
  UserPlus,
} from 'lucide-react';
import { FireworksCanvas, FireworksHandle } from './components/FireworksCanvas';
import { FloatingDiyasBackground } from './components/FloatingDiyasBackground';
import {
  GoldenConfettiRain,
  GoldenConfettiHandle,
} from './components/GoldenConfettiRain';
import {
  YouTubeBackgroundAudio,
  YouTubeAudioHandle,
} from './components/YouTubeBackgroundAudio';
import {
  MarigoldToranHeader,
  GlowingDiya,
  RangoliMandala,
} from './components/FestiveDecorations';

interface DiyaBlessing {
  id: string;
  label: string;
  hindi: string;
  wish: string;
  isLit: boolean;
}

const INITIAL_DIYAS: DiyaBlessing[] = [
  {
    id: 'happiness',
    label: 'Endless Happiness',
    hindi: 'अनंत खुशी',
    wish: 'May every corner of your home radiate warmth, laughter, and joyful moments.',
    isLit: true,
  },
  {
    id: 'prosperity',
    label: 'Prosperity',
    hindi: 'समृद्धि',
    wish: 'May Goddess Lakshmi bless your household with abundance and golden fortune.',
    isLit: true,
  },
  {
    id: 'health',
    label: 'Good Health',
    hindi: 'उत्तम स्वास्थ्य',
    wish: 'May the sacred light of Deepavali renew your vitality, strength, and well-being.',
    isLit: true,
  },
  {
    id: 'success',
    label: 'Success',
    hindi: 'सफलता',
    wish: 'May Lord Ganesha remove every obstacle and guide your endeavors to triumph.',
    isLit: true,
  },
  {
    id: 'peace',
    label: 'Inner Peace',
    hindi: 'शांति',
    wish: 'May serenity and harmony illuminate your mind like a steady golden flame.',
    isLit: true,
  },
  {
    id: 'wisdom',
    label: 'Wisdom',
    hindi: 'ज्ञान',
    wish: 'Tamaso Ma Jyotirgamaya — May wisdom lead us from darkness into eternal light.',
    isLit: false,
  },
  {
    id: 'togetherness',
    label: 'Togetherness',
    hindi: 'प्रेम और एकता',
    wish: 'May bonds of family and friendship grow sweeter than festive mithai.',
    isLit: false,
  },
];

const HERITAGE_SHOWCASE = [
  {
    id: 'palace-diyas',
    title: '01. Deepotsav — The Row of Sacred Lamps',
    subtitle: 'Earthen Diyas · Symbol of Inner Illumination',
    description:
      'Rows of hand-molded terracotta diyas filled with ghee and cotton wicks line courtyards and balconies, signifying the victory of light over darkness and knowledge over ignorance.',
    image: '/src/assets/images/diwali_palace_diyas_1794120655058.jpg',
    aspect: 'col-span-1 lg:col-span-2',
  },
  {
    id: 'rangoli-art',
    title: '02. Aangan Rangoli & Marigold Petals',
    subtitle: 'Sacred Geometry · Welcoming Auspiciousness',
    description:
      'Intricate lotus mandalas crafted at the threshold with vibrant kumkum, turmeric, and fresh marigold blossoms invite Goddess Lakshmi and warm guests into the home.',
    image: '/src/assets/images/festive_rangoli_art_1794120655956.jpg',
    aspect: 'col-span-1',
  },
  {
    id: 'mithai-feast',
    title: '03. Festive Mithai & Shared Sweetness',
    subtitle: 'Kaju Katli & Saffron Ladoo · Culinary Heritage',
    description:
      'Silver-leafed Kaju Katli and warm saffron Motichoor Ladoos served on hammered brass platters celebrate generosity, gratitude, and the sweetness of new beginnings.',
    image: '/src/assets/images/diwali_mithai_feast_1794120656646.jpg',
    aspect: 'col-span-1 lg:col-span-3',
  },
];

const DEFAULT_BLESSING =
  'May this Diwali bring endless happiness, prosperity, good health and success into your life and family.';

const EXAMPLE_NAMES = ['Rahul', 'Priya', 'Amit', 'Ananya', 'Sharma Family'];

/**
 * Safely validates and sanitizes a name string to prevent HTML/script injection
 * while preserving international characters, spaces, and punctuation like '&' or '-'.
 */
function sanitizePersonName(raw: string | null | undefined): string {
  if (!raw) return '';
  return raw
    .replace(/[<>"'`\\/{}[\]()%;]/g, '') // Strip HTML/script injection characters
    .replace(/[\u0000-\u001F\u007F]/g, '') // Strip control characters
    .replace(/\s+/g, ' ')
    .slice(0, 48);
}

const SPARKLE_PARTICLES = [
  { top: '-14%', left: '8%', delay: '0s', size: 14 },
  { top: '-22%', left: '32%', delay: '0.4s', size: 18 },
  { top: '-16%', left: '68%', delay: '0.8s', size: 15 },
  { top: '-10%', left: '92%', delay: '1.1s', size: 16 },
  { top: '85%', left: '14%', delay: '0.6s', size: 14 },
  { top: '92%', left: '52%', delay: '1.3s', size: 17 },
  { top: '82%', left: '86%', delay: '0.25s', size: 15 },
];

export default function App() {
  const [hasCelebrated, setHasCelebrated] = useState(false);
  // Three welcome screen diyas start with their flames turned OFF
  const [welcomeDiyas, setWelcomeDiyas] = useState<[boolean, boolean, boolean]>([
    false,
    false,
    false,
  ]);
  const [diyas, setDiyas] = useState<DiyaBlessing[]>(INITIAL_DIYAS);
  const [activeBlessing, setActiveBlessing] = useState<DiyaBlessing>(INITIAL_DIYAS[0]);

  // Active recipient & sender displayed in the greeting experience
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');

  // Form inputs in the "Personalize Your Greeting" studio
  const [draftRecipient, setDraftRecipient] = useState('');
  const [draftSender, setDraftSender] = useState('');
  const [validationError, setValidationError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGreetingGenerated, setIsGreetingGenerated] = useState(false);
  const [fireworkBurstCount, setFireworkBurstCount] = useState(12);

  const fireworksRef = useRef<FireworksHandle | null>(null);
  const confettiRef = useRef<GoldenConfettiHandle | null>(null);
  const audioRef = useRef<YouTubeAudioHandle | null>(null);
  const personalizeInputRef = useRef<HTMLInputElement | null>(null);
  const diyaAudioCtxRef = useRef<AudioContext | null>(null);

  // Soft diya-lighting sound effect (warm wick ignition + gentle golden chime)
  const playDiyaIgnitionSound = (diyaIndex: number) => {
    try {
      if (!diyaAudioCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        diyaAudioCtxRef.current = new AudioCtx();
      }
      const ctx = diyaAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // 1. Soft cotton-wick flame ignition whoosh
      const bufferSize = Math.floor(ctx.sampleRate * 0.16);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const env = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env * 0.35;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(620, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
      filter.Q.setValueAtTime(1.8, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // 2. Warm auspicious harmonic bell tone (ascending per diya)
      const frequencies = [528, 660, 792];
      const freq = frequencies[diyaIndex % frequencies.length];
      const osc = ctx.createOscillator();
      const toneGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.005, now + 0.55);

      toneGain.gain.setValueAtTime(0.001, now);
      toneGain.gain.linearRampToValueAtTime(0.075, now + 0.025);
      toneGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.65);

      osc.connect(toneGain);
      toneGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.66);
    } catch {
      // Ignore audio errors if blocked by browser policy
    }
  };

  const handleLightWelcomeDiya = (index: number) => {
    setWelcomeDiyas((prev) => {
      const next: [boolean, boolean, boolean] = [...prev] as [boolean, boolean, boolean];
      next[index] = true;
      const newlyAllLit = next.every(Boolean) && !prev.every(Boolean);
      if (newlyAllLit) {
        setTimeout(() => {
          fireworksRef.current?.launchSalvo(6);
          confettiRef.current?.triggerConfetti(90);
        }, 120);
      } else {
        fireworksRef.current?.launchSalvo(2);
      }
      return next;
    });
    playDiyaIgnitionSound(index);
  };

  // 1. Automatically read and sanitize the recipient's name from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawTo = params.get('to') || params.get('name');
    const rawFrom = params.get('from');

    const cleanTo = sanitizePersonName(rawTo).trim();
    const cleanFrom = sanitizePersonName(rawFrom).trim();

    if (cleanTo) {
      setRecipientName(cleanTo);
      setDraftRecipient(cleanTo);
      setIsGreetingGenerated(true);
    }
    if (cleanFrom) {
      setSenderName(cleanFrom);
      setDraftSender(cleanFrom);
    }
  }, []);

  const cleanActiveRecipient = useMemo(
    () => sanitizePersonName(recipientName).trim(),
    [recipientName]
  );

  const cleanDraftRecipient = useMemo(
    () => sanitizePersonName(draftRecipient).trim(),
    [draftRecipient]
  );

  const cleanDraftSender = useMemo(
    () => sanitizePersonName(draftSender).trim(),
    [draftSender]
  );

  // Build unique shareable URL with proper URL encoding
  const shareableUrl = useMemo(() => {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const targetName = cleanDraftRecipient || cleanActiveRecipient;
    const targetSender = cleanDraftSender || sanitizePersonName(senderName).trim();

    if (!targetName && !targetSender) {
      return baseUrl;
    }
    const params = new URLSearchParams();
    if (targetName) params.set('to', targetName);
    if (targetSender) params.set('from', targetSender);
    return `${baseUrl}?${params.toString()}`;
  }, [cleanDraftRecipient, cleanActiveRecipient, cleanDraftSender, senderName]);

  // Build WhatsApp Share URL containing the festive greeting message + personalized link
  const whatsappShareHref = useMemo(() => {
    const targetName = cleanDraftRecipient || cleanActiveRecipient;
    const targetSender = cleanDraftSender || sanitizePersonName(senderName).trim();

    const greetingHeader = targetName
      ? `🪔✨ *Happy Diwali, ${targetName}!* 🎆`
      : `🪔✨ *Happy Diwali! शुभ दीपावली!* 🎆`;

    const greetingBody = targetName
      ? `Dear ${targetName}, may this Diwali fill your life with happiness, prosperity and endless success!`
      : DEFAULT_BLESSING;

    const senderSignoff = targetSender ? `\n\nWarmest wishes from *${targetSender}* 🙏` : '';

    const fullMessage = `${greetingHeader}\n\n${greetingBody}${senderSignoff}\n\n✨ Open your special Diwali celebration with fireworks & music here:\n${shareableUrl}`;

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`;
  }, [cleanDraftRecipient, cleanActiveRecipient, cleanDraftSender, senderName, shareableUrl]);

  const handleStartCelebration = () => {
    setWelcomeDiyas([true, true, true]);
    setHasCelebrated(true);
    audioRef.current?.playCelebrationAudio();
    setTimeout(() => {
      fireworksRef.current?.launchSalvo(12);
    }, 150);
  };

  const handleLaunchFireworks = () => {
    fireworksRef.current?.launchSalvo(8);
    setFireworkBurstCount((prev) => prev + 8);
  };

  const handleSkyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('textarea')
    ) {
      return;
    }
    fireworksRef.current?.launchAt(e.clientX, e.clientY);
    setFireworkBurstCount((prev) => prev + 1);
  };

  const handleToggleDiya = (id: string) => {
    setDiyas((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextLit = !d.isLit;
          if (nextLit) {
            fireworksRef.current?.launchSalvo(4);
            setFireworkBurstCount((c) => c + 4);
          }
          const updated = { ...d, isLit: nextLit };
          setActiveBlessing(updated);
          return updated;
        }
        return d;
      })
    );
  };

  const handleLightAllDiyas = () => {
    setDiyas((prev) => prev.map((d) => ({ ...d, isLit: true })));
    fireworksRef.current?.launchSalvo(9);
    setFireworkBurstCount((c) => c + 9);
  };

  const handleGeneratePersonalGreeting = (e: React.FormEvent) => {
    e.preventDefault();
    const validRecipient = sanitizePersonName(draftRecipient).trim();
    const validSender = sanitizePersonName(draftSender).trim();

    if (!validRecipient) {
      setValidationError("Please enter the recipient's name (e.g., Rahul, Priya, Amit).");
      personalizeInputRef.current?.focus();
      return;
    }

    setValidationError('');
    setRecipientName(validRecipient);
    setSenderName(validSender);
    setDraftRecipient(validRecipient);
    setDraftSender(validSender);
    setIsGreetingGenerated(true);

    // Update browser URL with encoded recipient parameter
    const url = new URL(window.location.href);
    url.searchParams.set('to', validRecipient);
    if (validSender) {
      url.searchParams.set('from', validSender);
    } else {
      url.searchParams.delete('from');
    }
    window.history.replaceState({}, '', url.toString());

    // Launch celebratory fireworks & golden confetti rain for the personalized name reveal
    fireworksRef.current?.launchSalvo(9);
    confettiRef.current?.triggerConfetti(150);
    setFireworkBurstCount((c) => c + 9);
  };

  const handleCopyShareLink = () => {
    const validRecipient = sanitizePersonName(draftRecipient).trim();
    if (validRecipient && validRecipient !== recipientName) {
      setRecipientName(validRecipient);
      setIsGreetingGenerated(true);
    }
    navigator.clipboard?.writeText(shareableUrl).catch(() => {});
    setCopiedLink(true);
    fireworksRef.current?.launchSalvo(6);
    confettiRef.current?.triggerConfetti(140);
    setFireworkBurstCount((c) => c + 6);
    setTimeout(() => setCopiedLink(false), 3500);
  };

  const handleCreateAnotherGreeting = () => {
    setDraftRecipient('');
    setDraftSender('');
    setRecipientName('');
    setSenderName('');
    setValidationError('');
    setIsGreetingGenerated(false);
    setCopiedLink(false);

    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.replaceState({}, '', baseUrl);
    setTimeout(() => {
      personalizeInputRef.current?.focus();
    }, 50);
  };

  const litDiyasCount = diyas.filter((d) => d.isLit).length;
  const allWelcomeDiyasLit = welcomeDiyas.every(Boolean);
  const litWelcomeCount = welcomeDiyas.filter(Boolean).length;

  // Dynamic personalized message vs general message
  const heroBlessingMessage = cleanActiveRecipient
    ? `Dear ${cleanActiveRecipient}, may this Diwali fill your life with happiness, prosperity and endless success!`
    : DEFAULT_BLESSING;

  return (
    <div
      onClick={handleSkyClick}
      className="relative min-h-screen w-full bg-gradient-to-b from-[#160419] via-[#2B071E] to-[#130312] text-[#FFF8EB] overflow-x-hidden selection:bg-amber-400/30"
    >
      {/* Ambient Royal Maroon, Purple & Golden Radial Backdrops */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 50% 18%, rgba(245, 158, 11, 0.16) 0%, rgba(147, 51, 234, 0.12) 38%, rgba(20, 4, 20, 0.95) 85%)',
        }}
      />

      {/* Golden Ornamental Frame Border Around Viewport */}
      <div
        className="pointer-events-none fixed inset-2 sm:inset-3 z-20 rounded-2xl border border-amber-400/20 shadow-[inset_0_0_40px_rgba(251,191,36,0.08)]"
        aria-hidden="true"
      />

      {/* Upward Floating Glowing Diya Icons & Subtle Cursor Sparkles */}
      <FloatingDiyasBackground />

      {/* Continuous & Interactive Fireworks Canvas (Runs Independently of Audio) */}
      <FireworksCanvas
        ref={fireworksRef}
        intensity={hasCelebrated ? 'celebration' : 'welcome'}
        soundEnabled={false}
      />

      {/* Festive Golden Confetti Rain Overlay */}
      <GoldenConfettiRain ref={confettiRef} />

      {/* Audio-Only YouTube Background Music & Custom Non-Interactive Music Indicator */}
      <YouTubeBackgroundAudio
        ref={audioRef}
        isCelebrationActive={hasCelebrated}
      />

      {/* Traditional Marigold Flower Garlands & Hanging Lanterns */}
      <MarigoldToranHeader />

      {/* =====================================================================
          1. DIWALI WELCOME SCREEN & INTERACTIVE DIYA LIGHTING EXPERIENCE
         ===================================================================== */}
      <AnimatePresence>
        {!hasCelebrated && (
          <motion.div
            key="welcome-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 pt-20 pb-8 bg-gradient-to-b from-[#17041A]/95 via-[#2D081F]/95 to-[#120210]/98 backdrop-blur-md overflow-y-auto"
          >
            {/* Subtle Light-Spreading Radial Illumination Across the Welcome Screen */}
            <motion.div
              aria-hidden="true"
              animate={{
                opacity: allWelcomeDiyasLit
                  ? 0.95
                  : litWelcomeCount === 2
                  ? 0.55
                  : litWelcomeCount === 1
                  ? 0.3
                  : 0.08,
                scale: allWelcomeDiyasLit ? 1.35 : 0.8 + litWelcomeCount * 0.15,
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="pointer-events-none fixed inset-0 flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle at 50% 52%, rgba(251, 191, 36, 0.28) 0%, rgba(249, 115, 22, 0.14) 36%, rgba(23, 4, 26, 0) 72%)',
              }}
            />

            {/* Rotating Sacred Rangoli Mandala Behind Welcome Card */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
              <RangoliMandala className="w-[480px] h-[480px] sm:w-[660px] sm:h-[660px] animate-rangoli-spin opacity-65" />
            </div>

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.6 }}
              className={`relative z-10 w-full max-w-2xl mx-auto text-center rounded-[32px] p-6 sm:p-10 md:p-11 bg-[#220518]/90 border transition-all duration-700 backdrop-blur-xl ${
                allWelcomeDiyasLit
                  ? 'border-amber-300/75 shadow-[0_0_90px_rgba(251,191,36,0.38),0_28px_80px_rgba(0,0,0,0.85)]'
                  : 'border-amber-400/35 shadow-[0_28px_80px_rgba(0,0,0,0.85)]'
              }`}
            >
              {/* Heading: FESTIVAL OF LIGHTS • DEEPAVALI MAHOTSAV */}
              <div className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-amber-300/90 mb-2.5">
                FESTIVAL OF LIGHTS • DEEPAVALI MAHOTSAV
              </div>

              {/* Hindi Auspicious Header */}
              <p className="font-hindi text-2xl sm:text-3xl text-amber-300 drop-shadow-[0_2px_12px_rgba(251,191,36,0.5)] mb-2">
                ॥ शुभ दीपावली ॥
              </p>

              {/* Main Golden HAPPY DIWALI / Personalized Heading */}
              <h1
                className="font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-400 drop-shadow-[0_4px_26px_rgba(251,191,36,0.48)] mb-3"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.65rem)', textWrap: 'balance' }}
              >
                {cleanActiveRecipient
                  ? `HAPPY DIWALI, ${cleanActiveRecipient.toUpperCase()}!`
                  : 'HAPPY DIWALI'}
              </h1>

              {/* Festive Description */}
              <p className="text-sm sm:text-base text-amber-100/90 max-w-lg mx-auto leading-relaxed mb-6">
                {cleanActiveRecipient
                  ? `Dear ${cleanActiveRecipient}, may this Diwali fill your life with happiness, prosperity and endless success! Tap the sacred clay diyas below to light them.`
                  : 'Step into a luminous celebration of glowing clay diyas, sky-filling fireworks, marigold garlands, and heartfelt blessings for you and your family.'}
              </p>

              {/* Interactive Three Traditional Diyas in the Centre (Initially OFF) */}
              <div className="relative py-3 mb-5">
                {/* Golden Glowing Aura Around All Three Lit Diyas */}
                <AnimatePresence>
                  {allWelcomeDiyasLit && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.65, ease: 'easeOut' }}
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-8 -inset-y-2 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-300/35 to-amber-500/20 blur-2xl"
                    />
                  )}
                </AnimatePresence>

                <div className="relative z-10 flex items-end justify-center gap-5 sm:gap-10">
                  <GlowingDiya
                    size="sm"
                    flameIndex={0}
                    isLit={welcomeDiyas[0]}
                    onClick={() => handleLightWelcomeDiya(0)}
                    label={welcomeDiyas[0] ? 'Lit' : 'Tap to Light'}
                  />
                  <GlowingDiya
                    size="md"
                    flameIndex={1}
                    isLit={welcomeDiyas[1]}
                    onClick={() => handleLightWelcomeDiya(1)}
                    label={welcomeDiyas[1] ? 'Lit' : 'Tap to Light'}
                  />
                  <GlowingDiya
                    size="sm"
                    flameIndex={2}
                    isLit={welcomeDiyas[2]}
                    onClick={() => handleLightWelcomeDiya(2)}
                    label={welcomeDiyas[2] ? 'Lit' : 'Tap to Light'}
                  />
                </div>

                {/* Status / All-Three-Diyas-Lit Celebration Message */}
                <div className="mt-3 min-h-[28px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {allWelcomeDiyasLit ? (
                      <motion.p
                        key="all-lit-msg"
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.4 }}
                        className="text-sm sm:text-base font-bold text-amber-200 drop-shadow-[0_0_14px_rgba(251,191,36,0.65)]"
                      >
                        You have lit the lamps of happiness! 🪔
                      </motion.p>
                    ) : (
                      <motion.p
                        key="prompt-msg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs sm:text-sm text-amber-200/75"
                      >
                        Tap each clay diya above to personally light the lamps ({litWelcomeCount}/3 lit)
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Prominent Golden Button Labelled "✨ Celebrate Diwali" */}
              <div className="flex flex-col items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleStartCelebration}
                  className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base sm:text-lg font-bold text-[#1B0515] bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 shadow-[0_0_35px_rgba(251,191,36,0.65)] hover:shadow-[0_0_50px_rgba(251,191,36,0.9)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <span>✨ Celebrate Diwali</span>
                </button>
                <span className="text-xs text-amber-200/60">
                  Launches fireworks, festive background melody &amp; interactive diya blessings
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          2. TOP NAVIGATION BAR (Strict 3-Zone Contract)
         ===================================================================== */}
      <header className="relative z-40 max-w-7xl mx-auto pt-16 sm:pt-20 px-4 sm:px-8">
        <div className="flex items-center justify-between gap-8 px-5 py-3.5 rounded-2xl bg-[#1E0516]/80 border border-amber-400/25 backdrop-blur-md">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#greeting"
            className="font-display text-base sm:text-lg font-bold tracking-tight text-amber-200 whitespace-nowrap shrink-0"
          >
            Shubh Deepavali
          </a>

          {/* Zone 2: 4 concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-amber-100/80">
            <a
              href="#greeting"
              className="hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Greeting
            </a>
            <a
              href="#personalize"
              className="hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Personalize
            </a>
            <a
              href="#diya-altar"
              className="hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Light Diyas
            </a>
            <a
              href="#heritage"
              className="hover:text-amber-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Traditions
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleLaunchFireworks}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#1A0515] bg-gradient-to-r from-amber-300 to-orange-400 rounded-xl hover:brightness-110 transition-all shadow-[0_0_18px_rgba(251,191,36,0.4)] cursor-pointer whitespace-nowrap shrink-0"
            >
              Launch Fireworks
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          3. MAIN HERO GREETING & SACRED DEEPAVALI SHRINE
         ===================================================================== */}
      <main className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-20 space-y-24">
        <section
          id="greeting"
          className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
        >
          {/* Decorative Background Rangoli Ornament */}
          <div className="pointer-events-none absolute -left-24 top-1/2 -translate-y-1/2 opacity-35 hidden xl:block">
            <RangoliMandala className="w-[460px] h-[460px] animate-rangoli-spin" />
          </div>

          {/* Left Column: Staggered Royal Greeting Typography & Interactive Controls */}
          <motion.div
            initial="hidden"
            animate={hasCelebrated ? 'visible' : 'hidden'}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.14,
                  delayChildren: 0.15,
                },
              },
            }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-300/90 mb-3"
            >
              <span>Auspicious Festival of Lights</span>
              <span aria-hidden="true">·</span>
              <span>
                {cleanActiveRecipient
                  ? `Happy Diwali, ${cleanActiveRecipient}! 🪔`
                  : 'Vikram Samvat 2083'}
              </span>
            </motion.div>

            {/* Main Headline with Animated Sparkling Particles for Personalized Name */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="relative inline-block"
            >
              {/* Sparkling Golden Particles Orbiting the Personalized Greeting */}
              {cleanActiveRecipient && (
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  {SPARKLE_PARTICLES.map((sp, idx) => (
                    <span
                      key={idx}
                      style={{
                        top: sp.top,
                        left: sp.left,
                        animationDelay: sp.delay,
                      }}
                      className="absolute animate-sparkle text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.95)]"
                    >
                      <Sparkles style={{ width: sp.size, height: sp.size }} />
                    </span>
                  ))}
                </div>
              )}

              <h1
                className="font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-400 drop-shadow-[0_4px_32px_rgba(251,191,36,0.55)]"
                style={{ fontSize: 'clamp(2.25rem, 4.8vw, 4.1rem)', textWrap: 'balance' }}
              >
                {cleanActiveRecipient ? (
                  <>
                    HAPPY DIWALI,{' '}
                    <span className="text-yellow-200 underline decoration-amber-400/50 decoration-wavy underline-offset-8">
                      {cleanActiveRecipient.toUpperCase()}
                    </span>
                    ! 🎆
                  </>
                ) : (
                  'HAPPY DIWALI!'
                )}
              </h1>
            </motion.div>

            {/* Required Greeting 2: शुभ दीपावली */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="font-hindi text-3xl sm:text-4xl md:text-5xl text-amber-300 mt-3 mb-6 drop-shadow-[0_2px_16px_rgba(249,115,22,0.5)]"
            >
              शुभ दीपावली
            </motion.p>

            {/* Required Greeting 3: Personalized or General Blessing Prose */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="relative rounded-2xl p-6 sm:p-7 bg-[#24061B]/85 border border-amber-400/35 shadow-[0_16px_40px_rgba(0,0,0,0.55)] max-w-2xl mb-8"
            >
              {cleanActiveRecipient && (
                <p className="text-sm sm:text-base font-bold text-amber-300 mb-2">
                  Happy Diwali, {cleanActiveRecipient}! 🪔
                </p>
              )}
              <p className="text-base sm:text-lg md:text-xl text-amber-50/95 leading-relaxed font-medium">
                &ldquo;{heroBlessingMessage}&rdquo;
              </p>
              {cleanActiveRecipient && (
                <p className="mt-3 text-sm sm:text-base text-amber-100/80">
                  {DEFAULT_BLESSING}
                </p>
              )}
              {senderName && (
                <p className="mt-4 text-sm sm:text-base font-semibold text-amber-300">
                  With warm festive regards, {sanitizePersonName(senderName)}
                </p>
              )}
            </motion.div>

            {/* Interactive Festive Action Bar */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5"
            >
              <a
                href="#personalize"
                onClick={() => {
                  setTimeout(() => personalizeInputRef.current?.focus(), 300);
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold text-[#1A0515] bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 shadow-[0_0_28px_rgba(251,191,36,0.5)] hover:brightness-110 transition-transform duration-150 hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
              >
                <Gift className="w-4 h-4 shrink-0" />
                <span>Personalize Your Greeting</span>
              </a>

              <button
                type="button"
                onClick={handleLaunchFireworks}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-amber-100 bg-[#2D0820] hover:bg-[#3B0B2A] border border-amber-400/35 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Ignite Sky Fireworks</span>
              </button>

              <button
                type="button"
                onClick={handleLightAllDiyas}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/25 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Flame className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Illuminate All Diyas</span>
              </button>
            </motion.div>

            {/* Quiet Unboxed Festive Metadata Counter */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-amber-200/70 tabular-nums"
            >
              <span>{litDiyasCount} of {diyas.length} Sacred Diyas Lit</span>
              <span aria-hidden="true">·</span>
              <span>{fireworkBurstCount} Sky Firework Bursts</span>
              <span aria-hidden="true">·</span>
              <span>Click anywhere on the night sky to launch a firework</span>
            </motion.div>
          </motion.div>

          {/* Right Column: Ornate Royal Deepavali Rangoli & Diya Shrine */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px] rounded-[28px] p-5 sm:p-6 bg-gradient-to-b from-[#3A0C22]/90 via-[#260718]/95 to-[#190412]/95 border border-amber-400/40 shadow-[0_24px_60px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between text-xs font-medium text-amber-200/90 pb-4 px-1">
                <span>Sacred Deepavali Mandala</span>
                <span aria-hidden="true">·</span>
                <span className="font-hindi text-amber-300">तमसो मा ज्योतिर्गमय</span>
              </div>

              <div className="relative aspect-square w-full rounded-[20px] overflow-hidden bg-[#12020E] border border-amber-300/30">
                <img
                  src="/src/assets/images/festive_rangoli_art_1794120655956.jpg"
                  alt="Intricate Indian Rangoli design with marigold petals and glowing brass diya"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#12020E]/85 via-transparent to-[#12020E]/30"
                  aria-hidden="true"
                />
                <div className="absolute bottom-4 inset-x-4 text-center">
                  <p className="font-hindi text-lg text-amber-200 drop-shadow">
                    ॥ दीपज्योतिः परब्रह्म दीपज्योतिर्जनार्दनः ॥
                  </p>
                  <p className="text-xs text-amber-100/80 mt-0.5">
                    The sacred flame represents supreme light, knowledge, and auspiciousness
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 px-2">
                <GlowingDiya size="sm" isLit={true} />
                <button
                  type="button"
                  onClick={handleLaunchFireworks}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-xs font-semibold text-amber-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Celebrate with Fireworks</span>
                </button>
                <GlowingDiya size="sm" isLit={true} />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            4. PERSONALIZE YOUR GREETING & WHATSAPP / LINK SHARING STUDIO
           ===================================================================== */}
        <section
          id="personalize"
          className="rounded-[32px] p-6 sm:p-10 md:p-12 bg-gradient-to-br from-[#2B081F]/90 via-[#210518]/95 to-[#160312]/95 border border-amber-400/35 shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Sender Input Form & Share Controls */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-amber-300/85 mb-2">
                  <span>Personalize Your Greeting</span>
                  <span aria-hidden="true">·</span>
                  <span>Instant Shareable Celebration URL</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-amber-100">
                  Personalize Your Greeting
                </h2>
                <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed mt-1.5">
                  Enter the recipient&rsquo;s name below to generate a personalized Diwali greeting link with glowing golden typography, sparkling fireworks, and one-click WhatsApp sharing.
                </p>
              </div>

              <form onSubmit={handleGeneratePersonalGreeting} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="recipient-input"
                      className="block text-xs font-semibold text-amber-200 mb-1.5"
                    >
                      Recipient&rsquo;s Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      ref={personalizeInputRef}
                      id="recipient-input"
                      type="text"
                      maxLength={48}
                      value={draftRecipient}
                      onChange={(e) => {
                        const clean = sanitizePersonName(e.target.value);
                        setDraftRecipient(clean);
                        if (validationError) setValidationError('');
                      }}
                      placeholder="e.g. Rahul, Priya, Amit"
                      className="w-full px-4 py-3 rounded-xl bg-[#150311] border border-amber-400/35 text-sm sm:text-base text-amber-50 placeholder:text-amber-200/35 focus:outline-none focus:border-amber-300"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sender-input"
                      className="block text-xs font-semibold text-amber-200 mb-1.5"
                    >
                      Your Name (Optional)
                    </label>
                    <input
                      id="sender-input"
                      type="text"
                      maxLength={48}
                      value={draftSender}
                      onChange={(e) => setDraftSender(sanitizePersonName(e.target.value))}
                      placeholder="e.g. Aarav & Family"
                      className="w-full px-4 py-3 rounded-xl bg-[#150311] border border-amber-400/35 text-sm sm:text-base text-amber-50 placeholder:text-amber-200/35 focus:outline-none focus:border-amber-300"
                    />
                  </div>
                </div>

                {/* Quick Example Name Buttons */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-amber-200/75">
                  <span>Try an example:</span>
                  {EXAMPLE_NAMES.map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => {
                        setDraftRecipient(sample);
                        setRecipientName(sample);
                        setIsGreetingGenerated(true);
                        setValidationError('');
                        const url = new URL(window.location.href);
                        url.searchParams.set('to', sample);
                        window.history.replaceState({}, '', url.toString());
                        fireworksRef.current?.launchSalvo(6);
                        confettiRef.current?.triggerConfetti(130);
                        setFireworkBurstCount((c) => c + 6);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 border border-amber-400/25 text-amber-200 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {sample}
                    </button>
                  ))}
                </div>

                {validationError && (
                  <p role="alert" className="text-xs font-medium text-rose-300">
                    {validationError}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-[#1A0515] bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 hover:brightness-110 shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Preview &amp; Generate Greeting URL</span>
                  </button>

                  {(isGreetingGenerated || cleanActiveRecipient || draftRecipient) && (
                    <button
                      type="button"
                      onClick={handleCreateAnotherGreeting}
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/25 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <UserPlus className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>Create Another Greeting</span>
                    </button>
                  )}
                </div>
              </form>

              {/* Generated Shareable Link & WhatsApp / Copy Link Controls */}
              <div className="rounded-2xl p-4 sm:p-5 bg-[#150311]/90 border border-amber-400/30 space-y-3.5">
                <div className="flex items-center justify-between gap-2 text-xs text-amber-300/90">
                  <span className="font-semibold">Unique Shareable Greeting URL</span>
                  <span>Supports WhatsApp, mobile &amp; desktop</span>
                </div>

                <div className="px-3.5 py-2.5 rounded-xl bg-[#0D010A] border border-amber-400/20 text-xs sm:text-sm font-mono text-amber-200 break-all select-all">
                  {shareableUrl}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* WhatsApp Sharing Button */}
                  <a
                    href={whatsappShareHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (cleanDraftRecipient && cleanDraftRecipient !== recipientName) {
                        setRecipientName(cleanDraftRecipient);
                        setIsGreetingGenerated(true);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#15803D] hover:bg-[#166534] border border-emerald-400/30 shadow-[0_0_20px_rgba(22,163,74,0.35)] transition-all whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Share on WhatsApp</span>
                  </a>

                  {/* Copy Link Button */}
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#1A0515] bg-gradient-to-r from-amber-300 to-orange-400 hover:brightness-110 transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 shrink-0" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 shrink-0" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  {cleanActiveRecipient && (
                    <button
                      type="button"
                      onClick={handleCreateAnotherGreeting}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-amber-200/80 hover:text-amber-100 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/20 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                      <span>Create Another Greeting</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Live Receiver Greeting Card Preview */}
            <div className="lg:col-span-6">
              <div className="relative rounded-[28px] p-6 sm:p-9 bg-gradient-to-b from-[#350923] via-[#220518] to-[#170311] border border-amber-300/45 text-center space-y-4 shadow-[0_24px_60px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="text-xs font-medium text-amber-300/85 tracking-wide">
                  Live Receiver Screen Preview
                </div>

                <p className="font-hindi text-2xl sm:text-3xl text-amber-300">
                  ॥ शुभ दीपावली ॥
                </p>

                {/* Animated Glowing Recipient Name Preview */}
                <div className="relative py-2">
                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-400 drop-shadow-[0_4px_24px_rgba(251,191,36,0.5)]">
                    {cleanDraftRecipient || cleanActiveRecipient
                      ? `HAPPY DIWALI, ${(
                          cleanDraftRecipient || cleanActiveRecipient
                        ).toUpperCase()}! 🎆`
                      : 'HAPPY DIWALI! 🎆'}
                  </h3>

                  <p className="text-base sm:text-lg font-semibold text-amber-200 mt-2">
                    {cleanDraftRecipient || cleanActiveRecipient
                      ? `Happy Diwali, ${cleanDraftRecipient || cleanActiveRecipient}! 🪔`
                      : 'Happy Diwali! 🪔'}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-amber-50/95 leading-relaxed max-w-md mx-auto font-medium">
                  &ldquo;
                  {cleanDraftRecipient || cleanActiveRecipient
                    ? `Dear ${
                        cleanDraftRecipient || cleanActiveRecipient
                      }, may this Diwali fill your life with happiness, prosperity and endless success!`
                    : DEFAULT_BLESSING}
                  &rdquo;
                </p>

                {(cleanDraftSender || senderName) && (
                  <p className="text-xs sm:text-sm font-semibold text-amber-300 pt-1">
                    Warmest Wishes from {cleanDraftSender || sanitizePersonName(senderName)}
                  </p>
                )}

                <div className="flex items-center justify-center gap-6 pt-3">
                  <GlowingDiya size="sm" isLit={true} />
                  <GlowingDiya size="sm" isLit={true} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            5. INTERACTIVE DIYA ALTAR ("Light the Seven Diyas of Blessing")
           ===================================================================== */}
        <section
          id="diya-altar"
          className="relative rounded-[32px] p-6 sm:p-10 md:p-12 bg-gradient-to-b from-[#26071C]/90 to-[#190413]/90 border border-amber-400/30 shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-amber-300/85 mb-2">
                <span>Interactive Deepdaan Ritual</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{litDiyasCount}/{diyas.length} Diyas Glowing</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-amber-100">
                Light a Diya of Blessing
              </h2>
              <p className="text-sm sm:text-base text-amber-100/75 mt-1 max-w-2xl">
                Click any clay lamp below to light or relight its golden flame, reveal a sacred Diwali blessing, and send a burst of celebratory fireworks into the night sky.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLightAllDiyas}
              className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#1A0515] bg-gradient-to-r from-amber-300 to-orange-400 hover:brightness-110 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Flame className="w-4 h-4 shrink-0" />
              <span>Light All 7 Diyas</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 items-center justify-items-center py-4">
            {diyas.map((diya) => (
              <div
                key={diya.id}
                className={`flex flex-col items-center p-3 rounded-2xl transition-colors w-full ${
                  activeBlessing.id === diya.id
                    ? 'bg-amber-500/15 border border-amber-400/40'
                    : 'hover:bg-amber-500/5 border border-transparent'
                }`}
              >
                <GlowingDiya
                  size="md"
                  isLit={diya.isLit}
                  label={diya.label}
                  onClick={() => handleToggleDiya(diya.id)}
                />
                <span className="font-hindi text-xs text-amber-300/80 mt-0.5">
                  {diya.hindi}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-amber-400/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-amber-300 mb-1">
                <span>Selected Blessing: {activeBlessing.label}</span>
                <span aria-hidden="true">·</span>
                <span className="font-hindi">{activeBlessing.hindi}</span>
              </div>
              <p className="text-base sm:text-lg font-medium text-amber-50">
                &ldquo;{activeBlessing.wish}&rdquo;
              </p>
            </div>
            <span className="text-xs text-amber-200/60 whitespace-nowrap shrink-0">
              Tap any lamp to toggle its flame
            </span>
          </div>
        </section>

        {/* =====================================================================
            6. PREMIUM DIWALI DECORATIONS & HERITAGE GALLERY (Bento Layout)
           ===================================================================== */}
        <section id="heritage" className="space-y-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300/85 mb-2">
              <span>Timeless Indian Festivities</span>
              <span aria-hidden="true">·</span>
              <span>Light, Art &amp; Hospitality</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-amber-100">
              The Royal Tapestry of Deepavali
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {HERITAGE_SHOWCASE.map((item) => (
              <article
                key={item.id}
                className={`${item.aspect} group relative rounded-[24px] overflow-hidden bg-[#220619] border border-amber-400/25 flex flex-col justify-end min-h-[320px] sm:min-h-[360px]`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#3B0A26] via-[#240518] to-[#12020D]" />
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#12020E] via-[#12020E]/65 to-transparent"
                  aria-hidden="true"
                />

                <div className="relative z-10 p-6 sm:p-8 max-w-2xl">
                  <div className="text-xs font-medium text-amber-300 mb-1.5">
                    {item.subtitle}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-amber-50 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-amber-100/85 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* =====================================================================
          7. QUIET FESTIVE FOOTER
         ===================================================================== */}
      <footer className="relative z-20 border-t border-amber-400/20 bg-[#11020F]/90 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-200/65">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-amber-200">Shubh Deepavali</span>
            <span aria-hidden="true">·</span>
            <span>Festival of Lights Celebration</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Crafted with festive warmth</span>
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Wishing peace &amp; prosperity to all</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
