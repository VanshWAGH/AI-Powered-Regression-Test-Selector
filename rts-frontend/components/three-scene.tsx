"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

function ParticleField({ count = 300, color = "#38bdf8" }: { count?: number; color?: string }) {
  const mesh = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.005
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005
      
      sizes[i] = Math.random() * 3 + 0.5
    }
    
    return { positions, velocities, sizes }
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    const geo = mesh.current.geometry
    const posArray = geo.attributes.position.array as Float32Array
    const time = state.clock.elapsedTime
    
    for (let i = 0; i < count; i++) {
      posArray[i * 3] += particles.velocities[i * 3]
      posArray[i * 3 + 1] += particles.velocities[i * 3 + 1]
      posArray[i * 3 + 2] += particles.velocities[i * 3 + 2]
      
      // Soft boundary wrapping
      for (let j = 0; j < 3; j++) {
        if (Math.abs(posArray[i * 3 + j]) > 10) {
          particles.velocities[i * 3 + j] *= -1
        }
      }
      
      // Gentle wave motion
      posArray[i * 3 + 1] += Math.sin(time * 0.3 + i * 0.1) * 0.001
    }
    
    geo.attributes.position.needsUpdate = true
    mesh.current.rotation.y = time * 0.02
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[particles.sizes, 1]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.06}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function GlowingOrb({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const mesh = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime
    mesh.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.5
    mesh.current.position.x = position[0] + Math.cos(t * 0.3 + position[1]) * 0.3
    mesh.current.scale.setScalar(scale + Math.sin(t * 0.8) * 0.1)
  })

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  )
}

function FloatingGrid() {
  const grid = useRef<THREE.GridHelper>(null)
  
  useFrame((state) => {
    if (!grid.current) return
    grid.current.position.z = -(state.clock.elapsedTime * 0.3 % 2)
  })

  return (
    <gridHelper
      ref={grid}
      args={[40, 40, "#1e3a5f", "#0d1b2a"]}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -5]}
    />
  )
}

interface ThreeSceneProps {
  variant?: "login" | "dashboard"
  className?: string
}

export function ThreeScene({ variant = "login", className = "" }: ThreeSceneProps) {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.2} />
        
        <ParticleField
          count={variant === "login" ? 400 : 150}
          color="#38bdf8"
        />
        <ParticleField
          count={variant === "login" ? 200 : 80}
          color="#a78bfa"
        />
        
        <GlowingOrb position={[-4, 2, -3]} color="#38bdf8" scale={1.5} />
        <GlowingOrb position={[3, -1, -2]} color="#a78bfa" scale={1.2} />
        <GlowingOrb position={[0, 3, -4]} color="#34d399" scale={1.0} />
        
        {variant === "login" && (
          <>
            <GlowingOrb position={[-2, -3, -1]} color="#818cf8" scale={0.8} />
            <GlowingOrb position={[5, 1, -5]} color="#38bdf8" scale={1.8} />
            <FloatingGrid />
          </>
        )}
      </Canvas>
    </div>
  )
}
