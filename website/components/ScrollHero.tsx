'use client'

import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Sphere, Cylinder } from '@react-three/drei'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Shared scroll progress
// ---------------------------------------------------------------------------
const scrollState = { progress: 0 }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function clamp01(t: number) { return Math.max(0, Math.min(1, t)) }

// ---------------------------------------------------------------------------
// Desk + accessories
// ---------------------------------------------------------------------------
function Desk() {
  return (
    <group>
      {/* Surface */}
      <RoundedBox args={[2.7, 0.07, 1.35]} radius={0.02} smoothness={2}
        position={[0, 0.98, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#243048" roughness={0.5} metalness={0.05} />
      </RoundedBox>
      {/* Legs */}
      {([ [-1.2, 0.49, -0.56], [1.2, 0.49, -0.56], [-1.2, 0.49, 0.56], [1.2, 0.49, 0.56] ] as [number,number,number][]).map((pos, i) => (
        <RoundedBox key={i} args={[0.055, 0.97, 0.055]} radius={0.015} smoothness={2}
          position={pos} castShadow>
          <meshStandardMaterial color="#141E30" roughness={0.85} metalness={0.1} />
        </RoundedBox>
      ))}
      {/* Keyboard */}
      <RoundedBox args={[0.66, 0.022, 0.28]} radius={0.01} smoothness={2}
        position={[0, 1.026, 0.14]} castShadow>
        <meshStandardMaterial color="#1A2438" roughness={0.7} metalness={0.1} />
      </RoundedBox>
      {/* Key rows */}
      {[-0.07, -0.01, 0.05, 0.11].map((z, i) => (
        <RoundedBox key={i} args={[0.60, 0.007, 0.005]} radius={0.002} smoothness={1}
          position={[0, 1.038, 0.14 + z]}>
          <meshStandardMaterial color="#263656" roughness={0.6} />
        </RoundedBox>
      ))}
      {/* Mouse */}
      <RoundedBox args={[0.09, 0.025, 0.14]} radius={0.04} smoothness={2}
        position={[0.48, 1.023, 0.15]}>
        <meshStandardMaterial color="#0E1624" roughness={0.6} metalness={0.1} />
      </RoundedBox>
      {/* Mouse scroll wheel */}
      <Cylinder args={[0.012, 0.012, 0.008, 8]} position={[0.48, 1.036, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#263656" />
      </Cylinder>
      {/* Coffee mug */}
      <group position={[0.9, 1.04, -0.1]}>
        <Cylinder args={[0.055, 0.048, 0.13, 14]} castShadow>
          <meshStandardMaterial color="#E8820C" roughness={0.5} />
        </Cylinder>
        <mesh position={[0.072, -0.01, 0]}>
          <torusGeometry args={[0.038, 0.011, 6, 10, Math.PI]} />
          <meshStandardMaterial color="#E8820C" roughness={0.5} />
        </mesh>
        <Cylinder args={[0.044, 0.044, 0.004, 12]} position={[0, 0.067, 0]}>
          <meshStandardMaterial color="#2C1407" roughness={0.2} />
        </Cylinder>
      </group>
      {/* Notepad */}
      <RoundedBox args={[0.28, 0.008, 0.20]} radius={0.004} smoothness={1}
        position={[-0.82, 1.015, -0.02]} rotation={[0, 0.12, 0]}>
        <meshStandardMaterial color="#F0EBE0" roughness={0.95} />
      </RoundedBox>
      {/* Notepad lines */}
      {[0, 0.038, 0.076, 0.114].map((dz, i) => (
        <RoundedBox key={i} args={[0.22, 0.003, 0.004]} radius={0.001} smoothness={1}
          position={[-0.82, 1.022, -0.05 + dz]} rotation={[0, 0.12, 0]}>
          <meshStandardMaterial color="#C8C0B0" roughness={0.95} />
        </RoundedBox>
      ))}

      {/* Pen on notepad */}
      <Cylinder args={[0.006, 0.005, 0.24, 6]} position={[-0.72, 1.022, 0.05]} rotation={[0, -0.5, Math.PI / 2]}>
        <meshStandardMaterial color="#1A2A8F" roughness={0.4} metalness={0.3} />
      </Cylinder>
      <Cylinder args={[0.006, 0.001, 0.018, 6]} position={[-0.61, 1.022, 0.05]} rotation={[0, -0.5, Math.PI / 2]}>
        <meshStandardMaterial color="#888" roughness={0.3} metalness={0.5} />
      </Cylinder>

      {/* Small succulent plant — left back corner */}
      <group position={[-0.98, 1.04, -0.42]}>
        {/* Terracotta pot */}
        <Cylinder args={[0.052, 0.044, 0.10, 12]} castShadow>
          <meshStandardMaterial color="#A0522D" roughness={0.75} />
        </Cylinder>
        {/* Pot rim */}
        <Cylinder args={[0.056, 0.056, 0.012, 12]} position={[0, 0.056, 0]}>
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </Cylinder>
        {/* Soil */}
        <Cylinder args={[0.044, 0.044, 0.006, 10]} position={[0, 0.052, 0]}>
          <meshStandardMaterial color="#2A1808" roughness={1.0} />
        </Cylinder>
        {/* Succulent leaves */}
        {[0, 1.05, 2.09, 3.14, 4.19, 5.24].map((a, i) => (
          <RoundedBox key={i} args={[0.038, 0.095, 0.022]} radius={0.012} smoothness={2}
            position={[Math.sin(a) * 0.036, 0.10 + (i % 2) * 0.018, Math.cos(a) * 0.036]}
            rotation={[Math.PI * 0.22, a, Math.PI * 0.05]}>
            <meshStandardMaterial color={i % 2 === 0 ? '#2E7D32' : '#388E3C'} roughness={0.65} />
          </RoundedBox>
        ))}
        {/* Centre bud */}
        <Sphere args={[0.026, 8, 6]} position={[0, 0.128, 0]}>
          <meshStandardMaterial color="#4CAF50" roughness={0.6} />
        </Sphere>
      </group>

      {/* Small stack of books — right back corner */}
      <group position={[0.94, 1.025, -0.44]} rotation={[0, -0.15, 0]}>
        {[
          { h: 0.032, color: '#1565C0', w: 0.16, d: 0.12 },
          { h: 0.028, color: '#B71C1C', w: 0.14, d: 0.11 },
          { h: 0.026, color: '#1B5E20', w: 0.13, d: 0.105 },
        ].map((book, i) => {
          const y = [0.016, 0.048, 0.075][i]
          return (
            <group key={i} position={[0, y, 0]}>
              <RoundedBox args={[book.w, book.h, book.d]} radius={0.004} smoothness={1} castShadow>
                <meshStandardMaterial color={book.color} roughness={0.8} />
              </RoundedBox>
              {/* Page edges */}
              <RoundedBox args={[book.w - 0.018, book.h - 0.006, 0.003]} radius={0.001} smoothness={1}
                position={[0, 0, book.d / 2 - 0.001]}>
                <meshStandardMaterial color="#EEE8DC" roughness={0.95} />
              </RoundedBox>
            </group>
          )
        })}
      </group>

      {/* Phone face-down on desk — right of mouse */}
      <group position={[0.75, 1.026, 0.36]} rotation={[0, 0.2, 0]}>
        <RoundedBox args={[0.072, 0.014, 0.145]} radius={0.012} smoothness={2} castShadow>
          <meshStandardMaterial color="#0A0E18" roughness={0.3} metalness={0.6} />
        </RoundedBox>
        {/* Camera bump */}
        <RoundedBox args={[0.024, 0.005, 0.024]} radius={0.006} smoothness={2}
          position={[0.018, 0.009, 0.048]}>
          <meshStandardMaterial color="#1A1E28" roughness={0.2} metalness={0.8} />
        </RoundedBox>
        <Cylinder args={[0.006, 0.006, 0.006, 8]} position={[0.018, 0.013, 0.048]}>
          <meshStandardMaterial color="#222" roughness={0.1} metalness={0.9} />
        </Cylinder>
      </group>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Monitor + code screen
// ---------------------------------------------------------------------------
const CODE_LINES = [
  { color: '#61AFEF', w: 0.55, indent: 0.00 },   // blue - keyword
  { color: '#98C379', w: 0.72, indent: 0.06 },   // green - string
  { color: '#E5C07B', w: 0.45, indent: 0.06 },   // yellow - function
  { color: '#56B6C2', w: 0.30, indent: 0.12 },   // cyan - type
  { color: '#C678DD', w: 0.60, indent: 0.12 },   // purple - variable
  { color: '#98C379', w: 0.82, indent: 0.06 },   // green - value
  { color: '#ABB2BF', w: 0.38, indent: 0.00 },   // grey - punctuation
  { color: '#E06C75', w: 0.50, indent: 0.06 },   // red - tag
  { color: '#E5C07B', w: 0.65, indent: 0.12 },   // yellow - prop
  { color: '#98C379', w: 0.42, indent: 0.18 },   // green - value
  { color: '#61AFEF', w: 0.30, indent: 0.06 },   // blue
  { color: '#ABB2BF', w: 0.55, indent: 0.00 },   // grey
]

function Monitor({ screenRef, codeOpacity }: {
  screenRef: React.MutableRefObject<THREE.Mesh | null>
  codeOpacity: React.MutableRefObject<number>
}) {
  const lineRefs = useRef<THREE.Mesh[]>([])

  useFrame(() => {
    lineRefs.current.forEach(mesh => {
      if (mesh) (mesh.material as THREE.MeshStandardMaterial).opacity = codeOpacity.current
    })
  })

  return (
    <group position={[0, 1.66, -0.30]}>
      {/* Outer bezel */}
      <RoundedBox args={[1.32, 0.94, 0.058]} radius={0.022} smoothness={2} castShadow>
        <meshStandardMaterial color="#141E30" roughness={0.4} metalness={0.3} />
      </RoundedBox>
      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0.01, 0.034]}>
        <planeGeometry args={[1.18, 0.80]} />
        <meshStandardMaterial color="#050A18" emissive="#050A18" emissiveIntensity={0.6} roughness={0.05} />
      </mesh>
      {/* Code lines on screen */}
      {CODE_LINES.map((line, i) => (
        <mesh
          key={i}
          ref={el => { if (el) lineRefs.current[i] = el }}
          position={[
            -0.55 + line.indent * 1.1 + (line.w * 1.1) / 2,
            0.29 - i * 0.052,
            0.036
          ]}
        >
          <planeGeometry args={[line.w * 1.1, 0.022]} />
          <meshStandardMaterial color={line.color} emissive={line.color} emissiveIntensity={0.7}
            transparent opacity={0} roughness={0.1} />
        </mesh>
      ))}
      {/* Thin chrome border */}
      <RoundedBox args={[1.22, 0.84, 0.006]} radius={0.01} smoothness={2} position={[0, 0.01, 0.033]}>
        <meshStandardMaterial color="#1E3050" roughness={0.3} metalness={0.4} />
      </RoundedBox>
      {/* Stand neck */}
      <Cylinder args={[0.024, 0.03, 0.24, 8]} position={[0, -0.58, 0]} castShadow>
        <meshStandardMaterial color="#243048" roughness={0.4} metalness={0.3} />
      </Cylinder>
      {/* Stand base */}
      <RoundedBox args={[0.4, 0.034, 0.28]} radius={0.01} smoothness={2} position={[0, -0.70, 0.07]} castShadow>
        <meshStandardMaterial color="#1A2638" roughness={0.4} metalness={0.2} />
      </RoundedBox>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Chair
// ---------------------------------------------------------------------------
function Chair() {
  return (
    <group position={[0, 0, 0.92]}>
      <RoundedBox args={[0.76, 0.065, 0.72]} radius={0.025} smoothness={2}
        position={[0, 1.04, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#0E1420" roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.74, 0.86, 0.068]} radius={0.025} smoothness={2}
        position={[0, 1.51, 0.34]} castShadow>
        <meshStandardMaterial color="#0E1420" roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.60, 0.13, 0.04]} radius={0.02} smoothness={2}
        position={[0, 1.32, 0.38]}>
        <meshStandardMaterial color="#080E18" roughness={0.9} />
      </RoundedBox>
      {/* Armrests */}
      {([-0.41, 0.41] as number[]).map((x, i) => (
        <group key={i} position={[x, 1.22, 0.06]}>
          <RoundedBox args={[0.07, 0.3, 0.07]} radius={0.02} smoothness={2}>
            <meshStandardMaterial color="#0A1018" roughness={0.8} />
          </RoundedBox>
          <RoundedBox args={[0.08, 0.024, 0.24]} radius={0.01} smoothness={2} position={[0, 0.162, 0.09]}>
            <meshStandardMaterial color="#0A1018" roughness={0.6} />
          </RoundedBox>
        </group>
      ))}
      {/* 5-star base */}
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <RoundedBox key={i} args={[0.38, 0.038, 0.052]} radius={0.01} smoothness={2}
            position={[Math.cos(a) * 0.22, 0.04, Math.sin(a) * 0.22]}
            rotation={[0, -a, 0]}>
            <meshStandardMaterial color="#12192A" roughness={0.7} metalness={0.2} />
          </RoundedBox>
        )
      })}
      <Cylinder args={[0.024, 0.034, 0.9, 8]} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#1A2436" roughness={0.4} metalness={0.3} />
      </Cylinder>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <Sphere key={i} args={[0.038, 8, 6]} position={[Math.cos(a) * 0.35, 0.04, Math.sin(a) * 0.35]}>
            <meshStandardMaterial color="#090D16" roughness={0.5} metalness={0.2} />
          </Sphere>
        )
      })}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Developer – faces monitor (–Z), stands up and turns to camera at the end
// ---------------------------------------------------------------------------
function Developer({
  rootRef, torsoRef, headGroupRef, lArmRef, rArmRef, lLegRef, rLegRef,
}: {
  rootRef:       React.MutableRefObject<THREE.Group | null>
  torsoRef:      React.MutableRefObject<THREE.Group | null>
  headGroupRef:  React.MutableRefObject<THREE.Group | null>
  lArmRef:       React.MutableRefObject<THREE.Group | null>
  rArmRef:       React.MutableRefObject<THREE.Group | null>
  lLegRef:       React.MutableRefObject<THREE.Group | null>
  rLegRef:       React.MutableRefObject<THREE.Group | null>
}) {
  return (
    /* Root — starts facing AWAY from camera (toward monitor at –Z).
       At stage 4, rootRef.rotation.y animates from π → 0 to face camera. */
    <group ref={rootRef} position={[0, 0, 0.36]} rotation={[0, Math.PI, 0]}>
      <group ref={torsoRef} position={[0, 1.62, 0]}>

        {/* ── Torso / shirt ──────────────────────────────────────────── */}
        <RoundedBox args={[0.52, 0.62, 0.28]} radius={0.06} smoothness={2} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial color="#2A5080" roughness={0.78} />
        </RoundedBox>
        {/* Shoulder width */}
        <RoundedBox args={[0.62, 0.12, 0.26]} radius={0.05} smoothness={2} position={[0, 0.22, 0]} castShadow>
          <meshStandardMaterial color="#2A5080" roughness={0.78} />
        </RoundedBox>

        {/* ── Neck ───────────────────────────────────────────────────── */}
        <Cylinder args={[0.062, 0.072, 0.14, 10]} position={[0, 0.38, 0.02]} castShadow>
          <meshStandardMaterial color="#EDAA90" roughness={0.55} />
        </Cylinder>

        {/* ── Head ───────────────────────────────────────────────────── */}
        <group ref={headGroupRef} position={[0, 0.55, 0.02]}>
          {/* Face / head sphere */}
          <Sphere args={[0.192, 16, 12]} position={[0, 0.19, 0]} castShadow>
            <meshStandardMaterial color="#EDAA90" roughness={0.55} />
          </Sphere>
          {/* Jaw strengthener */}
          <RoundedBox args={[0.30, 0.09, 0.27]} radius={0.04} smoothness={2} position={[0, 0.07, 0]}>
            <meshStandardMaterial color="#EDAA90" roughness={0.55} />
          </RoundedBox>
          {/* Hair — cap */}
          <Sphere args={[0.205, 14, 10]} position={[0, 0.24, -0.01]} castShadow>
            <meshStandardMaterial color="#4A2810" roughness={0.88} side={THREE.FrontSide} />
          </Sphere>
          {/* Hair side-part ridge */}
          <RoundedBox args={[0.08, 0.08, 0.18]} radius={0.03} smoothness={2} position={[0.14, 0.32, 0.12]} rotation={[0, -0.3, 0.2]}>
            <meshStandardMaterial color="#4A2810" roughness={0.88} />
          </RoundedBox>
          {/* Hair fringe left */}
          <RoundedBox args={[0.14, 0.07, 0.14]} radius={0.03} smoothness={2} position={[-0.08, 0.34, 0.13]} rotation={[0.1, 0.1, -0.1]}>
            <meshStandardMaterial color="#4A2810" roughness={0.88} />
          </RoundedBox>
          {/* Hair back volume */}
          <RoundedBox args={[0.3, 0.1, 0.10]} radius={0.04} smoothness={2} position={[0, 0.28, -0.18]}>
            <meshStandardMaterial color="#4A2810" roughness={0.88} />
          </RoundedBox>
          {/* Ears */}
          <Sphere args={[0.038, 8, 6]} position={[-0.192, 0.19, 0]}>
            <meshStandardMaterial color="#E09A7C" roughness={0.6} />
          </Sphere>
          <Sphere args={[0.038, 8, 6]} position={[0.192, 0.19, 0]}>
            <meshStandardMaterial color="#E09A7C" roughness={0.6} />
          </Sphere>
          {/* Eye whites */}
          <Sphere args={[0.038, 8, 6]} position={[-0.07, 0.21, 0.17]}>
            <meshStandardMaterial color="#EEE8E0" roughness={0.3} />
          </Sphere>
          <Sphere args={[0.038, 8, 6]} position={[0.07, 0.21, 0.17]}>
            <meshStandardMaterial color="#EEE8E0" roughness={0.3} />
          </Sphere>
          {/* Irises */}
          <Sphere args={[0.024, 7, 6]} position={[-0.07, 0.21, 0.182]}>
            <meshStandardMaterial color="#3D2200" roughness={0.2} />
          </Sphere>
          <Sphere args={[0.024, 7, 6]} position={[0.07, 0.21, 0.182]}>
            <meshStandardMaterial color="#3D2200" roughness={0.2} />
          </Sphere>
          {/* Nose */}
          <RoundedBox args={[0.038, 0.048, 0.062]} radius={0.018} smoothness={2} position={[0, 0.15, 0.196]}>
            <meshStandardMaterial color="#E09A7C" roughness={0.6} />
          </RoundedBox>
        </group>

        {/* ── Left arm (pivot at shoulder) — char faces –Z so local +X = world –X ── */}
        <group ref={lArmRef} position={[-0.32, 0.26, 0]}>
          <RoundedBox args={[0.146, 0.44, 0.146]} radius={0.05} smoothness={2} position={[0, -0.22, 0]} castShadow>
            <meshStandardMaterial color="#2A5080" roughness={0.78} />
          </RoundedBox>
          <Sphere args={[0.068, 8, 6]} position={[0, -0.44, 0]}>
            <meshStandardMaterial color="#EDAA90" roughness={0.55} />
          </Sphere>
          <RoundedBox args={[0.125, 0.38, 0.125]} radius={0.042} smoothness={2} position={[0, -0.64, 0]} castShadow>
            <meshStandardMaterial color="#EDAA90" roughness={0.55} />
          </RoundedBox>
          {/* Hand */}
          <RoundedBox args={[0.12, 0.095, 0.072]} radius={0.028} smoothness={2} position={[0, -0.875, 0.012]}>
            <meshStandardMaterial color="#EDAA90" roughness={0.55} />
          </RoundedBox>
        </group>

        {/* ── Right arm ──────────────────────────────────────────────── */}
        <group ref={rArmRef} position={[0.32, 0.26, 0]}>
          <RoundedBox args={[0.146, 0.44, 0.146]} radius={0.05} smoothness={2} position={[0, -0.22, 0]} castShadow>
            <meshStandardMaterial color="#2A5080" roughness={0.78} />
          </RoundedBox>
          <Sphere args={[0.068, 8, 6]} position={[0, -0.44, 0]}>
            <meshStandardMaterial color="#EDAA90" roughness={0.55} />
          </Sphere>
          <RoundedBox args={[0.125, 0.38, 0.125]} radius={0.042} smoothness={2} position={[0, -0.64, 0]} castShadow>
            <meshStandardMaterial color="#EDAA90" roughness={0.55} />
          </RoundedBox>
          <RoundedBox args={[0.12, 0.095, 0.072]} radius={0.028} smoothness={2} position={[0, -0.875, 0.012]}>
            <meshStandardMaterial color="#EDAA90" roughness={0.55} />
          </RoundedBox>
        </group>

        {/* ── Left leg ───────────────────────────────────────────────── */}
        <group ref={lLegRef} position={[-0.145, -0.42, 0]}>
          <RoundedBox args={[0.16, 0.50, 0.16]} radius={0.048} smoothness={2} position={[0, -0.26, 0]} castShadow>
            <meshStandardMaterial color="#1A2A44" roughness={0.85} />
          </RoundedBox>
          <Sphere args={[0.078, 8, 6]} position={[0, -0.52, 0]}>
            <meshStandardMaterial color="#1A2A44" roughness={0.85} />
          </Sphere>
          <RoundedBox args={[0.145, 0.44, 0.145]} radius={0.044} smoothness={2} position={[0, -0.75, 0]} castShadow>
            <meshStandardMaterial color="#1A2A44" roughness={0.85} />
          </RoundedBox>
          <RoundedBox args={[0.15, 0.082, 0.29]} radius={0.024} smoothness={2} position={[0, -1.0, -0.06]} castShadow>
            <meshStandardMaterial color="#181828" roughness={0.9} />
          </RoundedBox>
        </group>

        {/* ── Right leg ──────────────────────────────────────────────── */}
        <group ref={rLegRef} position={[0.145, -0.42, 0]}>
          <RoundedBox args={[0.16, 0.50, 0.16]} radius={0.048} smoothness={2} position={[0, -0.26, 0]} castShadow>
            <meshStandardMaterial color="#1A2A44" roughness={0.85} />
          </RoundedBox>
          <Sphere args={[0.078, 8, 6]} position={[0, -0.52, 0]}>
            <meshStandardMaterial color="#1A2A44" roughness={0.85} />
          </Sphere>
          <RoundedBox args={[0.145, 0.44, 0.145]} radius={0.044} smoothness={2} position={[0, -0.75, 0]} castShadow>
            <meshStandardMaterial color="#1A2A44" roughness={0.85} />
          </RoundedBox>
          <RoundedBox args={[0.15, 0.082, 0.29]} radius={0.024} smoothness={2} position={[0, -1.0, -0.06]} castShadow>
            <meshStandardMaterial color="#181828" roughness={0.9} />
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
      pos: [(Math.random() - 0.5) * 7, 0.6 + Math.random() * 3.5, (Math.random() - 0.5) * 3.5] as [number, number, number],
      speed: 0.16 + Math.random() * 0.24,
      phase: Math.random() * Math.PI * 2,
      scale: 0.055 + Math.random() * 0.04,
    })), [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = scrollState.progress
    const target = (t > 0.44 && t < 0.88) ? 0.55 : 0
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh
      mesh.position.y = particles[i].pos[1] + Math.sin(clock.elapsedTime * particles[i].speed + particles[i].phase) * 0.3
      mesh.rotation.y = clock.elapsedTime * 0.55 + particles[i].phase
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.opacity += (target - mat.opacity) * 0.1
    })
  })

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos} scale={p.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#F97316" emissive="#F97316" emissiveIntensity={0.8}
            transparent opacity={0} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Ground
// ---------------------------------------------------------------------------
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[22, 22]} />
      <meshStandardMaterial color="#050810" roughness={0.95} />
    </mesh>
  )
}

// ---------------------------------------------------------------------------
// Screen colors per stage
// ---------------------------------------------------------------------------
const SCREEN_COLORS = [
  new THREE.Color('#040810'),  // off
  new THREE.Color('#061A10'),  // booting (dark green)
  new THREE.Color('#0A2A18'),  // coding (green tint)
  new THREE.Color('#1C0A04'),  // building (dark orange)
  new THREE.Color('#FFFFFF'),  // live
]

// ---------------------------------------------------------------------------
// Main scene
// ---------------------------------------------------------------------------
function Scene() {
  const rootRef        = useRef<THREE.Group>(null)
  const torsoRef       = useRef<THREE.Group>(null)
  const headGroupRef   = useRef<THREE.Group>(null)
  const lArmRef        = useRef<THREE.Group>(null)
  const rArmRef        = useRef<THREE.Group>(null)
  const lLegRef        = useRef<THREE.Group>(null)
  const rLegRef        = useRef<THREE.Group>(null)
  const screenRef      = useRef<THREE.Mesh>(null)
  const monitorGlowRef = useRef<THREE.PointLight>(null)
  const faceGlowRef    = useRef<THREE.PointLight>(null)
  const codeOpacity    = useRef(0)

  const targetColor  = useRef(new THREE.Color('#040810'))
  const currentColor = useRef(new THREE.Color('#040810'))

  useFrame(({ camera, clock }, delta) => {
    const t = scrollState.progress
    const dt = Math.min(delta, 0.05)

    // ── Camera orbit 270° ─────────────────────────────────────────────────
    const angle  = 0.55 + t * Math.PI * 1.5
    const radius = 6.2
    const camH   = lerp(3.5, 2.2, t)
    camera.position.set(Math.sin(angle) * radius, camH, Math.cos(angle) * radius)
    camera.lookAt(0, 1.55, 0)

    // ── Sit / stand phases ────────────────────────────────────────────────
    const sitT   = clamp01((t - 0.20) / 0.25)
    const standT = clamp01((t - 0.88) / 0.12)
    // Sub-phases of standing up: push off armrests → lean forward → rise
    const pushT  = clamp01((t - 0.88) / 0.05)   // arms push back on armrests
    const leanT  = clamp01((t - 0.89) / 0.05)   // torso leans forward
    const riseT  = clamp01((t - 0.91) / 0.09)   // body fully rises
    const sitAmt = sitT * (1 - standT)

    // Torso Y: standing=1.62, seated=1.20
    // Dips slightly before rising (push-up prep), then rises
    const torsoBase    = lerp(1.62, 1.20, sitAmt)
    const standupDip   = lerp(0, -0.05, leanT) * (1 - riseT)  // lean dip before rise
    const torsoTargetY = torsoBase + standupDip
    // Torso forward lean when sitting (leaning in) and when pushing up to stand
    const sittingLeanX  = Math.sin(sitT * Math.PI) * 0.06 * (sitT < 1 ? 1 : 0)
    const standupLeanX  = lerp(0, 0.14, leanT) * (1 - riseT)
    const torsoTargetRX = sittingLeanX + standupLeanX
    if (torsoRef.current) {
      torsoRef.current.position.y += (torsoTargetY - torsoRef.current.position.y) * Math.min(1, dt * 5)
      torsoRef.current.rotation.x += (torsoTargetRX - torsoRef.current.rotation.x) * Math.min(1, dt * 4)
    }

    // Head: look DOWN at monitor when seated (eyes are above screen level),
    //       slight chin-up when standing and facing camera
    if (headGroupRef.current) {
      const breathe     = Math.sin(clock.elapsedTime * 1.1) * 0.007
      // Positive rotation.x = chin forward = looking DOWN (correct for monitor below eye-level)
      const nodAtScreen = lerp(0, 0.30, sitAmt)
      const chinUp      = lerp(0, -0.06, standT)  // slight chin-up after standing
      // Subtle reading sway side-to-side when actively typing
      const typingFrac  = clamp01((t - 0.45) / 0.20) * (1 - standT) * sitAmt
      const readSway    = Math.sin(clock.elapsedTime * 0.38) * 0.045 * typingFrac
      headGroupRef.current.rotation.x = nodAtScreen + chinUp + breathe
      headGroupRef.current.rotation.y = readSway
      headGroupRef.current.position.y = lerp(0.55, 0.51, sitAmt) + breathe * 0.4
    }

    // ── Arms: typing → push-off armrests → natural hang at sides ─────────
    const typingT      = clamp01((t - 0.45) / 0.20) * (1 - standT)
    const armFwdRot    = lerp(0, 0.90, typingT * sitAmt)
    // Push phase: arms go slightly backward (negative = elbows back) then release
    const armPushRot   = lerp(0, -0.28, pushT) * (1 - riseT)
    // Natural idle sway when standing
    const idleSway     = Math.sin(clock.elapsedTime * 0.7) * 0.04 * (1 - sitAmt)
    // Slight swing forward as they stand (walking-start posture)
    const standSwingL  = lerp(0, 0.10, riseT) * lerp(1, 0, clamp01((t - 0.96) / 0.04))
    const standSwingR  = lerp(0, -0.08, riseT) * lerp(1, 0, clamp01((t - 0.96) / 0.04))

    if (lArmRef.current) {
      const target = armFwdRot + armPushRot + idleSway + standSwingL
      lArmRef.current.rotation.x += (target - lArmRef.current.rotation.x) * Math.min(1, dt * 6)
    }
    if (rArmRef.current) {
      const target = armFwdRot + armPushRot - idleSway + standSwingR
      rArmRef.current.rotation.x += (target - rArmRef.current.rotation.x) * Math.min(1, dt * 6)
    }

    // ── Legs: thighs horizontal when seated, snap straight when standing ──
    const legRotX = lerp(0, Math.PI / 2.1, sitAmt)
    const legFwdZ = lerp(0, 0.40, sitAmt)

    if (lLegRef.current) {
      lLegRef.current.rotation.x += (legRotX - lLegRef.current.rotation.x) * Math.min(1, dt * 5.5)
      lLegRef.current.position.z += (legFwdZ - lLegRef.current.position.z) * Math.min(1, dt * 5.5)
    }
    if (rLegRef.current) {
      rLegRef.current.rotation.x += (legRotX - rLegRef.current.rotation.x) * Math.min(1, dt * 5.5)
      rLegRef.current.position.z += (legFwdZ - rLegRef.current.position.z) * Math.min(1, dt * 5.5)
    }

    // ── Stand up + step back + turn to face camera at stage 4 ────────────
    if (rootRef.current) {
      // Step back from desk — first a small shift during lean, then full step back
      const stepBackZ = lerp(0.36, 0.88, standT)
      rootRef.current.position.z += (stepBackZ - rootRef.current.position.z) * Math.min(1, dt * 3.5)

      // Rotate from π (facing monitor) → 0 (facing camera), delayed until mostly risen
      const faceCamT = clamp01((t - 0.94) / 0.06)
      const targetRotY = lerp(Math.PI, 0, faceCamT)
      rootRef.current.rotation.y += (targetRotY - rootRef.current.rotation.y) * Math.min(1, dt * 5)
    }

    // ── Monitor screen color ──────────────────────────────────────────────
    if (t < 0.30)      targetColor.current.copy(SCREEN_COLORS[0])
    else if (t < 0.52) targetColor.current.copy(SCREEN_COLORS[1])
    else if (t < 0.72) targetColor.current.copy(SCREEN_COLORS[2])
    else if (t < 0.88) targetColor.current.copy(SCREEN_COLORS[3])
    else               targetColor.current.copy(SCREEN_COLORS[4])

    currentColor.current.lerp(targetColor.current, Math.min(1, dt * 2.5))

    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial
      mat.color.copy(currentColor.current)
      mat.emissive.copy(currentColor.current)
      const isLive = t >= 0.88
      mat.emissiveIntensity = isLive
        ? 0.95 + Math.sin(clock.elapsedTime * 1.5) * 0.04
        : t > 0.50 ? 0.45 + Math.sin(clock.elapsedTime * 2.2) * 0.08 : 0.35
    }

    // ── Dynamic monitor glow — changes color with screen ─────────────────
    if (monitorGlowRef.current) {
      monitorGlowRef.current.color.copy(currentColor.current)
      monitorGlowRef.current.intensity = t > 0.30 ? lerp(1.0, 3.2, clamp01((t - 0.30) / 0.30)) : 0.6
    }

    // ── Face glow — illuminate character's face with screen color ─────────
    if (faceGlowRef.current && torsoRef.current) {
      const faceIntensity = sitAmt * lerp(0, 1.8, clamp01((t - 0.44) / 0.20))
      faceGlowRef.current.intensity = faceIntensity
      // Screen is blue when coding, orange when building, white when live
      if (t < 0.52)      faceGlowRef.current.color.setHex(0x1A4488)
      else if (t < 0.72) faceGlowRef.current.color.setHex(0x2A6030)
      else if (t < 0.88) faceGlowRef.current.color.setHex(0x8B3500)
      else               faceGlowRef.current.color.setHex(0xDDEEFF)
    }

    // ── Code line opacity on screen ───────────────────────────────────────
    const codeTarget = (t > 0.50 && t < 0.88) ? 1 : 0
    codeOpacity.current += (codeTarget - codeOpacity.current) * Math.min(1, dt * 3)
  })

  return (
    <>
      {/* Key light — warm from upper right */}
      <directionalLight
        position={[5, 9, 4]} intensity={3.8} castShadow color="#FFF8F0"
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-near={0.5} shadow-camera-far={30}
        shadow-camera-left={-6} shadow-camera-right={6}
        shadow-camera-top={6} shadow-camera-bottom={-2}
      />
      {/* Fill — cool blue left */}
      <directionalLight position={[-6, 4, 2]} intensity={1.6} color="#B0CCFF" />
      {/* Rim — orange from behind character */}
      <directionalLight position={[0, 3, -6]} intensity={1.4} color="#FF8840" />
      {/* Ambient */}
      <ambientLight intensity={0.9} color="#8AACCC" />
      {/* Monitor glow — color-matched to screen, driven in useFrame */}
      <pointLight ref={monitorGlowRef} position={[0, 1.7, -0.05]} intensity={1.0} color="#061A10" distance={4.0} decay={2} />
      {/* Face glow — illuminates character face with screen color when seated */}
      <pointLight ref={faceGlowRef} position={[0, 1.8, 0.10]} intensity={0} color="#1A4488" distance={2.0} decay={2} />
      {/* Desk warm fill */}
      <pointLight position={[0, 1.5, 0.5]} intensity={0.9} color="#FFE4A0" distance={3} decay={2} />

      <Ground />
      <Desk />
      <Chair />
      <Monitor screenRef={screenRef} codeOpacity={codeOpacity} />
      <Developer
        rootRef={rootRef} torsoRef={torsoRef} headGroupRef={headGroupRef}
        lArmRef={lArmRef} rArmRef={rArmRef} lLegRef={lLegRef} rLegRef={rLegRef}
      />
      <CodeParticles />
    </>
  )
}

// ---------------------------------------------------------------------------
// Narrative stages
// ---------------------------------------------------------------------------
const STAGES = [
  { range: [0, 0.22] as [number,number],    tag: 'THE PROBLEM', title: 'Your business is\ninvisible online.',   sub: "87% of customers search before calling. If they can't find you, they find your competitor." },
  { range: [0.22, 0.44] as [number,number], tag: 'DAY 0',       title: 'Neil gets to\nwork.',                  sub: 'Discovery call booked. Brief taken. Build starts within 24 hours.' },
  { range: [0.44, 0.66] as [number,number], tag: 'DAY 1–2',     title: 'Claude writes\nthe code.',             sub: 'React, Tailwind, mobile-first. Built faster than you can write a brief.' },
  { range: [0.66, 0.88] as [number,number], tag: 'DAY 3–4',     title: 'Your site\ntakes shape.',              sub: 'Preview link shared. One revision round. Zero surprises.' },
  { range: [0.88, 1.01] as [number,number], tag: 'DAY 5',       title: '$650. 5 days.\nYours forever.',        sub: 'Domain live. GitHub repo handed over. You own every line of code.' },
]

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

        <div className="absolute inset-0">
          <Canvas shadows
            camera={{ position: [5.5, 3.8, 5.5], fov: 42, near: 0.1, far: 60 }}
            gl={{ antialias: true, alpha: false }}
          >
            <Scene />
          </Canvas>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/75 via-navy-900/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/55 via-transparent to-transparent pointer-events-none" />

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

        <motion.div className="absolute top-8 right-6 font-mono text-xs text-orange-500/40 hidden lg:block"
          style={{ opacity: percentOpacity }}>
          <motion.span>{percentDisplay}</motion.span>
        </motion.div>

      </div>
    </section>
  )
}
