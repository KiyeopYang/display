'use client';

import { useEffect, useState, useRef } from 'react';

interface Satellite {
  id: number;
  radius: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
  trail: { x: number; y: number }[];
  glowIntensity: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface DataNode {
  x: number;
  y: number;
  value: number;
  pulsePhase: number;
  connections: number[];
}

export default function OrbitalTrajectoryPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dataNodes, setDataNodes] = useState<DataNode[]>([]);
  const [centralPulse, setCentralPulse] = useState(0);
  const frameRef = useRef<number>();
  const timeRef = useRef(0);
  const [metrics, setMetrics] = useState({
    dataFlow: 0,
    connections: 0,
    signalStrength: 0,
    networkLatency: 0
  });

  useEffect(() => {
    // Initialize satellites with different orbital parameters
    const initialSatellites: Satellite[] = [
      { id: 1, radius: 150, angle: 0, speed: 0.015, size: 8, color: '#00ffff', trail: [], glowIntensity: 1 },
      { id: 2, radius: 220, angle: Math.PI / 3, speed: 0.012, size: 6, color: '#ff00ff', trail: [], glowIntensity: 0.8 },
      { id: 3, radius: 300, angle: Math.PI, speed: 0.008, size: 10, color: '#ffff00', trail: [], glowIntensity: 1.2 },
      { id: 4, radius: 180, angle: Math.PI * 1.5, speed: -0.01, size: 7, color: '#00ff00', trail: [], glowIntensity: 0.9 },
      { id: 5, radius: 380, angle: Math.PI / 6, speed: 0.006, size: 12, color: '#ff6600', trail: [], glowIntensity: 1.5 },
      { id: 6, radius: 250, angle: Math.PI * 0.7, speed: -0.009, size: 5, color: '#66ffff', trail: [], glowIntensity: 0.7 }
    ];
    setSatellites(initialSatellites);

    // Initialize data nodes in a network pattern
    const nodes: DataNode[] = [];
    const nodeCount = 12;
    for (let i = 0; i < nodeCount; i++) {
      const angle = (Math.PI * 2 * i) / nodeCount;
      const radius = 450 + Math.sin(i * 0.5) * 50;
      nodes.push({
        x: 960 + Math.cos(angle) * radius,
        y: 540 + Math.sin(angle) * radius,
        value: Math.random() * 100,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: []
      });
    }
    
    // Create connections between nodes
    nodes.forEach((node, i) => {
      const connectionCount = 2 + Math.floor(Math.random() * 2);
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = (i + 1 + j * 3) % nodeCount;
        if (!node.connections.includes(targetIndex)) {
          node.connections.push(targetIndex);
        }
      }
    });
    
    setDataNodes(nodes);
  }, []);

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with fade effect for trails
    ctx.fillStyle = 'rgba(5, 5, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    timeRef.current += 0.016; // ~60fps

    // Update central pulse
    setCentralPulse(Math.sin(timeRef.current * 2) * 0.5 + 0.5);

    // Draw grid background
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw orbital rings
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)';
    ctx.lineWidth = 1;
    satellites.forEach(sat => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, sat.radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw dynamic ring glow
      const glowIntensity = Math.sin(timeRef.current * 3 + sat.angle) * 0.1 + 0.1;
      ctx.strokeStyle = `rgba(100, 200, 255, ${glowIntensity})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sat.radius, sat.angle - 0.5, sat.angle + 0.5);
      ctx.stroke();
    });

    // Draw connections between data nodes
    ctx.lineWidth = 1;
    dataNodes.forEach((node, i) => {
      node.connections.forEach(targetIndex => {
        const target = dataNodes[targetIndex];
        if (target) {
          const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
          const pulse = Math.sin(timeRef.current * 3 + i) * 0.3 + 0.3;
          gradient.addColorStop(0, `rgba(0, 255, 255, ${pulse})`);
          gradient.addColorStop(0.5, `rgba(255, 0, 255, ${pulse * 0.5})`);
          gradient.addColorStop(1, `rgba(0, 255, 255, ${pulse})`);
          
          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
          
          // Draw data packets traveling along connections
          const packetProgress = (timeRef.current * 0.3 + i * 0.1) % 1;
          const packetX = node.x + (target.x - node.x) * packetProgress;
          const packetY = node.y + (target.y - node.y) * packetProgress;
          
          ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
          ctx.beginPath();
          ctx.arc(packetX, packetY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });

    // Draw data nodes
    dataNodes.forEach((node, i) => {
      const pulse = Math.sin(timeRef.current * 2 + node.pulsePhase) * 0.5 + 0.5;
      
      // Node glow
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 20);
      gradient.addColorStop(0, `rgba(0, 255, 255, ${pulse})`);
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Node core
      ctx.fillStyle = `rgba(0, 255, 255, ${0.8 + pulse * 0.2})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Update and draw satellites
    setSatellites(prevSatellites => {
      return prevSatellites.map(sat => {
        // Update angle
        const newAngle = sat.angle + sat.speed;
        
        // Calculate position
        const x = centerX + Math.cos(newAngle) * sat.radius;
        const y = centerY + Math.sin(newAngle) * sat.radius;
        
        // Update trail
        const newTrail = [...sat.trail, { x, y }];
        if (newTrail.length > 30) newTrail.shift();
        
        // Draw trail
        ctx.strokeStyle = sat.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        newTrail.forEach((point, index) => {
          ctx.globalAlpha = index / newTrail.length * 0.5;
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        // Draw satellite glow
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, sat.size * 3);
        glowGradient.addColorStop(0, sat.color);
        glowGradient.addColorStop(0.5, `${sat.color}66`);
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, sat.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw satellite core
        ctx.fillStyle = sat.color;
        ctx.beginPath();
        ctx.arc(x, y, sat.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connection lines to center occasionally
        if (Math.sin(timeRef.current * 2 + sat.id) > 0.8) {
          const connectionGradient = ctx.createLinearGradient(x, y, centerX, centerY);
          connectionGradient.addColorStop(0, sat.color);
          connectionGradient.addColorStop(1, 'transparent');
          ctx.strokeStyle = connectionGradient;
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 10]);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(centerX, centerY);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        
        return { ...sat, angle: newAngle, trail: newTrail };
      });
    });

    // Draw central core
    const coreSize = 30 + centralPulse * 10;
    
    // Core glow layers
    for (let i = 3; i > 0; i--) {
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreSize * i);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${0.3 / i})`);
      gradient.addColorStop(0.5, `rgba(100, 200, 255, ${0.2 / i})`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize * i, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Core center
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreSize / 3, 0, Math.PI * 2);
    ctx.fill();

    // Create and update particles
    if (Math.random() > 0.7) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 100,
        color: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'][Math.floor(Math.random() * 4)]
      });
    }

    // Update and draw particles
    setParticles(prevParticles => {
      return prevParticles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;
        
        const lifeRatio = 1 - (particle.life / particle.maxLife);
        
        if (lifeRatio > 0) {
          ctx.globalAlpha = lifeRatio * 0.5;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          return true;
        }
        return false;
      });
    });

    // Update metrics with animated values
    setMetrics({
      dataFlow: Math.floor(50 + Math.sin(timeRef.current) * 30 + Math.random() * 20),
      connections: satellites.filter(s => Math.sin(timeRef.current * 2 + s.id) > 0.8).length,
      signalStrength: Math.floor(70 + Math.sin(timeRef.current * 0.5) * 20 + Math.random() * 10),
      networkLatency: Math.floor(20 + Math.sin(timeRef.current * 0.3) * 10 + Math.random() * 5)
    });

    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animate();
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [satellites, particles]);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        className="absolute inset-0"
      />
      
      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Title */}
        <div className="absolute top-12 left-12">
          <h1 className="text-6xl font-black text-white mb-2 tracking-wider"
              style={{ textShadow: '0 0 30px rgba(0, 255, 255, 0.5)' }}>
            궤도 시뮬레이션
          </h1>
          <p className="text-2xl text-cyan-300 tracking-wide">
            ORBITAL TRAJECTORY SYSTEM
          </p>
        </div>
        
        {/* Metrics Panel */}
        <div className="absolute top-12 right-12 bg-black/30 backdrop-blur-md rounded-lg p-6 border border-cyan-500/30">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">시스템 상태</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white text-lg">데이터 흐름</span>
              <span className="text-cyan-400 text-2xl font-bold">{metrics.dataFlow}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-lg">활성 연결</span>
              <span className="text-green-400 text-2xl font-bold">{metrics.connections}/6</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-lg">신호 강도</span>
              <span className="text-yellow-400 text-2xl font-bold">{metrics.signalStrength}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-lg">네트워크 지연</span>
              <span className="text-orange-400 text-2xl font-bold">{metrics.networkLatency}ms</span>
            </div>
          </div>
        </div>
        
        {/* Bottom Status Bar */}
        <div className="absolute bottom-12 left-12 right-12">
          <div className="grid grid-cols-6 gap-4">
            {satellites.map((sat, index) => (
              <div key={sat.id} 
                   className="bg-black/30 backdrop-blur-md rounded-lg p-4 border"
                   style={{ borderColor: sat.color }}>
                <div className="flex items-center justify-between">
                  <span className="text-white text-lg">위성 {sat.id}</span>
                  <div className="w-3 h-3 rounded-full animate-pulse"
                       style={{ backgroundColor: sat.color }} />
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  궤도: {sat.radius}km
                </div>
                <div className="text-sm text-gray-400">
                  속도: {Math.abs(sat.speed * 1000).toFixed(1)}m/s
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyan-500/30" />
        <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-cyan-500/30" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-cyan-500/30" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyan-500/30" />
      </div>
      
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0"
             style={{
               backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)',
               animation: 'scan 8s linear infinite'
             }} />
      </div>
      
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }
      `}</style>
    </div>
  );
}