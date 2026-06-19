import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9334;
const userDataDir = await mkdtemp(path.join(tmpdir(), 'garna-platform-chrome-'));

const chrome = spawn(chromePath, [
	'--headless=new',
	`--remote-debugging-port=${port}`,
	`--user-data-dir=${userDataDir}`,
	'--disable-gpu',
	'--no-first-run',
	'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore'] });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForVersion() {
	for (let i = 0; i < 60; i += 1) {
		try {
			const res = await fetch(`http://127.0.0.1:${port}/json/version`);
			if (res.ok) return res.json();
		} catch {}
		await sleep(250);
	}
	throw new Error('Chrome DevTools endpoint did not start');
}

function connect(wsUrl) {
	const ws = new WebSocket(wsUrl);
	let id = 0;
	const pending = new Map();

	ws.addEventListener('message', (event) => {
		const message = JSON.parse(event.data);
		if (!message.id) return;
		const entry = pending.get(message.id);
		if (!entry) return;
		pending.delete(message.id);
		if (message.error) entry.reject(new Error(JSON.stringify(message.error)));
		else entry.resolve(message.result);
	});

	const ready = new Promise((resolve, reject) => {
		ws.addEventListener('open', resolve, { once: true });
		ws.addEventListener('error', reject, { once: true });
	});

	return {
		async send(method, params = {}) {
			await ready;
			id += 1;
			ws.send(JSON.stringify({ id, method, params }));
			return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
		},
		close() {
			ws.close();
		},
	};
}

try {
	await waitForVersion();
	const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' });
	if (!targetResponse.ok) throw new Error(`Could not create Chrome target: ${targetResponse.status}`);
	const target = await targetResponse.json();
	const cdp = connect(target.webSocketDebuggerUrl);
	await cdp.send('Runtime.enable');
	await cdp.send('Page.enable');
	await cdp.send('Emulation.setDeviceMetricsOverride', {
		width: 1355,
		height: 898,
		deviceScaleFactor: 1,
		mobile: false,
	});
await cdp.send('Page.navigate', { url: 'http://127.0.0.1:8788/pt/small-business-payroll' });
for (let i = 0; i < 60; i += 1) {
	const ready = await cdp.send('Runtime.evaluate', {
		returnByValue: true,
		expression: 'document.querySelectorAll(".platform-card").length >= 2',
	});
	if (ready.result.value) break;
	await sleep(250);
}
const evaluation = await cdp.send('Runtime.evaluate', {
		returnByValue: true,
		expression: `(() => {
			const cards = [...document.querySelectorAll('.platform-card')];
			const result = cards.slice(0, 2).map((card) => {
				const h3 = card.querySelector('[data-platform-heading-group] h3');
				const group = card.querySelector('[data-platform-heading-group]');
				const list = card.querySelector('ul');
				return {
					h3Text: h3?.textContent.trim(),
					h3Height: Math.round(h3?.getBoundingClientRect().height ?? 0),
					groupHeight: Math.round(group?.getBoundingClientRect().height ?? 0),
					listTop: Math.round(list?.getBoundingClientRect().top ?? 0),
				};
			});
			return {
				result,
				listTopDelta: Math.abs((result[0]?.listTop ?? 0) - (result[1]?.listTop ?? 0)),
				h3LooksStretched: result.some((item) => item.h3Height > 60),
			};
		})()`,
	});
	cdp.close();
	chrome.kill();
	console.log(JSON.stringify(evaluation.result.value, null, 2));
} catch (error) {
	chrome.kill();
	console.error(error);
	process.exit(1);
}
