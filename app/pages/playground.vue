<script setup lang="ts">
/**
 * Playground page — grid of creative experiments.
 * Simpler version of guillaumezhu.com's 3D sphere (Phase 4 will add Three.js sphere).
 * For now: masonry grid with hover effects.
 */
const { t } = useI18n()

useHead({
  title: () => t('playground.title'),
  meta: [
    { name: 'description', content: () => t('playground.description') },
  ],
})

const theme = useTheme()
onMounted(() => { theme.setTheme('dark') })

const experiments = [
  {
    title: 'V8 JIT Pipeline',
    description: 'Ignition → Sparkplug → Maglev → TurboFan',
    category: 'YouTube',
    color: 'bg-accent-orange/20 border-accent-orange/30',
  },
  {
    title: 'Sa5er CLI',
    description: 'Sarcastic Egyptian dev that fixes your terminal errors',
    category: 'npm package',
    color: 'bg-accent-purple/20 border-accent-purple/30',
  },
  {
    title: 'Athar MCP',
    description: 'Local-first AI knowledge base with spaced repetition',
    category: 'npm package',
    color: 'bg-accent-gold/20 border-accent-gold/30',
  },
  {
    title: 'Shader Study: Noise',
    description: 'Simplex noise distortion on scroll-driven uniforms',
    category: 'WebGL',
    color: 'bg-accent-orange/20 border-accent-orange/30',
  },
  {
    title: 'Browser Rendering',
    description: 'Deep dive into layout, paint, composite pipeline',
    category: 'YouTube',
    color: 'bg-accent-purple/20 border-accent-purple/30',
  },
  {
    title: 'Real-time Multiplayer',
    description: 'Socket.IO game logic with live score sync',
    category: 'Experiment',
    color: 'bg-accent-gold/20 border-accent-gold/30',
  },
  {
    title: 'EEG Visualization',
    description: 'Live brainwave data streams with Chart.js',
    category: 'Graduation',
    color: 'bg-accent-orange/20 border-accent-orange/30',
  },
  {
    title: 'GSAP Scroll Effects',
    description: 'ScrollTrigger patterns for Awwwards-level animations',
    category: 'Study',
    color: 'bg-accent-purple/20 border-accent-purple/30',
  },
  {
    title: 'Technical Gates VI',
    description: '6-session crash course for CIS Team & CAT Reloaded',
    category: 'Community',
    color: 'bg-accent-gold/20 border-accent-gold/30',
  },
]
</script>

<template>
  <main class="bg-dark text-cream min-h-screen">
    <h1 class="sr-only">{{ t('playground.heading') }}</h1>

    <!-- Header area -->
    <div class="flex items-center justify-center h-[40vh] px-8">
      <h2 class="font-display text-[clamp(32px,6vw,80px)] font-bold tracking-display text-center">
        Playground
      </h2>
    </div>

    <!-- Experiment grid -->
    <section class="px-[clamp(16px,4vw,48px)] pb-[120px]">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(exp, i) in experiments"
          :key="i"
          class="group relative overflow-hidden rounded-card border p-6 transition-all duration-300 cursor-default hover:scale-[1.02] hover:-translate-y-1"
          :class="exp.color"
        >
          <!-- Category -->
          <span class="font-body text-[11px] font-bold tracking-[0.15em] uppercase opacity-50 mb-3 block">
            {{ exp.category }}
          </span>

          <!-- Title -->
          <h3 class="font-display text-[clamp(20px,2vw,28px)] font-bold tracking-display mb-2">
            {{ exp.title }}
          </h3>

          <!-- Description -->
          <p class="font-body text-[clamp(14px,1.1vw,16px)] font-normal opacity-60 leading-relaxed">
            {{ exp.description }}
          </p>

          <!-- Hover glow -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-white/5 to-transparent" />
        </div>
      </div>
    </section>
  </main>
</template>
