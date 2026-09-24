<script setup lang="ts">
/**
 * ToolkitSection — Rotating card wheel + 3D flip between decks.
 * Exact replica of guillaumezhu.com:
 * - Cards arranged in a circle (300% width container)
 * - Wheel rotates as scroll progresses
 * - Two decks with flip card transition between them
 * - Subtitle animates between "Frontend Development" ↔ "Backend & Tools"
 * - Background changes cream → dark during flip
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
const sectionRef = ref<HTMLElement>()
const wheelRef = ref<HTMLElement>()
const flipCardRef = ref<HTMLElement>()
const bgRevealRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const currentDeck = ref<'frontend' | 'backend'>('frontend')
const subtitleText = computed(() =>
  currentDeck.value === 'frontend'
    ? t('home.toolkitFrontend')
    : t('home.toolkitBackend')
)

const frontendTools = [
  { name: 'Vue.js', icon: '⚡' },
  { name: 'Nuxt.js', icon: '🟢' },
  { name: 'TypeScript', icon: '🔷' },
  { name: 'Pinia', icon: '🍍' },
  { name: 'GSAP', icon: '🎬' },
  { name: 'Three.js', icon: '🔺' },
  { name: 'Tailwind', icon: '🌊' },
  { name: 'Vite', icon: '⚡' },
]

const backendTools = [
  { name: 'Node.js', icon: '🟩' },
  { name: 'NestJS', icon: '🐱' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'Socket.IO', icon: '🔌' },
  { name: 'REST APIs', icon: '🌐' },
  { name: 'Laravel', icon: '🔴' },
  { name: 'SQLite', icon: '📦' },
  { name: 'Git', icon: '🔀' },
]

const tools = computed(() =>
  currentDeck.value === 'frontend' ? frontendTools : backendTools
)

onMounted(() => {
  if (!sectionRef.value || !wheelRef.value) return
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const cards = wheelRef.value!.querySelectorAll('.toolkit-card')
    const totalCards = cards.length
    const angleStep = 360 / totalCards

    // Position cards in a circle
    cards.forEach((card, i) => {
      gsap.set(card, {
        rotation: i * angleStep,
        transformOrigin: '50% clamp(300px, 40vw, 450px)',
      })
    })

    // Rotate wheel on scroll
    ScrollTrigger.create({
      trigger: sectionRef.value!,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      pin: sectionRef.value!.querySelector('.toolkit-pin'),
      onUpdate: (self) => {
        // Rotate wheel
        gsap.set(wheelRef.value!, { rotation: -self.progress * 540 })

        // Deck switch at midpoint with flip
        if (self.progress > 0.45 && self.progress < 0.55) {
          if (currentDeck.value !== 'backend') {
            currentDeck.value = 'backend'
          }
        } else if (self.progress < 0.45) {
          if (currentDeck.value !== 'frontend') {
            currentDeck.value = 'frontend'
          }
        }
      },
    })

    // Background reveal (cream → dark at midpoint)
    if (bgRevealRef.value) {
      gsap.fromTo(bgRevealRef.value, {
        clipPath: 'circle(0% at 50% 50%)',
      }, {
        clipPath: 'circle(150% at 50% 50%)',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: '40% top',
          end: '60% top',
          scrub: 1,
        },
      })
    }
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section id="toolkit" ref="sectionRef" class="relative w-full" data-theme="dark">
    <div class="h-[600vh]">
      <div class="toolkit-pin relative h-screen overflow-hidden bg-cream">
        <!-- Dark bg reveal (cream → dark transition) -->
        <div
          ref="bgRevealRef"
          class="absolute inset-0 bg-dark z-[1] will-change-[clip-path]"
          style="clip-path: circle(0% at 50% 50%);"
        />

        <!-- Content layer -->
        <div class="relative z-[2] h-full">
          <!-- Header -->
          <div class="absolute w-full text-center top-[12vh] lg:top-[10vh] pointer-events-none z-[3]">
            <h2
              class="font-display font-bold tracking-display transition-colors duration-500"
              :class="[
                currentDeck === 'frontend' ? 'text-dark text-[max(48px,6vw)]' : 'text-cream text-[max(48px,6vw)]',
              ]"
            >
              Toolkit
            </h2>
            <p
              class="font-display font-light mt-[2vh] transition-all duration-500"
              :class="[
                currentDeck === 'frontend' ? 'text-dark/60 text-[max(18px,1.8vw)]' : 'text-cream/60 text-[max(18px,1.8vw)]',
              ]"
            >
              {{ subtitleText }}
            </p>
          </div>

          <!-- Rotating card wheel -->
          <div
            ref="wheelRef"
            class="absolute aspect-square w-[300%] -left-[100%] top-[55vh] lg:top-[48vh] will-change-transform"
          >
            <div
              v-for="(tool, i) in tools"
              :key="`${currentDeck}-${tool.name}`"
              class="toolkit-card absolute inset-0 flex items-start justify-center pointer-events-none"
            >
              <div
                class="w-[clamp(120px,16vw,260px)] aspect-[295/420] rounded-card flex flex-col items-center justify-center gap-4 will-change-transform -translate-y-1/2 transition-all duration-400 border"
                :class="[
                  currentDeck === 'frontend'
                    ? 'bg-cream border-dark/8 hover:border-dark/20 text-dark'
                    : 'bg-dark/60 border-cream/10 hover:border-cream/25 text-cream',
                ]"
              >
                <span class="text-[clamp(28px,3vw,44px)]">{{ tool.icon }}</span>
                <span class="font-body text-[clamp(13px,1.2vw,20px)] font-medium text-center px-3">
                  {{ tool.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
