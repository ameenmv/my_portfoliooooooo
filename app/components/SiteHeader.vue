<script setup lang="ts">
/**
 * SiteHeader — pill capsule navigation.
 * Exact replica of guillaumezhu.com:
 * - Fixed header with logo mask + nav pill
 * - Blur backdrop with color-mix borders
 * - Hides on fast scroll down, shows on scroll up
 * - Color inherits from --current-interface-color
 * - EN/ع language toggle
 */
import { gsap } from 'gsap'

const { locale, setLocale, t } = useI18n()
const headerRef = ref<HTMLElement>()
const isHidden = ref(false)
let lastScroll = 0
let scrollDelta = 0

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function onScroll() {
  const currentScroll = window.scrollY
  scrollDelta = currentScroll - lastScroll

  // Hide header on fast scroll down (after 100px), show on any scroll up
  if (scrollDelta > 8 && currentScroll > 100) {
    if (!isHidden.value) {
      isHidden.value = true
      gsap.to(headerRef.value!, { yPercent: -100, duration: 0.4, ease: 'power2.in' })
    }
  } else if (scrollDelta < -3) {
    if (isHidden.value) {
      isHidden.value = false
      gsap.to(headerRef.value!, { yPercent: 0, duration: 0.5, ease: 'power3.out' })
    }
  }

  lastScroll = currentScroll
}

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'ar' : 'en')
}
</script>

<template>
  <header
    ref="headerRef"
    class="fixed top-0 inset-x-0 z-[1000] w-full flex items-center justify-between px-[clamp(16px,3vw,32px)] py-[clamp(18px,2.5vh,26px)] pointer-events-none will-change-transform"
    :style="{ color: 'var(--current-interface-color, var(--color-cream))' }"
  >
    <!-- Logo -->
    <NuxtLink
      to="/"
      class="pointer-events-auto block w-[clamp(36px,3.5vw,48px)] h-[clamp(36px,3.5vw,48px)] focus-visible:outline-2 focus-visible:outline-offset-4 transition-opacity duration-300 hover:opacity-70"
      aria-label="Ameen Mohamed — Home"
    >
      <span
        class="block w-full h-full bg-current"
        style="mask-image: url('/brand/logo-ameen.svg'); mask-position: 50%; mask-size: contain; mask-repeat: no-repeat; -webkit-mask-image: url('/brand/logo-ameen.svg'); -webkit-mask-position: 50%; -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat;"
      />
    </NuxtLink>

    <!-- Nav pill -->
    <nav
      class="pointer-events-auto flex items-center gap-[clamp(12px,2.5vw,36px)] h-[clamp(48px,4.5vw,64px)] px-[clamp(12px,2.2vw,32px)] rounded-full transition-colors duration-350"
      :style="{
        border: '1px solid color-mix(in srgb, var(--header-capsule-color, #fff) 10%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--header-capsule-color, #fff) 12%, transparent)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }"
    >
      <NuxtLink
        to="/#projects"
        class="font-body text-[clamp(14px,1vw,17px)] font-medium leading-none text-inherit no-underline relative group"
      >
        {{ t('nav.projects') }}
        <span class="absolute bottom-[-0.25em] inset-x-0 h-[1px] bg-current scale-x-0 origin-left transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
      </NuxtLink>

      <NuxtLink
        to="/playground"
        class="font-body text-[clamp(14px,1vw,17px)] font-medium leading-none text-inherit no-underline relative group"
      >
        {{ t('nav.playground') }}
        <span class="absolute bottom-[-0.25em] inset-x-0 h-[1px] bg-current scale-x-0 origin-left transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
      </NuxtLink>

      <NuxtLink
        to="/contact"
        class="font-body text-[clamp(14px,1vw,17px)] font-medium leading-none text-inherit no-underline relative group"
      >
        {{ t('nav.contact') }}
        <span class="absolute bottom-[-0.25em] inset-x-0 h-[1px] bg-current scale-x-0 origin-left transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
      </NuxtLink>

      <!-- Separator -->
      <span class="w-[1px] h-4 bg-current/20" aria-hidden="true" />

      <!-- Language toggle -->
      <button
        class="font-body text-[clamp(14px,1vw,17px)] font-medium leading-none text-inherit inline-flex items-center gap-[0.3em] shrink-0 cursor-pointer transition-opacity duration-200 hover:opacity-70"
        type="button"
        @click="toggleLocale"
        :aria-label="locale === 'en' ? 'Switch to Arabic' : 'Switch to English'"
      >
        <span :class="['transition-opacity duration-250', locale === 'en' ? 'opacity-100' : 'opacity-35']">EN</span>
        <span class="opacity-30" aria-hidden="true">/</span>
        <span :class="['transition-opacity duration-250', locale === 'ar' ? 'opacity-100' : 'opacity-35']">ع</span>
      </button>
    </nav>
  </header>
</template>
