<script setup lang="ts">
/**
 * HeroSection — Exact match of guillaumezhu.com hero.
 *
 * Key behaviors from source analysis:
 * 1. hero-three: bg-cream, width:100%, height:100vh, position:relative, overflow:hidden
 * 2. hero-three__frame: clip-path inset with 18px radius, will-change transform
 * 3. Canvas fills the frame — gradient background rendered in WebGL
 * 4. 3D logo: custom "AM" monogram, centered, rotates/zooms with scroll
 * 5. Name text: "ameen mohamed" CENTERED, huge size (~18vw)
 * 6. On scroll: name fades/slides down, role texts ("front-end developer", "vue.js specialist") fade in
 * 7. Identity (small name+role) at bottom-right, fades out early
 * 8. Frame scales down near end of scroll range
 * 9. Uses ScrollTrigger pin for sticky behavior (NOT CSS sticky)
 * 10. Section height includes pin distance for scroll range
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

// Source: pinDistance = 3500 desktop, 2800 mobile
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
    const pinDist = getPinDistance()

    // Main ScrollTrigger — pins the section and tracks scroll progress
    ScrollTrigger.create({
      trigger: sectionRef.value!,
      start: 'top top',
      end: `+=${pinDist}`,
      pin: true,
      onUpdate: (self) => {
        scrollProgress = self.progress
      },
    })


    // Frame scales down near end (last 20% of pin distance)
    gsap.to(frameRef.value!, {
      scaleX: 0.94,
      scaleY: 0.9,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: `top+=${pinDist * 0.8} top`,
        end: `top+=${pinDist} top`,
        scrub: true,
      },
    })


    // Identity fades out early (3-7.5% of scroll)
    if (nameRef.value) {
      gsap.to(nameRef.value, {
        autoAlpha: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top top',
          end: `+=${pinDist * 0.075}`,
          scrub: true,
        },
      })
    }

    // Name text moves down and fades out (15-35% of scroll)
    if (heroTitleRef.value) {
      gsap.to(heroTitleRef.value, {
        yPercent: 60,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: `top+=${pinDist * 0.15} top`,
          end: `top+=${pinDist * 0.35} top`,
          scrub: true,
        },
      })
    }

    // Role text 1 — top-right ("front-end developer") fades in (25-45%)
    if (roleTextRef.value) {
      gsap.fromTo(roleTextRef.value,
        { yPercent: 60, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value!,
            start: `top+=${pinDist * 0.25} top`,
            end: `top+=${pinDist * 0.45} top`,
            scrub: true,
          },
        }
      )
    }

    // Role text 2 — bottom-left ("vue.js specialist") fades in (30-50%)
    if (roleText2Ref.value) {
      gsap.fromTo(roleText2Ref.value,
        { yPercent: -60, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value!,
            start: `top+=${pinDist * 0.30} top`,
            end: `top+=${pinDist * 0.50} top`,
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

/**
 * Build the 3D "AM" monogram from extruded shapes.
 * Inspired by guillaumezhu.com's custom GZ logo — uses flowing,
 * organic curves for a premium 3D feel.
 */
function createAMMonogram(): THREE.Group {
  const group = new THREE.Group()

  // Material — glossy, semi-transparent, cream-tinted like the GZ logo
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xf5e7df,
    metalness: 0.3,
    roughness: 0.15,
    clearcoat: 0.5,
    clearcoatRoughness: 0.05,
    transparent: true,
    opacity: 0.92,
    envMapIntensity: 1.5,
    side: THREE.DoubleSide,
  })

  // Accent material — for the decorative ring
  const accentMat = new THREE.MeshPhysicalMaterial({
    color: 0xff6b4a,
    metalness: 0.4,
    roughness: 0.2,
    transparent: true,
    opacity: 0.7,
    clearcoat: 0.3,
  })

  // Build "A" as a 3D extruded shape
  const aShape = new THREE.Shape()
  // Stylized "A" with flowing curves
  aShape.moveTo(-0.8, -1.2)
  aShape.lineTo(-0.15, 1.2)
  aShape.bezierCurveTo(-0.1, 1.35, 0.1, 1.35, 0.15, 1.2)
  aShape.lineTo(0.8, -1.2)
  aShape.lineTo(0.55, -1.2)
  aShape.lineTo(0.35, -0.5)
  aShape.lineTo(-0.35, -0.5)
  aShape.lineTo(-0.55, -1.2)
  aShape.closePath()

  // A crossbar hole
  const aHole = new THREE.Path()
  aHole.moveTo(-0.2, -0.25)
  aHole.lineTo(0, 0.55)
  aHole.lineTo(0.2, -0.25)
  aHole.closePath()
  aShape.holes.push(aHole)

  const extrudeSettings = {
    depth: 0.35,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.04,
    bevelOffset: 0,
    bevelSegments: 8,
    curveSegments: 24,
  }

  const aGeo = new THREE.ExtrudeGeometry(aShape, extrudeSettings)
  aGeo.center()
  const aMesh = new THREE.Mesh(aGeo, mat)
  aMesh.position.x = -0.65

  // Build "M" as a 3D extruded shape
  const mShape = new THREE.Shape()
  // Stylized flowing "M"
  mShape.moveTo(-0.85, -1.2)
  mShape.lineTo(-0.85, 1.2)
  mShape.lineTo(-0.6, 1.2)
  mShape.bezierCurveTo(-0.4, 0.6, -0.1, -0.2, 0, -0.4)
  mShape.bezierCurveTo(0.1, -0.2, 0.4, 0.6, 0.6, 1.2)
  mShape.lineTo(0.85, 1.2)
  mShape.lineTo(0.85, -1.2)
  mShape.lineTo(0.6, -1.2)
  mShape.lineTo(0.6, 0.5)
  mShape.bezierCurveTo(0.4, 0.0, 0.2, -0.6, 0, -0.9)
  mShape.bezierCurveTo(-0.2, -0.6, -0.4, 0.0, -0.6, 0.5)
  mShape.lineTo(-0.6, -1.2)
  mShape.closePath()

  const mGeo = new THREE.ExtrudeGeometry(mShape, extrudeSettings)
  mGeo.center()
  const mMesh = new THREE.Mesh(mGeo, mat)
  mMesh.position.x = 0.75

  group.add(aMesh)
  group.add(mMesh)

  // Decorative flowing curve that connects A and M — like the GZ logo's organic flow
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(-0.8, 0.8, 0.2),
    new THREE.Vector3(-0.2, -0.6, 0.4),
    new THREE.Vector3(0.5, 0.9, -0.3),
    new THREE.Vector3(1.0, -0.5, 0.15)
  )
  const curveGeo = new THREE.TubeGeometry(curve, 48, 0.045, 12, false)
  const curveMesh = new THREE.Mesh(curveGeo, accentMat)
  group.add(curveMesh)

  // Second accent curve
  const curve2 = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0.9, 1.0, -0.1),
    new THREE.Vector3(0.3, 0.2, 0.5),
    new THREE.Vector3(-0.4, -0.3, -0.4),
    new THREE.Vector3(-0.9, 0.3, 0.2)
  )
  const curve2Geo = new THREE.TubeGeometry(curve2, 48, 0.035, 12, false)
  const curve2Mesh = new THREE.Mesh(curve2Geo, accentMat.clone())
  ;(curve2Mesh.material as THREE.MeshPhysicalMaterial).color.set(0x9b7cff)
  group.add(curve2Mesh)

  // Accent ring orbiting the monogram
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.025, 16, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.1,
      transparent: true,
      opacity: 0.25,
    })
  )
  ring.rotation.x = Math.PI / 3.5
  ring.rotation.z = Math.PI / 6
  group.add(ring)

  return group
}

function initScene() {
  const canvas = canvasRef.value!

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  scene = new THREE.Scene()

  // Gradient background — matches guillaumezhu.com exactly
  // (diagonal gradient: orange → red → pink → purple)
  const gradCanvas = document.createElement('canvas')
  gradCanvas.width = 2048
  gradCanvas.height = 2048
  const gctx = gradCanvas.getContext('2d')!
  const gradient = gctx.createLinearGradient(0, 0, 2048, 2048)
  gradient.addColorStop(0, '#ff6b4a')     // orange
  gradient.addColorStop(0.25, '#ff4444')   // red
  gradient.addColorStop(0.45, '#e84393')   // hot pink
  gradient.addColorStop(0.65, '#c56cf0')   // light purple
  gradient.addColorStop(0.85, '#9b7cff')   // purple
  gradient.addColorStop(1, '#6c5ce7')      // deep purple
  gctx.fillStyle = gradient
  gctx.fillRect(0, 0, 2048, 2048)
  const bgTexture = new THREE.CanvasTexture(gradCanvas)
  scene.background = bgTexture

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 7

  // Lighting — match the vibrant, colorful style
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
  dirLight.position.set(3, 5, 4)
  scene.add(dirLight)

  const purpleLight = new THREE.DirectionalLight(0x9b7cff, 0.8)
  purpleLight.position.set(-4, -2, -3)
  scene.add(purpleLight)

  const orangeLight = new THREE.PointLight(0xff6b4a, 0.6, 20)
  orangeLight.position.set(2, 1, 3)
  scene.add(orangeLight)

  const pinkLight = new THREE.PointLight(0xe84393, 0.4, 15)
  pinkLight.position.set(-3, -1, 2)
  scene.add(pinkLight)

  // Environment map for reflections
  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  const envScene = new THREE.Scene()
  envScene.background = bgTexture
  const envMap = pmremGenerator.fromScene(envScene).texture
  scene.environment = envMap
  pmremGenerator.dispose()

  // Create 3D AM monogram
  logoGroup = createAMMonogram()
  scene.add(logoGroup)

  logoGroup.rotation.x = 0.3

  // Intro animation — elastic bounce-in like the GZ logo
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

  // Scroll-driven rotation (full 360° over scroll range) — exact GZ behavior
  const scrollRotY = scrollProgress * Math.PI * 2
  const scrollRotX = Math.sin(scrollProgress * Math.PI) * 0.5

  // Combine idle drift + scroll + mouse parallax
  logoGroup.rotation.y = scrollRotY + Math.sin(t * 0.3) * 0.08
  logoGroup.rotation.x = scrollRotX + 0.3 + Math.sin(t * 0.2) * 0.04
  // Mouse influence
  logoGroup.rotation.y += mouse.x * 0.08
  logoGroup.rotation.x += -mouse.y * 0.04

  // Float
  logoGroup.position.y = Math.sin(t * 0.8) * 0.1

  // Zoom in slightly with scroll — the GZ logo gets closer
  const scale = 1 + scrollProgress * 0.35
  logoGroup.scale.setScalar(scale)

  renderer.render(scene, camera)
  animId = requestAnimationFrame(animate)
}
</script>

<template>
  <!-- 
    Source: .hero-three { height: 100vh; position: relative; overflow: hidden; }
    The pinDistance is handled by ScrollTrigger pin, not by making the section tall.
  -->
  <section
    id="hero"
    ref="sectionRef"
    class="relative w-full bg-cream z-[10] overflow-hidden"
    style="height: 100vh;"
    data-theme="cream"
  >
    <!-- Frame: clip-path inset with rounded corners (source: .hero-three__frame) -->
    <div
      ref="frameRef"
      class="absolute inset-0 z-[1] overflow-hidden will-change-transform"
      style="--hero-inset: clamp(8px, calc(2.5vw - 8px), 16px); clip-path: inset(var(--hero-inset) round 18px); transform-origin: top;"
    >
      <!-- 3D Canvas (source: .webgl { width:100%; height:100%; display:block }) -->
      <canvas ref="canvasRef" class="block w-full h-full" />

      <!-- MASSIVE name text — CENTERED, huge, like "guillaume zhu" -->
      <div
        ref="heroTitleRef"
        class="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none will-change-transform"
      >
        <h2
          class="font-display font-bold text-cream/50 leading-[0.85] tracking-display select-none text-center"
          style="font-size: clamp(60px, 18vw, 280px);"
        >
          <span class="block">ameen</span>
          <span class="block">mohamed</span>
        </h2>
      </div>

      <!-- Role text 1 — TOP-RIGHT (like "creative developer") -->
      <div
        ref="roleTextRef"
        class="absolute z-[2] pointer-events-none will-change-transform opacity-0"
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
        class="absolute z-[2] pointer-events-none will-change-transform opacity-0"
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

    <!-- Identity at bottom-right (fades out at 3-7.5% scroll) — source: .hero-content__identity -->
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
  </section>
</template>
