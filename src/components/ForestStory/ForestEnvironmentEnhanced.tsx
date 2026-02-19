import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

interface ForestEnvironmentEnhancedProps {
  performanceLevel: 'high' | 'medium' | 'low'
  enableShaders: boolean
}

export function ForestEnvironmentEnhanced({ performanceLevel, enableShaders }: ForestEnvironmentEnhancedProps) {
  const groupRef = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const treeMaterialsRef = useRef<(THREE.MeshStandardMaterial | THREE.ShaderMaterial)[]>([])
  const fogRef = useRef<THREE.Fog>()

  // Configuración dinámica basada en performance
  const config = useMemo(() => ({
    high: { treeCount: 15, grassCount: 50, enableFog: true, enableShaders: true },
    medium: { treeCount: 12, grassCount: 30, enableFog: true, enableShaders: false },
    low: { treeCount: 8, grassCount: 15, enableFog: false, enableShaders: false }
  }), [])[performanceLevel]

  // Shader mejorado para los árboles
  const treeShader = useMemo(() => {
    if (!enableShaders) return null
    
    return {
      uniforms: {
        time: { value: 0 },
        windStrength: { value: 0.02 },
        color: { value: new THREE.Color(0x15803d) },
        opacity: { value: 1.0 }
      },
      vertexShader: `
        uniform float time;
        uniform float windStrength;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          vec3 pos = position;
          
          // Efecto de viento realista
          float windEffect = sin(time * 2.0 + pos.x * 0.1 + pos.z * 0.1) * windStrength;
          windEffect += sin(time * 3.0 + pos.x * 0.2) * windStrength * 0.5;
          
          // Solo afecta la parte superior del árbol
          float heightFactor = smoothstep(0.0, 2.0, pos.y);
          pos.x += windEffect * heightFactor;
          pos.z += windEffect * heightFactor * 0.5;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Fresnel effect para realismo
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 2.0);
          
          // Variación de color basada en altura
          float heightVariation = smoothstep(0.0, 3.0, vPosition.y);
          vec3 finalColor = mix(color, color * 1.2, heightVariation * 0.3);
          
          // Sutil efecto de subsurface scattering
          finalColor += fresnel * vec3(0.1, 0.2, 0.05);
          
          gl_FragColor = vec4(finalColor, opacity);
        }
      `
    }
  }, [enableShaders])

  // Crear árboles con posiciones mejoradas
  const trees = useMemo(() => Array.from({ length: config.treeCount }, (_, i) => {
    const angle = (i / config.treeCount) * Math.PI * 2 + Math.random() * 0.5
    const distance = 6 + Math.random() * 8
    return {
      position: [
        Math.cos(angle) * distance + (Math.random() - 0.5) * 4,
        0,
        Math.sin(angle) * distance + (Math.random() - 0.5) * 4
      ] as [number, number, number],
      scale: [1.2 + Math.random() * 0.8, 2 + Math.random() * 1.5, 1.2 + Math.random() * 0.8],
      opacity: 0.7 + Math.random() * 0.3,
      rotation: Math.random() * Math.PI * 2,
      special: Math.random() > 0.7 // 30% son árboles especiales
    }
  }), [config.treeCount])

  useFrame((state) => {
    if (!groupRef.current) return
    
    const progress = scroll.offset
    const time = state.clock.getElapsedTime()

    // Actualizar materiales con shaders
    if (enableShaders) {
      treeMaterialsRef.current.forEach((material, index) => {
        if (material instanceof THREE.ShaderMaterial) {
          material.uniforms.time.value = time
          material.uniforms.windStrength.value = 0.02 + Math.sin(time * 0.5) * 0.01
        }
      })
    }

    // Parallax mejorado para los árboles
    groupRef.current.children.forEach((tree, index) => {
      if (tree instanceof THREE.Group && trees[index]) {
        const treeData = trees[index]
        const depth = Math.abs(treeData.position[2])
        const parallaxSpeed = (depth / 15) * 0.5
        
        // Movimiento parallax más suave
        tree.position.x = treeData.position[0] + (progress * parallaxSpeed * 3)
        
        // Rotación sutil por viento
        tree.rotation.y = treeData.rotation + Math.sin(time * 0.5 + index) * 0.05
        tree.rotation.z = Math.sin(time * 0.3 + index) * 0.02
      }
    })

    // Actualizar niebla dinámica
    if (config.enableFog && fogRef.current) {
      fogRef.current.density = 0.02 + Math.sin(time * 0.1) * 0.005
    }
  })

  return (
    <group ref={groupRef}>
      {/* Iluminación mejorada */}
      <ambientLight intensity={0.4} color="#4ade80" />
      <directionalLight 
        position={[10, 8, 5]} 
        intensity={1.2} 
        color="#fbbf24"
        castShadow={performanceLevel !== 'low'}
        shadow-mapSize-width={performanceLevel === 'high' ? 2048 : 1024}
        shadow-mapSize-height={performanceLevel === 'high' ? 2048 : 1024}
      />
      
      {/* Luz adicional para el encuentro */}
      <spotLight
        position={[3, 5, -2]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.8}
        color="#ffffff"
        castShadow={performanceLevel === 'high'}
      />
      
      {/* Niebla atmosférica mejorada */}
      {config.enableFog && (
        <fog 
          ref={fogRef}
          attach="fog" 
          args={['#065f46', 8, 25]} 
        />
      )}

      {/* Suelo del bosque mejorado */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        {enableShaders ? (
          <shaderMaterial
            uniforms={{
              time: { value: 0 },
              color1: { value: new THREE.Color('#166534') },
              color2: { value: new THREE.Color('#15803d') }
            }}
            vertexShader={`
              uniform float time;
              varying vec2 vUv;
              
              void main() {
                vUv = uv;
                vec3 pos = position;
                pos.z += sin(pos.x * 10.0 + time * 0.5) * 0.02;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
              }
            `}
            fragmentShader={`
              uniform vec3 color1;
              uniform vec3 color2;
              uniform float time;
              varying vec2 vUv;
              
              void main() {
                float pattern = sin(vUv.x * 50.0 + time) * 0.1 + 0.5;
                vec3 color = mix(color1, color2, pattern);
                gl_FragColor = vec4(color, 1.0);
              }
            `}
          />
        ) : (
          <meshLambertMaterial color="#166534" />
        )}
      </mesh>

      {/* Árboles mejorados */}
      {trees.map((tree, index) => (
        <group key={index} position={tree.position} rotation={[0, tree.rotation, 0]}>
          {/* Tronco */}
          <mesh position={[0, tree.scale[1] / 2, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.25, tree.scale[1], 8]} />
            <meshStandardMaterial 
              color="#78350f"
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
          
          {/* Copa del árbol con shader personalizado */}
          <mesh position={[0, tree.scale[1] * 0.8, 0]} castShadow>
            <sphereGeometry args={[tree.scale[0], 12, 8]} />
            {enableShaders && treeShader ? (
              <shaderMaterial
                ref={(ref) => {
                  if (ref) treeMaterialsRef.current[index] = ref
                }}
                uniforms={{
                  ...treeShader.uniforms,
                  opacity: { value: tree.opacity }
                }}
                vertexShader={treeShader.vertexShader}
                fragmentShader={treeShader.fragmentShader}
                transparent
                side={THREE.DoubleSide}
              />
            ) : (
              <meshStandardMaterial 
                color="#15803d" 
                transparent 
                opacity={tree.opacity}
                roughness={0.7}
                metalness={0.0}
              />
            )}
          </mesh>
          
          {/* Follaje adicional para árboles especiales */}
          {tree.special && (
            <>
              <mesh position={[-0.3, tree.scale[1] * 0.6, 0.2]} castShadow>
                <sphereGeometry args={[tree.scale[0] * 0.6, 10, 6]} />
                <meshStandardMaterial 
                  color="#16a34a" 
                  transparent 
                  opacity={tree.opacity * 0.8}
                  roughness={0.6}
                />
              </mesh>
              <mesh position={[0.2, tree.scale[1] * 0.7, -0.1]} castShadow>
                <sphereGeometry args={[tree.scale[0] * 0.5, 8, 6]} />
                <meshStandardMaterial 
                  color="#16a34a" 
                  transparent 
                  opacity={tree.opacity * 0.9}
                  roughness={0.6}
                />
              </mesh>
            </>
          )}
        </group>
      ))}

      {/* Vegetación del suelo mejorada */}
      {Array.from({ length: config.grassCount }, (_, i) => (
        <mesh
          key={`grass-${i}`}
          position={[
            (Math.random() - 0.5) * 40,
            -0.3,
            (Math.random() - 0.5) * 35
          ]}
          rotation={[0, Math.random() * Math.PI * 2, Math.random() * 0.2 - 0.1]}
        >
          <boxGeometry args={[0.03, 0.2 + Math.random() * 0.3, 0.03]} />
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(0.25 + Math.random() * 0.1, 0.6, 0.4)}
            roughness={0.8}
          />
        </mesh>
      ))}

      {/* Rocas y detalles ambientales */}
      {Array.from({ length: performanceLevel === 'high' ? 8 : 4 }, (_, i) => (
        <mesh
          key={`rock-${i}`}
          position={[
            (Math.random() - 0.5) * 30,
            -0.4,
            (Math.random() - 0.5) * 25
          ]}
          rotation={[
            Math.random() * 0.3,
            Math.random() * Math.PI * 2,
            Math.random() * 0.3
          ]}
        >
          <dodecahedronGeometry args={[0.1 + Math.random() * 0.2]} />
          <meshStandardMaterial 
            color="#4a5568"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}