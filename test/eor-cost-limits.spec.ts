import { describe, expect, it } from 'vitest';
import {
	EOR_COST_LIMITS,
	clampEorEmployees,
	clampEorPayoutUsd,
	formatEorSavings,
} from '../src/utils/eor-cost-limits';

describe('EOR calculator limits', () => {
	it('accepts the employee boundary and clamps values above it', () => {
		expect(clampEorEmployees(9_999)).toBe(9_999);
		expect(clampEorEmployees(EOR_COST_LIMITS.employees)).toBe(10_000);
		expect(clampEorEmployees(10_001)).toBe(10_000);
		expect(clampEorEmployees(Number.POSITIVE_INFINITY)).toBe(10_000);
	});

	it('keeps employee counts integral and within the lower boundary', () => {
		expect(clampEorEmployees(9_999.6)).toBe(10_000);
		expect(clampEorEmployees(0)).toBe(1);
		expect(clampEorEmployees(Number.NaN)).toBe(1);
	});

	it('accepts the payout boundary and clamps values above it', () => {
		expect(clampEorPayoutUsd(99_999_999)).toBe(99_999_999);
		expect(clampEorPayoutUsd(EOR_COST_LIMITS.payoutUsd)).toBe(100_000_000);
		expect(clampEorPayoutUsd(100_000_001)).toBe(100_000_000);
		expect(clampEorPayoutUsd(Number.POSITIVE_INFINITY)).toBe(100_000_000);
	});

	it('prevents negative or invalid payout calculations', () => {
		expect(clampEorPayoutUsd(-1)).toBe(0);
		expect(clampEorPayoutUsd(Number.NaN)).toBe(0);
	});

	it('shows a neutral dash instead of a negative savings amount', () => {
		const money = (value: number) => `$${value}`;
		expect(formatEorSavings(-1, money)).toBe('—');
		expect(formatEorSavings(0, money)).toBe('$0');
		expect(formatEorSavings(1, money)).toBe('$1');
	});
});
