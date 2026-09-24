/**
 * useDeviceCapability — GPU tier detection + adaptive quality.
 * Detects device capability and sets quality tier for Three.js scenes.
 */
export type QualityTier = 'high' | 'medium' | 'low'

export function useDeviceCapability() {
  const tier = useState<QualityTier>('deviceTier', () => 'medium')
  const dpr = useState('deviceDpr', () => 1)
  const isMobile = useState('isMobile', () => false)

  function detect() {
    if (import.meta.server) return

    // DPR
    dpr.value = Math.min(window.devicePixelRatio, 2)

    // Mobile detection
    isMobile.value = /Android|iPhone|iPad|iPod|webOS|BlackBerry/i.test(navigator.userAgent)
      || window.innerWidth < 768

    // GPU detection
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')

    if (!gl) {
      tier.value = 'low'
      canvas.remove()
      return
    }

    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    if (dbg) {
      const renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL).toLowerCase()

      // Low-end: integrated Intel, Mali-4xx, Adreno 3xx/4xx
      if (/intel|mali-[234]|adreno\s?[234]|sgx|powervr/i.test(renderer)) {
        tier.value = 'low'
      }
      // High-end: discrete GPU, Apple M-series, recent Adreno/Mali
      else if (/nvidia|radeon|apple m|adreno\s?[67]|mali-g[7-9]/i.test(renderer)) {
        tier.value = 'high'
      }
      // Default: medium
      else {
        tier.value = 'medium'
      }
    }

    canvas.remove()

    // Override: mobile + low DPR = force low
    if (isMobile.value && dpr.value <= 1) {
      tier.value = 'low'
    }
  }

  // Quality settings per tier
  const qualitySettings = computed(() => {
    switch (tier.value) {
      case 'high':
        return { particleCount: 3000, dpr: Math.min(dpr.value, 2), antialias: true, shadows: true }
      case 'medium':
        return { particleCount: 1500, dpr: Math.min(dpr.value, 1.5), antialias: true, shadows: false }
      case 'low':
        return { particleCount: 500, dpr: 1, antialias: false, shadows: false }
    }
  })

  return {
    tier: readonly(tier),
    dpr: readonly(dpr),
    isMobile: readonly(isMobile),
    qualitySettings,
    detect,
  }
}
