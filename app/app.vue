<script setup lang="ts">
const scroll = useScroll()
const theme = useTheme()
const device = useDeviceCapability()

onMounted(() => {
  scroll.init()
  theme.init()
  device.detect()
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
