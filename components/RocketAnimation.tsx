'use client';

import { useEffect, useState } from 'react';

export default function RocketAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 500);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-white relative overflow-hidden">
      <svg
        viewBox="0 0 1920 1080"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Main trajectory path */}
        <path
          d="M 300 750 Q 700 650 960 450 T 1500 200"
          stroke="#000000"
          strokeWidth="2"
          fill="none"
          strokeDasharray="2000"
          strokeDashoffset={isAnimating ? "0" : "2000"}
          opacity="0.3"
          style={{
            transition: 'stroke-dashoffset 6s ease-out',
          }}
        />

        {/* Milestone markers - cleaner design */}
        {[
          { x: 300, y: 750, label: "시작" },
          { x: 600, y: 680, label: "20%" },
          { x: 960, y: 450, label: "50%" },
          { x: 1200, y: 330, label: "70%" },
          { x: 1500, y: 200, label: "목표" }
        ].map((milestone, i) => (
          <g key={i} transform={`translate(${milestone.x}, ${milestone.y})`}>
            <circle
              r="4"
              fill="#000000"
              opacity={isAnimating ? "1" : "0"}
              style={{
                transition: `opacity 1s ease-out ${i * 0.5}s`,
              }}
            />
            <text
              y="-15"
              textAnchor="middle"
              fontSize="14"
              fontWeight="600"
              fill="#000000"
              opacity={isAnimating ? "0.8" : "0"}
              style={{
                transition: `opacity 1s ease-out ${i * 0.5 + 0.3}s`,
              }}
            >
              {milestone.label}
            </text>
          </g>
        ))}

        {/* Rocket - minimal triangle at 20% */}
        <g
          transform={isAnimating ? "translate(600, 680)" : "translate(300, 750)"}
          style={{
            transition: 'transform 2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Simple exhaust lines */}
          <line
            x1="-5"
            y1="5"
            x2={isAnimating ? "-30" : "-5"}
            y2="5"
            stroke="#000000"
            strokeWidth="2"
            opacity={isAnimating ? "0.4" : "0"}
            style={{ transition: 'all 1s ease-out 0.5s' }}
          />
          <line
            x1="-5"
            y1="0"
            x2={isAnimating ? "-25" : "-5"}
            y2="0"
            stroke="#000000"
            strokeWidth="1.5"
            opacity={isAnimating ? "0.3" : "0"}
            style={{ transition: 'all 1s ease-out 0.6s' }}
          />
          
          {/* Rocket triangle */}
          <g transform="rotate(-35)">
            <path
              d="M 0 8 L 20 0 L 0 -8 Z"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
            />
            <circle cx="7" cy="0" r="2" fill="none" stroke="#000000" strokeWidth="1.5" />
          </g>
        </g>

        {/* Progress dots animation */}
        {[...Array(8)].map((_, i) => (
          <circle
            key={i}
            cx={300 + i * 150}
            cy={750 - i * 70}
            r="1.5"
            fill="#000000"
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.5;0"
              dur="2s"
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Message */}
        <text
          x="960"
          y="950"
          textAnchor="middle"
          fontSize="32"
          fontWeight="bold"
          fill="#000000"
          opacity={isAnimating ? "1" : "0"}
          style={{
            transition: 'opacity 2s ease-out 3s',
          }}
        >
          우리는 계속 나아가고 있습니다
        </text>

        {/* Subtle background elements */}
        <circle
          cx="1600"
          cy="150"
          r="60"
          fill="none"
          stroke="#000000"
          strokeWidth="1"
          opacity={isAnimating ? "0.1" : "0"}
          style={{
            transition: 'opacity 4s ease-out 2s',
          }}
        />
        <rect
          x="200"
          y="850"
          width="40"
          height="40"
          fill="none"
          stroke="#000000"
          strokeWidth="1"
          opacity={isAnimating ? "0.1" : "0"}
          transform="rotate(45 220 870)"
          style={{
            transition: 'opacity 4s ease-out 1s',
          }}
        />
      </svg>
    </div>
  );
}