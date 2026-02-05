const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const outDir = path.join(__dirname, '..', '..', '..', '..', 'public', 'widget');
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

fs.copyFileSync(src, dest);
