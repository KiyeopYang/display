'use client';

import { useEffect, useState } from 'react';

interface CharacterRanking {
  id: string;
  name: string;
  profile_img: string;
  mean_payment_ratio: number;
  review_count: number;
  avg_story_rating: number;
  avg_art_rating: number;
  play_count: number;
  completion_rate_recent_30d: number;
  dropout_rate_recent_30d: number;
  rank: number;
}

export default function CharacterRankingPage() {
  const [rankings, setRankings] = useState<CharacterRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isVisible, setIsVisible] = useState(false);

  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/analytics/character-rankings');
      if (!response.ok) throw new Error('Failed to fetch rankings');
      const data = await response.json();
      setRankings(data.rankings || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
    const interval = setInterval(fetchRankings, 30000); // Update every 30 seconds
    
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100);
    
    return () => clearInterval(interval);
  }, []);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-amber-400 border-yellow-400';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-300 border-gray-300';
    if (rank === 3) return 'bg-gradient-to-r from-orange-600 to-orange-400 border-orange-400';
    return 'bg-gray-800 border-gray-600';
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-950">
        <div className="text-6xl text-white animate-pulse">로딩 중...</div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .animate-slide-in-top {
          animation: slideInFromTop 0.5s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInFromLeft 0.6s ease-out forwards;
        }
        
        .animate-fade-in-scale {
          animation: fadeInScale 0.4s ease-out forwards;
        }

        .shimmer {
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255, 255, 255, 0.05) 50%,
            transparent 60%
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        .gradient-border {
          position: relative;
          background: linear-gradient(90deg, #10b981, #22c55e);
          padding: 1px;
          border-radius: 0.5rem;
        }

        .gradient-border-red {
          position: relative;
          background: linear-gradient(90deg, #ef4444, #dc2626);
          padding: 1px;
          border-radius: 0.5rem;
        }

        .inner-content {
          background: rgb(3 7 18);
          border-radius: 0.5rem;
          padding: 0.25rem 0.75rem;
        }
      `}</style>
      
      <div className="h-screen w-screen bg-gray-950 overflow-hidden" style={{ width: '1920px', height: '1080px' }}>
        {/* Header */}
        <div className="h-24 flex items-center justify-end px-12 bg-gray-900 border-b border-gray-800">
          <div className={`text-2xl text-gray-400 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {lastUpdate.toLocaleTimeString('ko-KR')}
          </div>
        </div>

        {/* Rankings Table */}
        <div className="px-12 py-8">
          <table className="w-full">
            <thead>
              <tr className={`text-gray-400 text-2xl border-b border-gray-800 ${isVisible ? 'animate-slide-in-top' : 'opacity-0'}`}>
                <th className="text-left pb-4 w-20">순위</th>
                <th className="text-left pb-4 w-24"></th>
                <th className="text-left pb-4">캐릭터</th>
                <th className="text-center pb-4 w-48">결제율</th>
                <th className="text-center pb-4 w-48">30D 완료율</th>
                <th className="text-center pb-4 w-48">30D 이탈율</th>
                <th className="text-center pb-4 w-44">시나리오</th>
                <th className="text-center pb-4 w-44">아트</th>
                <th className="text-center pb-4 w-44">플레이수</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((character, index) => (
                <tr
                  key={character.id}
                  className={`border-b border-gray-800 transition-all duration-300 hover:bg-gray-900/50 ${
                    character.rank <= 3 ? 'bg-gray-900/30' : ''
                  } ${isVisible ? 'animate-slide-in-left opacity-100' : 'opacity-0'}`}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {/* Rank */}
                  <td className="py-4">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-3xl border-2 transition-transform hover:scale-105 ${getRankStyle(character.rank)}`}
                    >
                      {character.rank}
                    </div>
                  </td>

                  {/* Profile Image */}
                  <td className="py-4">
                    <div className="w-16 h-16 transition-transform hover:scale-105">
                      {character.profile_img ? (
                        <img
                          src={character.profile_img}
                          alt={character.name}
                          className="w-full h-full rounded-lg object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-full h-full rounded-lg bg-gray-800 flex items-center justify-center">
                          <span className="text-2xl">👤</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td className="py-4">
                    <div className="text-3xl font-semibold text-white hover:text-blue-400 transition-colors">
                      {character.name}
                    </div>
                  </td>

                  {/* Payment Ratio */}
                  <td className="py-4 text-center">
                    <div className="text-4xl font-bold text-green-400 transition-transform hover:scale-105">
                      {(character.mean_payment_ratio * 100).toFixed(1)}%
                    </div>
                  </td>

                  {/* 30D Completion Rate */}
                  <td className="py-4 text-center">
                    {character.completion_rate_recent_30d >= 0.2 ? (
                      <div className="gradient-border inline-block">
                        <div className="inner-content">
                          <span className="text-3xl font-bold text-green-400">
                            {(character.completion_rate_recent_30d * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-3xl font-semibold text-blue-400">
                        {(character.completion_rate_recent_30d * 100).toFixed(1)}%
                      </div>
                    )}
                  </td>

                  {/* 30D Dropout Rate */}
                  <td className="py-4 text-center">
                    {character.dropout_rate_recent_30d <= 0.5 ? (
                      <div className="gradient-border inline-block">
                        <div className="inner-content">
                          <span className="text-3xl font-bold text-green-400">
                            {(character.dropout_rate_recent_30d * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="gradient-border-red inline-block">
                        <div className="inner-content">
                          <span className="text-3xl font-bold text-red-400">
                            {(character.dropout_rate_recent_30d * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Story Rating */}
                  <td className="py-4 text-center">
                    <div className="text-2xl text-yellow-400 transition-transform hover:scale-105">
                      ⭐ {character.avg_story_rating.toFixed(1)}
                    </div>
                  </td>

                  {/* Art Rating */}
                  <td className="py-4 text-center">
                    <div className="text-2xl text-yellow-400 transition-transform hover:scale-105">
                      ⭐ {character.avg_art_rating.toFixed(1)}
                    </div>
                  </td>

                  {/* Play Count */}
                  <td className="py-4 text-center">
                    <div className="text-2xl font-medium text-gray-300 transition-opacity hover:text-white">
                      {character.play_count.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}