<script setup lang="ts">
/**
 * HeroSection — Exact replica of guillaumezhu.com hero.
 *
 * FROM JS SOURCE:
 * - Hero is PINNED with ScrollTrigger for 3500px (desktop) / 2800px (mobile)
 * - 3D logo rotation is driven by scroll progress (scrub: true)
 * - After pin ends, the frame scales down (scaleX: 0.94, scaleY: 0.9)
 * - Frame clip-path inset stays during pin, shrinks after
 * - Massive text "ameen mohamed" is part of the visual
 * - Identity (small text) at bottom-right
 *
 * FROM CSS SOURCE:
 * - bg: var(--color-cream) = #f5e7df
 * - clip-path: inset(var(--hero-frame-inset) round 18px)
 * - Identity: bottom/right clamp(24px, 3vw, 48px)
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
let scrollProgress = 0

// Source: jn() returns 3500 desktop, 2800 mobile
function getPinDistance() {
  const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches
  return isMobile ? 2800 : 3500
}

onMounted(() => {
  if (!canvasRef.value || !sectionRef.value) return
  gsap.registerPlugin(ScrollTrigger)

  initScene()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)

  ctx = gsap.context(() => {
    // Source: ScrollTrigger.create({ trigger: '.hero-three', pin: true, scrub: true, end: +=${3500} })
    ScrollTrigger.create({
      trigger: sectionRef.value!,
      start: 'top top',
      end: () => `+=${getPinDistance()}`,
      scrub: true,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        scrollProgress = self.progress
      },
    })

    // Source: After pin ends, frame scales down
    gsap.to(frameRef.value!, {
      scaleX: 0.94,
      scaleY: 0.9,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: () => `top+=${getPinDistance()} top`,
        end: () => `top+=${getPinDistance() + 400} top`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    })

    // Identity fades out with scroll
    if (nameRef.value) {
      gsap.to(nameRef.value, {
        autoAlpha: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: `top+=3% top`,
          end: `top+=7.5% top`,
          scrub: true,
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

  // Gradient background rendered in WebGL (from source: the 3D scene contains the gradient)
  const gradCanvas = document.createElement('canvas')
  gradCanvas.width = 2048
  gradCanvas.height = 2048
  const gctx = gradCanvas.getContext('2d')!
  const gradient = gctx.createLinearGradient(0, 0, 2048, 2048)
  gradient.addColorStop(0, '#ff6b4a')
  gradient.addColorStop(0.25, '#ff4444')
  gradient.addColorStop(0.5, '#e84393')
  gradient.addColorStop(0.75, '#9b7cff')
  gradient.addColorStop(1, '#6c5ce7')
  gctx.fillStyle = gradient
  gctx.fillRect(0, 0, 2048, 2048)
  scene.background = new THREE.CanvasTexture(gradCanvas)

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

  // 3D "AM" monogram
  const mat = new THREE.MeshStandardMaterial({
    color: 0xf5e7df,
    metalness: 0.15,
    roughness: 0.3,
    transparent: true,
    opacity: 0.92,
  })

  const extOpts = { depth: 0.5, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.03, bevelSegments: 4 }

  // "A"
  const a = new THREE.Shape()
  a.moveTo(-0.8, -1.4); a.lineTo(-0.15, 1.4); a.lineTo(0.15, 1.4)
  a.lineTo(0.8, -1.4); a.lineTo(0.55, -1.4); a.lineTo(0.35, -0.6)
  a.lineTo(-0.35, -0.6); a.lineTo(-0.55, -1.4); a.closePath()
  const aH = new THREE.Path()
  aH.moveTo(-0.22, -0.35); aH.lineTo(0, 0.6); aH.lineTo(0.22, -0.35); aH.closePath()
  a.holes.push(aH)
  const aMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(a, extOpts), mat)
  aMesh.position.set(-1.0, 0, -0.25)
  logoGroup.add(aMesh)

  // "M"
  const m = new THREE.Shape()
  m.moveTo(-0.8, -1.4); m.lineTo(-0.8, 1.4); m.lineTo(-0.5, 1.4)
  m.lineTo(0, 0.3); m.lineTo(0.5, 1.4); m.lineTo(0.8, 1.4)
  m.lineTo(0.8, -1.4); m.lineTo(0.55, -1.4); m.lineTo(0.55, 0.7)
  m.lineTo(0.1, -0.25); m.lineTo(-0.1, -0.25); m.lineTo(-0.55, 0.7)
  m.lineTo(-0.55, -1.4); m.closePath()
  const mMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(m, extOpts), mat)
  mMesh.position.set(1.0, 0, -0.25)
  logoGroup.add(mMesh)

  logoGroup.rotation.x = 0.1

  // Intro: elastic scale in + full spin
  gsap.from(logoGroup.scale, { x: 0, y: 0, z: 0, duration: 2.5, ease: 'elastic.out(1, 0.4)', delay: 0.3 })
  gsap.from(logoGroup.rotation, { y: Math.PI * 2, duration: 3, ease: 'expo.out', delay: 0.2 })

  animate()
}

function animate() {
  if (!renderer || !scene || !camera || !logoGroup) return
  const t = performance.now() * 0.001

  // Scroll-driven rotation (source: setScrollProgress drives the 3D)
  // The logo rotates based on scroll progress (0-1 mapped to 0-2π)
  const scrollRotY = scrollProgress * Math.PI * 2
  const scrollRotX = Math.sin(scrollProgress * Math.PI) * 0.5

  // Idle drift + scroll-driven rotation
  logoGroup.rotation.y = scrollRotY + Math.sin(t * 0.3) * 0.15
  logoGroup.rotation.x = scrollRotX + 0.1 + Math.sin(t * 0.2) * 0.05

  // Mouse influence
  logoGroup.rotation.y += (mouse.x * 0.3 - 0) * 0.02
  logoGroup.rotation.x += (-mouse.y * 0.15 - 0) * 0.02

  // Subtle float
  logoGroup.position.y = Math.sin(t * 0.8) * 0.15

  // Zoom in slightly as scroll progresses
  const scale = 1 + scrollProgress * 0.15
  logoGroup.scale.setScalar(scale)

  renderer.render(scene, camera)
  animId = requestAnimationFrame(animate)
}
</script>

<template>
  <!-- Source: .hero-three { background-color: var(--color-cream); height: 100vh } -->
  <section
    id="hero"
    ref="sectionRef"
    class="relative w-full h-screen bg-cream"
    data-theme="cream"
  >
    <!-- Clip-path frame (source: clip-path: inset(var(--hero-frame-inset) round 18px)) -->
    <div
      ref="frameRef"
      class="absolute inset-0 z-[1] overflow-hidden will-change-[clip-path,transform]"
      style="--hero-inset: clamp(8px, calc(2.5vw - 8px), 16px); clip-path: inset(var(--hero-inset) round 18px); transform-origin: top;"
    >
      <!-- 3D Canvas (gradient lives inside WebGL) -->
      <canvas ref="canvasRef" class="block w-full h-full" />

      <!-- MASSIVE name text overlaying 3D scene (bottom-positioned like source) -->
      <div class="absolute inset-0 flex items-end justify-start z-[1] pointer-events-none p-[clamp(24px,4vw,64px)]">
        <h2
          class="font-display font-bold text-cream/80 leading-[0.85] tracking-display select-none"
          style="font-size: clamp(60px, 18vw, 260px);"
        >
          <span class="block">ameen</span>
          <span class="block">mohamed</span>
        </h2>
      </div>
    </div>

    <!-- SEO title -->
    <h1 class="sr-only">Ameen Mohamed — Front-End Engineer · Vue.js &amp; Nuxt.js</h1>

    <!-- Identity at bottom-right (source: bottom/right clamp(24px, 3vw, 48px)) -->
    <div
      ref="nameRef"
      class="absolute inset-0 z-[2] pointer-events-none will-change-transform"
    >
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
    </div>
  </section>
</template>
