<script setup lang="ts">
/**
 * CustomCursor — follows mouse with smooth lag.
 * Mirrors guillaumezhu.com's custom cursor dot that grows on interactive elements.
 */
const cursorRef = ref<HTMLElement>()
const cursorDotRef = ref<HTMLElement>()
const isHovering = ref(false)
const pos = reactive({ x: 0, y: 0 })
const target = reactive({ x: 0, y: 0 })

let raf: number

onMounted(() => {
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseenter', onEnter, true)
  document.addEventListener('mouseleave', onLeave, true)
  tick()
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMove)
  document.removeEventListener('mouseenter', onEnter, true)
  document.removeEventListener('mouseleave', onLeave, true)
  cancelAnimationFrame(raf)
})

function onMove(e: MouseEvent) {
  target.x = e.clientX
  target.y = e.clientY
}

function onEnter(e: Event) {
  const el = e.target as HTMLElement
  if (el.matches('a, button, [role="button"], .cursor-grow')) {
    isHovering.value = true
  }
}

function onLeave(e: Event) {
  const el = e.target as HTMLElement
  if (el.matches('a, button, [role="button"], .cursor-grow')) {
    isHovering.value = false
  }
}

function tick() {
  pos.x += (target.x - pos.x) * 0.12
  pos.y += (target.y - pos.y) * 0.12

  if (cursorRef.value) {
    cursorRef.value.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
  }

  raf = requestAnimationFrame(tick)
}
</script>

<template>
  <div
    ref="cursorRef"
    class="fixed top-0 left-0 z-[9998] pointer-events-none will-change-transform mix-blend-difference max-md:hidden"
    style="transform: translate3d(-100px, -100px, 0);"
  >
    <div
      ref="cursorDotRef"
      class="rounded-full -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      :class="isHovering ? 'w-12 h-12 bg-cream/30' : 'w-3 h-3 bg-cream'"
    />
  </div>
</template>
