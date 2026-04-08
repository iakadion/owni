/* ──────────────────────────────────────────────
 *  Vite Configuration — OWNI Gallery
 * ────────────────────────────────────────────── */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
	server: {
		port: 3000,
		host: true,
		allowedHosts: true,
	},
	preview: {
		allowedHosts: true,
	},
	build: {
		target: "es2022",
		outDir: "dist",
		sourcemap: false,
		minify: "esbuild",
	},
});
