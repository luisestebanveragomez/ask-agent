import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll } from '@react-three/drei'
import { cn } from '@/lib/utils'
import { ScrollNarrative } from './ScrollNarrative'
import { ForestEnvironmentEnhanced } from './ForestEnvironmentEnhanced'
import { CharacterWalkEnhanced } from './CharacterWalkEnhanced'
import { HorseRevealEnhanced } from './HorseRevealEnhanced'
import { ParallaxLayers } from './ParallaxLayers'
import { PostProcessingEffects } from './PostProcessingEffects'
import { MagicalParticles } from './MagicalParticles'
import { PerformanceMonitor } from './PerformanceMonitor'

interface ForestStoryProps {
  className?: string
}

export function ForestStoryComponentEnhanced({ className }: ForestStoryProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Detect device capabilities
    const detectDevice = () => {
      const isMobileDevice = /iPhone|iPad|Android/i.test(navigator.userAgent)
      const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4
      const isSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4
      
      setIsMobile(isMobileDevice)
      
      if (isMobileDevice || hasLowMemory || isSlowCPU) {
        setPerformanceLevel('low')
      } else if (hasLowMemory) {
        setPerformanceLevel('medium')
      } else {
        setPerformanceLevel('high')
      }
    }

    detectDevice()

    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        const progress = scrollTop / (scrollHeight - clientHeight)
        setScrollProgress(Math.min(Math.max(progress, 0), 1))
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Dynamic quality settings based on performance
  const qualitySettings = {
    high: {
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      antialias: true,
      shadowMapSize: 2048,
      enablePostProcessing: true,
      particleCount: 150,
      enableShaders: true
    },
    medium: {
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
      antialias: true,
      shadowMapSize: 1024,
      enablePostProcessing: true,
      particleCount: 75,
      enableShaders: false
    },
    low: {
      pixelRatio: 1,
      antialias: false,
      shadowMapSize: 512,
      enablePostProcessing: false,
      particleCount: 30,
      enableShaders: false
    }
  }

  const settings = qualitySettings[performanceLevel]

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative h-screen w-full overflow-y-auto overflow-x-hidden',
        'bg-gradient-to-b from-emerald-900 via-green-800 to-green-900',
        className
      )}
    >
      {/* Three.js Canvas - Fijo en la pantalla */}
      <div className="fixed inset-0 z-10">
        <Canvas
          camera={{ position: [0, 2, 5], fov: 75 }}
          gl={{ 
            antialias: settings.antialias, 
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
          }}
          dpr={settings.pixelRatio}
          shadows={performanceLevel !== 'low'}
        >
          <ScrollControls pages={5} damping={0.1}>
            <ScrollNarrative scrollProgress={scrollProgress}>
              <ForestEnvironmentEnhanced 
                performanceLevel={performanceLevel}
                enableShaders={settings.enableShaders}
              />
              <CharacterWalkEnhanced 
                scrollProgress={scrollProgress}
                enableShaders={settings.enableShaders}
              />
              <HorseRevealEnhanced 
                scrollProgress={scrollProgress}
                enableShaders={settings.enableShaders}
              />
              {settings.enablePostProcessing && (
                <MagicalParticles 
                  scrollProgress={scrollProgress}
                  particleCount={settings.particleCount}
                />
              )}
            </ScrollNarrative>
          </ScrollControls>

          {settings.enablePostProcessing && (
            <PostProcessingEffects 
              performanceLevel={performanceLevel}
              scrollProgress={scrollProgress}
            />
          )}
        </Canvas>
      </div>

      {/* Performance Monitor (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMonitor 
          onPerformanceChange={setPerformanceLevel}
          currentLevel={performanceLevel}
        />
      )}

      {/* Parallax Layers - HTML/CSS */}
      <ParallaxLayers scrollProgress={scrollProgress} />

      {/* Scroll Content - Define la altura total */}
      <div className="relative z-20 h-[500vh]">
        {/* Story Beats - Puntos invisibles que activan eventos */}
        <div className="absolute top-[10%] w-full h-px" data-story-beat="start" />
        <div className="absolute top-[30%] w-full h-px" data-story-beat="walking" />
        <div className="absolute top-[60%] w-full h-px" data-story-beat="discovery" />
        <div className="absolute top-[80%] w-full h-px" data-story-beat="encounter" />
        <div className="absolute top-[95%] w-full h-px" data-story-beat="connection" />
      </div>

      {/* Overlay de información narrativa y técnica */}
      <div className="fixed bottom-8 left-8 z-30 text-white/80 font-mono text-sm">
        <p>Progreso: {Math.round(scrollProgress * 100)}%</p>
        <p>Performance: {performanceLevel.toUpperCase()}</p>
        <p>
          Fase: {
            scrollProgress < 0.2 ? 'Digital Genesis' :
            scrollProgress < 0.5 ? 'Code Journey' :
            scrollProgress < 0.7 ? 'Innovation Discovery' :
            scrollProgress < 0.9 ? 'Creative Encounter' : 'Perfect Harmony'
          }
        </p>
        {isMobile && <p className="text-amber-300">📱 Mobile Optimized</p>}
      </div>
    </div>
  )
}