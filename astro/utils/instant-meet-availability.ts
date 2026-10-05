const WEEKDAYS = new Set(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

export type MinskParts = {
	year: number;
	month: number;
	day: number;
	hour: number;
	weekday: string;
};

export function getMinskParts(date = new Date()): MinskParts {
	const parts = Object.fromEntries(
		new Intl.DateTimeFormat('en-US', {
			timeZone: 'Europe/Minsk',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			hourCycle: 'h23',
			weekday: 'short',
		})
			.formatToParts(date)
			.filter((part) => part.type !== 'literal')
			.map((part) => [part.type, part.type === 'weekday' ? part.value : Number(part.value)]),
	);

	return {
		year: parts.year,
		month: parts.month,
		day: parts.day,
		hour: parts.hour,
		weekday: parts.weekday,
	};
}

export function isInstantMeetLive(date = new Date()): boolean {
	const parts = getMinskParts(date);
	return WEEKDAYS.has(parts.weekday) && parts.hour >= 10 && parts.hour < 19;
}

/** Next 10:00 Europe/Minsk on a Monday–Friday. 10:00 Minsk is 07:00 UTC. */
export function getNextInstantMeetOpening(now = new Date()): Date {
	const parts = getMinskParts(now);
	const startOffset = WEEKDAYS.has(parts.weekday) && parts.hour < 10 ? 0 : 1;

	for (let offset = startOffset; offset < startOffset + 7; offset += 1) {
		const opening = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + offset, 7, 0, 0));
		if (WEEKDAYS.has(getMinskParts(opening).weekday)) return opening;
	}

	return new Date(Date.UTC(parts.year, parts.month - 1, parts.day + startOffset, 7, 0, 0));
}
