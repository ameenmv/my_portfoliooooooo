<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: () => t('contact.title'),
  meta: [
    { name: 'description', content: () => t('contact.description') },
  ],
})
</script>

<template>
  <main class="bg-dark text-cream min-h-screen" data-header-capsule-variant="soft-white">
    <section class="flex flex-col items-center justify-center min-h-screen gap-[clamp(32px,5vh,56px)] px-4 pt-[120px] pb-4 text-center" aria-labelledby="contact-title">
      <h1 id="contact-title" class="font-display text-[clamp(36px,7vw,96px)] font-bold leading-[0.95] tracking-display">
        <span class="block">{{ t('contact.headingLine1') }}</span>
        <span class="block">{{ t('contact.headingLine2') }}</span>
        <span class="block">{{ t('contact.headingLine3') }}</span>
      </h1>

      <div class="font-body text-[clamp(14px,1.2vw,18px)] opacity-70">
        <p>{{ t('contact.availability') }}</p>
        <p>{{ t('contact.availabilityMeta') }}</p>
      </div>

      <div>
        <h2 class="sr-only">{{ t('contact.servicesLabel') }}</h2>
        <ul class="flex flex-wrap justify-center gap-3">
          <li class="font-body text-[clamp(14px,1vw,16px)] font-medium px-5 py-4 border border-cream/20 rounded-full">
            {{ t('contact.serviceCreativeDevelopment') }}
          </li>
          <li class="font-body text-[clamp(14px,1vw,16px)] font-medium px-5 py-4 border border-cream/20 rounded-full">
            {{ t('contact.serviceImmersiveExperiences') }}
          </li>
          <li class="font-body text-[clamp(14px,1vw,16px)] font-medium px-5 py-4 border border-cream/20 rounded-full">
            {{ t('contact.serviceInteractiveInterfaces') }}
          </li>
        </ul>
      </div>

      <a
        class="text-link font-body text-[clamp(18px,2vw,28px)] font-medium"
        href="mailto:ameeenmv@gmail.com"
        :aria-label="t('contact.emailLabel')"
      >
        {{ t('contact.email') }}
      </a>
    </section>
  </main>
</template>
