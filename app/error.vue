<script setup lang="ts">
useHead({
  title: '404 — Page Not Found | Ameen Mohamed',
})
</script>

<template>
  <main class="bg-dark text-cream min-h-screen flex flex-col items-center justify-center gap-6 px-8 text-center">
    <h1 class="font-display text-[clamp(80px,15vw,200px)] font-bold tracking-display leading-none">
      404
    </h1>
    <p class="font-display text-[clamp(18px,2vw,32px)] font-light opacity-70">
      This page doesn't exist yet.
    </p>
    <NuxtLink
      to="/"
      class="text-link font-body text-[clamp(16px,1.2vw,20px)] font-medium mt-4"
    >
      Go back home ↗
    </NuxtLink>
  </main>
</template>
