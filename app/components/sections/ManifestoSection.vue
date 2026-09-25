<script setup lang="ts">
/**
 * ManifestoSection — Horizontal-scrolling sentence at 12vw.
 * Source CSS: font-size 12vw, padding 0 101vw, white-space nowrap
 * Source JS: ScrollTrigger with scrub, letter opacity stagger
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t, locale } = useI18n()
const sectionRef = ref<HTMLElement>()
const trackRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const manifesto = computed(() => t('home.manifesto'))

// Split into letters (Latin) or words (Arabic)
const segments = computed(() => {
  const text = manifesto.value
  if (locale.value === 'ar') {
    return text.split(' ').map((word, i) => ({
      content: word, isSpace: false, key: `w-${i}`,
    })).flatMap((item, i, arr) => {
      if (i < arr.length - 1) {
        return [item, { content: '\u00A0', isSpace: true, key: `s-${i}` }]
      }
      return [item]
    })
  }
  return text.split('').map((char, i) => ({
    content: char === ' ' ? '\u00A0' : char,
    isSpace: char === ' ',
    key: `c-${i}`,
  }))
})

onMounted(() => {
  if (!sectionRef.value || !trackRef.value) return
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const dir = locale.value === 'ar' ? 1 : -1

    // Horizontal scroll — pin the SECTION itself
    const scrollAnim = gsap.to(trackRef.value!, {
      x: () => dir * (trackRef.value!.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top top',
        end: () => `+=${trackRef.value!.scrollWidth}`,
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    // Letter opacity stagger
    const letterEls = trackRef.value!.querySelectorAll('.manifesto-char')
    gsap.from(letterEls, {
      opacity: 0.08,
      stagger: {
        each: 0.015,
        from: locale.value === 'ar' ? 'end' : 'start',
      },
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top top',
        end: '60% top',
        scrub: 1,
      },
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    id="manifesto"
    ref="sectionRef"
    class="relative w-full bg-cream overflow-hidden h-screen"
    data-theme="cream"
  >
    <!-- Rounded top edge -->
    <div class="absolute top-0 inset-x-0 h-[80px] bg-cream rounded-t-block z-[1]" />

    <div class="flex items-center w-full h-full relative">
      <div
        ref="trackRef"
        class="flex whitespace-nowrap will-change-transform"
        :style="{
          paddingInlineStart: '101vw',
          paddingInlineEnd: '101vw',
        }"
      >
        <span
          v-for="seg in segments"
          :key="seg.key"
          class="manifesto-char inline-block font-display font-bold leading-none select-none cursor-default will-change-[opacity]"
          :class="[
            seg.isSpace ? 'w-[0.3em]' : '',
            locale === 'ar' ? 'text-[clamp(48px,10vw,80px)]' : 'text-[12vw]',
          ]"
          :style="{ letterSpacing: 'var(--letter-spacing-display, -0.025em)', color: 'var(--color-dark, #1f1d1d)' }"
        >
          {{ seg.content }}
        </span>
      </div>
    </div>
  </section>
</template>
