import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

interface ScrollNarrativeProps {
  children: React.ReactNode
  scrollProgress: number
}

export function ScrollNarrative({ children, scrollProgress }: ScrollNarrativeProps) {
  const { camera } = useThree()
  const scroll = useScroll()
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!groupRef.current) return

    // Progreso suavizado del scroll
    const progress = scroll.offset
    
    // FASE 1: Inicio del sendero (0 - 0.2)
    if (progress <= 0.2) {
      const phase1 = progress / 0.2
      camera.position.x = THREE.MathUtils.lerp(-2, 0, phase1)
      camera.position.z = THREE.MathUtils.lerp(8, 6, phase1)
      camera.lookAt(0, 1, 0)
    }
    
    // FASE 2: Caminando por el bosque (0.2 - 0.5)
    else if (progress <= 0.5) {
      const phase2 = (progress - 0.2) / 0.3
      camera.position.x = THREE.MathUtils.lerp(0, 1, phase2)
      camera.position.z = THREE.MathUtils.lerp(6, 4, phase2)
      camera.position.y = THREE.MathUtils.lerp(2, 1.5, phase2)
    }
    
    // FASE 3: Acercándose al descubrimiento (0.5 - 0.7)
    else if (progress <= 0.7) {
      const phase3 = (progress - 0.5) / 0.2
      camera.position.x = THREE.MathUtils.lerp(1, 2, phase3)
      camera.position.z = THREE.MathUtils.lerp(4, 3, phase3)
      // Rotación sutil hacia donde aparecerá el caballo
      camera.lookAt(
        THREE.MathUtils.lerp(0, 3, phase3),
        1,
        THREE.MathUtils.lerp(0, -2, phase3)
      )
    }
    
    // FASE 4: El encuentro (0.7 - 0.9)
    else if (progress <= 0.9) {
      const phase4 = (progress - 0.7) / 0.2
      camera.position.x = THREE.MathUtils.lerp(2, 3, phase4)
      camera.position.z = THREE.MathUtils.lerp(3, 2, phase4)
      camera.position.y = THREE.MathUtils.lerp(1.5, 1.8, phase4)
      // Enfoque directo al punto de encuentro
      camera.lookAt(3, 1, -2)
    }
    
    // FASE 5: Conexión final (0.9 - 1.0)
    else {
      const phase5 = (progress - 0.9) / 0.1
      camera.position.x = THREE.MathUtils.lerp(3, 4, phase5)
      camera.position.z = THREE.MathUtils.lerp(2, 1, phase5)
      camera.position.y = THREE.MathUtils.lerp(1.8, 2.2, phase5)
      // Vista panorámica final
      camera.lookAt(
        THREE.MathUtils.lerp(3, 2, phase5),
        1,
        THREE.MathUtils.lerp(-2, -1, phase5)
      )
    }

    // Rotación sutil del grupo principal para crear profundidad
    if (groupRef.current) {
      groupRef.current.rotation.y = progress * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {children}
    </group>
  )
}