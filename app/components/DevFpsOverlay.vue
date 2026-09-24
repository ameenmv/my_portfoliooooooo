<script setup lang="ts">
const fps = ref(0)
const gpuTier = ref('detecting...')
const drawCalls = ref(0)
let frameCount = 0
let lastTime = performance.now()

onMounted(() => {
  // FPS counter
  function tick() {
    frameCount++
    const now = performance.now()
    if (now - lastTime >= 1000) {
      fps.value = frameCount
      frameCount = 0
      lastTime = now
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)

  // GPU tier detection
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
  if (gl) {
    const dbgInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (dbgInfo) {
      const renderer = gl.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL)
      gpuTier.value = renderer.length > 40 ? renderer.substring(0, 40) + '…' : renderer
    } else {
      gpuTier.value = 'WebGL (no debug info)'
    }
  } else {
    gpuTier.value = 'No WebGL'
  }
  canvas.remove()
})
</script>

<template>
  <div v-if="$config.public?.dev !== false" class="fps-overlay">
    <div class="fps-overlay__row">
      <span class="fps-overlay__label">FPS</span>
      <span class="fps-overlay__value" :class="{ 'fps-overlay__value--warn': fps < 50, 'fps-overlay__value--bad': fps < 30 }">
        {{ fps }}
      </span>
    </div>
    <div class="fps-overlay__row">
      <span class="fps-overlay__label">DPR</span>
      <span class="fps-overlay__value">{{ typeof window !== 'undefined' ? window.devicePixelRatio.toFixed(1) : '—' }}</span>
    </div>
    <div class="fps-overlay__row">
      <span class="fps-overlay__label">GPU</span>
      <span class="fps-overlay__value fps-overlay__value--gpu">{{ gpuTier }}</span>
    </div>
  </div>
</template>

<style scoped>
.fps-overlay {
  position: fixed;
  top: 12px;
  inset-inline-end: 12px;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.85);
  color: #0f0;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 11px;
  line-height: 1.6;
  padding: 8px 12px;
  border-radius: 8px;
  pointer-events: none;
  backdrop-filter: blur(4px);
  min-width: 140px;
}

.fps-overlay__row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.fps-overlay__label {
  opacity: 0.6;
}

.fps-overlay__value {
  font-weight: 700;
}

.fps-overlay__value--warn {
  color: #ffcc00;
}

.fps-overlay__value--bad {
  color: #ff3333;
}

.fps-overlay__value--gpu {
  font-size: 9px;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
