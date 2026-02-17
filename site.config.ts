import siteConfig from "./src/utils/config";

const config = siteConfig({
	title: "Benson's Cafe",
	prologue: "CoffeeLite\nShare my thoughts with you.",
	author: {
		name: "Benson",
		email: "zhoubencheng2023@gmail.com",
		link: "ZhouBencheng.github.io"
	},
	description: "Blogs focused on technological content creation.",
	copyright: {
		type: "CC BY-NC-ND 4.0",
		year: "2026"
	},
	i18n: {
		locales: ["zh-cn"],
		defaultLocale: "zh-cn"
	},
	pagination: {
		note: 15,
		jotting: 24
	},
	heatmap: {
		unit: "day",
		weeks: 20
	},
	feed: {
		section: "*",
		limit: 20
	},
	latest: "*"
});

export const monolocale = Number(config.i18n.locales.length) === 1;

export default config;
