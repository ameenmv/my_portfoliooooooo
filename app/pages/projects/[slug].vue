<script setup lang="ts">
/**
 * Project page — horizontal scroll case study.
 * Mirrors guillaumezhu.com: pinned horizontal track with panels.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const route = useRoute()
const { locale } = useI18n()
const slug = computed(() => route.params.slug as string)
const trackRef = ref<HTMLElement>()
const sectionRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null

interface ProjectData {
  title: string
  theme: 'cream' | 'dark'
  tagline: string
  stack: string[]
  description: string
  facts: string[]
}

const projectMap: Record<string, ProjectData> = {
  saaf: {
    title: 'SAAF',
    theme: 'cream',
    tagline: 'Enterprise Fintech Ecosystem',
    stack: ['Vue 3', 'Nuxt.js', 'Pinia', 'Pusher', 'Laravel Echo', 'Chart.js', 'SSR'],
    description: 'A comprehensive fintech platform with real-time WebSocket layer, two-tier RBAC system, and near-perfect Core Web Vitals.',
    facts: ['840+ unique views', '1,180+ reusable components', '33 persistent Pinia stores', 'Real-time via Pusher/Echo'],
  },
  'haze-clue': {
    title: 'Haze Clue',
    theme: 'dark',
    tagline: 'Real-Time BCI Platform',
    stack: ['Nuxt 4', 'NestJS', 'MongoDB', 'Socket.IO', 'Chart.js', 'i18n'],
    description: 'Full-stack cognitive-monitoring platform with live EEG data streams from BCI devices. Sub-second latency real-time data broadcasting.',
    facts: ['Live EEG streams', 'JWT/OTP auth', 'Bilingual RTL/LTR', 'Sub-second latency'],
  },
  sa5er: {
    title: 'Sa5er CLI',
    theme: 'dark',
    tagline: 'Sarcastic Egyptian Senior Dev',
    stack: ['Node.js', 'Terminal APIs', 'Caching', 'Gemini/Grok'],
    description: 'AI-powered CLI that intercepts terminal errors with context-aware fixes. 3-tier error resolution architecture with Egyptian personality.',
    facts: ['Published on npm', 'AI-powered', '3-tier error resolution', 'Local caching'],
  },
  athar: {
    title: 'Athar',
    theme: 'cream',
    tagline: 'Local-First MCP Server',
    stack: ['Node.js', 'Nuxt 4', 'SQLite', 'MCP Protocol'],
    description: 'MCP server capturing AI-generated bug resolutions into a developer knowledge base. SM-2 spaced repetition algorithm.',
    facts: ['Published on npm', 'Open source', 'SM-2 algorithm', 'Local SQLite'],
  },
  nabeeh: {
    title: 'Nabeeh',
    theme: 'cream',
    tagline: 'Real-Time Multiplayer Platform',
    stack: ['Nuxt.js', 'Socket.IO', 'Nuxt UI', 'Tailwind CSS'],
    description: 'Real-time multiplayer game logic with live score synchronization across concurrent sessions.',
    facts: ['Real-time multiplayer', 'Live score sync', 'Socket.IO', 'Concurrent sessions'],
  },
}

const project = computed(() => projectMap[slug.value] || {
  title: slug.value,
  theme: 'cream' as const,
  tagline: '',
  stack: [],
  description: '',
  facts: [],
})

useHead({
  title: () => `${project.value.title} — Ameen Mohamed`,
})

onMounted(() => {
  if (!sectionRef.value || !trackRef.value) return
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const dir = locale.value === 'ar' ? 1 : -1
    const panels = trackRef.value!.querySelectorAll('.project-panel')
    const totalWidth = (panels.length - 1) * window.innerWidth

    gsap.to(trackRef.value!, {
      x: () => dir * totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <main
    class="min-h-screen"
    :class="project.theme === 'dark' ? 'bg-dark text-cream' : 'bg-cream text-dark'"
  >
    <!-- Back arrow -->
    <NuxtLink
      to="/#projects"
      class="fixed top-1/2 start-[clamp(16px,3vw,32px)] -translate-y-1/2 z-[100] opacity-60 hover:opacity-100 transition-opacity"
      :class="project.theme === 'dark' ? 'text-cream' : 'text-dark'"
      aria-label="Back to project list"
    >
      <svg width="62" height="15" viewBox="0 0 62 15" fill="none" aria-hidden="true" :class="locale === 'ar' ? 'scale-x-[-1]' : ''">
        <path d="M60.3018 7.37256L2.30176 7.37256" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <path d="M7.26025 13.7279L1.07307 7.54074C0.975439 7.44311 0.975439 7.28482 1.07307 7.18718L7.26025 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </NuxtLink>

    <!-- Horizontal scroll track -->
    <section ref="sectionRef" class="overflow-hidden">
      <div ref="trackRef" class="flex h-screen will-change-transform">
        <!-- Panel 1: Title -->
        <div class="project-panel flex-none w-screen h-screen flex flex-col items-center justify-center gap-6 px-[5vw]">
          <span class="font-body text-xs font-bold tracking-[0.15em] uppercase opacity-50">Project</span>
          <h1 class="font-display text-[clamp(64px,15vw,160px)] font-bold tracking-display italic leading-[0.85]">
            {{ project.title }}
          </h1>
          <p class="font-display text-[clamp(18px,2.5vw,32px)] font-light opacity-70">
            {{ project.tagline }}
          </p>
        </div>

        <!-- Panel 2: Context -->
        <div class="project-panel flex-none w-screen h-screen flex flex-col items-center justify-center gap-8 px-[10vw]">
          <p class="font-display text-[clamp(24px,3vw,48px)] font-medium leading-[1.2] tracking-display text-center max-w-[800px]">
            {{ project.description }}
          </p>

          <!-- Stack pills -->
          <div class="flex flex-wrap justify-center gap-3">
            <span
              v-for="tech in project.stack"
              :key="tech"
              class="font-body text-[clamp(12px,1vw,16px)] font-medium px-4 py-2.5 border rounded-full"
              :class="project.theme === 'dark' ? 'border-cream/20' : 'border-dark/20'"
            >
              {{ tech }}
            </span>
          </div>
        </div>

        <!-- Panel 3: Key facts -->
        <div class="project-panel flex-none w-screen h-screen flex flex-col items-center justify-center gap-8 px-[10vw]">
          <h2 class="font-body text-xs font-bold tracking-[0.15em] uppercase opacity-50">Key facts</h2>
          <div class="grid grid-cols-2 gap-6 max-w-[600px]">
            <div
              v-for="fact in project.facts"
              :key="fact"
              class="font-display text-[clamp(20px,2.5vw,36px)] font-bold tracking-display text-center"
            >
              {{ fact }}
            </div>
          </div>
        </div>

        <!-- Panel 4: More projects -->
        <div class="project-panel flex-none w-screen h-screen flex flex-col items-center justify-center gap-8 px-[10vw]">
          <span class="font-body text-xs font-bold tracking-[0.15em] uppercase opacity-50">Other projects</span>
          <div class="flex flex-col items-center gap-4">
            <NuxtLink
              v-for="p in Object.entries(projectMap).filter(([k]) => k !== slug)"
              :key="p[0]"
              :to="`/projects/${p[0]}`"
              class="font-display text-[clamp(32px,5vw,64px)] font-medium italic tracking-display opacity-60 hover:opacity-100 transition-opacity"
            >
              {{ p[1].title }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
