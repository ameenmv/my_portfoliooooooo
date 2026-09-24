<script setup lang="ts">
/**
 * MagneticButton — Element that attracts toward cursor on hover.
 * Mirrors guillaumezhu.com: links/buttons have subtle magnetic pull.
 * Uses RAF for smooth interpolation.
 */

const props = defineProps<{
  /** Magnetic strength (px pull distance). Default 10 */
  strength?: number
  /** Element tag. Default 'div' */
  tag?: string
}>()

const tag = computed(() => props.tag || 'div')
const strength = computed(() => props.strength ?? 10)

const elRef = ref<HTMLElement>()
const pos = reactive({ x: 0, y: 0 })
const target = reactive({ x: 0, y: 0 })
let raf: number | null = null
let isHovering = false

function onEnter() {
  isHovering = true
  if (!raf) tick()
}

function onLeave() {
  isHovering = false
  target.x = 0
  target.y = 0
}

function onMove(e: MouseEvent) {
  if (!elRef.value || !isHovering) return
  const rect = elRef.value.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  target.x = (e.clientX - cx) * (strength.value / rect.width)
  target.y = (e.clientY - cy) * (strength.value / rect.height)
}

function tick() {
  pos.x += (target.x - pos.x) * 0.15
  pos.y += (target.y - pos.y) * 0.15

  if (elRef.value) {
    elRef.value.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
  }

  // Stop RAF when resting
  if (!isHovering && Math.abs(pos.x) < 0.1 && Math.abs(pos.y) < 0.1) {
    pos.x = 0
    pos.y = 0
    if (elRef.value) elRef.value.style.transform = ''
    raf = null
    return
  }

  raf = requestAnimationFrame(tick)
}

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <component
    :is="tag"
    ref="elRef"
    class="will-change-transform"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @mousemove="onMove"
  >
    <slot />
  </component>
</template>
