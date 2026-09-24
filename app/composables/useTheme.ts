/**
 * useTheme — Reactive cream/dark theme switching engine.
 *
 * From agy review (MAJOR):
 * guillaumezhu.com has an active theme coordinator that switches
 * between cream and dark per section via ScrollTrigger callbacks.
 * This composable drives:
 * - body[data-interface-color]
 * - header capsule color
 * - scroll indicator color
 */

type Theme = 'cream' | 'dark'

export function useTheme() {
  const currentTheme = useState<Theme>('currentTheme', () => 'cream')

  function setTheme(theme: Theme) {
    if (import.meta.server) return
    currentTheme.value = theme
    document.body.setAttribute('data-interface-color', theme)
  }

  function init() {
    if (import.meta.server) return
    // Default to cream (hero section)
    setTheme('cream')
  }

  return {
    currentTheme: readonly(currentTheme),
    setTheme,
    init,
  }
}
