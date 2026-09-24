<script setup lang="ts">
/**
 * Home page — all sections assembled.
 * Mirrors guillaumezhu.com scroll order:
 * Hero → Manifesto → Trajectory → Toolkit → Projects → Footer
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()

useHead({
  title: 'Ameen Mohamed — Front-End Engineer',
  meta: [
    { name: 'description', content: () => t('home.description') },
  ],
})

const theme = useTheme()

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  // Theme switching per section (agy MAJOR fix)
  const sections = document.querySelectorAll('[data-theme]')
  sections.forEach((section) => {
    const sectionTheme = section.getAttribute('data-theme') as 'cream' | 'dark'
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => theme.setTheme(sectionTheme),
      onEnterBack: () => theme.setTheme(sectionTheme),
    })
  })
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
