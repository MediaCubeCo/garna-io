import { homeEn } from '../home/en';

export const enterprisePayrollEn = {
	...homeEn,
	common: {
		learnMore: 'Learn more',
	},
	meta: {
		title: 'International Payroll System for Large Companies | Garna',
		description:
			'Explore the opportunities of partnering with Garna, the system that offers an efficient global payroll solution.',
	},
	howTo: {
		...homeEn.howTo,
		title: 'How Payroll Works: 4 Simple Steps',
		description:
			"For big companies, getting payroll right without facing errors is a major challenge. That's why we invented a system of several simple steps to make",
		steps: {
			step1: {
				title: 'Set Up Your Team and Payroll Structure',
				description:
					'Get your company set up with a bank account, assign roles to your payroll team, bring on board any new employees & contractors, and sort out all the entities and teams you need',
			},
			step2: {
				title: 'Automate Calculations and Compliance',
				description: 'Connect your dashboard via API and automate payroll tasks',
			},
			step3: {
				title: 'Run Payroll and Global Payments',
				description:
					'Sort out funding and send payments to all your employees and contractors worldwide via payout methods from local bank transfers to SWIFT, SEPA, local bank transfers, PayPal, Payoneer or crypto',
			},
			step4: {
				title: 'Track, Report, and Scale',
				description:
					'Control payroll operations through a simple-to-use dashboard, access to real-time reporting and analytics, track down the cost of your workforce in every region',
			},
		},
	},
	heroVisual: {
		entitySync: 'Entity sync',
		markets: '24 markets',
		entitiesSynced: 'Entities synced',
		commandTitle: 'Enterprise payroll command',
		commandMeta: '6 entities · 38 countries',
		live: 'Live',
		readyCycle: 'Payroll ready this cycle',
		countries: 'Countries',
		entities: 'Entities',
		workers: 'Workers',
		approvalQueue: 'Approval queue',
		approvers: 'Approvers',
		multiCountryPayroll: 'Multi-country payroll',
		multiCountryMeta: 'Employees · contractors · vendors',
		ready: 'Ready',
		complianceChecks: 'Compliance checks',
		complianceMeta: 'Taxes · contracts · local rules',
		running: 'Running',
		regions: '14 regions',
	},
	whyGarna: homeEn.whyGarna,
	enterpriseFinalCta: {
		title: 'Global Payroll Is Easy When Made By Using Garna',
		description:
			"Garna provides the global payroll infrastructure independently from the task — whether you're scaling into new markets, dealing with distributed teams, or replacing old, fragmented payroll systems, it’ll adjust to your needs seamlessly",
		button: 'Try now',
	},
};
