'use client';

import { useEffect, useState } from 'react';

export default function WindowsViewPage() {
  const [time, setTime] = useState(new Date());
  const [clouds, setClouds] = useState<Array<{x: number, y: number, scale: number, speed: number}>>([]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Generate random clouds
    setClouds(Array.from({ length: 5 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 30,
      scale: 0.5 + Math.random() * 0.5,
      speed: 0.5 + Math.random() * 1.5
    })));
    
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const isDaytime = hours >= 6 && hours < 18;
  const isSunset = hours >= 18 && hours < 20;

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <style jsx>{`
        @keyframes floatCloud {
          from { transform: translateX(0); }
          to { transform: translateX(100vw); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes gentleWave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes birdFly {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -10px) scale(0.9); }
          50% { transform: translate(60px, 5px) scale(1.1); }
          75% { transform: translate(90px, -5px) scale(0.95); }
          100% { transform: translate(120px, 0) scale(1); }
        }

        .window-reflection {
          background: linear-gradient(135deg, 
            rgba(255,255,255,0.1) 0%,
            rgba(255,255,255,0.05) 40%,
            transparent 50%,
            rgba(255,255,255,0.03) 60%,
            transparent 100%);
        }
        
        .window-gloss {
          background: linear-gradient(180deg,
            rgba(255,255,255,0.2) 0%,
            rgba(255,255,255,0.1) 30%,
            transparent 50%);
        }
        
        .rain-effect {
          background: linear-gradient(180deg,
            transparent 0%,
            rgba(200,220,255,0.1) 50%,
            transparent 100%);
          animation: rain 1s linear infinite;
        }
        
        @keyframes rain {
          to { transform: translateY(20px); }
        }
      `}</style>

      {/* Main Grid of Windows - 3x3 Layout */}
      <div className="grid grid-cols-3 gap-6 p-8 h-full">
        
        {/* Window 1: City Night View */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-gray-700 bg-black">
          <div className="absolute inset-0">
            {/* Night sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-900 to-pink-900">
              {/* Stars */}
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={`star-${i}`}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 50}%`,
                    animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3}s`
                  }}
                />
              ))}
            </div>
            
            {/* City skyline */}
            <div className="absolute bottom-0 w-full h-1/2">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                {/* Buildings */}
                <rect x="20" y="80" width="40" height="120" fill="#1a1a2e" />
                <rect x="70" y="60" width="35" height="140" fill="#16213e" />
                <rect x="115" y="40" width="45" height="160" fill="#0f3460" />
                <rect x="170" y="70" width="40" height="130" fill="#1a1a2e" />
                <rect x="220" y="50" width="50" height="150" fill="#16213e" />
                <rect x="280" y="90" width="35" height="110" fill="#0f3460" />
                <rect x="325" y="65" width="40" height="135" fill="#1a1a2e" />
                
                {/* Window lights */}
                {Array.from({ length: 50 }).map((_, i) => (
                  <rect
                    key={`light-${i}`}
                    x={20 + (Math.random() * 340)}
                    y={60 + (Math.random() * 120)}
                    width="4"
                    height="6"
                    fill="#ffd700"
                    opacity={0.7 + Math.random() * 0.3}
                    style={{
                      animation: `flicker ${3 + Math.random() * 4}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 5}s`
                    }}
                  />
                ))}
              </svg>
            </div>
          </div>
          <div className="absolute inset-0 window-reflection pointer-events-none" />
          <div className="absolute inset-0 window-gloss pointer-events-none" />
        </div>

        {/* Window 2: Ocean Sunset */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-gray-700 bg-black">
          <div className="absolute inset-0">
            {/* Sky gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-pink-500 to-purple-600">
              {/* Sun */}
              <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
                <div className="w-24 h-24 bg-yellow-300 rounded-full shadow-[0_0_60px_20px_rgba(255,200,0,0.5)]" />
              </div>
              
              {/* Clouds */}
              {clouds.map((cloud, i) => (
                <div
                  key={`cloud-${i}`}
                  className="absolute"
                  style={{
                    left: `${cloud.x}%`,
                    top: `${cloud.y}%`,
                    animation: `floatCloud ${20 / cloud.speed}s linear infinite`,
                    transform: `scale(${cloud.scale})`
                  }}
                >
                  <svg width="80" height="40" viewBox="0 0 80 40">
                    <ellipse cx="20" cy="25" rx="15" ry="10" fill="rgba(255,255,255,0.7)" />
                    <ellipse cx="35" cy="25" rx="20" ry="12" fill="rgba(255,255,255,0.7)" />
                    <ellipse cx="55" cy="25" rx="15" ry="10" fill="rgba(255,255,255,0.7)" />
                  </svg>
                </div>
              ))}
            </div>
            
            {/* Ocean */}
            <div className="absolute bottom-0 w-full h-1/3">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800">
                {/* Waves */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={`wave-${i}`}
                    className="absolute w-full"
                    style={{
                      bottom: `${i * 15}px`,
                      height: '10px',
                      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                      animation: `gentleWave ${2 + i * 0.5}s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-0 window-reflection pointer-events-none" />
          <div className="absolute inset-0 window-gloss pointer-events-none" />
        </div>

        {/* Window 3: Mountain Forest */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-gray-700 bg-black">
          <div className="absolute inset-0">
            {/* Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-400 to-sky-500" />
            
            {/* Mountains */}
            <svg viewBox="0 0 400 300" className="absolute bottom-0 w-full h-full">
              {/* Far mountains */}
              <polygon points="0,200 100,100 200,150 300,80 400,140 400,300 0,300" 
                       fill="#8B7355" opacity="0.5" />
              {/* Mid mountains */}
              <polygon points="0,180 150,120 250,160 400,100 400,300 0,300" 
                       fill="#6B5B45" opacity="0.7" />
              {/* Near mountains */}
              <polygon points="0,220 120,150 280,180 400,160 400,300 0,300" 
                       fill="#4B3B25" />
              
              {/* Forest */}
              {Array.from({ length: 30 }).map((_, i) => (
                <g key={`tree-${i}`}>
                  <polygon 
                    points={`${i * 15},300 ${i * 15 + 5},280 ${i * 15 + 10},300`}
                    fill="#2d5016"
                  />
                  <rect 
                    x={i * 15 + 3} 
                    y="295" 
                    width="4" 
                    height="10" 
                    fill="#3e2723"
                  />
                </g>
              ))}
            </svg>
            
            {/* Birds */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`bird-${i}`}
                className="absolute"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${20 + i * 10}%`,
                  animation: `birdFly ${10 + i * 2}s linear infinite`
                }}
              >
                <svg width="20" height="10" viewBox="0 0 20 10">
                  <path d="M 0 5 Q 5 0, 10 5 Q 15 0, 20 5" 
                        stroke="#333" 
                        strokeWidth="1.5" 
                        fill="none" />
                </svg>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 window-reflection pointer-events-none" />
          <div className="absolute inset-0 window-gloss pointer-events-none" />
        </div>

        {/* Window 4: Rainy Street */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-gray-700 bg-black">
          <div className="absolute inset-0">
            {/* Dark cloudy sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-600" />
            
            {/* Street scene */}
            <div className="absolute bottom-0 w-full h-2/3">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-900">
                {/* Street */}
                <div className="absolute bottom-0 w-full h-1/3 bg-gray-800">
                  {/* Wet street reflection */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-50" />
                </div>
                
                {/* Street lamps */}
                {[100, 250].map((x, i) => (
                  <g key={`lamp-${i}`}>
                    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full">
                      <rect x={x} y="150" width="5" height="100" fill="#333" />
                      <circle cx={x + 2.5} cy="150" r="15" fill="#ffeb3b" opacity="0.6" />
                      <circle cx={x + 2.5} cy="150" r="25" fill="#ffeb3b" opacity="0.3" />
                      <circle cx={x + 2.5} cy="150" r="40" fill="#ffeb3b" opacity="0.1" />
                    </svg>
                  </g>
                ))}
              </div>
            </div>
            
            {/* Rain effect */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={`rain-${i}`}
                  className="absolute w-0.5 h-4 bg-blue-200 opacity-30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-20px`,
                    animation: `rain ${0.5 + Math.random() * 0.5}s linear infinite`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
          <div className="absolute inset-0 window-reflection pointer-events-none" />
          <div className="absolute inset-0 window-gloss pointer-events-none" />
        </div>

        {/* Window 5: Space View */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-gray-700 bg-black">
          <div className="absolute inset-0">
            {/* Deep space background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950 to-black">
              {/* Stars */}
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={`space-star-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${Math.random() * 3}px`,
                    height: `${Math.random() * 3}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: ['#fff', '#ffd4e5', '#d4e5ff', '#ffffd4'][Math.floor(Math.random() * 4)],
                    animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              ))}
              
              {/* Nebula effect */}
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-purple-600 rounded-full opacity-20 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-pink-600 rounded-full opacity-20 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-600 rounded-full opacity-30 blur-2xl" />
              </div>
              
              {/* Planet */}
              <div className="absolute bottom-10 right-10">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-purple-800 rounded-full shadow-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white opacity-20 rounded-full" />
                  {/* Ring */}
                  <div className="absolute -inset-4 border-4 border-gray-400 rounded-full opacity-50 transform rotate-12" 
                       style={{ borderStyle: 'solid none' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 window-reflection pointer-events-none" />
          <div className="absolute inset-0 window-gloss pointer-events-none" />
        </div>

        {/* Window 6: Autumn Park */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-gray-700 bg-black">
          <div className="absolute inset-0">
            {/* Autumn sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-200 via-yellow-100 to-orange-300" />
            
            {/* Park scene */}
            <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full">
              {/* Ground */}
              <rect x="0" y="200" width="400" height="100" fill="#8B7355" />
              
              {/* Trees with autumn colors */}
              {[50, 150, 250, 350].map((x, i) => (
                <g key={`autumn-tree-${i}`}>
                  {/* Trunk */}
                  <rect x={x - 10} y="150" width="20" height="60" fill="#654321" />
                  {/* Foliage */}
                  <circle cx={x} cy="140" r="40" fill={['#ff6b35', '#ff9558', '#ffd93d', '#ff8c42'][i]} opacity="0.9" />
                  <circle cx={x - 15} cy="145" r="25" fill={['#ff8c42', '#ff6b35', '#ff9558', '#ffd93d'][i]} opacity="0.8" />
                  <circle cx={x + 15} cy="145" r="25" fill={['#ffd93d', '#ff8c42', '#ff6b35', '#ff9558'][i]} opacity="0.8" />
                </g>
              ))}
              
              {/* Falling leaves */}
              {Array.from({ length: 15 }).map((_, i) => (
                <ellipse
                  key={`leaf-${i}`}
                  cx={Math.random() * 400}
                  cy={Math.random() * 200}
                  rx="4"
                  ry="6"
                  fill={['#ff6b35', '#ff9558', '#ffd93d'][Math.floor(Math.random() * 3)]}
                  transform={`rotate(${Math.random() * 360} ${Math.random() * 400} ${Math.random() * 200})`}
                  opacity="0.7"
                />
              ))}
              
              {/* Park bench */}
              <rect x="180" y="180" width="40" height="3" fill="#654321" />
              <rect x="185" y="183" width="3" height="20" fill="#654321" />
              <rect x="212" y="183" width="3" height="20" fill="#654321" />
            </svg>
          </div>
          <div className="absolute inset-0 window-reflection pointer-events-none" />
          <div className="absolute inset-0 window-gloss pointer-events-none" />
        </div>

        {/* Window 7: Northern Lights */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-gray-700 bg-black">
          <div className="absolute inset-0">
            {/* Night sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-950 to-blue-950">
              {/* Stars */}
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={`aurora-star-${i}`}
                  className="absolute w-0.5 h-0.5 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`
                  }}
                />
              ))}
              
              {/* Aurora effect */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-10 w-full h-32 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 opacity-30 blur-2xl transform -skew-y-12"
                       style={{ animation: 'gentleWave 8s ease-in-out infinite' }} />
                  <div className="absolute top-20 w-full h-24 bg-gradient-to-r from-blue-400 via-green-400 to-cyan-400 opacity-25 blur-xl transform skew-y-6"
                       style={{ animation: 'gentleWave 10s ease-in-out infinite reverse' }} />
                  <div className="absolute top-32 w-full h-20 bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 opacity-20 blur-2xl"
                       style={{ animation: 'gentleWave 12s ease-in-out infinite' }} />
                </div>
              </div>
              
              {/* Snowy mountains silhouette */}
              <svg viewBox="0 0 400 300" className="absolute bottom-0 w-full h-1/2">
                <polygon points="0,150 100,50 200,100 300,30 400,80 400,300 0,300" 
                         fill="#1a1a2e" />
                <polygon points="0,150 100,50 200,100 300,30 400,80 400,300 0,300" 
                         fill="url(#snow-gradient)" opacity="0.3" />
                <defs>
                  <linearGradient id="snow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="absolute inset-0 window-reflection pointer-events-none" />
          <div className="absolute inset-0 window-gloss pointer-events-none" />
        </div>

        {/* Window 8: Cherry Blossoms */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-gray-700 bg-black">
          <div className="absolute inset-0">
            {/* Spring sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-pink-100 via-blue-100 to-pink-200" />
            
            {/* Cherry blossom tree */}
            <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full">
              {/* Tree trunk and branches */}
              <path d="M 200 300 L 200 180 L 150 120 M 200 180 L 250 120 M 200 150 L 180 100 M 200 150 L 220 100"
                    stroke="#654321" strokeWidth="8" fill="none" />
              
              {/* Blossoms */}
              {Array.from({ length: 40 }).map((_, i) => {
                const x = 100 + Math.random() * 200;
                const y = 80 + Math.random() * 100;
                return (
                  <g key={`blossom-${i}`}>
                    <circle cx={x} cy={y} r="8" fill="#ffb7c5" opacity="0.8" />
                    <circle cx={x - 3} cy={y - 3} r="5" fill="#ffc0cb" opacity="0.9" />
                  </g>
                );
              })}
              
              {/* Falling petals */}
              {Array.from({ length: 20 }).map((_, i) => (
                <ellipse
                  key={`petal-${i}`}
                  cx={Math.random() * 400}
                  cy={Math.random() * 300}
                  rx="3"
                  ry="5"
                  fill="#ffb7c5"
                  transform={`rotate(${Math.random() * 360} ${Math.random() * 400} ${Math.random() * 300})`}
                  opacity="0.6"
                  style={{
                    animation: `rain ${3 + Math.random() * 2}s linear infinite`,
                    animationDelay: `${Math.random() * 3}s`
                  }}
                />
              ))}
              
              {/* Ground */}
              <rect x="0" y="250" width="400" height="50" fill="#7cb342" />
              {/* Grass texture */}
              {Array.from({ length: 100 }).map((_, i) => (
                <line
                  key={`grass-${i}`}
                  x1={i * 4}
                  y1="250"
                  x2={i * 4}
                  y2={245 + Math.random() * 10}
                  stroke="#558b2f"
                  strokeWidth="1"
                />
              ))}
            </svg>
          </div>
          <div className="absolute inset-0 window-reflection pointer-events-none" />
          <div className="absolute inset-0 window-gloss pointer-events-none" />
        </div>

        {/* Window 9: Underwater Scene */}
        <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 border-gray-700 bg-black">
          <div className="absolute inset-0">
            {/* Ocean depth gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-600 via-blue-700 to-blue-950">
              {/* Light rays from surface */}
              <div className="absolute inset-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={`ray-${i}`}
                    className="absolute top-0 bg-gradient-to-b from-white to-transparent opacity-10"
                    style={{
                      left: `${i * 25}%`,
                      width: '10%',
                      height: '100%',
                      transform: `skewX(${-20 + i * 5}deg)`,
                      animation: `shimmer ${10 + i * 2}s linear infinite`
                    }}
                  />
                ))}
              </div>
              
              {/* Fish */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`fish-${i}`}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 80}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animation: `birdFly ${15 + Math.random() * 10}s linear infinite`
                  }}
                >
                  <svg width="30" height="15" viewBox="0 0 30 15">
                    <ellipse cx="15" cy="7.5" rx="10" ry="4" fill={['#ff6b35', '#ffd93d', '#4ecdc4'][i % 3]} />
                    <polygon points="5,7.5 0,3 0,12" fill={['#ff6b35', '#ffd93d', '#4ecdc4'][i % 3]} />
                    <circle cx="20" cy="6" r="1" fill="black" />
                  </svg>
                </div>
              ))}
              
              {/* Coral and seaweed */}
              <svg viewBox="0 0 400 300" className="absolute bottom-0 w-full h-1/3">
                {/* Seaweed */}
                {[50, 120, 200, 280, 350].map((x, i) => (
                  <path
                    key={`seaweed-${i}`}
                    d={`M ${x} 300 Q ${x + 10} 280, ${x} 260 T ${x + 5} 240`}
                    stroke="#2d5016"
                    strokeWidth="4"
                    fill="none"
                    opacity="0.7"
                    style={{
                      animation: `gentleWave ${3 + i * 0.5}s ease-in-out infinite`,
                      transformOrigin: 'bottom'
                    }}
                  />
                ))}
                {/* Coral */}
                <circle cx="100" cy="280" r="20" fill="#ff6b9d" opacity="0.8" />
                <circle cx="90" cy="285" r="15" fill="#c44569" opacity="0.8" />
                <circle cx="300" cy="275" r="25" fill="#ff9ff3" opacity="0.7" />
                <circle cx="310" cy="280" r="18" fill="#ee5a6f" opacity="0.8" />
              </svg>
              
              {/* Bubbles */}
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={`bubble-${i}`}
                  className="absolute rounded-full border border-white opacity-30"
                  style={{
                    width: `${5 + Math.random() * 15}px`,
                    height: `${5 + Math.random() * 15}px`,
                    left: `${Math.random() * 100}%`,
                    bottom: '0',
                    animation: `floatUp ${5 + Math.random() * 5}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              ))}
            </div>
          </div>
          <div className="absolute inset-0 window-reflection pointer-events-none" />
          <div className="absolute inset-0 window-gloss pointer-events-none" />
        </div>
      </div>

      {/* Central title overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <h1 className="text-7xl font-black text-white mb-4 drop-shadow-2xl">
            창 너머의 세상
          </h1>
          <p className="text-3xl text-white/80 drop-shadow-xl">
            Beyond the Windows
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatUp {
          from {
            transform: translateY(0);
            opacity: 0.3;
          }
          to {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}