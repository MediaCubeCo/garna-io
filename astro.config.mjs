import { defineConfig } from 'astro/config';

export default defineConfig({
	srcDir: './astro',
	output: 'static',
	outDir: './dist',
	publicDir: './static',
	build: {
		format: 'file',
	},
});
