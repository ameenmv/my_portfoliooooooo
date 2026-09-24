/**
 * Router options — manual scroll behavior for Lenis compatibility.
 * From agy review: Nuxt router tries to manage scroll position,
 * conflicting with Lenis and pinned ScrollTrigger pins.
 */
import type { RouterConfig } from 'nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(_to, _from, _savedPosition) {
    // Lenis handles all scroll behavior. Return false to prevent
    // Vue Router from fighting over scroll position.
    return false
  },
}
