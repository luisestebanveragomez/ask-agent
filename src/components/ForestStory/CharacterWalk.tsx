import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

export function CharacterWalk() {
  const characterRef = useRef<THREE.Group>(null)
  const scroll = useScroll()

  useFrame(() => {
    if (!characterRef.current) return
    
    const progress = scroll.offset

    // El joven camina por el sendero
    // Posición inicial: atrás y a la izquierda
    // Posición final: adelante y hacia el centro-derecha
    
    const walkProgress = Math.min(progress * 1.5, 1) // Camina más rápido que el scroll
    
    characterRef.current.position.x = THREE.MathUtils.lerp(-3, 1, walkProgress)
    characterRef.current.position.z = THREE.MathUtils.lerp(4, -1, walkProgress)
    
    // Rotación del personaje (mirando hacia donde va)
    characterRef.current.rotation.y = THREE.MathUtils.lerp(0.3, -0.2, walkProgress)
    
    // Animación de caminar (bobbing)
    if (progress > 0.1 && progress < 0.7) { // Solo anima mientras camina
      const walkCycle = Date.now() * 0.005
      characterRef.current.position.y = 0.1 + Math.sin(walkCycle) * 0.05
      characterRef.current.rotation.x = Math.sin(walkCycle * 0.5) * 0.02
    }

    // Al final se detiene y mira hacia el caballo
    if (progress > 0.7) {
      characterRef.current.rotation.y = THREE.MathUtils.lerp(
        -0.2, 
        0.5, // Mira hacia la derecha donde aparece el caballo
        (progress - 0.7) / 0.3
      )
    }
  })

  return (
    <group ref={characterRef} position={[-3, 0, 4]}>
      {/* Cuerpo del joven (simple por ahora) */}
      <group>
        {/* Cabeza */}
        <mesh position={[0, 1.7, 0]}>
          <sphereGeometry args={[0.15]} />
          <meshLambertMaterial color="#d2b48c" />
        </mesh>
        
        {/* Torso */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.2, 0.15, 0.6]} />
          <meshLambertMaterial color="#4f46e5" />
        </mesh>
        
        {/* Brazos */}
        <mesh position={[-0.25, 1.3, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4]} />
          <meshLambertMaterial color="#d2b48c" />
        </mesh>
        <mesh position={[0.25, 1.3, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4]} />
          <meshLambertMaterial color="#d2b48c" />
        </mesh>
        
        {/* Piernas */}
        <mesh position={[-0.1, 0.6, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.6]} />
          <meshLambertMaterial color="#1e40af" />
        </mesh>
        <mesh position={[0.1, 0.6, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.6]} />
          <meshLambertMaterial color="#1e40af" />
        </mesh>

        {/* Pies */}
        <mesh position={[-0.1, 0.05, 0.1]}>
          <boxGeometry args={[0.12, 0.05, 0.2]} />
          <meshLambertMaterial color="#78350f" />
        </mesh>
        <mesh position={[0.1, 0.05, 0.1]}>
          <boxGeometry args={[0.12, 0.05, 0.2]} />
          <meshLambertMaterial color="#78350f" />
        </mesh>

        {/* Sombra del personaje */}
        <mesh position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.3]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.2} />
        </mesh>
      </group>
    </group>
  )
}