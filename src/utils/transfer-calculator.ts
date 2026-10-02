export const TRANSFER_PRICING_POLICY = {
	providerMarkupRate: 0.3,
	eurFxMarginRate: 0.015,
	otherFxMarginRate: 0.02,
	eta: '1–2 business days',
} as const;

export type CorpayRoute = {
	id: string;
	region: string;
	country: string;
	iso: string | null;
	currencyName: string;
	currencyCode: string;
	payoutType: 'local' | 'usd';
	providerFixedFeeUsd: number;
	providerFxReferencePct: number | null;
	source: {
		sheet: 'USD_payment CA' | 'Local_payment CA';
		row: number;
		columns: string;
	};
};

export type TransferCalculationInput = {
	amount: number;
	sourceCurrency: string;
	destinationCurrency: string;
	providerFixedFeeUsd: number;
	usdToSourceRate: number;
	sourceToDestinationRate: number;
};

export type TransferCalculationResult = {
	transferFee: number;
	clientRate: number;
	recipientGets: number;
	isPayable: boolean;
};

export function roundTransferMoney(value: number): number {
	return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function getClientFxMarginRate(sourceCurrency: string, destinationCurrency: string): number {
	if (sourceCurrency === destinationCurrency) return 0;
	return destinationCurrency === 'EUR'
		? TRANSFER_PRICING_POLICY.eurFxMarginRate
		: TRANSFER_PRICING_POLICY.otherFxMarginRate;
}

export function calculateTransfer(input: TransferCalculationInput): TransferCalculationResult {
	const values = [
		input.amount,
		input.providerFixedFeeUsd,
		input.usdToSourceRate,
		input.sourceToDestinationRate,
	];
	if (values.some((value) => !Number.isFinite(value) || value < 0)) {
		throw new Error('Calculation values must be finite and non-negative');
	}
	if (input.usdToSourceRate === 0 || input.sourceToDestinationRate === 0) {
		throw new Error('Exchange rates must be greater than zero');
	}

	const providerFeeInSource = input.providerFixedFeeUsd * input.usdToSourceRate;
	const transferFee = roundTransferMoney(
		providerFeeInSource * (1 + TRANSFER_PRICING_POLICY.providerMarkupRate),
	);
	const baseRate = input.sourceCurrency === input.destinationCurrency ? 1 : input.sourceToDestinationRate;
	const clientRate = baseRate * (1 - getClientFxMarginRate(input.sourceCurrency, input.destinationCurrency));
	const isPayable = input.amount > transferFee;
	const amountForExchange = isPayable ? input.amount - transferFee : 0;

	return {
		transferFee,
		clientRate,
		recipientGets: roundTransferMoney(amountForExchange * clientRate),
		isPayable,
	};
}
