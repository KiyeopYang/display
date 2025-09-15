'use client';

import { useState, useEffect } from 'react';

export default function CozyRoom() {
  const [time, setTime] = useState(new Date());
  const [lampOn, setLampOn] = useState(true);
  const [tvChannel, setTvChannel] = useState(0);
  const [fireIntensity, setFireIntensity] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tvChannels = ['📺', '🎬', '🎮', '📰', '🎵'];

  return (
    <div style={{
      width: '1920px',
      height: '1080px',
      background: lampOn 
        ? 'linear-gradient(180deg, #2c1810 0%, #3d2817 50%, #4a3020 100%)'
        : 'linear-gradient(180deg, #0a0505 0%, #1a0f0f 50%, #251515 100%)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 1s ease'
    }}>
      {/* Room Perspective Container */}
      <div style={{
        width: '100%',
        height: '100%',
        perspective: '1000px',
        position: 'relative'
      }}>
        
        {/* Floor */}
        <div style={{
          position: 'absolute',
          width: '2000px',
          height: '800px',
          bottom: '-200px',
          left: '-40px',
          background: `repeating-linear-gradient(
            90deg,
            #8b6f47,
            #8b6f47 80px,
            #7a5f37 80px,
            #7a5f37 160px
          )`,
          transform: 'rotateX(70deg)',
          transformOrigin: 'center bottom',
          boxShadow: lampOn 
            ? 'inset 0 0 200px rgba(0,0,0,0.5)'
            : 'inset 0 0 400px rgba(0,0,0,0.9)'
        }} />

        {/* Back Wall */}
        <div style={{
          position: 'absolute',
          width: '1920px',
          height: '700px',
          top: '0',
          left: '0',
          background: lampOn
            ? 'linear-gradient(180deg, #d4a574 0%, #c4946a 100%)'
            : 'linear-gradient(180deg, #3a2a1a 0%, #2a1a0a 100%)',
          boxShadow: 'inset 0 -50px 100px rgba(0,0,0,0.3)',
          transition: 'background 1s ease'
        }}>
          
          {/* Window */}
          <div style={{
            position: 'absolute',
            width: '400px',
            height: '500px',
            top: '100px',
            left: '200px',
            background: 'linear-gradient(180deg, #0a1929 0%, #1a2f4f 100%)',
            border: '20px solid #6b4423',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '10px',
            padding: '10px'
          }}>
            {/* Window panes */}
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                background: 'linear-gradient(135deg, #001d3d 0%, #003566 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Stars */}
                {[...Array(3)].map((_, j) => (
                  <div key={j} style={{
                    position: 'absolute',
                    width: '2px',
                    height: '2px',
                    background: 'white',
                    borderRadius: '50%',
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `twinkle ${2 + Math.random() * 3}s infinite`
                  }} />
                ))}
              </div>
            ))}
          </div>

          {/* Picture Frames */}
          <div style={{
            position: 'absolute',
            width: '250px',
            height: '300px',
            top: '150px',
            right: '400px',
            background: 'linear-gradient(135deg, #8b6f47 0%, #6b4423 100%)',
            border: '15px solid #4a3420',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '90%',
              height: '90%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '60px'
            }}>
              🏔️
            </div>
          </div>

          <div style={{
            position: 'absolute',
            width: '200px',
            height: '250px',
            top: '180px',
            right: '150px',
            background: 'linear-gradient(135deg, #8b6f47 0%, #6b4423 100%)',
            border: '15px solid #4a3420',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            transform: 'rotate(-5deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '90%',
              height: '90%',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '50px'
            }}>
              🌅
            </div>
          </div>
        </div>

        {/* Fireplace */}
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '400px',
          bottom: '180px',
          left: '710px',
          background: 'linear-gradient(180deg, #2c1810 0%, #1a0f08 100%)',
          border: '30px solid #4a3420',
          borderRadius: '10px 10px 0 0',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8), 0 0 50px rgba(0,0,0,0.5)'
        }}>
          {/* Fire */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            height: '200px',
            filter: `brightness(${fireIntensity})`,
            transition: 'filter 0.5s ease'
          }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                bottom: '0',
                left: `${20 + i * 60}px`,
                width: '60px',
                height: `${100 + Math.random() * 100}px`,
                background: `radial-gradient(ellipse at bottom, 
                  rgba(255,200,0,0.8) 0%, 
                  rgba(255,100,0,0.6) 40%, 
                  rgba(255,0,0,0.3) 70%, 
                  transparent 100%)`,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                animation: `flame ${1 + Math.random()}s infinite alternate`,
                transformOrigin: 'bottom center'
              }} />
            ))}
          </div>
          {/* Fireplace logs */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '350px',
            height: '40px',
            background: 'linear-gradient(90deg, #2a1810 0%, #3a2820 50%, #2a1810 100%)',
            borderRadius: '20px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.8)'
          }} />
        </div>

        {/* Couch */}
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '250px',
          bottom: '200px',
          left: '100px',
          transform: 'rotateY(-10deg)'
        }}>
          {/* Couch back */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '150px',
            background: 'linear-gradient(180deg, #8b4513 0%, #654321 100%)',
            borderRadius: '20px 20px 0 0',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.4)'
          }} />
          {/* Couch seat */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100px',
            bottom: '0',
            background: 'linear-gradient(180deg, #a0522d 0%, #8b4513 100%)',
            borderRadius: '0 0 20px 20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            {/* Cushions */}
            {[0, 200, 400].map((left, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: '180px',
                height: '80px',
                top: '-60px',
                left: `${left}px`,
                background: 'linear-gradient(180deg, #cd853f 0%, #a0522d 100%)',
                borderRadius: '10px',
                boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.3)',
                transform: `rotate(${-2 + i * 2}deg)`
              }} />
            ))}
          </div>
        </div>

        {/* Coffee Table */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '150px',
          bottom: '250px',
          left: '750px',
          transform: 'rotateY(15deg)'
        }}>
          {/* Table top */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '20px',
            top: '0',
            background: 'linear-gradient(90deg, #654321 0%, #8b4513 50%, #654321 100%)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
            borderRadius: '5px'
          }}>
            {/* Coffee mug */}
            <div style={{
              position: 'absolute',
              width: '40px',
              height: '50px',
              top: '-50px',
              left: '50px',
              background: 'linear-gradient(180deg, #f5deb3 0%, #daa520 100%)',
              borderRadius: '5px 5px 10px 10px',
              boxShadow: '0 5px 10px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                position: 'absolute',
                width: '15px',
                height: '25px',
                right: '-15px',
                top: '10px',
                border: '4px solid #daa520',
                borderLeft: 'none',
                borderRadius: '0 10px 10px 0'
              }} />
            </div>
            {/* Book */}
            <div style={{
              position: 'absolute',
              width: '80px',
              height: '60px',
              top: '-60px',
              right: '50px',
              background: 'linear-gradient(135deg, #8b0000 0%, #a52a2a 100%)',
              transform: 'rotate(-5deg)',
              boxShadow: '0 5px 10px rgba(0,0,0,0.3)',
              borderRadius: '2px'
            }} />
          </div>
          {/* Table legs */}
          {[20, 260].map((left, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: '20px',
              height: '130px',
              top: '20px',
              left: `${left}px`,
              background: 'linear-gradient(180deg, #4a3420 0%, #3a2410 100%)',
              boxShadow: '0 0 10px rgba(0,0,0,0.3)'
            }} />
          ))}
        </div>

        {/* TV */}
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '300px',
          top: '200px',
          right: '100px',
          transform: 'rotateY(10deg)'
        }}>
          {/* TV Screen */}
          <div style={{
            width: '100%',
            height: '250px',
            background: '#000',
            border: '20px solid #2a2a2a',
            borderRadius: '10px',
            position: 'relative',
            boxShadow: '0 10px 50px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: tvChannel % 2 === 0 
                ? 'linear-gradient(45deg, #ff6b6b 0%, #4ecdc4 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '80px',
              animation: 'flicker 0.1s infinite'
            }}>
              {tvChannels[tvChannel]}
            </div>
          </div>
          {/* TV Stand */}
          <div style={{
            width: '100px',
            height: '30px',
            margin: '10px auto 0',
            background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)',
            boxShadow: '0 5px 10px rgba(0,0,0,0.5)'
          }} />
        </div>

        {/* Table Lamp */}
        <div style={{
          position: 'absolute',
          width: '100px',
          height: '200px',
          bottom: '330px',
          left: '600px'
        }}>
          {/* Lamp shade */}
          <div style={{
            width: '100px',
            height: '80px',
            background: lampOn
              ? 'radial-gradient(ellipse at center, rgba(255,220,120,0.9) 0%, rgba(255,200,100,0.7) 100%)'
              : 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)',
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
            boxShadow: lampOn ? '0 0 50px rgba(255,220,120,0.6)' : 'none',
            transition: 'all 0.5s ease',
            cursor: 'pointer'
          }} onClick={() => setLampOn(!lampOn)} />
          {/* Lamp stand */}
          <div style={{
            width: '10px',
            height: '100px',
            margin: '0 auto',
            background: 'linear-gradient(180deg, #8b6f47 0%, #6b4423 100%)',
            boxShadow: '0 5px 10px rgba(0,0,0,0.3)'
          }} />
          {/* Lamp base */}
          <div style={{
            width: '60px',
            height: '20px',
            margin: '0 auto',
            background: 'linear-gradient(180deg, #6b4423 0%, #4a3420 100%)',
            borderRadius: '50%',
            boxShadow: '0 5px 10px rgba(0,0,0,0.4)'
          }} />
        </div>

        {/* Bookshelf */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '400px',
          top: '150px',
          left: '50px',
          background: 'linear-gradient(180deg, #654321 0%, #4a3420 100%)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'grid',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '10px',
          padding: '10px'
        }}>
          {[...Array(3)].map((_, shelf) => (
            <div key={shelf} style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              borderBottom: '5px solid #3a2410'
            }}>
              {[...Array(5)].map((_, book) => (
                <div key={book} style={{
                  width: `${20 + Math.random() * 20}px`,
                  height: `${60 + Math.random() * 40}px`,
                  background: `hsl(${Math.random() * 360}, 50%, 40%)`,
                  borderRadius: '2px',
                  transform: `rotate(${-2 + Math.random() * 4}deg)`,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                }} />
              ))}
            </div>
          ))}
        </div>

        {/* Rug */}
        <div style={{
          position: 'absolute',
          width: '800px',
          height: '400px',
          bottom: '100px',
          left: '560px',
          background: `radial-gradient(ellipse at center, 
            rgba(139, 69, 19, 0.8) 0%, 
            rgba(160, 82, 45, 0.7) 30%, 
            rgba(139, 69, 19, 0.8) 60%,
            rgba(101, 67, 33, 0.9) 100%)`,
          borderRadius: '50%',
          transform: 'rotateX(75deg)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          border: '10px solid rgba(101, 67, 33, 0.5)'
        }} />

        {/* Clock */}
        <div style={{
          position: 'absolute',
          width: '100px',
          height: '100px',
          top: '50px',
          left: '910px',
          background: 'radial-gradient(circle, #f5deb3 0%, #daa520 100%)',
          borderRadius: '50%',
          border: '5px solid #8b6f47',
          boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'relative',
            width: '80px',
            height: '80px'
          }}>
            {/* Hour hand */}
            <div style={{
              position: 'absolute',
              width: '3px',
              height: '25px',
              background: '#333',
              left: '50%',
              top: '50%',
              transformOrigin: 'center bottom',
              transform: `translateX(-50%) translateY(-100%) rotate(${(time.getHours() % 12) * 30}deg)`
            }} />
            {/* Minute hand */}
            <div style={{
              position: 'absolute',
              width: '2px',
              height: '35px',
              background: '#333',
              left: '50%',
              top: '50%',
              transformOrigin: 'center bottom',
              transform: `translateX(-50%) translateY(-100%) rotate(${time.getMinutes() * 6}deg)`
            }} />
            {/* Center dot */}
            <div style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              background: '#333',
              borderRadius: '50%',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }} />
          </div>
        </div>

        {/* Controls */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          gap: '10px',
          zIndex: 100
        }}>
          <button
            onClick={() => setLampOn(!lampOn)}
            style={{
              padding: '10px 20px',
              background: lampOn ? '#ffd700' : '#333',
              color: lampOn ? '#333' : '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            💡 {lampOn ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setTvChannel((prev) => (prev + 1) % tvChannels.length)}
            style={{
              padding: '10px 20px',
              background: '#4a3420',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            📺 채널 변경
          </button>
          <button
            onClick={() => setFireIntensity(prev => prev === 1 ? 1.5 : prev === 1.5 ? 0.5 : 1)}
            style={{
              padding: '10px 20px',
              background: '#8b4513',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            🔥 불 세기
          </button>
        </div>

        {/* Info Panel */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '15px 20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>🏠 아늑한 거실</h2>
          <p style={{ margin: '5px 0', fontSize: '14px', opacity: 0.9 }}>
            시간: {time.toLocaleTimeString('ko-KR')}
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px', opacity: 0.9 }}>
            조명을 켜고 끄고, TV 채널을 바꾸고, 벽난로 불을 조절해보세요
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes flame {
          0% { 
            transform: scale(1) rotate(-2deg);
            height: 100px;
          }
          50% { 
            transform: scale(1.1) rotate(2deg);
            height: 120px;
          }
          100% { 
            transform: scale(0.95) rotate(-1deg);
            height: 110px;
          }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.98; }
        }
      `}</style>
    </div>
  );
}