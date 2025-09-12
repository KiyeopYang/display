'use client';

import { useEffect, useState, useCallback } from 'react';

export default function RocketAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [trajectoryProgress, setTrajectoryProgress] = useState(0);
  const [showReplay, setShowReplay] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const startAnimation = useCallback(() => {
    setIsAnimating(false);
    setTrajectoryProgress(0);
    setShowReplay(false);
    setAnimationKey(prev => prev + 1);
    
    setTimeout(() => {
      setIsAnimating(true);
    }, 500);
  }, []);

  useEffect(() => {
    startAnimation();
  }, []);

  useEffect(() => {
    if (!isAnimating) return;

    let animationFrame: number;
    let startTime: number | null = null;
    const duration = 12000; // 12 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Smooth easing
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      setTrajectoryProgress(eased * 100);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setShowReplay(true);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isAnimating]);

  // Calculate object position along parabolic path
  const getObjectPosition = (progress: number) => {
    const t = progress / 100;
    
    // Parabolic trajectory parameters
    const startX = 400;
    const startY = 700;
    const endX = 1520;
    const endY = 700;
    const maxHeight = 400; // Peak altitude
    
    const x = startX + (endX - startX) * t;
    const y = startY - (4 * maxHeight * t * (1 - t)); // Parabolic arc
    
    // Rotation based on trajectory tangent
    const dx = endX - startX;
    const dy = -4 * maxHeight * (1 - 2 * t);
    const rotation = Math.atan2(dy, dx) * 180 / Math.PI;
    
    return { x, y, rotation };
  };

  const objectPos = getObjectPosition(trajectoryProgress);

  // Generate the exact path that the object follows
  const generateTrajectoryPath = () => {
    const points = [];
    for (let i = 0; i <= 100; i += 2) {
      const pos = getObjectPosition(i);
      points.push(`${pos.x},${pos.y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <svg
        viewBox="0 0 1920 1080"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="nextPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.3" />
          </linearGradient>

          <radialGradient id="glowGradient">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>

          {/* Filters */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>

        {/* Background elements */}
        {/* Animated dots */}
        {[...Array(30)].map((_, i) => (
          <circle
            key={`bg-dot-${i}-${animationKey}`}
            cx={Math.random() * 1920}
            cy={Math.random() * 1080}
            r="1"
            fill="#ffffff"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.3;0"
              dur={`${4 + Math.random() * 4}s`}
              begin={`${Math.random() * 4}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Ground reference line */}
        <line
          x1="0"
          y1="700"
          x2="1920"
          y2="700"
          stroke="#ffffff"
          strokeWidth="1"
          strokeDasharray="10 10"
          opacity="0.2"
        />

        {/* Altitude grid lines */}
        {[...Array(5)].map((_, i) => (
          <g key={`altitude-${i}`}>
            <line
              x1="0"
              y1={700 - (i + 1) * 100}
              x2="1920"
              y2={700 - (i + 1) * 100}
              stroke="#ffffff"
              strokeWidth="0.5"
              opacity="0.1"
            />
            <text
              x="50"
              y={700 - (i + 1) * 100 - 5}
              fill="#ffffff"
              fontSize="12"
              opacity="0.3"
            >
              {(i + 1) * 100}km
            </text>
          </g>
        ))}

        {/* Next trajectory path - dotted line with opacity */}
        <path
          d={generateTrajectoryPath()}
          stroke="#94a3b8"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5 5"
          opacity="0.4"
        />

        {/* Traced path - follows the object */}
        <path
          d={generateTrajectoryPath()}
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={100 - trajectoryProgress}
          opacity="0"
        >
          <animate
            attributeName="opacity"
            values="0;0.6"
            dur="2s"
            begin="1s"
            fill="freeze"
          />
        </path>

        {/* Trail particles */}
        {isAnimating && [...Array(20)].map((_, i) => {
          const particleProgress = (i / 20) * 100;
          const pos = getObjectPosition(particleProgress);
          return (
            <circle
              key={`trail-${i}-${animationKey}`}
              cx={pos.x}
              cy={pos.y}
              r="2"
              fill="#3b82f6"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;0.6;0"
                dur="2s"
                begin={`${i * 0.5}s`}
                repeatCount="1"
              />
              <animate
                attributeName="r"
                values="2;4;6"
                dur="2s"
                begin={`${i * 0.5}s`}
                repeatCount="1"
              />
            </circle>
          );
        })}

        {/* Origin point */}
        <g transform="translate(400, 700)">
          {/* Pulse effect */}
          <circle r="20" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0">
            <animate
              attributeName="opacity"
              values="0;0.6;0"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="10;30;40"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Core */}
          <circle r="8" fill="#3b82f6" opacity="0.9" filter="url(#glow)" />
          <circle r="4" fill="#ffffff" opacity="1" />
          
          {/* Label */}
          <text
            y="35"
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fill="#3b82f6"
            opacity="0.8"
          >
            시작점
          </text>
        </g>

        {/* Destination point */}
        <g transform="translate(1520, 700)">
          {/* Pulse effect */}
          <circle r="20" fill="none" stroke="#ec4899" strokeWidth="2" opacity="0">
            <animate
              attributeName="opacity"
              values="0;0.6;0"
              dur="2s"
              begin="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="10;30;40"
              dur="2s"
              begin="1s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Core */}
          <circle r="8" fill="#ec4899" opacity="0.9" filter="url(#glow)" />
          <circle r="4" fill="#ffffff" opacity="1" />
          
          {/* Label */}
          <text
            y="35"
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fill="#ec4899"
            opacity="0.8"
          >
            도착점
          </text>
        </g>

        {/* Apex marker */}
        {trajectoryProgress > 40 && trajectoryProgress < 60 && (
          <g transform="translate(960, 300)" opacity="0">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="960,300;960,300"
              dur="0.1s"
              fill="freeze"
            />
            <animate
              attributeName="opacity"
              values="0;0.8"
              dur="0.5s"
              begin="0s"
              fill="freeze"
            />
            <line x1="-30" y1="0" x2="30" y2="0" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="5 5" />
            <line x1="0" y1="-30" x2="0" y2="30" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="5 5" />
            <text
              y="-40"
              textAnchor="middle"
              fontSize="12"
              fill="#8b5cf6"
              fontWeight="600"
            >
              최고점
            </text>
            <text
              y="-25"
              textAnchor="middle"
              fontSize="10"
              fill="#8b5cf6"
              opacity="0.7"
            >
              400km
            </text>
          </g>
        )}

        {/* Moving object */}
        <g
          transform={`translate(${objectPos.x}, ${objectPos.y})`}
          style={{ transition: 'none' }}
        >
          {/* Trail effect */}
          {trajectoryProgress > 0 && trajectoryProgress < 100 && (
            <g transform={`rotate(${objectPos.rotation})`}>
              {[...Array(5)].map((_, i) => (
                <line
                  key={i}
                  x1={-10 - i * 10}
                  y1="0"
                  x2={-10 - i * 15}
                  y2="0"
                  stroke="#3b82f6"
                  strokeWidth={2 - i * 0.3}
                  opacity={0.7 - i * 0.1}
                />
              ))}
            </g>
          )}
          
          {/* Main object */}
          <g transform={`rotate(${objectPos.rotation})`}>
            {/* Glow effect */}
            <circle cx="0" cy="0" r="15" fill="url(#glowGradient)" opacity="0.6" />
            
            {/* Core triangle */}
            <path
              d="M 10 0 L -5 5 L -5 -5 Z"
              fill="#ffffff"
              stroke="#3b82f6"
              strokeWidth="2"
              filter="url(#glow)"
            />
            
            {/* Inner detail */}
            <circle cx="0" cy="0" r="2" fill="#3b82f6" />
          </g>
        </g>

        {/* Data overlay */}
        <g transform="translate(100, 100)">
          <rect x="0" y="0" width="200" height="120" fill="#000000" opacity="0.4" rx="5" />
          <text x="10" y="25" fill="#ffffff" fontSize="14" fontWeight="600" opacity="0.9">
            시뮬레이션 데이터
          </text>
          <text x="10" y="50" fill="#3b82f6" fontSize="12" opacity="0.8">
            진행률: {Math.round(trajectoryProgress)}%
          </text>
          <text x="10" y="70" fill="#8b5cf6" fontSize="12" opacity="0.8">
            고도: {Math.round(400 * 4 * (trajectoryProgress/100) * (1 - trajectoryProgress/100))}km
          </text>
          <text x="10" y="90" fill="#ec4899" fontSize="12" opacity="0.8">
            거리: {Math.round(1120 * trajectoryProgress / 100)}km
          </text>
          <text x="10" y="110" fill="#10b981" fontSize="12" opacity="0.8">
            속도: {Math.round(500 + 300 * Math.sin(trajectoryProgress * Math.PI / 100))}km/h
          </text>
        </g>

        {/* Phase indicator */}
        <g transform="translate(960, 50)">
          <text
            textAnchor="middle"
            fontSize="24"
            fontWeight="700"
            fill="#ffffff"
            opacity="0.8"
          >
            {trajectoryProgress < 20 ? "발사 단계" :
             trajectoryProgress < 45 ? "상승 단계" :
             trajectoryProgress < 55 ? "정점 통과" :
             trajectoryProgress < 80 ? "하강 단계" :
             trajectoryProgress < 95 ? "최종 접근" :
             "완료"}
          </text>
        </g>

        {/* Success message */}
        {trajectoryProgress >= 98 && (
          <g transform="translate(960, 540)">
            <rect x="-150" y="-40" width="300" height="80" fill="#000000" opacity="0.5" rx="10" />
            <text
              textAnchor="middle"
              fontSize="32"
              fontWeight="800"
              fill="#10b981"
              filter="url(#glow)"
            >
              연결 완료
            </text>
            <text
              y="30"
              textAnchor="middle"
              fontSize="16"
              fill="#ffffff"
              opacity="0.8"
            >
              시뮬레이션 성공
            </text>
          </g>
        )}
      </svg>

      {/* Replay button */}
      {showReplay && (
        <button
          onClick={startAnimation}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-bold rounded-lg shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          다시 시작
        </button>
      )}
    </div>
  );
}