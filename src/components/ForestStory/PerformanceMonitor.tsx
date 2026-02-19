import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

interface PerformanceMonitorProps {
  onPerformanceChange: (level: 'high' | 'medium' | 'low') => void
  currentLevel: 'high' | 'medium' | 'low'
}

export function PerformanceMonitor({ onPerformanceChange, currentLevel }: PerformanceMonitorProps) {
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const fpsRef = useRef(60)
  const [stats, setStats] = useState({
    fps: 60,
    frameTime: 16,
    memoryUsage: 0
  })

  useFrame(() => {
    frameCountRef.current++
    const currentTime = performance.now()
    const deltaTime = currentTime - lastTimeRef.current

    if (deltaTime >= 1000) { // Cada segundo
      const fps = (frameCountRef.current * 1000) / deltaTime
      fpsRef.current = fps
      
      // Obtener uso de memoria si está disponible
      const memoryUsage = (performance as any).memory 
        ? (performance as any).memory.usedJSHeapSize / 1048576 // MB
        : 0

      setStats({
        fps: Math.round(fps),
        frameTime: Math.round(1000 / fps),
        memoryUsage: Math.round(memoryUsage)
      })

      // Ajustar performance basado en FPS
      if (fps < 30 && currentLevel !== 'low') {
        onPerformanceChange('low')
      } else if (fps < 50 && currentLevel === 'high') {
        onPerformanceChange('medium')
      } else if (fps > 55 && currentLevel === 'low') {
        onPerformanceChange('medium')
      } else if (fps > 58 && currentLevel === 'medium') {
        onPerformanceChange('high')
      }

      frameCountRef.current = 0
      lastTimeRef.current = currentTime
    }
  })

  // Detectar cambios de rendimiento del dispositivo
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      
      if (!gl) {
        onPerformanceChange('low')
        return
      }

      // Verificar extensiones WebGL
      const extensions = {
        anisotropic: gl.getExtension('EXT_texture_filter_anisotropic'),
        floatTextures: gl.getExtension('OES_texture_float'),
        depthTexture: gl.getExtension('WEBGL_depth_texture')
      }

      // Verificar límites del hardware
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)
      const maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS)
      
      // Score basado en capacidades
      let score = 0
      
      if (maxTextureSize >= 4096) score += 2
      if (maxViewportDims[0] >= 4096) score += 2
      if (extensions.anisotropic) score += 1
      if (extensions.floatTextures) score += 1
      if (extensions.depthTexture) score += 1
      
      // Verificar memoria del dispositivo
      const deviceMemory = (navigator as any).deviceMemory || 4
      if (deviceMemory >= 8) score += 2
      else if (deviceMemory >= 4) score += 1
      
      // Verificar cores del CPU
      const hardwareConcurrency = navigator.hardwareConcurrency || 4
      if (hardwareConcurrency >= 8) score += 2
      else if (hardwareConcurrency >= 4) score += 1

      // Determinar nivel basado en score
      if (score >= 8) {
        onPerformanceChange('high')
      } else if (score >= 5) {
        onPerformanceChange('medium')
      } else {
        onPerformanceChange('low')
      }
    }

    checkDeviceCapabilities()
  }, [onPerformanceChange])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-3 rounded-lg font-mono text-xs">
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={stats.fps < 30 ? 'text-red-400' : stats.fps < 50 ? 'text-yellow-400' : 'text-green-400'}>
            {stats.fps}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Frame Time:</span>
          <span>{stats.frameTime}ms</span>
        </div>
        {stats.memoryUsage > 0 && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span>{stats.memoryUsage}MB</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Quality:</span>
          <span className={
            currentLevel === 'high' ? 'text-green-400' : 
            currentLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
          }>
            {currentLevel.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}