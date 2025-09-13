'use client';

import React, { useEffect, useState } from 'react';

interface Review {
  id: number;
  character: string;
  user: string;
  story_star: number;
  art_star: number;
  review: string;
  created_at: string;
  character_name: string;
  profile_img: string;
}

export default function CharacterReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    const interval = setInterval(fetchReviews, 600000); // Refresh every 10 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/analytics/character-reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (count: number) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const koreaTime = new Date(date.getTime() + (9 * 60 * 60 * 1000)); // Add 9 hours for KST
    
    const month = String(koreaTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(koreaTime.getUTCDate()).padStart(2, '0');
    const hours = String(koreaTime.getUTCHours()).padStart(2, '0');
    const minutes = String(koreaTime.getUTCMinutes()).padStart(2, '0');
    
    return `${month}/${day} ${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <div className="w-[1920px] h-[1080px] flex items-center justify-center bg-black">
        <div className="text-5xl text-gray-400 font-light animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-[1920px] h-[1080px] bg-gradient-to-b from-gray-900 via-black to-gray-900 p-6 overflow-hidden">
      {/* Title Header - Smaller */}
      <div className="text-center mb-4">
        <h1 className="text-5xl font-black text-white uppercase tracking-wider">최신 캐릭터 리뷰</h1>
      </div>
      
      {/* Reviews Grid - Compact 2x2 layout */}
      <div className="grid grid-cols-2 gap-4" style={{ height: 'calc(100% - 80px)' }}>
        {reviews.slice(0, 4).map((review, index) => (
          <div 
            key={review.id} 
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-5 border-2 border-gray-700 flex flex-col h-full"
            style={{
              animation: `slideIn 0.4s ease-out ${index * 0.1}s both`
            }}
          >
            {/* Top Section - Character Info - More compact */}
            <div className="flex items-start gap-4 mb-3">
              {/* Character Image - Smaller */}
              <img 
                src={review.profile_img} 
                alt={review.character_name}
                className="w-28 h-28 rounded-lg object-cover border-2 border-gray-600 shadow-lg flex-shrink-0"
              />
              
              {/* Character Details - Smaller */}
              <div className="flex-1">
                <h2 className="text-3xl font-black text-white mb-1 leading-tight">{review.character_name}</h2>
                <div className="text-xl text-cyan-400 font-semibold mb-2">{formatDate(review.created_at)}</div>
                
                {/* Star Ratings - More compact */}
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-400">스토리</span>
                    <span className="text-2xl text-yellow-400">{renderStars(review.story_star)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-400">아트</span>
                    <span className="text-2xl text-yellow-400">{renderStars(review.art_star)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Text - Much bigger text, fills remaining space */}
            <div className="flex-1 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-gray-700/50 flex items-center">
              <p className="text-5xl text-white leading-tight font-bold">
                {review.review}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}