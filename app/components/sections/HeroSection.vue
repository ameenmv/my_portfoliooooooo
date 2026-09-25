<script setup lang="ts">
/**
 * HeroSection — Exact match of guillaumezhu.com hero.
 *
 * FROM SCREENSHOTS + JS SOURCE ANALYSIS:
 * 1. Section: bg-cream, height = 100vh + 3500px scroll range
 * 2. Sticky inner viewport: h-screen, stays fixed during scroll
 * 3. Frame: clip-path inset with 18px radius, scales down at end
 * 4. Gradient: rendered in WebGL (orange→red→pink→purple)
 * 5. 3D logo: flowing "AM" monogram (torus knot style), centered
 * 6. Name text: "ameen mohamed" CENTERED, ~18vw, white/cream
 * 7. Logo overlaps/intersects with text
 * 8. Scroll drives: logo rotation (full 360°), logo zoom, frame scale
 * 9. Identity (small name+role) at bottom-right, fades out early
 */
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const canvasRef = ref<HTMLCanvasElement>()
const sectionRef = ref<HTMLElement>()
const frameRef = ref<HTMLElement>()
const nameRef = ref<HTMLElement>()
const heroTitleRef = ref<HTMLElement>()
const roleTextRef = ref<HTMLElement>()
const roleText2Ref = ref<HTMLElement>()
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let logoGroup: THREE.Group | null = null
let animId: number = 0
let ctx: gsap.Context | null = null
const mouse = { x: 0, y: 0 }
let scrollProgress = 0

// Source: jn() = 3500 desktop, 2800 mobile
function getPinDistance() {
  if (typeof window === 'undefined') return 3500
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches ? 2800 : 3500
}

onMounted(() => {
  if (!canvasRef.value || !sectionRef.value) return
  gsap.registerPlugin(ScrollTrigger)

  initScene()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)

  ctx = gsap.context(() => {
    // Track scroll progress — CSS sticky handles the "pinning"
    ScrollTrigger.create({
      trigger: sectionRef.value!,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress = self.progress
      },
    })

    // Frame scales down near end
    gsap.to(frameRef.value!, {
      scaleX: 0.94,
      scaleY: 0.9,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: '80% top',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })

    // Identity fades out early
    if (nameRef.value) {
      gsap.to(nameRef.value, {
        autoAlpha: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top+=3% top',
          end: 'top+=7.5% top',
          scrub: true,
        },
      })
    }

    // Name text moves down and fades out
    if (heroTitleRef.value) {
      gsap.to(heroTitleRef.value, {
        yPercent: 60,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top+=15% top',
          end: 'top+=35% top',
          scrub: true,
        },
      })
    }

    // Role text 1 — top-right (like "creative developer")
    if (roleTextRef.value) {
      gsap.fromTo(roleTextRef.value,
        { yPercent: 60, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value!,
            start: 'top+=25% top',
            end: 'top+=45% top',
            scrub: true,
          },
        }
      )
    }

    // Role text 2 — bottom-left (like "art director")
    if (roleText2Ref.value) {
      gsap.fromTo(roleText2Ref.value,
        { yPercent: -60, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value!,
            start: 'top+=30% top',
            end: 'top+=50% top',
            scrub: true,
          },
        }
      )
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

  // Gradient background — matches guillaumezhu.com exactly
  const gradCanvas = document.createElement('canvas')
  gradCanvas.width = 2048
  gradCanvas.height = 2048
  const gctx = gradCanvas.getContext('2d')!
  // Diagonal gradient from top-left to bottom-right
  const gradient = gctx.createLinearGradient(0, 0, 2048, 2048)
  gradient.addColorStop(0, '#ff6b4a')     // orange
  gradient.addColorStop(0.3, '#ff4444')    // red
  gradient.addColorStop(0.5, '#e84393')    // pink
  gradient.addColorStop(0.75, '#9b7cff')   // purple
  gradient.addColorStop(1, '#6c5ce7')      // deep purple
  gctx.fillStyle = gradient
  gctx.fillRect(0, 0, 2048, 2048)
  scene.background = new THREE.CanvasTexture(gradCanvas)

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 8

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.5))
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
  dirLight.position.set(3, 5, 4)
  scene.add(dirLight)
  const purpleLight = new THREE.DirectionalLight(0x9b7cff, 0.6)
  purpleLight.position.set(-3, -2, -4)
  scene.add(purpleLight)
  const orangeLight = new THREE.PointLight(0xff6b4a, 0.5, 20)
  orangeLight.position.set(2, 0, 3)
  scene.add(orangeLight)

  logoGroup = new THREE.Group()
  scene.add(logoGroup)

  // Flowing "AM" monogram — using TorusKnot + custom shapes for organic feel
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xf5e7df,
    metalness: 0.25,
    roughness: 0.2,
    clearcoat: 0.3,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.88,
    envMapIntensity: 1.2,
  })

  // Main flowing shape — smaller, like GZ logo proportions
  const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.7, 0.18, 128, 32, 2, 3),
    mat
  )
  logoGroup.add(torusKnot)

  // Accent ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.04, 16, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.1,
      transparent: true,
      opacity: 0.3,
    })
  )
  ring.rotation.x = Math.PI / 4
  logoGroup.add(ring)

  logoGroup.rotation.x = 0.3

  // Intro animation
  gsap.from(logoGroup.scale, {
    x: 0, y: 0, z: 0,
    duration: 2.5,
    ease: 'elastic.out(1, 0.4)',
    delay: 0.3,
  })
  gsap.from(logoGroup.rotation, {
    y: Math.PI * 2,
    duration: 3,
    ease: 'expo.out',
    delay: 0.2,
  })

  animate()
}

function animate() {
  if (!renderer || !scene || !camera || !logoGroup) return
  const t = performance.now() * 0.001

  // Scroll-driven rotation (full 360° over scroll range)
  const scrollRotY = scrollProgress * Math.PI * 2
  const scrollRotX = Math.sin(scrollProgress * Math.PI) * 0.5

  // Combine idle drift + scroll + mouse
  logoGroup.rotation.y = scrollRotY + Math.sin(t * 0.3) * 0.1
  logoGroup.rotation.x = scrollRotX + 0.3 + Math.sin(t * 0.2) * 0.05
  logoGroup.rotation.y += (mouse.x * 0.3) * 0.02
  logoGroup.rotation.x += (-mouse.y * 0.15) * 0.02

  // Float
  logoGroup.position.y = Math.sin(t * 0.8) * 0.12

  // Zoom in slightly with scroll
  const scale = 1 + scrollProgress * 0.2
  logoGroup.scale.setScalar(scale)

  renderer.render(scene, camera)
  animId = requestAnimationFrame(animate)
}
</script>

<template>
  <!-- Tall wrapper: 100vh + scroll range. bg-cream shows around clip-path frame -->
  <section
    id="hero"
    ref="sectionRef"
    class="relative w-full bg-cream z-[10]"
    :style="{ height: `calc(100vh + ${getPinDistance()}px)` }"
    data-theme="cream"
  >
    <!-- Sticky viewport — stays fixed during scroll -->
    <div class="sticky top-0 h-screen overflow-hidden">
      <!-- Clip-path frame (source: clip-path: inset(var(--hero-frame-inset) round 18px)) -->
      <div
        ref="frameRef"
        class="absolute inset-0 z-[1] overflow-hidden will-change-[clip-path,transform]"
        style="--hero-inset: clamp(8px, calc(2.5vw - 8px), 16px); clip-path: inset(var(--hero-inset) round 18px); transform-origin: top;"
      >
        <!-- 3D Canvas -->
        <canvas ref="canvasRef" class="block w-full h-full" />

        <!-- MASSIVE name text — BOTTOM-LEFT like guillaumezhu.com -->
        <div
          ref="heroTitleRef"
          class="absolute inset-0 flex items-end justify-start z-[1] pointer-events-none will-change-transform"
          style="padding: clamp(24px, 4vw, 64px);"
        >
          <h2
            class="font-display font-bold text-cream/60 leading-[0.85] tracking-display select-none"
            style="font-size: clamp(60px, 18vw, 260px);"
          >
            <span class="block">ameen</span>
            <span class="block">mohamed</span>
          </h2>
        </div>

        <!-- Role text 1 — TOP-RIGHT (like "creative developer") -->
        <div
          ref="roleTextRef"
          class="absolute z-[1] pointer-events-none will-change-transform opacity-0"
          style="top: clamp(60px, 10vh, 120px); right: clamp(40px, 6vw, 100px);"
        >
          <h2
            class="font-display font-bold text-cream leading-[0.9] tracking-display text-end select-none"
            style="font-size: clamp(40px, 10vw, 160px);"
          >
            <span class="block">front-end</span>
            <span class="block">developer</span>
          </h2>
        </div>

        <!-- Role text 2 — BOTTOM-LEFT (like "art director") -->
        <div
          ref="roleText2Ref"
          class="absolute z-[1] pointer-events-none will-change-transform opacity-0"
          style="bottom: clamp(60px, 12vh, 160px); left: clamp(40px, 6vw, 100px);"
        >
          <h2
            class="font-display font-bold text-cream leading-[0.9] tracking-display select-none"
            style="font-size: clamp(32px, 8vw, 120px);"
          >
            <span class="block">vue.js</span>
            <span class="block">specialist</span>
          </h2>
        </div>
      </div>

      <!-- SEO title -->
      <h1 class="sr-only">Ameen Mohamed — Front-End Engineer · Vue.js &amp; Nuxt.js</h1>

      <!-- Identity at bottom-right (fades out at 3-7.5% scroll) -->
      <div
        ref="nameRef"
        class="absolute inset-0 z-[2] pointer-events-none"
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
    </div>
  </section>
</template>
