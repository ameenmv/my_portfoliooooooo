<script setup lang="ts">
/**
 * HeroSection — Full viewport Three.js canvas with clip-path inset frame.
 * Exact replica of guillaumezhu.com hero:
 * - Particle field + geometric shapes
 * - clip-path: inset(var(--hero-frame-inset) round 18px) 
 * - Name/role at bottom-right
 * - ScrollTrigger drives frame expansion + parallax
 */
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
const canvasRef = ref<HTMLCanvasElement>()
const sectionRef = ref<HTMLElement>()
const frameRef = ref<HTMLElement>()
const nameRef = ref<HTMLElement>()
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let particleSystem: THREE.Points | null = null
let animId: number = 0
let ctx: gsap.Context | null = null
const mouse = { x: 0, y: 0 }

// Particle config
const PARTICLE_COUNT = 3000
const RING_COUNT = 3

onMounted(() => {
  if (!canvasRef.value || !sectionRef.value) return
  gsap.registerPlugin(ScrollTrigger)

  initScene()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)

  // ScrollTrigger: hero frame inset shrinks to 0 as user scrolls
  ctx = gsap.context(() => {
    if (frameRef.value) {
      gsap.to(frameRef.value, {
        '--hero-inset': '0px',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top top',
          end: '80% top',
          scrub: 1,
        },
      })
    }

    // Parallax name overlay
    if (nameRef.value) {
      gsap.to(nameRef.value, {
        yPercent: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }
  }, sectionRef.value)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  renderer?.dispose()
  ctx?.revert()
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('resize', onResize)
})

function onMouseMove(e: MouseEvent) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
}

function onResize() {
  if (!renderer || !camera) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function initScene() {
  const canvas = canvasRef.value!

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setClearColor(0x1f1d1d, 1)

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x1f1d1d, 0.08)

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 6

  // === Particle field ===
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const colors = new Float32Array(PARTICLE_COUNT * 3)
  const sizes = new Float32Array(PARTICLE_COUNT)

  const creamColor = new THREE.Color(0xf5e7df)
  const orangeColor = new THREE.Color(0xff6b4a)
  const goldColor = new THREE.Color(0xf6c177)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Distribute in a sphere volume
    const r = Math.random() * 8
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    // Color variation
    const colorChoice = Math.random()
    const color = colorChoice < 0.7 ? creamColor : colorChoice < 0.85 ? orangeColor : goldColor
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    sizes[i] = Math.random() * 3 + 0.5
  }

  const particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.015,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true,
  })

  particleSystem = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particleSystem)

  // === Central orb (glowing orange) ===
  const orbGroup = new THREE.Group()

  const orbCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff6b4a, transparent: true, opacity: 0.4 })
  )
  orbGroup.add(orbCore)

  // Outer glow
  const orbGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff6b4a, transparent: true, opacity: 0.08 })
  )
  orbGroup.add(orbGlow)

  scene.add(orbGroup)

  // === Wireframe rings ===
  const rings: THREE.Mesh[] = []
  for (let i = 0; i < RING_COUNT; i++) {
    const radius = 1.0 + i * 0.5
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.003, 16, 128),
      new THREE.MeshBasicMaterial({ color: 0xf5e7df, transparent: true, opacity: 0.2 - i * 0.05 })
    )
    ring.rotation.x = Math.PI * (0.3 + i * 0.2)
    ring.rotation.y = Math.PI * i * 0.15
    scene.add(ring)
    rings.push(ring)
  }

  // === Floating line segments ===
  for (let i = 0; i < 8; i++) {
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5))
    ])
    const line = new THREE.Line(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0xf5e7df, transparent: true, opacity: 0.1 })
    )
    line.position.set(
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4
    )
    scene.add(line)
  }

  // Intro animation
  gsap.from(camera.position, { z: 15, duration: 3, ease: 'expo.out' })
  gsap.from(orbCore.material, { opacity: 0, duration: 2, delay: 0.8, ease: 'power2.out' })
  rings.forEach((ring, i) => {
    gsap.from(ring.scale, { x: 0, y: 0, z: 0, duration: 2, delay: 0.4 + i * 0.2, ease: 'elastic.out(1, 0.5)' })
  })

  animate(orbGroup, rings)
}

function animate(orbGroup: THREE.Group, rings: THREE.Mesh[]) {
  if (!renderer || !scene || !camera || !particleSystem) return

  const time = performance.now() * 0.001
  const positions = particleSystem.geometry.attributes.position.array as Float32Array

  // Gentle particle drift
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] += Math.sin(time * 0.3 + i * 0.01) * 0.0004
    positions[i + 1] += Math.cos(time * 0.2 + i * 0.02) * 0.0003
    positions[i + 2] += Math.sin(time * 0.4 + i * 0.015) * 0.0002
  }
  particleSystem.geometry.attributes.position.needsUpdate = true
  particleSystem.rotation.y = time * 0.02

  // Rotate rings at different speeds
  rings.forEach((ring, i) => {
    ring.rotation.z = time * (0.08 + i * 0.03) * (i % 2 ? 1 : -1)
  })

  // Orb pulse
  const pulse = 1 + Math.sin(time * 1.5) * 0.08
  orbGroup.scale.setScalar(pulse)
  orbGroup.rotation.y = time * 0.1

  // Mouse influence
  camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.03
  camera.position.y += (mouse.y * 0.25 - camera.position.y) * 0.03
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
  animId = requestAnimationFrame(() => animate(orbGroup, rings))
}
</script>

<template>
  <section
    id="hero"
    ref="sectionRef"
    class="relative w-full h-[200vh] overflow-visible bg-dark"
    data-theme="cream"
  >
    <!-- Sticky viewport container -->
    <div class="sticky top-0 h-screen overflow-hidden">
    <!-- 3D Canvas with animated inset frame -->
    <div
      ref="frameRef"
      class="absolute inset-0 z-[1] overflow-hidden will-change-[clip-path] rounded-[18px]"
      style="--hero-inset: clamp(8px, calc(2.5vw - 8px), 16px); clip-path: inset(var(--hero-inset) round 18px);"
    >
      <canvas ref="canvasRef" class="block w-full h-full" />
    </div>

    <!-- SEO title -->
    <h1 class="sr-only">Ameen Mohamed — Front-End Engineer · Vue.js & Nuxt.js</h1>

    <!-- Identity overlay: name at bottom-right (like guillaumezhu.com) -->
    <div
      ref="nameRef"
      class="absolute inset-0 z-[2] pointer-events-none will-change-transform"
    >
      <div class="absolute bottom-[clamp(32px,4vw,64px)] end-[clamp(32px,4vw,64px)] text-cream text-end">
        <h2 class="font-display text-[clamp(32px,4vw,72px)] font-semibold leading-[0.88] tracking-tight">
          Ameen<br>Mohamed
        </h2>
        <div class="flex flex-col gap-[10px] mt-6 font-display text-[clamp(14px,1.2vw,22px)] font-light leading-none opacity-80">
          <span class="block">Front-End Engineer</span>
          <span class="block opacity-60">Vue.js · Nuxt.js</span>
        </div>
      </div>

      <!-- Scroll hint at bottom center -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span class="font-body text-[11px] tracking-[0.2em] uppercase text-cream">Scroll</span>
        <div class="w-[1px] h-8 bg-cream/50 animate-pulse" />
      </div>
    </div>
    </div>
  </section>
</template>

