'use client';

import { useEffect, useState, useRef } from 'react';

export default function YouTubePlayerIframe() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [currentVideo, setCurrentVideo] = useState('tD2Mb2njhZ4');
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

    // Auto-show player after 10 seconds
    const timer = setTimeout(() => {
      setShowPlayer(true);
      // Try to unmute after autoplay starts
      setTimeout(() => {
        tryUnmute();
      }, 2000);
    }, 10000);

    // Switch to second video after 20 seconds total (10s wait + 10s play)
    const songSwitchTimer = setTimeout(() => {
      setCurrentVideo('IoqPQ44mSvk');
      setIsMuted(false); // Try unmuted for second video
    }, 20000);

    return () => {
      clearTimeout(timer);
      clearTimeout(songSwitchTimer);
      clearInterval(countdownInterval);
    };
  }, []);

  const tryUnmute = () => {
    // Attempt to unmute by reloading iframe with unmuted params
    setIsMuted(false);
    if (iframeRef.current) {
      const unmutedUrl = `https://www.youtube.com/embed/${currentVideo}?autoplay=1&mute=0&controls=1&loop=1&playlist=${currentVideo}&enablejsapi=1&origin=${window.location.origin}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&start=0&allow=autoplay`;
      iframeRef.current.src = unmutedUrl;
    }
  };

  // YouTube iframe URL with conditional muting
  const getVideoUrl = () => {
    const muteParam = isMuted ? '1' : '0';
    return `https://www.youtube.com/embed/${currentVideo}?autoplay=1&mute=${muteParam}&controls=1&loop=1&playlist=${currentVideo}&enablejsapi=1&origin=${window.location.origin}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&start=0&allow=autoplay`;
  };

  const handleManualPlay = () => {
    setShowPlayer(true);
    setIsMuted(false);
  };

  if (!showPlayer) {
    return (
      <div 
        className="flex flex-col items-center justify-center h-full cursor-pointer"
        onClick={handleManualPlay}
      >
        <div className="text-8xl font-bold mb-8">음악 준비 중...</div>
        <div className="text-5xl text-gray-600 mb-8">{countdown}초 후 자동 재생됩니다</div>
        <button 
          className="px-12 py-6 bg-black text-white text-3xl font-bold rounded-xl hover:bg-gray-800 transition-colors"
        >
          지금 재생하기 (소리 켜짐)
        </button>
        <div className="mt-8 text-xl text-gray-500">
          자동 재생 시 음소거 후 자동으로 소리가 켜집니다
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mb-8">
        <h3 className="text-5xl font-bold text-center mb-4">배경 음악</h3>
        <p className="text-2xl text-gray-600 text-center">
          {currentVideo === 'tD2Mb2njhZ4' ? '첫 번째 곡' : '두 번째 곡'} 재생 중
        </p>
        <p className="text-xl text-gray-500 text-center mt-2">
          {isMuted ? '🔇 잠시 후 소리가 켜집니다...' : '🔊 소리 켜짐'}
        </p>
      </div>
      <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-black">
        <iframe
          ref={iframeRef}
          key={currentVideo} // Force reload when video changes
          width="1066"
          height="600"
          src={getVideoUrl()}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <div className="mt-6 space-y-2">
        <div className="text-xl text-gray-600">
          {currentVideo === 'tD2Mb2njhZ4' 
            ? '10초 후 다음 곡으로 자동 전환됩니다' 
            : '현재 두 번째 곡이 재생 중입니다'}
        </div>
        <button
          onClick={tryUnmute}
          className="px-6 py-3 bg-black text-white text-xl font-bold rounded-lg hover:bg-gray-800 transition-colors"
        >
          🔊 소리 켜기
        </button>
      </div>
    </div>
  );
}