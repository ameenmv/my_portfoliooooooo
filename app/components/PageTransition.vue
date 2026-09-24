<script setup lang="ts">
/**
 * PageTransition — cross-page transition overlay.
 * Mirrors guillaumezhu.com's curved-edge slide transition.
 * Uses sessionStorage for cross-page state coordination.
 */
const isVisible = ref(false)
const variant = ref<'cream' | 'dark'>('cream')

onMounted(() => {
  const pending = sessionStorage.getItem('pageTransitionPending')
  if (pending === 'true') {
    const color = sessionStorage.getItem('pageTransitionColor')
    variant.value = color === 'dark' ? 'dark' : 'cream'
    isVisible.value = true
    sessionStorage.removeItem('pageTransitionPending')

    // Animate out after mount
    requestAnimationFrame(() => {
      setTimeout(() => {
        isVisible.value = false
      }, 600)
    })
  }
})

function triggerTransition(color: 'cream' | 'dark' = 'cream') {
  sessionStorage.setItem('pageTransitionPending', 'true')
  sessionStorage.setItem('pageTransitionColor', color)
}

defineExpose({ triggerTransition })
</script>

<template>
  <div
    v-if="isVisible"
    class="page-transition"
    :class="`page-transition--${variant}`"
    aria-hidden="true"
  />
</template>

<style scoped>
.page-transition {
  --page-transition-radius-x: min(60vh, 42vw);
  --page-transition-radius-y: 60vh;
  z-index: 9999;
  background-color: var(--color-cream);
  border-top-left-radius: var(--page-transition-radius-x) var(--page-transition-radius-y);
  border-bottom-left-radius: var(--page-transition-radius-x) var(--page-transition-radius-y);
  pointer-events: none;
  will-change: transform, border-radius;
  width: 140vw;
  height: 120vh;
  display: block;
  position: fixed;
  top: -10vh;
  inset-inline-start: -20vw;
}

.page-transition--cream {
  background-color: var(--color-cream);
}

.page-transition--dark {
  background-color: var(--color-dark);
}
</style>
