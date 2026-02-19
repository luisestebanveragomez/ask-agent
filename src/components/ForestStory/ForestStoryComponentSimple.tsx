import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import { cn } from '@/lib/utils'
import { ScrollNarrative } from './ScrollNarrative'
import { ForestEnvironment } from './ForestEnvironment'
import { CharacterWalk } from './CharacterWalk'
import { HorseReveal } from './HorseReveal'
import { ParallaxLayers } from './ParallaxLayers'

interface ForestStoryProps {
  className?: string
}

export function ForestStoryComponentSimple({ className }: ForestStoryProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Detect mobile
    const isMobileDevice = /iPhone|iPad|Android/i.test(navigator.userAgent)
    setIsMobile(isMobileDevice)

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

  // Settings simplificados
  const settings = {
    pixelRatio: isMobile ? 1 : Math.min(window.devicePixelRatio, 2),
    antialias: !isMobile
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative h-screen w-full overflow-y-auto overflow-x-hidden',
        'bg-gradient-to-b from-emerald-900 via-green-800 to-green-900',
        className
      )}
    >
      {/* Three.js Canvas - Versión simplificada */}
      <div className="fixed inset-0 z-10">
        <Canvas
          camera={{ position: [0, 2, 5], fov: 75 }}
          gl={{ 
            antialias: settings.antialias, 
            alpha: true,
            powerPreference: 'high-performance'
          }}
          dpr={settings.pixelRatio}
        >
          <ScrollControls pages={5} damping={0.1}>
            <ScrollNarrative scrollProgress={scrollProgress}>
              <ForestEnvironment />
              <CharacterWalk />
              <HorseReveal />
            </ScrollNarrative>
          </ScrollControls>
        </Canvas>
      </div>

      {/* Parallax Layers */}
      <ParallaxLayers scrollProgress={scrollProgress} />

      {/* Scroll Content */}
      <div className="relative z-20 h-[500vh]">
        <div className="absolute top-[10%] w-full h-px" data-story-beat="start" />
        <div className="absolute top-[30%] w-full h-px" data-story-beat="walking" />
        <div className="absolute top-[60%] w-full h-px" data-story-beat="discovery" />
        <div className="absolute top-[80%] w-full h-px" data-story-beat="encounter" />
        <div className="absolute top-[95%] w-full h-px" data-story-beat="connection" />
      </div>

      {/* Debug info */}
      <div className="fixed bottom-8 left-8 z-30 text-white/80 font-mono text-sm">
        <p>Progreso: {Math.round(scrollProgress * 100)}%</p>
        <p>Versión: Simplificada</p>
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