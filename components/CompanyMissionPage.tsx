'use client';

import React, { useEffect, useState } from 'react';

export default function CompanyMissionPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="w-[1920px] h-[1080px] bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center overflow-hidden relative">
      {/* Radial pulse waves - reduced to 3 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute rounded-full border border-purple-400/30 animate-ripple" style={{ width: '300px', height: '300px' }}></div>
        <div className="absolute rounded-full border border-pink-400/25 animate-ripple" style={{ width: '300px', height: '300px', animationDelay: '1s' }}></div>
        <div className="absolute rounded-full border border-purple-400/20 animate-ripple" style={{ width: '300px', height: '300px', animationDelay: '2s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Center glow effect with rotation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-3xl animate-rotate"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 blur-2xl animate-pulse"></div>
      </div>

      {/* Heart symbols floating */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={`heart-${i}`}
            className="absolute text-6xl text-pink-400/20 animate-heart"
            style={{
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 0.5}s`
            }}
          >
            ♥
          </div>
        ))}
      </div>

      {/* Mission text */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <h1 className="text-6xl font-black text-white mb-16 tracking-wider uppercase">Our Mission</h1>
        <div className="space-y-12">
          <p className="text-9xl font-black text-white leading-tight">
            사랑과 재미를
          </p>
          <p className="text-9xl font-black text-white leading-tight">
            전세계에 퍼뜨리기
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.9);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-30px) translateX(10px);
          }
          50% {
            transform: translateY(-50px) translateX(-10px);
          }
          75% {
            transform: translateY(-20px) translateX(5px);
          }
        }
        
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes heart {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.3;
            transform: translateY(-50vh) scale(1) rotate(15deg);
          }
          90% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(-120vh) scale(0.5) rotate(-15deg);
            opacity: 0;
          }
        }
        
        .animate-ripple {
          animation: ripple 3s ease-out infinite;
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-rotate {
          animation: rotate 20s linear infinite;
        }
        
        .animate-heart {
          animation: heart 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}