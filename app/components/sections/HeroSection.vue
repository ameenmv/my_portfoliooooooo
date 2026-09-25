<script setup lang="ts">
/**
 * HeroSection — Exact match of guillaumezhu.com hero.
 * Key finding from CSS source: hero section bg = var(--color-cream) = #f5e7df
 * The gradient lives INSIDE the WebGL canvas as a scene background.
 * Clip-path inset frame creates rounded border on cream bg.
 * Identity at bottom-right: name + role text.
 */
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const canvasRef = ref<HTMLCanvasElement>()
const sectionRef = ref<HTMLElement>()
const frameRef = ref<HTMLElement>()
const nameRef = ref<HTMLElement>()
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let logoGroup: THREE.Group | null = null
let animId: number = 0
let ctx: gsap.Context | null = null
const mouse = { x: 0, y: 0 }

onMounted(() => {
  if (!canvasRef.value || !sectionRef.value) return
  gsap.registerPlugin(ScrollTrigger)

  initScene()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)

  ctx = gsap.context(() => {
    // Frame inset shrinks to 0 on scroll (exact same as source)
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

    // Name parallax
    if (nameRef.value) {
      gsap.to(nameRef.value, {
        yPercent: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top top',
          end: '60% top',
          scrub: 1,
        },
      })
    }
  }, sectionRef.value)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  ctx?.revert()
  renderer?.dispose()
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('resize', onResize)
})

function onMouseMove(e: MouseEvent) {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
  mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  scene = new THREE.Scene()

  // Gradient background texture (rendered in WebGL like guillaumezhu.com)
  const gradCanvas = document.createElement('canvas')
  gradCanvas.width = 2048
  gradCanvas.height = 2048
  const gctx = gradCanvas.getContext('2d')!
  const gradient = gctx.createLinearGradient(0, 0, 2048, 2048)
  gradient.addColorStop(0, '#ff6b4a')     // orange
  gradient.addColorStop(0.25, '#ff4444')   // red
  gradient.addColorStop(0.5, '#e84393')    // pink
  gradient.addColorStop(0.75, '#9b7cff')   // purple
  gradient.addColorStop(1, '#6c5ce7')      // deep purple
  gctx.fillStyle = gradient
  gctx.fillRect(0, 0, 2048, 2048)
  const bgTexture = new THREE.CanvasTexture(gradCanvas)
  scene.background = bgTexture

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 6

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
  dirLight.position.set(3, 5, 4)
  scene.add(dirLight)
  const backLight = new THREE.DirectionalLight(0x9b7cff, 0.8)
  backLight.position.set(-3, -2, -4)
  scene.add(backLight)

  logoGroup = new THREE.Group()
  scene.add(logoGroup)

  // 3D "AM" monogram — extruded letterforms
  const mat = new THREE.MeshStandardMaterial({
    color: 0xf5e7df,
    metalness: 0.15,
    roughness: 0.3,
    transparent: true,
    opacity: 0.92,
  })

  // "A" shape
  const a = new THREE.Shape()
  a.moveTo(-0.8, -1.4)
  a.lineTo(-0.15, 1.4)
  a.lineTo(0.15, 1.4)
  a.lineTo(0.8, -1.4)
  a.lineTo(0.55, -1.4)
  a.lineTo(0.35, -0.6)
  a.lineTo(-0.35, -0.6)
  a.lineTo(-0.55, -1.4)
  a.closePath()
  const aHole = new THREE.Path()
  aHole.moveTo(-0.22, -0.35)
  aHole.lineTo(0, 0.6)
  aHole.lineTo(0.22, -0.35)
  aHole.closePath()
  a.holes.push(aHole)

  const extOpts = { depth: 0.5, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.03, bevelSegments: 4 }
  const aMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(a, extOpts), mat)
  aMesh.position.x = -1.0
  aMesh.position.z = -0.25
  logoGroup.add(aMesh)

  // "M" shape
  const m = new THREE.Shape()
  m.moveTo(-0.8, -1.4)
  m.lineTo(-0.8, 1.4)
  m.lineTo(-0.5, 1.4)
  m.lineTo(0, 0.3)
  m.lineTo(0.5, 1.4)
  m.lineTo(0.8, 1.4)
  m.lineTo(0.8, -1.4)
  m.lineTo(0.55, -1.4)
  m.lineTo(0.55, 0.7)
  m.lineTo(0.1, -0.25)
  m.lineTo(-0.1, -0.25)
  m.lineTo(-0.55, 0.7)
  m.lineTo(-0.55, -1.4)
  m.closePath()

  const mMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(m, extOpts), mat)
  mMesh.position.x = 1.0
  mMesh.position.z = -0.25
  logoGroup.add(mMesh)

  logoGroup.rotation.x = 0.1

  // Intro animations
  gsap.from(logoGroup.scale, { x: 0, y: 0, z: 0, duration: 2.5, ease: 'elastic.out(1, 0.4)', delay: 0.3 })
  gsap.from(logoGroup.rotation, { y: Math.PI * 2, duration: 3, ease: 'expo.out', delay: 0.2 })

  animate()
}

function animate() {
  if (!renderer || !scene || !camera || !logoGroup) return
  const t = performance.now() * 0.001

  logoGroup.rotation.y = Math.sin(t * 0.3) * 0.3
  logoGroup.rotation.x = 0.1 + Math.sin(t * 0.2) * 0.1
  logoGroup.rotation.y += (mouse.x * 0.4 - logoGroup.rotation.y) * 0.03
  logoGroup.rotation.x += (-mouse.y * 0.2 - logoGroup.rotation.x) * 0.03
  logoGroup.position.y = Math.sin(t * 0.8) * 0.15

  renderer.render(scene, camera)
  animId = requestAnimationFrame(animate)
}
</script>

<template>
  <!-- bg-cream matches source: .hero-three { background-color: var(--color-cream) } -->
  <section
    id="hero"
    ref="sectionRef"
    class="relative w-full h-screen bg-cream"
    data-theme="cream"
  >
    <!-- Clip-path frame (exact source values) -->
    <div
      ref="frameRef"
      class="absolute inset-0 z-[1] overflow-hidden will-change-[clip-path]"
      style="--hero-inset: clamp(8px, calc(2.5vw - 8px), 16px); clip-path: inset(var(--hero-inset) round 18px); transform-origin: top;"
    >
      <!-- 3D Canvas with gradient rendered IN WebGL -->
      <canvas ref="canvasRef" class="block w-full h-full" />

      <!-- MASSIVE name text on top of 3D scene -->
      <div class="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none">
        <h2
          class="font-display font-bold text-cream/90 leading-[0.85] tracking-display text-center select-none"
          style="font-size: clamp(60px, 18vw, 260px);"
        >
          <span class="block">ameen</span>
          <span class="block">mohamed</span>
        </h2>
      </div>
    </div>

    <!-- SEO title -->
    <h1 class="sr-only">Ameen Mohamed — Front-End Engineer · Vue.js &amp; Nuxt.js</h1>

    <!-- Identity overlay bottom-right (exact source values) -->
    <div
      ref="nameRef"
      class="absolute inset-0 z-[2] pointer-events-none will-change-transform"
    >
      <!-- bottom/right: clamp(24px, 3vw, 48px) from source -->
      <div
        class="absolute text-cream text-end"
        style="bottom: clamp(24px, 3vw, 48px); right: clamp(24px, 3vw, 48px);"
      >
        <h2
          class="font-display font-semibold leading-[0.9] m-0"
          style="font-size: clamp(28px, 3.25vw, 64px); letter-spacing: -0.01em;"
        >
          Ameen<br>Mohamed
        </h2>
        <div
          class="flex flex-col gap-[10px] mt-5 font-display font-light leading-none opacity-70"
          style="font-size: clamp(14px, 1.25vw, 22px);"
        >
          <span class="block">Front-End Engineer</span>
          <span class="block">Vue.js · Nuxt.js</span>
        </div>
      </div>

      <!-- Scroll hint -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span class="font-body text-[11px] tracking-[0.2em] uppercase text-cream">Scroll</span>
        <div class="w-[1px] h-8 bg-cream/50 animate-pulse" />
      </div>
    </div>
  </section>
</template>
