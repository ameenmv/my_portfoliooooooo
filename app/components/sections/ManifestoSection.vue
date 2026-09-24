<script setup lang="ts">
/**
 * ManifestoSection — Single massive horizontal-scrolling sentence.
 * Mirrors guillaumezhu.com: text scrolls horizontally with padding 101vw on each side.
 * Each letter individually wrapped for stagger animation.
 * Uses GSAP ScrollTrigger to drive horizontal position.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t, locale } = useI18n()
const sectionRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const textRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const manifesto = computed(() => t('home.manifesto'))

// Split text into individual letter spans (words for Arabic)
const letters = computed(() => {
  const text = manifesto.value
  if (locale.value === 'ar') {
    // Arabic: split by WORDS only (never chars — agy BLOCKER fix)
    return text.split(' ').map((word, i) => ({ char: word + ' ', key: `w-${i}` }))
  }
  return text.split('').map((char, i) => ({
    char: char === ' ' ? '\u00A0' : char,
    key: `c-${i}`,
  }))
})

onMounted(() => {
  if (!sectionRef.value || !textRef.value || !containerRef.value) return

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    // Horizontal scroll: text moves left as user scrolls down
    const dir = locale.value === 'ar' ? 1 : -1 // RTL: move right instead

    gsap.to(textRef.value!, {
      x: () => dir * (textRef.value!.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: containerRef.value!,
      },
    })

    // Letter stagger reveal
    const letterEls = textRef.value!.querySelectorAll('.manifesto-letter')
    gsap.from(letterEls, {
      opacity: 0.15,
      stagger: 0.02,
      scrollTrigger: {
        trigger: sectionRef.value!,
        start: 'top top',
        end: '50% top',
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
    class="relative w-full h-[400vh] bg-cream overflow-hidden"
    :class="{ '-mt-[clamp(450px,55svh,500px)]': true }"
  >
    <div
      ref="containerRef"
      class="flex items-center w-full h-screen relative overflow-hidden origin-top will-change-transform"
    >
      <div
        ref="textRef"
        class="flex whitespace-nowrap w-max px-[101vw] text-dark cursor-default"
        :class="locale === 'ar' ? 'text-[clamp(52px,12vw,72px)]' : 'text-[12vw]'"
        style="font-weight: 700; line-height: 1; letter-spacing: var(--letter-spacing-display, -0.025em);"
      >
        <span
          v-for="letter in letters"
          :key="letter.key"
          class="manifesto-letter inline-block font-display"
        >
          {{ letter.char }}
        </span>
      </div>
    </div>
  </section>
</template>
