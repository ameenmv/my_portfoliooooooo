<script setup lang="ts">
/**
 * Contact page — letter-by-letter heading reveal + services.
 * Exact replica of guillaumezhu.com/contact/:
 * - Large heading with stagger letter reveal on mount
 * - Availability badge
 * - Service pills
 * - Email CTA
 */
import { gsap } from 'gsap'

const { t } = useI18n()
const theme = useTheme()
const headingRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

useHead({
  title: () => t('contact.title'),
  meta: [
    { name: 'description', content: () => t('contact.description') },
  ],
})

onMounted(() => {
  theme.setTheme('cream')

  // Heading word reveal
  if (headingRef.value) {
    const lines = headingRef.value.querySelectorAll('.contact-line')
    gsap.from(lines, {
      yPercent: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: 'power3.out',
      delay: 0.3,
    })
  }

  // Content fade in
  if (contentRef.value) {
    const items = contentRef.value.querySelectorAll('.contact-reveal')
    gsap.from(items, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.8,
    })
  }
})
</script>

<template>
  <main class="bg-dark text-cream min-h-screen">
    <section class="flex flex-col items-center justify-center min-h-screen gap-[clamp(32px,6vh,64px)] px-[5vw] pt-[120px] pb-[80px] text-center" aria-labelledby="contact-title">
      <!-- Heading with overflow hidden for reveal -->
      <div ref="headingRef">
        <h1 id="contact-title" class="font-display text-[clamp(40px,8vw,110px)] font-bold leading-[0.88] tracking-display">
          <span class="block overflow-hidden">
            <span class="contact-line block will-change-transform">{{ t('contact.headingLine1') }}</span>
          </span>
          <span class="block overflow-hidden">
            <span class="contact-line block will-change-transform">{{ t('contact.headingLine2') }}</span>
          </span>
          <span class="block overflow-hidden">
            <span class="contact-line block will-change-transform italic text-accent-orange">{{ t('contact.headingLine3') }}</span>
          </span>
        </h1>
      </div>

      <div ref="contentRef" class="flex flex-col items-center gap-[clamp(24px,4vh,48px)]">
        <!-- Availability -->
        <div class="contact-reveal flex items-center gap-3 font-body text-[clamp(14px,1.2vw,18px)]">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-orange/75" />
            <span class="relative inline-flex rounded-full h-3 w-3 bg-accent-orange" />
          </span>
          <span class="opacity-70">{{ t('contact.availability') }}</span>
          <span class="opacity-40">·</span>
          <span class="opacity-50">{{ t('contact.availabilityMeta') }}</span>
        </div>

        <!-- Services -->
        <div class="contact-reveal">
          <h2 class="sr-only">{{ t('contact.servicesLabel') }}</h2>
          <ul class="flex flex-wrap justify-center gap-3">
            <li class="font-body text-[clamp(13px,1vw,16px)] font-medium px-5 py-3 border border-cream/15 rounded-full hover:border-cream/30 transition-colors duration-300 cursor-default">
              {{ t('contact.serviceCreativeDevelopment') }}
            </li>
            <li class="font-body text-[clamp(13px,1vw,16px)] font-medium px-5 py-3 border border-cream/15 rounded-full hover:border-cream/30 transition-colors duration-300 cursor-default">
              {{ t('contact.serviceImmersiveExperiences') }}
            </li>
            <li class="font-body text-[clamp(13px,1vw,16px)] font-medium px-5 py-3 border border-cream/15 rounded-full hover:border-cream/30 transition-colors duration-300 cursor-default">
              {{ t('contact.serviceInteractiveInterfaces') }}
            </li>
          </ul>
        </div>

        <!-- Email CTA -->
        <a
          class="contact-reveal group inline-flex items-center gap-4 mt-4 px-8 py-5 bg-cream text-dark rounded-full font-body text-[clamp(16px,1.3vw,22px)] font-medium transition-all duration-300 hover:bg-accent-orange hover:text-cream hover:scale-105"
          href="mailto:ameeenmv@gmail.com"
          :aria-label="t('contact.emailLabel')"
        >
          <span>{{ t('contact.email') }}</span>
          <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  </main>
</template>
