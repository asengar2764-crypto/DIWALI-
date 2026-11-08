import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Sparkles, Music } from 'lucide-react';

export interface YouTubeAudioHandle {
  playCelebrationAudio: () => void;
}

interface YouTubeBackgroundAudioProps {
  isCelebrationActive: boolean;
}

interface YTPlayer {
  playVideo: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getPlayerState: () => number;
  isMuted: () => boolean;
  destroy: () => void;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId: string;
          width?: string | number;
          height?: string | number;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: YTPlayerEvent) => void;
            onStateChange?: (event: YTPlayerEvent) => void;
            onError?: (event: YTPlayerEvent) => void;
          };
        }
      ) => YTPlayer;
      PlayerState?: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YOUTUBE_VIDEO_ID = 'AHaoS1uB34s';

export type AudioPlaybackStatus =
  | 'idle'
  | 'connecting'
  | 'playing'
  | 'autoplay_blocked'
  | 'error';

export const YouTubeBackgroundAudio = forwardRef<
  YouTubeAudioHandle,
  YouTubeBackgroundAudioProps
>(({ isCelebrationActive }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const isReadyRef = useRef(false);
  const wantPlayRef = useRef(isCelebrationActive);
  const [status, setStatus] = useState<AudioPlaybackStatus>('idle');

  useEffect(() => {
    wantPlayRef.current = isCelebrationActive;
  }, [isCelebrationActive]);

  const attemptUnmutedPlay = () => {
    const player = playerRef.current;
    if (!player || !isReadyRef.current) {
      setStatus('connecting');
      return;
    }

    try {
      setStatus('connecting');
      player.unMute();
      player.setVolume(100);
      player.playVideo();

      // Verify after a short window whether the browser allowed playback
      window.setTimeout(() => {
        if (!playerRef.current) return;
        try {
          const currentState = playerRef.current.getPlayerState?.();
          // 1 = PLAYING, 3 = BUFFERING
          if (currentState === 1) {
            setStatus('playing');
          } else if (currentState !== 3 && wantPlayRef.current) {
            setStatus('autoplay_blocked');
          }
        } catch {
          // Ignore transient state inspection errors
        }
      }, 1200);
    } catch {
      setStatus('autoplay_blocked');
    }
  };

  useImperativeHandle(ref, () => ({
    playCelebrationAudio: () => {
      wantPlayRef.current = true;
      attemptUnmutedPlay();
    },
  }));

  useEffect(() => {
    let isMounted = true;

    const initPlayer = () => {
      if (!isMounted || !containerRef.current || !window.YT?.Player) return;
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: YOUTUBE_VIDEO_ID,
        width: 1,
        height: 1,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (!isMounted) return;
            isReadyRef.current = true;
            event.target.unMute();
            event.target.setVolume(100);
            if (wantPlayRef.current) {
              attemptUnmutedPlay();
            }
          },
          onStateChange: (event) => {
            if (!isMounted) return;
            // YT.PlayerState: ENDED = 0, PLAYING = 1, PAUSED = 2, BUFFERING = 3
            if (event.data === 1) {
              try {
                event.target.unMute();
                event.target.setVolume(100);
              } catch {
                // ignore
              }
              setStatus('playing');
            } else if (event.data === 0) {
              // Loop seamlessly if ended
              try {
                event.target.seekTo(0, true);
                event.target.playVideo();
              } catch {
                // ignore
              }
            } else if (event.data === 2 && wantPlayRef.current) {
              // If paused unexpectedly by browser policy before playing, offer one-time Enter Celebration trigger
              setStatus('autoplay_blocked');
            } else if (event.data === 3 && wantPlayRef.current) {
              setStatus('connecting');
            }
          },
          onError: () => {
            if (!isMounted) return;
            setStatus('error');
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        tag.onerror = () => {
          if (isMounted) setStatus('error');
        };
        document.head.appendChild(tag);
      }
    }

    return () => {
      isMounted = false;
      try {
        playerRef.current?.destroy?.();
        playerRef.current = null;
      } catch {
        // ignore cleanup error
      }
    };
  }, []);

  useEffect(() => {
    if (isCelebrationActive && isReadyRef.current && status !== 'playing') {
      attemptUnmutedPlay();
    }
  }, [isCelebrationActive]);

  return (
    <>
      {/* Visually Hidden Official YouTube IFrame API Player (functional for audio-only playback) */}
      <div
        aria-hidden="true"
        className="fixed -left-[9999px] -top-[9999px] w-px h-px opacity-0 pointer-events-none overflow-hidden"
      >
        <div ref={containerRef} />
      </div>

      {/* Custom Non-Interactive Music Indicator & One-Time Autoplay Fallback */}
      {isCelebrationActive && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center">
          <style>{`
            @keyframes soundBarWave {
              0%, 100% { transform: scaleY(0.3); }
              50% { transform: scaleY(1); }
            }
            .music-bar-1 { animation: soundBarWave 0.85s ease-in-out infinite 0s; }
            .music-bar-2 { animation: soundBarWave 0.7s ease-in-out infinite 0.18s; }
            .music-bar-3 { animation: soundBarWave 0.95s ease-in-out infinite 0.32s; }
            .music-bar-4 { animation: soundBarWave 0.78s ease-in-out infinite 0.12s; }
          `}</style>

          {/* 1. Accurate Playing Indicator ( strictly non-interactive: no pause, stop, mute, or volume controls ) */}
          {status === 'playing' && (
            <div
              role="status"
              aria-live="polite"
              className="pointer-events-none select-none flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#1F0517]/90 border border-amber-400/40 shadow-[0_12px_32px_rgba(0,0,0,0.75)] backdrop-blur-md"
            >
              <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-amber-400/15 border border-amber-300/30">
                <Music className="w-3.5 h-3.5 text-amber-300" />
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-semibold text-amber-200 tracking-wide whitespace-nowrap">
                  Diwali Festive Melody
                </span>
                <span className="text-[11px] text-amber-300/75 whitespace-nowrap">
                  Celebration Audio Playing
                </span>
              </div>

              {/* Animated Golden Soundwave Bars */}
              <div className="flex items-end gap-0.5 h-4 px-1" aria-hidden="true">
                <span className="w-0.5 h-full bg-amber-300 rounded-full origin-bottom music-bar-1" />
                <span className="w-0.5 h-full bg-yellow-400 rounded-full origin-bottom music-bar-2" />
                <span className="w-0.5 h-full bg-orange-400 rounded-full origin-bottom music-bar-3" />
                <span className="w-0.5 h-full bg-amber-300 rounded-full origin-bottom music-bar-4" />
              </div>
            </div>
          )}

          {/* 2. One-Time "Enter Celebration" Interaction if Browser Blocked Autoplay */}
          {status === 'autoplay_blocked' && (
            <button
              type="button"
              onClick={() => attemptUnmutedPlay()}
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-[#1B0515] bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 shadow-[0_0_28px_rgba(251,191,36,0.65)] hover:brightness-110 transition-transform duration-150 hover:scale-105 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Enter Celebration</span>
            </button>
          )}
        </div>
      )}
    </>
  );
});

YouTubeBackgroundAudio.displayName = 'YouTubeBackgroundAudio';
