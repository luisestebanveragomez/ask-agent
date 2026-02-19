import { cn } from '@/lib/utils'

interface ParallaxLayersProps {
  scrollProgress: number
}

export function ParallaxLayers({ scrollProgress }: ParallaxLayersProps) {
  return (
    <>
      {/* Capa de fondo - Montañas distantes */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          transform: `translateY(${scrollProgress * 20}px)`,
          background: 'linear-gradient(to bottom, #065f46 0%, #047857 50%, #059669 100%)'
        }}
      />

      {/* Capa 1 - Árboles muy lejanos (siluetas) */}
      <div 
        className="fixed inset-0 z-5 pointer-events-none"
        style={{
          transform: `translateY(${scrollProgress * 40}px) scale(${1 + scrollProgress * 0.1})`,
          opacity: 1 - scrollProgress * 0.3
        }}
      >
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-green-900/60 to-transparent" />
        
        {/* Siluetas de árboles lejanos */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "absolute bottom-0 bg-green-900/40 rounded-t-full",
              "opacity-60"
            )}
            style={{
              left: `${(i * 15) + Math.sin(i) * 10}%`,
              width: `${60 + Math.cos(i) * 20}px`,
              height: `${120 + Math.sin(i * 2) * 40}px`,
              transform: `translateY(${scrollProgress * (30 + i * 5)}px)`
            }}
          />
        ))}
      </div>

      {/* Capa 2 - Niebla atmosférica */}
      <div 
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          transform: `translateX(${scrollProgress * -30}px) translateY(${scrollProgress * 60}px)`,
          opacity: 0.7 - scrollProgress * 0.3
        }}
      >
        <div 
          className="w-full h-full bg-gradient-radial from-transparent via-white/10 to-transparent"
          style={{
            background: `radial-gradient(ellipse at ${50 + scrollProgress * 20}% ${30 + scrollProgress * 40}%, 
                         rgba(255,255,255,0.1) 0%, 
                         rgba(255,255,255,0.05) 40%, 
                         transparent 80%)`
          }}
        />
      </div>

      {/* Capa 3 - Rayos de sol */}
      <div 
        className="fixed inset-0 z-15 pointer-events-none overflow-hidden"
        style={{
          transform: `translateX(${scrollProgress * -20}px)`,
          opacity: 0.8 - scrollProgress * 0.4
        }}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-b from-yellow-200/20 via-yellow-200/10 to-transparent"
            style={{
              left: `${20 + i * 25}%`,
              top: '-20%',
              width: '3px',
              height: '120%',
              transform: `rotate(${-15 + i * 10}deg) translateY(${scrollProgress * (20 + i * 10)}px)`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Capa 4 - Hojas cayendo */}
      {scrollProgress > 0.3 && (
        <div 
          className="fixed inset-0 z-20 pointer-events-none"
          style={{
            transform: `translateY(${(scrollProgress - 0.3) * 100}px)`
          }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-3 bg-amber-600/70 rounded-full animate-pulse"
              style={{
                left: `${(i * 8) + Math.sin(i) * 10}%`,
                top: `${-10 + Math.cos(i) * 20}%`,
                transform: `rotate(${i * 30}deg) translateY(${(scrollProgress - 0.3) * (200 + i * 50)}px)`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      )}

      {/* Capa 5 - Vignette para enfoque cinematográfico */}
      <div 
        className="fixed inset-0 z-25 pointer-events-none"
        style={{
          opacity: 0.3 + scrollProgress * 0.4,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)'
        }}
      />

      {/* Overlays de texto narrativo */}
      {scrollProgress < 0.2 && (
        <div 
          className="fixed top-1/2 left-1/2 z-30 transform -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ opacity: 1 - (scrollProgress / 0.2) }}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white/90 mb-4">
            Welcome to my digital journey...
          </h2>
          <p className="text-lg text-white/70">
            Where creativity meets technology
          </p>
        </div>
      )}

      {scrollProgress >= 0.3 && scrollProgress < 0.6 && (
        <div 
          className="fixed top-1/3 right-8 z-30 text-right"
          style={{ 
            opacity: Math.sin((scrollProgress - 0.3) / 0.3 * Math.PI),
            transform: `translateX(${(1 - (scrollProgress - 0.3) / 0.3) * 100}px)`
          }}
        >
          <p className="text-xl text-white/80 italic">
            Every line of code tells a story...
          </p>
        </div>
      )}

      {scrollProgress >= 0.6 && scrollProgress < 0.9 && (
        <div 
          className="fixed bottom-1/3 left-8 z-30"
          style={{ 
            opacity: Math.sin((scrollProgress - 0.6) / 0.3 * Math.PI),
            transform: `translateY(${(1 - (scrollProgress - 0.6) / 0.3) * 50}px)`
          }}
        >
          <p className="text-xl text-white/90 font-medium">
            Innovation emerges from the shadows...
          </p>
          <p className="text-lg text-white/70 mt-2">
            Where passion meets possibility
          </p>
        </div>
      )}

      {scrollProgress >= 0.9 && (
        <div 
          className="fixed top-8 left-1/2 transform -translate-x-1/2 z-30 text-center"
          style={{ opacity: (scrollProgress - 0.9) / 0.1 }}
        >
          <h3 className="text-3xl md:text-5xl font-bold text-white/95">
            The Connection
          </h3>
          <p className="text-lg text-white/80 mt-2">
            Where dreams and reality unite in perfect harmony
          </p>
        </div>
      )}
    </>
  )
}