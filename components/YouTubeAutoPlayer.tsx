'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

// Constants
const LUNCH_START_MINUTES = 11 * 60 + 45; // 11:45 AM
const LUNCH_END_MINUTES = 13 * 60; // 1:00 PM
const COUNTDOWN_SECONDS = 10;
const VIDEO_CHANGE_HOURS = 12;

// YouTube video playlist
const PLAYLIST = [
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

// Helper functions
const getCurrentTimeInMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

const isWithinLunchTime = (timeInMinutes: number) => {
  return timeInMinutes >= LUNCH_START_MINUTES && timeInMinutes < LUNCH_END_MINUTES;
};

const calculateTimeUntilLunch = () => {
  const currentMinutes = getCurrentTimeInMinutes();
  
  if (currentMinutes < LUNCH_START_MINUTES) {
    return LUNCH_START_MINUTES - currentMinutes;
  } else if (currentMinutes >= LUNCH_END_MINUTES) {
    return (24 * 60) - currentMinutes + LUNCH_START_MINUTES;
  }
  return 0;
};

const sendYouTubeCommand = (iframe: HTMLIFrameElement | null, command: string) => {
  if (iframe?.contentWindow) {
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: command, args: '' }),
      '*'
    );
  }
};

// Component styles
const styles = {
  container: {
    width: '1920px',
    height: '1080px',
    position: 'relative' as const,
    backgroundColor: '#000'
  },
  centerOverlay: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as const,
    color: 'white'
  },
  countdownOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: '40px 60px',
    borderRadius: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)'
  },
  pauseOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '30px 50px',
    borderRadius: '20px'
  },
  infoOverlay: {
    position: 'absolute' as const,
    bottom: '40px',
    left: '40px',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: '20px 30px',
    borderRadius: '10px',
    zIndex: 10
  },
  statusOverlay: {
    position: 'absolute' as const,
    top: '40px',
    right: '40px',
    color: 'white',
    fontSize: '20px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: '15px 25px',
    borderRadius: '8px',
    zIndex: 10
  }
};

export default function YouTubeAutoPlayer() {
  // State management
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLunchTime, setIsLunchTime] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [lastVideoChange, setLastVideoChange] = useState(new Date());
  
  // Refs
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasStartedPlayback = useRef(false);

  // Select random video
  const selectRandomVideo = useCallback(() => {
    setCurrentVideoIndex(prev => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * PLAYLIST.length);
      } while (newIndex === prev && PLAYLIST.length > 1);
      return newIndex;
    });
    setLastVideoChange(new Date());
  }, []);

  // Check lunch time and video rotation
  const checkSchedule = useCallback(() => {
    const now = new Date();
    const timeInMinutes = getCurrentTimeInMinutes();
    const isLunch = isWithinLunchTime(timeInMinutes);
    
    console.log(`[YouTube Player] Time: ${now.getHours()}:${now.getMinutes()} - Lunch: ${isLunch}`);
    setIsLunchTime(isLunch);
    
    // Reset playback state when lunch time changes
    if (!isLunch) {
      if (isPlaying) {
        setIsPlaying(false);
        sendYouTubeCommand(iframeRef.current, 'pauseVideo');
      }
      hasStartedPlayback.current = false;
    }
    
    // Rotate video every 12 hours
    const hoursSinceLastChange = (now.getTime() - lastVideoChange.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastChange >= VIDEO_CHANGE_HOURS) {
      selectRandomVideo();
    }
  }, [isPlaying, lastVideoChange, selectRandomVideo]);

  // Initialize and schedule checks
  useEffect(() => {
    checkSchedule();
    const interval = setInterval(checkSchedule, 1000);
    return () => clearInterval(interval);
  }, [checkSchedule]);

  // Handle playback start with countdown
  useEffect(() => {
    if (isLunchTime && !isPlaying && !hasStartedPlayback.current) {
      hasStartedPlayback.current = true;
      setCountdown(COUNTDOWN_SECONDS);
      
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
      
      // Start playback after countdown
      const playTimer = setTimeout(() => {
        console.log('[YouTube Player] Starting playback');
        setIsPlaying(true);
        setCountdown(0);
        
        // Unmute and play
        setTimeout(() => {
          sendYouTubeCommand(iframeRef.current, 'unMute');
          setTimeout(() => {
            sendYouTubeCommand(iframeRef.current, 'playVideo');
          }, 100);
        }, 500);
      }, COUNTDOWN_SECONDS * 1000);
      
      return () => {
        clearTimeout(playTimer);
        clearInterval(countdownInterval);
      };
    }
  }, [isLunchTime, isPlaying]);

  // Current video
  const currentVideo = PLAYLIST[currentVideoIndex];
  
  // YouTube embed URL
  const videoUrl = `https://www.youtube.com/embed/${currentVideo.id}?` + 
    new URLSearchParams({
      autoplay: '0',
      mute: '0',
      controls: '1',
      loop: '1',
      playlist: currentVideo.id,
      enablejsapi: '1',
      playsinline: '1',
      rel: '0',
      modestbranding: '1',
      iv_load_policy: '3',
      cc_load_policy: '0',
      fs: '0',
      disablekb: '0',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
      widget_referrer: typeof window !== 'undefined' ? window.location.href : ''
    }).toString();

  // Calculate time display
  const minutesUntilLunch = calculateTimeUntilLunch();
  const hoursUntilLunch = Math.floor(minutesUntilLunch / 60);
  const minsUntilLunch = minutesUntilLunch % 60;

  // Render player (always loaded)
  return (
    <div style={styles.container}>
      {/* YouTube iframe - always loaded */}
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
          opacity: isPlaying ? 1 : 0.3,
          visibility: isLunchTime ? 'visible' : 'hidden'
        }}
      />

      {/* Waiting screen outside lunch time */}
      {!isLunchTime && (
        <div style={{ ...styles.centerOverlay }}>
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
            현재 시간: {new Date().toLocaleTimeString('ko-KR')}
          </div>
        </div>
      )}
      
      {/* Countdown overlay */}
      {!isPlaying && countdown > 0 && (
        <div style={{ ...styles.centerOverlay, ...styles.countdownOverlay }}>
          <div style={{ fontSize: '72px', marginBottom: '20px', fontWeight: 'bold' }}>
            {countdown}
          </div>
          <div style={{ fontSize: '28px', opacity: 0.9 }}>
            재생 시작까지
          </div>
        </div>
      )}
      
      {/* Pause overlay */}
      {!isPlaying && countdown === 0 && (
        <div style={{ ...styles.centerOverlay, ...styles.pauseOverlay }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>⏸</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
            대기 중
          </div>
          <div style={{ fontSize: '24px', opacity: 0.9 }}>
            잠시 후 재생됩니다
          </div>
        </div>
      )}
      
      {/* Info overlay */}
      <div style={styles.infoOverlay}>
        <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          🎵 {currentVideo.title}
        </div>
        <div style={{ fontSize: '18px', opacity: 0.8 }}>
          {isPlaying ? '재생 중' : '일시 정지'}
        </div>
      </div>

      {/* Status overlay */}
      <div style={styles.statusOverlay}>
        <div>점심시간 음악</div>
        <div style={{ marginTop: '10px', fontSize: '16px', opacity: 0.7 }}>
          11:45 AM - 1:00 PM
        </div>
      </div>

      {/* Playing indicator */}
      {isPlaying && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '120px',
          color: 'rgba(255, 255, 255, 0.3)',
          zIndex: 3,
          pointerEvents: 'none'
        }}>
          ▶️
        </div>
      )}
    </div>
  );
}