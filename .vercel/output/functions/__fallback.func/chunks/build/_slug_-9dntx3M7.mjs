import { u as useRoute$1, a as useI18n, b as useHead$1, N as NuxtLink } from '../virtual/entry.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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

//#region app/pages/projects/[slug].vue?vue&type=script&setup=true&lang.ts
var _slug__vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "[slug]",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Project page — horizontal scroll case study.
		* Mirrors guillaumezhu.com: pinned horizontal track with panels.
		*/
		const route = useRoute$1();
		const { locale } = useI18n();
		const slug = computed(() => route.params.slug);
		ref();
		ref();
		const projectMap = {
			saaf: {
				title: "SAAF",
				theme: "cream",
				tagline: "Enterprise Fintech Ecosystem",
				stack: [
					"Vue 3",
					"Nuxt.js",
					"Pinia",
					"Pusher",
					"Laravel Echo",
					"Chart.js",
					"SSR"
				],
				description: "A comprehensive fintech platform with real-time WebSocket layer, two-tier RBAC system, and near-perfect Core Web Vitals.",
				facts: [
					"840+ unique views",
					"1,180+ reusable components",
					"33 persistent Pinia stores",
					"Real-time via Pusher/Echo"
				]
			},
			"haze-clue": {
				title: "Haze Clue",
				theme: "dark",
				tagline: "Real-Time BCI Platform",
				stack: [
					"Nuxt 4",
					"NestJS",
					"MongoDB",
					"Socket.IO",
					"Chart.js",
					"i18n"
				],
				description: "Full-stack cognitive-monitoring platform with live EEG data streams from BCI devices. Sub-second latency real-time data broadcasting.",
				facts: [
					"Live EEG streams",
					"JWT/OTP auth",
					"Bilingual RTL/LTR",
					"Sub-second latency"
				]
			},
			sa5er: {
				title: "Sa5er CLI",
				theme: "dark",
				tagline: "Sarcastic Egyptian Senior Dev",
				stack: [
					"Node.js",
					"Terminal APIs",
					"Caching",
					"Gemini/Grok"
				],
				description: "AI-powered CLI that intercepts terminal errors with context-aware fixes. 3-tier error resolution architecture with Egyptian personality.",
				facts: [
					"Published on npm",
					"AI-powered",
					"3-tier error resolution",
					"Local caching"
				]
			},
			athar: {
				title: "Athar",
				theme: "cream",
				tagline: "Local-First MCP Server",
				stack: [
					"Node.js",
					"Nuxt 4",
					"SQLite",
					"MCP Protocol"
				],
				description: "MCP server capturing AI-generated bug resolutions into a developer knowledge base. SM-2 spaced repetition algorithm.",
				facts: [
					"Published on npm",
					"Open source",
					"SM-2 algorithm",
					"Local SQLite"
				]
			},
			nabeeh: {
				title: "Nabeeh",
				theme: "cream",
				tagline: "Real-Time Multiplayer Platform",
				stack: [
					"Nuxt.js",
					"Socket.IO",
					"Nuxt UI",
					"Tailwind CSS"
				],
				description: "Real-time multiplayer game logic with live score synchronization across concurrent sessions.",
				facts: [
					"Real-time multiplayer",
					"Live score sync",
					"Socket.IO",
					"Concurrent sessions"
				]
			}
		};
		const project = computed(() => projectMap[slug.value] || {
			title: slug.value,
			theme: "cream",
			tagline: "",
			stack: [],
			description: "",
			facts: []
		});
		useHead$1({ title: () => `${project.value.title} — Ameen Mohamed` });
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<main${ssrRenderAttrs(mergeProps({ class: ["min-h-screen", unref(project).theme === "dark" ? "bg-dark text-cream" : "bg-cream text-dark"] }, _attrs))}>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/#projects",
				class: ["fixed top-1/2 start-[clamp(16px,3vw,32px)] -translate-y-1/2 z-[100] opacity-60 hover:opacity-100 transition-opacity", unref(project).theme === "dark" ? "text-cream" : "text-dark"],
				"aria-label": "Back to project list"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<svg width="62" height="15" viewBox="0 0 62 15" fill="none" aria-hidden="true" class="${ssrRenderClass(unref(locale) === "ar" ? "scale-x-[-1]" : "")}"${_scopeId}><path d="M60.3018 7.37256L2.30176 7.37256" stroke="currentColor" stroke-width="2" stroke-linecap="round"${_scopeId}></path><path d="M7.26025 13.7279L1.07307 7.54074C0.975439 7.44311 0.975439 7.28482 1.07307 7.18718L7.26025 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"${_scopeId}></path></svg>`);
					else return [(openBlock(), createBlock("svg", {
						width: "62",
						height: "15",
						viewBox: "0 0 62 15",
						fill: "none",
						"aria-hidden": "true",
						class: unref(locale) === "ar" ? "scale-x-[-1]" : ""
					}, [createVNode("path", {
						d: "M60.3018 7.37256L2.30176 7.37256",
						stroke: "currentColor",
						"stroke-width": "2",
						"stroke-linecap": "round"
					}), createVNode("path", {
						d: "M7.26025 13.7279L1.07307 7.54074C0.975439 7.44311 0.975439 7.28482 1.07307 7.18718L7.26025 1",
						stroke: "currentColor",
						"stroke-width": "2",
						"stroke-linecap": "round"
					})], 2))];
				}),
				_: 1
			}, _parent));
			_push(`<section class="overflow-hidden"><div class="flex h-screen will-change-transform"><div class="project-panel flex-none w-screen h-screen flex flex-col items-center justify-center gap-6 px-[5vw]"><span class="font-body text-xs font-bold tracking-[0.15em] uppercase opacity-50">Project</span><h1 class="font-display text-[clamp(64px,15vw,160px)] font-bold tracking-display italic leading-[0.85]">${ssrInterpolate(unref(project).title)}</h1><p class="font-display text-[clamp(18px,2.5vw,32px)] font-light opacity-70">${ssrInterpolate(unref(project).tagline)}</p></div><div class="project-panel flex-none w-screen h-screen flex flex-col items-center justify-center gap-8 px-[10vw]"><p class="font-display text-[clamp(24px,3vw,48px)] font-medium leading-[1.2] tracking-display text-center max-w-[800px]">${ssrInterpolate(unref(project).description)}</p><div class="flex flex-wrap justify-center gap-3"><!--[-->`);
			ssrRenderList(unref(project).stack, (tech) => {
				_push(`<span class="${ssrRenderClass([unref(project).theme === "dark" ? "border-cream/20" : "border-dark/20", "font-body text-[clamp(12px,1vw,16px)] font-medium px-4 py-2.5 border rounded-full"])}">${ssrInterpolate(tech)}</span>`);
			});
			_push(`<!--]--></div></div><div class="project-panel flex-none w-screen h-screen flex flex-col items-center justify-center gap-8 px-[10vw]"><h2 class="font-body text-xs font-bold tracking-[0.15em] uppercase opacity-50">Key facts</h2><div class="grid grid-cols-2 gap-6 max-w-[600px]"><!--[-->`);
			ssrRenderList(unref(project).facts, (fact) => {
				_push(`<div class="font-display text-[clamp(20px,2.5vw,36px)] font-bold tracking-display text-center">${ssrInterpolate(fact)}</div>`);
			});
			_push(`<!--]--></div></div><div class="project-panel flex-none w-screen h-screen flex flex-col items-center justify-center gap-8 px-[10vw]"><span class="font-body text-xs font-bold tracking-[0.15em] uppercase opacity-50">Other projects</span><div class="flex flex-col items-center gap-4"><!--[-->`);
			ssrRenderList(Object.entries(projectMap).filter(([k]) => k !== unref(slug)), (p) => {
				_push(ssrRenderComponent(_component_NuxtLink, {
					key: p[0],
					to: `/projects/${p[0]}`,
					class: "font-display text-[clamp(32px,5vw,64px)] font-medium italic tracking-display opacity-60 hover:opacity-100 transition-opacity"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${ssrInterpolate(p[1].title)}`);
						else return [createTextVNode(toDisplayString(p[1].title), 1)];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div></div></div></section></main>`);
		};
	}
});
//#endregion
//#region app/pages/projects/[slug].vue
var _sfc_setup = _slug__vue_vue_type_script_setup_true_lang_default.setup;
_slug__vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _slug__default = _slug__vue_vue_type_script_setup_true_lang_default;

export { _slug__default as default };
//# sourceMappingURL=_slug_-9dntx3M7.mjs.map
