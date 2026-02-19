import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Box, Plane } from '@react-three/drei'
import * as THREE from 'three'

interface MagicalParticlesProps {
  scrollProgress: number
  particleCount: number
}

export function MagicalParticles({ scrollProgress, particleCount }: MagicalParticlesProps) {
  const groupRef = useRef<THREE.Group>(null)
  const materialsRef = useRef<THREE.ShaderMaterial[]>([])
  
  const particlePositions = Array.from({ length: particleCount }, (_, i) => ({
    x: (Math.random() - 0.5) * 20,
    y: Math.random() * 8,
    z: (Math.random() - 0.5) * 15,
    speed: 0.5 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
    originalY: Math.random() * 8
  }))

  // Shader para las partículas mágicas
  const particleShader = {
    uniforms: {
      time: { value: 0 },
      opacity: { value: 1.0 },
      size: { value: 1.0 },
      color: { value: new THREE.Color(0xffffff) }
    },
    vertexShader: `
      uniform float time;
      uniform float size;
      
      void main() {
        vec3 pos = position;
        
        // Movimiento flotante
        pos.y += sin(time * 2.0 + pos.x * 5.0) * 0.1;
        pos.x += cos(time * 1.5 + pos.z * 3.0) * 0.05;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (1.0 + sin(time * 3.0 + pos.x * 10.0) * 0.5);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float opacity;
      uniform vec3 color;
      
      void main() {
        // Crear un círculo suave
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center);
        
        if (dist > 0.5) discard;
        
        float alpha = (1.0 - dist * 2.0) * opacity;
        
        // Efecto de parpadeo
        alpha *= (0.8 + 0.2 * sin(time * 8.0));
        
        gl_FragColor = vec4(color, alpha);
      }
    `
  }

  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.getElapsedTime()
    
    // Las partículas aparecen durante la revelación del caballo
    const revealProgress = Math.max(0, Math.min(1, (scrollProgress - 0.6) / 0.3))
    const fadeOutProgress = scrollProgress > 0.95 ? (scrollProgress - 0.95) / 0.05 : 0
    
    groupRef.current.children.forEach((particle, index) => {
      if (particle instanceof THREE.Points && particle.material instanceof THREE.ShaderMaterial) {
        const data = particlePositions[index]
        
        // Actualizar posición
        particle.position.x = data.x + Math.sin(time * data.speed + data.phase) * 2
        particle.position.y = data.originalY + Math.cos(time * data.speed * 0.7 + data.phase) * 1
        particle.position.z = data.z + Math.sin(time * data.speed * 0.5 + data.phase) * 1.5
        
        // Actualizar shaders
        particle.material.uniforms.time.value = time
        particle.material.uniforms.opacity.value = revealProgress * (1 - fadeOutProgress) * 0.8
        
        // Colores mágicos que cambian
        const hue = (time * 0.1 + index * 0.1) % 1
        particle.material.uniforms.color.value.setHSL(hue, 0.8, 0.6)
        particle.material.uniforms.size.value = 3 + Math.sin(time * 2 + index) * 1
      }
    })
  })

  return (
    <group ref={groupRef}>
      {particlePositions.map((pos, index) => (
        <points key={index} position={[pos.x, pos.y, pos.z]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={1}
              array={new Float32Array([0, 0, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <shaderMaterial
            ref={(ref) => {
              if (ref) materialsRef.current[index] = ref
            }}
            uniforms={particleShader.uniforms}
            vertexShader={particleShader.vertexShader}
            fragmentShader={particleShader.fragmentShader}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      ))}
      
      {/* Partículas especiales alrededor del caballo */}
      {scrollProgress > 0.7 && (
        <group position={[3, 1, -2]}>
          {Array.from({ length: Math.floor(particleCount / 3) }, (_, i) => {
            const angle = (i / Math.floor(particleCount / 3)) * Math.PI * 2
            const radius = 2 + Math.sin(angle * 3) * 0.5
            return (
              <points 
                key={`special-${i}`}
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(angle * 2) * 0.5,
                  Math.sin(angle) * radius
                ]}
              >
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={1}
                    array={new Float32Array([0, 0, 0])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <shaderMaterial
                  uniforms={{
                    ...particleShader.uniforms,
                    color: { value: new THREE.Color(0xffd700) }, // Dorado
                    size: { value: 5.0 }
                  }}
                  vertexShader={particleShader.vertexShader}
                  fragmentShader={particleShader.fragmentShader}
                  transparent
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </points>
            )
          })}
        </group>
      )}
    </group>
  )
}