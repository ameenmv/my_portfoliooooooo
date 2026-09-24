<script setup lang="ts">
/**
 * SiteLoader — Full-screen loader shown only on first visit.
 * Mirrors guillaumezhu.com: logo assembles, then reveals the site.
 * Uses sessionStorage to skip on subsequent visits.
 */
import { gsap } from 'gsap'

const isVisible = ref(true)
const loaderRef = ref<HTMLElement>()
const logoRef = ref<HTMLElement>()
const progressRef = ref<HTMLElement>()
const progress = ref(0)
const scroll = useScroll()

onMounted(() => {
  // Skip loader if already shown this session
  if (sessionStorage.getItem('homeLoaderShown') === 'true') {
    isVisible.value = false
    return
  }

  // Lock scroll during loader
  scroll.stop()

  // Simulate loading progress
  const tl = gsap.timeline({
    onComplete: () => {
      sessionStorage.setItem('homeLoaderShown', 'true')
      // Reveal animation
      gsap.to(loaderRef.value!, {
        yPercent: -100,
        duration: 1,
        ease: 'power3.inOut',
        onComplete: () => {
          isVisible.value = false
          scroll.start()
        },
      })
    },
  })

  tl.to(progress, {
    value: 100,
    duration: 2.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (progressRef.value) {
        progressRef.value.style.transform = `scaleX(${progress.value / 100})`
      }
    },
  })

  // Logo fade in
  tl.from(logoRef.value!, {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: 'power2.out',
  }, 0.3)
})
</script>

<template>
  <div
    v-if="isVisible"
    ref="loaderRef"
    class="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-cream will-change-transform"
    role="progressbar"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <!-- Logo -->
    <div ref="logoRef" class="mb-12">
      <span class="font-display text-[clamp(48px,8vw,96px)] font-bold tracking-display text-dark">
        AM
      </span>
    </div>

    <!-- Progress bar -->
    <div class="w-[clamp(200px,30vw,400px)] h-[2px] bg-dark/10 rounded-full overflow-hidden">
      <div
        ref="progressRef"
        class="h-full bg-dark origin-left transition-none"
        style="transform: scaleX(0);"
      />
    </div>

    <!-- Progress text -->
    <span class="font-body text-xs font-medium text-dark/40 mt-4 tabular-nums">
      {{ Math.round(progress) }}%
    </span>
  </div>
</template>
