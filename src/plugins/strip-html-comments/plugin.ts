//: ----------------------------------------------------------------------------
//: https://chat.deepseek.com/a/chat/s/061236cb-9922-46e3-b418-b7a391d2c86a
//: ----------------------------------------------------------------------------
import { stripHTMLComments as stripHTMLCommentsCore } from "./core.ts";
import type { Plugin as VitePlugin } from "vite";

export function stripHTMLComments(input: string): string;
export function stripHTMLComments(): VitePlugin;
export function stripHTMLComments(input?: string): VitePlugin | string {
	if (input !== undefined) {
		return stripHTMLCommentsCore(input);
	}
	return {
		name: "--vite-plugin-strip-html-comments",
		// Normal vite stuff
		transformIndexHtml: stripHTMLCommentsCore,

		// transformIndexHtml doesn't run in Astro - we need to inject a middleware
		// @ts-expect-error blah
		hooks: {
			"astro:config:setup": ({ addMiddleware }) => {
				addMiddleware({
					entrypoint:
						// "@zade/vite-plugin-strip-html-comments/__internal-astro-middleware",
						"@/plugins/strip-html-comments/astro-middleware.ts",
					order: "post",
				});
			},
		},
	};
}
