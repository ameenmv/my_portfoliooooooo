<script setup lang="ts">
/**
 * ToolkitSection — Rotating card wheel over 600vh.
 * Mirrors guillaumezhu.com: cards arranged in a circle, wheel rotates as user scrolls.
 * Two decks: Frontend → Backend (with flip transition between).
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
const sectionRef = ref<HTMLElement>()
const wheelRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const activeSubtitle = ref(t('home.toolkitFrontend'))

const frontendTools = [
  'Vue.js', 'Nuxt.js', 'TypeScript', 'Pinia',
  'GSAP', 'Three.js', 'Tailwind CSS', 'Vite',
]

const backendTools = [
  'Node.js', 'NestJS', 'MongoDB', 'Socket.IO',
  'RESTful APIs', 'Laravel', 'SQLite', 'Git',
]

const allTools = computed(() => [...frontendTools, ...backendTools])

onMounted(() => {
  if (!sectionRef.value || !wheelRef.value) return

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const cards = wheelRef.value!.querySelectorAll('.toolkit-card')
    const totalCards = cards.length
    const angleStep = 360 / totalCards

    // Position cards in a circle
    cards.forEach((card, i) => {
      const angle = i * angleStep
      gsap.set(card, {
        rotation: angle,
        transformOrigin: '50% 350px',
      })
    })

    // Rotate wheel on scroll
    gsap.to(wheelRef.value!, {
      rotation: -360,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: sectionRef.value!.querySelector('.toolkit-container'),
        onUpdate: (self) => {
          // Switch subtitle at midpoint
          if (self.progress > 0.5) {
            activeSubtitle.value = t('home.toolkitBackend')
          } else {
            activeSubtitle.value = t('home.toolkitFrontend')
          }
        },
      },
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section id="toolkit" ref="sectionRef" class="relative w-full bg-dark text-cream">
    <div class="h-[600vh]">
      <div class="toolkit-container relative z-[1] bg-dark h-screen overflow-hidden">
        <!-- Header -->
        <div class="absolute z-[2] w-full text-center pointer-events-none top-[18vh] lg:top-[12vh]">
          <h2 class="font-display text-[max(48px,6vw)] font-bold tracking-display">
            Toolkit
          </h2>
          <div class="relative h-[3.2em] mt-[2vh] overflow-hidden">
            <p
              ref="subtitleRef"
              class="font-display text-[max(20px,2vw)] font-light text-center absolute inset-0 transition-opacity duration-500"
            >
              {{ activeSubtitle }}
            </p>
          </div>
        </div>

        <!-- Rotating wheel -->
        <div
          ref="wheelRef"
          class="absolute aspect-square w-[300%] -left-[100%] top-[58vh] lg:top-[51vh] will-change-transform"
        >
          <div
            v-for="(tool, i) in allTools"
            :key="tool"
            class="toolkit-card absolute inset-0 flex items-start justify-center pointer-events-none"
          >
            <div
              class="w-[clamp(140px,18vw,295px)] aspect-[295/417] bg-dark/50 border border-cream/10 rounded-card flex items-center justify-center cursor-default will-change-transform -translate-y-1/2 transition-transform duration-200 hover:-translate-y-[54%] hover:scale-[1.04]"
            >
              <span class="font-body text-[clamp(14px,1.4vw,22px)] font-medium text-cream/90 text-center px-4">
                {{ tool }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
