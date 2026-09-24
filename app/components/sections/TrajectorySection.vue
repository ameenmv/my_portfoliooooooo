<script setup lang="ts">
/**
 * TrajectorySection — "My Journey" pinned sequence.
 * Exact replica of guillaumezhu.com:
 * - Title "My journey" at 12vw
 * - 1100vh pinned with 7 sentence reveals
 * - Split left/right background panels that slide in/out
 * - Background transitions between cream/dark per sentence pair
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
const sectionRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const pinWrapperRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const sentences = computed(() => [
  { lines: [t('home.trajectorySentence1')], bg: 'dark' },
  { lines: [t('home.trajectorySentence2Line1'), t('home.trajectorySentence2Line2')], bg: 'cream' },
  { lines: [t('home.trajectorySentence3')], bg: 'dark' },
  { lines: [t('home.trajectorySentence4Line1'), t('home.trajectorySentence4Line2')], bg: 'cream' },
  { lines: [t('home.trajectorySentence5')], bg: 'dark' },
  { lines: [t('home.trajectorySentence6')], bg: 'dark' },
  { lines: [t('home.trajectorySentence7')], bg: 'cream' },
])

onMounted(() => {
  if (!sectionRef.value || !containerRef.value || !pinWrapperRef.value) return
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    // Title parallax
    if (titleRef.value) {
      gsap.to(titleRef.value, {
        yPercent: -60,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: titleRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }

    // Pinned sentence sequence
    const sentenceEls = containerRef.value!.querySelectorAll('.trajectory-sentence')
    const panelEls = containerRef.value!.querySelectorAll('.trajectory-panel')
    const total = sentenceEls.length
    const segmentFraction = 1 / total

    sentenceEls.forEach((el, i) => {
      const startFrac = i * segmentFraction
      const midFrac = startFrac + segmentFraction * 0.35
      const endFrac = (i + 1) * segmentFraction

      // Fade + scale in
      gsap.fromTo(el,
        { opacity: 0, scale: 0.8, y: 60 },
        {
          opacity: 1, scale: 1, y: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pinWrapperRef.value!,
            start: `${startFrac * 100}% top`,
            end: `${midFrac * 100}% top`,
            scrub: 1,
          },
        }
      )

      // Fade out (not last)
      if (i < total - 1) {
        gsap.to(el, {
          opacity: 0, scale: 1.05, y: -40,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: pinWrapperRef.value!,
            start: `${(endFrac - segmentFraction * 0.25) * 100}% top`,
            end: `${endFrac * 100}% top`,
            scrub: 1,
          },
        })
      }
    })

    // Background panels slide in/out
    panelEls.forEach((panel, i) => {
      const startFrac = i * segmentFraction
      const endFrac = (i + 1) * segmentFraction

      gsap.fromTo(panel,
        { xPercent: i % 2 === 0 ? -100 : 100 },
        {
          xPercent: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: pinWrapperRef.value!,
            start: `${startFrac * 100}% top`,
            end: `${(startFrac + segmentFraction * 0.4) * 100}% top`,
            scrub: 1,
          },
        }
      )

      if (i < total - 1) {
        gsap.to(panel, {
          xPercent: i % 2 === 0 ? 100 : -100,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: pinWrapperRef.value!,
            start: `${(endFrac - segmentFraction * 0.3) * 100}% top`,
            end: `${endFrac * 100}% top`,
            scrub: 1,
          },
        })
      }
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section id="parcours" ref="sectionRef" class="relative w-full bg-dark" data-theme="dark">
    <!-- Title: "My journey" -->
    <div ref="titleRef" class="flex items-center justify-center h-screen will-change-transform">
      <h2 class="text-cream text-center font-display text-[12vw] max-sm:text-[clamp(48px,14vw,72px)] font-bold tracking-display leading-[0.85]">
        {{ t('home.trajectoryTitle') }}
      </h2>
    </div>

    <!-- Pinned sentence sequence -->
    <div ref="pinWrapperRef" class="h-[1100vh]">
      <div ref="containerRef" class="sticky top-0 h-screen overflow-hidden">
        <!-- Background panels -->
        <div class="absolute inset-0 z-[1]">
          <div
            v-for="(sentence, i) in sentences"
            :key="`panel-${i}`"
            class="trajectory-panel absolute will-change-transform"
            :class="[
              i % 2 === 0 ? 'inset-y-0 start-0 w-1/2' : 'inset-y-0 end-0 w-1/2',
              sentence.bg === 'cream' ? 'bg-cream' : 'bg-dark',
            ]"
            :style="{ transform: `translateX(${i % 2 === 0 ? '-100' : '100'}%)` }"
          />
        </div>

        <!-- Sentence text -->
        <div class="relative z-[2] flex items-center justify-center h-full">
          <div class="relative w-full max-w-[80vw]">
            <p
              v-for="(sentence, i) in sentences"
              :key="i"
              class="trajectory-sentence text-center font-display font-bold tracking-display leading-[0.85] will-change-transform"
              :class="[
                sentence.bg === 'cream' ? 'text-dark' : 'text-cream',
                sentence.lines.length > 1
                  ? 'text-[clamp(36px,8vw,96px)]'
                  : 'text-[clamp(42px,10vw,120px)]',
                i > 0 ? 'absolute inset-0 flex flex-col items-center justify-center' : 'flex flex-col items-center justify-center',
              ]"
              :style="i > 0 ? { opacity: 0 } : {}"
            >
              <span v-for="(line, j) in sentence.lines" :key="j" class="block">
                {{ line }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
