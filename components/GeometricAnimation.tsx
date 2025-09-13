'use client';

import { useEffect, useRef } from 'react';

export default function GeometricAnimation() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Animation will be handled via CSS animations
  }, []);

  return (
    <div className="w-[1920px] h-[1080px] bg-white flex items-center justify-center relative overflow-hidden">
      {/* Modern Art Background Elements */}
      <div className="absolute inset-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Mondrian-inspired color blocks */}
          <rect x="0" y="0" width="300" height="200" fill="#FF0000" opacity="0.8">
            <animate attributeName="width" values="300;350;300" dur="8s" repeatCount="indefinite" />
          </rect>
          <rect x="1620" y="0" width="300" height="400" fill="#0000FF" opacity="0.7">
            <animate attributeName="height" values="400;500;400" dur="10s" repeatCount="indefinite" />
          </rect>
          <rect x="0" y="880" width="400" height="200" fill="#FFDE00" opacity="0.8">
            <animate attributeName="x" values="0;50;0" dur="12s" repeatCount="indefinite" />
          </rect>
          <rect x="800" y="540" width="320" height="180" fill="#000000" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="6s" repeatCount="indefinite" />
          </rect>
          
          {/* Abstract paint strokes */}
          {[...Array(8)].map((_, i) => {
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
            const x = Math.random() * 1920;
            const y = Math.random() * 1080;
            return (
              <path
                key={`stroke-${i}`}
                d={`M ${x} ${y} Q ${x + 200} ${y + 100} ${x + 400} ${y - 50}`}
                stroke={colors[i]}
                strokeWidth={Math.random() * 30 + 10}
                fill="none"
                opacity={Math.random() * 0.6 + 0.2}
                strokeLinecap="round"
              >
                <animate
                  attributeName="stroke-width"
                  values={`${Math.random() * 30 + 10};${Math.random() * 50 + 20};${Math.random() * 30 + 10}`}
                  dur={`${Math.random() * 5 + 5}s`}
                  repeatCount="indefinite"
                />
              </path>
            );
          })}
        </svg>
      </div>

      {/* Main Modern Art Composition */}
      <svg
        ref={svgRef}
        width="1400"
        height="800"
        viewBox="0 0 1400 800"
        className="relative z-10"
      >
        <defs>
          {/* Bauhaus-inspired gradients */}
          <linearGradient id="modernGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="50%" stopColor="#FF0000" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
          
          <linearGradient id="modernGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0000FF" />
            <stop offset="100%" stopColor="#FFDE00" />
          </linearGradient>
          
          <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="#000000" />
          </pattern>
          
          <filter id="roughPaper">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
            <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="1">
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
          </filter>
        </defs>

        {/* Kandinsky-inspired abstract composition */}
        <g transform="translate(700, 400)">
          {/* Large geometric forms */}
          <circle cx="-300" cy="-200" r="150" fill="#FF0000" opacity="0.7">
            <animate attributeName="r" values="150;180;150" dur="5s" repeatCount="indefinite" />
          </circle>
          
          <rect x="100" y="-150" width="200" height="200" fill="#0000FF" transform="rotate(15 200 -50)">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="15 200 -50"
              to="375 200 -50"
              dur="30s"
              repeatCount="indefinite"
            />
          </rect>
          
          <polygon points="-100,100 0,0 100,100" fill="#FFDE00" opacity="0.8">
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1;1.2;1"
              dur="4s"
              repeatCount="indefinite"
            />
          </polygon>
          
          {/* Suprematist-style floating rectangles */}
          <rect x="-400" y="50" width="80" height="120" fill="#000000">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 -360 110"
              to="360 -360 110"
              dur="20s"
              repeatCount="indefinite"
            />
          </rect>
          
          <rect x="250" y="100" width="100" height="20" fill="#FF0000">
            <animate attributeName="width" values="100;150;100" dur="3s" repeatCount="indefinite" />
          </rect>
          
          {/* Constructivist lines */}
          <line x1="-500" y1="-300" x2="500" y2="300" stroke="#000000" strokeWidth="3" />
          <line x1="-500" y1="300" x2="500" y2="-300" stroke="#000000" strokeWidth="3" opacity="0.5" />
          
          {/* Central focal point - abstract sun/eye */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur="15s"
              repeatCount="indefinite"
            />
            <circle cx="0" cy="0" r="60" fill="none" stroke="#000000" strokeWidth="8" />
            <circle cx="0" cy="0" r="40" fill="#FFDE00" />
            <circle cx="0" cy="0" r="20" fill="#FF0000" />
            <circle cx="0" cy="0" r="10" fill="#000000" />
          </g>

          {/* Bauhaus-style geometric dance */}
          {[...Array(6)].map((_, i) => {
            const colors = ['#FF0000', '#0000FF', '#FFDE00', '#000000', '#FFFFFF', '#00FF00'];
            const shapes = [
              <circle key={`shape-${i}`} cx={Math.cos(i * 60 * Math.PI / 180) * 200} cy={Math.sin(i * 60 * Math.PI / 180) * 200} r="30" fill={colors[i]} />,
              <rect key={`shape-${i}`} x={Math.cos(i * 60 * Math.PI / 180) * 200 - 25} y={Math.sin(i * 60 * Math.PI / 180) * 200 - 25} width="50" height="50" fill={colors[i]} />,
              <polygon key={`shape-${i}`} points={`${Math.cos(i * 60 * Math.PI / 180) * 200},${Math.sin(i * 60 * Math.PI / 180) * 200 - 30} ${Math.cos(i * 60 * Math.PI / 180) * 200 + 26},${Math.sin(i * 60 * Math.PI / 180) * 200 + 15} ${Math.cos(i * 60 * Math.PI / 180) * 200 - 26},${Math.sin(i * 60 * Math.PI / 180) * 200 + 15}`} fill={colors[i]} />
            ];
            
            return (
              <g key={`orbiting-${i}`}>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`${i * 60} 0 0`}
                  to={`${i * 60 + 360} 0 0`}
                  dur={`${10 + i * 2}s`}
                  repeatCount="indefinite"
                />
                {shapes[i % 3]}
              </g>
            );
          })}
        </g>
        
        {/* De Stijl grid lines */}
        <g opacity="0.6">
          <line x1="0" y1="200" x2="1400" y2="200" stroke="#000000" strokeWidth="8" />
          <line x1="0" y1="600" x2="1400" y2="600" stroke="#000000" strokeWidth="8" />
          <line x1="350" y1="0" x2="350" y2="800" stroke="#000000" strokeWidth="8" />
          <line x1="1050" y1="0" x2="1050" y2="800" stroke="#000000" strokeWidth="8" />
        </g>

        {/* Modern typography - Helvetica style */}
        <text
          x="700"
          y="100"
          textAnchor="middle"
          style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '72px', fontWeight: '900', letterSpacing: '-2px' }}
          fill="#000000"
        >
          새로운 세계로
          <animate
            attributeName="fill"
            values="#000000;#FF0000;#0000FF;#000000"
            dur="8s"
            repeatCount="indefinite"
          />
        </text>

        <text
          x="700"
          y="750"
          textAnchor="middle"
          style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '48px', fontWeight: '300', letterSpacing: '8px' }}
          fill="#000000"
        >
          NEW WORLD
          <animate
            attributeName="letter-spacing"
            values="8px;20px;8px"
            dur="5s"
            repeatCount="indefinite"
          />
        </text>
      </svg>

      {/* Modern art style scattered elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large color field blocks - Rothko inspired */}
        <div 
          className="absolute animate-expand" 
          style={{ 
            left: '10%', 
            top: '20%', 
            width: '250px', 
            height: '350px', 
            background: 'linear-gradient(180deg, #FF6B6B 0%, #FF0000 100%)', 
            opacity: 0.3,
            animation: 'expand 8s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute animate-expand" 
          style={{ 
            right: '15%', 
            bottom: '25%', 
            width: '300px', 
            height: '300px', 
            background: 'linear-gradient(45deg, #0000FF 0%, #000080 100%)', 
            opacity: 0.4,
            animation: 'expand 10s ease-in-out infinite'
          }}
        />
        
        {/* Minimalist dots pattern */}
        {[...Array(15)].map((_, i) => {
          const animDuration = Math.random() * 3 + 2;
          const opacity = Math.random() * 0.8 + 0.2;
          
          return (
            <div
              key={`dot-${i}`}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                borderRadius: '50%',
                backgroundColor: ['#FF0000', '#0000FF', '#FFDE00', '#000000', '#FFFFFF'][Math.floor(Math.random() * 5)],
                opacity: opacity,
                animation: `pulse ${animDuration}s ease-in-out infinite`
              }}
            />
          );
        })}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-30px) rotate(120deg);
          }
          66% {
            transform: translateY(20px) rotate(240deg);
          }
        }
        
        @keyframes expand {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.2; }
        }

        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}