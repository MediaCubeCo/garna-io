import { describe, expect, it } from 'vitest';
import { EOR_SERVICE_FEE_MAX, normalizeEorEmployeeCount, normalizeEorServiceFee } from '../src/utils/eor-cost-inputs';

describe('EOR calculator inputs', () => {
	it('allows zero and arbitrary employee counts without an upper cap', () => {
		expect(normalizeEorEmployeeCount(0)).toBe(0);
		expect(normalizeEorEmployeeCount(73)).toBe(73);
		expect(normalizeEorEmployeeCount(50_000)).toBe(50_000);
	});

	it('keeps employee counts non-negative and integral', () => {
		expect(normalizeEorEmployeeCount(-1)).toBe(0);
		expect(normalizeEorEmployeeCount(2.6)).toBe(3);
		expect(normalizeEorEmployeeCount('')).toBe(0);
	});

	it('accepts service fees through the 10,000 boundary', () => {
		expect(normalizeEorServiceFee(0)).toBe(0);
		expect(normalizeEorServiceFee(9_999)).toBe(9_999);
		expect(normalizeEorServiceFee(EOR_SERVICE_FEE_MAX)).toBe(10_000);
	});

	it('clamps service fees above the limit and below zero', () => {
		expect(normalizeEorServiceFee(10_001)).toBe(10_000);
		expect(normalizeEorServiceFee(1_000_000)).toBe(10_000);
		expect(normalizeEorServiceFee(-1)).toBe(0);
	});
});
