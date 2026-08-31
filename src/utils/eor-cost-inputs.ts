export const EOR_SERVICE_FEE_MAX = 10_000;

const finiteNumber = (value: string | number | null | undefined) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
};

export const normalizeEorEmployeeCount = (value: string | number | null | undefined) =>
	Math.max(0, Math.round(finiteNumber(value)));

export const normalizeEorServiceFee = (value: string | number | null | undefined) =>
	Math.min(EOR_SERVICE_FEE_MAX, Math.max(0, finiteNumber(value)));
