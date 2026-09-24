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
    <ClientOnly>
      <SiteLoader />
    </ClientOnly>
    <SiteHeader />
    <ScrollIndicator />
    <PageTransition />
    <ClientOnly>
      <DevFpsOverlay />
      <CustomCursor />
    </ClientOnly>
    <NuxtPage />
  </div>
</template>
