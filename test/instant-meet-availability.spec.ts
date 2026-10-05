import { describe, expect, it } from 'vitest';
import { getNextInstantMeetOpening, isInstantMeetLive } from '../astro/utils/instant-meet-availability';

describe('instant meet availability', () => {
	it('is live on weekdays from 10:00 until 19:00 Minsk', () => {
		expect(isInstantMeetLive(new Date('2026-10-05T07:00:00Z'))).toBe(true);
		expect(isInstantMeetLive(new Date('2026-10-05T15:59:00Z'))).toBe(true);
		expect(isInstantMeetLive(new Date('2026-10-05T06:59:00Z'))).toBe(false);
		expect(isInstantMeetLive(new Date('2026-10-05T16:00:00Z'))).toBe(false);
	});

	it('stays offline all weekend', () => {
		expect(isInstantMeetLive(new Date('2026-10-10T09:00:00Z'))).toBe(false);
		expect(isInstantMeetLive(new Date('2026-10-11T12:00:00Z'))).toBe(false);
	});

	it('opens next on the following weekday at 10:00 Minsk', () => {
		expect(getNextInstantMeetOpening(new Date('2026-10-05T06:59:00Z')).toISOString()).toBe('2026-10-05T07:00:00.000Z');
		expect(getNextInstantMeetOpening(new Date('2026-10-07T05:00:00Z')).toISOString()).toBe('2026-10-07T07:00:00.000Z');
		expect(getNextInstantMeetOpening(new Date('2026-10-07T16:30:00Z')).toISOString()).toBe('2026-10-08T07:00:00.000Z');
		expect(getNextInstantMeetOpening(new Date('2026-10-09T17:00:00Z')).toISOString()).toBe('2026-10-12T07:00:00.000Z');
		expect(getNextInstantMeetOpening(new Date('2026-10-10T09:00:00Z')).toISOString()).toBe('2026-10-12T07:00:00.000Z');
		expect(getNextInstantMeetOpening(new Date('2026-10-11T12:00:00Z')).toISOString()).toBe('2026-10-12T07:00:00.000Z');
	});
});
