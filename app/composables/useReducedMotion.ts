export function useReducedMotion() {
  const prefersReducedMotion = useState('reducedMotion', () => false)

  onMounted(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mq.matches

    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.value = e.matches
    }
    mq.addEventListener('change', handler)

    onUnmounted(() => {
      mq.removeEventListener('change', handler)
    })
  })

  return { prefersReducedMotion: readonly(prefersReducedMotion) }
}
