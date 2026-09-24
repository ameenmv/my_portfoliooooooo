<script setup lang="ts">
/**
 * HeroSection — Full viewport Three.js 3D canvas with identity overlay.
 * Mirrors guillaumezhu.com hero: canvas fills screen, name at bottom-right.
 * The h1 is visually-hidden for SEO.
 */
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'

const { t } = useI18n()
const canvasRef = ref<HTMLCanvasElement>()
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let particles: THREE.Points | null = null
let animId: number = 0
let mouse = { x: 0, y: 0 }

onMounted(() => {
  if (!canvasRef.value) return
  initScene()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  renderer?.dispose()
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

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setClearColor(0x1f1d1d, 1)

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 5

  // Particle field — floating geometric particles
  const count = 2000
  const positions = new Float32Array(count * 3)
  const scales = new Float32Array(count)
  const speeds = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8
    scales[i] = Math.random() * 0.5 + 0.5
    speeds[i] = Math.random() * 0.3 + 0.1
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

  const material = new THREE.PointsMaterial({
    color: 0xf5e7df,
    size: 0.02,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)

  // Central glowing orb
  const orbGeometry = new THREE.SphereGeometry(0.4, 32, 32)
  const orbMaterial = new THREE.MeshBasicMaterial({
    color: 0xff6b4a,
    transparent: true,
    opacity: 0.15,
  })
  const orb = new THREE.Mesh(orbGeometry, orbMaterial)
  scene.add(orb)

  // Wireframe ring
  const ringGeometry = new THREE.TorusGeometry(1.2, 0.005, 16, 100)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xf5e7df,
    transparent: true,
    opacity: 0.3,
  })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  ring.rotation.x = Math.PI * 0.5
  scene.add(ring)

  // Second ring
  const ring2 = ring.clone()
  ring2.rotation.x = Math.PI * 0.3
  ring2.rotation.y = Math.PI * 0.2
  ring2.scale.setScalar(0.8)
  scene.add(ring2)

  // Intro animation
  gsap.from(camera.position, { z: 12, duration: 2.5, ease: 'expo.out' })
  gsap.from(orbMaterial, { opacity: 0, duration: 2, delay: 0.5, ease: 'power2.out' })

  animate(orb, ring, ring2)
}

function animate(orb: THREE.Mesh, ring: THREE.Mesh, ring2: THREE.Mesh) {
  if (!renderer || !scene || !camera || !particles) return

  const time = performance.now() * 0.001
  const positions = particles.geometry.attributes.position.array as Float32Array

  // Gentle particle drift
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += Math.sin(time + i) * 0.0003
    positions[i] += Math.cos(time * 0.5 + i) * 0.0002
  }
  particles.geometry.attributes.position.needsUpdate = true

  // Rotate rings
  ring.rotation.z = time * 0.15
  ring2.rotation.z = -time * 0.1
  ring2.rotation.x = Math.PI * 0.3 + Math.sin(time * 0.3) * 0.1

  // Orb pulses
  const pulse = 1 + Math.sin(time * 2) * 0.05
  orb.scale.setScalar(pulse)

  // Mouse influence on camera
  camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.05
  camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.05
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
  animId = requestAnimationFrame(() => animate(orb, ring, ring2))
}
</script>

<template>
  <section id="hero" class="relative w-full h-screen overflow-hidden bg-dark">
    <!-- 3D Canvas -->
    <div
      class="absolute inset-0 z-[1] overflow-hidden rounded-[18px] will-change-transform"
      :style="{ clipPath: `inset(clamp(8px, calc(2.5vw - 8px), 16px) round 18px)` }"
    >
      <canvas ref="canvasRef" class="block w-full h-full" />
    </div>

    <!-- SEO title (hidden) -->
    <h1 class="sr-only">Ameen Mohamed — Front-End Engineer</h1>

    <!-- Identity overlay -->
    <div class="relative z-[2] h-full pointer-events-none">
      <div class="absolute bottom-[clamp(24px,3vw,48px)] end-[clamp(24px,3vw,48px)] text-cream text-end">
        <h2 class="font-display text-[clamp(28px,3.25vw,64px)] font-semibold leading-[0.9] tracking-tight m-0">
          Ameen<br>Mohamed
        </h2>
        <div class="flex flex-col gap-[10px] mt-5 font-display text-[clamp(14px,1.25vw,22px)] font-light leading-none">
          <span class="block">Front-End Engineer</span>
          <span class="block opacity-60">Vue.js · Nuxt.js</span>
        </div>
      </div>
    </div>
  </section>
</template>
