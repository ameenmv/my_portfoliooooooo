import { a as useI18n, c as useTheme, b as useHead$1, C as ClientOnly, N as NuxtLink } from '../virtual/entry.mjs';
import { defineComponent, ref, computed, mergeProps, unref, reactive, withCtx, createVNode, toDisplayString, openBlock, createBlock, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
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

//#region app/components/sections/ManifestoSection.vue?vue&type=script&setup=true&lang.ts
var ManifestoSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ManifestoSection",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* ManifestoSection — Horizontal-scrolling sentence at 12vw.
		* Exact replica of guillaumezhu.com:
		* - Overlaps hero with negative margin (-55vh)
		* - Cream background, dark text
		* - Each letter individually animated for stagger opacity
		* - Horizontal scroll via GSAP ScrollTrigger pin
		* - Text padded 101vw on each side for clean entry/exit
		*/
		const { t, locale } = useI18n();
		const sectionRef = ref();
		ref();
		ref();
		const manifesto = computed(() => t("home.manifesto"));
		const segments = computed(() => {
			const text = manifesto.value;
			if (locale.value === "ar") return text.split(" ").map((word, i) => ({
				content: word,
				isSpace: false,
				key: `w-${i}`
			})).flatMap((item, i, arr) => {
				if (i < arr.length - 1) return [item, {
					content: "\xA0",
					isSpace: true,
					key: `s-${i}`
				}];
				return [item];
			});
			return text.split("").map((char, i) => ({
				content: char === " " ? "\xA0" : char,
				isSpace: char === " ",
				key: `c-${i}`
			}));
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "manifesto",
				ref_key: "sectionRef",
				ref: sectionRef,
				class: "relative w-full bg-cream overflow-hidden -mt-[clamp(350px,45vh,500px)] z-[5]",
				style: { height: "max(400vh, 2400px)" },
				"data-theme": "cream"
			}, _attrs))}><div class="absolute top-0 inset-x-0 h-[80px] bg-cream rounded-t-block z-[1]"></div><div class="flex items-center w-full h-screen relative overflow-hidden"><div class="flex whitespace-nowrap will-change-transform" style="${ssrRenderStyle({
				paddingInlineStart: "101vw",
				paddingInlineEnd: "101vw"
			})}"><!--[-->`);
			ssrRenderList(unref(segments), (seg) => {
				_push(`<span class="${ssrRenderClass([[seg.isSpace ? "w-[0.3em]" : "", unref(locale) === "ar" ? "text-[clamp(48px,10vw,80px)]" : "text-[12vw]"], "manifesto-char inline-block font-display font-bold leading-none select-none cursor-default will-change-[opacity]"])}" style="${ssrRenderStyle({
					letterSpacing: "var(--letter-spacing-display, -0.025em)",
					color: "var(--color-dark, #1f1d1d)"
				})}">${ssrInterpolate(seg.content)}</span>`);
			});
			_push(`<!--]--></div></div></section>`);
		};
	}
});
//#endregion
//#region app/components/sections/ManifestoSection.vue
var _sfc_setup$4 = ManifestoSection_vue_vue_type_script_setup_true_lang_default.setup;
ManifestoSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sections/ManifestoSection.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var ManifestoSection_default = Object.assign(ManifestoSection_vue_vue_type_script_setup_true_lang_default, { __name: "SectionsManifestoSection" });
//#endregion
//#region app/components/sections/TrajectorySection.vue?vue&type=script&setup=true&lang.ts
var TrajectorySection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "TrajectorySection",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* TrajectorySection — "My Journey" pinned sequence.
		* Exact replica of guillaumezhu.com:
		* - Title "My journey" at 12vw
		* - 1100vh pinned with 7 sentence reveals
		* - Split left/right background panels that slide in/out
		* - Background transitions between cream/dark per sentence pair
		*/
		const { t } = useI18n();
		const sectionRef = ref();
		ref();
		ref();
		ref();
		const sentences = computed(() => [
			{
				lines: [t("home.trajectorySentence1")],
				bg: "dark"
			},
			{
				lines: [t("home.trajectorySentence2Line1"), t("home.trajectorySentence2Line2")],
				bg: "cream"
			},
			{
				lines: [t("home.trajectorySentence3")],
				bg: "dark"
			},
			{
				lines: [t("home.trajectorySentence4Line1"), t("home.trajectorySentence4Line2")],
				bg: "cream"
			},
			{
				lines: [t("home.trajectorySentence5")],
				bg: "dark"
			},
			{
				lines: [t("home.trajectorySentence6")],
				bg: "dark"
			},
			{
				lines: [t("home.trajectorySentence7")],
				bg: "cream"
			}
		]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "parcours",
				ref_key: "sectionRef",
				ref: sectionRef,
				class: "relative w-full bg-dark",
				"data-theme": "dark"
			}, _attrs))}><div class="flex items-center justify-center h-screen will-change-transform"><h2 class="text-cream text-center font-display text-[12vw] max-sm:text-[clamp(48px,14vw,72px)] font-bold tracking-display leading-[0.85]">${ssrInterpolate(unref(t)("home.trajectoryTitle"))}</h2></div><div class="h-[1100vh]"><div class="sticky top-0 h-screen overflow-hidden"><div class="absolute inset-0 z-[1]"><!--[-->`);
			ssrRenderList(unref(sentences), (sentence, i) => {
				_push(`<div class="${ssrRenderClass([[i % 2 === 0 ? "inset-y-0 start-0 w-1/2" : "inset-y-0 end-0 w-1/2", sentence.bg === "cream" ? "bg-cream" : "bg-dark"], "trajectory-panel absolute will-change-transform"])}" style="${ssrRenderStyle({ transform: `translateX(${i % 2 === 0 ? "-100" : "100"}%)` })}"></div>`);
			});
			_push(`<!--]--></div><div class="relative z-[2] flex items-center justify-center h-full"><div class="relative w-full max-w-[80vw]"><!--[-->`);
			ssrRenderList(unref(sentences), (sentence, i) => {
				_push(`<p class="${ssrRenderClass([[
					sentence.bg === "cream" ? "text-dark" : "text-cream",
					sentence.lines.length > 1 ? "text-[clamp(36px,8vw,96px)]" : "text-[clamp(42px,10vw,120px)]",
					i > 0 ? "absolute inset-0 flex flex-col items-center justify-center" : "flex flex-col items-center justify-center"
				], "trajectory-sentence text-center font-display font-bold tracking-display leading-[0.85] will-change-transform"])}" style="${ssrRenderStyle(i > 0 ? { opacity: 0 } : {})}"><!--[-->`);
				ssrRenderList(sentence.lines, (line, j) => {
					_push(`<span class="block">${ssrInterpolate(line)}</span>`);
				});
				_push(`<!--]--></p>`);
			});
			_push(`<!--]--></div></div></div></div></section>`);
		};
	}
});
//#endregion
//#region app/components/sections/TrajectorySection.vue
var _sfc_setup$3 = TrajectorySection_vue_vue_type_script_setup_true_lang_default.setup;
TrajectorySection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sections/TrajectorySection.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var TrajectorySection_default = Object.assign(TrajectorySection_vue_vue_type_script_setup_true_lang_default, { __name: "SectionsTrajectorySection" });
//#endregion
//#region app/components/sections/ProjectsSection.vue?vue&type=script&setup=true&lang.ts
var ProjectsSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "ProjectsSection",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* ProjectsSection — Interactive project list with letter hover effects.
		* Mirrors guillaumezhu.com:
		* - Container scales up from dark section (cream bg)
		* - Large italic project names
		* - Hover: dimming + underline + cursor image reveal
		* - Each letter reacts to scroll velocity with subtle spring
		*/
		const { t, locale } = useI18n();
		const sectionRef = ref();
		ref();
		ref();
		const projects = [
			{
				name: "SAAF",
				slug: "saaf",
				description: "Enterprise Fintech Ecosystem"
			},
			{
				name: "Haze Clue",
				slug: "haze-clue",
				description: "Real-Time BCI Platform"
			},
			{
				name: "Sa5er CLI",
				slug: "sa5er",
				description: "Sarcastic Egyptian Dev CLI"
			},
			{
				name: "Athar",
				slug: "athar",
				description: "Local-First MCP Server"
			},
			{
				name: "Nabeeh",
				slug: "nabeeh",
				description: "Real-Time Multiplayer"
			}
		];
		const hoveredIndex = ref(null);
		reactive({
			x: 0,
			y: 0
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "projects",
				ref_key: "sectionRef",
				ref: sectionRef,
				class: "relative w-full",
				"data-theme": "cream"
			}, _attrs))}><div class="h-[360vh]"><div class="sticky top-0 h-screen bg-cream overflow-hidden will-change-transform origin-top"><div class="flex flex-col items-center justify-center h-full px-[5vw]"><h2 class="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-dark/40 mb-[clamp(24px,4vh,48px)]">${ssrInterpolate(unref(t)("home.projectsTitle"))}</h2><nav class="flex flex-col items-center"><!--[-->`);
			ssrRenderList(projects, (project, i) => {
				_push(`<div class="project-item overflow-hidden">`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: `/projects/${project.slug}`,
					class: "group relative block py-[clamp(4px,0.8vh,12px)] cursor-pointer",
					onMouseenter: ($event) => hoveredIndex.value = i,
					onMouseleave: ($event) => hoveredIndex.value = null
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<span class="${ssrRenderClass([["text-[clamp(44px,7vw,88px)]", unref(hoveredIndex) === null || unref(hoveredIndex) === i ? "opacity-100 translate-x-0" : "opacity-15"], "font-display italic font-medium tracking-display leading-[1.05] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] block"])}" style="${ssrRenderStyle({ color: "var(--color-dark, #1f1d1d)" })}"${_scopeId}>${ssrInterpolate(project.name)}</span><span class="${ssrRenderClass([unref(hoveredIndex) === i ? "scale-x-100" : "scale-x-0", "absolute bottom-[0.1em] inset-x-0 h-[2px] bg-dark/80 origin-left transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]"])}"${_scopeId}></span><span class="${ssrRenderClass([[unref(hoveredIndex) === i ? "opacity-100 end-0 translate-x-[calc(100%+24px)]" : "opacity-0 end-0 translate-x-[calc(100%+16px)]"], "absolute top-1/2 -translate-y-1/2 font-body text-[clamp(12px,1vw,16px)] font-medium text-dark/50 transition-all duration-300 pointer-events-none whitespace-nowrap"])}"${_scopeId}>${ssrInterpolate(project.description)}</span>`);
						else return [
							createVNode("span", {
								class: ["font-display italic font-medium tracking-display leading-[1.05] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] block", ["text-[clamp(44px,7vw,88px)]", unref(hoveredIndex) === null || unref(hoveredIndex) === i ? "opacity-100 translate-x-0" : "opacity-15"]],
								style: { color: "var(--color-dark, #1f1d1d)" }
							}, toDisplayString(project.name), 3),
							createVNode("span", { class: ["absolute bottom-[0.1em] inset-x-0 h-[2px] bg-dark/80 origin-left transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]", unref(hoveredIndex) === i ? "scale-x-100" : "scale-x-0"] }, null, 2),
							createVNode("span", { class: ["absolute top-1/2 -translate-y-1/2 font-body text-[clamp(12px,1vw,16px)] font-medium text-dark/50 transition-all duration-300 pointer-events-none whitespace-nowrap", [unref(hoveredIndex) === i ? "opacity-100 end-0 translate-x-[calc(100%+24px)]" : "opacity-0 end-0 translate-x-[calc(100%+16px)]"]] }, toDisplayString(project.description), 3)
						];
					}),
					_: 2
				}, _parent));
				_push(`</div>`);
			});
			_push(`<!--]--></nav></div></div></div></section>`);
		};
	}
});
//#endregion
//#region app/components/sections/ProjectsSection.vue
var _sfc_setup$2 = ProjectsSection_vue_vue_type_script_setup_true_lang_default.setup;
ProjectsSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sections/ProjectsSection.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var ProjectsSection_default = Object.assign(ProjectsSection_vue_vue_type_script_setup_true_lang_default, { __name: "SectionsProjectsSection" });
//#endregion
//#region app/components/sections/FooterSection.vue?vue&type=script&setup=true&lang.ts
var FooterSection_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "FooterSection",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* FooterSection — SVG text path + circle-reveal footer.
		* Exact replica of guillaumezhu.com:
		* - "What's next?" title → playground link
		* - Long SVG text on wavy path that scrolls horizontally
		* - Circle reveal clip-path for the actual footer
		* - Footer has CTA, nav links, social links, legal
		*/
		const { t } = useI18n();
		const sectionRef = ref();
		ref();
		ref();
		ref();
		ref();
		ref();
		const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<section${ssrRenderAttrs(mergeProps({
				id: "contact",
				ref_key: "sectionRef",
				ref: sectionRef,
				class: "relative w-full bg-dark text-cream",
				"data-theme": "dark"
			}, _attrs))}><div class="flex items-center justify-center h-[70vh]"><div class="text-center will-change-transform"><h2 class="font-display text-[clamp(48px,10vw,140px)] font-bold tracking-display leading-[0.85]">${ssrInterpolate(unref(t)("home.nextIntro"))}</h2></div></div><div class="flex justify-center pb-[8vh]">`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/playground",
				class: "group inline-flex items-center gap-3 font-body text-[clamp(16px,1.4vw,24px)] font-medium text-cream/70 hover:text-cream transition-colors duration-300"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<span${_scopeId}>${ssrInterpolate(unref(t)("home.playgroundLink"))}</span><svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${_scopeId}><path d="M7 17L17 7M17 7H7M17 7V17" stroke-linecap="round" stroke-linejoin="round"${_scopeId}></path></svg>`);
					else return [createVNode("span", null, toDisplayString(unref(t)("home.playgroundLink")), 1), (openBlock(), createBlock("svg", {
						class: "w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						"stroke-width": "2"
					}, [createVNode("path", {
						d: "M7 17L17 7M17 7H7M17 7V17",
						"stroke-linecap": "round",
						"stroke-linejoin": "round"
					})]))];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="h-[300vh]"><div class="svg-pin h-screen overflow-hidden flex items-center"><svg class="w-[300vw] min-w-[2400px] h-[45vh] will-change-transform" viewBox="0 0 3000 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="svg-text-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f5e7df"></stop><stop offset="25%" stop-color="#f6c177"></stop><stop offset="50%" stop-color="#ff6b4a"></stop><stop offset="75%" stop-color="#9b7cff"></stop><stop offset="100%" stop-color="#f5e7df"></stop></linearGradient><path id="wavy-path" d="M 0 150 C 250 50, 500 220, 750 120 C 1000 20, 1250 200, 1500 100 C 1750 0, 2000 180, 2250 80 C 2500 0, 2750 150, 3000 100" fill="none"></path></defs><text font-family="CabinetGrotesk, Alexandria, sans-serif" font-size="52" font-weight="700" fill="url(#svg-text-gradient)"><textPath href="#wavy-path" startOffset="0%">${ssrInterpolate(unref(t)("home.nextTextCream"))} · ${ssrInterpolate(unref(t)("home.nextTextGradient"))} · ${ssrInterpolate(unref(t)("home.nextTextCream"))}</textPath></text></svg></div></div><footer class="relative min-h-screen"${ssrRenderAttr("aria-label", unref(t)("home.footerLabel"))}><div class="min-h-screen will-change-[clip-path]" style="${ssrRenderStyle({ "clip-path": "circle(0% at 50% 50%)" })}"><div class="min-h-screen flex flex-col items-center justify-between bg-cream text-dark rounded-block mx-[clamp(8px,2vw,16px)] overflow-hidden"><div class="flex-1 flex flex-col items-center justify-center gap-8 px-[5vw] py-[120px] text-center"><p class="font-display text-[clamp(44px,8vw,120px)] font-bold leading-[0.88] tracking-display"><span class="block">${ssrInterpolate(unref(t)("home.footerLine1"))}</span><span class="block">${ssrInterpolate(unref(t)("home.footerLine2"))}</span></p><p class="font-body text-[clamp(14px,1.2vw,20px)] font-medium text-dark/50 max-w-[500px]">${ssrInterpolate(unref(t)("home.footerLine3"))}</p><a href="mailto:ameeenmv@gmail.com" class="group inline-flex items-center gap-3 mt-4 px-8 py-4 bg-dark text-cream rounded-full font-body text-[clamp(14px,1.1vw,18px)] font-medium transition-all duration-300 hover:bg-accent-orange hover:scale-105"><span>ameeenmv@gmail.com</span><svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke-linecap="round" stroke-linejoin="round"></path></svg></a></div><div class="w-full px-[clamp(24px,4vw,48px)] pb-8"><nav class="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8 font-body text-[clamp(13px,1vw,16px)] font-medium"${ssrRenderAttr("aria-label", unref(t)("home.footerNavigationLabel"))}>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/",
				class: "text-link text-dark/60 hover:text-dark"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Home`);
					else return [createTextVNode("Home")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/#parcours",
				class: "text-link text-dark/60 hover:text-dark"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${ssrInterpolate(unref(t)("home.footerJourney"))}`);
					else return [createTextVNode(toDisplayString(unref(t)("home.footerJourney")), 1)];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/#projects",
				class: "text-link text-dark/60 hover:text-dark"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${ssrInterpolate(unref(t)("home.footerProjects"))}`);
					else return [createTextVNode(toDisplayString(unref(t)("home.footerProjects")), 1)];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/contact",
				class: "text-link text-dark/60 hover:text-dark"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${ssrInterpolate(unref(t)("nav.contact"))}`);
					else return [createTextVNode(toDisplayString(unref(t)("nav.contact")), 1)];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/playground",
				class: "text-link text-dark/60 hover:text-dark"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${ssrInterpolate(unref(t)("nav.playground"))}`);
					else return [createTextVNode(toDisplayString(unref(t)("nav.playground")), 1)];
				}),
				_: 1
			}, _parent));
			_push(`</nav><div class="flex justify-center gap-6 mb-8 font-body text-[clamp(13px,1vw,16px)]"><a href="mailto:ameeenmv@gmail.com" class="text-link text-dark/40 hover:text-dark">Email</a><a href="#" class="text-link text-dark/40 hover:text-dark">LinkedIn</a><a href="#" class="text-link text-dark/40 hover:text-dark">GitHub</a><a href="#" class="text-link text-dark/40 hover:text-dark">YouTube</a></div><div class="flex justify-between items-center font-body text-[11px] text-dark/30"><span>© ${ssrInterpolate(unref(currentYear))} Ameen Mohamed</span><span>${ssrInterpolate(unref(t)("home.legalNotice"))}</span></div></div></div></div></footer></section>`);
		};
	}
});
//#endregion
//#region app/components/sections/FooterSection.vue
var _sfc_setup$1 = FooterSection_vue_vue_type_script_setup_true_lang_default.setup;
FooterSection_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sections/FooterSection.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var FooterSection_default = Object.assign(FooterSection_vue_vue_type_script_setup_true_lang_default, { __name: "SectionsFooterSection" });
//#endregion
//#region app/pages/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		/**
		* Home page — all sections assembled with theme coordination.
		* Mirrors guillaumezhu.com exact scroll order and theme switching.
		*/
		const { t } = useI18n();
		useTheme();
		useHead$1({
			title: "Ameen Mohamed — Front-End Engineer",
			meta: [{
				name: "description",
				content: () => t("home.description")
			}]
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_ClientOnly = ClientOnly;
			const _component_SectionsManifestoSection = ManifestoSection_default;
			const _component_SectionsTrajectorySection = TrajectorySection_default;
			const _component_SectionsProjectsSection = ProjectsSection_default;
			const _component_SectionsFooterSection = FooterSection_default;
			_push(`<main${ssrRenderAttrs(_attrs)}>`);
			_push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
			_push(ssrRenderComponent(_component_SectionsManifestoSection, null, null, _parent));
			_push(ssrRenderComponent(_component_SectionsTrajectorySection, null, null, _parent));
			_push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
			_push(ssrRenderComponent(_component_SectionsProjectsSection, null, null, _parent));
			_push(ssrRenderComponent(_component_SectionsFooterSection, null, null, _parent));
			_push(`</main>`);
		};
	}
});
//#endregion
//#region app/pages/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var pages_default = index_vue_vue_type_script_setup_true_lang_default;

export { pages_default as default };
//# sourceMappingURL=pages-BHm6DwiX.mjs.map
