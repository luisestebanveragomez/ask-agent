import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

export function ForestEnvironment() {
  const groupRef = useRef<THREE.Group>(null)
  const scroll = useScroll()

  // Crear árboles en diferentes posiciones
  const trees = [
    // Fila trasera (fondo)
    { position: [-8, 0, -10], scale: [2, 3, 2], opacity: 0.6 },
    { position: [-4, 0, -12], scale: [1.8, 2.8, 1.8], opacity: 0.7 },
    { position: [2, 0, -15], scale: [2.2, 3.2, 2.2], opacity: 0.5 },
    { position: [6, 0, -11], scale: [1.9, 2.9, 1.9], opacity: 0.6 },
    { position: [10, 0, -13], scale: [2.1, 3.1, 2.1], opacity: 0.5 },
    
    // Fila media
    { position: [-6, 0, -6], scale: [1.5, 2.5, 1.5], opacity: 0.8 },
    { position: [-2, 0, -8], scale: [1.7, 2.7, 1.7], opacity: 0.75 },
    { position: [4, 0, -7], scale: [1.6, 2.6, 1.6], opacity: 0.8 },
    { position: [8, 0, -5], scale: [1.4, 2.4, 1.4], opacity: 0.85 },
    
    // Árboles donde aparecerá el caballo
    { position: [2, 0, -3], scale: [1.2, 2.2, 1.2], opacity: 1, special: true },
    { position: [4, 0, -4], scale: [1.3, 2.3, 1.3], opacity: 1, special: true },
    
    // Primer plano
    { position: [-3, 0, -2], scale: [1, 2, 1], opacity: 0.9 },
    { position: [7, 0, -1], scale: [1.1, 2.1, 1.1], opacity: 0.95 },
  ]

  useFrame(() => {
    if (!groupRef.current) return
    
    const progress = scroll.offset

    // Movimiento parallax sutil en los árboles
    groupRef.current.children.forEach((tree, index) => {
      if (tree instanceof THREE.Mesh) {
        // Parallax basado en la profundidad
        const depth = trees[index]?.position[2] || 0
        const parallaxSpeed = Math.abs(depth) / 15
        
        tree.position.x = (trees[index]?.position[0] || 0) + (progress * parallaxSpeed * 2)
        
        // Efecto de viento sutil
        tree.rotation.z = Math.sin(Date.now() * 0.001 + index) * 0.02
      }
    })
  })

  return (
    <group ref={groupRef}>
      {/* Luz ambiental del bosque */}
      <ambientLight intensity={0.3} color="#4ade80" />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        color="#fbbf24"
        castShadow
      />
      
      {/* Niebla atmosférica */}
      <fog attach="fog" args={['#065f46', 8, 20]} />

      {/* Suelo del bosque */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshLambertMaterial color="#166534" />
      </mesh>

      {/* Árboles */}
      {trees.map((tree, index) => (
        <group key={index} position={tree.position}>
          {/* Tronco */}
          <mesh position={[0, tree.scale[1] / 2, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, tree.scale[1]]} />
            <meshLambertMaterial color="#78350f" />
          </mesh>
          
          {/* Copa del árbol */}
          <mesh position={[0, tree.scale[1] * 0.8, 0]} castShadow>
            <sphereGeometry args={[tree.scale[0]]} />
            <meshLambertMaterial 
              color="#15803d" 
              transparent 
              opacity={tree.opacity}
            />
          </mesh>
          
          {/* Follaje adicional para árboles especiales */}
          {tree.special && (
            <>
              <mesh position={[-0.5, tree.scale[1] * 0.6, 0.3]} castShadow>
                <sphereGeometry args={[tree.scale[0] * 0.7]} />
                <meshLambertMaterial color="#16a34a" transparent opacity={0.8} />
              </mesh>
              <mesh position={[0.4, tree.scale[1] * 0.7, -0.2]} castShadow>
                <sphereGeometry args={[tree.scale[0] * 0.6]} />
                <meshLambertMaterial color="#16a34a" transparent opacity={0.9} />
              </mesh>
            </>
          )}
        </group>
      ))}

      {/* Vegetación del suelo */}
      {Array.from({ length: 30 }, (_, i) => (
        <mesh
          key={`grass-${i}`}
          position={[
            (Math.random() - 0.5) * 30,
            -0.3,
            (Math.random() - 0.5) * 25
          ]}
          rotation={[0, Math.random() * Math.PI * 2, 0]}
        >
          <boxGeometry args={[0.05, 0.3, 0.05]} />
          <meshLambertMaterial color="#22c55e" />
        </mesh>
      ))}
    </group>
  )
}