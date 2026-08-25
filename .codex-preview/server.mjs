import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = 'D:\\dev\\garna-io\\dist';
const distantHero = 'D:\\dev\\garna-io\\static\\pages\\payroll-solution-new\\assets\\home-hero-laptop-distant-v3.png';
const heroAliases = new Set([
	'/pages/payroll-solution-new/assets/home-hero-laptop-nature-v2.png',
	'/pages/payroll-solution-new/assets/home-hero-laptop-scroll-v1.png',
]);
const contentTypes = {
	'.css': 'text/css; charset=utf-8',
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.jpg': 'image/jpeg',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.webp': 'image/webp',
};

createServer((request, response) => {
	const pathname = new URL(request.url || '/', 'http://127.0.0.1').pathname;
	let file = heroAliases.has(pathname) ? distantHero : join(root, normalize(pathname).replace(/^[/\\]+/, ''));
	if (pathname === '/' || pathname === '/en' || pathname === '/en/') file = join(root, 'index.html');
	if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');

	if (!existsSync(file)) {
		response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
		response.end('Not found');
		return;
	}

	response.writeHead(200, {
		'cache-control': 'no-store',
		'content-type': contentTypes[extname(file)] || 'application/octet-stream',
	});
	createReadStream(file).pipe(response);
}).listen(8788, '127.0.0.1');
