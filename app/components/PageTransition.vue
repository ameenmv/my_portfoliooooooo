<script setup lang="ts">
/**
 * PageTransition — Animated cross-page transition.
 * Only activates on actual route changes, stays completely hidden otherwise.
 */
import { gsap } from 'gsap'

const overlayRef = ref<HTMLElement>()
const isActive = ref(false)
const variant = ref<'cream' | 'dark'>('cream')

if (import.meta.client) {
  const router = useRouter()

  router.beforeEach((_to, _from, next) => {
    if (!overlayRef.value) {
      next()
      return
    }

    const destTheme = sessionStorage.getItem('pageTransitionColor') || 'cream'
    variant.value = destTheme as 'cream' | 'dark'
    isActive.value = true

    gsap.fromTo(overlayRef.value, {
      xPercent: 100,
    }, {
      xPercent: 0,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        next()
        nextTick(() => {
          window.scrollTo(0, 0)
          gsap.to(overlayRef.value!, {
            xPercent: -100,
            duration: 0.7,
            ease: 'power3.inOut',
            delay: 0.15,
            onComplete: () => {
              isActive.value = false
              gsap.set(overlayRef.value!, { xPercent: 100 })
            },
          })
        })
      },
    })

    return false
  })
}
</script>

<template>
  <!-- Hidden by default: translate-x-[200%] ensures it's fully off-screen -->
  <div
    v-if="isActive"
    ref="overlayRef"
    class="fixed inset-0 z-[9999] pointer-events-auto will-change-transform"
    aria-hidden="true"
  >
    <div
      class="absolute h-[120vh] -top-[10vh] right-0"
      :class="variant === 'dark' ? 'bg-dark' : 'bg-cream'"
      style="width: 140vw; border-top-left-radius: min(60vh, 42vw) 60vh; border-bottom-left-radius: min(60vh, 42vw) 60vh;"
    />
  </div>
</template>
