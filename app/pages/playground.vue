<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: () => t('playground.title'),
  meta: [
    { name: 'description', content: () => t('playground.description') },
  ],
})
</script>

<template>
  <main class="playground">
    <h1 class="visually-hidden">{{ t('playground.heading') }}</h1>

    <section class="playground__placeholder">
      <span class="placeholder__label">PLAYGROUND</span>
      <span class="placeholder__sublabel">3D Media Sphere — Coming in Phase 4</span>
    </section>
  </main>
</template>

<style scoped>
.playground {
  background-color: var(--color-dark);
  color: var(--color-cream);
  min-height: 100vh;
}

.playground__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 16px;
}

.placeholder__label {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.5;
}

.placeholder__sublabel {
  font-family: var(--font-display);
  font-size: clamp(24px, 4vw, 48px);
  font-weight: 700;
  letter-spacing: var(--letter-spacing-display);
}
</style>
