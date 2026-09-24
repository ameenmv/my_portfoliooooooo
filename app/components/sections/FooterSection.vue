<script setup lang="ts">
/**
 * FooterSection — SVG text path + circle-reveal footer.
 * Exact replica of guillaumezhu.com:
 * - "What's next?" title → playground link
 * - Long SVG text on wavy path that scrolls horizontally
 * - Circle reveal clip-path for the actual footer
 * - Footer has CTA, nav links, social links, legal
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
const sectionRef = ref<HTMLElement>()
const nextTitleRef = ref<HTMLElement>()
const svgWrapRef = ref<HTMLElement>()
const svgRef = ref<SVGElement>()
const footerRef = ref<HTMLElement>()
const footerInnerRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const currentYear = new Date().getFullYear()

onMounted(() => {
  if (!sectionRef.value || !footerRef.value) return
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    // "What's next?" title parallax
    if (nextTitleRef.value) {
      gsap.from(nextTitleRef.value, {
        yPercent: 30,
        opacity: 0,
        scale: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: nextTitleRef.value,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
      })
    }

    // SVG horizontal scroll
    if (svgRef.value && svgWrapRef.value) {
      gsap.to(svgRef.value, {
        x: '-50%',
        ease: 'none',
        scrollTrigger: {
          trigger: svgWrapRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
          pin: svgWrapRef.value.querySelector('.svg-pin'),
        },
      })
    }

    // Footer circle reveal
    if (footerInnerRef.value) {
      gsap.fromTo(footerInnerRef.value, {
        clipPath: 'circle(0% at 50% 50%)',
      }, {
        clipPath: 'circle(100% at 50% 50%)',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.value!,
          start: 'top 70%',
          end: 'top 10%',
          scrub: 1,
        },
      })
    }
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    id="contact"
    ref="sectionRef"
    class="relative w-full bg-dark text-cream"
    data-theme="dark"
  >
    <!-- "What's next?" -->
    <div class="flex items-center justify-center h-[70vh]">
      <div ref="nextTitleRef" class="text-center will-change-transform">
        <h2 class="font-display text-[clamp(48px,10vw,140px)] font-bold tracking-display leading-[0.85]">
          {{ t('home.nextIntro') }}
        </h2>
      </div>
    </div>

    <!-- Playground link -->
    <div class="flex justify-center pb-[8vh]">
      <NuxtLink
        to="/playground"
        class="group inline-flex items-center gap-3 font-body text-[clamp(16px,1.4vw,24px)] font-medium text-cream/70 hover:text-cream transition-colors duration-300"
      >
        <span>{{ t('home.playgroundLink') }}</span>
        <svg
          class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        >
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </NuxtLink>
    </div>

    <!-- SVG text on wavy path -->
    <div ref="svgWrapRef" class="h-[300vh]">
      <div class="svg-pin h-screen overflow-hidden flex items-center">
        <svg
          ref="svgRef"
          class="w-[300vw] min-w-[2400px] h-[45vh] will-change-transform"
          viewBox="0 0 3000 250"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="svg-text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#f5e7df" />
              <stop offset="25%" stop-color="#f6c177" />
              <stop offset="50%" stop-color="#ff6b4a" />
              <stop offset="75%" stop-color="#9b7cff" />
              <stop offset="100%" stop-color="#f5e7df" />
            </linearGradient>
            <path
              id="wavy-path"
              d="M 0 150 C 250 50, 500 220, 750 120 C 1000 20, 1250 200, 1500 100 C 1750 0, 2000 180, 2250 80 C 2500 0, 2750 150, 3000 100"
              fill="none"
            />
          </defs>

          <text
            font-family="CabinetGrotesk, Alexandria, sans-serif"
            font-size="52"
            font-weight="700"
            fill="url(#svg-text-gradient)"
          >
            <textPath href="#wavy-path" startOffset="0%">
              {{ t('home.nextTextCream') }} · {{ t('home.nextTextGradient') }} · {{ t('home.nextTextCream') }}
            </textPath>
          </text>
        </svg>
      </div>
    </div>

    <!-- Footer with circle reveal -->
    <footer
      ref="footerRef"
      class="relative min-h-screen"
      :aria-label="t('home.footerLabel')"
    >
      <div
        ref="footerInnerRef"
        class="min-h-screen will-change-[clip-path]"
        style="clip-path: circle(0% at 50% 50%);"
      >
        <div class="min-h-screen flex flex-col items-center justify-between bg-cream text-dark rounded-block mx-[clamp(8px,2vw,16px)] overflow-hidden">
          <!-- Main CTA -->
          <div class="flex-1 flex flex-col items-center justify-center gap-8 px-[5vw] py-[120px] text-center">
            <p class="font-display text-[clamp(44px,8vw,120px)] font-bold leading-[0.88] tracking-display">
              <span class="block">{{ t('home.footerLine1') }}</span>
              <span class="block">{{ t('home.footerLine2') }}</span>
            </p>
            <p class="font-body text-[clamp(14px,1.2vw,20px)] font-medium text-dark/50 max-w-[500px]">
              {{ t('home.footerLine3') }}
            </p>
            <a
              href="mailto:ameeenmv@gmail.com"
              class="group inline-flex items-center gap-3 mt-4 px-8 py-4 bg-dark text-cream rounded-full font-body text-[clamp(14px,1.1vw,18px)] font-medium transition-all duration-300 hover:bg-accent-orange hover:scale-105"
            >
              <span>ameeenmv@gmail.com</span>
              <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
          </div>

          <!-- Footer bottom -->
          <div class="w-full px-[clamp(24px,4vw,48px)] pb-8">
            <!-- Nav links -->
            <nav
              class="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8 font-body text-[clamp(13px,1vw,16px)] font-medium"
              :aria-label="t('home.footerNavigationLabel')"
            >
              <NuxtLink to="/" class="text-link text-dark/60 hover:text-dark">Home</NuxtLink>
              <NuxtLink to="/#parcours" class="text-link text-dark/60 hover:text-dark">{{ t('home.footerJourney') }}</NuxtLink>
              <NuxtLink to="/#projects" class="text-link text-dark/60 hover:text-dark">{{ t('home.footerProjects') }}</NuxtLink>
              <NuxtLink to="/contact" class="text-link text-dark/60 hover:text-dark">{{ t('nav.contact') }}</NuxtLink>
              <NuxtLink to="/playground" class="text-link text-dark/60 hover:text-dark">{{ t('nav.playground') }}</NuxtLink>
            </nav>

            <!-- Social -->
            <div class="flex justify-center gap-6 mb-8 font-body text-[clamp(13px,1vw,16px)]">
              <a href="mailto:ameeenmv@gmail.com" class="text-link text-dark/40 hover:text-dark">Email</a>
              <a href="#" class="text-link text-dark/40 hover:text-dark">LinkedIn</a>
              <a href="#" class="text-link text-dark/40 hover:text-dark">GitHub</a>
              <a href="#" class="text-link text-dark/40 hover:text-dark">YouTube</a>
            </div>

            <!-- Copyright -->
            <div class="flex justify-between items-center font-body text-[11px] text-dark/30">
              <span>© {{ currentYear }} Ameen Mohamed</span>
              <span>{{ t('home.legalNotice') }}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </section>
</template>
