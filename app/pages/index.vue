<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: 'Ameen Mohamed — Front-End Engineer',
  meta: [
    { name: 'description', content: () => t('home.description') },
  ],
})
</script>

<template>
  <main>
    <!-- Section 1: Hero — 100vh canvas + identity -->
    <section id="hero" class="relative w-full h-screen bg-dark" data-theme="cream">
      <div class="sticky top-0 flex flex-col items-center justify-center h-screen gap-3 text-cream border-2 border-dashed border-cream/15 rounded-block m-4">
        <span class="font-body text-xs font-bold tracking-[0.15em] uppercase opacity-50">HERO</span>
        <span class="font-display text-[clamp(24px,4vw,48px)] font-bold tracking-display text-center max-w-[600px] px-4">3D Canvas + Identity</span>
        <span class="font-body text-[clamp(11px,1vw,14px)] font-medium opacity-35 mt-2">100vh</span>
      </div>
    </section>

    <!-- Section 2: Manifesto — horizontal scroll text -->
    <section id="manifesto" class="relative w-full h-[400vh] bg-cream" data-theme="cream">
      <div class="sticky top-0 flex flex-col items-center justify-center h-screen gap-3 text-dark border-2 border-dashed border-dark/15 rounded-block m-4">
        <span class="font-body text-xs font-bold tracking-[0.15em] uppercase opacity-50">MANIFESTO</span>
        <span class="font-display text-[clamp(24px,4vw,48px)] font-bold tracking-display text-center max-w-[600px] px-4">"{{ t('home.manifesto') }}"</span>
        <span class="font-body text-[clamp(11px,1vw,14px)] font-medium opacity-35 mt-2">~400vh (horizontal scroll)</span>
      </div>
    </section>

    <!-- Section 3: Trajectory — pinned sentence sequence -->
    <section id="parcours" class="relative w-full bg-dark" data-theme="dark">
      <div class="h-[1100vh]">
        <div class="sticky top-0 flex flex-col items-center justify-center h-screen gap-3 text-cream border-2 border-dashed border-cream/15 rounded-block m-4">
          <span class="font-body text-xs font-bold tracking-[0.15em] uppercase opacity-50">TRAJECTORY</span>
          <span class="font-display text-[clamp(24px,4vw,48px)] font-bold tracking-display text-center">{{ t('home.trajectoryTitle') }}</span>
          <span class="font-body text-[clamp(11px,1vw,14px)] font-medium opacity-35 mt-2">1100vh pinned</span>
        </div>
      </div>
    </section>

    <!-- Section 4: Toolkit — rotating card wheel -->
    <section id="toolkit" class="relative w-full bg-dark" data-theme="dark">
      <div class="h-[600vh]">
        <div class="sticky top-0 flex flex-col items-center justify-center h-screen gap-3 text-cream border-2 border-dashed border-cream/15 rounded-block m-4">
          <span class="font-body text-xs font-bold tracking-[0.15em] uppercase opacity-50">TOOLKIT</span>
          <span class="font-display text-[clamp(24px,4vw,48px)] font-bold tracking-display text-center">{{ t('home.toolkitFrontend') }} → {{ t('home.toolkitBackend') }}</span>
          <span class="font-body text-[clamp(11px,1vw,14px)] font-medium opacity-35 mt-2">600vh pinned</span>
        </div>
      </div>
    </section>

    <!-- Section 5: Projects — italic text list -->
    <section id="projects" class="relative w-full bg-cream" data-theme="cream">
      <div class="h-[360vh]">
        <div class="sticky top-0 flex flex-col items-center justify-center h-screen gap-3 text-dark border-2 border-dashed border-dark/15 rounded-block m-4">
          <span class="font-body text-xs font-bold tracking-[0.15em] uppercase opacity-50">PROJECTS</span>
          <span class="font-display text-[clamp(24px,4vw,48px)] font-bold tracking-display text-center max-w-[600px] px-4">SAAF · Haze Clue · Sa5er · Athar · Nabeeh</span>
          <span class="font-body text-[clamp(11px,1vw,14px)] font-medium opacity-35 mt-2">360vh pinned</span>
        </div>
      </div>
    </section>

    <!-- Section 6: Next + Footer — SVG text path + circle reveal -->
    <section id="contact" class="relative w-full bg-dark" data-theme="dark">
      <div class="h-[500vh]">
        <div class="sticky top-0 flex flex-col items-center justify-center h-screen gap-3 text-cream border-2 border-dashed border-cream/15 rounded-block m-4">
          <span class="font-body text-xs font-bold tracking-[0.15em] uppercase opacity-50">NEXT + FOOTER</span>
          <span class="font-display text-[clamp(24px,4vw,48px)] font-bold tracking-display text-center">SVG text path + clip-path circle reveal</span>
          <span class="font-body text-[clamp(11px,1vw,14px)] font-medium opacity-35 mt-2">500vh pinned</span>
        </div>
      </div>
    </section>
  </main>
</template>
