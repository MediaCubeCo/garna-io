const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const outDir = path.join(__dirname, '..', '..', '..', '..', 'static', 'widget');
const fileName = 'garna-widget.js';
const src = path.join(buildDir, fileName);
const dest = path.join(outDir, fileName);

if (!fs.existsSync(src)) {
	console.error(`[copy-widget] Build output not found: ${src}`);
	process.exit(1);
}

if (!fs.existsSync(outDir)) {
	fs.mkdirSync(outDir, { recursive: true });
}

const bundle = fs.readFileSync(src, 'utf8').replace(/\n?\/\/# sourceMappingURL=garna-widget\.js\.map\s*$/u, '');
fs.writeFileSync(dest, bundle);
