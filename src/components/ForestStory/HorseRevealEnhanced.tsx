import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

interface HorseRevealEnhancedProps {
  scrollProgress: number
  enableShaders: boolean
}

export function HorseRevealEnhanced({ scrollProgress, enableShaders }: HorseRevealEnhancedProps) {
  const horseRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>()
  const scroll = useScroll()

  // Shader avanzado para el caballo con efectos mágicos
  const horseShader = useMemo(() => {
    if (!enableShaders) return null
    
    return {
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0 },
        revealProgress: { value: 0 },
        color: { value: new THREE.Color(0x8b4513) },
        magicIntensity: { value: 0 },
        noiseScale: { value: 10.0 }
      },
      vertexShader: `
        uniform float time;
        uniform float revealProgress;
        uniform float magicIntensity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        // Noise function para efecto de materialización
        float noise(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        }
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          
          vec3 pos = position;
          
          // Efecto de materialización
          float materializing = smoothstep(0.0, 1.0, revealProgress);
          
          // Desplazamiento durante la aparición
          pos += normal * (1.0 - materializing) * 0.5;
          
          // Efecto de respiración cuando está completamente visible
          if (revealProgress > 0.8) {
            pos.y += sin(time * 2.0 + pos.x * 5.0) * 0.02 * magicIntensity;
          }
          
          // Movimiento sutil mágico
          pos += sin(time * 3.0 + pos.y * 10.0) * magicIntensity * 0.01;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        uniform float revealProgress;
        uniform vec3 color;
        uniform float magicIntensity;
        uniform float noiseScale;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        // Función de ruido simplificada
        float noise(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        }
        
        void main() {
          // Fresnel para realismo
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 2.0);
          
          // Efecto de ruido para la materialización
          float n = noise(vWorldPosition * noiseScale + time);
          float revealMask = smoothstep(revealProgress - 0.1, revealProgress + 0.1, n);
          
          // Color base con variaciones
          vec3 finalColor = color;
          
          // Efecto mágico cuando se está materializando
          if (revealProgress < 1.0) {
            vec3 magicColor = vec3(0.6, 0.8, 1.0);
            finalColor = mix(magicColor, finalColor, revealProgress);
            finalColor += fresnel * magicColor * (1.0 - revealProgress);
          }
          
          // Brillo sutil cuando está completamente visible
          if (revealProgress > 0.9) {
            float glow = sin(time * 4.0) * 0.1 + 0.9;
            finalColor *= glow;
          }
          
          // Aplicar máscara de revelación
          float finalOpacity = opacity * revealMask;
          
          gl_FragColor = vec4(finalColor, finalOpacity);
        }
      `
    }
  }, [enableShaders])

  useFrame((state) => {
    if (!horseRef.current) return
    
    const progress = scroll.offset
    const time = state.clock.getElapsedTime()

    // El caballo aparece gradualmente con easing más sofisticado
    let revealProgress = 0
    
    if (progress < 0.6) {
      revealProgress = 0
    } else if (progress >= 0.6 && progress <= 0.9) {
      // Usar easing más dramático para la aparición
      const t = (progress - 0.6) / 0.3
      revealProgress = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
    } else {
      revealProgress = 1
    }

    // Efectos de escala y posición más dramáticos
    const appearScale = THREE.MathUtils.lerp(0.1, 1.2, revealProgress)
    const finalScale = revealProgress > 0.8 ? THREE.MathUtils.lerp(1.2, 1.0, (revealProgress - 0.8) / 0.2) : appearScale
    
    horseRef.current.scale.setScalar(finalScale)
    
    // Efecto de "materialización" con posición Z
    const zPosition = THREE.MathUtils.lerp(-6, -2, revealProgress)
    horseRef.current.position.z = zPosition
    
    // Aplicar transparencia con shader o material estándar
    if (enableShaders && materialRef.current) {
      materialRef.current.uniforms.time.value = time
      materialRef.current.uniforms.opacity.value = revealProgress
      materialRef.current.uniforms.revealProgress.value = revealProgress
      materialRef.current.uniforms.magicIntensity.value = revealProgress > 0.5 ? (1 - revealProgress) * 2 : 0
    } else {
      // Fallback para materiales estándar
      horseRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.transparent = true
          child.material.opacity = revealProgress
        }
      })
    }

    // Movimiento sutil del caballo una vez visible
    if (revealProgress > 0.3) {
      const breathe = Math.sin(time * 1.5) * 0.015
      horseRef.current.position.y = breathe
      
      // Movimiento de la cabeza más natural
      const head = horseRef.current.getObjectByName('horse-head')
      if (head) {
        head.rotation.x = Math.sin(time * 2.0) * 0.08
        head.rotation.y = Math.sin(time * 1.2) * 0.05
      }
      
      // Movimiento de la cola
      const tail = horseRef.current.getObjectByName('horse-tail')
      if (tail) {
        tail.rotation.x = 0.3 + Math.sin(time * 3.0) * 0.1
        tail.rotation.z = Math.sin(time * 2.5) * 0.08
      }
    }

    // Rotación hacia el joven al final con easing suave
    if (progress > 0.8) {
      const lookProgress = (progress - 0.8) / 0.2
      const easeInOut = lookProgress < 0.5 ? 2 * lookProgress * lookProgress : 1 - Math.pow(-2 * lookProgress + 2, 2) / 2
      horseRef.current.rotation.y = THREE.MathUtils.lerp(0, -0.3, easeInOut)
    }

    // Efecto de aura mágica
    if (revealProgress > 0.1 && revealProgress < 0.9) {
      // Aquí podrías agregar efectos de partículas adicionales
    }
  })

  return (
    <group ref={horseRef} position={[3, 0, -2]}>
      {/* Cuerpo del caballo mejorado */}
      <group>
        {/* Cuerpo principal con shader */}
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.5, 1.2, 16]} />
          {enableShaders && horseShader ? (
            <shaderMaterial
              ref={materialRef}
              uniforms={horseShader.uniforms}
              vertexShader={horseShader.vertexShader}
              fragmentShader={horseShader.fragmentShader}
              transparent
              side={THREE.DoubleSide}
            />
          ) : (
            <meshStandardMaterial 
              color="#8b4513"
              roughness={0.7}
              metalness={0.1}
              transparent
            />
          )}
        </mesh>

        {/* Cuello mejorado */}
        <mesh position={[0, 1.5, 0.3]} rotation={[0.3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.18, 0.7, 12]} />
          <meshStandardMaterial 
            color="#8b4513"
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>

        {/* Cabeza con nombre para animación */}
        <mesh name="horse-head" position={[0, 1.9, 0.6]} castShadow>
          <boxGeometry args={[0.22, 0.28, 0.45]} />
          <meshStandardMaterial 
            color="#8b4513"
            roughness={0.8}
          />
        </mesh>

        {/* Detalles faciales */}
        <group position={[0, 1.9, 0.6]}>
          {/* Hocico */}
          <mesh position={[0, -0.1, 0.3]}>
            <boxGeometry args={[0.15, 0.12, 0.2]} />
            <meshStandardMaterial color="#704010" roughness={0.9} />
          </mesh>
          
          {/* Fosas nasales */}
          <mesh position={[-0.05, -0.08, 0.4]}>
            <sphereGeometry args={[0.015]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[0.05, -0.08, 0.4]}>
            <sphereGeometry args={[0.015]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>

        {/* Orejas mejoradas */}
        <mesh position={[-0.08, 2.1, 0.6]} rotation={[0, 0, -0.3]} castShadow>
          <coneGeometry args={[0.04, 0.15, 8]} />
          <meshStandardMaterial color="#8b4513" roughness={0.8} />
        </mesh>
        <mesh position={[0.08, 2.1, 0.6]} rotation={[0, 0, 0.3]} castShadow>
          <coneGeometry args={[0.04, 0.15, 8]} />
          <meshStandardMaterial color="#8b4513" roughness={0.8} />
        </mesh>

        {/* Patas mejoradas con articulaciones */}
        {[
          [-0.25, 0.35, 0.3],
          [0.25, 0.35, 0.3],
          [-0.25, 0.35, -0.3],
          [0.25, 0.35, -0.3]
        ].map((pos, i) => (
          <group key={`leg-${i}`} position={pos}>
            {/* Parte superior de la pata */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.08, 0.3, 10]} />
              <meshStandardMaterial color="#654321" roughness={0.8} />
            </mesh>
            {/* Parte inferior de la pata */}
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.3, 10]} />
              <meshStandardMaterial color="#654321" roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Pezuñas mejoradas */}
        {[
          [-0.25, 0.02, 0.3],
          [0.25, 0.02, 0.3],
          [-0.25, 0.02, -0.3],
          [0.25, 0.02, -0.3]
        ].map((pos, i) => (
          <mesh key={`hoof-${i}`} position={pos} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.06, 8]} />
            <meshStandardMaterial 
              color="#2d1810"
              roughness={0.9}
              metalness={0.2}
            />
          </mesh>
        ))}

        {/* Cola con nombre para animación */}
        <mesh name="horse-tail" position={[0, 1.2, -0.6]} rotation={[0.3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.06, 0.5, 8]} />
          <meshStandardMaterial 
            color="#4a2c17"
            roughness={0.9}
          />
        </mesh>

        {/* Crin mejorada */}
        <group position={[0, 1.7, 0.2]}>
          <mesh>
            <boxGeometry args={[0.04, 0.35, 0.45]} />
            <meshStandardMaterial 
              color="#4a2c17"
              roughness={0.9}
            />
          </mesh>
          {/* Mechones adicionales */}
          {Array.from({ length: 5 }, (_, i) => (
            <mesh 
              key={`mane-${i}`}
              position={[
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.3
              ]}
              rotation={[0, 0, (Math.random() - 0.5) * 0.3]}
            >
              <boxGeometry args={[0.02, 0.15, 0.02]} />
              <meshStandardMaterial color="#4a2c17" roughness={0.9} />
            </mesh>
          ))}
        </group>

        {/* Sombra dinámica del caballo */}
        <mesh position={[0, -0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ellipseGeometry args={[0.6, 0.4]} />
          <meshBasicMaterial 
            color="#000000" 
            transparent 
            opacity={0.2}
            blending={THREE.MultiplyBlending}
          />
        </mesh>

        {/* Ojos que aparecen al final para crear conexión */}
        {scroll.offset > 0.85 && (
          <group position={[0, 1.95, 0.75]}>
            <mesh position={[-0.07, 0, 0]}>
              <sphereGeometry args={[0.025]} />
              <meshStandardMaterial 
                color="#000000"
                emissive="#111111"
                emissiveIntensity={0.2}
              />
            </mesh>
            <mesh position={[0.07, 0, 0]}>
              <sphereGeometry args={[0.025]} />
              <meshStandardMaterial 
                color="#000000"
                emissive="#111111"
                emissiveIntensity={0.2}
              />
            </mesh>
            
            {/* Brillo en los ojos */}
            <mesh position={[-0.06, 0.01, 0.02]}>
              <sphereGeometry args={[0.008]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0.08, 0.01, 0.02]}>
              <sphereGeometry args={[0.008]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        )}

        {/* Aura mágica durante la materialización */}
        {scrollProgress > 0.6 && scrollProgress < 0.9 && (
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[1.5]} />
            <meshBasicMaterial 
              color="#6366f1"
              transparent
              opacity={0.03 * (1 - ((scrollProgress - 0.6) / 0.3))}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    </group>
  )
}