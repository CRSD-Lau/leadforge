'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Sphere, Cylinder } from '@react-three/drei'
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion'
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
        <meshStandardMaterial color="#1A2438" roughness={0.45} metalness={0.08} />
      </RoundedBox>
      {/* Legs */}
      {([ [-1.2, 0.49, -0.56], [1.2, 0.49, -0.56], [-1.2, 0.49, 0.56], [1.2, 0.49, 0.56] ] as [number,number,number][]).map((pos, i) => (
        <RoundedBox key={i} args={[0.055, 0.97, 0.055]} radius={0.015} smoothness={2}
          position={pos} castShadow>
          <meshStandardMaterial color="#0E1624" roughness={0.85} metalness={0.12} />
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
      {/* Coffee mug — bright amber-yellow matching reference image */}
      <group position={[0.9, 1.04, -0.1]}>
        <Cylinder args={[0.055, 0.048, 0.13, 14]} castShadow>
          <meshStandardMaterial color="#D4920A" roughness={0.40} metalness={0.08} />
        </Cylinder>
        {/* Mug handle */}
        <mesh position={[0.072, -0.01, 0]}>
          <torusGeometry args={[0.038, 0.011, 6, 10, Math.PI]} />
          <meshStandardMaterial color="#D4920A" roughness={0.40} />
        </mesh>
        {/* Coffee liquid */}
        <Cylinder args={[0.044, 0.044, 0.004, 12]} position={[0, 0.067, 0]}>
          <meshStandardMaterial color="#1A0A02" roughness={0.1} />
        </Cylinder>
        {/* Steam wisps — thin cylinders */}
        <Cylinder args={[0.003, 0.001, 0.06, 4]} position={[-0.012, 0.105, 0]} rotation={[0, 0, 0.15]}>
          <meshStandardMaterial color="#CCCCCC" roughness={1.0} transparent opacity={0.18} />
        </Cylinder>
        <Cylinder args={[0.003, 0.001, 0.05, 4]} position={[0.012, 0.10, 0]} rotation={[0, 0, -0.1]}>
          <meshStandardMaterial color="#CCCCCC" roughness={1.0} transparent opacity={0.14} />
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

      {/* Desk lamp — back left corner */}
      <group position={[-0.72, 1.025, -0.42]}>
        {/* Base */}
        <Cylinder args={[0.04, 0.05, 0.018, 10]}>
          <meshStandardMaterial color="#1A2438" roughness={0.5} metalness={0.4} />
        </Cylinder>
        {/* Arm vertical */}
        <Cylinder args={[0.008, 0.008, 0.32, 6]} position={[0, 0.17, 0]}>
          <meshStandardMaterial color="#263050" roughness={0.4} metalness={0.5} />
        </Cylinder>
        {/* Arm horizontal */}
        <Cylinder args={[0.007, 0.007, 0.22, 6]} position={[0.10, 0.34, 0]} rotation={[0, 0, Math.PI / 2.4]}>
          <meshStandardMaterial color="#263050" roughness={0.4} metalness={0.5} />
        </Cylinder>
        {/* Shade */}
        <mesh position={[0.20, 0.36, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.055, 0.07, 10, 1, true]} />
          <meshStandardMaterial color="#1A2438" roughness={0.5} metalness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* Bulb glow */}
        <mesh position={[0.20, 0.34, 0]}>
          <sphereGeometry args={[0.014, 6, 4]} />
          <meshStandardMaterial color="#FFF4CC" emissive="#FFF4CC" emissiveIntensity={3.0} />
        </mesh>
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
      {/* Outer bezel — widescreen 16:9 */}
      <RoundedBox args={[1.62, 0.98, 0.058]} radius={0.022} smoothness={2} castShadow>
        <meshStandardMaterial color="#0E1828" roughness={0.4} metalness={0.4} />
      </RoundedBox>
      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0.01, 0.034]}>
        <planeGeometry args={[1.48, 0.84]} />
        <meshStandardMaterial color="#050A18" emissive="#050A18" emissiveIntensity={1.2} roughness={0.05} />
      </mesh>
      {/* Code lines on screen */}
      {CODE_LINES.map((line, i) => (
        <mesh
          key={i}
          ref={el => { if (el) lineRefs.current[i] = el }}
          position={[
            -0.68 + line.indent * 1.1 + (line.w * 1.1) / 2,
            0.30 - i * 0.054,
            0.036
          ]}
        >
          <planeGeometry args={[line.w * 1.1, 0.023]} />
          <meshStandardMaterial color={line.color} emissive={line.color} emissiveIntensity={1.4}
            transparent opacity={0} roughness={0.1} />
        </mesh>
      ))}
      {/* Thin chrome border */}
      <RoundedBox args={[1.52, 0.88, 0.006]} radius={0.01} smoothness={2} position={[0, 0.01, 0.033]}>
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

        {/* ── Neck — shorter so it doesn't dominate the back-angle view ── */}
        <Cylinder args={[0.058, 0.066, 0.09, 10]} position={[0, 0.40, 0.02]} castShadow>
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
          {/* Mouth — subtle smile */}
          <RoundedBox args={[0.072, 0.013, 0.008]} radius={0.005} smoothness={2}
            position={[0, 0.133, 0.196]} rotation={[0.1, 0, 0]}>
            <meshStandardMaterial color="#C06850" roughness={0.7} />
          </RoundedBox>
          {/* Glasses — metal frames */}
          <group position={[0, 0.212, 0.191]}>
            {/* Left lens ring */}
            <mesh position={[-0.072, 0, 0]}>
              <torusGeometry args={[0.040, 0.006, 6, 14]} />
              <meshStandardMaterial color="#1E2030" roughness={0.2} metalness={0.9} />
            </mesh>
            {/* Right lens ring */}
            <mesh position={[0.072, 0, 0]}>
              <torusGeometry args={[0.040, 0.006, 6, 14]} />
              <meshStandardMaterial color="#1E2030" roughness={0.2} metalness={0.9} />
            </mesh>
            {/* Bridge */}
            <RoundedBox args={[0.058, 0.007, 0.005]} radius={0.002} smoothness={1} position={[0, 0, 0]}>
              <meshStandardMaterial color="#1E2030" roughness={0.2} metalness={0.9} />
            </RoundedBox>
            {/* Lens tint left */}
            <mesh position={[-0.072, 0, 0.003]}>
              <circleGeometry args={[0.032, 14]} />
              <meshStandardMaterial color="#4A7AAA" roughness={0.05} transparent opacity={0.12} />
            </mesh>
            {/* Lens tint right */}
            <mesh position={[0.072, 0, 0.003]}>
              <circleGeometry args={[0.032, 14]} />
              <meshStandardMaterial color="#4A7AAA" roughness={0.05} transparent opacity={0.12} />
            </mesh>
          </group>
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
// Floating code particles — subtle, small, spread across background
// ---------------------------------------------------------------------------
function CodeParticles() {
  const groupRef = useRef<THREE.Group>(null)
  // Seed positions deterministically so SSR & client agree
  const particles = useMemo(() => {
    const rng = (seed: number) => {
      const x = Math.sin(seed * 127.1) * 43758.5453
      return x - Math.floor(x)
    }
    return Array.from({ length: 10 }, (_, i) => ({
      pos: [
        (rng(i * 3 + 0) - 0.5) * 4,   // tighter spread, near the desk
        1.2 + rng(i * 3 + 1) * 2.0,   // lower height — don't float above scene
        (rng(i * 3 + 2) - 0.5) * 2.5,
      ] as [number, number, number],
      speed: 0.08 + rng(i + 50) * 0.12,
      phase: rng(i + 20) * Math.PI * 2,
      scale: 0.010 + rng(i + 40) * 0.009,  // smaller — 0.010–0.019
      rotSpeed: (rng(i + 60) - 0.5) * 0.5,
    }))
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = scrollState.progress
    // Only visible during DAY 1-2 coding stage, very subtle max opacity
    const target = (t > 0.44 && t < 0.66) ? 0.18 : 0
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh
      mesh.position.y = particles[i].pos[1] + Math.sin(clock.elapsedTime * particles[i].speed + particles[i].phase) * 0.22
      mesh.rotation.x = clock.elapsedTime * particles[i].rotSpeed
      mesh.rotation.y = clock.elapsedTime * 0.4 + particles[i].phase
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.opacity += (target - mat.opacity) * 0.06
    })
  })

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos} scale={p.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#F97316" emissive="#F97316" emissiveIntensity={1.2}
            transparent opacity={0} roughness={0.1} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Ground + Back wall for light reflection
// ---------------------------------------------------------------------------
function Ground() {
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#020408" roughness={0.98} />
      </mesh>
      {/* Back wall — catches monitor glow, gives cinematic depth */}
      <mesh position={[0, 4, -3.5]} receiveShadow>
        <planeGeometry args={[18, 8]} />
        <meshStandardMaterial color="#060A14" roughness={0.95} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-5.5, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#040810" roughness={0.97} />
      </mesh>
      <mesh position={[5.5, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#040810" roughness={0.97} />
      </mesh>
    </>
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

    // ── Sit / stand phases — declared first; used by camera lookAt below ──
    const sitT   = clamp01((t - 0.20) / 0.25)
    const standT = clamp01((t - 0.88) / 0.12)
    // Sub-phases of standing up: push off armrests → lean forward → rise
    const pushT  = clamp01((t - 0.88) / 0.05)   // arms push back on armrests
    const leanT  = clamp01((t - 0.89) / 0.05)   // torso leans forward
    const riseT  = clamp01((t - 0.91) / 0.09)   // body fully rises
    const sitAmt = sitT * (1 - standT)

    // ── Camera orbit 270° — starts behind-right (back of character + monitor visible) ──
    // angle 0.75 → sin=0.682 (+X right), cos=0.732 (+Z behind character)
    // Orbits counterclockwise so by t=1 camera is left-rear as character turns to face us
    const angle  = 0.75 + t * Math.PI * 1.5
    const radius = lerp(5.2, 4.8, t)
    const camH   = lerp(2.35, 1.92, t)
    camera.position.set(Math.sin(angle) * radius, camH, Math.cos(angle) * radius)
    // Look slightly toward the monitor (–Z) so it stays in frame from the back angle
    const lookY = lerp(1.55, 1.78, standT)
    camera.lookAt(0, lookY, -0.15)

    // Torso Y: standing=1.62, seated=1.20
    // Dips slightly before rising (push-up prep), then rises
    const torsoBase    = lerp(1.62, 1.20, sitAmt)
    const standupDip   = lerp(0, -0.05, leanT) * (1 - riseT)  // lean dip before rise
    // Breathing — chest rises/falls slowly, more pronounced when seated
    const breatheAmt   = sitAmt > 0.5 ? 0.010 : 0.006
    const breatheTorso = Math.sin(clock.elapsedTime * 1.05) * breatheAmt
    const torsoTargetY = torsoBase + standupDip + breatheTorso
    // Torso forward lean when sitting (leaning in) and when pushing up to stand
    const sittingLeanX  = Math.sin(sitT * Math.PI) * 0.06 * (sitT < 1 ? 1 : 0)
    const standupLeanX  = lerp(0, 0.14, leanT) * (1 - riseT)
    // Subtle idle rock side to side (very slow)
    const idleRockZ     = Math.sin(clock.elapsedTime * 0.22) * 0.012 * (1 - sitAmt) * standT
    const torsoTargetRX = sittingLeanX + standupLeanX
    if (torsoRef.current) {
      torsoRef.current.position.y += (torsoTargetY - torsoRef.current.position.y) * Math.min(1, dt * 8)
      torsoRef.current.rotation.x += (torsoTargetRX - torsoRef.current.rotation.x) * Math.min(1, dt * 4)
      torsoRef.current.rotation.z += (idleRockZ - torsoRef.current.rotation.z) * Math.min(1, dt * 2)
    }

    // Head: look DOWN at monitor when seated (eyes are above screen level),
    //       slight chin-up when standing and facing camera
    if (headGroupRef.current) {
      const breathe     = Math.sin(clock.elapsedTime * 1.05) * 0.008
      // Positive rotation.x = chin forward = looking DOWN (correct for monitor below eye-level)
      const nodAtScreen = lerp(0, 0.28, sitAmt)
      const chinUp      = lerp(0, -0.05, standT)  // slight chin-up after standing
      // Subtle reading sway when actively typing
      const typingFrac  = clamp01((t - 0.45) / 0.20) * (1 - standT) * sitAmt
      const readSway    = Math.sin(clock.elapsedTime * 0.38) * 0.04 * typingFrac
      // Confident idle look when standing (slow scan left-right like presenting)
      const standFrac   = clamp01((t - 0.95) / 0.05)
      const idleLook    = Math.sin(clock.elapsedTime * 0.28) * 0.08 * standFrac
      headGroupRef.current.rotation.x = nodAtScreen + chinUp + breathe
      headGroupRef.current.rotation.y = readSway + idleLook
      headGroupRef.current.position.y = lerp(0.55, 0.51, sitAmt) + breathe * 0.5
    }

    // ── Arms: typing → push-off armrests → natural hang at sides ─────────
    const typingT      = clamp01((t - 0.45) / 0.20) * (1 - standT)
    const armFwdRot    = lerp(0, 0.88, typingT * sitAmt)
    // Push phase: arms go slightly backward (negative = elbows back) then release
    const armPushRot   = lerp(0, -0.28, pushT) * (1 - riseT)
    // Natural idle sway when standing
    const idleSway     = Math.sin(clock.elapsedTime * 0.65) * 0.035 * (1 - sitAmt)
    // Slight swing forward as they stand (walking-start posture)
    const standSwingL  = lerp(0, 0.10, riseT) * lerp(1, 0, clamp01((t - 0.96) / 0.04))
    const standSwingR  = lerp(0, -0.08, riseT) * lerp(1, 0, clamp01((t - 0.96) / 0.04))
    // Arms spread slightly out when standing naturally (neutral shoulder position)
    const armSpreadZ   = lerp(0, 0.06, standT)

    if (lArmRef.current) {
      const target = armFwdRot + armPushRot + idleSway + standSwingL
      lArmRef.current.rotation.x += (target - lArmRef.current.rotation.x) * Math.min(1, dt * 6)
      lArmRef.current.rotation.z += (-armSpreadZ - lArmRef.current.rotation.z) * Math.min(1, dt * 4)
    }
    if (rArmRef.current) {
      const target = armFwdRot + armPushRot - idleSway + standSwingR
      rArmRef.current.rotation.x += (target - rArmRef.current.rotation.x) * Math.min(1, dt * 6)
      rArmRef.current.rotation.z += (armSpreadZ - rArmRef.current.rotation.z) * Math.min(1, dt * 4)
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
    // Screen is already "on" (dark blue) from the very start so the glow
    // reads in the opening back-angle shot matching the reference image
    if (t < 0.22)      targetColor.current.copy(SCREEN_COLORS[1])  // dark blue-green from start
    else if (t < 0.50) targetColor.current.copy(SCREEN_COLORS[1])
    else if (t < 0.70) targetColor.current.copy(SCREEN_COLORS[2])
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
      // Glow is always present (screen is on from the start); ramps up during coding stages
      monitorGlowRef.current.intensity = t > 0.30 ? lerp(4.0, 9.0, clamp01((t - 0.30) / 0.30)) : 2.8
    }

    // ── Face glow — illuminate character's face with screen color ─────────
    if (faceGlowRef.current && torsoRef.current) {
      const faceIntensity = sitAmt * lerp(0, 3.5, clamp01((t - 0.44) / 0.20))
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
      {/* Scene background — near-black, darker than previous */}
      <color attach="background" args={['#020305']} />

      {/* Key light — warm from upper right, fairly subtle (screen is hero light) */}
      <directionalLight
        position={[5, 9, 4]} intensity={1.2} castShadow color="#FFF8F0"
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-near={0.5} shadow-camera-far={30}
        shadow-camera-left={-6} shadow-camera-right={6}
        shadow-camera-top={6} shadow-camera-bottom={-2}
      />
      {/* Fill — cool blue left, very dim */}
      <directionalLight position={[-6, 4, 2]} intensity={0.35} color="#B0CCFF" />
      {/* Rim — warm orange from behind character (toward monitor), strong edge light */}
      <directionalLight position={[0, 3, -6]} intensity={2.6} color="#FF7830" />
      {/* Back-rim — subtle from behind camera position (back-right), catches shoulders */}
      <directionalLight position={[4, 5, 6]} intensity={0.6} color="#FFD0A0" />
      {/* Ambient — nearly off; screen glow does the work */}
      <ambientLight intensity={0.10} color="#8AACCC" />
      {/* Monitor glow — colour-matched to screen state, strong cast across desk */}
      <pointLight ref={monitorGlowRef} position={[0, 1.72, -0.05]} intensity={3.0} color="#061A10" distance={7.5} decay={2} />
      {/* Face/torso glow from screen — illuminates the back of head & shoulders when seated */}
      <pointLight ref={faceGlowRef} position={[0, 1.85, 0.15]} intensity={0} color="#1A4488" distance={3.0} decay={2} />
      {/* Desk lamp — warm accent on left side */}
      <pointLight position={[-0.52, 1.42, -0.42]} intensity={1.1} color="#FFE8A0" distance={2.4} decay={2} />

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
  const [mounted, setMounted]         = useState(false)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 120)
    return () => clearTimeout(id)
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollState.progress = Math.max(0, Math.min(1, v))
    let next = 0
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (v >= STAGES[i].range[0]) { next = i; break }
    }
    setActiveStage(next)
  })

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])
  const dotsOpacity    = useTransform(scrollYProgress, [0.04, 0.12], [0, 1])
  const percentOpacity = useTransform(scrollYProgress, [0, 0.06, 0.95, 1], [0, 1, 1, 0])
  const percentDisplay = useTransform(scrollYProgress, (v) => `${Math.round(v * 100).toString().padStart(3, '0')}%`)

  const stage = STAGES[activeStage]

  return (
    <section ref={containerRef} className="relative" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#040810]">

        {/* ── 3D Canvas ──────────────────────────────────────────────────── */}
        <div className="absolute inset-0">
          <Canvas shadows
            dpr={[1, 1.5]}
            camera={{ position: [5.5, 2.8, 4.5], fov: 36, near: 0.1, far: 60 }}
            gl={{ antialias: true, alpha: false }}
          >
            <Scene />
          </Canvas>
        </div>

        {/* ── Gradient overlays ─────────────────────────────────────────── */}
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-[#040810]/92 via-[#040810]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 sm:hidden bg-gradient-to-t from-[#040810] via-[#040810]/75 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040810]/55 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040810]/75 via-transparent to-transparent pointer-events-none" />

        {/* ── Text overlay ───────────────────────────────────────────────── */}
        {/*
          AnimatePresence mode="wait" — only ONE stage text exists in the DOM
          at any time. Eliminates the overlap / ghost-text bug entirely.
          Exit animation finishes before enter animation begins.
        */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex flex-col justify-end sm:justify-center pointer-events-none"
        >
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="pb-[96px] sm:pb-0 max-w-[88vw] sm:max-w-sm lg:max-w-lg" style={{ minHeight: 220 }}>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.30, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Stage tag */}
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block shadow-[0_0_7px_rgba(249,115,22,0.75)]" />
                    <span className="font-mono text-[11px] text-orange-500 tracking-widest uppercase">
                      {stage.tag}
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="font-sans font-extrabold text-[2.25rem] sm:text-5xl lg:text-6xl text-white leading-[1.07] mb-4 whitespace-pre-line">
                    {stage.title}
                  </h2>

                  {/* Subtext */}
                  <p className="font-sans text-slate-400 text-sm sm:text-base leading-relaxed max-w-[260px] sm:max-w-xs lg:max-w-sm">
                    {stage.sub}
                  </p>

                  {/* CTA — final stage only */}
                  {activeStage === STAGES.length - 1 && (
                    <div className="mt-7 sm:mt-8 flex flex-col gap-3 pointer-events-auto">
                      <div className="flex flex-wrap gap-3">
                        <motion.a
                          href="/contact"
                          className="btn-orange text-sm px-6 py-3"
                          whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(249,115,22,0.45)' }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          Get Your Site — $650
                        </motion.a>
                        <motion.a
                          href="tel:5066399083"
                          className="btn-outline text-sm px-6 py-3"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          Call Neil
                        </motion.a>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {['React', 'Next.js', 'Vercel', 'Claude AI'].map((t) => (
                          <span key={t} className="font-mono text-[11px] text-slate-600 border border-navy-700 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </motion.div>

        {/* ── Bottom UI ──────────────────────────────────────────────────── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none">
          <motion.div style={{ opacity: scrollIndicatorOpacity }}>
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-px h-10 bg-gradient-to-b from-orange-500 to-transparent"
              />
              <span className="font-mono text-[10px] text-slate-600 uppercase tracking-[0.2em]">Scroll</span>
            </div>
          </motion.div>
          <motion.div style={{ opacity: dotsOpacity }}>
            <ProgressDots active={activeStage} />
          </motion.div>
        </div>

        {/* ── Stage counter — desktop only ───────────────────────────────── */}
        <motion.div
          className="absolute top-6 right-6 items-center gap-3 hidden lg:flex"
          style={{ opacity: percentOpacity }}
        >
          <span className="font-mono text-[10px] text-slate-700 uppercase tracking-widest">Stage</span>
          <motion.span className="font-mono text-xs text-orange-500/60">{percentDisplay}</motion.span>
        </motion.div>

      </div>
    </section>
  )
}
