<script setup lang="ts">
/**
 * SiteLoader — Full-screen first-visit loader.
 * Mirrors guillaumezhu.com:
 * - Logo assembles from individual letters
 * - Progress bar fills
 * - Background slides up to reveal the page
 * - sessionStorage prevents repeat
 */
import { gsap } from 'gsap'

const isVisible = ref(true)
const loaderRef = ref<HTMLElement>()
const lettersRef = ref<HTMLElement>()
const barRef = ref<HTMLElement>()
const percentRef = ref<HTMLElement>()
const scroll = useScroll()
const progress = ref(0)

onMounted(() => {
  if (sessionStorage.getItem('homeLoaderShown') === 'true') {
    isVisible.value = false
    return
  }

  scroll.stop()
  document.body.style.overflow = 'hidden'

  const tl = gsap.timeline({
    onComplete: () => {
      sessionStorage.setItem('homeLoaderShown', 'true')

      // Slide up reveal
      gsap.to(loaderRef.value!, {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut',
        onComplete: () => {
          isVisible.value = false
          document.body.style.overflow = ''
          scroll.start()
        },
      })
    },
  })

  // Letters stagger in
  const letters = lettersRef.value?.querySelectorAll('.loader-letter')
  if (letters) {
    tl.from(letters, {
      yPercent: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: 'power3.out',
    }, 0)
  }

  // Progress bar
  tl.to(progress, {
    value: 100,
    duration: 2,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (barRef.value) barRef.value.style.transform = `scaleX(${progress.value / 100})`
      if (percentRef.value) percentRef.value.textContent = `${Math.round(progress.value)}`
    },
  }, 0.3)

  // Hold for a beat before revealing
  tl.to({}, { duration: 0.4 })
})
</script>

<template>
  <div
    v-if="isVisible"
    ref="loaderRef"
    class="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-dark will-change-transform"
    role="progressbar"
    :aria-valuenow="Math.round(progress)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <!-- Logo letters -->
    <div ref="lettersRef" class="overflow-hidden mb-16">
      <div class="flex gap-[0.02em]">
        <span
          v-for="letter in ['A', 'M', 'E', 'E', 'N']"
          :key="`l-${letter}`"
          class="loader-letter font-display text-[clamp(48px,10vw,120px)] font-bold tracking-display text-cream will-change-transform"
        >
          {{ letter }}
        </span>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="w-[clamp(200px,30vw,400px)] h-[1px] bg-cream/10 rounded-full overflow-hidden">
      <div ref="barRef" class="h-full bg-cream origin-left" style="transform: scaleX(0);" />
    </div>

    <!-- Percent -->
    <div class="flex items-baseline gap-1 mt-4">
      <span ref="percentRef" class="font-body text-[13px] font-medium text-cream/40 tabular-nums">0</span>
      <span class="font-body text-[11px] text-cream/25">%</span>
    </div>
  </div>
</template>
