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
	class Element {
		constructor(private isSection = false) {}
		style = { setProperty(_name: string, value: string) { topOffset = Number.parseFloat(value); } };
		offsetWidth = diameter;
		classList = { add() {} };
		closest() { return new Element(true); }
		getBoundingClientRect() { return { width, height: this.isSection ? height : height - topOffset, top: sectionTop + (this.isSection ? 0 : topOffset) }; }
	}
	const world = new Function('playground', 'elements', 'HTMLElement', 'document', 'window', 'performance', 'syncCountrySectionHeights', `${simulation}\nreturn { state, layoutOrbs, stepPhysics, settleIfStill, wakeSimulation, resize, releaseDragged, resolveCollisions, syncPlaygroundTop };`)(
		new Element(), Array.from({ length: 32 }, () => new Element()), Element,
		{ querySelector: () => null },
		{ requestAnimationFrame: (fn: (time: number) => void) => { frame = fn; return 1; }, cancelAnimationFrame: () => { frame = undefined; } },
		{ now: () => now }, () => {},
	);
	world.layoutOrbs();
	return {
		...world,
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
	it('follows a free drag target gradually, including reversals', () => {
		const world = createWorld(768, 1150, 48);
		world.run();
		const orb = world.state.orbs.reduce((a: any, b: any) => a.y < b.y ? a : b);
		world.state.dragged = orb;
		for (const target of [{ x: orb.x, y: 400 }, { x: 100, y: 400 }, { x: 650, y: 400 }]) {
			world.state.dragTarget = target;
			for (let step = 0; step < 120; step++) {
				const { x, y } = orb;
				world.stepPhysics(1 / 120, 40000);
				expect(Math.hypot(orb.x - x, orb.y - y)).toBeLessThanOrEqual(7.501);
			}
			expect(Math.hypot(orb.x - target.x, orb.y - target.y)).toBeLessThan(0.1);
		}
	});
	for (const [width, diameter] of [[1440, 72], [768, 48], [390, 48], [320, 48]]) {
		it(`extracts every bottom-row flag through its neighbours at ${width}px`, () => {
			const world = createWorld(width, 1150, diameter);
			world.run();
			const bottom = world.state.orbs.filter((orb: any) => orb.y > 1150 - diameter / 2 - 4);
			for (const orb of bottom) {
				world.state.dragged = orb;
				world.state.dragTarget = { x: Math.max(diameter / 2, orb.x - diameter * 2), y: 600 };
				for (let step = 0; step < 120; step++) {
					world.stepPhysics(1 / 120, 40000);
					let gap = Infinity;
					for (const a of world.state.orbs) for (const b of world.state.orbs) {
						if (a !== b) gap = Math.min(gap, Math.hypot(a.x - b.x, a.y - b.y) - diameter);
					}
					expect(gap).toBeGreaterThan(2);
				}
				expect(orb.y).toBeCloseTo(600);
				expect(orb.x).toBeCloseTo(world.state.dragTarget.x);
				world.releaseDragged(true);
				world.run();
			}
		});
		it(`keeps gaps while forcing a flag through the bottom row at ${width}px`, () => {
			const world = createWorld(width, 1150, diameter);
			world.run();
			const orb = world.state.orbs.reduce((a: any, b: any) => a.y < b.y ? a : b);
			world.state.dragged = orb;
			orb.vx = orb.vy = 0;
			for (const x of [width / 2, diameter / 2, width - diameter / 2, width / 3]) {
				world.state.dragTarget = { x, y: 1150 - diameter / 2 - 3 };
				for (const a of world.state.orbs) {
					for (const b of world.state.orbs) {
						if (a !== b) expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(diameter + 2);
					}
				}
				for (let step = 0; step < 120; step++) {
					const previous = world.state.orbs.map((a: any) => ({ x: a.x, y: a.y }));
					world.stepPhysics(1 / 120, 40000);
					let minimumDistance = Infinity;
					for (const [index, a] of world.state.orbs.entries()) {
						expect(Math.hypot(a.x - previous[index].x, a.y - previous[index].y)).toBeLessThan(15);
						for (const b of world.state.orbs) {
							if (a !== b) minimumDistance = Math.min(minimumDistance, Math.hypot(a.x - b.x, a.y - b.y));
						}
						expect(a.y).toBeGreaterThanOrEqual(a.radius);
						expect(a.y).toBeLessThanOrEqual(1150 - a.radius - 3);
					}
					expect(minimumDistance).toBeGreaterThan(diameter + 2);
				}
			}
			world.releaseDragged(true);
			expect(world.run().stopped).toBe(true);
		});
	}
	it('discards stale drag velocity and caps a fresh throw', () => {
		const world = createWorld(390, 1150, 48);
		const orb = world.state.orbs[0];
		world.state.dragged = orb;
		world.state.lastPointerTime = -200;
		orb.vy = -10000;
		world.releaseDragged();
		expect(Math.abs(orb.vy)).toBe(0);
		world.state.dragged = orb;
		world.state.lastPointerTime = 0;
		orb.vy = -10000;
		world.releaseDragged();
		expect(Math.hypot(orb.vx, orb.vy)).toBeLessThanOrEqual(480);
	});
	it('separates coincident flags without launching them', () => {
		const world = createWorld(390, 1150, 48);
		world.run();
		const [a, b] = world.state.orbs;
		a.x = b.x = 195;
		a.y = b.y = 500;
		world.state.dragged = a;
		world.resolveCollisions();
		expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(50);
		world.stepPhysics(1 / 120, 40000);
		expect(Math.hypot(b.vx, b.vy)).toBeLessThan(180);
		world.releaseDragged(true);
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
	it('releases the pile when its supporting flag is dragged away', () => {
		const world = createWorld(390, 1150, 48);
		world.run();
		const positions = world.state.orbs.map((orb: any) => ({ x: orb.x, y: orb.y }));
		const orb = world.state.orbs.find((item: any) => item.y === 1123 && item.x > 100 && item.x < 290);
		world.state.dragged = orb;
		orb.y = 100;
		world.run(60, 2);
		expect(world.state.orbs.some((item: any, index: number) => item !== orb && item.y > positions[index].y + 5)).toBe(true);
		world.state.dragged = null;
		expect(world.run().stopped).toBe(true);
	});
	it('wakes and settles again after the floor moves on resize', () => {
		const world = createWorld(390, 1150, 48);
		world.run();
		world.setBounds(768, 1350);
		expect(world.run().stopped).toBe(true);
		expect(Math.max(...world.state.orbs.map((orb: any) => orb.y))).toBe(1323);
	});
});
