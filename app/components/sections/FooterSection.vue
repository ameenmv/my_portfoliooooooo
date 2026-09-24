<script setup lang="ts">
/**
 * FooterSection — SVG text-on-path with gradient + clip-path circle reveal.
 * Mirrors guillaumezhu.com: "If our paths align, let's build what's next together"
 * wraps along a wavy SVG path, then footer reveals from a clip-path: circle().
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()
const sectionRef = ref<HTMLElement>()
const footerRef = ref<HTMLElement>()
let ctx: gsap.Context | null = null

const currentYear = new Date().getFullYear()

onMounted(() => {
  if (!sectionRef.value || !footerRef.value) return

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    // SVG text reveal — translate SVG as user scrolls
    const svgText = sectionRef.value!.querySelector('.footer-svg')
    if (svgText) {
      gsap.fromTo(svgText, {
        x: '0%',
      }, {
        x: '-40%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value!,
          start: 'top top',
          end: '60% top',
          scrub: 1,
          pin: sectionRef.value!.querySelector('.footer-next-container'),
        },
      })
    }

    // Footer circle reveal
    gsap.fromTo(footerRef.value!, {
      clipPath: 'circle(0% at 50% 50%)',
    }, {
      clipPath: 'circle(100% at 50% 50%)',
      ease: 'power2.out',
      scrollTrigger: {
        trigger: footerRef.value!,
        start: 'top 80%',
        end: 'top 20%',
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
  <section id="contact" ref="sectionRef" class="relative w-full bg-dark text-cream">
    <!-- "What's next?" title -->
    <div class="flex items-center justify-center h-[60vh]">
      <h2 class="font-display text-[10vw] max-sm:text-[clamp(42px,12vw,60px)] font-bold tracking-display text-center">
        {{ t('home.nextIntro') }}
      </h2>
    </div>

    <!-- Playground link -->
    <div class="flex justify-center pb-[10vh]">
      <NuxtLink
        to="/playground"
        class="text-link font-body text-[clamp(16px,1.5vw,24px)] font-medium"
      >
        {{ t('home.playgroundLink') }} ↗
      </NuxtLink>
    </div>

    <!-- SVG text on path -->
    <div class="h-[300vh]">
      <div class="footer-next-container h-screen overflow-hidden flex items-center">
        <svg
          class="footer-svg w-[200vw] min-w-[1200px] h-[40vh]"
          viewBox="0 0 2000 200"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#f5e7df" />
              <stop offset="30%" stop-color="#f6c177" />
              <stop offset="60%" stop-color="#ff6b4a" />
              <stop offset="100%" stop-color="#9b7cff" />
            </linearGradient>
            <path
              id="text-path"
              d="M 0 120 C 200 40, 400 180, 600 100 C 800 20, 1000 160, 1200 80 C 1400 0, 1600 150, 1800 70 C 1900 30, 1950 100, 2000 80"
              fill="none"
            />
          </defs>

          <!-- Cream part -->
          <text font-family="CabinetGrotesk, Alexandria, sans-serif" font-size="48" font-weight="700" fill="#f5e7df">
            <textPath href="#text-path" startOffset="0%">
              {{ t('home.nextTextCream') }}
            </textPath>
          </text>

          <!-- Gradient part -->
          <text font-family="CabinetGrotesk, Alexandria, sans-serif" font-size="48" font-weight="700" fill="url(#text-gradient)">
            <textPath href="#text-path" startOffset="35%">
              {{ t('home.nextTextGradient') }}
            </textPath>
          </text>
        </svg>
      </div>
    </div>

    <!-- Footer with circle reveal -->
    <footer
      ref="footerRef"
      class="relative bg-dark overflow-hidden will-change-[clip-path]"
      :aria-label="t('home.footerLabel')"
    >
      <div
        class="min-h-screen flex flex-col items-center justify-center gap-[clamp(24px,5vh,48px)] px-[5vw] py-[120px] rounded-[18px] mx-[clamp(8px,2vw,16px)] bg-cover bg-center relative"
        style="background-image: linear-gradient(rgba(31,29,29,0.7), rgba(31,29,29,0.85)), url('/brand/logo-ameen.svg');"
      >
        <div class="text-center">
          <p class="font-display text-[clamp(48px,10vw,120px)] font-bold leading-[0.9] tracking-display">
            <span class="block">{{ t('home.footerLine1') }}</span>
            <span class="block">{{ t('home.footerLine2') }}</span>
          </p>
          <p class="font-body text-[clamp(14px,1.2vw,18px)] font-medium opacity-60 mt-6">
            {{ t('home.footerLine3') }}
          </p>
        </div>

        <!-- Links -->
        <nav
          class="flex flex-wrap gap-6 justify-center font-body text-[clamp(14px,1.1vw,18px)]"
          :aria-label="t('home.footerNavigationLabel')"
        >
          <span class="opacity-50">{{ t('home.footerExplore') }}</span>
          <NuxtLink to="/#parcours" class="text-link">{{ t('home.footerJourney') }}</NuxtLink>
          <NuxtLink to="/#projects" class="text-link">{{ t('home.footerProjects') }}</NuxtLink>
          <NuxtLink to="/contact" class="text-link">{{ t('nav.contact') }}</NuxtLink>
          <NuxtLink to="/playground" class="text-link">{{ t('nav.playground') }}</NuxtLink>
        </nav>

        <!-- Social links -->
        <div class="flex gap-6 font-body text-[clamp(14px,1.1vw,18px)]">
          <a href="mailto:ameeenmv@gmail.com" class="text-link">Email</a>
          <a href="#" class="text-link opacity-50">LinkedIn</a>
          <a href="#" class="text-link opacity-50">GitHub</a>
          <a href="#" class="text-link opacity-50">YouTube</a>
        </div>

        <!-- Bottom bar -->
        <div class="absolute bottom-6 inset-x-0 flex justify-between px-8 font-body text-xs opacity-40">
          <span>© {{ currentYear }} Ameen Mohamed</span>
          <span>{{ t('home.legalNotice') }}</span>
        </div>
      </div>
    </footer>
  </section>
</template>
