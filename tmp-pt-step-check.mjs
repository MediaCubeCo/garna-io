import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const port = 9335;
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
	'--headless=new',
	`--remote-debugging-port=${port}`,
	`--user-data-dir=${await mkdtemp(path.join(tmpdir(), 'garna-step-'))}`,
	'--disable-gpu',
	'--no-first-run',
	'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore'] });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (let i = 0; i < 60; i += 1) {
	try {
		const response = await fetch(`http://127.0.0.1:${port}/json/version`);
		if (response.ok) break;
	} catch {}
	await sleep(250);
}

const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();

ws.addEventListener('message', (event) => {
	const message = JSON.parse(event.data);
	const resolve = pending.get(message.id);
	if (!resolve) return;
	pending.delete(message.id);
	resolve(message.result);
});

await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));

const send = (method, params = {}) => new Promise((resolve) => {
	id += 1;
	pending.set(id, resolve);
	ws.send(JSON.stringify({ id, method, params }));
});

await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', {
	width: 1355,
	height: 898,
	deviceScaleFactor: 1,
	mobile: false,
});
await send('Page.navigate', { url: 'http://127.0.0.1:8788/pt/small-business-payroll' });

for (let i = 0; i < 80; i += 1) {
	const ready = await send('Runtime.evaluate', {
		returnByValue: true,
		expression: 'document.querySelectorAll(".steps-flow-item").length >= 4',
	});
	if (ready.result.value) break;
	await sleep(250);
}

const result = await send('Runtime.evaluate', {
	returnByValue: true,
	expression: `(() => {
		const item = document.querySelectorAll('.steps-flow-item')[1];
		return {
			title: item.querySelector('h3')?.textContent.trim(),
			description: item.querySelector('p')?.textContent.trim(),
		};
	})()`,
});

console.log(JSON.stringify(result.result.value, null, 2));
ws.close();
chrome.kill();
