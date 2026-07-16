import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	srcDir: './astro',
	output: 'static',
	outDir: './dist',
	publicDir: './static',
	build: {
		format: 'file',
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
