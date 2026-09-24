<script setup lang="ts">
const { t } = useI18n()

const sections = [
  { id: 'hero', label: 'Hero' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'parcours', labelKey: 'home.navigationJourney' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'projects', labelKey: 'home.navigationProjects' },
  { id: 'contact', labelKey: 'home.navigationNext' },
]

const activeIndex = useState('scrollIndicatorActive', () => 0)

function getLabel(section: typeof sections[number]) {
  if (section.labelKey) return t(section.labelKey)
  return section.label
}
</script>

<template>
  <nav
    class="fixed bottom-[clamp(24px,4vh,40px)] start-[clamp(20px,2vw,32px)] z-[900] flex flex-col items-start transition-colors duration-400 max-sm:hidden"
    :style="{ color: 'var(--current-interface-color, var(--color-dark))' }"
    :aria-label="t('home.sectionNavigationLabel')"
  >
    <a
      v-for="(section, i) in sections"
      :key="section.id"
      :href="`#${section.id}`"
      class="group relative flex items-center w-[52px] h-[18px] text-inherit"
      :aria-label="getLabel(section)"
      :aria-current="i === activeIndex ? 'location' : undefined"
    >
      <!-- Bar -->
      <span
        class="block relative h-[2px] overflow-hidden transition-[width] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)]"
        :class="{
          'w-[48px]': i === activeIndex,
          'w-[28px]': Math.abs(i - activeIndex) === 1,
          'w-[12px]': Math.abs(i - activeIndex) > 1,
        }"
        aria-hidden="true"
      >
        <!-- Background bar -->
        <span
          class="absolute inset-0 bg-current transition-opacity duration-350"
          :class="{
            'opacity-45': i === activeIndex,
            'opacity-55': Math.abs(i - activeIndex) === 1,
            'opacity-[0.28]': Math.abs(i - activeIndex) > 1,
          }"
        />
        <!-- Progress fill (active only) -->
        <span
          v-if="i === activeIndex"
          class="absolute inset-0 bg-current origin-left"
          :style="{ transform: `scaleX(var(--scroll-indicator-progress, 0))` }"
        />
      </span>

      <!-- Hover label -->
      <span
        class="absolute top-1/2 start-[calc(100%+8px)] -translate-y-1/2 whitespace-nowrap font-body text-sm font-medium opacity-0 pointer-events-none transition-all duration-250 group-hover:opacity-80"
      >
        {{ getLabel(section) }}
      </span>
    </a>
  </nav>
</template>
