<script setup lang="ts">
/**
 * PageTransition — Animated cross-page transition.
 * Exact replica of guillaumezhu.com:
 * - Curved div slides in from right
 * - 140vw × 120vh with left-edge border-radius
 * - Coordinated via sessionStorage between pages
 * - GSAP drives the slide in/out animation
 */
import { gsap } from 'gsap'

const overlayRef = ref<HTMLElement>()
const isActive = ref(false)
const variant = ref<'cream' | 'dark'>('cream')

const router = useRouter()

// Listen for route changes — animate OUT current page, then IN new page
router.beforeEach((_to, _from, next) => {
  if (!overlayRef.value || !import.meta.client) {
    next()
    return
  }

  const destTheme = sessionStorage.getItem('pageTransitionColor') || 'cream'
  variant.value = destTheme as 'cream' | 'dark'
  isActive.value = true

  // Slide overlay in from right
  gsap.fromTo(overlayRef.value, {
    xPercent: 100,
  }, {
    xPercent: 0,
    duration: 0.8,
    ease: 'power3.inOut',
    onComplete: () => {
      next()
      // After navigation, slide overlay out to left
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

  return false // Prevent default navigation until animation completes
})

function setTransitionColor(color: 'cream' | 'dark') {
  sessionStorage.setItem('pageTransitionColor', color)
}

defineExpose({ setTransitionColor })
</script>

<template>
  <div
    ref="overlayRef"
    class="fixed inset-0 z-[9999] pointer-events-none will-change-transform"
    :class="isActive ? 'pointer-events-auto' : ''"
    style="transform: translateX(100%);"
    aria-hidden="true"
  >
    <div
      class="absolute w-[140vw] h-[120vh] -top-[10vh]"
      :class="variant === 'dark' ? 'bg-dark' : 'bg-cream'"
      :style="{
        borderTopLeftRadius: 'min(60vh, 42vw) 60vh',
        borderBottomLeftRadius: 'min(60vh, 42vw) 60vh',
        insetInlineEnd: '-20vw',
      }"
    />
  </div>
</template>
