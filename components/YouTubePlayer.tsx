'use client';

import { useEffect, useState, useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

export default function YouTubePlayer() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  const [hasInteracted, setHasInteracted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Show player after 10 seconds
    const timer = setTimeout(() => {
      setShowPlayer(true);
      // Try to trigger autoplay through user gesture simulation
      document.body.click();
    }, 10000);

    // Add click listener to unmute after first interaction
    const handleFirstClick = () => {
      setHasInteracted(true);
      if (player) {
        player.unMute();
        player.setVolume(50);
        setIsMuted(false);
      }
    };

    document.addEventListener('click', handleFirstClick);
    document.addEventListener('scroll', handleFirstClick);
    document.addEventListener('keydown', handleFirstClick);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
      document.removeEventListener('click', handleFirstClick);
      document.removeEventListener('scroll', handleFirstClick);
      document.removeEventListener('keydown', handleFirstClick);
    };
  }, [player]);

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
    
    // Multiple autoplay attempts
    setTimeout(() => {
      event.target.playVideo();
    }, 100);
    
    setTimeout(() => {
      event.target.mute();
      event.target.playVideo();
    }, 500);
    
    // Try unmuted play after a delay
    setTimeout(() => {
      if (hasInteracted) {
        event.target.unMute();
        event.target.setVolume(50);
      }
    }, 2000);
  };

  const onPlayerStateChange: YouTubeProps['onStateChange'] = (event) => {
    // If video ends, replay
    if (event.data === 0) {
      event.target.playVideo();
    }
    // If video is cued, play it
    if (event.data === 5) {
      setTimeout(() => {
        event.target.playVideo();
      }, 1000);
    }
  };

  const onPlayerError: YouTubeProps['onError'] = (event) => {
    console.log('YouTube Player Error:', event.data);
    // Try to recover from error
    setTimeout(() => {
      if (player) {
        player.playVideo();
      }
    }, 2000);
  };

  const opts: YouTubeProps['opts'] = {
    height: '600',
    width: '1066',
    playerVars: {
      autoplay: 1,
      mute: 1, // Start muted for better autoplay success
      controls: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      loop: 1,
      playlist: 'tD2Mb2njhZ4', // Required for loop
      origin: window.location.origin,
      enablejsapi: 1,
      playsinline: 1, // Better mobile support
      start: 0,
      fs: 1, // Allow fullscreen
      cc_load_policy: 0, // Hide captions
      iv_load_policy: 3, // Hide annotations
      disablekb: 0, // Allow keyboard controls
    },
  };

  const handleManualPlay = () => {
    if (player) {
      player.playVideo();
      if (hasInteracted && isMuted) {
        player.unMute();
        player.setVolume(50);
        setIsMuted(false);
      }
    }
  };

  if (!showPlayer) {
    return (
      <div 
        className="flex flex-col items-center justify-center h-full cursor-pointer"
        onClick={() => {
          setShowPlayer(true);
          setHasInteracted(true);
        }}
      >
        <div className="text-8xl font-bold mb-8">음악 준비 중...</div>
        <div className="text-5xl text-gray-600 mb-8">{countdown}초 후 자동 재생됩니다</div>
        <button 
          className="px-12 py-6 bg-black text-white text-3xl font-bold rounded-xl hover:bg-gray-800 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setShowPlayer(true);
            setHasInteracted(true);
          }}
        >
          지금 재생하기
        </button>
        <div className="mt-8 text-xl text-gray-500">
          (클릭하면 즉시 재생됩니다)
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center h-full">
      <div className="mb-8">
        <h3 className="text-5xl font-bold text-center mb-4">배경 음악</h3>
        <p className="text-2xl text-gray-600 text-center">
          {isMuted ? '🔇 음소거 상태 (화면을 클릭하여 소리를 켜세요)' : '🔊 재생 중'}
        </p>
      </div>
      <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-black">
        <YouTube
          videoId="tD2Mb2njhZ4"
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
          onError={onPlayerError}
          className="youtube-player"
        />
      </div>
      {!hasInteracted && (
        <button
          onClick={handleManualPlay}
          className="mt-8 px-8 py-4 bg-black text-white text-2xl font-bold rounded-lg hover:bg-gray-800 transition-colors"
        >
          ▶️ 재생하기
        </button>
      )}
      {isMuted && hasInteracted && (
        <div className="mt-6 text-2xl text-gray-600 animate-pulse">
          화면을 클릭하여 소리를 켜세요
        </div>
      )}
    </div>
  );
}