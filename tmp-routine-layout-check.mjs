import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9333;
const userDataDir = await mkdtemp(path.join(tmpdir(), 'garna-chrome-'));

const chrome = spawn(chromePath, [
	'--headless=new',
	`--remote-debugging-port=${port}`,
	`--user-data-dir=${userDataDir}`,
	'--disable-gpu',
	'--no-first-run',
	'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });

chrome.stderr?.on('data', () => {});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForPageReady(cdp) {
	for (let i = 0; i < 80; i += 1) {
		const result = await cdp.send('Runtime.evaluate', {
			returnByValue: true,
			expression: 'Boolean(document.body) && document.readyState !== "loading"',
		});
		if (result.result.value) return;
		await sleep(100);
	}
}

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
		width: 1200,
		height: 900,
		deviceScaleFactor: 1,
		mobile: false,
	});

const locales = process.env.QUICK ? ['ru'] : ['en', 'ru', 'pt', 'es'];
const widths = process.env.QUICK ? [1013] : [1355, 1246, 1180, 1100, 1037, 1013, 963, 881, 768, 638, 430];
	const results = [];

	for (const locale of locales) {
		for (const width of widths) {
			await cdp.send('Emulation.setDeviceMetricsOverride', {
				width,
				height: 898,
				deviceScaleFactor: 1,
				mobile: width < 768,
			});
			await cdp.send('Page.navigate', { url: `http://127.0.0.1:8788/${locale}/small-business-payroll` });
			await waitForPageReady(cdp);
			await sleep(500);
			const evaluation = await cdp.send('Runtime.evaluate', {
				returnByValue: true,
				expression: `(() => {
				const visual = document.querySelector('.payroll-routine-visual');
				const group = document.querySelector('[data-routine-stat-group]');
				const rows = [...document.querySelectorAll('[data-routine-stat-row]')];
				if (!visual || !group || rows.length === 0) return {
					missing: true,
					href: location.href,
					title: document.title,
					bodyText: document.body?.innerText.slice(0, 240),
				};
				const rowData = rows.map((row) => ({
					text: row.textContent.trim().replace(/\\s+/g, ' '),
					layout: row.dataset.layout,
					clientWidth: row.clientWidth,
					scrollWidth: row.scrollWidth,
					overflows: row.scrollWidth > row.clientWidth + 1,
				}));
				const visualStyle = getComputedStyle(document.querySelector('.routine-layout-grid'));
				const panels = [...document.querySelectorAll('.routine-layout-grid > *')];
				const panelWidths = panels.map((panel) => Math.round(panel.getBoundingClientRect().width));
				const unequalWidePanels = visual.matches('[data-routine-layout="wide"]') && (
					panelWidths.length !== 3 || Math.max(...panelWidths) - Math.min(...panelWidths) > 1
				);
				const statCards = [...group.children];
				const statCardTops = statCards.map((card) => Math.round(card.getBoundingClientRect().top));
				const invalidWideStats = visual.matches('[data-routine-layout="wide"]') && (
					statCards.length !== 2 || Math.max(...statCardTops) - Math.min(...statCardTops) > 1
				);
				return {
					visualWidth: Math.round(visual.getBoundingClientRect().width),
					routineLayout: visual.dataset.routineLayout,
					visualMatchesWide: visual.matches('[data-routine-layout="wide"]'),
					gridClassName: document.querySelector('.routine-layout-grid')?.className,
					gridColumns: visualStyle.gridTemplateColumns,
					panelWidths,
					unequalWidePanels,
					statCardTops,
					invalidWideStats,
					groupLayout: group.dataset.layout,
					groupClientWidth: group.clientWidth,
					groupScrollWidth: group.scrollWidth,
					groupOverflows: group.scrollWidth > group.clientWidth + 1,
					rowData,
					fail: rowData.some((row) => row.overflows) || group.scrollWidth > group.clientWidth + 1 || unequalWidePanels || invalidWideStats,
				};
			})()`,
			});
			if (evaluation.exceptionDetails) {
				results.push({ locale, width, exception: evaluation.exceptionDetails.text, details: evaluation.exceptionDetails.exception?.description });
			} else {
				results.push({ locale, width, ...(evaluation.result.value ?? { noValue: true, resultType: evaluation.result.type }) });
			}
		}
	}

	cdp.close();
	chrome.kill();

	const failures = results.filter((result) => result.missing || result.fail || result.exception);
	const summary = {
		failureCount: failures.length,
		failures,
		byLocale: locales.map((locale) => ({
			locale,
			wide: results
				.filter((result) => result.locale === locale && result.routineLayout === 'wide')
				.map((result) => result.width),
			stacked: results
				.filter((result) => result.locale === locale && result.routineLayout === 'stacked')
				.map((result) => result.width),
			overflow: results
				.filter((result) => result.locale === locale && result.fail)
				.map((result) => result.width),
		})),
	};
	console.log(JSON.stringify(summary, null, 2));
} catch (error) {
	chrome.kill();
	console.error(error);
	process.exit(1);
}
