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
  const [testMode, setTestMode] = useState(false); // Normal mode: Time-based (20:00-08:00)
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 5;

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

  // Check if current time is in night mode (21:00 - 08:00)
  const checkNightMode = () => {
    if (testMode) {
      // TEST MODE: Toggle every 5 seconds
      setIsNightMode(prev => !prev);
    } else {
      // NORMAL MODE: Time-based (21:00 - 08:00)
      const now = new Date();
      const currentHour = now.getHours();
      setIsNightMode(currentHour >= 21 || currentHour < 8);
    }
  };

  // Auto scroll to next page - DISABLED FOR NOW
  // useEffect(() => {
  //   if (!isNightMode) {
  //     const pageInterval = setInterval(() => {
  //       setCurrentPage((prev) => (prev + 1) % totalPages);
  //     }, 5000); // Change page every 5 seconds

  //     return () => clearInterval(pageInterval);
  //   }
  // }, [isNightMode, totalPages]);

  // Scroll to current page when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !isNightMode) {
      const targetY = currentPage * 1080;
      window.scrollTo({
        top: targetY,
        behavior: 'auto' // Instant scroll
      });
    }
  }, [currentPage, isNightMode]);

  useEffect(() => {
    // Start the scheduler on component mount
    fetch('/api/analytics/scheduler/start', { method: 'POST' })
      .then(res => res.json())
      .then(result => console.log('Scheduler:', result))
      .catch(err => console.error('Failed to start scheduler:', err));

    // Initial fetch
    fetchAnalyticsData();

    if (testMode) {
      // TEST MODE: Toggle black/normal every 5 seconds
      const testInterval = setInterval(() => {
        checkNightMode();
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
      checkNightMode();

      // Refresh every 10 seconds for more real-time feel
      const interval = setInterval(() => {
        fetchAnalyticsData();
        checkNightMode();
      }, 10000);

      // Check night mode every minute to ensure accuracy
      const nightModeInterval = setInterval(checkNightMode, 60000);

      return () => {
        clearInterval(interval);
        clearInterval(nightModeInterval);
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

  // If in night mode (20:00 - 08:00), show black screen
  if (isNightMode) {
    return (
      <div className="w-screen h-screen bg-black" 
           style={{ width: '1920px', height: '1080px' }}>
        {/* Completely black screen for monitor protection */}
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
        body {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            text-shadow: 
              0 0 10px rgba(255, 255, 255, 0.2),
              0 0 20px rgba(255, 255, 255, 0.1);
          }
          50% {
            text-shadow: 
              0 0 15px rgba(255, 255, 255, 0.3),
              0 0 25px rgba(255, 255, 255, 0.15);
          }
        }
        
        .animate-glow {
          animation: glow 5s ease-in-out infinite;
        }
      `}</style>
      
      <div className="w-screen bg-white text-black" 
           style={{ width: '1920px', overflowX: 'hidden' }}>

        {/* Page 1: Main Dashboard */}
        <div className="relative p-6" style={{ width: '1920px', height: '1080px' }}>
          <div className="h-full flex flex-col">
        {/* Data update time - centered, minimal */}
        <div className="text-center text-xs text-gray-400 mb-2">
          <span>데이터: {backendTimestamp ? new Date(backendTimestamp).toLocaleString('ko-KR') : '대기 중'}</span>
          <span className="mx-3">|</span>
          <span>갱신: {lastUpdate ? lastUpdate.toLocaleString('ko-KR') : '연결 중'}</span>
        </div>

        {/* Main Grid - Maximized space */}
        <div className="flex-1 grid grid-rows-3 gap-4">
          
          {/* Row 1: Main Stats */}
          <div className="grid grid-cols-4 gap-4">
            {/* Active Users - Extra Large */}
            <div className="col-span-1 bg-black rounded-2xl p-8 flex flex-col justify-center items-center shadow-2xl relative overflow-hidden">
              <div className="text-9xl font-black text-white animate-glow">
                {data?.totalActiveUsers || '0'}
              </div>
              <div className="text-3xl text-white mt-4 font-bold uppercase tracking-wider">실시간 사용자 수</div>
            </div>

            {/* Top Countries - Larger text */}
            <div className="col-span-1 bg-white border-4 border-black rounded-2xl p-6 shadow-xl">
              <h3 className="text-3xl font-black mb-5 uppercase">국가별 사용자</h3>
              <div className="space-y-3">
                {topCountries
                  .filter(([country]) => country !== '(other)' && country !== 'other')
                  .map(([country, count], idx) => {
                    const { countryKo, flag } = getKoreanLocationName('', country);
                    if (countryKo === '기타' || countryKo === '(기타)') return null;
                    return (
                      <div key={country} className="flex justify-between items-center">
                        <span className="text-xl font-bold">{countryKo}</span>
                        <div className="flex items-center">
                          <div className="w-32 h-4 bg-gray-200 rounded-full mr-4 overflow-hidden border border-black">
                            <div className="h-full bg-black rounded-full transition-all duration-500"
                                 style={{ width: `${((count as number) / (data?.totalActiveUsers || 1)) * 100}%` }}></div>
                          </div>
                          <span className="text-2xl font-black w-16 text-right">{count as number}</span>
                        </div>
                      </div>
                    );
                  }).filter(Boolean)}
              </div>
            </div>

            {/* Device Stats - Larger text */}
            <div className="col-span-1 bg-white border-4 border-black rounded-2xl p-6 shadow-xl">
              <h3 className="text-3xl font-black mb-5 uppercase">기기별 분포</h3>
              <div className="space-y-4">
                {devices.map(([device, count]) => (
                  <div key={device} className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                      {device === 'mobile' ? '모바일' : device === 'tablet' ? '태블릿' : device === 'desktop' ? '데스크톱' : device}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="text-4xl font-black">{count as number}</div>
                      <div className="text-lg font-medium">
                        ({Math.round(((count as number) / (data?.totalActiveUsers || 1)) * 100)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Stats - Larger text */}
            <div className="col-span-1 bg-white border-4 border-black rounded-2xl p-6 shadow-xl">
              <h3 className="text-3xl font-black mb-5 uppercase">플랫폼별 분포</h3>
              <div className="space-y-4">
                {platforms.map(([platform, count]) => (
                  <div key={platform} className="flex justify-between items-center">
                    <span className="text-xl font-bold">{platform}</span>
                    <div className="flex items-center gap-3">
                      <div className="text-4xl font-black">{count as number}</div>
                      <div className="text-lg font-medium">
                        ({Math.round(((count as number) / (data?.totalActiveUsers || 1)) * 100)}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2 & 3: Cities Grid - Larger text, fewer items for better readability */}
          <div className="row-span-2 bg-white border-4 border-black rounded-2xl p-6 shadow-xl">
            <h3 className="text-4xl font-black mb-6 text-center uppercase">도시별 실시간 사용자</h3>
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
                        index === 0 ? 'border-black bg-black text-white' :
                        index === 1 ? 'border-black bg-gray-800 text-white' :
                        index === 2 ? 'border-black bg-gray-600 text-white' :
                        'border-black bg-white'
                      }`}
                    >
                      <div className="flex-1">
                        {countryKo === '대한민국' ? (
                          <div className="text-4xl font-bold">{cityKo}</div>
                        ) : (
                          <>
                            <div className="text-3xl font-bold">{countryKo}</div>
                            <div className={`text-lg ${index < 3 ? 'opacity-80' : 'text-gray-500'}`}>{cityKo}</div>
                          </>
                        )}
                      </div>
                      <div className={`text-5xl font-black ${index < 3 ? '' : ''}`}>
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

        {/* Page 2: 2 Years User Metrics Chart */}
        <div className="relative bg-white" style={{ width: '1920px', height: '1080px' }}>
          <UserMetricsChart />
        </div>

        {/* Page 3: Rocket Animation - Our Journey */}
        <div className="relative bg-white" style={{ width: '1920px', height: '1080px' }}>
          <RocketAnimation />
        </div>

        {/* Page 4: Platform Analysis */}
        <div className="relative p-8 bg-gray-900 text-white" style={{ width: '1920px', height: '1080px' }}>
        <div className="h-full flex flex-col">
          <h2 className="text-6xl font-bold text-center mb-12">플랫폼 분석</h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-12">
              {Object.entries(realtimeData?.byPlatform || {}).map(([platform, count]) => (
                <div key={platform} className="text-center">
                  <div className="text-8xl font-black mb-4">{count as number}</div>
                  <div className="text-4xl font-medium">{platform}</div>
                  <div className="text-2xl mt-2 text-gray-400">
                    {Math.round(((count as number) / (data?.totalActiveUsers || 1)) * 100)}% 점유율
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>

        {/* Page 5: Summary */}
        <div className="relative p-8 bg-white" style={{ width: '1920px', height: '1080px' }}>
        <div className="h-full flex flex-col justify-center items-center">
          <h2 className="text-7xl font-bold mb-12">실시간 요약</h2>
          <div className="grid grid-cols-2 gap-12">
            <div className="text-center">
              <div className="text-9xl font-black">{data?.totalActiveUsers || 0}</div>
              <div className="text-4xl mt-4">전체 사용자</div>
            </div>
            <div className="text-center">
              <div className="text-9xl font-black">{data?.locationDetails?.length || 0}</div>
              <div className="text-4xl mt-4">접속 도시</div>
            </div>
          </div>
          <div className="mt-16 text-3xl text-gray-600">
            마지막 업데이트: {lastUpdate ? lastUpdate.toLocaleString('ko-KR') : '대기 중...'}
          </div>
          </div>
        </div>
      </div>
    </>
  );
}