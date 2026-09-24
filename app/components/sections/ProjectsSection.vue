<script setup lang="ts">
/**
 * ProjectsSection — Interactive project list with letter hover effects.
 * Mirrors guillaumezhu.com:
 * - Container scales up from dark section (cream bg)
 * - Large italic project names
 * - Hover: dimming + underline + cursor image reveal
 * - Each letter reacts to scroll velocity with subtle spring
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t, locale } = useI18n()
const sectionRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const listRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const projects = [
  { name: 'SAAF', slug: 'saaf', description: 'Enterprise Fintech Ecosystem' },
  { name: 'Haze Clue', slug: 'haze-clue', description: 'Real-Time BCI Platform' },
  { name: 'Sa5er CLI', slug: 'sa5er', description: 'Sarcastic Egyptian Dev CLI' },
  { name: 'Athar', slug: 'athar', description: 'Local-First MCP Server' },
  { name: 'Nabeeh', slug: 'nabeeh', description: 'Real-Time Multiplayer' },
]

const hoveredIndex = ref<number | null>(null)
const mousePos = reactive({ x: 0, y: 0 })

function onProjectMouseMove(e: MouseEvent) {
  mousePos.x = e.clientX
  mousePos.y = e.clientY
}

onMounted(() => {
  if (!sectionRef.value || !containerRef.value) return
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    // Container scales up with rounded corners → flat
    gsap.fromTo(containerRef.value!, {
      scale: 0.88,
      borderRadius: '60px',
    }, {
      scale: 1,
      borderRadius: '0px',
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top bottom',
        end: 'top 10%',
        scrub: 1,
      },
    })

    // Project names stagger in
    if (listRef.value) {
      const items = listRef.value.querySelectorAll('.project-item')
      gsap.from(items, {
        yPercent: 120,
        opacity: 0,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top 50%',
          end: 'top 15%',
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
  <section id="projects" ref="sectionRef" class="relative w-full" data-theme="cream">
    <div class="h-[360vh]">
      <div
        ref="containerRef"
        class="sticky top-0 h-screen bg-cream overflow-hidden will-change-transform origin-top"
      >
        <div class="flex flex-col items-center justify-center h-full px-[5vw]">
          <!-- Title -->
          <h2 class="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-dark/40 mb-[clamp(24px,4vh,48px)]">
            {{ t('home.projectsTitle') }}
          </h2>

          <!-- Project list -->
          <nav
            ref="listRef"
            class="flex flex-col items-center"
            @mousemove="onProjectMouseMove"
          >
            <div
              v-for="(project, i) in projects"
              :key="project.slug"
              class="project-item overflow-hidden"
            >
              <NuxtLink
                :to="`/projects/${project.slug}`"
                class="group relative block py-[clamp(4px,0.8vh,12px)] cursor-pointer"
                @mouseenter="hoveredIndex = i"
                @mouseleave="hoveredIndex = null"
              >
                <!-- Project name -->
                <span
                  class="font-display italic font-medium tracking-display leading-[1.05] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] block"
                  :class="[
                    'text-[clamp(44px,7vw,88px)]',
                    hoveredIndex === null || hoveredIndex === i
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-15',
                  ]"
                  :style="{
                    color: 'var(--color-dark, #1f1d1d)',
                  }"
                >
                  {{ project.name }}
                </span>

                <!-- Underline -->
                <span
                  class="absolute bottom-[0.1em] inset-x-0 h-[2px] bg-dark/80 origin-left transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  :class="hoveredIndex === i ? 'scale-x-100' : 'scale-x-0'"
                />

                <!-- Description tooltip on hover -->
                <span
                  class="absolute top-1/2 -translate-y-1/2 font-body text-[clamp(12px,1vw,16px)] font-medium text-dark/50 transition-all duration-300 pointer-events-none whitespace-nowrap"
                  :class="[
                    hoveredIndex === i ? 'opacity-100 end-0 translate-x-[calc(100%+24px)]' : 'opacity-0 end-0 translate-x-[calc(100%+16px)]',
                  ]"
                >
                  {{ project.description }}
                </span>
              </NuxtLink>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </section>
</template>
