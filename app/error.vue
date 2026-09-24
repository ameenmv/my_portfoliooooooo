<script setup lang="ts">
import { gsap } from 'gsap'

useHead({ title: '404 — Page Not Found | Ameen Mohamed' })

const titleRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

onMounted(() => {
  if (titleRef.value) {
    gsap.from(titleRef.value, {
      scale: 0.5,
      opacity: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)',
    })
  }
  if (contentRef.value) {
    gsap.from(contentRef.value.children, {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.5,
    })
  }
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <main class="bg-dark text-cream min-h-screen flex flex-col items-center justify-center gap-6 px-8 text-center">
    <h1
      ref="titleRef"
      class="font-display text-[clamp(100px,20vw,280px)] font-bold tracking-display leading-none will-change-transform"
      style="background: linear-gradient(135deg, #f5e7df, #ff6b4a, #9b7cff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
    >
      404
    </h1>
    <div ref="contentRef">
      <p class="font-display text-[clamp(18px,2.5vw,36px)] font-light opacity-70 mb-8">
        This page doesn't exist yet.
      </p>
      <button
        @click="handleError"
        class="group inline-flex items-center gap-3 px-8 py-4 bg-cream text-dark rounded-full font-body text-[clamp(14px,1.1vw,18px)] font-medium transition-all duration-300 hover:bg-accent-orange hover:text-cream hover:scale-105"
      >
        <svg class="w-4 h-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Go back home</span>
      </button>
    </div>
  </main>
</template>
