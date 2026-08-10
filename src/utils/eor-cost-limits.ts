export const EOR_COST_LIMITS = Object.freeze({
	employees: 10_000,
	payoutUsd: 100_000_000,
});

const finiteNumber = (value: string | number, fallback: number) => {
	const parsed = typeof value === 'number' ? value : Number(value);
	if (Number.isNaN(parsed)) return fallback;
	if (parsed === Number.POSITIVE_INFINITY) return Number.MAX_VALUE;
	if (parsed === Number.NEGATIVE_INFINITY) return 0;
	return parsed;
};

export const clampEorEmployees = (value: string | number, fallback = 1) =>
	Math.min(EOR_COST_LIMITS.employees, Math.max(1, Math.round(finiteNumber(value, fallback))));

export const clampEorPayoutUsd = (value: string | number, fallback = 0) =>
	Math.min(EOR_COST_LIMITS.payoutUsd, Math.max(0, finiteNumber(value, fallback)));

export const formatEorSavings = (yearlySaving: number, formatMoney: (value: number) => string) =>
	yearlySaving < 0 ? '—' : formatMoney(yearlySaving);
