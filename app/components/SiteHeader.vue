<script setup lang="ts">
const { locale, setLocale } = useI18n()
const { t } = useI18n()

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'ar' : 'en')
}
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 z-[1000] w-full flex items-center justify-between px-8 py-[26px] pointer-events-none transition-colors duration-400"
    :style="{ color: 'var(--current-interface-color, var(--color-cream))' }"
  >
    <NuxtLink
      to="/"
      class="pointer-events-auto block w-[clamp(36px,4vw,48px)] h-[clamp(36px,4vw,48px)] focus-visible:outline-2 focus-visible:outline-offset-4"
      aria-label="Ameen Mohamed — Home"
    >
      <span
        class="block w-full h-full bg-current"
        style="mask-image: url('/brand/logo-ameen.svg'); mask-position: 50%; mask-size: contain; mask-repeat: no-repeat;"
      />
    </NuxtLink>

    <nav
      class="pointer-events-auto flex items-center gap-[clamp(12px,2.8vw,40px)] h-[clamp(56px,5vw,72px)] px-[clamp(7px,2.5vw,36px)] rounded-full backdrop-blur-[20px] transition-colors duration-350"
      :style="{
        border: '1px solid color-mix(in srgb, var(--header-capsule-color, #fff) 10%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--header-capsule-color, #fff) 20%, transparent)',
      }"
    >
      <NuxtLink
        to="/#projects"
        class="pointer-events-auto font-body text-[clamp(15px,1.1vw,18px)] font-medium leading-none text-inherit no-underline relative group"
      >
        {{ t('nav.projects') }}
        <span class="absolute bottom-[-0.2em] inset-x-0 h-px bg-current scale-x-0 origin-left transition-transform duration-350 group-hover:scale-x-100" />
      </NuxtLink>

      <NuxtLink
        to="/playground"
        class="pointer-events-auto font-body text-[clamp(15px,1.1vw,18px)] font-medium leading-none text-inherit no-underline"
      >
        {{ t('nav.playground') }}
      </NuxtLink>

      <NuxtLink
        to="/contact"
        class="pointer-events-auto font-body text-[clamp(15px,1.1vw,18px)] font-medium leading-none text-inherit no-underline relative group"
      >
        {{ t('nav.contact') }}
        <span class="absolute bottom-[-0.2em] inset-x-0 h-px bg-current scale-x-0 origin-left transition-transform duration-350 group-hover:scale-x-100" />
      </NuxtLink>

      <button
        class="pointer-events-auto font-body text-[clamp(15px,1.1vw,18px)] font-medium leading-none text-inherit inline-flex items-center gap-[0.3em] shrink-0 cursor-pointer"
        type="button"
        @click="toggleLocale"
        :aria-label="locale === 'en' ? 'Switch to Arabic' : 'Switch to English'"
      >
        <span :class="['transition-opacity duration-250', locale === 'en' ? 'opacity-100' : 'opacity-45 hover:opacity-100']">EN</span>
        <span class="opacity-45" aria-hidden="true">/</span>
        <span :class="['transition-opacity duration-250', locale === 'ar' ? 'opacity-100' : 'opacity-45 hover:opacity-100']">ع</span>
      </button>
    </nav>
  </header>
</template>
