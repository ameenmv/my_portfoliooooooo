<script setup lang="ts">
/**
 * TrajectorySection — Pinned sentence sequence over 1100vh.
 * Mirrors guillaumezhu.com: "First → computer science → Then → front-end → Today → I ship → real products."
 * Each sentence fades in/out with scale and opacity as user scrolls.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
const sectionRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const sentences = computed(() => [
  { text: t('home.trajectorySentence1'), isTwoLines: false },
  { text: `${t('home.trajectorySentence2Line1')}\n${t('home.trajectorySentence2Line2')}`, isTwoLines: true },
  { text: t('home.trajectorySentence3'), isTwoLines: false },
  { text: `${t('home.trajectorySentence4Line1')}\n${t('home.trajectorySentence4Line2')}`, isTwoLines: true },
  { text: t('home.trajectorySentence5'), isTwoLines: false },
  { text: t('home.trajectorySentence6'), isTwoLines: false },
  { text: t('home.trajectorySentence7'), isTwoLines: false },
])

onMounted(() => {
  if (!sectionRef.value || !containerRef.value) return

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    const sentenceEls = containerRef.value!.querySelectorAll('.trajectory-sentence')
    const totalSentences = sentenceEls.length
    const segmentSize = 1 / totalSentences

    sentenceEls.forEach((el, i) => {
      const start = i * segmentSize
      const end = (i + 1) * segmentSize

      // Fade + scale in
      gsap.fromTo(el,
        { opacity: 0, scale: 0.85, y: 40 },
        {
          opacity: 1, scale: 1, y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.value!,
            start: `${start * 100}% top`,
            end: `${(start + segmentSize * 0.3) * 100}% top`,
            scrub: 1,
          },
        }
      )

      // Fade + scale out (not the last one)
      if (i < totalSentences - 1) {
        gsap.to(el, {
          opacity: 0, scale: 1.1, y: -30,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: sectionRef.value!,
            start: `${(end - segmentSize * 0.3) * 100}% top`,
            end: `${end * 100}% top`,
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
  <section id="parcours" ref="sectionRef" class="relative w-full bg-dark">
    <!-- Title -->
    <div class="flex items-center justify-center h-screen">
      <h2 class="text-cream text-center font-display text-[12vw] max-sm:text-[clamp(52px,15vw,72px)] font-bold tracking-display will-change-transform">
        {{ t('home.trajectoryTitle') }}
      </h2>
    </div>

    <!-- Pinned sentence sequence -->
    <div class="h-[1100vh]">
      <div ref="containerRef" class="sticky top-0 flex items-center justify-center h-screen overflow-hidden">
        <div class="relative w-full">
          <p
            v-for="(sentence, i) in sentences"
            :key="i"
            class="trajectory-sentence text-cream text-center font-display text-[10vw] max-sm:text-[clamp(42px,12vw,60px)] leading-[0.9] tracking-display w-full"
            :class="[
              i > 0 ? 'absolute top-0 left-0' : '',
              sentence.isTwoLines ? '-mt-[0.45em]' : '',
            ]"
            style="opacity: 0;"
          >
            <span
              v-for="(line, j) in sentence.text.split('\n')"
              :key="j"
              class="block will-change-transform"
            >
              {{ line }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
