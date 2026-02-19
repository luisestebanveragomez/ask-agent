import { useRef, useEffect } from 'react'
import { extend, useThree, useFrame } from '@react-three/fiber'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js'
import { VignetteShader } from 'three/addons/shaders/VignetteShader.js'
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js'
import * as THREE from 'three'

// Extender los componentes para React Three Fiber
extend({ 
  EffectComposer, 
  RenderPass, 
  UnrealBloomPass, 
  ShaderPass 
})

interface PostProcessingEffectsProps {
  performanceLevel: 'high' | 'medium' | 'low'
  scrollProgress: number
}

export function PostProcessingEffects({ performanceLevel, scrollProgress }: PostProcessingEffectsProps) {
  const composerRef = useRef<EffectComposer>()
  const { scene, camera, renderer } = useThree()
  const bloomPassRef = useRef<UnrealBloomPass>()
  const vignettePassRef = useRef<ShaderPass>()

  useEffect(() => {
    if (!renderer) return

    // Configuración basada en performance
    const config = {
      high: {
        bloomStrength: 1.2,
        bloomRadius: 0.4,
        bloomThreshold: 0.7,
        enableVignette: true,
        enableGamma: true,
        enableFXAA: true,
        resolution: 1.0
      },
      medium: {
        bloomStrength: 0.8,
        bloomRadius: 0.3,
        bloomThreshold: 0.8,
        enableVignette: true,
        enableGamma: false,
        enableFXAA: false,
        resolution: 0.8
      },
      low: {
        bloomStrength: 0.5,
        bloomRadius: 0.2,
        bloomThreshold: 0.9,
        enableVignette: false,
        enableGamma: false,
        enableFXAA: false,
        resolution: 0.6
      }
    }[performanceLevel]

    // Crear composer
    const composer = new EffectComposer(renderer)
    composerRef.current = composer

    // 1. Render pass
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // 2. Bloom pass
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(
        window.innerWidth * config.resolution, 
        window.innerHeight * config.resolution
      ),
      config.bloomStrength,
      config.bloomRadius,
      config.bloomThreshold
    )
    bloomPassRef.current = bloomPass
    composer.addPass(bloomPass)

    // 3. Vignette (solo en high/medium)
    if (config.enableVignette) {
      const vignettePass = new ShaderPass(VignetteShader)
      vignettePass.uniforms['offset'].value = 0.95
      vignettePass.uniforms['darkness'].value = 0.8
      vignettePassRef.current = vignettePass
      composer.addPass(vignettePass)
    }

    // 4. Gamma correction (solo en high)
    if (config.enableGamma) {
      const gammaPass = new ShaderPass(GammaCorrectionShader)
      composer.addPass(gammaPass)
    }

    // 5. FXAA anti-aliasing (solo en high)
    if (config.enableFXAA) {
      const fxaaPass = new ShaderPass(FXAAShader)
      fxaaPass.uniforms['resolution'].value.set(
        1 / (window.innerWidth * config.resolution),
        1 / (window.innerHeight * config.resolution)
      )
      composer.addPass(fxaaPass)
    }

    // Configurar tamaño
    composer.setSize(
      window.innerWidth * config.resolution, 
      window.innerHeight * config.resolution
    )

    // Cleanup
    return () => {
      composer.dispose()
    }
  }, [scene, camera, renderer, performanceLevel])

  useFrame(() => {
    if (composerRef.current && bloomPassRef.current && vignettePassRef.current) {
      // Ajustar efectos dinámicamente basado en el scroll
      
      // Bloom más intenso durante la revelación del caballo
      if (scrollProgress >= 0.6 && scrollProgress <= 0.9) {
        const revealIntensity = 1 - Math.abs((scrollProgress - 0.75) / 0.15)
        bloomPassRef.current.strength = THREE.MathUtils.lerp(0.8, 2.0, revealIntensity)
        bloomPassRef.current.radius = THREE.MathUtils.lerp(0.3, 0.6, revealIntensity)
      } else if (scrollProgress > 0.9) {
        // Efecto más suave al final
        bloomPassRef.current.strength = THREE.MathUtils.lerp(2.0, 1.0, (scrollProgress - 0.9) / 0.1)
        bloomPassRef.current.radius = 0.4
      } else {
        // Bloom base
        bloomPassRef.current.strength = 0.8
        bloomPassRef.current.radius = 0.3
      }

      // Vignette más dramático durante momentos clave
      if (vignettePassRef.current) {
        const vignetteIntensity = scrollProgress > 0.7 ? 1.2 : 0.8
        vignettePassRef.current.uniforms['darkness'].value = vignetteIntensity
      }

      // Renderizar con el composer
      composerRef.current.render()
    }
  })

  // Hook para resize
  useEffect(() => {
    const handleResize = () => {
      if (composerRef.current) {
        const config = {
          high: 1.0,
          medium: 0.8,
          low: 0.6
        }[performanceLevel]

        composerRef.current.setSize(
          window.innerWidth * config, 
          window.innerHeight * config
        )
        
        // Actualizar FXAA resolution si existe
        composerRef.current.passes.forEach(pass => {
          if (pass instanceof ShaderPass && pass.uniforms['resolution']) {
            pass.uniforms['resolution'].value.set(
              1 / (window.innerWidth * config),
              1 / (window.innerHeight * config)
            )
          }
        })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [performanceLevel])

  // Este componente no renderiza nada directamente
  return null
}