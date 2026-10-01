import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Exercise the actual inline simulation with a deterministic clock and DOM geometry.
const source = readFileSync(new URL('../astro/components/sections/payroll/EorCountriesSection.astro', import.meta.url), 'utf8');
const simulation = source.slice(source.indexOf('\t\tconst state ='), source.indexOf('\t\tconst start ='));

function createWorld(width: number, height: number, diameter: number) {
	let now = 0;
	let sectionTop = 0;
	let topOffset = 0;
	let frame: ((time: number) => void) | undefined;
	let reducedMotion = false;
	const handlers = new Map<string, (event: any) => void>();
	class Element {
		constructor(private isSection = false) {}
		style = { setProperty(_name: string, value: string) { topOffset = Number.parseFloat(value); } };
		offsetWidth = diameter;
		classList = { add() {}, remove() {} };
		closest() { return new Element(true); }
		addEventListener(type: string, handler: (event: any) => void) { handlers.set(type, handler); }
		getBoundingClientRect() { return { left: 0, width, height: this.isSection ? height : height - topOffset, top: sectionTop + (this.isSection ? 0 : topOffset) }; }
	}
	const world = new Function('playground', 'elements', 'HTMLElement', 'document', 'window', 'performance', 'syncCountrySectionHeights', 'signal', `${simulation}\nreturn { state, layoutOrbs, stepPhysics, settleIfStill, wakeSimulation, resize, resolveCollisions, syncPlaygroundTop, pushFromCursor };`)(
		new Element(), Array.from({ length: 32 }, () => new Element()), Element,
		{ querySelector: () => null },
		{
			requestAnimationFrame: (fn: (time: number) => void) => { frame = fn; return 1; },
			cancelAnimationFrame: () => { frame = undefined; },
			addEventListener: (type: string, handler: (event: any) => void) => handlers.set(type, handler),
			matchMedia: () => ({ matches: reducedMotion }),
		},
		{ now: () => now }, () => {}, new AbortController().signal,
	);
	world.layoutOrbs();
	return {
		...world,
		setReducedMotion(value: boolean) { reducedMotion = value; },
		pointerMove(x: number, y: number, options = {}) {
			now += 16;
			handlers.get('pointermove')?.({ clientX: x, clientY: y, pointerType: 'mouse', buttons: 0, ...options });
		},
		dispatch(type: string) { handlers.get(type)?.({}); },
		setSectionTop(top: number) { sectionTop = top; world.syncPlaygroundTop(); },
		setBounds(nextWidth: number, nextHeight: number) {
			width = nextWidth;
			height = nextHeight;
			world.state.started = true;
			world.resize();
		},
		run(fps = 60, seconds = 30) {
			world.wakeSimulation();
			const start = now;
			while (frame && now - start < seconds * 1000) {
				now += 1000 / fps;
				const callback = frame;
				frame = undefined;
				callback(now);
			}
			return { stopped: !frame, seconds: (now - start) / 1000 };
		},
	};
}

describe('EOR flag settling', () => {
	for (const width of [320, 768, 1440]) {
		it(`bounds repeated cursor impulses and settles after sweeps at ${width}px`, () => {
			const world = createWorld(width, 1150, 48);
			world.run();
			for (let i = 0; i < 180; i++) {
				const orb = world.state.orbs[i % 32];
				const angle = i * 2.4;
				const from = { x: orb.x - Math.cos(angle) * 100, y: orb.y - Math.sin(angle) * 100 };
				const to = { x: orb.x + Math.cos(angle) * 100, y: orb.y + Math.sin(angle) * 100 };
				const speedBefore = Math.hypot(orb.vx, orb.vy);
				world.pushFromCursor(from, to, 0.001);
				// Gravity may already exceed the cursor cap; a sweep must not increase it.
				expect(Math.hypot(orb.vx, orb.vy)).toBeLessThanOrEqual(Math.max(speedBefore, 1550) + 0.000001);
				world.stepPhysics(1 / 120, 40000);
				for (const a of world.state.orbs) {
					expect([a.x, a.y, a.vx, a.vy].every(Number.isFinite)).toBe(true);
					expect(a.x).toBeGreaterThanOrEqual(a.radius);
					expect(a.x).toBeLessThanOrEqual(width - a.radius);
					expect(a.y).toBeLessThanOrEqual(1150 - a.radius - 3);
					for (const b of world.state.orbs) {
						if (a !== b) expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(48);
					}
				}
			}
			expect(world.run().stopped).toBe(true);
		});
	}
	it('pushes flags to both sides of a fast cursor sweep without a click', () => {
		const world = createWorld(1440, 836, 72);
		world.run();
		world.state.started = true;
		const [left, right, distant] = world.state.orbs;
		Object.assign(left, { x: 680, y: 400, vx: 0, vy: 0 });
		Object.assign(right, { x: 760, y: 400, vx: 0, vy: 0 });
		Object.assign(distant, { x: 1100, y: 400, vx: 0, vy: 0 });
		world.pointerMove(720, 250);
		world.pointerMove(720, 550);
		expect(left.vx).toBeLessThan(-200);
		expect(right.vx).toBeGreaterThan(200);
		expect(distant.vx).toBe(0);
		expect(world.state.dragged).toBeUndefined();
		const before = left.x;
		world.run(60, 0.1);
		expect(left.x).toBeLessThan(before);
		expect(world.run().stopped).toBe(true);
	});
	it('does not repel on touch, with a pressed button, or with reduced motion', () => {
		const world = createWorld(1440, 836, 72);
		world.run();
		world.state.started = true;
		const orb = world.state.orbs[0];
		Object.assign(orb, { x: 680, y: 400, vx: 0, vy: 0 });
		for (const options of [{ pointerType: 'touch' }, { buttons: 1 }]) {
			world.pointerMove(720, 250, options);
			world.pointerMove(720, 550, options);
			expect(orb.vx).toBe(0);
		}
		world.setReducedMotion(true);
		world.pointerMove(720, 250);
		world.pointerMove(720, 550);
		expect(orb.vx).toBe(0);
	});
	it('clears hover trails on leaving, scrolling and losing focus', () => {
		const world = createWorld(1440, 836, 72);
		world.run();
		world.state.started = true;
		const orb = world.state.orbs[0];
		Object.assign(orb, { x: 680, y: 400, vx: 0, vy: 0 });
		for (const event of ['pointerleave', 'scroll', 'blur', 'pointerdown', 'pointercancel']) {
			world.pointerMove(720, 250);
			world.dispatch(event);
			world.pointerMove(720, 550);
			expect(orb.vx).toBe(0);
			world.dispatch(event);
		}
	});
	it('handles exact centre hits, ignores stationary cursors', () => {
		const world = createWorld(1440, 836, 72);
		world.run();
		const orb = world.state.orbs[0];
		Object.assign(orb, { x: 720, y: 400, vx: 0, vy: 0 });
		world.pushFromCursor({ x: 720, y: 250 }, { x: 720, y: 550 }, 0.016);
		expect(Number.isFinite(orb.vx)).toBe(true);
		expect(Math.abs(orb.vx)).toBeGreaterThan(0);
		expect(world.pushFromCursor({ x: 720, y: 400 }, { x: 720, y: 400 }, 0.016)).toBe(false);
	});
	it('never sleeps with overlapping flags even when velocities are zero', () => {
		const world = createWorld(320, 1150, 48);
		world.run();
		const [a, b] = world.state.orbs;
		a.x = b.x = 160;
		a.y = b.y = 1123;
		a.previousX = b.previousX = 160;
		a.previousY = b.previousY = 1123;
		for (let step = 0; step < 120; step++) expect(world.settleIfStill(1 / 120)).toBe(false);
	});
	it('does not compress the world or release flags into an offscreen floor during scrolling', () => {
		const world = createWorld(320, 1150, 48);
		world.setSectionTop(-1100);
		world.run(60, 0.5);
		expect(world.state.height).toBe(1150);
		expect(world.state.orbs.every((orb: any) => !orb.released)).toBe(true);
		world.setSectionTop(0);
		expect(world.run().stopped).toBe(true);
		for (const a of world.state.orbs) for (const b of world.state.orbs) {
			if (a !== b) expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(50);
		}
	});
	it('spawns above the viewport behind the header during scrolling without teleporting released flags', () => {
		const world = createWorld(768, 1150, 48);
		world.stepPhysics(1 / 120, 60);
		for (const top of [240, -180, 150, -400]) {
			const released = world.state.orbs.filter((orb: any) => orb.released);
			const pagePositions = released.map((orb: any) => orb.y + world.state.topOffset);
			world.setSectionTop(top);
			expect(top + world.state.topOffset + world.state.spawnTop).toBe(0);
			released.forEach((orb: any, i: number) => expect(orb.y + world.state.topOffset).toBeCloseTo(pagePositions[i]));
			const pending = world.state.orbs.find((orb: any) => !orb.released);
			pending.releaseDelay = 0;
			let appearanceTop = 0;
			pending.element.classList.add = () => { appearanceTop = top + world.state.topOffset + pending.y - pending.radius; };
			world.stepPhysics(1 / 120, 60);
			expect(appearanceTop).toBe(-48);
			expect(pending.entered).toBe(false);
		}
	});
	it('separates coincident flags without launching them', () => {
		const world = createWorld(390, 1150, 48);
		world.run();
		const [a, b] = world.state.orbs;
		a.x = b.x = 195;
		a.y = b.y = 500;
		world.resolveCollisions();
		expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(50);
		world.stepPhysics(1 / 120, 40000);
		expect(Math.hypot(b.vx, b.vy)).toBeLessThan(180);
		expect(world.run().stopped).toBe(true);
	});
	for (const [width, height, diameter] of [[1440, 836, 72], [1920, 1016, 72], [1280, 836, 61], [768, 950, 48], [390, 1150, 48], [320, 1150, 48]]) {
		for (const fps of [30, 60, 144]) {
			it(`settles a supported pile at ${width}px / ${fps}fps`, () => {
				const world = createWorld(width, height, diameter);
				const result = world.run(fps);
				expect(result.stopped, JSON.stringify(result)).toBe(true);
				for (const orb of world.state.orbs) {
					expect(orb.released).toBe(true);
					expect(orb.y).toBeLessThanOrEqual(height - orb.radius - 3 + 0.01);
					const contacts = world.state.orbs.filter((other: any) => other !== orb && other.y > orb.y && Math.hypot(other.x - orb.x, other.y - orb.y) <= diameter + 3);
					expect(orb.y > height - orb.radius - 4 || contacts.length > 0).toBe(true);
					for (const other of world.state.orbs) {
						// Allow subpixel solver tolerance in the 2.5px gap, never visible overlap.
						if (other !== orb) expect(Math.hypot(other.x - orb.x, other.y - orb.y)).toBeGreaterThan(diameter + 2);
					}
				}
			});
		}
	}
	it('does not freeze an airborne flag even after the old timeout', () => {
		const world = createWorld(390, 1150, 48);
		world.run();
		const orb = world.state.orbs[0];
		orb.y = 100;
		orb.previousY = 100;
		for (let i = 0; i < 100; i++) expect(world.settleIfStill(1 / 120)).toBe(false);
		expect(world.run().stopped).toBe(true);
		expect(orb.y).toBeGreaterThan(100);
	});
	it('remains stable with sleep disabled', () => {
		const world = createWorld(390, 1150, 48);
		for (let i = 0; i < 3600; i++) world.stepPhysics(1 / 120, i * 1000 / 120);
		const positions = world.state.orbs.map((orb: any) => ({ x: orb.x, y: orb.y }));
		for (let i = 3600; i < 4200; i++) {
			world.stepPhysics(1 / 120, i * 1000 / 120);
			world.state.orbs.forEach((orb: any, index: number) => {
				expect(Math.hypot(orb.x - positions[index].x, orb.y - positions[index].y)).toBeLessThan(0.1);
			});
		}
	});
	it('wakes and settles again after the floor moves on resize', () => {
		const world = createWorld(390, 1150, 48);
		world.run();
		world.setBounds(768, 1350);
		expect(world.run().stopped).toBe(true);
		expect(Math.max(...world.state.orbs.map((orb: any) => orb.y))).toBe(1323);
	});
});
