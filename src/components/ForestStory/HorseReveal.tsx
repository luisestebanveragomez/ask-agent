import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

export function HorseReveal() {
  const horseRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.MeshLambertMaterial>(null)
  const scroll = useScroll()

  useFrame(() => {
    if (!horseRef.current || !materialRef.current) return
    
    const progress = scroll.offset

    // El caballo aparece gradualmente entre los árboles
    // Fase de revelación: 0.6 - 1.0
    let revealProgress = 0
    
    if (progress < 0.6) {
      // Completamente oculto
      revealProgress = 0
    } else if (progress >= 0.6 && progress <= 0.9) {
      // Aparición gradual
      revealProgress = (progress - 0.6) / 0.3
    } else {
      // Completamente visible
      revealProgress = 1
    }

    // Opacity y scale para la revelación mágica
    const opacity = THREE.MathUtils.lerp(0, 1, revealProgress)
    const scale = THREE.MathUtils.lerp(0.3, 1, revealProgress)
    
    horseRef.current.scale.setScalar(scale)
    
    // Aplicar transparencia a todos los materiales del caballo
    horseRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshLambertMaterial) {
        child.material.transparent = true
        child.material.opacity = opacity
      }
    })

    // Efecto de "materialización" - desplazamiento desde el fondo
    const zPosition = THREE.MathUtils.lerp(-5, -2, revealProgress)
    horseRef.current.position.z = zPosition

    // Movimiento sutil del caballo una vez visible
    if (revealProgress > 0.5) {
      const breathe = Math.sin(Date.now() * 0.002) * 0.02
      horseRef.current.position.y = breathe
      
      // Movimiento de la cabeza
      const headBob = Math.sin(Date.now() * 0.003) * 0.1
      const head = horseRef.current.getObjectByName('horse-head')
      if (head) {
        head.rotation.x = headBob
      }
    }

    // Rotación hacia el joven al final
    if (progress > 0.8) {
      const lookProgress = (progress - 0.8) / 0.2
      horseRef.current.rotation.y = THREE.MathUtils.lerp(0, -0.3, lookProgress)
    }

    // Efecto de partículas mágicas durante la aparición
    if (revealProgress > 0 && revealProgress < 1) {
      // Aquí podrías agregar partículas de luz
    }
  })

  return (
    <group ref={horseRef} position={[3, 0, -2]}>
      {/* Cuerpo del caballo */}
      <group>
        {/* Cuerpo principal */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 1.2]} />
          <meshLambertMaterial ref={materialRef} color="#8b4513" />
        </mesh>

        {/* Cuello */}
        <mesh position={[0, 1.5, 0.3]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.6]} />
          <meshLambertMaterial color="#8b4513" />
        </mesh>

        {/* Cabeza */}
        <mesh name="horse-head" position={[0, 1.9, 0.6]}>
          <boxGeometry args={[0.25, 0.3, 0.5]} />
          <meshLambertMaterial color="#8b4513" />
        </mesh>

        {/* Orejas */}
        <mesh position={[-0.08, 2.1, 0.6]}>
          <coneGeometry args={[0.05, 0.15]} />
          <meshLambertMaterial color="#8b4513" />
        </mesh>
        <mesh position={[0.08, 2.1, 0.6]}>
          <coneGeometry args={[0.05, 0.15]} />
          <meshLambertMaterial color="#8b4513" />
        </mesh>

        {/* Patas */}
        <mesh position={[-0.25, 0.35, 0.3]}>
          <cylinderGeometry args={[0.08, 0.06, 0.7]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
        <mesh position={[0.25, 0.35, 0.3]}>
          <cylinderGeometry args={[0.08, 0.06, 0.7]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
        <mesh position={[-0.25, 0.35, -0.3]}>
          <cylinderGeometry args={[0.08, 0.06, 0.7]} />
          <meshLambertMaterial color="#654321" />
        </mesh>
        <mesh position={[0.25, 0.35, -0.3]}>
          <cylinderGeometry args={[0.08, 0.06, 0.7]} />
          <meshLambertMaterial color="#654321" />
        </mesh>

        {/* Pezuñas */}
        <mesh position={[-0.25, 0.02, 0.3]}>
          <cylinderGeometry args={[0.1, 0.08, 0.04]} />
          <meshLambertMaterial color="#2d1810" />
        </mesh>
        <mesh position={[0.25, 0.02, 0.3]}>
          <cylinderGeometry args={[0.1, 0.08, 0.04]} />
          <meshLambertMaterial color="#2d1810" />
        </mesh>
        <mesh position={[-0.25, 0.02, -0.3]}>
          <cylinderGeometry args={[0.1, 0.08, 0.04]} />
          <meshLambertMaterial color="#2d1810" />
        </mesh>
        <mesh position={[0.25, 0.02, -0.3]}>
          <cylinderGeometry args={[0.1, 0.08, 0.04]} />
          <meshLambertMaterial color="#2d1810" />
        </mesh>

        {/* Cola */}
        <mesh position={[0, 1.2, -0.6]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.08, 0.4]} />
          <meshLambertMaterial color="#4a2c17" />
        </mesh>

        {/* Crin */}
        <mesh position={[0, 1.7, 0.2]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.4]} />
          <meshLambertMaterial color="#4a2c17" />
        </mesh>

        {/* Sombra del caballo */}
        <mesh position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ellipseGeometry args={[0.6, 0.4]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.15} />
        </mesh>

        {/* Ojos (aparecen al final para crear conexión) */}
        {scroll.offset > 0.85 && (
          <>
            <mesh position={[-0.08, 1.95, 0.75]}>
              <sphereGeometry args={[0.03]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
            <mesh position={[0.08, 1.95, 0.75]}>
              <sphereGeometry args={[0.03]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
          </>
        )}
      </group>
    </group>
  )
}