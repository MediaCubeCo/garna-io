import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const chromePath = process.env.CHROME_PATH || path.join(process.env.ProgramFiles || 'C:/Program Files', 'Google/Chrome/Application/chrome.exe');
const url = process.env.HOME_CAPTURE_URL || 'http://127.0.0.1:8788/en';
const outPath = path.join(root, 'static/pages/payroll-solution-new/assets/home-payroll-screen-real-browser-capture.png');
const viewport = { width: 1440, height: 964, deviceScaleFactor: 2 };
const crop = { width: 1440, height: 900 };
const port = 9339;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cdpCall = (socket) => {
	let id = 0;
	const pending = new Map();

	socket.addEventListener('message', (event) => {
		const message = JSON.parse(event.data);
		if (!message.id || !pending.has(message.id)) return;
		const { resolve, reject } = pending.get(message.id);
		pending.delete(message.id);
		if (message.error) reject(new Error(message.error.message || JSON.stringify(message.error)));
		else resolve(message.result);
	});

	return (method, params = {}, sessionId) =>
		new Promise((resolve, reject) => {
			const callId = ++id;
			pending.set(callId, { resolve, reject });
			socket.send(JSON.stringify({ id: callId, method, params, ...(sessionId ? { sessionId } : {}) }));
		});
};

const waitForJson = async (endpoint) => {
	const started = Date.now();
	while (Date.now() - started < 10000) {
		try {
			const response = await fetch(endpoint);
			if (response.ok) return response.json();
		} catch {
			// Chrome is still booting.
		}
		await delay(150);
	}
	throw new Error(`Timed out waiting for ${endpoint}`);
};

const main = async () => {
	const profileRoot = path.join(root, '.codex-preview/chrome-capture');
	await mkdir(profileRoot, { recursive: true });
	const profileDir = await mkdtemp(path.join(profileRoot, 'profile-'));
	const chrome = spawn(chromePath, [
		'--headless=new',
		'--disable-gpu',
		'--disable-dev-shm-usage',
		'--disable-breakpad',
		'--disable-crash-reporter',
		'--disable-crashpad',
		'--no-sandbox',
		'--no-first-run',
		'--no-default-browser-check',
		`--remote-debugging-port=${port}`,
		`--user-data-dir=${profileDir}`,
		`--window-size=${viewport.width},${viewport.height}`,
		'about:blank',
	], { stdio: 'inherit' });

	try {
		const version = await waitForJson(`http://127.0.0.1:${port}/json/version`);
		const socket = new WebSocket(version.webSocketDebuggerUrl);
		await new Promise((resolve, reject) => {
			socket.addEventListener('open', resolve, { once: true });
			socket.addEventListener('error', reject, { once: true });
		});
		const call = cdpCall(socket);

		await call('Target.setDiscoverTargets', { discover: true });
		const target = await call('Target.createTarget', { url: 'about:blank' });
		const attach = await call('Target.attachToTarget', { targetId: target.targetId, flatten: true });
		const sessionId = attach.sessionId;
		const pageCall = (method, params = {}) => call(method, params, sessionId);

		await pageCall('Page.enable');
		await pageCall('Runtime.enable');
		await pageCall('Emulation.setDeviceMetricsOverride', {
			width: viewport.width,
			height: viewport.height,
			deviceScaleFactor: viewport.deviceScaleFactor,
			mobile: false,
			screenWidth: viewport.width,
			screenHeight: viewport.height,
		});
		await pageCall('Page.navigate', { url });
		for (let attempt = 0; attempt < 80; attempt += 1) {
			const ready = await pageCall('Runtime.evaluate', {
				returnByValue: true,
				expression: `({
					url: location.href,
					readyState: document.readyState,
					hasTarget: Boolean(document.querySelector('[data-home-manage-reveal] section')),
				})`,
			});
			const value = ready.result.value;
			if (value?.url?.startsWith(url) && value.readyState === 'complete' && value.hasTarget) break;
			await delay(150);
		}
		await delay(600);

		const alignment = await pageCall('Runtime.evaluate', {
			awaitPromise: true,
			returnByValue: true,
			expression: `new Promise((resolve) => {
				const wait = (ms) => new Promise((done) => setTimeout(done, ms));
				(async () => {
					const header = document.querySelector('.garna-header');
					const reveal = document.querySelector('[data-home-manage-reveal]');
					const section = reveal?.querySelector('section');
					const headerHeight = header?.getBoundingClientRect().height || 64;
					if (!section) {
						resolve({ ok: false, headerHeight, scrollY: window.scrollY });
						return;
					}
					await document.fonts?.ready;
					document.querySelector('[data-home-capture-overlay]')?.remove();
					const before = section.getBoundingClientRect();
					const overlay = document.createElement('div');
					const clone = section.cloneNode(true);
					overlay.setAttribute('data-home-capture-overlay', '');
					Object.assign(overlay.style, {
						position: 'fixed',
						inset: '0 auto auto 0',
						zIndex: '2147483647',
						width: '1440px',
						height: '900px',
						overflow: 'hidden',
						background: '#101010',
						pointerEvents: 'none',
					});
					Object.assign(clone.style, {
						margin: '0',
						width: '100%',
						minHeight: '900px',
						opacity: '1',
						transform: 'none',
					});
					overlay.appendChild(clone);
					document.body.appendChild(overlay);
					await wait(500);
					const after = clone.getBoundingClientRect();
					resolve({
						ok: true,
						captureMode: 'cloned-section-overlay',
						headerHeight,
						beforeTop: before.top,
						sectionTop: after.top,
						sectionLeft: after.left,
						sectionWidth: after.width,
						sectionHeight: after.height,
						title: clone.querySelector('h2')?.getBoundingClientRect().toJSON(),
						card: clone.querySelector('.payroll-feature-card')?.getBoundingClientRect().toJSON(),
						titleStyle: clone.querySelector('h2') ? {
							color: getComputedStyle(clone.querySelector('h2')).color,
							opacity: getComputedStyle(clone.querySelector('h2')).opacity,
							visibility: getComputedStyle(clone.querySelector('h2')).visibility,
						} : null,
						scrollY: window.scrollY,
						viewport: { width: window.innerWidth, height: window.innerHeight },
					});
				})();
			})`,
		});

		const screenshot = await pageCall('Page.captureScreenshot', {
			format: 'png',
			fromSurface: true,
			captureBeyondViewport: false,
			clip: {
				x: 0,
				y: 0,
				width: crop.width,
				height: crop.height,
				scale: 1,
			},
		});
		const buffer = Buffer.from(screenshot.data, 'base64');
		const normalized = await sharp(buffer)
			.resize(2880, 1800, { fit: 'fill', kernel: 'lanczos3' })
			.png({ compressionLevel: 9 })
			.toBuffer();
		await writeFile(outPath, normalized);
		socket.close();

		console.log(JSON.stringify({ saved: outPath, alignment: alignment.result.value }, null, 2));
	} finally {
		chrome.kill();
		await rm(profileDir, { recursive: true, force: true }).catch(() => {});
	}
};

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
