import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll } from '@react-three/drei'
import { cn } from '@/lib/utils'
import { ScrollNarrative } from './ScrollNarrative'
import { ForestEnvironment } from './ForestEnvironment'
import { CharacterWalk } from './CharacterWalk'
import { HorseReveal } from './HorseReveal'
import { ParallaxLayers } from './ParallaxLayers'

interface ForestStoryProps {
  className?: string
}

export function ForestStoryComponent({ className }: ForestStoryProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        const progress = scrollTop / (scrollHeight - clientHeight)
        setScrollProgress(Math.min(Math.max(progress, 0), 1))
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
          gl={{ antialias: true, alpha: true }}
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

      {/* Overlay de información narrativa */}
      <div className="fixed bottom-8 left-8 z-30 text-white/80 font-mono text-sm">
        <p>Progreso: {Math.round(scrollProgress * 100)}%</p>
        <p>
          Fase: {
            scrollProgress < 0.2 ? 'Inicio del sendero' :
            scrollProgress < 0.5 ? 'Caminando por el bosque' :
            scrollProgress < 0.7 ? 'Descubrimiento' :
            scrollProgress < 0.9 ? 'Encuentro' : 'Conexión'
          }
        </p>
      </div>
    </div>
  )
}