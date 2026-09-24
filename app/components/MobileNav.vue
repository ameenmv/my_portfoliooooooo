<script setup lang="ts">
/**
 * MobileNav — Hamburger menu for small screens.
 * Appears below 768px. Full-screen overlay with nav links.
 */
import { gsap } from 'gsap'

const { locale, setLocale, t } = useI18n()
const isOpen = ref(false)
const overlayRef = ref<HTMLElement>()
const linksRef = ref<HTMLElement>()

watch(isOpen, (open) => {
  if (!overlayRef.value) return

  if (open) {
    document.body.style.overflow = 'hidden'
    gsap.to(overlayRef.value, { opacity: 1, duration: 0.3, ease: 'power2.out' })
    gsap.set(overlayRef.value, { pointerEvents: 'auto' })

    // Stagger links in
    if (linksRef.value) {
      const links = linksRef.value.querySelectorAll('.mobile-link')
      gsap.from(links, {
        y: 40,
        opacity: 0,
        stagger: 0.06,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.15,
      })
    }
  } else {
    document.body.style.overflow = ''
    gsap.to(overlayRef.value, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => gsap.set(overlayRef.value!, { pointerEvents: 'none' }),
    })
  }
})

const router = useRouter()
router.afterEach(() => { isOpen.value = false })

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'ar' : 'en')
}
</script>

<template>
  <!-- Hamburger button (mobile only) -->
  <button
    class="fixed top-[clamp(18px,2.5vh,26px)] end-[clamp(16px,3vw,32px)] z-[1100] md:hidden flex flex-col items-end gap-[6px] p-2"
    :style="{ color: 'var(--current-interface-color, var(--color-cream))' }"
    @click="isOpen = !isOpen"
    :aria-label="isOpen ? 'Close menu' : 'Open menu'"
    :aria-expanded="isOpen"
  >
    <span
      class="block h-[2px] bg-current transition-all duration-300 origin-right"
      :class="isOpen ? 'w-6 rotate-45 translate-y-[4px]' : 'w-6'"
    />
    <span
      class="block h-[2px] bg-current transition-all duration-300"
      :class="isOpen ? 'w-0 opacity-0' : 'w-4'"
    />
    <span
      class="block h-[2px] bg-current transition-all duration-300 origin-right"
      :class="isOpen ? 'w-6 -rotate-45 -translate-y-[4px]' : 'w-6'"
    />
  </button>

  <!-- Full-screen overlay -->
  <div
    ref="overlayRef"
    class="fixed inset-0 z-[1050] bg-dark/95 backdrop-blur-xl md:hidden opacity-0 pointer-events-none"
  >
    <nav
      ref="linksRef"
      class="h-full flex flex-col items-center justify-center gap-8"
    >
      <NuxtLink
        to="/"
        class="mobile-link font-display text-[clamp(36px,10vw,56px)] font-bold tracking-display text-cream"
      >
        Home
      </NuxtLink>
      <NuxtLink
        to="/#projects"
        class="mobile-link font-display text-[clamp(36px,10vw,56px)] font-bold tracking-display text-cream"
      >
        {{ t('nav.projects') }}
      </NuxtLink>
      <NuxtLink
        to="/playground"
        class="mobile-link font-display text-[clamp(36px,10vw,56px)] font-bold tracking-display text-cream"
      >
        {{ t('nav.playground') }}
      </NuxtLink>
      <NuxtLink
        to="/contact"
        class="mobile-link font-display text-[clamp(36px,10vw,56px)] font-bold tracking-display text-cream"
      >
        {{ t('nav.contact') }}
      </NuxtLink>

      <!-- Language -->
      <button
        class="mobile-link font-body text-lg text-cream/60 mt-4 cursor-pointer"
        @click="toggleLocale"
      >
        {{ locale === 'en' ? 'العربية' : 'English' }}
      </button>
    </nav>
  </div>
</template>
