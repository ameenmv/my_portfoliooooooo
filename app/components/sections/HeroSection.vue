<script setup lang="ts">
/**
 * HeroSection — Exact replica of guillaumezhu.com hero:
 * - Vibrant gradient background (orange → red → pink → purple)
 * - MASSIVE name text filling viewport
 * - 3D "AM" monogram logo floating, intersecting with text
 * - clip-path: inset() rounded frame that shrinks to 0 on scroll
 * - Name/role at bottom-right
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
    // Clip-path frame shrinks to 0 on scroll
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

    // Name parallax on scroll
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

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0) // Transparent — gradient shows through

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 6

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
  directionalLight.position.set(3, 5, 4)
  scene.add(directionalLight)

  const backLight = new THREE.DirectionalLight(0x9b7cff, 0.8)
  backLight.position.set(-3, -2, -4)
  scene.add(backLight)

  logoGroup = new THREE.Group()
  scene.add(logoGroup)

  // Build 3D "AM" monogram from geometric shapes
  const material = new THREE.MeshStandardMaterial({
    color: 0xf5e7df,
    metalness: 0.15,
    roughness: 0.3,
    transparent: true,
    opacity: 0.92,
  })

  // "A" letter — triangle shape with crossbar
  const aShape = new THREE.Shape()
  aShape.moveTo(-0.8, -1.4)
  aShape.lineTo(-0.15, 1.4)
  aShape.lineTo(0.15, 1.4)
  aShape.lineTo(0.8, -1.4)
  aShape.lineTo(0.55, -1.4)
  aShape.lineTo(0.35, -0.6)
  aShape.lineTo(-0.35, -0.6)
  aShape.lineTo(-0.55, -1.4)
  aShape.closePath()

  // A crossbar hole
  const aHole = new THREE.Path()
  aHole.moveTo(-0.22, -0.35)
  aHole.lineTo(0, 0.6)
  aHole.lineTo(0.22, -0.35)
  aHole.closePath()
  aShape.holes.push(aHole)

  const aGeometry = new THREE.ExtrudeGeometry(aShape, {
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.03,
    bevelSegments: 4,
  })
  const aMesh = new THREE.Mesh(aGeometry, material)
  aMesh.position.x = -1.0
  aMesh.position.z = -0.25
  logoGroup.add(aMesh)

  // "M" letter — two peaks
  const mShape = new THREE.Shape()
  mShape.moveTo(-0.8, -1.4)
  mShape.lineTo(-0.8, 1.4)
  mShape.lineTo(-0.5, 1.4)
  mShape.lineTo(0, 0.3)
  mShape.lineTo(0.5, 1.4)
  mShape.lineTo(0.8, 1.4)
  mShape.lineTo(0.8, -1.4)
  mShape.lineTo(0.55, -1.4)
  mShape.lineTo(0.55, 0.7)
  mShape.lineTo(0.1, -0.25)
  mShape.lineTo(-0.1, -0.25)
  mShape.lineTo(-0.55, 0.7)
  mShape.lineTo(-0.55, -1.4)
  mShape.closePath()

  const mGeometry = new THREE.ExtrudeGeometry(mShape, {
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.03,
    bevelSegments: 4,
  })
  const mMesh = new THREE.Mesh(mGeometry, material)
  mMesh.position.x = 1.0
  mMesh.position.z = -0.25
  logoGroup.add(mMesh)

  // Center the group
  logoGroup.rotation.x = 0.1

  // Intro animation
  gsap.from(logoGroup.scale, { x: 0, y: 0, z: 0, duration: 2.5, ease: 'elastic.out(1, 0.4)', delay: 0.3 })
  gsap.from(logoGroup.rotation, { y: Math.PI * 2, duration: 3, ease: 'expo.out', delay: 0.2 })

  animate()
}

function animate() {
  if (!renderer || !scene || !camera || !logoGroup) return

  const time = performance.now() * 0.001

  // Gentle continuous rotation
  logoGroup.rotation.y = Math.sin(time * 0.3) * 0.3
  logoGroup.rotation.x = 0.1 + Math.sin(time * 0.2) * 0.1

  // Mouse influence — logo follows cursor
  logoGroup.rotation.y += (mouse.x * 0.4 - logoGroup.rotation.y) * 0.03
  logoGroup.rotation.x += (-mouse.y * 0.2 - logoGroup.rotation.x) * 0.03

  // Subtle float
  logoGroup.position.y = Math.sin(time * 0.8) * 0.15

  renderer.render(scene, camera)
  animId = requestAnimationFrame(animate)
}
</script>

<template>
  <section
    id="hero"
    ref="sectionRef"
    class="relative w-full h-[200vh] overflow-visible"
    data-theme="cream"
  >
    <!-- Sticky viewport -->
    <div class="sticky top-0 h-screen overflow-hidden">
      <!-- Clip-path inset frame -->
      <div
        ref="frameRef"
        class="absolute inset-0 z-[1] overflow-hidden will-change-[clip-path]"
        style="--hero-inset: clamp(8px, calc(2.5vw - 8px), 16px); clip-path: inset(var(--hero-inset) round 18px);"
      >
        <!-- Vibrant gradient background (like guillaumezhu.com) -->
        <div
          class="absolute inset-0"
          style="background: linear-gradient(135deg, #ff6b4a 0%, #ff4444 25%, #e84393 50%, #9b7cff 75%, #6c5ce7 100%);"
        />

        <!-- MASSIVE name text filling viewport (behind canvas) -->
        <div class="absolute inset-0 flex items-center justify-center z-[1]">
          <h2
            class="font-display font-bold text-cream/90 leading-[0.85] tracking-display text-center select-none pointer-events-none"
            style="font-size: clamp(60px, 18vw, 260px);"
          >
            <span class="block">ameen</span>
            <span class="block">mohamed</span>
          </h2>
        </div>

        <!-- 3D Canvas on top of text (transparent bg so gradient + text shows through) -->
        <canvas ref="canvasRef" class="absolute inset-0 w-full h-full z-[2]" />
      </div>

      <!-- Identity overlay: bottom-right (like guillaumezhu.com) -->
      <div
        ref="nameRef"
        class="absolute inset-0 z-[3] pointer-events-none will-change-transform"
      >
        <div class="absolute bottom-[clamp(32px,4vw,64px)] end-[clamp(32px,4vw,64px)] text-cream text-end">
          <div class="flex flex-col gap-[6px] font-display text-[clamp(13px,1.1vw,20px)] font-light leading-none opacity-80">
            <span class="block">Front-End Engineer</span>
            <span class="block opacity-60">Vue.js · Nuxt.js</span>
          </div>
        </div>

        <!-- Scroll hint -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span class="font-body text-[11px] tracking-[0.2em] uppercase text-cream">Scroll</span>
          <div class="w-[1px] h-8 bg-cream/50 animate-pulse" />
        </div>
      </div>
    </div>
  </section>
</template>
