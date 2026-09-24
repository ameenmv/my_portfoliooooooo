<script setup lang="ts">
const scroll = useScroll()
const theme = useTheme()
const device = useDeviceCapability()
const scrollVelocity = useScrollVelocity()

onMounted(() => {
  scroll.init()
  theme.init()
  device.detect()
  scrollVelocity.start()
})

onUnmounted(() => {
  scroll.destroy()
  scrollVelocity.stop()
})
</script>

<template>
  <div>
    <!-- Skip to content (accessibility) -->
    <a
      href="#main-content"
      class="fixed top-4 left-4 z-[99999] bg-cream text-dark px-4 py-2 rounded-lg font-body text-sm font-medium -translate-y-[200%] focus:translate-y-0 transition-transform duration-200"
    >
      Skip to content
    </a>

    <ClientOnly>
      <SiteLoader />
    </ClientOnly>
    <SiteHeader />
    <ClientOnly>
      <MobileNav />
    </ClientOnly>
    <ScrollIndicator />
    <PageTransition />
    <ClientOnly>
      <DevFpsOverlay />
      <CustomCursor />
    </ClientOnly>
    <div id="main-content">
      <NuxtPage />
    </div>
  </div>
</template>
