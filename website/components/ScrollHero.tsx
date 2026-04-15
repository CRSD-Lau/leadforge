'use client'

import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Shared scroll progress – updated in React, read in R3F useFrame (no state)
// ---------------------------------------------------------------------------
const scrollState = { progress: 0 }

// ---------------------------------------------------------------------------
// 3D helpers
// ---------------------------------------------------------------------------
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// ---------------------------------------------------------------------------
// Desk
// ---------------------------------------------------------------------------
function Desk() {
  return (
    <group>
      {/* Surface */}
      <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.07, 1.3]} />
        <meshStandardMaterial color="#1A2236" roughness={0.6} />
      </mesh>
      {/* Legs */}
      {([ [-1.15, 0.49, -0.55], [1.15, 0.49, -0.55], [-1.15, 0.49, 0.55], [1.15, 0.49, 0.55] ] as [number,number,number][]).map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.06, 0.97, 0.06]} />
          <meshStandardMaterial color="#0F1629" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Monitor – screen color driven by ref, updated in useFrame
// ---------------------------------------------------------------------------
function Monitor({ screenRef }: { screenRef: React.MutableRefObject<THREE.Mesh | null> }) {
  return (
    <group position={[0, 1.62, -0.28]}>
      {/* Bezel */}
      <mesh castShadow>
        <boxGeometry args={[1.25, 0.88, 0.05]} />
        <meshStandardMaterial color="#1A2236" roughness={0.5} />
      </mesh>
      {/* Screen face */}
      <mesh ref={screenRef} position={[0, 0, 0.03]}>
        <boxGeometry args={[1.13, 0.76, 0.01]} />
        <meshStandardMaterial color="#050A18" emissive="#050A18" emissiveIntensity={0.5} roughness={0.2} />
      </mesh>
      {/* Stand neck */}
      <mesh position={[0, -0.54, 0]}>
        <boxGeometry args={[0.06, 0.2, 0.06]} />
        <meshStandardMaterial color="#263656" />
      </mesh>
      {/* Stand base */}
      <mesh position={[0, -0.65, 0.06]}>
        <boxGeometry args={[0.35, 0.04, 0.24]} />
        <meshStandardMaterial color="#263656" />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Chair
// ---------------------------------------------------------------------------
function Chair() {
  return (
    <group position={[0, 0, 0.88]}>
      <mesh position={[0, 1.04, 0]}>
        <boxGeometry args={[0.72, 0.06, 0.68]} />
        <meshStandardMaterial color="#0F1629" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.47, 0.31]}>
        <boxGeometry args={[0.72, 0.76, 0.06]} />
        <meshStandardMaterial color="#0F1629" roughness={0.9} />
      </mesh>
      {/* Chair legs */}
      {([ [-0.3, 0.52, -0.28], [0.3, 0.52, -0.28], [-0.3, 0.52, 0.28], [0.3, 0.52, 0.28] ] as [number,number,number][]).map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.05, 1.0, 0.05]} />
          <meshStandardMaterial color="#263656" />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Developer character – body parts driven by refs, animated in useFrame
// ---------------------------------------------------------------------------
function Developer({
  bodyRef, headRef, lArmRef, rArmRef, lLegRef, rLegRef,
}: {
  bodyRef: React.MutableRefObject<THREE.Mesh | null>
  headRef: React.MutableRefObject<THREE.Mesh | null>
  lArmRef: React.MutableRefObject<THREE.Mesh | null>
  rArmRef: React.MutableRefObject<THREE.Mesh | null>
  lLegRef: React.MutableRefObject<THREE.Mesh | null>
  rLegRef: React.MutableRefObject<THREE.Mesh | null>
}) {
  return (
    <group>
      {/* Torso */}
      <mesh ref={bodyRef} position={[0, 2.0, 0.35]}>
        <boxGeometry args={[0.52, 0.68, 0.3]} />
        <meshStandardMaterial color="#263656" roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh ref={headRef} position={[0, 2.58, 0.35]}>
        <boxGeometry args={[0.33, 0.33, 0.3]} />
        <meshStandardMaterial color="#FB923C" roughness={0.5} />
      </mesh>
      {/* Left arm */}
      <mesh ref={lArmRef} position={[-0.38, 1.82, 0.35]}>
        <boxGeometry args={[0.17, 0.52, 0.17]} />
        <meshStandardMaterial color="#263656" roughness={0.7} />
      </mesh>
      {/* Right arm */}
      <mesh ref={rArmRef} position={[0.38, 1.82, 0.35]}>
        <boxGeometry args={[0.17, 0.52, 0.17]} />
        <meshStandardMaterial color="#263656" roughness={0.7} />
      </mesh>
      {/* Left leg */}
      <mesh ref={lLegRef} position={[-0.15, 1.35, 0.35]}>
        <boxGeometry args={[0.17, 0.52, 0.17]} />
        <meshStandardMaterial color="#1A2236" roughness={0.8} />
      </mesh>
      {/* Right leg */}
      <mesh ref={rLegRef} position={[0.15, 1.35, 0.35]}>
        <boxGeometry args={[0.17, 0.52, 0.17]} />
        <meshStandardMaterial color="#1A2236" roughness={0.8} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------------------
// Floating code particles
// ---------------------------------------------------------------------------
function CodeParticles({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      pos: [(Math.random() - 0.5) * 7, 0.5 + Math.random() * 3.5, (Math.random() - 0.5) * 3.5] as [number, number, number],
      speed: 0.18 + Math.random() * 0.28,
      phase: Math.random() * Math.PI * 2,
    })), [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh
      mesh.position.y = particles[i].pos[1] + Math.sin(clock.elapsedTime * particles[i].speed + particles[i].phase) * 0.28
      mesh.rotation.y = clock.elapsedTime * 0.6 + particles[i].phase
      const opacity = visible ? 0.55 : 0
      ;(mesh.material as THREE.MeshStandardMaterial).opacity = opacity
    })
  })

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <boxGeometry args={[0.07, 0.07, 0.07]} />
          <meshStandardMaterial
            color="#F97316"
            emissive="#F97316"
            emissiveIntensity={0.6}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Orange accent glow sphere
// ---------------------------------------------------------------------------
function GlowSphere() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.15 + Math.sin(clock.elapsedTime * 0.8) * 0.08
  })
  return (
    <mesh ref={ref} position={[2.5, 0.5, -1.5]}>
      <sphereGeometry args={[0.8, 16, 16]} />
      <meshStandardMaterial color="#F97316" emissive="#F97316" emissiveIntensity={0.15} transparent opacity={0.07} />
    </mesh>
  )
}

// ---------------------------------------------------------------------------
// Ground plane
// ---------------------------------------------------------------------------
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[18, 18]} />
      <meshStandardMaterial color="#080D1A" roughness={1} />
    </mesh>
  )
}

// ---------------------------------------------------------------------------
// Screen colors for each stage
// ---------------------------------------------------------------------------
const SCREEN_COLORS = [
  new THREE.Color('#050A18'), // off
  new THREE.Color('#052E16'), // dark green (booting)
  new THREE.Color('#14532D'), // green (coding)
  new THREE.Color('#431407'), // dark orange (building)
  new THREE.Color('#FFFFFF'), // white (live site)
]

// ---------------------------------------------------------------------------
// Main scene – camera rig + character animation, all in useFrame
// ---------------------------------------------------------------------------
function Scene() {
  const bodyRef    = useRef<THREE.Mesh>(null)
  const headRef    = useRef<THREE.Mesh>(null)
  const lArmRef    = useRef<THREE.Mesh>(null)
  const rArmRef    = useRef<THREE.Mesh>(null)
  const lLegRef    = useRef<THREE.Mesh>(null)
  const rLegRef    = useRef<THREE.Mesh>(null)
  const screenRef  = useRef<THREE.Mesh>(null)
  const particlesVisible = useRef(false)

  const targetColor = useRef(new THREE.Color('#050A18'))
  const currentColor = useRef(new THREE.Color('#050A18'))

  useFrame(({ camera, clock }, delta) => {
    const t = scrollState.progress

    // ── Camera orbit ────────────────────────────────────────────────────────
    const startAngle = 0.55   // ~31° — starts front-right of desk
    const angle      = startAngle + t * Math.PI * 1.5  // sweeps 270°
    const radius     = 6.5
    const camH       = lerp(3.8, 2.4, t)
    camera.position.set(
      Math.sin(angle) * radius,
      camH,
      Math.cos(angle) * radius,
    )
    camera.lookAt(0, 1.55, 0)

    // ── Character pose ───────────────────────────────────────────────────────
    // t: 0-0.2 standing, 0.2-0.45 sitting, 0.45+ seated at desk
    const sitT    = Math.max(0, Math.min(1, (t - 0.2) / 0.25))
    const standT  = t > 0.88 ? Math.min(1, (t - 0.88) / 0.12) : 0  // stands back up at end

    const poseSitAmount  = sitT * (1 - standT)

    // Body Y: standing = 2.0, seated = 1.52
    const bodyTargetY = lerp(2.0, 1.52, poseSitAmount)
    if (bodyRef.current) {
      bodyRef.current.position.y += (bodyTargetY - bodyRef.current.position.y) * Math.min(1, delta * 5)
    }
    if (headRef.current) {
      headRef.current.position.y += (bodyTargetY + 0.58 - headRef.current.position.y) * Math.min(1, delta * 5)
    }

    // Arms: reach forward when typing (t 0.45-0.85)
    const typingT = t > 0.45 && t < 0.88 ? Math.min(1, (t - 0.45) / 0.18) : 0
    const armFwdX = lerp(0, -0.85, typingT * poseSitAmount)   // rotate forward
    if (lArmRef.current) {
      lArmRef.current.rotation.x += (armFwdX - lArmRef.current.rotation.x) * Math.min(1, delta * 6)
      lArmRef.current.position.y += (bodyTargetY - 0.18 - lArmRef.current.position.y) * Math.min(1, delta * 5)
    }
    if (rArmRef.current) {
      rArmRef.current.rotation.x += (armFwdX - rArmRef.current.rotation.x) * Math.min(1, delta * 6)
      rArmRef.current.position.y += (bodyTargetY - 0.18 - rArmRef.current.position.y) * Math.min(1, delta * 5)
    }

    // Legs: horizontal when seated
    const legRotX = lerp(0, Math.PI / 2.1, poseSitAmount)
    const legFwdZ = lerp(0.35, 0.78, poseSitAmount)
    if (lLegRef.current) {
      lLegRef.current.rotation.x += (legRotX - lLegRef.current.rotation.x) * Math.min(1, delta * 5)
      lLegRef.current.position.z += (legFwdZ - lLegRef.current.position.z) * Math.min(1, delta * 5)
      lLegRef.current.position.y += (bodyTargetY - 0.48 - lLegRef.current.position.y) * Math.min(1, delta * 5)
    }
    if (rLegRef.current) {
      rLegRef.current.rotation.x += (legRotX - rLegRef.current.rotation.x) * Math.min(1, delta * 5)
      rLegRef.current.position.z += (legFwdZ - rLegRef.current.position.z) * Math.min(1, delta * 5)
      rLegRef.current.position.y += (bodyTargetY - 0.48 - rLegRef.current.position.y) * Math.min(1, delta * 5)
    }

    // ── Monitor screen color ─────────────────────────────────────────────────
    if (t < 0.3) {
      targetColor.current.copy(SCREEN_COLORS[0])
    } else if (t < 0.52) {
      targetColor.current.copy(SCREEN_COLORS[1])
    } else if (t < 0.72) {
      targetColor.current.copy(SCREEN_COLORS[2])
    } else if (t < 0.88) {
      targetColor.current.copy(SCREEN_COLORS[3])
    } else {
      targetColor.current.copy(SCREEN_COLORS[4])
    }

    currentColor.current.lerp(targetColor.current, Math.min(1, delta * 3))

    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial
      mat.color.copy(currentColor.current)
      mat.emissive.copy(currentColor.current)
      const isWhite = t >= 0.88
      mat.emissiveIntensity = isWhite
        ? 0.9 + Math.sin(clock.elapsedTime * 1.2) * 0.05
        : t > 0.5 ? 0.45 + Math.sin(clock.elapsedTime * 2) * 0.1 : 0.3
    }

    // particles show when coding
    particlesVisible.current = t > 0.44 && t < 0.88
  })

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 8, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Monitor glow light */}
      <pointLight position={[0, 1.65, -0.1]} intensity={0.8} color="#F97316" distance={3} />
      {/* Ambient fill from left */}
      <directionalLight position={[-5, 3, 0]} intensity={0.3} color="#334D73" />

      <Ground />
      <Desk />
      <Chair />
      <Monitor screenRef={screenRef} />
      <Developer
        bodyRef={bodyRef} headRef={headRef}
        lArmRef={lArmRef} rArmRef={rArmRef}
        lLegRef={lLegRef} rLegRef={rLegRef}
      />
      <CodeParticles visible={particlesVisible.current} />
      <GlowSphere />
    </>
  )
}

// ---------------------------------------------------------------------------
// Narrative stages for text overlay
// ---------------------------------------------------------------------------
const STAGES = [
  {
    range: [0, 0.22],
    tag:  'THE PROBLEM',
    title: 'Your business is\ninvisible online.',
    sub:  '87% of customers search before calling. If they can\'t find you, they find your competitor.',
  },
  {
    range: [0.22, 0.44],
    tag:  'DAY 0',
    title: 'Neil gets to\nwork.',
    sub:  'Discovery call booked. Brief taken. Build starts within 24 hours.',
  },
  {
    range: [0.44, 0.66],
    tag:  'DAY 1–2',
    title: 'Claude writes\nthe code.',
    sub:  'React, Tailwind, mobile-first. Built faster than you can write a brief.',
  },
  {
    range: [0.66, 0.88],
    tag:  'DAY 3–4',
    title: 'Your site\ntakes shape.',
    sub:  'Preview link shared. One revision round. Zero surprises.',
  },
  {
    range: [0.88, 1.01],
    tag:  'DAY 5',
    title: '$650. 5 days.\nYours forever.',
    sub:  'Domain live. GitHub repo handed over. You own every line of code.',
  },
]

// ---------------------------------------------------------------------------
// Scroll progress dots
// ---------------------------------------------------------------------------
function ProgressDots({ active }: { active: number }) {
  return (
    <div className="flex gap-2">
      {STAGES.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === active ? 24 : 8,
            backgroundColor: i === active ? '#F97316' : '#263656',
          }}
          transition={{ duration: 0.3 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Root export — the full scroll-hero section
// ---------------------------------------------------------------------------
export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStage, setActiveStage] = useState(0)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  // Clamp + push into mutable ref (no React state → no R3F re-renders)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollState.progress = Math.max(0, Math.min(1, v))
    // Track active stage for progress dots
    let next = 0
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (v >= STAGES[i].range[0]) { next = i; break }
    }
    setActiveStage(next)
  })

  // Per-stage opacity transforms — must be called unconditionally (hooks rules)
  const opacity0 = useTransform(scrollYProgress, [0, 0, STAGES[0].range[1]-0.04, STAGES[0].range[1]], [1,1,1,0])
  const opacity1 = useTransform(scrollYProgress, [STAGES[1].range[0], STAGES[1].range[0]+0.04, STAGES[1].range[1]-0.04, STAGES[1].range[1]], [0,1,1,0])
  const opacity2 = useTransform(scrollYProgress, [STAGES[2].range[0], STAGES[2].range[0]+0.04, STAGES[2].range[1]-0.04, STAGES[2].range[1]], [0,1,1,0])
  const opacity3 = useTransform(scrollYProgress, [STAGES[3].range[0], STAGES[3].range[0]+0.04, STAGES[3].range[1]-0.04, STAGES[3].range[1]], [0,1,1,0])
  const opacity4 = useTransform(scrollYProgress, [STAGES[4].range[0], STAGES[4].range[0]+0.04, 0.98, 1.0], [0,1,1,1])
  const opacities = [opacity0, opacity1, opacity2, opacity3, opacity4]
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])
  const dotsOpacity = useTransform(scrollYProgress, [0.04, 0.1], [0, 1])
  const percentOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0])
  const percentDisplay = useTransform(scrollYProgress, (v) => `${Math.round(v * 100).toString().padStart(3, '0')}%`)

  return (
    /* Scroll container — 500 vh gives comfortable scroll room */
    <section ref={containerRef} className="relative" style={{ height: '500vh' }}>

      {/* Sticky wrapper — stays in viewport while parent scrolls */}
      <div className="sticky top-0 h-screen overflow-hidden bg-navy-900">

        {/* 3D Canvas — fills entire background */}
        <div className="absolute inset-0">
          <Canvas
            shadows
            camera={{ position: [5.5, 3.8, 5.5], fov: 42, near: 0.1, far: 60 }}
            gl={{ antialias: true, alpha: false }}
          >
            <Scene />
          </Canvas>
        </div>

        {/* ── Gradient overlays for depth ──────────────────────────────── */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/70 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent pointer-events-none" />

        {/* ── Text overlay — left column ────────────────────────────────── */}
        <div className="absolute inset-0 flex flex-col justify-center pointer-events-none">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-sm lg:max-w-md">

              {STAGES.map((stage, i) => (
                <motion.div
                  key={i}
                  style={{ opacity: opacities[i] }}
                  className="absolute"
                >
                  <span className="font-mono text-xs text-orange-500 tracking-widest uppercase mb-3 block">
                    {stage.tag}
                  </span>
                  <h2 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-5 whitespace-pre-line">
                    {stage.title}
                  </h2>
                  <p className="font-sans text-slate-400 text-base sm:text-lg leading-relaxed max-w-xs">
                    {stage.sub}
                  </p>
                  {/* CTA on final stage only */}
                  {i === STAGES.length - 1 && (
                    <div className="mt-7 flex gap-3 pointer-events-auto">
                      <a
                        href="/contact"
                        className="btn-orange text-sm px-6 py-3"
                      >
                        Get Your Site — $650
                      </a>
                      <a
                        href="tel:5066399083"
                        className="btn-outline text-sm px-6 py-3"
                      >
                        Call Neil
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}

            </div>
          </div>
        </div>

        {/* ── Scroll progress dots — bottom centre ─────────────────────── */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none">
          <motion.div style={{ opacity: scrollIndicatorOpacity }}>
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-xs text-slate-600 uppercase tracking-widest">Scroll</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-px h-8 bg-gradient-to-b from-orange-500 to-transparent"
              />
            </div>
          </motion.div>
          <motion.div style={{ opacity: dotsOpacity }}>
            <ProgressDots active={activeStage} />
          </motion.div>
        </div>

        {/* ── Scroll percent indicator ──────────────────────────────────── */}
        <motion.div
          className="absolute top-8 right-6 font-mono text-xs text-orange-500/40 hidden lg:block"
          style={{ opacity: percentOpacity }}
        >
          <motion.span>{percentDisplay}</motion.span>
        </motion.div>

      </div>
    </section>
  )
}
