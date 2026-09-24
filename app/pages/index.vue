<script setup lang="ts">
/**
 * Home page — all sections assembled with theme coordination.
 * Mirrors guillaumezhu.com exact scroll order and theme switching.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
const theme = useTheme()
let triggers: ScrollTrigger[] = []

useHead({
  title: 'Ameen Mohamed — Front-End Engineer',
  meta: [
    { name: 'description', content: () => t('home.description') },
  ],
})

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  // Wait for all sections to mount and get their heights
  nextTick(() => {
    setTimeout(() => {
      // Theme switching per section
      const sectionThemes: Array<{ id: string; theme: 'cream' | 'dark' }> = [
        { id: 'hero', theme: 'cream' },
        { id: 'manifesto', theme: 'dark' },
        { id: 'parcours', theme: 'cream' },
        { id: 'toolkit', theme: 'dark' },
        { id: 'projects', theme: 'dark' },
        { id: 'contact', theme: 'cream' },
      ]

      sectionThemes.forEach(({ id, theme: sectionTheme }) => {
        const el = document.getElementById(id)
        if (!el) return

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => theme.setTheme(sectionTheme),
          onEnterBack: () => theme.setTheme(sectionTheme),
        })
        triggers.push(trigger)
      })
    }, 300)
  })
})

onUnmounted(() => {
  triggers.forEach(t => t.kill())
  triggers = []
})
</script>

<template>
  <main>
    <ClientOnly>
      <SectionsHeroSection />
    </ClientOnly>
    <SectionsManifestoSection />
    <SectionsTrajectorySection />
    <ClientOnly>
      <SectionsToolkitSection />
    </ClientOnly>
    <SectionsProjectsSection />
    <SectionsFooterSection />
  </main>
</template>
