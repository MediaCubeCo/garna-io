import { homeEn } from '../home/en';
import { homeEs } from '../home/es';
import { homePt } from '../home/pt';
import { homeRu } from '../home/ru';

const enOverrides = {
	meta: {
		title: 'Contractor of Record Solutions for Global Teams | Garna',
		description:
			'Hire and manage international contractors with compliant agreements, onboarding, invoices, and secure global payouts through Garna.',
	},
	hero: {
		...homeEn.hero,
		title: 'Pay Contractors Anywhere, Without the Hassle',
		description: 'One transfer — countless possibilities. Pay remunerations in over 150 countries with minimal effort',
		cta: 'Book a demo',
	},
	contractorCost: {
		title: 'See What Global Contractor Management Costs You',
		description:
			'Contractor fees are only part of the cost. Consider payment fees, FX, admin time, compliance, and multiple software subscriptions',
		button: 'Get a Custom Quote',
		visual: {
			estimate: 'Monthly cost estimate',
			ready: 'Ready',
			description: 'Fees, FX, admin time, and compliance in one view',
		},
	},
	contractorFinalCta: {
		title: 'Pay Every Contractor Through One Compliant Flow',
		description:
			'Garna keeps contractor agreements, invoices, approvals, and cross-border payouts in one place, so your team can scale without local entities or payment chaos',
		button: 'Book a demo',
	},
	faq: {
		title: 'FAQ on Contractor of Record',
		items: {
			q1: {
				question: 'What is a Contractor of Record (COR)?',
				answer:
					'A Contractor of Record helps businesses work with independent contractors without setting up a local entity. It supports contracts, onboarding, invoicing, payments, and documentation while the contractor remains self-employed.',
			},
			q2: {
				question: 'Who is COR a good fit for?',
				answer:
					'COR is ideal for companies working with independent contractors across multiple countries, including startups, SaaS companies, digital marketing and creative agencies, and marketplaces. International contractor management gets easier without requiring a local entity in every market.',
			},
			q3: {
				question: 'Which countries, currencies, and payout methods are supported?',
				answer:
					'Garna supports contractor payments in 150+ countries and 80+ currencies. Payout options include SWIFT, SEPA, local bank transfers, PayPal, Payoneer, USDT, and USDC, depending on the country and payment method.',
			},
			q4: {
				question: 'How do I fund my balance?',
				answer:
					'You can fund your Garna balance via the available payment options in your account and use it to pay contractors. Funding options vary depending on your account and payment method.',
			},
			q5: {
				question: 'Can I pay many contractors at once?',
				answer:
					'Yes, Garna supports bulk payments, so you can pay multiple contractors through a single workflow instead of processing each international transfer separately.',
			},
			q6: {
				question: 'Why should I choose Garna over other COR providers?',
				answer:
					'Choose Garna because it combines contractor management and global payments in one platform. You can manage contracts, invoices, and payouts across 150+ countries and 80+ currencies, with multiple payment methods and 24/7 support.',
			},
		},
	},
	whyGarna: {
		...homeEn.whyGarna,
		title: "Build to Simplify Contractors' Operations",
		description: 'Discover the key benefits that make payroll simple, secure, and global',
		cards: {
			...homeEn.whyGarna.cards,
			management: {
				title: 'Simplify Contractor Management',
				description: 'Handle contracts, onboarding, invoices, approvals, and documentation from one platform',
			},
			payments: {
				title: 'Pay Globally, Your Way',
				description:
					'Pay contractors in USD and 80+ local currencies through bank transfers, cards, e-wallets, or crypto',
			},
			risk: {
				title: 'Avoid misclassification',
				description:
					'With us as your Contractor and Agent of Record, legal liability and talent-related risks stay on our side, protecting your business from legal complications',
			},
		},
	},
	contractorBenefits: {
		...homeEn.contractorBenefits,
		title: 'Everything You Need to Manage Contractors',
		description: 'With Garna, you can manage contractor engagement and global payments from one platform',
		methods: {
			...homeEn.contractorBenefits.methods,
			title: 'One Contract Instead of\u00a0Dozens',
			description: 'Manage everything through one contract and a single consolidated invoice',
		},
		mobile: {
			...homeEn.contractorBenefits.mobile,
			title: 'Reduced Administrative Costs',
			description:
				'Garna handles all paperwork for you: from agreements execution to invoices and custom documents',
		},
		earlyPayout: {
			...homeEn.contractorBenefits.earlyPayout,
			title: 'Direct Intellectual Property transition',
			description: 'We make sure that all IPs created by contractors are transferred directly and carefully to you',
		},
		visual: {
			contractsFolder: 'Contracts',
			folderTag: 'All in one',
			clientAgreement: 'Client agreement',
			signed: 'Signed',
			client: 'Client',
			provider: 'Provider',
			effective: 'Effective',
			effectiveDate: 'Feb 2026',
			design: 'Design',
			engineering: 'Engineering',
			monthlyInvoice: 'Monthly invoice',
			timeSaved: 'Time saved',
			timeSavedValue: '8.5h',
			onAdminTasks: 'on admin tasks',
			invoices: 'Invoices',
			docs: 'Docs',
			agreements: 'Agreements',
			ipAssignment: 'IP assignment',
			filed: 'Filed',
			rightsTransfer: 'Rights transfer',
			contractor: 'Contractor',
			recipient: 'Recipient',
			works: 'Works',
			designFiles: 'Design files',
		},
	},
	howTo: {
		title: 'How Garna Contractor of Record Works',
		description:
			'From invoice approval to the final payout, manage the entire contractor payment workflow in one place.',
		steps: {
			step1: {
				title: 'Setup your account',
				description: 'Create your company profile and verify your business details to get access to the platform',
			},
			step2: {
				title: 'Invite your team',
				description: 'Add contractors to the dashboard and assign roles, access, and agreement terms',
			},
			step3: {
				title: 'Fund your balance',
				description: 'Top up your corporate wallet using bank transfer, SWIFT, SEPA, or crypto assets',
			},
			step4: {
				title: 'Send payouts',
				description: 'Execute global payrolls in one click with automated tax handling and compliance',
			},
		},
		panel: {
			signup: {
				title: 'Sign up in Garna',
				companyNameLabel: 'Company name',
				registrationNumberLabel: 'Registration number',
				countryLabel: 'Country of registration',
				businessEmailLabel: 'Business email',
				registrationDateLabel: 'Date of registration',
				continueButton: 'Continue',
			},
			invite: {
				title: 'Invite contractors',
				roleLabel: 'Role',
				roleValue: 'Design contractor',
				emailLabel: 'Email',
				agreementLabel: 'Agreement',
				agreementValue: 'Client terms',
				accessLabel: 'Access',
				accessValue: 'Contractor dashboard',
				sendInvitesButton: 'Send invites',
			},
			fund: {
				title: 'Balance',
				paymentAccount: 'Payment account USD',
				accountNumber: 'Account number',
				actions: {
					send: 'Send',
					withdraw: 'Withdraw',
					topUp: 'Top up',
				},
				templates: 'Templates',
				all: 'All',
				n26Card: 'N26 card',
				designerPayout: 'Designer payout',
				lewisAccount: 'M. Lewis account',
			},
			send: {
				title: 'Mass transfer',
				description: 'Upload CSV and send payouts',
				uploadedFile: 'Uploaded file',
				fileName: 'Salary_to_all_contractors.csv',
				transactions: 'Transactions',
				totalAmount: 'Total amount',
				sendTransfers: 'Send transfers',
			},
		},
	},
};

const esOverrides = {
	meta: {
		title: 'Soluciones Contractor of Record para equipos globales | Garna',
		description:
			'Contrata y gestiona contratistas internacionales con acuerdos conformes, onboarding, facturas y pagos globales seguros a través de Garna.',
	},
	hero: {
		...homeEs.hero,
		title: 'Paga a contratistas en cualquier país, sin complicaciones',
		description: 'Una transferencia, múltiples posibilidades. Paga remuneraciones en más de 150 países con mínimo esfuerzo',
		cta: 'Reservar demo',
	},
	contractorCost: {
		title: 'Descubre cuánto te cuesta gestionar contratistas globales',
		description:
			'Los honorarios son solo parte del coste. Suma comisiones, FX, administración, cumplimiento y suscripciones',
		button: 'Solicitar una cotización',
		visual: {
			estimate: 'Estimación mensual',
			ready: 'Listo',
			description: 'Comisiones, FX y normativa',
		},
	},
	contractorFinalCta: {
		title: 'Paga a cada contratista con un solo flujo conforme',
		description:
			'Garna mantiene acuerdos, facturas, aprobaciones y pagos internacionales a contratistas en un solo lugar, para que tu equipo escale sin entidades locales ni caos de pagos',
		button: 'Reservar demo',
	},
	faq: {
		title: 'Preguntas frecuentes sobre Contractor of Record',
		items: {
			q1: {
				question: '¿Qué es un Contractor of Record (COR)?',
				answer:
					'Un Contractor of Record ayuda a las empresas a trabajar con contratistas independientes sin crear una entidad local. Gestiona contratos, onboarding, facturación, pagos y documentación, mientras el contratista continúa siendo autónomo.',
			},
			q2: {
				question: '¿Para quién es adecuado un COR?',
				answer:
					'Un COR es ideal para empresas que trabajan con contratistas independientes en varios países, como startups, empresas SaaS, agencias de marketing digital y creativas, y marketplaces. Facilita la gestión internacional de contratistas sin necesidad de crear una entidad local en cada mercado.',
			},
			q3: {
				question: '¿Qué países, monedas y métodos de pago son compatibles?',
				answer:
					'Garna permite pagar a contratistas en más de 150 países y en más de 80 monedas. Las opciones de pago incluyen SWIFT, SEPA, transferencias bancarias locales, PayPal, Payoneer, USDT y USDC, según el país y el método de pago.',
			},
			q4: {
				question: '¿Cómo puedo financiar mi saldo?',
				answer:
					'Puedes financiar tu saldo de Garna mediante las opciones de pago disponibles en tu cuenta y utilizarlo para pagar a contratistas. Las opciones de financiación varían según tu cuenta y el método de pago.',
			},
			q5: {
				question: '¿Puedo pagar a muchos contratistas a la vez?',
				answer:
					'Sí. Garna permite realizar pagos masivos para pagar a varios contratistas mediante un único flujo, en lugar de procesar cada transferencia internacional por separado.',
			},
			q6: {
				question: '¿Por qué elegir Garna frente a otros proveedores de COR?',
				answer:
					'Garna combina la gestión de contratistas y los pagos globales en una sola plataforma. Puedes gestionar contratos, facturas y pagos en más de 150 países y más de 80 monedas, con múltiples métodos de pago y soporte 24/7.',
			},
		},
	},
	whyGarna: {
		...homeEs.whyGarna,
		title: 'Creado para simplificar la gestión de contratistas',
		description: 'Descubre las ventajas que hacen la nómina simple, segura y global',
		cards: {
			...homeEs.whyGarna.cards,
			management: {
				title: 'Simplifica la gestión de contratistas',
				description: 'Gestiona contratos, onboarding, facturas y documentos en una plataforma',
			},
			payments: {
				title: 'Paga globalmente, a tu manera',
				description: 'Paga en USD y 80+ monedas por banco, tarjeta, e-wallets o cripto',
			},
			risk: {
				title: 'Evita la clasificación errónea',
				description:
					'Como Contractor and Agent of Record, asumimos la responsabilidad legal y reducimos riesgos para tu empresa',
			},
		},
	},
	contractorBenefits: {
		...homeEs.contractorBenefits,
		title: 'Todo lo que necesitas para gestionar contratistas',
		description: 'Con Garna, puedes gestionar la relación con contratistas y los pagos globales desde una sola plataforma',
		methods: {
			...homeEs.contractorBenefits.methods,
			title: 'Un contrato en lugar de\u00a0decenas',
			description: 'Gestiona todo mediante un solo contrato y una factura consolidada',
		},
		mobile: {
			...homeEs.contractorBenefits.mobile,
			title: 'Costes administrativos reducidos',
			description: 'Garna gestiona contratos, facturas y documentos',
		},
		earlyPayout: {
			...homeEs.contractorBenefits.earlyPayout,
			title: 'Transferencia directa de propiedad intelectual',
			description: 'La IP creada por contratistas pasa directo a tu empresa',
		},
		visual: {
			contractsFolder: 'Contratos',
			folderTag: 'Todo en uno',
			clientAgreement: 'Acuerdo con cliente',
			signed: 'Firmado',
			client: 'Cliente',
			provider: 'Proveedor',
			effective: 'Vigente',
			effectiveDate: 'feb. 2026',
			design: 'Design',
			engineering: 'Engineering',
			monthlyInvoice: 'Factura mensual',
			timeSaved: 'Tiempo ahorrado',
			timeSavedValue: '8.5h',
			onAdminTasks: 'en tareas administrativas',
			invoices: 'Facturas',
			docs: 'Docs',
			agreements: 'Acuerdos',
			ipAssignment: 'Cesión de IP',
			filed: 'Archivado',
			rightsTransfer: 'Transferencia de derechos',
			contractor: 'Contratista',
			recipient: 'Destinatario',
			works: 'Trabajos',
			designFiles: 'Archivos de diseño',
		},
	},
	howTo: {
		title: 'Cómo funciona Contractor of Record de Garna',
		description:
			'Desde la aprobación de la factura hasta el pago final, gestiona todo el flujo de pagos a contratistas en un solo lugar.',
		steps: {
			step1: {
				title: 'Configura tu cuenta',
				description: 'Crea el perfil de tu empresa y verifica tus datos para acceder a la plataforma',
			},
			step2: {
				title: 'Invita a tu equipo',
				description: 'Añade contratistas y asigna roles, accesos y términos de acuerdo',
			},
			step3: {
				title: 'Fondea tu saldo',
				description: 'Recarga la cartera corporativa por banco, SWIFT, SEPA o cripto',
			},
			step4: {
				title: 'Envía pagos',
				description: 'Envía pagos globales en un clic con gestión fiscal y cumplimiento',
			},
		},
		panel: {
			signup: {
				title: 'Regístrate en Garna',
				companyNameLabel: 'Nombre de la empresa',
				registrationNumberLabel: 'Número de registro',
				countryLabel: 'País de registro',
				businessEmailLabel: 'Email empresarial',
				registrationDateLabel: 'Fecha de registro',
				continueButton: 'Continuar',
			},
			invite: {
				title: 'Invitar contratistas',
				roleLabel: 'Rol',
				roleValue: 'Design contractor',
				emailLabel: 'Email',
				agreementLabel: 'Acuerdo',
				agreementValue: 'Términos del cliente',
				accessLabel: 'Acceso',
				accessValue: 'Panel de contratista',
				sendInvitesButton: 'Enviar invitaciones',
			},
			fund: {
				title: 'Saldo',
				paymentAccount: 'Cuenta de pago USD',
				accountNumber: 'Número de cuenta',
				actions: {
					send: 'Enviar',
					withdraw: 'Retirar',
					topUp: 'Recargar',
				},
				templates: 'Plantillas',
				all: 'Todas',
				n26Card: 'Tarjeta N26',
				designerPayout: 'Designer payout',
				lewisAccount: 'Cuenta M. Lewis',
			},
			send: {
				title: 'Transferencia masiva',
				description: 'Sube CSV y envía pagos',
				uploadedFile: 'Archivo subido',
				fileName: 'Salary_to_all_contractors.csv',
				transactions: 'Transacciones',
				totalAmount: 'Importe total',
				sendTransfers: 'Enviar',
			},
		},
	},
};

const ptOverrides = {
	meta: {
		title: 'Soluções Contractor of Record para equipas globais | Garna',
		description:
			'Contrate e gira contratados internacionais com contratos em conformidade, onboarding, faturas e pagamentos globais seguros através da Garna.',
	},
	hero: {
		...homePt.hero,
		title: 'Pague contratados em qualquer país, sem complicações',
		description: 'Uma transferência, inúmeras possibilidades. Pague remunerações em mais de 150 países com esforço mínimo',
		cta: 'Agendar demo',
	},
	contractorCost: {
		title: 'Veja quanto custa gerir contratados globais',
		description:
			'Os honorários são só parte do custo. Some taxas, FX, administração, conformidade e subscrições',
		button: 'Pedir proposta personalizada',
		visual: {
			estimate: 'Estimativa mensal',
			ready: 'Pronto',
			description: 'Taxas, FX e normas',
		},
	},
	contractorFinalCta: {
		title: 'Pague cada contratado em um fluxo único e conforme',
		description:
			'A Garna mantém contratos, faturas, aprovações e pagamentos internacionais a contratados em um só lugar, para que a sua equipa escale sem entidades locais nem caos de pagamentos',
		button: 'Agendar demo',
	},
	faq: {
		title: 'Perguntas frequentes sobre Contractor of Record',
		items: {
			q1: {
				question: 'O que é um Contractor of Record (COR)?',
				answer:
					'Um Contractor of Record ajuda as empresas a trabalhar com contratados independentes sem criar uma entidade local. Dá suporte a contratos, onboarding, faturação, pagamentos e documentação, enquanto o contratado continua a trabalhar por conta própria.',
			},
			q2: {
				question: 'Para quem é indicado um COR?',
				answer:
					'Um COR é ideal para empresas que trabalham com contratados independentes em vários países, incluindo startups, empresas SaaS, agências de marketing digital e criativas e marketplaces. A gestão internacional de contratados torna-se mais simples, sem exigir uma entidade local em cada mercado.',
			},
			q3: {
				question: 'Que países, moedas e métodos de pagamento são suportados?',
				answer:
					'A Garna suporta pagamentos a contratados em mais de 150 países e mais de 80 moedas. As opções de pagamento incluem SWIFT, SEPA, transferências bancárias locais, PayPal, Payoneer, USDT e USDC, dependendo do país e do método de pagamento.',
			},
			q4: {
				question: 'Como posso financiar o meu saldo?',
				answer:
					'Pode financiar o seu saldo Garna através das opções de pagamento disponíveis na sua conta e utilizá-lo para pagar a contratados. As opções de financiamento variam consoante a sua conta e o método de pagamento.',
			},
			q5: {
				question: 'Posso pagar a vários contratados ao mesmo tempo?',
				answer:
					'Sim. A Garna suporta pagamentos em massa, permitindo pagar a vários contratados num único fluxo, em vez de processar cada transferência internacional separadamente.',
			},
			q6: {
				question: 'Por que devo escolher a Garna em vez de outros fornecedores de COR?',
				answer:
					'A Garna combina gestão de contratados e pagamentos globais numa única plataforma. Pode gerir contratos, faturas e pagamentos em mais de 150 países e mais de 80 moedas, com vários métodos de pagamento e suporte 24/7.',
			},
		},
	},
	whyGarna: {
		...homePt.whyGarna,
		title: 'Criado para simplificar a gestão de contratados',
		description: 'Descubra os benefícios que tornam o payroll simples, seguro e global',
		cards: {
			...homePt.whyGarna.cards,
			management: {
				title: 'Simplifique a gestão de contratados',
				description: 'Gerencie contratos, onboarding, faturas e documentos em uma plataforma',
			},
			payments: {
				title: 'Pague globalmente, do seu jeito',
				description: 'Pague em USD e 80+ moedas por banco, cartão, e-wallets ou cripto',
			},
			risk: {
				title: 'Evite classificação incorreta',
				description:
					'Como Contractor and Agent of Record, assumimos a responsabilidade legal e reduzimos riscos para a sua empresa',
			},
		},
	},
	contractorBenefits: {
		...homePt.contractorBenefits,
		title: 'Tudo o que precisa para gerir contratados',
		description: 'Com a Garna, pode gerir a colaboração com contratados e os pagamentos globais numa única plataforma',
		methods: {
			...homePt.contractorBenefits.methods,
			title: 'Um contrato em vez de\u00a0dezenas',
			description: 'Gerencie tudo por meio de um contrato e uma fatura consolidada',
		},
		mobile: {
			...homePt.contractorBenefits.mobile,
			title: 'Custos administrativos reduzidos',
			description: 'A Garna trata de contratos, faturas e documentos',
		},
		earlyPayout: {
			...homePt.contractorBenefits.earlyPayout,
			title: 'Transferência direta de propriedade intelectual',
			description: 'Transferimos a IP criada por contratados diretamente para a sua empresa',
		},
		visual: {
			contractsFolder: 'Contratos',
			clientAgreement: 'Contrato do cliente',
			signed: 'Assinado',
			client: 'Cliente',
			provider: 'Provedor',
			effective: 'Vigente',
			effectiveDate: 'fev. 2026',
			design: 'Design',
			engineering: 'Engineering',
			monthlyInvoice: 'Fatura mensal',
			timeSaved: 'Tempo poupado',
			timeSavedValue: '8.5h',
			onAdminTasks: 'em tarefas administrativas',
			invoices: 'Faturas',
			docs: 'Docs',
			agreements: 'Contratos',
			folderTag: 'Tudo em um',
			ipAssignment: 'Cessão de IP',
			filed: 'Arquivado',
			rightsTransfer: 'Transferência de direitos',
			contractor: 'Contratado',
			recipient: 'Destinatário',
			works: 'Trabalhos',
			designFiles: 'Ficheiros de design',
		},
	},
	howTo: {
		title: 'Como funciona o Contractor of Record da Garna',
		description:
			'Da aprovação da fatura ao pagamento final, gira todo o fluxo de pagamentos a contratados num único lugar.',
		steps: {
			step1: {
				title: 'Configure a sua conta',
				description: 'Crie o perfil da sua empresa e verifique os dados para acessar a plataforma',
			},
			step2: {
				title: 'Convide a sua equipa',
				description: 'Adicione contratados e atribua funções, acessos e termos de contrato',
			},
			step3: {
				title: 'Carregue o saldo',
				description: 'Carregue a carteira por banco, SWIFT, SEPA ou cripto',
			},
			step4: {
				title: 'Envie pagamentos',
				description: 'Envie pagamentos globais em um clique com fiscalidade e conformidade',
			},
		},
		panel: {
			signup: {
				title: 'Cadastre-se na Garna',
				companyNameLabel: 'Nome da empresa',
				registrationNumberLabel: 'Número de registo',
				countryLabel: 'País de registo',
				businessEmailLabel: 'Email empresarial',
				registrationDateLabel: 'Data de registo',
				continueButton: 'Continuar',
			},
			invite: {
				title: 'Convidar contratados',
				roleLabel: 'Função',
				roleValue: 'Design contractor',
				emailLabel: 'Email',
				agreementLabel: 'Contrato',
				agreementValue: 'Termos do cliente',
				accessLabel: 'Acesso',
				accessValue: 'Painel do contratado',
				sendInvitesButton: 'Enviar convites',
			},
			fund: {
				title: 'Saldo',
				paymentAccount: 'Conta de pagamento USD',
				accountNumber: 'Número da conta',
				actions: {
					send: 'Enviar',
					withdraw: 'Sacar',
					topUp: 'Carregar',
				},
				templates: 'Modelos',
				all: 'Todos',
				n26Card: 'Cartão N26',
				designerPayout: 'Designer payout',
				lewisAccount: 'Conta M. Lewis',
			},
			send: {
				title: 'Transferência em massa',
				description: 'Carregue CSV e envie pagamentos',
				uploadedFile: 'Ficheiro carregado',
				fileName: 'Salary_to_all_contractors.csv',
				transactions: 'Transações',
				totalAmount: 'Valor total',
				sendTransfers: 'Enviar',
			},
		},
	},
};

const ruOverrides = {
	meta: {
		title: 'Решения Contractor of Record для международных команд | Garna',
		description:
			'Нанимайте и управляйте международными подрядчиками с корректными договорами, онбордингом, инвойсами и безопасными глобальными выплатами через Garna.',
	},
	hero: {
		...homeRu.hero,
		title: 'Платите подрядчикам в любой стране без лишней рутины',
		description: 'Один перевод — много возможностей. Выплаты в 150+ странах с минимальными усилиями',
		cta: 'Забронировать демо',
	},
	contractorCost: {
		title: 'Сколько стоит управление подрядчиками',
		description:
			'Гонорар — только часть расходов. Учитывайте комиссии, FX, администрирование, требования и подписки',
		button: 'Получить расчет',
		visual: {
			estimate: 'Месячная оценка затрат',
			ready: 'Готово',
			description: 'Комиссии, FX и нормы',
		},
	},
	contractorFinalCta: {
		title: 'Платите каждому подрядчику через единый процесс с соблюдением требований',
		description:
			'Garna держит договоры, инвойсы, согласования и международные выплаты подрядчикам в одном месте, чтобы команда росла без локальных юрлиц и платежного хаоса',
		button: 'Забронировать демо',
	},
	faq: {
		title: 'Часто задаваемые вопросы о Contractor of Record',
		items: {
			q1: {
				question: 'Что такое Contractor of Record (COR)?',
				answer:
					'Contractor of Record помогает компаниям работать с независимыми подрядчиками без открытия местного юридического лица. Сервис охватывает договоры, онбординг, выставление счетов, выплаты и документацию, при этом подрядчик сохраняет статус независимого специалиста.',
			},
			q2: {
				question: 'Кому подходит COR?',
				answer:
					'COR подходит компаниям, которые работают с независимыми подрядчиками в нескольких странах, включая стартапы, SaaS-компании, агентства цифрового маркетинга, креативные агентства и маркетплейсы. Управлять международными подрядчиками становится проще без открытия местного юридического лица на каждом рынке.',
			},
			q3: {
				question: 'Какие страны, валюты и способы выплат поддерживаются?',
				answer:
					'Garna поддерживает выплаты подрядчикам в 150+ странах и 80+ валютах. В зависимости от страны и способа выплаты доступны SWIFT, SEPA, местные банковские переводы, PayPal, Payoneer, USDT и USDC.',
			},
			q4: {
				question: 'Как пополнить баланс?',
				answer:
					'Вы можете пополнить баланс Garna с помощью доступных в вашем аккаунте способов оплаты и использовать его для выплат подрядчикам. Варианты пополнения зависят от аккаунта и выбранного способа оплаты.',
			},
			q5: {
				question: 'Можно ли платить нескольким подрядчикам одновременно?',
				answer:
					'Да. Garna поддерживает массовые выплаты, поэтому вы можете платить нескольким подрядчикам в рамках одного процесса вместо обработки каждого международного перевода отдельно.',
			},
			q6: {
				question: 'Почему стоит выбрать Garna среди других COR-провайдеров?',
				answer:
					'Garna объединяет управление подрядчиками и глобальные выплаты на одной платформе. Вы можете управлять договорами, счетами и выплатами в 150+ странах и 80+ валютах, использовать разные способы оплаты и получать поддержку 24/7.',
			},
		},
	},
	whyGarna: {
		...homeRu.whyGarna,
		title: 'Создано, чтобы упростить работу с подрядчиками',
		description: 'Преимущества, которые делают выплаты простыми, безопасными и глобальными',
		cards: {
			...homeRu.whyGarna.cards,
			management: {
				title: 'Упростите управление подрядчиками',
				description: 'Ведите договоры, онбординг, инвойсы и документы в одной платформе',
			},
			payments: {
				title: 'Платите глобально и удобным способом',
				description: 'Платите в USD и 80+ валютах через банк, карты, e-wallets или крипто',
			},
			risk: {
				title: 'Избегайте ошибочной классификации',
				description:
					'Как Contractor and Agent of Record, мы берем юридическую ответственность и снижаем риски для бизнеса',
			},
		},
	},
	contractorBenefits: {
		...homeRu.contractorBenefits,
		title: 'Всё необходимое для управления подрядчиками',
		description: 'С Garna вы можете управлять взаимодействием с подрядчиками и глобальными выплатами на одной платформе',
		methods: {
			...homeRu.contractorBenefits.methods,
			title: 'Один договор вместо\u00a0десятков',
			description: 'Управляйте всем через один договор и единый консолидированный инвойс',
		},
		mobile: {
			...homeRu.contractorBenefits.mobile,
			title: 'Снижение административных расходов',
			description: 'Garna берет на себя договоры, инвойсы и документы',
		},
		earlyPayout: {
			...homeRu.contractorBenefits.earlyPayout,
			title: 'Прямая передача интеллектуальной собственности',
			description: 'Права на IP переходят напрямую к вам',
		},
		visual: {
			contractsFolder: 'Договоры',
			folderTag: 'Все в одном',
			clientAgreement: 'Клиентский договор',
			signed: 'Подписано',
			client: 'Клиент',
			provider: 'Провайдер',
			effective: 'Действует с',
			effectiveDate: 'фев. 2026',
			design: 'Design',
			engineering: 'Engineering',
			monthlyInvoice: 'Месячный инвойс',
			timeSaved: 'Сэкономлено',
			timeSavedValue: '8.5ч',
			onAdminTasks: 'на административных задачах',
			invoices: 'Инвойсы',
			docs: 'Документы',
			agreements: 'Договоры',
			ipAssignment: 'Передача IP',
			filed: 'Подано',
			rightsTransfer: 'Передача прав',
			contractor: 'Подрядчик',
			recipient: 'Получатель',
			works: 'Работы',
			designFiles: 'Дизайн-файлы',
		},
	},
	howTo: {
		title: 'Как работает Contractor of Record от Garna',
		description:
			'От согласования инвойса до финальной выплаты — управляйте всем процессом выплат подрядчикам в одном месте.',
		steps: {
			step1: {
				title: 'Настройте аккаунт',
				description: 'Создайте профиль компании и подтвердите данные для доступа к платформе',
			},
			step2: {
				title: 'Пригласите команду',
				description: 'Добавьте подрядчиков и назначьте роли, доступы и условия договора',
			},
			step3: {
				title: 'Пополните баланс',
				description: 'Пополните корпоративный кошелек через банк, SWIFT, SEPA или крипто',
			},
			step4: {
				title: 'Отправляйте выплаты',
				description: 'Запускайте выплаты в один клик с учетом налогов и требований',
			},
		},
		panel: {
			signup: {
				title: 'Регистрация в Garna',
				companyNameLabel: 'Название компании',
				registrationNumberLabel: 'Регистрационный номер',
				countryLabel: 'Страна регистрации',
				businessEmailLabel: 'Рабочий email',
				registrationDateLabel: 'Дата регистрации',
				continueButton: 'Продолжить',
			},
			invite: {
				title: 'Пригласить подрядчиков',
				roleLabel: 'Роль',
				roleValue: 'Design contractor',
				emailLabel: 'Email',
				agreementLabel: 'Договор',
				agreementValue: 'Условия клиента',
				accessLabel: 'Доступ',
				accessValue: 'Кабинет подрядчика',
				sendInvitesButton: 'Отправить приглашения',
			},
			fund: {
				title: 'Баланс',
				paymentAccount: 'Платежный счет USD',
				accountNumber: 'Номер счета',
				actions: {
					send: 'Перевести',
					withdraw: 'Вывести',
					topUp: 'Пополнить',
				},
				templates: 'Шаблоны',
				all: 'Все',
				n26Card: 'Карта N26',
				designerPayout: 'Designer payout',
				lewisAccount: 'Счет M. Lewis',
			},
			send: {
				title: 'Массовый перевод',
				description: 'Загрузите CSV и отправьте выплаты',
				uploadedFile: 'Загруженный файл',
				fileName: 'Salary_to_all_contractors.csv',
				transactions: 'Транзакции',
				totalAmount: 'Общая сумма',
				sendTransfers: 'Отправить',
			},
		},
	},
};

export const contractorOfRecordTranslations = {
	en: {
		...homeEn,
		...enOverrides,
	},
	es: {
		...homeEs,
		...esOverrides,
	},
	pt: {
		...homePt,
		...ptOverrides,
	},
	ru: {
		...homeRu,
		...ruOverrides,
	},
};
