/**
 * useScroll — Lenis + GSAP ScrollTrigger frame-perfect sync.
 *
 * Architecture notes (from agy review):
 * - All GSAP code MUST use gsap.context() for cleanup on route change
 * - Lenis drives scroll via GSAP ticker (lagSmoothing: 0)
 * - ScrollTrigger.update() called on every Lenis scroll event
 * - Cleanup kills all ScrollTrigger instances, stops Lenis
 */

import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenisInstance: Lenis | null = null
let gsapCtx: gsap.Context | null = null

export function useScroll() {
  const scrollProgress = useState('scrollProgress', () => 0)
  const scrollVelocity = useState('scrollVelocity', () => 0)
  const isScrollLocked = useState('isScrollLocked', () => false)

  function init() {
    if (import.meta.server || lenisInstance) return

    gsap.registerPlugin(ScrollTrigger)

    lenisInstance = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    // Sync Lenis → GSAP ticker (from agy review recommendation)
    lenisInstance.on('scroll', (e: Lenis) => {
      ScrollTrigger.update()
      const total = document.documentElement.scrollHeight - window.innerHeight
      scrollProgress.value = total > 0 ? Math.max(0, Math.min(1, e.scroll / total)) : 0
      scrollVelocity.value = e.velocity
    })

    // Drive Lenis from GSAP ticker for frame-perfect sync
    gsap.ticker.add((time: number) => {
      lenisInstance?.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)
  }

  /**
   * Create a GSAP context for a component.
   * MUST be called in onMounted, and revert() in onUnmounted.
   * This prevents memory leaks on route changes (agy BLOCKER fix).
   */
  function createContext(scope?: Element | string) {
    gsapCtx = gsap.context(() => {}, scope)
    return gsapCtx
  }

  function stop() {
    lenisInstance?.stop()
    isScrollLocked.value = true
  }

  function start() {
    lenisInstance?.start()
    isScrollLocked.value = false
  }

  function scrollTo(target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) {
    lenisInstance?.scrollTo(target, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.2,
    })
  }

  function destroy() {
    // Kill ALL ScrollTrigger instances (agy review fix)
    ScrollTrigger.getAll().forEach(st => st.kill())
    gsapCtx?.revert()
    gsapCtx = null
    lenisInstance?.destroy()
    lenisInstance = null
  }

  function getLenis() {
    return lenisInstance
  }

  return {
    scrollProgress: readonly(scrollProgress),
    scrollVelocity: readonly(scrollVelocity),
    isScrollLocked: readonly(isScrollLocked),
    init,
    createContext,
    stop,
    start,
    scrollTo,
    destroy,
    getLenis,
  }
}
