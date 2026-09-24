<script setup lang="ts">
/**
 * Playground — 3D sphere of experiment cards.
 * Mirrors guillaumezhu.com/playground/:
 * - Three.js sphere with experiment items as points
 * - Click/hover reveals experiment info
 * - Sphere rotates slowly, speeds up on drag
 */
import * as THREE from 'three'
import { gsap } from 'gsap'

const { t } = useI18n()
const theme = useTheme()
const canvasRef = ref<HTMLCanvasElement>()
const activeIndex = ref<number | null>(null)
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let sphereGroup: THREE.Group | null = null
let animId: number = 0
let isDragging = false
let dragStart = { x: 0, y: 0 }
let rotationSpeed = { x: 0.002, y: 0.003 }

useHead({
  title: () => t('playground.title'),
  meta: [
    { name: 'description', content: () => t('playground.description') },
  ],
})

onMounted(() => {
  theme.setTheme('dark')
  if (!canvasRef.value) return
  initScene()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  renderer?.dispose()
  window.removeEventListener('resize', onResize)
})

const experiments = [
  { title: 'V8 JIT Pipeline', cat: 'YouTube', color: 0xff6b4a },
  { title: 'Sa5er CLI', cat: 'npm', color: 0x9b7cff },
  { title: 'Athar MCP', cat: 'npm', color: 0xf6c177 },
  { title: 'Shader Noise', cat: 'WebGL', color: 0xff6b4a },
  { title: 'Browser Rendering', cat: 'YouTube', color: 0x9b7cff },
  { title: 'Multiplayer', cat: 'Socket.IO', color: 0xf6c177 },
  { title: 'EEG Viz', cat: 'BCI', color: 0xff6b4a },
  { title: 'GSAP Scroll', cat: 'Study', color: 0x9b7cff },
  { title: 'Tech Gates VI', cat: 'Community', color: 0xf6c177 },
  { title: 'Pinia Stores', cat: 'Vue.js', color: 0xff6b4a },
  { title: 'WebSocket', cat: 'Real-time', color: 0x9b7cff },
  { title: 'i18n RTL', cat: 'Study', color: 0xf6c177 },
]

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
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 6

  sphereGroup = new THREE.Group()
  scene.add(sphereGroup)

  // Distribute experiments on a sphere
  const radius = 2.2
  experiments.forEach((exp, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / experiments.length)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i // Golden angle

    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)

    // Point
    const dotGeo = new THREE.SphereGeometry(0.06, 12, 12)
    const dotMat = new THREE.MeshBasicMaterial({ color: exp.color, transparent: true, opacity: 0.9 })
    const dot = new THREE.Mesh(dotGeo, dotMat)
    dot.position.set(x, y, z)
    dot.userData = { index: i }
    sphereGroup.add(dot)

    // Connecting line to center
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(x, y, z),
    ])
    const line = new THREE.Line(
      lineGeo,
      new THREE.LineBasicMaterial({ color: exp.color, transparent: true, opacity: 0.08 })
    )
    sphereGroup.add(line)
  })

  // Wireframe sphere outline
  const wireGeo = new THREE.SphereGeometry(radius, 24, 16)
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xf5e7df, wireframe: true, transparent: true, opacity: 0.04 })
  const wireMesh = new THREE.Mesh(wireGeo, wireMat)
  sphereGroup.add(wireMesh)

  // Mouse drag
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true
    dragStart = { x: e.clientX, y: e.clientY }
  })
  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    rotationSpeed.y = dx * 0.0001
    rotationSpeed.x = dy * 0.0001
    dragStart = { x: e.clientX, y: e.clientY }
  })
  canvas.addEventListener('mouseup', () => { isDragging = false })

  animate()
}

function animate() {
  if (!renderer || !scene || !camera || !sphereGroup) return

  sphereGroup.rotation.x += rotationSpeed.x
  sphereGroup.rotation.y += rotationSpeed.y

  // Dampen rotation
  if (!isDragging) {
    rotationSpeed.x += (0.002 - rotationSpeed.x) * 0.02
    rotationSpeed.y += (0.003 - rotationSpeed.y) * 0.02
  }

  renderer.render(scene, camera)
  animId = requestAnimationFrame(animate)
}
</script>

<template>
  <main class="bg-dark text-cream min-h-screen relative overflow-hidden">
    <h1 class="sr-only">{{ t('playground.heading') }}</h1>

    <!-- 3D Canvas -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full z-[1] cursor-grab active:cursor-grabbing" />

    <!-- Title overlay -->
    <div class="absolute inset-0 z-[2] pointer-events-none flex flex-col items-center justify-between py-[120px]">
      <h2 class="font-display text-[clamp(32px,5vw,64px)] font-bold tracking-display text-center opacity-80">
        Playground
      </h2>

      <!-- Bottom: experiment list overlay -->
      <div class="pointer-events-auto w-full max-w-[600px] px-6">
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div
            v-for="(exp, i) in experiments"
            :key="i"
            class="group flex items-center gap-2 px-3 py-2 rounded-lg cursor-default transition-all duration-200 hover:bg-cream/5"
            @mouseenter="activeIndex = i"
            @mouseleave="activeIndex = null"
          >
            <span
              class="w-2 h-2 rounded-full shrink-0"
              :style="{ backgroundColor: `#${exp.color.toString(16).padStart(6, '0')}` }"
            />
            <span class="font-body text-[12px] font-medium truncate opacity-60 group-hover:opacity-100 transition-opacity">
              {{ exp.title }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
