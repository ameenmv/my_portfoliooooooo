<script setup lang="ts">
const scroll = useScroll()
const theme = useTheme()

onMounted(() => {
  scroll.init()
  theme.init()
})

onUnmounted(() => {
  scroll.destroy()
})
</script>

<template>
  <div>
    <SiteHeader />
    <ScrollIndicator />
    <PageTransition />
    <ClientOnly>
      <DevFpsOverlay />
    </ClientOnly>
    <NuxtPage />
  </div>
</template>
