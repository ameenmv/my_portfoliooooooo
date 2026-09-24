<script setup lang="ts">
/**
 * ProjectsSection — Italic project list with letter-image reveals.
 * Mirrors guillaumezhu.com: large italic project names as links.
 * Hover reveals project preview images between letters.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t, locale } = useI18n()
const sectionRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const projects = [
  { name: 'SAAF', slug: 'saaf', theme: 'cream' as const },
  { name: 'Haze Clue', slug: 'haze-clue', theme: 'dark' as const },
  { name: 'Sa5er CLI', slug: 'sa5er', theme: 'dark' as const },
  { name: 'Athar', slug: 'athar', theme: 'cream' as const },
  { name: 'Nabeeh', slug: 'nabeeh', theme: 'cream' as const },
]

const hoveredProject = ref<string | null>(null)

onMounted(() => {
  if (!sectionRef.value || !containerRef.value) return

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    // Container scales up from dark section
    gsap.from(containerRef.value!, {
      scale: 0.85,
      borderRadius: '60px',
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top bottom',
        end: 'top 20%',
        scrub: 1,
      },
    })

    // Project names stagger in
    const projectEls = containerRef.value!.querySelectorAll('.project-name')
    gsap.from(projectEls, {
      yPercent: 100,
      opacity: 0,
      stagger: 0.08,
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top 50%',
        end: 'top 10%',
        scrub: 1,
      },
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section id="projects" ref="sectionRef" class="relative w-full">
    <div class="h-[360vh]">
      <div ref="containerRef" class="sticky top-0 h-screen bg-cream overflow-hidden will-change-transform origin-top">
        <div class="flex flex-col items-center justify-center h-full gap-[clamp(8px,1.5vh,16px)] px-[5vw]">
          <!-- Title -->
          <h2 class="font-body text-xs font-bold tracking-[0.15em] uppercase text-dark/50 mb-[clamp(16px,3vh,32px)]">
            {{ t('home.projectsTitle') }}
          </h2>

          <!-- Project list -->
          <NuxtLink
            v-for="project in projects"
            :key="project.slug"
            :to="`/projects/${project.slug}`"
            class="project-name group relative overflow-hidden text-dark will-change-transform"
            @mouseenter="hoveredProject = project.slug"
            @mouseleave="hoveredProject = null"
          >
            <span
              class="font-display text-[clamp(50px,7vw,88px)] font-medium italic leading-[1.1] tracking-display transition-all duration-300"
              :class="{
                'opacity-100': hoveredProject === project.slug || !hoveredProject,
                'opacity-25': hoveredProject && hoveredProject !== project.slug,
              }"
            >
              {{ project.name }}
            </span>

            <!-- Underline -->
            <span
              class="absolute bottom-[0.08em] inset-x-0 h-[2px] bg-dark origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              :class="hoveredProject === project.slug ? 'scale-x-100' : 'scale-x-0'"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
