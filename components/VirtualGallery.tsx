'use client';

import { useState, useEffect } from 'react';

export default function VirtualGallery() {
  const [rotation, setRotation] = useState(0);
  const [selectedArt, setSelectedArt] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const artworks = [
    { id: 1, title: '혁신의 시작', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', emoji: '🚀' },
    { id: 2, title: '디지털 전환', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', emoji: '💡' },
    { id: 3, title: '미래 비전', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', emoji: '🔮' },
    { id: 4, title: '글로벌 연결', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', emoji: '🌍' },
    { id: 5, title: '창의적 도전', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', emoji: '🎨' },
    { id: 6, title: '기술 혁명', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', emoji: '⚡' },
    { id: 7, title: '데이터 시대', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', emoji: '📊' },
    { id: 8, title: '스마트 세상', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', emoji: '🏙️' },
    { id: 9, title: 'AI 진화', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', emoji: '🤖' },
    { id: 10, title: '클라우드', color: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)', emoji: '☁️' },
    { id: 11, title: '사용자 중심', color: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', emoji: '👥' },
    { id: 12, title: '생태계', color: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)', emoji: '🌱' },
  ];

  return (
    <div style={{
      width: '1920px',
      height: '1080px',
      backgroundColor: '#0a0a0a',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Animated background */}
      <div style={{
        position: 'absolute',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0a0a0a 50%)',
        animation: 'pulse 10s ease-in-out infinite'
      }} />

      {/* Gallery Title */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        textAlign: 'center',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '60px',
          fontWeight: 'bold',
          margin: 0,
          background: 'linear-gradient(90deg, #fff, #888)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 30px rgba(255,255,255,0.3)'
        }}>
          VIRTUAL GALLERY
        </h1>
        <p style={{
          fontSize: '24px',
          opacity: 0.8,
          marginTop: '10px'
        }}>
          혁신과 미래의 전시관
        </p>
      </div>

      {/* 3D Carousel */}
      <div style={{
        width: '800px',
        height: '400px',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `rotateY(${rotation}deg)`,
        transition: 'transform 0.05s linear'
      }}>
        {artworks.map((art, index) => {
          const angle = (360 / artworks.length) * index;
          const isSelected = selectedArt === art.id;
          
          return (
            <div
              key={art.id}
              onClick={() => setSelectedArt(isSelected ? null : art.id)}
              style={{
                position: 'absolute',
                width: '300px',
                height: '400px',
                left: '50%',
                top: '50%',
                transform: `
                  translateX(-50%) 
                  translateY(-50%) 
                  rotateY(${angle}deg) 
                  translateZ(500px)
                  ${isSelected ? 'scale(1.1)' : ''}
                `,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Artwork Frame */}
              <div style={{
                width: '100%',
                height: '100%',
                background: isSelected ? '#fff' : '#1a1a1a',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: isSelected 
                  ? '0 20px 60px rgba(255,255,255,0.3), 0 0 100px rgba(255,255,255,0.1)'
                  : '0 10px 40px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                transform: isSelected ? 'translateZ(50px)' : ''
              }}>
                {/* Artwork Content */}
                <div style={{
                  width: '240px',
                  height: '240px',
                  background: art.color,
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '80px',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.2)',
                  marginBottom: '20px'
                }}>
                  {art.emoji}
                </div>
                
                {/* Artwork Title */}
                <h3 style={{
                  color: isSelected ? '#000' : '#fff',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '10px 0',
                  textAlign: 'center'
                }}>
                  {art.title}
                </h3>
                
                {/* Artwork Number */}
                <div style={{
                  color: isSelected ? '#666' : '#888',
                  fontSize: '16px',
                  opacity: 0.7
                }}>
                  작품 #{art.id}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        zIndex: 10
      }}>
        <button
          onClick={() => setRotation(prev => prev - 30)}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: 'white',
            borderRadius: '10px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ← 이전
        </button>
        
        <button
          onClick={() => setRotation(prev => prev + 30)}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: 'white',
            borderRadius: '10px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          다음 →
        </button>
      </div>

      {/* Info Panel */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '40px',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '20px 30px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          🎨 디지털 아트 갤러리
        </div>
        <div style={{ fontSize: '16px', opacity: 0.9 }}>
          {artworks.length}개의 작품 전시 중
        </div>
        <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '5px' }}>
          클릭하여 작품 확대 • 자동 회전 중
        </div>
      </div>

      {/* Selected Artwork Detail */}
      {selectedArt && (
        <div style={{
          position: 'absolute',
          top: '140px',
          right: '40px',
          width: '300px',
          padding: '20px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '15px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          zIndex: 20
        }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#333' }}>
            {artworks.find(a => a.id === selectedArt)?.title}
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
            이 작품은 우리의 디지털 여정을 상징합니다. 
            혁신과 창의성이 만나는 지점에서 탄생한 
            미래 지향적 비전을 담고 있습니다.
          </p>
          <button
            onClick={() => setSelectedArt(null)}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              background: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            닫기
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}