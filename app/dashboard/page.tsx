'use client';

import { useEffect, useState } from 'react';
import { getKoreanLocationName } from '@/lib/locationKoreanNames';
import dynamic from 'next/dynamic';

const UserMetricsChart = dynamic(() => import('@/components/UserMetricsChart'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><div className="text-4xl font-bold">차트 로딩 중...</div></div>
});

const RocketAnimation = dynamic(() => import('@/components/RocketAnimation'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><div className="text-4xl font-bold">애니메이션 로딩 중...</div></div>
});

const YouTubePlayer = dynamic(() => import('@/components/YouTubeAutoPlayer'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><div className="text-4xl font-bold">플레이어 로딩 중...</div></div>
});

const CharacterRankingPage = dynamic(() => import('@/components/CharacterRankingPage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><div className="text-4xl font-bold">순위 로딩 중...</div></div>
});

const CharacterReviewsPage = dynamic(() => import('@/components/CharacterReviewsPage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full"><div className="text-4xl font-bold">리뷰 로딩 중...</div></div>
});

interface LocationDetail {
  country: string;
  city: string;
  activeUsers: number;
}

interface AnalyticsData {
  totalActiveUsers: number;
  locationDetails: LocationDetail[];
  byCountry?: Record<string, number>;
  byDevice?: Record<string, number>;
  byPlatform?: Record<string, number>;
}

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [realtimeData, setRealtimeData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [backendTimestamp, setBackendTimestamp] = useState<string | null>(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [isLunchTime, setIsLunchTime] = useState(false);
  const [testMode, setTestMode] = useState(false); // Normal mode: Time-based (20:00-08:00)
  const [currentPage, setCurrentPage] = useState(0);
  const [noBlackMode, setNoBlackMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedDots, setAnimatedDots] = useState<Array<{left: number, top: number, delay: number, duration: number, opacity: number}>>([]);
  const totalPages = 4; // Changed to 4 pages for the loop (including reviews)

  const fetchAnalyticsData = async () => {
    setLoading(true);
    
    try {
      // Fetch from SQLite database instead of GA4 API
      const response = await fetch('/api/analytics/dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Set both data and realtimeData from the same source
        setData({
          totalActiveUsers: result.data.totalActiveUsers,
          locationDetails: result.data.locationDetails || []
        });
        
        setRealtimeData({
          totalActiveUsers: result.data.totalActiveUsers,
          byCountry: result.data.byCountry || {},
          byDevice: result.data.byDevice || {},
          byPlatform: result.data.byPlatform || {}
        });
        
        setBackendTimestamp(result.data.timestamp);
        setError(null);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('데이터 로딩 중...');
    } finally {
      setLoading(false);
    }
  };

  // Check if current time is in night mode (22:00 - 09:00) or lunch time (11:45 - 12:15)
  const checkTimeMode = () => {
    if (testMode) {
      // TEST MODE: Toggle every 5 seconds
      setIsNightMode(prev => !prev);
    } else {
      // NORMAL MODE: Time-based
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = currentHour * 60 + now.getMinutes();
      
      // Night mode: 22:00 - 09:00
      setIsNightMode(currentHour >= 22 || currentHour < 9);
      
      // YouTube page time: 11:45 - 13:00 (705 - 780 minutes)
      // Only show YouTube page during this time
      setIsLunchTime(currentMinutes >= 705 && currentMinutes < 780);
    }
  };

  // Auto scroll to next page every 10 minutes (pages 1, 2, 3 in loop)
  useEffect(() => {
    if (!isNightMode && !isLunchTime) {
      console.log('Starting auto-scroll interval (10 minutes)');
      const pageInterval = setInterval(() => {
        setCurrentPage((prev) => {
          const nextPage = (prev + 1) % totalPages;
          console.log('Changing page from', prev + 1, 'to', nextPage + 1);
          return nextPage;
        });
      }, 600000); // Change page every 10 minutes (600000ms)

      return () => {
        console.log('Clearing auto-scroll interval');
        clearInterval(pageInterval);
      };
    }
  }, [isNightMode, isLunchTime, totalPages]);

  // Scroll to current page when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !isNightMode && !isLunchTime) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const targetY = currentPage * 1080;
        console.log('Scrolling to page:', currentPage + 1, 'Y position:', targetY);
        window.scrollTo(0, targetY);
        // Also try with document.documentElement for better browser compatibility
        document.documentElement.scrollTop = targetY;
        document.body.scrollTop = targetY; // For Safari
      }, 100);
    }
  }, [currentPage, isNightMode, isLunchTime]);

  // Check for noblack parameter in URL and session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check URL for noblack parameter
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('noblack')) {
        sessionStorage.setItem('noblack', 'true');
        setNoBlackMode(true);
      } else {
        // Check session storage
        const noblack = sessionStorage.getItem('noblack');
        if (noblack === 'true') {
          setNoBlackMode(true);
        }
      }
    }
  }, []);

  // Generate animated dots only on client side after hydration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dots = Array.from({ length: 15 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
        opacity: Math.random() * 0.2
      }));
      setAnimatedDots(dots);
    }
  }, []);

  useEffect(() => {
    // Start the scheduler on component mount
    fetch('/api/analytics/scheduler/start', { method: 'POST' })
      .then(res => res.json())
      .then(result => console.log('Scheduler:', result))
      .catch(err => console.error('Failed to start scheduler:', err));

    // Initial fetch
    fetchAnalyticsData();
    
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100);
    
    // Initialize currentPage to 0 to ensure we start from page 1
    setCurrentPage(0);

    if (testMode) {
      // TEST MODE: Toggle black/normal every 5 seconds
      const testInterval = setInterval(() => {
        checkTimeMode();
      }, 5000);

      // Still fetch data every 10 seconds
      const dataInterval = setInterval(() => {
        fetchAnalyticsData();
      }, 10000);

      return () => {
        clearInterval(testInterval);
        clearInterval(dataInterval);
      };
    } else {
      // NORMAL MODE: Original behavior
      checkTimeMode();

      // Refresh every 10 seconds for more real-time feel
      const interval = setInterval(() => {
        fetchAnalyticsData();
        checkTimeMode();
      }, 10000);

      // Check time mode every minute to ensure accuracy
      const timeModeInterval = setInterval(checkTimeMode, 60000);

      return () => {
        clearInterval(interval);
        clearInterval(timeModeInterval);
      };
    }
  }, [testMode]);

  // Get top countries
  const topCountries = Object.entries(realtimeData?.byCountry || {})
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 4);

  // Get device breakdown
  const devices = Object.entries(realtimeData?.byDevice || {})
    .sort(([, a], [, b]) => (b as number) - (a as number));

  // Get platform breakdown
  const platforms = Object.entries(realtimeData?.byPlatform || {})
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3);

  // If in night mode (22:00 - 09:00), show black screen (unless noblack mode is active)
  if (isNightMode && !noBlackMode) {
    return (
      <div className="w-screen h-screen bg-black" 
           style={{ width: '1920px', height: '1080px' }}>
        {/* Completely black screen for monitor protection */}
      </div>
    );
  }

  // If lunch time (11:45 - 13:00), show YouTube player page
  if (isLunchTime) {
    return (
      <div className="relative bg-white" style={{ width: '1920px', height: '1080px' }}>
        <YouTubePlayer />
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        ::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        html, body {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
          overflow-y: auto;  /* Allow vertical scrolling */
          overflow-x: hidden;  /* Prevent horizontal scrolling */
        }
      `}</style>
      <style jsx>{`
        @keyframes softGlow {
          0%, 100% {
            text-shadow: 
              0 0 20px rgba(139, 92, 246, 0.5),
              0 0 40px rgba(139, 92, 246, 0.3),
              0 0 60px rgba(236, 72, 153, 0.2);
          }
          50% {
            text-shadow: 
              0 0 30px rgba(139, 92, 246, 0.7),
              0 0 50px rgba(139, 92, 246, 0.5),
              0 0 70px rgba(236, 72, 153, 0.3);
          }
        }
        
        .soft-glow {
          animation: softGlow 6s ease-in-out infinite;
          color: #ffffff;
        }
      `}</style>
      
      <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" 
           style={{ width: '1920px' }}>

        {/* Page 1: Main Dashboard */}
        <div className="relative p-6" style={{ width: '1920px', height: '1080px' }}>
          {/* Grid background overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dashboard-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dashboard-grid)" />
            </svg>
          </div>
          
          {/* Animated dots background */}
          <div className="absolute inset-0 pointer-events-none">
            {animatedDots.map((dot, i) => (
              <div
                key={`bg-dot-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${dot.left}%`,
                  top: `${dot.top}%`,
                  animationDelay: `${dot.delay}s`,
                  animationDuration: `${dot.duration}s`,
                  opacity: dot.opacity
                }}
              />
            ))}
          </div>
          
          <div className="h-full flex flex-col relative z-10">
        {/* Data update time - centered, minimal */}
        <div className="text-center text-xs text-gray-400 mb-2">
          <span>데이터: {backendTimestamp ? new Date(backendTimestamp).toLocaleString('ko-KR') : '대기 중'}</span>
          <span className="mx-3 opacity-40">|</span>
          <span>갱신: {lastUpdate ? lastUpdate.toLocaleString('ko-KR') : '연결 중'}</span>
        </div>

        {/* Main Grid - Maximized space */}
        <div className="flex-1 grid grid-rows-3 gap-4">
          
          {/* Row 1: Main Stats */}
          <div className="grid grid-cols-4 gap-4">
            {/* Active Users - Extra Large */}
            <div className={`col-span-1 bg-black/40 backdrop-blur-sm rounded-2xl p-8 flex flex-col justify-center items-center shadow-2xl relative overflow-hidden border-2 border-white/20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
                 style={{ transitionDelay: '100ms' }}>
              <div className="text-9xl font-black soft-glow">
                {data?.totalActiveUsers || '0'}
              </div>
              <div className="text-3xl text-white/90 mt-4 font-bold uppercase tracking-wider">실시간 사용자 수</div>
            </div>

            {/* Top Countries - Larger text */}
            <div className={`col-span-1 bg-black/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-white/30 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                 style={{ transitionDelay: '200ms' }}>
              <h3 className="text-3xl font-black mb-5 uppercase text-white">국가별 사용자</h3>
              <div className="space-y-3">
                {topCountries
                  .filter(([country]) => country !== '(other)' && country !== 'other')
                  .map(([country, count], idx) => {
                    const { countryKo, flag } = getKoreanLocationName('', country);
                    if (countryKo === '기타' || countryKo === '(기타)') return null;
                    return (
                      <div key={country} className="flex justify-between items-center">
                        <span className="text-xl font-bold text-white/90">{countryKo}</span>
                        <div className="flex items-center">
                          <div className="w-32 h-4 bg-white/10 rounded-full mr-4 overflow-hidden border border-white/30">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                 style={{ width: `${((count as number) / (data?.totalActiveUsers || 1)) * 100}%` }}></div>
                          </div>
                          <span className="text-2xl font-black w-16 text-right text-white">{count as number}</span>
                        </div>
                      </div>
                    );
                  }).filter(Boolean)}
              </div>
            </div>

            {/* Device Stats - Larger text */}
            <div className={`col-span-1 bg-black/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-white/30 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                 style={{ transitionDelay: '300ms' }}>
              <h3 className="text-3xl font-black mb-5 uppercase text-white">기기별 분포</h3>
              <div className="space-y-4">
                {devices.map(([device, count]) => (
                  <div key={device} className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white/90">
                      {device === 'mobile' ? '모바일' : device === 'tablet' ? '태블릿' : device === 'desktop' ? '데스크톱' : device}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="text-4xl font-black text-white">{count as number}</div>
                      <div className="text-lg font-medium text-white/70">
                        ({Math.round(((count as number) / (data?.totalActiveUsers || 1)) * 100)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Stats - Larger text */}
            <div className={`col-span-1 bg-black/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-white/30 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                 style={{ transitionDelay: '400ms' }}>
              <h3 className="text-3xl font-black mb-5 uppercase text-white">플랫폼별 분포</h3>
              <div className="space-y-4">
                {platforms.map(([platform, count]) => (
                  <div key={platform} className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white/90">{platform}</span>
                    <div className="flex items-center gap-3">
                      <div className="text-4xl font-black text-white">{count as number}</div>
                      <div className="text-lg font-medium text-white/70">
                        ({Math.round(((count as number) / (data?.totalActiveUsers || 1)) * 100)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2 & 3: Cities Grid - Larger text, fewer items for better readability */}
          <div className={`row-span-2 bg-black/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-white/30 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
               style={{ transitionDelay: '500ms' }}>
            <h3 className="text-4xl font-black mb-6 text-center uppercase text-white">도시별 실시간 사용자</h3>
            <div className="grid grid-cols-4 gap-4 h-[calc(100%-4rem)]">
              {data?.locationDetails
                .filter(loc => loc.city !== '(other)')
                .slice(0, 20)
                .map((location, index) => {
                  const { cityKo, countryKo, flag } = getKoreanLocationName(location.city, location.country);
                  return (
                    <div
                      key={`${location.city}-${location.country}-${index}`}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all border-2 ${
                        index === 0 ? 'border-white/60 bg-gradient-to-r from-blue-600/60 to-purple-600/60 text-white' :
                        index === 1 ? 'border-white/40 bg-gradient-to-r from-blue-500/40 to-purple-500/40 text-white' :
                        index === 2 ? 'border-white/30 bg-gradient-to-r from-blue-400/30 to-purple-400/30 text-white' :
                        'border-white/20 bg-white/10 text-white'
                      }`}
                    >
                      <div className="flex-1">
                        {countryKo === '대한민국' ? (
                          <div className="text-4xl font-bold">{cityKo}</div>
                        ) : (
                          <>
                            <div className="text-3xl font-bold">{countryKo}</div>
                            <div className={`text-lg ${index < 3 ? 'opacity-80' : 'opacity-70'}`}>{cityKo}</div>
                          </>
                        )}
                      </div>
                      <div className="text-5xl font-black">
                        {location.activeUsers}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

          </div>
        </div>

        {/* Page 2: User Metrics Chart */}
        <div className="relative bg-white" style={{ width: '1920px', height: '1080px' }}>
          <UserMetricsChart />
        </div>

        {/* Page 3: Character Rankings (Payment Rate Rankings) */}
        <div className="relative bg-gray-900" style={{ width: '1920px', height: '1080px' }}>
          <CharacterRankingPage />
        </div>

        {/* Page 4: Character Reviews */}
        <div className="relative bg-gray-900" style={{ width: '1920px', height: '1080px' }}>
          <CharacterReviewsPage />
        </div>

        {/* Page 5: YouTube Player */}
        <div className="relative bg-white" style={{ width: '1920px', height: '1080px' }}>
          <YouTubePlayer />
        </div>

        {/* Page 6: Rocket Animation - Our Journey (Last Page) */}
        <div className="relative bg-white" style={{ width: '1920px', height: '1080px' }}>
          <RocketAnimation />
        </div>
      </div>
    </>
  );
}