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
    <div className="w-[1920px] h-[1080px] bg-black p-12 overflow-hidden">
      <div className="h-full">
        {/* Reviews Grid - Full screen, no headers */}
        <div className="h-full grid grid-cols-2 gap-8">
          {reviews.slice(0, 8).map((review, index) => (
            <div 
              key={review.id} 
              className="relative bg-gradient-to-br from-gray-900/70 to-gray-900/50 rounded-xl p-6 border border-gray-700 flex gap-6 transition-all duration-300 hover:border-cyan-700/50 hover:shadow-lg hover:shadow-cyan-900/20"
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Character Image */}
              <div className="flex-shrink-0">
                <img 
                  src={review.profile_img} 
                  alt={review.character_name}
                  className="w-32 h-32 rounded-xl object-cover border-2 border-gray-600 shadow-lg"
                />
              </div>

              {/* Review Content */}
              <div className="flex-1 flex flex-col justify-between">
                {/* Character Name and Date */}
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-3xl font-semibold text-white">{review.character_name}</h3>
                    <span className="text-xl text-cyan-400 font-medium">{formatDate(review.created_at)}</span>
                  </div>

                  {/* Star Ratings */}
                  <div className="flex gap-8 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-300">스토리</span>
                      <span className="text-2xl text-yellow-400">{renderStars(review.story_star)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-300">아트</span>
                      <span className="text-2xl text-yellow-400">{renderStars(review.art_star)}</span>
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-gray-700">
                  <p className="text-xl text-white leading-relaxed line-clamp-2">
                    {review.review}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}