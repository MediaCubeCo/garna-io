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
		title: 'Contractor Agreements, Invoices, and IP Rights in One Flow',
		description: 'Bring contractor paperwork, consolidated billing, and rights transfer into one managed platform',
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
			perCycle: 'per cycle',
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
		title: 'How to get started',
		description: 'Start using Garna in a few simple steps',
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
				fileName: 'New transactions.csv',
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
		title: 'Acuerdos, facturas y derechos de IP en un solo flujo',
		description: 'Reúne documentos, facturas y cesión de derechos en una plataforma gestionada',
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
			perCycle: 'por ciclo',
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
		title: 'Cómo empezar',
		description: 'Empieza a usar Garna en unos pocos pasos',
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
				fileName: 'Nuevas transacciones.csv',
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
		title: 'Contratos, faturas e direitos de IP em um só fluxo',
		description: 'Reúna documentos, faturas e cessão de direitos em uma plataforma gerida',
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
			perCycle: 'por ciclo',
			invoices: 'Faturas',
			docs: 'Docs',
			agreements: 'Contratos',
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
		title: 'Como começar',
		description: 'Comece a usar a Garna em poucos passos',
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
				fileName: 'Novas transações.csv',
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
		title: 'Договоры, инвойсы и права на IP в одном процессе',
		description: 'Соберите документы, счета и передачу прав подрядчиков в одной платформе',
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
			perCycle: 'за цикл',
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
		title: 'Как начать',
		description: 'Начните пользоваться Garna за несколько простых шагов',
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
				fileName: 'Новые транзакции.csv',
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
