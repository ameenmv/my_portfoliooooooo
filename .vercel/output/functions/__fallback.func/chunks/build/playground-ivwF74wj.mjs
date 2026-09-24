import { a as useI18n, c as useTheme, b as useHead$1 } from '../virtual/entry.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
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

//#region app/pages/playground.vue?vue&type=script&setup=true&lang.ts
var playground_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "playground",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Playground — 3D sphere of experiment cards.
		* Mirrors guillaumezhu.com/playground/:
		* - Three.js sphere with experiment items as points
		* - Click/hover reveals experiment info
		* - Sphere rotates slowly, speeds up on drag
		*/
		const { t } = useI18n();
		useTheme();
		ref();
		ref(null);
		useHead$1({
			title: () => t("playground.title"),
			meta: [{
				name: "description",
				content: () => t("playground.description")
			}]
		});
		const experiments = [
			{
				title: "V8 JIT Pipeline",
				cat: "YouTube",
				color: 16739146
			},
			{
				title: "Sa5er CLI",
				cat: "npm",
				color: 10190079
			},
			{
				title: "Athar MCP",
				cat: "npm",
				color: 16171383
			},
			{
				title: "Shader Noise",
				cat: "WebGL",
				color: 16739146
			},
			{
				title: "Browser Rendering",
				cat: "YouTube",
				color: 10190079
			},
			{
				title: "Multiplayer",
				cat: "Socket.IO",
				color: 16171383
			},
			{
				title: "EEG Viz",
				cat: "BCI",
				color: 16739146
			},
			{
				title: "GSAP Scroll",
				cat: "Study",
				color: 10190079
			},
			{
				title: "Tech Gates VI",
				cat: "Community",
				color: 16171383
			},
			{
				title: "Pinia Stores",
				cat: "Vue.js",
				color: 16739146
			},
			{
				title: "WebSocket",
				cat: "Real-time",
				color: 10190079
			},
			{
				title: "i18n RTL",
				cat: "Study",
				color: 16171383
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<main${ssrRenderAttrs(mergeProps({ class: "bg-dark text-cream min-h-screen relative overflow-hidden" }, _attrs))}><h1 class="sr-only">${ssrInterpolate(unref(t)("playground.heading"))}</h1><canvas class="absolute inset-0 w-full h-full z-[1] cursor-grab active:cursor-grabbing"></canvas><div class="absolute inset-0 z-[2] pointer-events-none flex flex-col items-center justify-between py-[120px]"><h2 class="font-display text-[clamp(32px,5vw,64px)] font-bold tracking-display text-center opacity-80"> Playground </h2><div class="pointer-events-auto w-full max-w-[600px] px-6"><div class="grid grid-cols-2 sm:grid-cols-3 gap-2"><!--[-->`);
			ssrRenderList(experiments, (exp, i) => {
				_push(`<div class="group flex items-center gap-2 px-3 py-2 rounded-lg cursor-default transition-all duration-200 hover:bg-cream/5"><span class="w-2 h-2 rounded-full shrink-0" style="${ssrRenderStyle({ backgroundColor: `#${exp.color.toString(16).padStart(6, "0")}` })}"></span><span class="font-body text-[12px] font-medium truncate opacity-60 group-hover:opacity-100 transition-opacity">${ssrInterpolate(exp.title)}</span></div>`);
			});
			_push(`<!--]--></div></div></div></main>`);
		};
	}
});
//#endregion
//#region app/pages/playground.vue
var _sfc_setup = playground_vue_vue_type_script_setup_true_lang_default.setup;
playground_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/playground.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var playground_default = playground_vue_vue_type_script_setup_true_lang_default;

export { playground_default as default };
//# sourceMappingURL=playground-ivwF74wj.mjs.map
