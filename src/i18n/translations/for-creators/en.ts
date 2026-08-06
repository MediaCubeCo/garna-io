import { homeEn } from '../home/en';

export const forCreatorsEn = {
	meta: {
		title: 'Garna for Creators',
		description:
			'Receive payouts from creator platforms, Marketplace, freelance services and digital product platforms through one Garna account.',
	},
	images: {},
	hero: {
		badge: 'Early Access for selected creators',
		titleMain: 'Get paid from every creator platform in one place',
		titleAccent: 'in one place',
	description:
			'Receive income from Marketplace, platforms, and freelance services, then manage your balance and withdrawals with guided setup',
		cta: 'Contact Payout Manager',
		accountCta: 'Create Garna Account',
	},
	heroVisual: {
		sources: {
			envato: {
				label: 'Envato payout',
			},
			adobe: {
				label: 'Asset earnings',
			},
			patreon: {
				label: 'Member payout',
			},
		},
		balance: {
			label: 'Creator balance',
			account: 'Account',
		},
		destinations: {
			bank: {
				label: 'Bank transfer',
				title: 'Alex Carter USD',
			},
			card: {
				label: 'Card payout',
				title: 'Visa / Mastercard',
				meta: 'Card ending 4482',
			},
			crypto: {
				label: 'Crypto wallet',
				title: 'USDT wallet',
				meta: 'TRC20 • verified',
			},
		},
	},
	payoutDemo: {
		cursor: 'Creator',
		tabs: {
			platform: {
				title: 'Platform payout',
				subtitle: 'Creator earnings are sent',
			},
			balance: {
				title: 'Garna balance',
				subtitle: 'Funds arrive verified',
			},
			withdraw: {
				title: 'Withdraw funds',
				subtitle: 'Choose payout method',
			},
		},
		platform: {
			brand: 'marketplace',
			search: 'Search',
			unlimitedAccess: 'Unlimited Access',
			marketplaceHeading: 'Every type of asset, for any creator project',
			filters: {
				allItems: 'All items',
			},
			categories: {
				videoTemplates: 'Video Templates',
				soundEffects: 'Sound Effects',
				stockPhotos: 'Stock Photos',
				royaltyFreeMusic: 'Royalty-Free Music',
				graphicTemplates: 'Graphic Templates',
				fonts: 'Fonts',
				assets3d: '3D Assets',
				presentationTemplates: 'Presentation Templates',
			},
			finance: {
				creatorStudio: 'Creator studio',
				earningsWorkspace: 'Earnings workspace',
				juneCycle: 'June cycle',
				readyToTransfer: 'Ready to transfer',
				fromProducts: 'From 3 creator products',
				checked: 'Checked',
				sourcesVerified: 'Sources verified',
				avgRating: 'Avg rating',
				acrossPaidProducts: 'Across paid products',
			},
			products: {
				videoPack: 'Video template pack',
				videoMeta: '42 sales / 4.9 rating',
				musicBundle: 'Music creator bundle',
				musicMeta: '18 licenses / featured',
				graphicSet: 'Graphic mockup set',
				graphicMeta: '24 sales / trending',
			},
			destination: {
				title: 'Choose payout template',
				garnaBank: 'Garna bank account',
				debitCard: 'Debit card',
				noTemplate: 'No template selected yet',
				templateSelected: 'Payout template selected',
				sendPayout: 'Send payout',
			},
		},
		garna: {
			nav: {
				balance: 'Balance',
				notifications: 'Notifications',
				support: 'Support',
			},
			balanceTitle: 'Balance',
			internalAccountUsd: 'Internal account USD',
			accountNumber: 'Account number',
			actions: {
				send: 'Send',
				withdraw: 'Withdraw',
				addFunds: 'Add funds',
			},
			templates: {
				title: 'Templates',
				all: 'All',
				usdCard: 'USD card',
				eurAccount: 'EUR account',
			},
			transactions: {
				title: 'Transactions',
				marketplaceTitle: 'Marketplace earnings payout',
				marketplaceSubtitle: 'Credited from creator platform',
				danielTitle: 'Transfer from Daniel Cruz',
				collaborationPayment: 'Creator collaboration payment',
				usdCardTitle: 'Transfer to USD card',
				confirmed: 'Confirmed',
			},
			modal: {
				date: '12 June 2026 at 17:21',
				title: 'Marketplace payout credited',
				transactionDetails: 'Transaction details',
				amountUsd: 'Amount, USD',
				creditedAmount: 'Credited amount',
				gotIt: 'Got it',
			},
		},
		withdraw: {
			modal: {
				title: 'Withdraw funds',
				garnaInternalAccount: 'Garna internal account',
				toUsdCard: 'To USD card',
				withdrawAll: 'Withdraw all',
				enterAmount: 'Enter an amount - we will calculate the fee',
				debited: 'Debited',
				sent: 'sent',
				details: 'Details',
				withdrawButton: 'Withdraw',
			},
			success: {
				title: 'Transfer completed',
				copy: "The money is already in the recipient's account",
				close: 'Close',
			},
		},
	},
	creatorTypes: {
		title: 'Built for creators who earn globally',
		description:
			'Garna can help creators, freelancers and digital sellers who receive income from international platforms',
		cards: {
			designers: {
				title: 'Designers & illustrators',
				description: 'For creators selling graphics, templates, fonts, digital assets and visual products',
			},
			photographers: {
				title: 'Photographers & stock contributors',
				description: 'For contributors receiving royalties or payouts from stock photo and media platforms',
			},
			gameAssets: {
				title: '3D artists & game asset creators',
				description: 'For creators selling 3D models, plugins, textures, game assets and Marketplace products',
			},
			freelancers: {
				title: 'Freelancers & digital sellers',
				description:
					'For people earning from freelance platforms, subscriptions, courses, music, content or digital products',
			},
		},
	},
	accountFlow: {
		title: 'One account for creator payouts',
		description:
			'A guided way to connect platform payouts, receive funds to your Garna balance and withdraw using available payout methods',
		steps: {
			receive: {
				title: 'Receive platform payouts',
				description: 'Use Garna details where supported to receive payments from international creator platforms',
				footer: {
					platformPayout: 'Platform payout',
					garnaDetails: 'Garna details',
					balanceCredit: 'Balance credit',
				},
			},
			setup: {
				title: 'Get guided setup',
				description:
					'Tell us which platform you use. We will check the available payout method and guide you through setup',
				footer: {
					platformRules: 'Platform rules',
					payoutRoute: 'Payout route',
					setupGuidance: 'Setup guidance',
				},
			},
			withdraw: {
				title: 'Withdraw globally',
				description:
					'Withdraw your money using bank transfer, card, PayPal, Payoneer, crypto and other supported options',
				footer: {
					chooseMethod: 'Choose method',
					sendRequest: 'Send request',
					receiveFunds: 'Receive funds',
				},
			},
		},
	},
	process: {
		title: 'From platform payout to your Garna balance',
		description:
			'The flow is simple, but setup may differ by platform. During Early Access, we guide you through the important details',
		visual: {
			account: {
				profile: 'Profile',
				setup: 'Setup',
				statusLabel: 'Account status',
				statusValue: 'Opening',
				emailConfirmed: 'Email confirmed',
				kycReview: 'KYC in review',
				accountOpening: 'Account opening',
				legalName: 'Legal name',
				country: 'Country',
				currency: 'Currency',
			},
			chat: {
				managerOnline: 'Manager online',
				messageIncome: 'Income from Envato',
				messageCountry: 'Send country and payout currency',
				messagePlatform: 'Portugal, USD. I also use Adobe Stock',
				messageCheck: 'Got it. I will check supported route and invoice rules',
				messageWithdrawal: 'Please include the first withdrawal steps too',
				platformsLabel: 'Platforms',
				platformsValue: '2 added',
				routeLabel: 'Route check',
				routeValue: 'In progress',
			},
			details: {
				title: 'Garna details',
				routing: 'Routing',
				account: 'Account',
				method: 'Method',
				beneficiary: 'Beneficiary',
				reference: 'Reference',
				envatoReady: 'Envato ready',
				adobeManual: 'Adobe Stock manual',
				invoiceRequired: 'Invoice required',
				routeStatus: 'Route status',
				checked: 'Checked',
				useInPlatform: 'Use in platform',
				readyToPaste: 'Ready to paste',
				copyAction: 'Copy payout details',
			},
			withdraw: {
				title: 'Envato withdrawal',
				summary: 'Payout summary',
				availableNow: 'Available now',
				marketplaceFee: 'Marketplace fee',
				paid: 'Paid',
				routeDetails: 'Route details',
				destination: 'Destination',
				request: 'Request',
				prepared: 'Prepared',
				requestAction: 'Request payout',
			},
			invoice: {
				title: 'Invoice #2048',
				client: 'Client',
				amount: 'Amount',
				status: 'Status',
				matching: 'Matching',
				reference: 'Reference',
				junePayout: 'June payout',
				proofAttached: 'Payout proof attached',
				screenshot: 'Screenshot',
				platformReport: 'Platform report',
			},
			balance: {
				title: 'Garna balance',
				credited: 'Credited',
				incomingPayout: 'Incoming payout',
				availableNow: 'Available now',
				accountNumber: 'Account number',
				bank: 'Bank',
				card: 'Card',
				crypto: 'Crypto',
				withdrawAction: 'Withdraw funds',
			},
		},
		steps: {
			account: {
				title: 'Create your Garna account',
				description: 'Register in Garna and complete verification. KYC usually takes 1-2 business days',
			},
			platform: {
				title: 'Tell us your platform',
				description: 'Contact your payout manager and tell us where you receive income',
			},
			instructions: {
				title: 'Get setup instructions',
				description: 'We will check the available payout method and provide the correct Garna details or next steps',
			},
			request: {
				title: 'Request payout on the platform',
				description: 'Add the provided details where supported and request a withdrawal from your platform',
			},
			invoice: {
				title: 'Create an invoice in Garna',
				description:
					'Create an invoice and attach the required confirmation, such as a payout screenshot or platform document',
			},
			receive: {
				title: 'Receive and withdraw funds',
				description:
					'Garna matches the payment with your invoice, credits your balance, and you withdraw using your preferred available method',
			},
		},
	},
	earlyAccessFee: {
		title: 'Reduced fee for\nEarly Access creators',
		description:
			"We're opening creator payouts in Early Access and manually helping selected users configure their first platform setups",
		cta: 'Contact Payout Manager',
		standard: {
			label: 'Standard fee',
			caption:
				'The regular Garna service fee applies after Early Access or for creator payout setups outside the selected launch group.',
		},
		access: {
			label: 'Early Access fee',
			caption:
				'Early Access creators can receive a reduced 1.5% Garna service fee for their first payouts while we help validate and fine-tune the setup flow.',
			disclaimer:
				"The percentages above refer only to Garna's service fee. Platform withdrawal fees, payment method charges, FX costs or other third-party fees may vary and are not included.",
		},
		banner: {
			title: 'Reduced fee for creator payouts',
			description: 'Standard Garna service fee applies after Early Access or outside the selected launch group',
			terms: 'Launch terms',
			accessCaption:
				'Selected creators can start with a reduced Garna service fee while we help validate the first payout setup.',
			disclaimer: 'Garna service fee only. Platform, payment method and FX fees may vary.',
			cta: 'Contact Payout Manager',
		},
	},
	platforms: {
		title: 'Popular platforms\nwe can help with',
		description:
			"We're starting with popular creator platforms, Marketplace and digital product services. Some platforms can be configured directly, while others may require manual guidance from Garna or the platform's own support team",
	},
	globalInfrastructure: {
		title: 'Global payout infrastructure for modern teams and creators',
		description:
			'Garna already helps businesses and contractors work with international payouts. Now we are bringing the same payout infrastructure to creators who earn from global platforms',
		cards: {
			platformPayouts: {
				title: 'Global platform payouts',
				description: 'Receive creator income across countries, currencies and payout methods',
			},
			currencyRoutes: {
				title: 'Multi-currency payout routes',
				description: 'Use the right payout currency and route from one Garna account',
			},
			setupSupport: {
				title: 'Always-on setup support',
				description: 'Get help choosing details, invoices and the next setup steps',
			},
			complianceFlow: {
				metric: '1-2 days',
				title: 'Compliance-ready payout flow',
				description: 'Keep verification, documents and payment matching organized',
			},
		},
	},
	managerSupport: {
		title: 'Need help with your first setup?',
		description:
			'Your payout manager will help you understand whether your platform is supported, which payout method is available, and what steps you need to complete',
		actions: {
			telegram: 'Message on Telegram',
			email: 'Send an email',
		},
		visual: {
			managerOnline: 'Payout manager online',
			messages: {
				income: 'I receive income from Envato and Adobe Stock 👋',
				platformCountry: 'Hi Alex, send your platform and payout country. I will check which Garna details you can use',
				firstWithdrawal: 'Great, I also need help with the first withdrawal',
				ready: 'All set. Platform rules checked, payout route prepared, invoice matching included ✅',
			},
			route: {
				title: 'Personal manager',
				online: 'Online during setup',
				channels: 'Telegram / Email',
			},
			dialog: {
				status: 'Manager online',
				time: '2 min',
				request: 'I need help with my first platform payout',
				reply: 'Send your platform and country. I will check the setup steps for you',
			},
			steps: {
				platformCheck: 'Platform check',
				setupGuidance: 'Setup guidance',
				payoutMethod: 'Payout method',
				firstWithdrawal: 'First withdrawal',
			},
			panel: {
				manager: 'Personal manager',
				title: 'First payout setup',
				online: 'Online',
				income: 'I receive income from Envato and Adobe Stock',
				checkRules: 'We’ll check platform rules and send the available payout route',
			},
		},
	},
	creatorFaq: {
		title: 'Questions creators usually ask',
		subtitle: 'A few important details before you start your first payout setup with Garna',
		items: {
			creatorPlatform: {
				question: 'Is Garna a creator platform?',
				answer:
					'No. Garna is not a Marketplace and does not sell your content. Garna helps creators receive payouts from international platforms and withdraw funds using available payout methods',
			},
			availability: {
				question: 'Is this available for everyone?',
				answer:
					'Creator payouts are currently available in Early Access. We start with selected creators and platforms to make sure each setup works correctly',
			},
			account: {
				question: 'Do I need to create a Garna account?',
				answer: 'Yes. You need a Garna account to complete verification, create invoices, receive funds and withdraw your balance',
			},
			verification: {
				question: 'How long does verification take?',
				answer: 'KYC usually takes 1-2 business days, depending on the documents and verification flow',
			},
			platformFunds: {
				question: 'How long does it take to receive funds from a platform?',
				answer:
					'It depends on the platform and payout method. In many cases, incoming funds may take 1-5 business days after the platform sends the payout',
			},
			withdrawal: {
				question: 'How long does withdrawal from Garna take?',
				answer:
					'Withdrawal timing depends on the selected method and destination. As a general guideline, it may take 1-2 business days for many standard methods',
			},
			anyPlatform: {
				question: 'Can I use Garna with any platform?',
				answer:
					'Not always. Each platform has its own payout rules and supported methods. During setup, we confirm whether your platform can be processed and which flow applies',
			},
			fee: {
				question: 'What is the fee?',
				answer:
					'The standard Garna service fee is 5.5%. Early Access creators can receive a reduced 1.5% Garna service fee for their first payouts, subject to final confirmation and setup details',
			},
		},
	},
	creatorFinalCta: {
		title: 'Start receiving creator payouts with Garna',
		description:
			"Contact your payout manager to check your platform and get guided setup, or create your Garna account when you're ready to continue",
		contact: 'Contact Payout Manager',
		account: 'Create Garna Account',
	},
	sectionHeadings: {
		hireEmployeesWorldwide: 'Hire Employees Worldwide',
		embeddedPayrollInfrastructure: 'Embedded Payroll Infrastructure',
	},
	sectionDescriptions: {
		hireEmployeesWorldwide:
			'Simplify the hiring process for employees and freelancers with Garna. Unlike other companies, we will resolve not only the financial, but also legal side while you are looking for the right specialists',
		embeddedPayrollInfrastructure:
			'Use Garna as your backend provider: integrate contractor management and payments into your product or launch full-fledged payroll services under your own brand',
	},
	faq: {
		title: 'Questions creators usually ask',
		items: {
			q1: {
				question: 'Is Garna a creator platform?',
				answer:
					'No. Garna is not a Marketplace and does not sell your content. Garna helps creators receive payouts from international platforms and withdraw funds using available payout methods',
			},
			q2: {
				question: 'Is this available for everyone?',
				answer:
					'Creator payouts are currently available in Early Access. We start with selected creators and platforms to make sure each setup works correctly',
			},
			q3: {
				question: 'Do I need to create a Garna account?',
				answer:
					'Yes. You need a Garna account to complete verification, create invoices, receive funds and withdraw your balance',
			},
			q4: {
				question: 'How long does verification take?',
				answer: 'KYC usually takes 1-2 business days, depending on the documents and verification flow',
			},
			q5: {
				question: 'How long does it take to receive funds from a platform?',
				answer:
					'It depends on the platform and payout method. In many cases, incoming funds may take 1-5 business days after the platform sends the payout',
			},
			q6: {
				question: 'How long does withdrawal from Garna take?',
				answer:
					'Withdrawal timing depends on the selected method and destination. As a general guideline, it may take 1-2 business days for many standard methods',
			},
			q7: {
				question: 'Can I use Garna with any platform?',
				answer:
					'Not always. Each platform has its own payout rules and supported methods. During setup, we confirm whether your platform can be processed and which flow applies',
			},
			q8: {
				question: 'What is the fee?',
				answer:
					'The standard Garna service fee is 5.5%. Early Access creators can receive a reduced 1.5% Garna service fee for their first payouts, subject to final confirmation and setup details',
			},
		},
	},
	finalCta: {
		title: 'Launch Global Payroll Software on Autopilot Today',
		description: 'Pay your team in 150+ countries with just a few clicks. No red tape, just fast payments',
		button: 'Book a demo',
	},
	footer: homeEn.footer,
	bookingWidget: homeEn.bookingWidget,
};
