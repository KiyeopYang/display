'use client';

import { useEffect, useState, useRef } from 'react';

export default function YouTubeAutoPlayer() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [shouldPlay, setShouldPlay] = useState(false); // Control when to play
  const [isLunchTime, setIsLunchTime] = useState(false); // Track if it's lunch time
  const [lastVideoChange, setLastVideoChange] = useState<Date>(new Date());
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Your custom YouTube playlist
  const videos = [
    { id: 'H94ntp93SGY', title: 'Music 1' },
    { id: '-ELJY33k7R4', title: 'Music 2' },
    { id: 'CJLaUNA5A8o', title: 'Music 3' },
    { id: '2siEux_Oa6c', title: 'Music 4' },
    { id: 'AvEbh9DNUQ4', title: 'Music 5' },
    { id: 'al3QxxwYYFA', title: 'Music 6' },
    { id: 'tD2Mb2njhZ4', title: 'Music 7' },
    { id: 'FG0_oweynv0', title: 'Music 8' },
    { id: 'kyqpSycLASY', title: 'Music 9' },
    { id: 'yf5NOyy1SXU', title: 'Music 10' },
    { id: 'fTb6yJ7AlT8', title: 'Music 11' },
    { id: 'nGXiDgK58jc', title: 'Music 12' },
    { id: '_Pt8HLmiLwM', title: 'Music 13' },
    { id: 'va1xVzvOlD0', title: 'Music 14' },
    { id: '7MMp9OYPlcE', title: 'Music 15' },
    { id: '75yWVZzFd0Y', title: 'Music 16' },
    { id: 'EV7vbaeBLkA', title: 'Music 17' },
    { id: 'C4AlZEXNbF4', title: 'Music 18' },
    { id: 'g7c0W-8rNmw', title: 'Music 19' },
    { id: 'XsrzXWLipRQ', title: 'Music 20' },
    { id: 'tXwvD3f3ruo', title: 'Music 21' },
    { id: 'V9Oc3UAlLa8', title: 'Music 22' },
    { id: 'g5WC1OMD3NE', title: 'Music 23' },
    { id: 'WsfBF4ZnBeY', title: 'Music 24' },
    { id: 'cIGd8gm_pYE', title: 'Music 25' },
    { id: '-SVVXk2Dr8Q', title: 'Music 26' },
    { id: '5JOaTtcg1tE', title: 'Music 27' },
  ];

  // Check if it's lunch time (11:45 AM to 1:00 PM)
  const checkLunchTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    
    // 11:45 AM = 11*60 + 45 = 705 minutes
    // 1:00 PM = 13*60 + 0 = 780 minutes
    const isLunch = timeInMinutes >= 705 && timeInMinutes < 780;
    
    setIsLunchTime(isLunch);
    
    // Auto start at 11:45 AM
    if (isLunch && !shouldPlay && timeInMinutes === 705) {
      setShouldPlay(true);
      // Start playing
      setTimeout(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            '*'
          );
        }
      }, 100);
    }
    
    // Auto stop at 1:00 PM
    if (!isLunch && shouldPlay) {
      setShouldPlay(false);
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          '*'
        );
      }
    }
    
    // Change video every 12 hours
    const hoursSinceLastChange = (now.getTime() - lastVideoChange.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastChange >= 12) {
      setCurrentVideoIndex(prevIndex => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * videos.length);
        } while (newIndex === prevIndex);
        return newIndex;
      });
      setLastVideoChange(now);
    }
  };

  useEffect(() => {
    // Check lunch time immediately
    checkLunchTime();
    
    // Check every minute
    const interval = setInterval(checkLunchTime, 60000);
    
    // Also check every second for more precise timing
    const preciseInterval = setInterval(checkLunchTime, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(preciseInterval);
    };
  }, [shouldPlay, lastVideoChange]);

  const currentVideo = videos[currentVideoIndex];
  
  // Video URL - continuous loop during lunch time
  const videoUrl = `https://www.youtube.com/embed/${currentVideo.id}?` + 
    `autoplay=${shouldPlay ? 1 : 0}&` + // Autoplay when it's lunch time
    `mute=0&` + // Never mute
    `controls=0&` +
    `loop=1&` + // Loop the video
    `playlist=${currentVideo.id}&` + // Required for loop
    `enablejsapi=1&` + // Enable JS API for control
    `playsinline=1&` +
    `rel=0&` +
    `modestbranding=1&` +
    `showinfo=0&` +
    `iv_load_policy=3&` +
    `cc_load_policy=0&` +
    `fs=0&` +
    `disablekb=1&` +
    `origin=${window.location.origin}&` +
    `widget_referrer=${window.location.href}`;

  // Calculate time until lunch
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMinutes = hours * 60 + minutes;
  
  let minutesUntilLunch = 0;
  if (currentMinutes < 705) {
    // Before lunch
    minutesUntilLunch = 705 - currentMinutes;
  } else if (currentMinutes >= 780) {
    // After lunch, calculate for tomorrow
    minutesUntilLunch = (24 * 60) - currentMinutes + 705;
  }
  
  const hoursUntilLunch = Math.floor(minutesUntilLunch / 60);
  const minsUntilLunch = minutesUntilLunch % 60;

  // Show waiting screen when not lunch time
  if (!isLunchTime) {
    return (
      <div style={{ width: '1920px', height: '1080px', position: 'relative', backgroundColor: '#000' }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '72px', marginBottom: '30px' }}>🍱</div>
          <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
            점심시간 음악
          </div>
          <div style={{ fontSize: '32px', opacity: 0.8, marginBottom: '40px' }}>
            11:45 AM - 1:00 PM
          </div>
          {minutesUntilLunch > 0 && (
            <div style={{ fontSize: '24px', opacity: 0.6 }}>
              다음 재생까지: {hoursUntilLunch}시간 {minsUntilLunch}분
            </div>
          )}
          <div style={{ fontSize: '20px', opacity: 0.5, marginTop: '20px' }}>
            현재 시간: {now.toLocaleTimeString('ko-KR')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '1920px', height: '1080px', position: 'relative', backgroundColor: '#000' }}>
      {/* YouTube iframe - always present but controlled */}
      <iframe
        ref={iframeRef}
        key={currentVideoIndex}
        width="1920"
        height="1080"
        src={videoUrl}
        title="YouTube Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1920px',
          height: '1080px',
          border: 0,
          opacity: shouldPlay ? 1 : 0.3 // Dim when not playing
        }}
      />
      
      {/* Small overlay when not playing - positioned at center */}
      {!shouldPlay && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '30px 50px',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'white',
          zIndex: 5
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>⏸</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
            대기 중
          </div>
          <div style={{ fontSize: '24px', opacity: 0.9 }}>
            {nextPlayIn}초 후 재생
          </div>
        </div>
      )}
      
      {/* Info overlay */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '40px',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: '20px 30px',
        borderRadius: '10px',
        zIndex: 10
      }}>
        <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          🎵 {currentVideo.title}
        </div>
        <div style={{ fontSize: '18px', opacity: 0.8 }}>
          {shouldPlay ? '재생 중' : '일시 정지'}
        </div>
      </div>

      {/* Status indicators */}
      <div style={{
        position: 'absolute',
        top: '40px',
        right: '40px',
        color: 'white',
        fontSize: '20px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '15px 25px',
        borderRadius: '8px',
        zIndex: 10
      }}>
        <div>다음 재생: {nextPlayIn}초</div>
        <div>다음 곡: {nextChangeIn}초</div>
        <div style={{ marginTop: '10px', fontSize: '16px', opacity: 0.7 }}>
          주기: 16초마다 재생 | 10초마다 변경
        </div>
      </div>

      {/* Playing indicator */}
      {shouldPlay && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '120px',
          color: 'rgba(255, 255, 255, 0.3)',
          zIndex: 3,
          animation: 'pulse 2s infinite'
        }}>
          ▶️
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}