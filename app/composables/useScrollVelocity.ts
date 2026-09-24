/**
 * useScrollVelocity — Tracks scroll speed and direction.
 * Used for skew effects on text/images during fast scroll.
 * Exposes reactive velocity and normalized speed values.
 */
export function useScrollVelocity() {
  const velocity = useState('scrollVelocity', () => 0)
  const direction = useState<'up' | 'down'>('scrollDirection', () => 'down')
  const speed = useState('scrollSpeed', () => 0) // 0-1 normalized

  let lastScroll = 0
  let lastTime = 0
  let raf: number | null = null

  function start() {
    if (import.meta.server) return
    lastScroll = window.scrollY
    lastTime = performance.now()
    tick()
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf)
    raf = null
  }

  function tick() {
    const now = performance.now()
    const dt = now - lastTime
    const currentScroll = window.scrollY

    if (dt > 0) {
      const rawVelocity = (currentScroll - lastScroll) / dt * 1000 // px/s
      velocity.value += (rawVelocity - velocity.value) * 0.1 // smooth
      direction.value = rawVelocity > 0 ? 'down' : 'up'

      // Normalize to 0-1 (capped at 3000px/s as max)
      speed.value = Math.min(1, Math.abs(velocity.value) / 3000)
    }

    lastScroll = currentScroll
    lastTime = now
    raf = requestAnimationFrame(tick)
  }

  return {
    velocity: readonly(velocity),
    direction: readonly(direction),
    speed: readonly(speed),
    start,
    stop,
  }
}
