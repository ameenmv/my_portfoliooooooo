<script setup lang="ts">
/**
 * SiteHeader — Exact match of guillaumezhu.com header.
 * Source CSS: padding 26px 32px, grid layout on desktop,
 * capsule: height clamp(56px,5vw,72px), gap clamp(12px,2.8vw,40px),
 * link font: Satoshi, clamp(15px,1.1vw,18px), weight 500
 */
import { gsap } from 'gsap'

const { locale, setLocale, t } = useI18n()
const headerRef = ref<HTMLElement>()
const isHidden = ref(false)
let lastScroll = 0

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function onScroll() {
  const cur = window.scrollY
  const delta = cur - lastScroll

  if (delta > 8 && cur > 100) {
    if (!isHidden.value) {
      isHidden.value = true
      gsap.to(headerRef.value!, { yPercent: -100, duration: 0.4, ease: 'power2.in' })
    }
  } else if (delta < -3) {
    if (isHidden.value) {
      isHidden.value = false
      gsap.to(headerRef.value!, { yPercent: 0, duration: 0.5, ease: 'power3.out' })
    }
  }
  lastScroll = cur
}

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'ar' : 'en')
}
</script>

<template>
  <!-- Exact source: position fixed, top 0, left 0, z-index 1000, padding 26px 32px -->
  <header
    ref="headerRef"
    class="fixed top-0 inset-x-0 z-[1000] w-full flex items-center justify-between pointer-events-none will-change-transform"
    style="padding: 26px 32px; color: var(--current-interface-color, var(--color-cream)); transition: color .4s cubic-bezier(.22,1,.36,1);"
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

    <!-- Nav capsule: exact source values -->
    <nav
      class="pointer-events-auto flex items-center rounded-full max-md:hidden"
      style="
        border: 1px solid color-mix(in srgb, var(--header-capsule-color, #fff) 10%, transparent);
        background-color: color-mix(in srgb, var(--header-capsule-color, #fff) 20%, transparent);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        height: clamp(56px, 5vw, 72px);
        padding-inline: clamp(7px, 2.5vw, 36px);
        gap: clamp(12px, 2.8vw, 40px);
        transition: background-color .35s cubic-bezier(.22,1,.36,1);
      "
    >
      <MagneticButton :strength="8">
        <NuxtLink
          to="/#parcours"
          class="font-body leading-none text-inherit no-underline relative group"
          style="font-size: clamp(15px, 1.1vw, 18px); font-weight: 500;"
        >
          journey
          <span class="absolute bottom-[-0.25em] inset-x-0 h-[1px] bg-current scale-x-0 origin-left transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
        </NuxtLink>
      </MagneticButton>

      <MagneticButton :strength="8">
        <NuxtLink
          to="/#toolkit"
          class="font-body leading-none text-inherit no-underline relative group"
          style="font-size: clamp(15px, 1.1vw, 18px); font-weight: 500;"
        >
          toolkit
          <span class="absolute bottom-[-0.25em] inset-x-0 h-[1px] bg-current scale-x-0 origin-left transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
        </NuxtLink>
      </MagneticButton>

      <MagneticButton :strength="8">
        <NuxtLink
          to="/#projects"
          class="font-body leading-none text-inherit no-underline relative group"
          style="font-size: clamp(15px, 1.1vw, 18px); font-weight: 500;"
        >
          {{ t('nav.projects').toLowerCase() }}
          <span class="absolute bottom-[-0.25em] inset-x-0 h-[1px] bg-current scale-x-0 origin-left transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
        </NuxtLink>
      </MagneticButton>

      <MagneticButton :strength="8">
        <NuxtLink
          to="/playground"
          class="font-body leading-none text-inherit no-underline relative group"
          style="font-size: clamp(15px, 1.1vw, 18px); font-weight: 500;"
        >
          {{ t('nav.playground').toLowerCase() }}
          <span class="absolute bottom-[-0.25em] inset-x-0 h-[1px] bg-current scale-x-0 origin-left transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
        </NuxtLink>
      </MagneticButton>

      <MagneticButton :strength="8">
        <NuxtLink
          to="/contact"
          class="font-body leading-none text-inherit no-underline relative group"
          style="font-size: clamp(15px, 1.1vw, 18px); font-weight: 500;"
        >
          {{ t('nav.contact').toLowerCase() }}
          <span class="absolute bottom-[-0.25em] inset-x-0 h-[1px] bg-current scale-x-0 origin-left transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
        </NuxtLink>
      </MagneticButton>

      <!-- Separator -->
      <span class="w-[1px] h-4 bg-current/20" aria-hidden="true" />

      <!-- Language toggle -->
      <button
        class="font-body leading-none text-inherit inline-flex items-center gap-[0.3em] shrink-0 cursor-pointer transition-opacity duration-200 hover:opacity-70"
        style="font-size: clamp(15px, 1.1vw, 18px); font-weight: 500;"
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
