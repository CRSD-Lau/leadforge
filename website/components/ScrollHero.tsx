'use client'

import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Sphere, Cylinder } from '@react-three/drei'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Shared scroll progress – updated in React, read in R3F useFrame (no state)
// ---------------------------------------------------------------------------
const scrollState = { progress: 0 }

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// ---------------------------------------------------------------------------
// Materials (shared instances for performance)
// ---------------------------------------------------------------------------
const MAT = {
  skin:     { color: '#FDBCB4', roughness: 0.55, metalness: 0.0 },
  hair:     { color: '#3D2214', roughness: 0.9,  metalness: 0.0 },
  shirt:    { color: '#2A5080', roughness: 0.75, metalness: 0.0 },
  pants:    { color: '#1A2A44', roughness: 0.85, metalness: 0.0 },
  shoe:     { color: '#1A1A28', roughness: 0.9,  metalness: 0.05 },
  eyes:     { color: '#111130', roughness: 0.3,  metalness: 0.1 },
  desk:     { color: '#263650', roughness: 0.55, metalness: 0.05 },
  deskLeg:  { color: '#1E2D44', roughness: 0.85, metalness: 0.1  },
  monitor:  { color: '#1E2D44', roughness: 0.4,  metalness: 0.3  },
  chair:    { color: '#141E30', roughness: 0.9,  metalness: 0.05 },
  keyboard: { color: '#223050', roughness: 0.7,  metalness: 0.1  },
  mug:      { color: '#F97316', roughness: 0.5,  metalness: 0.05 },
}

// ---------------------------------------------------------------------------
// Desk + accessories
// ---------------------------------------------------------------------------
function Desk() {
  return (
    <group>
      {/* Surface */}
      <RoundedBox args={[2.7, 0.07, 1.35]} radius={0.02} smoothness={2}
        position={[0, 0.98, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...MAT.desk} />
      </RoundedBox>
      {/* Legs */}
      {([ [-1.2, 0.49, -0.58], [1.2, 0.49, -0.58], [-1.2, 0.49, 0.58], [1.2, 0.49, 0.58] ] as [number,number,number][]).map((pos, i) => (
        <RoundedBox key={i} args={[0.055, 0.97, 0.055]} radius={0.015} smoothness={2}
          position={pos} castShadow>
          <meshStandardMaterial {...MAT.deskLeg} />
        </RoundedBox>
      ))}
      {/* Keyboard */}
      <RoundedBox args={[0.62, 0.022, 0.26]} radius={0.01} smoothness={2}
        position={[0, 1.025, 0.15]} castShadow>
        <meshStandardMaterial {...MAT.keyboard} />
      </RoundedBox>
      {/* Keyboard detail rows */}
      {[-0.04, 0.04].map((z, i) => (
        <RoundedBox key={i} args={[0.56, 0.008, 0.005]} radius={0.002} smoothness={2}
          position={[0, 1.038, 0.15 + z]}>
          <meshStandardMaterial color="#263656" roughness={0.6} />
        </RoundedBox>
      ))}
      {/* Coffee mug */}
      <group position={[0.9, 1.04, -0.12]}>
        <Cylinder args={[0.055, 0.05, 0.14, 12]} castShadow>
          <meshStandardMaterial {...MAT.mug} />
        </Cylinder>
        {/* Mug handle */}
        <mesh position={[0.072, 0, 0]}>
          <torusGeometry args={[0.04, 0.012, 6, 10, Math.PI]} />
          <meshStandardMaterial {...MAT.mug} />
        </mesh>
        {/* Coffee surface */}
        <Cylinder args={[0.045, 0.045, 0.005, 12]} position={[0, 0.07, 0]}>
          <meshStandardMaterial color="#2C1407" roughness={0.3} />
        </Cylinder>
      </group>
      {/* Notepad */}
      <RoundedBox args={[0.3, 0.01, 0.22]} radius={0.005} smoothness={2}
        position={[-0.85, 1.016, 0.0]} rotation={[0, 0.1, 0]}>
        <meshStandardMaterial color="#F8F4EC" roughness={0.95} />
      </RoundedBox>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Monitor
// ---------------------------------------------------------------------------
function Monitor({ screenRef }: { screenRef: React.MutableRefObject<THREE.Mesh | null> }) {
  return (
    <group position={[0, 1.65, -0.3]}>
      {/* Bezel */}
      <RoundedBox args={[1.28, 0.90, 0.055]} radius={0.025} smoothness={2} castShadow>
        <meshStandardMaterial {...MAT.monitor} />
      </RoundedBox>
      {/* Screen face */}
      <mesh ref={screenRef} position={[0, 0, 0.032]}>
        <planeGeometry args={[1.14, 0.77]} />
        <meshStandardMaterial color="#050A18" emissive="#050A18" emissiveIntensity={0.6} roughness={0.05} />
      </mesh>
      {/* Thin bezel border */}
      <RoundedBox args={[1.18, 0.81, 0.008]} radius={0.01} smoothness={2} position={[0, 0, 0.033]}>
        <meshStandardMaterial color="#263656" roughness={0.3} metalness={0.2} />
      </RoundedBox>
      {/* Stand neck */}
      <Cylinder args={[0.025, 0.03, 0.22, 8]} position={[0, -0.56, 0]} castShadow>
        <meshStandardMaterial color="#263656" roughness={0.4} metalness={0.3} />
      </Cylinder>
      {/* Stand base */}
      <RoundedBox args={[0.38, 0.035, 0.26]} radius={0.01} smoothness={2} position={[0, -0.68, 0.06]} castShadow>
        <meshStandardMaterial color="#1E2A40" roughness={0.4} metalness={0.2} />
      </RoundedBox>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Chair (better ergonomic shape)
// ---------------------------------------------------------------------------
function Chair() {
  return (
    <group position={[0, 0, 0.9]}>
      {/* Seat */}
      <RoundedBox args={[0.74, 0.065, 0.70]} radius={0.025} smoothness={2}
        position={[0, 1.04, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...MAT.chair} />
      </RoundedBox>
      {/* Back rest */}
      <RoundedBox args={[0.72, 0.82, 0.065]} radius={0.025} smoothness={2}
        position={[0, 1.49, 0.32]} castShadow>
        <meshStandardMaterial {...MAT.chair} />
      </RoundedBox>
      {/* Lumbar ridge */}
      <RoundedBox args={[0.58, 0.12, 0.04]} radius={0.02} smoothness={2}
        position={[0, 1.32, 0.36]}>
        <meshStandardMaterial color="#0A1020" roughness={0.9} />
      </RoundedBox>
      {/* Armrests */}
      {([-0.4, 0.4] as number[]).map((x, i) => (
        <group key={i} position={[x, 1.22, 0.06]}>
          <RoundedBox args={[0.07, 0.28, 0.07]} radius={0.02} smoothness={2} position={[0, 0, 0]}>
            <meshStandardMaterial color="#111928" roughness={0.8} />
          </RoundedBox>
          <RoundedBox args={[0.08, 0.025, 0.22]} radius={0.012} smoothness={2} position={[0, 0.15, 0.08]}>
            <meshStandardMaterial color="#111928" roughness={0.7} />
          </RoundedBox>
        </group>
      ))}
      {/* 5-star base */}
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <RoundedBox key={i} args={[0.36, 0.04, 0.05]} radius={0.01} smoothness={2}
            position={[Math.cos(a) * 0.2, 0.04, Math.sin(a) * 0.2]}
            rotation={[0, -a, 0]}>
            <meshStandardMaterial color="#141E30" roughness={0.7} metalness={0.2} />
          </RoundedBox>
        )
      })}
      {/* Center post */}
      <Cylinder args={[0.025, 0.035, 0.88, 8]} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#1A2436" roughness={0.4} metalness={0.3} />
      </Cylinder>
      {/* Casters */}
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <Sphere key={i} args={[0.04, 8, 8]}
            position={[Math.cos(a) * 0.34, 0.04, Math.sin(a) * 0.34]}>
            <meshStandardMaterial color="#0A0E18" roughness={0.5} metalness={0.2} />
          </Sphere>
        )
      })}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Developer – realistic low-poly human with proper joint hierarchy
// ---------------------------------------------------------------------------
function Developer({
  torsoRef, headGroupRef, lArmGroupRef, rArmGroupRef, lLegGroupRef, rLegGroupRef,
}: {
  torsoRef:      React.MutableRefObject<THREE.Group | null>
  headGroupRef:  React.MutableRefObject<THREE.Group | null>
  lArmGroupRef:  React.MutableRefObject<THREE.Group | null>
  rArmGroupRef:  React.MutableRefObject<THREE.Group | null>
  lLegGroupRef:  React.MutableRefObject<THREE.Group | null>
  rLegGroupRef:  React.MutableRefObject<THREE.Group | null>
}) {
  return (
    /* Root group – Z offset so character is behind desk */
    <group position={[0, 0, 0.38]}>
      {/* ── TORSO (pivot = hip level) ─────────────────────────────── */}
      <group ref={torsoRef} position={[0, 1.62, 0]}>

        {/* Upper body / shirt */}
        <RoundedBox args={[0.52, 0.62, 0.28]} radius={0.06} smoothness={2} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial {...MAT.shirt} />
        </RoundedBox>
        {/* Shoulder width bump */}
        <RoundedBox args={[0.62, 0.12, 0.26]} radius={0.05} smoothness={2} position={[0, 0.22, 0]} castShadow>
          <meshStandardMaterial {...MAT.shirt} />
        </RoundedBox>

        {/* ── NECK ────────────────────────────────────────────────── */}
        <Cylinder args={[0.065, 0.075, 0.14, 10]} position={[0, 0.38, 0.03]} castShadow>
          <meshStandardMaterial {...MAT.skin} />
        </Cylinder>

        {/* ── HEAD GROUP (pivot = base of head) ───────────────────── */}
        <group ref={headGroupRef} position={[0, 0.55, 0.02]}>
          {/* Head sphere */}
          <Sphere args={[0.195, 16, 12]} position={[0, 0.19, 0]} castShadow>
            <meshStandardMaterial {...MAT.skin} />
          </Sphere>
          {/* Jaw/chin — flatten the bottom */}
          <RoundedBox args={[0.32, 0.09, 0.28]} radius={0.04} smoothness={2} position={[0, 0.06, 0.01]}>
            <meshStandardMaterial {...MAT.skin} />
          </RoundedBox>
          {/* Hair — cap on top of head */}
          <Sphere args={[0.202, 16, 12]} position={[0, 0.24, -0.02]} castShadow>
            <meshStandardMaterial {...MAT.hair} side={THREE.FrontSide} />
          </Sphere>
          {/* Hair front edge (fringe) */}
          <RoundedBox args={[0.3, 0.075, 0.12]} radius={0.03} smoothness={2} position={[0, 0.36, 0.1]}>
            <meshStandardMaterial {...MAT.hair} />
          </RoundedBox>
          {/* Left eye */}
          <Sphere args={[0.032, 8, 8]} position={[-0.072, 0.2, 0.175]}>
            <meshStandardMaterial {...MAT.eyes} />
          </Sphere>
          {/* Right eye */}
          <Sphere args={[0.032, 8, 8]} position={[0.072, 0.2, 0.175]}>
            <meshStandardMaterial {...MAT.eyes} />
          </Sphere>
          {/* Eye whites (slightly larger, behind pupils) */}
          <Sphere args={[0.042, 8, 8]} position={[-0.072, 0.2, 0.168]}>
            <meshStandardMaterial color="#F0EBE3" roughness={0.3} />
          </Sphere>
          <Sphere args={[0.042, 8, 8]} position={[0.072, 0.2, 0.168]}>
            <meshStandardMaterial color="#F0EBE3" roughness={0.3} />
          </Sphere>
          {/* Pupils on top */}
          <Sphere args={[0.026, 8, 8]} position={[-0.072, 0.2, 0.178]}>
            <meshStandardMaterial {...MAT.eyes} />
          </Sphere>
          <Sphere args={[0.026, 8, 8]} position={[0.072, 0.2, 0.178]}>
            <meshStandardMaterial {...MAT.eyes} />
          </Sphere>
          {/* Ears */}
          <Sphere args={[0.04, 8, 8]} position={[-0.196, 0.18, 0]}>
            <meshStandardMaterial {...MAT.skin} />
          </Sphere>
          <Sphere args={[0.04, 8, 8]} position={[0.196, 0.18, 0]}>
            <meshStandardMaterial {...MAT.skin} />
          </Sphere>
          {/* Nose */}
          <RoundedBox args={[0.04, 0.05, 0.065]} radius={0.018} smoothness={2} position={[0, 0.16, 0.2]}>
            <meshStandardMaterial {...MAT.skin} />
          </RoundedBox>
        </group>

        {/* ── LEFT ARM (pivot = shoulder) ──────────────────────────── */}
        <group ref={lArmGroupRef} position={[-0.32, 0.26, 0]}>
          {/* Upper arm (sleeve) */}
          <RoundedBox args={[0.148, 0.44, 0.148]} radius={0.05} smoothness={2} position={[0, -0.22, 0]} castShadow>
            <meshStandardMaterial {...MAT.shirt} />
          </RoundedBox>
          {/* Elbow joint */}
          <Sphere args={[0.07, 8, 8]} position={[0, -0.44, 0]}>
            <meshStandardMaterial {...MAT.skin} />
          </Sphere>
          {/* Forearm */}
          <RoundedBox args={[0.128, 0.40, 0.128]} radius={0.045} smoothness={2} position={[0, -0.65, 0]} castShadow>
            <meshStandardMaterial {...MAT.skin} />
          </RoundedBox>
          {/* Hand */}
          <RoundedBox args={[0.13, 0.10, 0.075]} radius={0.028} smoothness={2} position={[0, -0.9, 0.015]}>
            <meshStandardMaterial {...MAT.skin} />
          </RoundedBox>
        </group>

        {/* ── RIGHT ARM (pivot = shoulder) ─────────────────────────── */}
        <group ref={rArmGroupRef} position={[0.32, 0.26, 0]}>
          <RoundedBox args={[0.148, 0.44, 0.148]} radius={0.05} smoothness={2} position={[0, -0.22, 0]} castShadow>
            <meshStandardMaterial {...MAT.shirt} />
          </RoundedBox>
          <Sphere args={[0.07, 8, 8]} position={[0, -0.44, 0]}>
            <meshStandardMaterial {...MAT.skin} />
          </Sphere>
          <RoundedBox args={[0.128, 0.40, 0.128]} radius={0.045} smoothness={2} position={[0, -0.65, 0]} castShadow>
            <meshStandardMaterial {...MAT.skin} />
          </RoundedBox>
          <RoundedBox args={[0.13, 0.10, 0.075]} radius={0.028} smoothness={2} position={[0, -0.9, 0.015]}>
            <meshStandardMaterial {...MAT.skin} />
          </RoundedBox>
        </group>

        {/* ── LEFT LEG (pivot = hip socket) ───────────────────────── */}
        <group ref={lLegGroupRef} position={[-0.148, -0.42, 0]}>
          {/* Thigh */}
          <RoundedBox args={[0.162, 0.50, 0.162]} radius={0.05} smoothness={2} position={[0, -0.26, 0]} castShadow>
            <meshStandardMaterial {...MAT.pants} />
          </RoundedBox>
          {/* Knee */}
          <Sphere args={[0.08, 8, 8]} position={[0, -0.52, 0]}>
            <meshStandardMaterial {...MAT.pants} />
          </Sphere>
          {/* Calf */}
          <RoundedBox args={[0.145, 0.46, 0.145]} radius={0.045} smoothness={2} position={[0, -0.76, 0]} castShadow>
            <meshStandardMaterial {...MAT.pants} />
          </RoundedBox>
          {/* Shoe */}
          <RoundedBox args={[0.155, 0.085, 0.30]} radius={0.025} smoothness={2} position={[0.005, -1.02, -0.06]} castShadow>
            <meshStandardMaterial {...MAT.shoe} />
          </RoundedBox>
          {/* Shoe sole */}
          <RoundedBox args={[0.16, 0.025, 0.31]} radius={0.012} smoothness={2} position={[0.005, -1.063, -0.06]}>
            <meshStandardMaterial color="#1A1A24" roughness={0.95} />
          </RoundedBox>
        </group>

        {/* ── RIGHT LEG (pivot = hip socket) ──────────────────────── */}
        <group ref={rLegGroupRef} position={[0.148, -0.42, 0]}>
          <RoundedBox args={[0.162, 0.50, 0.162]} radius={0.05} smoothness={2} position={[0, -0.26, 0]} castShadow>
            <meshStandardMaterial {...MAT.pants} />
          </RoundedBox>
          <Sphere args={[0.08, 8, 8]} position={[0, -0.52, 0]}>
            <meshStandardMaterial {...MAT.pants} />
          </Sphere>
          <RoundedBox args={[0.145, 0.46, 0.145]} radius={0.045} smoothness={2} position={[0, -0.76, 0]} castShadow>
            <meshStandardMaterial {...MAT.pants} />
          </RoundedBox>
          <RoundedBox args={[0.155, 0.085, 0.30]} radius={0.025} smoothness={2} position={[0.005, -1.02, -0.06]} castShadow>
            <meshStandardMaterial {...MAT.shoe} />
          </RoundedBox>
          <RoundedBox args={[0.16, 0.025, 0.31]} radius={0.012} smoothness={2} position={[0.005, -1.063, -0.06]}>
            <meshStandardMaterial color="#1A1A24" roughness={0.95} />
          </RoundedBox>
        </group>

      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Floating code particles
// ---------------------------------------------------------------------------
function CodeParticles() {
  const groupRef = useRef<THREE.Group>(null)
  const particles = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      pos: [(Math.random() - 0.5) * 7.5, 0.6 + Math.random() * 3.8, (Math.random() - 0.5) * 3.5] as [number, number, number],
      speed: 0.16 + Math.random() * 0.25,
      phase: Math.random() * Math.PI * 2,
      scale: 0.05 + Math.random() * 0.04,
    })), [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = scrollState.progress
    const targetOpacity = (t > 0.44 && t < 0.88) ? 0.55 : 0
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh
      mesh.position.y = particles[i].pos[1] + Math.sin(clock.elapsedTime * particles[i].speed + particles[i].phase) * 0.3
      mesh.rotation.y = clock.elapsedTime * 0.55 + particles[i].phase
      mesh.rotation.x = clock.elapsedTime * 0.3 + particles[i].phase * 0.5
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.opacity += (targetOpacity - mat.opacity) * 0.12
    })
  })

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos} scale={p.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#F97316" emissive="#F97316" emissiveIntensity={0.7}
            transparent opacity={0} roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Ground plane with subtle grid reflection
// ---------------------------------------------------------------------------
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[22, 22]} />
      <meshStandardMaterial color="#06090F" roughness={0.95} />
    </mesh>
  )
}

// ---------------------------------------------------------------------------
// Screen colors for each stage
// ---------------------------------------------------------------------------
const SCREEN_COLORS = [
  new THREE.Color('#050A18'), // off
  new THREE.Color('#052E16'), // booting (dark green)
  new THREE.Color('#14532D'), // coding (green)
  new THREE.Color('#7C2D12'), // building (dark orange)
  new THREE.Color('#FFFFFF'), // live (white)
]

// ---------------------------------------------------------------------------
// Main scene – camera orbit + character animation in useFrame
// ---------------------------------------------------------------------------
function Scene() {
  const torsoRef      = useRef<THREE.Group>(null)
  const headGroupRef  = useRef<THREE.Group>(null)
  const lArmGroupRef  = useRef<THREE.Group>(null)
  const rArmGroupRef  = useRef<THREE.Group>(null)
  const lLegGroupRef  = useRef<THREE.Group>(null)
  const rLegGroupRef  = useRef<THREE.Group>(null)
  const screenRef     = useRef<THREE.Mesh>(null)

  const targetColor  = useRef(new THREE.Color('#050A18'))
  const currentColor = useRef(new THREE.Color('#050A18'))

  useFrame(({ camera, clock }, delta) => {
    const t = scrollState.progress

    // ── Camera orbit 270° ────────────────────────────────────────────────────
    const startAngle = 0.55
    const angle      = startAngle + t * Math.PI * 1.5
    const radius     = 6.2
    const camH       = lerp(3.6, 2.2, t)
    camera.position.set(Math.sin(angle) * radius, camH, Math.cos(angle) * radius)
    camera.lookAt(0, 1.55, 0)

    // ── Sit / stand animation ─────────────────────────────────────────────────
    const sitT   = Math.max(0, Math.min(1, (t - 0.2) / 0.25))
    const standT = t > 0.88 ? Math.min(1, (t - 0.88) / 0.12) : 0
    const sitAmt = sitT * (1 - standT)

    // Torso Y: standing = 1.62, seated = 1.18
    if (torsoRef.current) {
      const targetY = lerp(1.62, 1.18, sitAmt)
      torsoRef.current.position.y += (targetY - torsoRef.current.position.y) * Math.min(1, delta * 5.5)
    }

    // Head subtle breathing bob
    if (headGroupRef.current) {
      const breathe = Math.sin(clock.elapsedTime * 1.1) * 0.006
      const nod     = sitAmt * 0.06  // slight forward tilt when sitting
      headGroupRef.current.rotation.x = -nod + breathe
      headGroupRef.current.position.y = lerp(0.55, 0.52, sitAmt) + breathe * 0.5
    }

    // ── Typing arms ───────────────────────────────────────────────────────────
    const typingT   = t > 0.45 && t < 0.88 ? Math.min(1, (t - 0.45) / 0.2) : 0
    const armFwdRot = lerp(0, -1.05, typingT * sitAmt)

    // Slight idle arm sway when standing
    const idleSway = Math.sin(clock.elapsedTime * 0.7) * 0.04 * (1 - sitAmt)

    if (lArmGroupRef.current) {
      lArmGroupRef.current.rotation.x += (armFwdRot + idleSway - lArmGroupRef.current.rotation.x) * Math.min(1, delta * 6)
    }
    if (rArmGroupRef.current) {
      rArmGroupRef.current.rotation.x += (armFwdRot - idleSway - rArmGroupRef.current.rotation.x) * Math.min(1, delta * 6)
    }

    // ── Legs: thighs rotate horizontal when seated ────────────────────────────
    const legRotX = lerp(0, Math.PI / 2.05, sitAmt)
    const legFwdZ = lerp(0, 0.42, sitAmt)   // thighs push forward under desk

    if (lLegGroupRef.current) {
      lLegGroupRef.current.rotation.x += (legRotX - lLegGroupRef.current.rotation.x) * Math.min(1, delta * 5.5)
      lLegGroupRef.current.position.z += (legFwdZ - lLegGroupRef.current.position.z) * Math.min(1, delta * 5.5)
    }
    if (rLegGroupRef.current) {
      rLegGroupRef.current.rotation.x += (legRotX - rLegGroupRef.current.rotation.x) * Math.min(1, delta * 5.5)
      rLegGroupRef.current.position.z += (legFwdZ - rLegGroupRef.current.position.z) * Math.min(1, delta * 5.5)
    }

    // ── Monitor screen color ──────────────────────────────────────────────────
    if (t < 0.30)      targetColor.current.copy(SCREEN_COLORS[0])
    else if (t < 0.52) targetColor.current.copy(SCREEN_COLORS[1])
    else if (t < 0.72) targetColor.current.copy(SCREEN_COLORS[2])
    else if (t < 0.88) targetColor.current.copy(SCREEN_COLORS[3])
    else               targetColor.current.copy(SCREEN_COLORS[4])

    currentColor.current.lerp(targetColor.current, Math.min(1, delta * 2.8))

    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial
      mat.color.copy(currentColor.current)
      mat.emissive.copy(currentColor.current)
      const isWhite = t >= 0.88
      mat.emissiveIntensity = isWhite
        ? 0.95 + Math.sin(clock.elapsedTime * 1.4) * 0.04
        : t > 0.50 ? 0.5 + Math.sin(clock.elapsedTime * 2.2) * 0.08 : 0.35
    }
  })

  return (
    <>
      {/* ── Three-point lighting ─────────────────────────────────────── */}
      {/* Key light — warm, from upper right */}
      <directionalLight
        position={[5, 9, 4]} intensity={3.5} castShadow
        color="#FFF8F0"
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-near={0.5} shadow-camera-far={30}
        shadow-camera-left={-6} shadow-camera-right={6}
        shadow-camera-top={6} shadow-camera-bottom={-2}
      />
      {/* Fill light — cool blue, from left */}
      <directionalLight position={[-6, 4, 2]} intensity={1.4} color="#B8D0FF" />
      {/* Rim / back light — orange accent, from behind character */}
      <directionalLight position={[0, 3, -5]} intensity={1.2} color="#FF8C40" />
      {/* Ambient — keeps shadow areas readable */}
      <ambientLight intensity={1.0} color="#9AB0CC" />
      {/* Monitor glow */}
      <pointLight position={[0, 1.7, -0.04]} intensity={1.8} color="#F97316" distance={4} decay={2} />
      {/* Desk surface warm fill */}
      <pointLight position={[0, 1.6, 0.5]} intensity={0.8} color="#FFE4B0" distance={3} decay={2} />

      <Ground />
      <Desk />
      <Chair />
      <Monitor screenRef={screenRef} />
      <Developer
        torsoRef={torsoRef}
        headGroupRef={headGroupRef}
        lArmGroupRef={lArmGroupRef}
        rArmGroupRef={rArmGroupRef}
        lLegGroupRef={lLegGroupRef}
        rLegGroupRef={rLegGroupRef}
      />
      <CodeParticles />
    </>
  )
}

// ---------------------------------------------------------------------------
// Narrative stages
// ---------------------------------------------------------------------------
const STAGES = [
  { range: [0, 0.22] as [number,number],     tag: 'THE PROBLEM', title: 'Your business is\ninvisible online.',    sub: "87% of customers search before calling. If they can't find you, they find your competitor." },
  { range: [0.22, 0.44] as [number,number],  tag: 'DAY 0',       title: 'Neil gets to\nwork.',                   sub: 'Discovery call booked. Brief taken. Build starts within 24 hours.' },
  { range: [0.44, 0.66] as [number,number],  tag: 'DAY 1–2',     title: 'Claude writes\nthe code.',              sub: 'React, Tailwind, mobile-first. Built faster than you can write a brief.' },
  { range: [0.66, 0.88] as [number,number],  tag: 'DAY 3–4',     title: 'Your site\ntakes shape.',               sub: 'Preview link shared. One revision round. Zero surprises.' },
  { range: [0.88, 1.01] as [number,number],  tag: 'DAY 5',       title: '$650. 5 days.\nYours forever.',         sub: 'Domain live. GitHub repo handed over. You own every line of code.' },
]

// ---------------------------------------------------------------------------
// Progress dots
// ---------------------------------------------------------------------------
function ProgressDots({ active }: { active: number }) {
  return (
    <div className="flex gap-2">
      {STAGES.map((_, i) => (
        <motion.div key={i}
          animate={{ width: i === active ? 24 : 8, backgroundColor: i === active ? '#F97316' : '#263656' }}
          transition={{ duration: 0.3 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Root export
// ---------------------------------------------------------------------------
export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStage, setActiveStage] = useState(0)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollState.progress = Math.max(0, Math.min(1, v))
    let next = 0
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (v >= STAGES[i].range[0]) { next = i; break }
    }
    setActiveStage(next)
  })

  const opacity0 = useTransform(scrollYProgress, [0, 0, STAGES[0].range[1]-0.04, STAGES[0].range[1]], [1,1,1,0])
  const opacity1 = useTransform(scrollYProgress, [STAGES[1].range[0], STAGES[1].range[0]+0.04, STAGES[1].range[1]-0.04, STAGES[1].range[1]], [0,1,1,0])
  const opacity2 = useTransform(scrollYProgress, [STAGES[2].range[0], STAGES[2].range[0]+0.04, STAGES[2].range[1]-0.04, STAGES[2].range[1]], [0,1,1,0])
  const opacity3 = useTransform(scrollYProgress, [STAGES[3].range[0], STAGES[3].range[0]+0.04, STAGES[3].range[1]-0.04, STAGES[3].range[1]], [0,1,1,0])
  const opacity4 = useTransform(scrollYProgress, [STAGES[4].range[0], STAGES[4].range[0]+0.04, 0.98, 1.0], [0,1,1,1])
  const opacities = [opacity0, opacity1, opacity2, opacity3, opacity4]

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])
  const dotsOpacity    = useTransform(scrollYProgress, [0.04, 0.1], [0, 1])
  const percentOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0])
  const percentDisplay = useTransform(scrollYProgress, (v) => `${Math.round(v * 100).toString().padStart(3, '0')}%`)

  return (
    <section ref={containerRef} className="relative" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-navy-900">

        {/* 3D Canvas */}
        <div className="absolute inset-0">
          <Canvas
            shadows
            camera={{ position: [5.5, 3.8, 5.5], fov: 42, near: 0.1, far: 60 }}
            gl={{ antialias: true, alpha: false }}
          >
            <Scene />
          </Canvas>
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/72 via-navy-900/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/55 via-transparent to-transparent pointer-events-none" />

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col justify-center pointer-events-none">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-sm lg:max-w-md">
              {STAGES.map((stage, i) => (
                <motion.div key={i} style={{ opacity: opacities[i] }} className="absolute">
                  <span className="font-mono text-xs text-orange-500 tracking-widest uppercase mb-3 block">
                    {stage.tag}
                  </span>
                  <h2 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-5 whitespace-pre-line">
                    {stage.title}
                  </h2>
                  <p className="font-sans text-slate-400 text-base sm:text-lg leading-relaxed max-w-xs">
                    {stage.sub}
                  </p>
                  {i === STAGES.length - 1 && (
                    <div className="mt-7 flex gap-3 pointer-events-auto">
                      <a href="/contact" className="btn-orange text-sm px-6 py-3">Get Your Site — $650</a>
                      <a href="tel:5066399083" className="btn-outline text-sm px-6 py-3">Call Neil</a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator + dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none">
          <motion.div style={{ opacity: scrollIndicatorOpacity }}>
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-xs text-slate-600 uppercase tracking-widest">Scroll</span>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-px h-8 bg-gradient-to-b from-orange-500 to-transparent" />
            </div>
          </motion.div>
          <motion.div style={{ opacity: dotsOpacity }}>
            <ProgressDots active={activeStage} />
          </motion.div>
        </div>

        {/* Scroll % counter */}
        <motion.div className="absolute top-8 right-6 font-mono text-xs text-orange-500/40 hidden lg:block"
          style={{ opacity: percentOpacity }}>
          <motion.span>{percentDisplay}</motion.span>
        </motion.div>

      </div>
    </section>
  )
}
