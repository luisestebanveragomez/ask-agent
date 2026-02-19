import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

interface CharacterWalkEnhancedProps {
  scrollProgress: number
  enableShaders: boolean
}

export function CharacterWalkEnhanced({ scrollProgress, enableShaders }: CharacterWalkEnhancedProps) {
  const characterRef = useRef<THREE.Group>(null)
  const clothMaterialRef = useRef<THREE.ShaderMaterial>()
  const scroll = useScroll()

  // Shader para la ropa con movimiento realista
  const clothShader = useMemo(() => {
    if (!enableShaders) return null
    
    return {
      uniforms: {
        time: { value: 0 },
        walkSpeed: { value: 0 },
        color: { value: new THREE.Color(0x4f46e5) }
      },
      vertexShader: `
        uniform float time;
        uniform float walkSpeed;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          vec3 pos = position;
          
          // Movimiento de tela al caminar
          float walkEffect = sin(time * 8.0) * walkSpeed * 0.02;
          pos.x += walkEffect * smoothstep(0.8, 1.6, pos.y);
          pos.z += walkEffect * 0.5 * smoothstep(0.8, 1.6, pos.y);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Fresnel para realismo
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 1.5);
          
          vec3 finalColor = color + fresnel * 0.1;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    }
  }, [enableShaders])

  useFrame((state) => {
    if (!characterRef.current) return
    
    const progress = scroll.offset
    const time = state.clock.getElapsedTime()

    // El joven camina por el sendero con easing más natural
    const walkProgress = Math.min(progress * 1.4, 1)
    
    // Usar easing functions para movimiento más natural
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    const easedProgress = easeInOutCubic(walkProgress)
    
    characterRef.current.position.x = THREE.MathUtils.lerp(-3, 1, easedProgress)
    characterRef.current.position.z = THREE.MathUtils.lerp(4, -1, easedProgress)
    
    // Rotación del personaje más suave
    const targetRotation = THREE.MathUtils.lerp(0.3, -0.2, easedProgress)
    characterRef.current.rotation.y = THREE.MathUtils.lerp(
      characterRef.current.rotation.y, 
      targetRotation, 
      0.05
    )
    
    // Animación de caminar mejorada
    const isWalking = progress > 0.1 && progress < 0.7
    const walkSpeed = isWalking ? 1.0 : 0.0
    
    if (isWalking) {
      const walkCycle = time * 6.0
      
      // Bobbing vertical más natural
      characterRef.current.position.y = 0.1 + Math.sin(walkCycle) * 0.03
      
      // Ligera inclinación al caminar
      characterRef.current.rotation.x = Math.sin(walkCycle * 0.5) * 0.01
      
      // Balanceo sutil
      characterRef.current.rotation.z = Math.sin(walkCycle * 1.2) * 0.015
      
      // Actualizar shader de la ropa
      if (clothMaterialRef.current) {
        clothMaterialRef.current.uniforms.time.value = time
        clothMaterialRef.current.uniforms.walkSpeed.value = walkSpeed
      }
    } else {
      // Suavizar la transición cuando se detiene
      characterRef.current.position.y = THREE.MathUtils.lerp(characterRef.current.position.y, 0.1, 0.05)
      characterRef.current.rotation.x = THREE.MathUtils.lerp(characterRef.current.rotation.x, 0, 0.05)
      characterRef.current.rotation.z = THREE.MathUtils.lerp(characterRef.current.rotation.z, 0, 0.05)
      
      if (clothMaterialRef.current) {
        clothMaterialRef.current.uniforms.walkSpeed.value = THREE.MathUtils.lerp(
          clothMaterialRef.current.uniforms.walkSpeed.value, 0, 0.05
        )
      }
    }

    // Al final se detiene y mira hacia el caballo con animación suave
    if (progress > 0.7) {
      const lookProgress = (progress - 0.7) / 0.3
      const targetLookRotation = 0.5 // Mira hacia la derecha donde aparece el caballo
      characterRef.current.rotation.y = THREE.MathUtils.lerp(
        characterRef.current.rotation.y,
        targetLookRotation,
        0.02
      )
      
      // Animación de sorpresa/descubrimiento
      if (progress > 0.75) {
        const surpriseEffect = Math.sin((progress - 0.75) * 20) * 0.02
        characterRef.current.position.y += surpriseEffect
      }
    }
  })

  return (
    <group ref={characterRef} position={[-3, 0, 4]}>
      {/* Cuerpo del joven mejorado */}
      <group>
        {/* Cabeza con detalles */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 12]} />
          <meshStandardMaterial 
            color="#d2b48c"
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>
        
        {/* Cabello */}
        <mesh position={[0, 1.85, -0.05]} castShadow>
          <sphereGeometry args={[0.12, 12, 8]} />
          <meshStandardMaterial 
            color="#4a2c17"
            roughness={0.9}
          />
        </mesh>
        
        {/* Torso con shader o material mejorado */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.15, 0.6, 12]} />
          {enableShaders && clothShader ? (
            <shaderMaterial
              ref={clothMaterialRef}
              uniforms={clothShader.uniforms}
              vertexShader={clothShader.vertexShader}
              fragmentShader={clothShader.fragmentShader}
              side={THREE.DoubleSide}
            />
          ) : (
            <meshStandardMaterial 
              color="#4f46e5"
              roughness={0.7}
              metalness={0.0}
            />
          )}
        </mesh>
        
        {/* Brazos con movimiento */}
        <group>
          <mesh position={[-0.25, 1.3, 0]} rotation={[0, 0, 0.2]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.4, 8]} />
            <meshStandardMaterial 
              color="#d2b48c"
              roughness={0.8}
            />
          </mesh>
          <mesh position={[0.25, 1.3, 0]} rotation={[0, 0, -0.2]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.4, 8]} />
            <meshStandardMaterial 
              color="#d2b48c"
              roughness={0.8}
            />
          </mesh>
        </group>
        
        {/* Piernas mejoradas */}
        <group>
          <mesh position={[-0.1, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.6, 10]} />
            <meshStandardMaterial 
              color="#1e40af"
              roughness={0.6}
            />
          </mesh>
          <mesh position={[0.1, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.6, 10]} />
            <meshStandardMaterial 
              color="#1e40af"
              roughness={0.6}
            />
          </mesh>
        </group>

        {/* Pies mejorados */}
        <group>
          <mesh position={[-0.1, 0.05, 0.1]} castShadow>
            <boxGeometry args={[0.12, 0.05, 0.2]} />
            <meshStandardMaterial 
              color="#78350f"
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[0.1, 0.05, 0.1]} castShadow>
            <boxGeometry args={[0.12, 0.05, 0.2]} />
            <meshStandardMaterial 
              color="#78350f"
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        </group>

        {/* Sombra dinámica del personaje */}
        <mesh position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ellipseGeometry args={[0.3, 0.25]} />
          <meshBasicMaterial 
            color="#000000" 
            transparent 
            opacity={0.3}
            blending={THREE.MultiplyBlending}
          />
        </mesh>

        {/* Efectos adicionales */}
        {scrollProgress > 0.65 && (
          <>
            {/* Partículas de polvo al caminar */}
            <group position={[0, 0, 0.3]}>
              {Array.from({ length: 3 }, (_, i) => (
                <mesh 
                  key={`dust-${i}`}
                  position={[
                    (Math.random() - 0.5) * 0.4,
                    Math.random() * 0.1,
                    (Math.random() - 0.5) * 0.4
                  ]}
                >
                  <sphereGeometry args={[0.005 + Math.random() * 0.005]} />
                  <meshBasicMaterial 
                    color="#8b7355"
                    transparent
                    opacity={0.4}
                  />
                </mesh>
              ))}
            </group>
            
            {/* Aura de descubrimiento */}
            <mesh position={[0, 1.2, 0]}>
              <sphereGeometry args={[0.8]} />
              <meshBasicMaterial 
                color="#fbbf24"
                transparent
                opacity={0.05}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </>
        )}
      </group>
    </group>
  )
}