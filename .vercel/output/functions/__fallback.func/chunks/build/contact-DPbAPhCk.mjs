import { a as useI18n, c as useTheme, b as useHead$1 } from '../virtual/entry.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
import 'unhead/utils';
import '../routes/renderer.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-router';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@vue/shared';
import 'fnv1a-64';
import 'object-identity';

//#region app/pages/contact.vue?vue&type=script&setup=true&lang.ts
var contact_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "contact",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Contact page — letter-by-letter heading reveal + services.
		* Exact replica of guillaumezhu.com/contact/:
		* - Large heading with stagger letter reveal on mount
		* - Availability badge
		* - Service pills
		* - Email CTA
		*/
		const { t } = useI18n();
		useTheme();
		ref();
		ref();
		useHead$1({
			title: () => t("contact.title"),
			meta: [{
				name: "description",
				content: () => t("contact.description")
			}]
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<main${ssrRenderAttrs(mergeProps({ class: "bg-dark text-cream min-h-screen" }, _attrs))}><section class="flex flex-col items-center justify-center min-h-screen gap-[clamp(32px,6vh,64px)] px-[5vw] pt-[120px] pb-[80px] text-center" aria-labelledby="contact-title"><div><h1 id="contact-title" class="font-display text-[clamp(40px,8vw,110px)] font-bold leading-[0.88] tracking-display"><span class="block overflow-hidden"><span class="contact-line block will-change-transform">${ssrInterpolate(unref(t)("contact.headingLine1"))}</span></span><span class="block overflow-hidden"><span class="contact-line block will-change-transform">${ssrInterpolate(unref(t)("contact.headingLine2"))}</span></span><span class="block overflow-hidden"><span class="contact-line block will-change-transform italic text-accent-orange">${ssrInterpolate(unref(t)("contact.headingLine3"))}</span></span></h1></div><div class="flex flex-col items-center gap-[clamp(24px,4vh,48px)]"><div class="contact-reveal flex items-center gap-3 font-body text-[clamp(14px,1.2vw,18px)]"><span class="relative flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-orange/75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-accent-orange"></span></span><span class="opacity-70">${ssrInterpolate(unref(t)("contact.availability"))}</span><span class="opacity-40">·</span><span class="opacity-50">${ssrInterpolate(unref(t)("contact.availabilityMeta"))}</span></div><div class="contact-reveal"><h2 class="sr-only">${ssrInterpolate(unref(t)("contact.servicesLabel"))}</h2><ul class="flex flex-wrap justify-center gap-3"><li class="font-body text-[clamp(13px,1vw,16px)] font-medium px-5 py-3 border border-cream/15 rounded-full hover:border-cream/30 transition-colors duration-300 cursor-default">${ssrInterpolate(unref(t)("contact.serviceCreativeDevelopment"))}</li><li class="font-body text-[clamp(13px,1vw,16px)] font-medium px-5 py-3 border border-cream/15 rounded-full hover:border-cream/30 transition-colors duration-300 cursor-default">${ssrInterpolate(unref(t)("contact.serviceImmersiveExperiences"))}</li><li class="font-body text-[clamp(13px,1vw,16px)] font-medium px-5 py-3 border border-cream/15 rounded-full hover:border-cream/30 transition-colors duration-300 cursor-default">${ssrInterpolate(unref(t)("contact.serviceInteractiveInterfaces"))}</li></ul></div><a class="contact-reveal group inline-flex items-center gap-4 mt-4 px-8 py-5 bg-cream text-dark rounded-full font-body text-[clamp(16px,1.3vw,22px)] font-medium transition-all duration-300 hover:bg-accent-orange hover:text-cream hover:scale-105" href="mailto:ameeenmv@gmail.com"${ssrRenderAttr("aria-label", unref(t)("contact.emailLabel"))}><span>${ssrInterpolate(unref(t)("contact.email"))}</span><svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke-linecap="round" stroke-linejoin="round"></path></svg></a></div></section></main>`);
		};
	}
});
//#endregion
//#region app/pages/contact.vue
var _sfc_setup = contact_vue_vue_type_script_setup_true_lang_default.setup;
contact_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var contact_default = contact_vue_vue_type_script_setup_true_lang_default;

export { contact_default as default };
//# sourceMappingURL=contact-DPbAPhCk.mjs.map
