<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const projectMap: Record<string, { title: string; theme: 'cream' | 'dark' }> = {
  saaf: { title: 'SAAF', theme: 'cream' },
  'haze-clue': { title: 'Haze Clue', theme: 'dark' },
  sa5er: { title: 'Sa5er CLI', theme: 'dark' },
  athar: { title: 'Athar', theme: 'cream' },
  nabeeh: { title: 'Nabeeh', theme: 'cream' },
}

const project = computed(() => projectMap[slug.value] || { title: slug.value, theme: 'cream' })

useHead({
  title: () => `${project.value.title} — Ameen Mohamed`,
})
</script>

<template>
  <main class="project-page" :data-theme="project.theme">
    <NuxtLink
      to="/#projects"
      class="project-back"
      aria-label="Back to project list"
    >
      <svg class="project-back__icon" width="62" height="15" viewBox="0 0 62 15" fill="none" aria-hidden="true">
        <path class="project-back__shaft" d="M60.3018 7.37256L2.30176 7.37256" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <path class="project-back__arrowhead" d="M7.26025 13.7279L1.07307 7.54074C0.975439 7.44311 0.975439 7.28482 1.07307 7.18718L7.26025 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </NuxtLink>

    <section class="project-page__placeholder" :class="project.theme === 'dark' ? 'project-page__placeholder--dark' : ''">
      <span class="placeholder__label">PROJECT</span>
      <h1 class="placeholder__title">{{ project.title }}</h1>
      <span class="placeholder__sublabel">Horizontal scroll case study — Coming in Phase 3</span>
    </section>
  </main>
</template>

<style scoped>
.project-page {
  min-height: 100vh;
}

.project-page[data-theme="cream"] {
  background-color: var(--color-cream);
  color: var(--color-dark);
}

.project-page[data-theme="dark"] {
  background-color: var(--color-dark);
  color: var(--color-cream);
}

.project-back {
  position: fixed;
  top: 50%;
  inset-inline-start: clamp(16px, 3vw, 32px);
  transform: translateY(-50%);
  z-index: 100;
  color: inherit;
  opacity: 0.6;
  transition: opacity 0.25s;
}

html[dir="rtl"] .project-back {
  transform: translateY(-50%) scaleX(-1);
}

.project-back:hover {
  opacity: 1;
}

.project-page__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 16px;
  color: var(--color-dark);
}

.project-page__placeholder--dark {
  color: var(--color-cream);
}

.placeholder__label {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.5;
}

.placeholder__title {
  font-family: var(--font-display);
  font-size: clamp(48px, 10vw, 120px);
  font-weight: 700;
  letter-spacing: var(--letter-spacing-display);
  font-style: italic;
}

.placeholder__sublabel {
  font-family: var(--font-body);
  font-size: clamp(14px, 1.2vw, 18px);
  font-weight: 400;
  opacity: 0.5;
}
</style>
