import { eorTranslations } from '../eor';

const meta = {
	en: {
		title: 'Business Account | Garna',
		description:
			'Open a Garna business account to manage balances, transfers, global team payouts, and everyday financial operations from one platform.',
	},
	es: {
		title: 'Business Account | Garna',
		description:
			'Abre una cuenta de empresa de Garna para gestionar saldos, transferencias, pagos globales a equipos y operaciones financieras diarias desde una plataforma.',
	},
	pt: {
		title: 'Business Account | Garna',
		description:
			'Abra uma conta empresarial Garna para gerir saldos, transferencias, pagamentos globais a equipes e operacoes financeiras diarias em uma unica plataforma.',
	},
	ru: {
		title: 'Business Account | Garna',
		description:
			'Откройте платежный счет Garna, чтобы управлять балансами, переводами, выплатами глобальной команде и ежедневными финансовыми операциями на одной платформе.',
	},
};

const finalCta = {
	en: {
		title: 'Take Your Business Payments Global',
		description: 'Open one account for international transfers, multi-currency balances, and team payouts',
		button: 'Open an account',
	},
	es: {
		title: 'Lleva los pagos de tu empresa al mundo',
		description: 'Abre una cuenta para transferencias internacionales, saldos multidivisa y pagos a tu equipo',
		button: 'Abrir una cuenta',
	},
	pt: {
		title: 'Leve os pagamentos da sua empresa para o mundo',
		description: 'Abra uma conta para transferências internacionais, saldos em várias moedas e pagamentos à sua equipe',
		button: 'Abrir uma conta',
	},
	ru: {
		title: 'Выведите платежи вашего бизнеса на глобальный уровень',
		description: 'Откройте один счет для международных переводов, мультивалютных балансов и выплат команде',
		button: 'Открыть счет',
	},
};

const hero = {
	en: {
		title: 'Business Account\nfor Going Global',
		description: 'Fund your account, get paid, pay your team, and hold multiple currencies. Save time, money, and hassle with the all-in-one Garna business account',
		ctaPrimary: 'Open an account',
		ctaSecondary: 'Book a demo',
	},
	es: {
		title: 'Cuenta empresarial\npara crecer globalmente',
		description: 'Añade fondos, recibe pagos, paga a tu equipo y mantén varias divisas. Ahorra tiempo, dinero y trabajo con la cuenta empresarial integral de Garna',
		ctaPrimary: 'Abrir una cuenta',
		ctaSecondary: 'Reservar una demo',
	},
	pt: {
		title: 'Conta empresarial\npara crescer globalmente',
		description: 'Adicione fundos, receba pagamentos, pague sua equipe e mantenha várias moedas. Economize tempo, dinheiro e trabalho com a conta empresarial completa da Garna',
		ctaPrimary: 'Abrir uma conta',
		ctaSecondary: 'Agendar uma demo',
	},
	ru: {
		title: 'Платежный счет\nдля выхода на глобальный рынок',
		description: 'Пополняйте счет, получайте платежи, платите команде и храните разные валюты. Экономьте время и деньги с универсальным платежным счетом Garna',
		ctaPrimary: 'Открыть счет',
		ctaSecondary: 'Записаться на демо',
	},
};

const stats = {
	en: {
		localCurrencies: 'local currencies',
		usdCoverage: 'countries covered with USD',
		batchContactsValue: 'Up to 1,000',
		batchContactsLabel: 'contacts in one batch payment',
	},
	es: {
		localCurrencies: 'divisas locales',
		usdCoverage: 'países cubiertos con USD',
		batchContactsValue: 'Hasta 1.000',
		batchContactsLabel: 'contactos en un pago por lotes',
	},
	pt: {
		localCurrencies: 'moedas locais',
		usdCoverage: 'países cobertos com USD',
		batchContactsValue: 'Até 1.000',
		batchContactsLabel: 'contatos em um pagamento em lote',
	},
	ru: {
		localCurrencies: 'локальных валют',
		usdCoverage: 'стран с выплатами в USD',
		batchContactsValue: 'До 1 000',
		batchContactsLabel: 'получателей в одном массовом платеже',
	},
};

const financialAdminCarousel = {
	en: {
		features: {
			iban: { title: "An IBAN in your company's name", description: 'Keep business payments clearly tied to your company with account details in its own name' },
			fees: { title: 'Know every fee before you send', description: 'Review the exchange rate, transfer fee, and final amount before you approve a payment' },
			balances: { title: 'Every balance in one place', description: 'Hold and manage multiple currencies from one account without switching between platforms' },
			payments: { title: 'Move money across borders faster', description: 'Send international payments with delivery times that match the method and destination' },
		},
		notifications: {
			iban: { time: 'Just now', title: 'Business account active', description: 'IBAN issued in your company name' },
			fees: { summary: 'Payment summary', sendLabel: 'You send', feeLabel: 'Transfer fee', recipientLabel: 'Recipient gets' },
			balances: { title: 'Balances', updated: 'Updated now', footerLabel: 'Available balance', footerAction: 'View all' },
			payments: { transferLabel: 'International transfer', status: 'Delivered', recipientMeta: 'United Kingdom' },
		},
	},
	es: {
		features: {
			iban: { title: 'Un IBAN a nombre de tu empresa', description: 'Mantén los pagos vinculados a tu empresa con datos bancarios emitidos a su nombre' },
			fees: { title: 'Conoce cada comisión antes de enviar', description: 'Revisa el tipo de cambio, la comisión y el importe final antes de aprobar un pago' },
			balances: { title: 'Todos tus saldos en un solo lugar', description: 'Mantén y gestiona varias divisas desde una cuenta sin cambiar de plataforma' },
			payments: { title: 'Mueve dinero entre países más rápido', description: 'Envía pagos internacionales con plazos adaptados al método y al destino' },
		},
		notifications: {
			iban: { time: 'Ahora', title: 'Cuenta empresarial activa', description: 'IBAN emitido a nombre de tu empresa' },
			fees: { summary: 'Resumen del pago', sendLabel: 'Tú envías', feeLabel: 'Comisión', recipientLabel: 'El destinatario recibe' },
			balances: { title: 'Saldos', updated: 'Actualizado ahora', footerLabel: 'Saldo disponible', footerAction: 'Ver todo' },
			payments: { transferLabel: 'Pago internacional', status: 'Entregada', recipientMeta: 'Reino Unido' },
		},
	},
	pt: {
		features: {
			iban: { title: 'Um IBAN em nome da sua empresa', description: 'Mantenha os pagamentos ligados à sua empresa com dados bancários em nome dela' },
			fees: { title: 'Saiba todas as tarifas antes de enviar', description: 'Revise a taxa de câmbio, a tarifa e o valor final antes de aprovar um pagamento' },
			balances: { title: 'Todos os saldos em um só lugar', description: 'Mantenha e gerencie várias moedas em uma conta sem alternar entre plataformas' },
			payments: { title: 'Movimente dinheiro entre países mais rápido', description: 'Envie pagamentos internacionais com prazos adequados ao método e ao destino' },
		},
		notifications: {
			iban: { time: 'Agora', title: 'Conta empresarial ativa', description: 'IBAN emitido em nome da sua empresa' },
			fees: { summary: 'Resumo do pagamento', sendLabel: 'Você envia', feeLabel: 'Tarifa', recipientLabel: 'Destinatário recebe' },
			balances: { title: 'Saldos', updated: 'Atualizado agora', footerLabel: 'Saldo disponível', footerAction: 'Ver tudo' },
			payments: { transferLabel: 'Pagamento global', status: 'Entregue', recipientMeta: 'Reino Unido' },
		},
	},
	ru: {
		features: {
			iban: { title: 'IBAN на имя вашей компании', description: 'Платежи напрямую связаны с вашей компанией благодаря банковским реквизитам на ее имя' },
			fees: { title: 'Все комиссии известны заранее', description: 'Проверьте курс, комиссию и итоговую сумму перед подтверждением платежа' },
			balances: { title: 'Все балансы в одном месте', description: 'Храните и управляйте несколькими валютами на одном счете, не переключаясь между платформами' },
			payments: { title: 'Быстрые международные переводы', description: 'Отправляйте деньги за границу со сроками доставки, зависящими от способа и направления перевода' },
		},
		notifications: {
			iban: { time: 'Только что', title: 'Платежный счет активен', description: 'IBAN оформлен на имя компании' },
			fees: { summary: 'Сводка платежа', sendLabel: 'Вы платите', feeLabel: 'Комиссия', recipientLabel: 'Получатель получит' },
			balances: { title: 'Балансы', updated: 'Обновлено сейчас', footerLabel: 'Доступный баланс', footerAction: 'Показать все' },
			payments: { transferLabel: 'Перевод за рубеж', status: 'Доставлен', recipientMeta: 'Великобритания' },
		},
	},
};

const globalWorkforce = {
	en: {
		title: 'Pay in currencies and methods you need',
		description: 'Send money the way your business and recipients prefer, not just by bank transfer',
		benefits: {
			bankTransfers: { title: 'Bank transfers', description: 'Send local and international bank transfers in supported currencies' },
			bankCards: { title: 'Bank cards', description: 'Pay directly to supported bank cards for fast, convenient payouts' },
			paypal: { title: 'PayPal', description: 'Send funds to PayPal accounts wherever this payment method is available' },
			crypto: { title: 'Crypto', description: 'Make fast, flexible cross-border payments in supported cryptocurrencies' },
		},
	},
	es: {
		title: 'Paga en las divisas y con los métodos que necesitas',
		description: 'Envía dinero como prefieran tu empresa y los destinatarios, no solo mediante transferencia bancaria',
		benefits: {
			bankTransfers: { title: 'Transferencias bancarias', description: 'Envía transferencias locales e internacionales en divisas compatibles' },
			bankCards: { title: 'Tarjetas bancarias', description: 'Paga directamente a tarjetas compatibles de forma rápida y cómoda' },
			paypal: { title: 'PayPal', description: 'Envía fondos a cuentas PayPal donde este método esté disponible' },
			crypto: { title: 'Criptomonedas', description: 'Realiza pagos internacionales rápidos con criptomonedas compatibles' },
		},
	},
	pt: {
		title: 'Pague nas moedas e pelos métodos que você precisa',
		description: 'Envie dinheiro da forma que sua empresa e os destinatários preferirem, não apenas por transferência bancária',
		benefits: {
			bankTransfers: { title: 'Transferências bancárias', description: 'Envie transferências locais e internacionais em moedas compatíveis' },
			bankCards: { title: 'Cartões bancários', description: 'Pague diretamente para cartões compatíveis com rapidez e conveniência' },
			paypal: { title: 'PayPal', description: 'Envie fundos para contas PayPal onde este método estiver disponível' },
			crypto: { title: 'Criptomoedas', description: 'Faça pagamentos internacionais rápidos com criptomoedas compatíveis' },
		},
	},
	ru: {
		title: 'Платите в нужных валютах удобными способами',
		description: 'Отправляйте деньги удобным для вашей компании и получателей способом, а не только банковским переводом',
		benefits: {
			bankTransfers: { title: 'Банковские переводы', description: 'Отправляйте локальные и международные переводы в поддерживаемых валютах' },
			bankCards: { title: 'Банковские карты', description: 'Быстро и удобно переводите деньги на поддерживаемые карты' },
			paypal: { title: 'PayPal', description: 'Отправляйте средства на счета PayPal там, где этот способ доступен' },
			crypto: { title: 'Криптовалюты', description: 'Совершайте быстрые международные платежи в поддерживаемых криптовалютах' },
		},
	},
};

const costEstimator = {
	en: {
		title: 'Send Your Money Worldwide',
		description: 'Make international payments in 60+ local currencies, including USD, EUR, and more',
		cta: 'Open an account',
	},
	es: {
		title: 'Envía tu dinero a todo el mundo',
		description: 'Realiza pagos internacionales en más de 60 divisas locales, incluidos USD, EUR y muchas más',
		cta: 'Abrir una cuenta',
	},
	pt: {
		title: 'Envie seu dinheiro para o mundo todo',
		description: 'Faça pagamentos internacionais em mais de 60 moedas locais, incluindo USD, EUR e muitas outras',
		cta: 'Abrir uma conta',
	},
	ru: {
		title: 'Отправляйте деньги по всему миру',
		description: 'Совершайте международные платежи более чем в 60 локальных валютах, включая USD, EUR и другие',
		cta: 'Открыть счет',
	},
};

const apiPayments = {
	en: {
		eyebrow: 'API infrastructure',
		title: 'Connect Global Payments to Your Platform',
		description: 'Integrate Garna Business Account into your own platform and manage payments seamlessly under the hood',
		button: 'Learn more',
		carouselLabel: 'Choose an API payments card',
		cards: {
			integration: { label: 'API payment', status: '201 Created', title: 'Status', completed: 'Payment created', meta: 'Payment ID', detail: 'Created via API and confirmed automatically', time: 'Processed' },
			automation: { title: 'Payment automated', meta: 'Approval workflow' },
			global: { title: 'Transfer completed', meta: 'Cross-border payout' },
		},
	},
	es: {
		eyebrow: 'Infraestructura API',
		title: 'Conecta pagos globales a tu plataforma',
		description: 'Integra la cuenta empresarial de Garna en tu propia plataforma y gestiona los pagos de forma fluida en segundo plano',
		button: 'Más información',
		carouselLabel: 'Elige una tarjeta de pagos por API',
		cards: {
			integration: { label: 'Pago por API', status: '201 Creado', title: 'Estado', completed: 'Pago creado', meta: 'ID de pago', detail: 'Creado por API y confirmado', time: 'Procesado' },
			automation: { title: 'Pago automatizado', meta: 'Flujo de aprobación' },
			global: { title: 'Transferencia completada', meta: 'Pago internacional' },
		},
	},
	pt: {
		eyebrow: 'Infraestrutura de API',
		title: 'Conecte pagamentos globais à sua plataforma',
		description: 'Integre a conta empresarial Garna à sua própria plataforma e gerencie pagamentos de forma integrada nos bastidores',
		button: 'Saiba mais',
		carouselLabel: 'Escolha um cartão de pagamentos via API',
		cards: {
			integration: { label: 'Pagamento via API', status: '201 Criado', title: 'Status', completed: 'Pagamento criado', meta: 'ID do pagamento', detail: 'Criado via API e confirmado', time: 'Processado' },
			automation: { title: 'Pagamento automatizado', meta: 'Fluxo de aprovação' },
			global: { title: 'Transferência concluída', meta: 'Pagamento internacional' },
		},
	},
	ru: {
		eyebrow: 'API-инфраструктура',
		title: 'Подключите глобальные платежи к своей платформе',
		description: 'Интегрируйте платежный счет Garna в собственную платформу и незаметно управляйте платежами на внутреннем уровне',
		button: 'Подробнее',
		carouselLabel: 'Выберите карточку API-платежей',
		cards: {
			integration: { label: 'API-платеж', status: '201 Создано', title: 'Статус', completed: 'Платеж создан', meta: 'ID платежа', detail: 'Создан и подтвержден через API', time: 'Обработан' },
			automation: { title: 'Платеж автоматизирован', meta: 'Процесс согласования' },
			global: { title: 'Перевод выполнен', meta: 'Международная выплата' },
		},
	},
};

const security = {
	en: {
		kicker: 'Security and support',
		title: 'Built to Keep Your Funds Safe',
		description: 'Garna is designed to keep your business funds and payments protected with security controls built into every part of the platform',
		button: 'Book a demo',
		features: {
			safeguarded: { title: 'Safeguarded funds', description: 'All funds are deposited with reputable banking institutions.', tags: ['Protected funds', 'Trusted banks', 'Secure holding'] },
			aml: { title: 'AML screening', description: 'We check recipients and transactions as part of our ongoing AML compliance program.', tags: ['Recipient checks', 'Transaction checks', 'Ongoing monitoring'] },
			manager: { title: 'Dedicated account manager', description: 'Get hands-on support from your specialized account manager.', tags: ['Personal support', 'Dedicated contact', 'Expert guidance'] },
		},
	},
	es: {
		kicker: 'Seguridad y soporte',
		title: 'Creado para proteger tus fondos',
		description: 'Garna está diseñado para proteger los fondos y pagos de tu empresa con controles de seguridad integrados en toda la plataforma',
		button: 'Reservar una demo',
		features: {
			safeguarded: { title: 'Fondos protegidos', description: 'Todos los fondos se depositan en instituciones bancarias de confianza.', tags: ['Fondos protegidos', 'Bancos de confianza', 'Custodia segura'] },
			aml: { title: 'Control AML', description: 'Verificamos destinatarios y transacciones como parte de nuestro programa continuo de cumplimiento AML.', tags: ['Destinatarios', 'Transacciones', 'Supervisión continua'] },
			manager: { title: 'Gestor de cuenta dedicado', description: 'Recibe asistencia personalizada de tu gestor de cuenta especializado.', tags: ['Soporte personal', 'Contacto dedicado', 'Asesoramiento experto'] },
		},
	},
	pt: {
		kicker: 'Segurança e suporte',
		title: 'Criado para manter seus fundos seguros',
		description: 'A Garna foi projetada para proteger os fundos e pagamentos da sua empresa com controles de segurança integrados em toda a plataforma',
		button: 'Agendar uma demo',
		features: {
			safeguarded: { title: 'Fundos protegidos', description: 'Todos os fundos são depositados em instituições bancárias confiáveis.', tags: ['Fundos protegidos', 'Bancos confiáveis', 'Custódia segura'] },
			aml: { title: 'Verificação AML', description: 'Verificamos destinatários e transações como parte do nosso programa contínuo de conformidade AML.', tags: ['Destinatários', 'Transações', 'Monitoramento AML'] },
			manager: { title: 'Gerente de conta dedicado', description: 'Receba suporte personalizado do seu gerente de conta especializado.', tags: ['Suporte pessoal', 'Contato dedicado', 'Orientação especializada'] },
		},
	},
	ru: {
		kicker: 'Безопасность и поддержка',
		title: 'Ваши средства под надежной защитой',
		description: 'Garna защищает средства и платежи вашего бизнеса с помощью механизмов безопасности, встроенных во все уровни платформы',
		button: 'Записаться на демо',
		features: {
			safeguarded: { title: 'Защита средств', description: 'Все средства размещаются в надежных банковских учреждениях.', tags: ['Защита средств', 'Надежные банки', 'Хранение средств'] },
			aml: { title: 'AML-проверки', description: 'Мы проверяем получателей и транзакции в рамках постоянной программы AML-комплаенса.', tags: ['Получатели', 'Транзакции', 'AML-мониторинг'] },
			manager: { title: 'Персональный аккаунт-менеджер', description: 'Получайте индивидуальную поддержку от профильного аккаунт-менеджера.', tags: ['Поддержка', 'Личный контакт', 'Экспертная помощь'] },
		},
	},
};

const moreThanAccount = {
	en: {
		title: 'More than a Business Account',
		description: 'One platform to run payroll for freelancers, remote employees, and full-time teams',
		products: {
			eor: { title: 'Employer of Record', description: 'Scale your team faster with EOR solution', link: 'Explore EOR', fileLabel: 'Personnel file', role: 'Product Designer', country: 'Germany', status: 'Hired', providerLabel: 'Employer of record' },
			perks: { title: 'Business Perks & Discounts', description: 'Get discounts for 100+ services that eat your budget', offerLabel: 'Partner service', benefitLabel: 'Discount', discount: '20% off', benefitMeta: 'Annual team plan', serviceCount: '100+ services', subscription: 'Business subscription', available: 'Available with Garna' },
			cor: { title: 'Contractor of Record', description: 'Onboard, contract and pay your contractors globally', link: 'Explore COR', agreementLabel: 'Contractor agreement', status: 'Signed', client: 'Client', contractor: 'Contractor', scope: 'Scope of services', term: 'Term', termValue: '12 months', signature: 'E-signature', fileLabel: 'Contractor file', agreementTab: 'Agreement', invoiceTab: 'Invoice', payoutTab: 'Payout', contents: 'Payables · Agreements · Invoices', managedBy: 'Managed by' },
		},
	},
	es: {
		title: 'Más que una cuenta empresarial',
		description: 'Una plataforma para gestionar pagos a freelancers, empleados remotos y equipos a tiempo completo',
		products: {
			eor: { title: 'Employer of Record', description: 'Amplía tu equipo más rápido con la solución EOR', link: 'Conocer EOR', fileLabel: 'Ficha laboral', role: 'Product Designer', country: 'Alemania', status: 'Contratada', providerLabel: 'Empleador legal' },
			perks: { title: 'Ventajas y descuentos para empresas', description: 'Obtén descuentos en más de 100 servicios que consumen tu presupuesto', offerLabel: 'Servicio asociado', benefitLabel: 'Descuento', discount: '20% de descuento', benefitMeta: 'Plan anual para equipos', serviceCount: '100+ servicios', subscription: 'Suscripción empresarial', available: 'Disponible con Garna' },
			cor: { title: 'Contractor of Record', description: 'Incorpora, contrata y paga a tus contratistas en todo el mundo', link: 'Conocer COR', agreementLabel: 'Contrato de contratista', status: 'Firmado', client: 'Cliente', contractor: 'Contratista', scope: 'Alcance de servicios', term: 'Plazo', termValue: '12 meses', signature: 'Firma electrónica', fileLabel: 'Expediente del contratista', agreementTab: 'Acuerdo', invoiceTab: 'Factura', payoutTab: 'Pago', contents: 'Pagos · Acuerdos · Facturas', managedBy: 'Gestionado por' },
		},
	},
	pt: {
		title: 'Mais do que uma conta empresarial',
		description: 'Uma plataforma para gerenciar pagamentos de freelancers, funcionários remotos e equipes em tempo integral',
		products: {
			eor: { title: 'Employer of Record', description: 'Expanda sua equipe mais rapidamente com a solução EOR', link: 'Conhecer EOR', fileLabel: 'Ficha funcional', role: 'Product Designer', country: 'Alemanha', status: 'Contratada', providerLabel: 'Empregador legal' },
			perks: { title: 'Benefícios e descontos empresariais', description: 'Obtenha descontos em mais de 100 serviços que consomem seu orçamento', offerLabel: 'Serviço parceiro', benefitLabel: 'Desconto', discount: '20% de desconto', benefitMeta: 'Plano anual para equipes', serviceCount: '100+ serviços', subscription: 'Assinatura empresarial', available: 'Disponível com a Garna' },
			cor: { title: 'Contractor of Record', description: 'Integre, contrate e pague seus prestadores globalmente', link: 'Conhecer COR', agreementLabel: 'Contrato de prestador', status: 'Assinado', client: 'Cliente', contractor: 'Prestador', scope: 'Escopo dos serviços', term: 'Prazo', termValue: '12 meses', signature: 'Assinatura eletrônica', fileLabel: 'Pasta do prestador', agreementTab: 'Contrato', invoiceTab: 'Fatura', payoutTab: 'Pagamento', contents: 'Pagamentos · Contratos · Faturas', managedBy: 'Gerenciado por' },
		},
	},
	ru: {
		title: 'Больше, чем платежный счет',
		description: 'Одна платформа для выплат фрилансерам, удаленным сотрудникам и штатным командам',
		products: {
			eor: { title: 'Employer of Record', description: 'Быстрее расширяйте команду с решением EOR', link: 'Узнать об EOR', fileLabel: 'Личное дело', role: 'Product Designer', country: 'Германия', status: 'Нанята', providerLabel: 'Официальный работодатель' },
			perks: { title: 'Бизнес-привилегии и скидки', description: 'Получайте скидки на 100+ сервисов, которые занимают значительную часть бюджета', offerLabel: 'Партнерский сервис', benefitLabel: 'Скидка', discount: 'Скидка 20%', benefitMeta: 'Годовой план для команд', serviceCount: '100+ сервисов', subscription: 'Бизнес-подписка', available: 'Доступно с Garna' },
			cor: { title: 'Contractor of Record', description: 'Подключайте, оформляйте и оплачивайте подрядчиков по всему миру', link: 'Узнать о COR', agreementLabel: 'Договор с подрядчиком', status: 'Подписан', client: 'Заказчик', contractor: 'Подрядчик', scope: 'Предмет договора', term: 'Срок', termValue: '12 месяцев', signature: 'Электронная подпись', fileLabel: 'Досье подрядчика', agreementTab: 'Договор', invoiceTab: 'Счет', payoutTab: 'Выплата', contents: 'Выплаты · Договоры · Счета', managedBy: 'Ведет' },
		},
	},
};

const faq = {
	en: {
		title: 'FAQ on Business Account',
		items: {
			q1: {
				question: 'Who can open a Garna business account?',
				answer: 'Garna works with businesses across a wide range of industries and jurisdictions. Every applicant goes through our onboarding and compliance review.',
			},
			q2: {
				question: 'What documents do I need to open a Garna business account?',
				answer: "To open a business account with Garna, you'll need to complete a short KYB (Know Your Business) application and submit a set of supporting documents. The exact requirements depend on your company's structure and jurisdiction, and our team reviews each application individually — we'll let you know exactly what's needed to get you fully verified and ready to go.",
			},
			q3: {
				question: 'How do you keep funds secure?',
				answer: 'Garna uses bank-level encryption and follows GDPR requirements and industry-standard data security practices to help protect your funds and data.',
			},
			q4: {
				question: 'Can I receive payments in multiple currencies?',
				answer: 'We support more than 80 national currencies, including USD, EUR, and a wide range of local options.',
			},
			q5: {
				question: 'Can I send international payments from my Garna account?',
				answer: 'We support bank transfers (SWIFT, SEPA, and local-currency bank transfers), card payments in local currency, PayPal, and crypto payments (USDT/USDC).',
			},
			q6: {
				question: 'Can I pay employees and contractors through Garna?',
				answer: 'Yes. Through Garna, you can pay employees, contractors, and freelancers using the payment method that works best for them.',
			},
			q7: {
				question: 'What is the average payment processing time?',
				answer: 'Processing typically ranges from instant to three business days, depending on the payment method. Most crypto payments are instant, e-wallet payments take up to one day, and bank transfers take up to three business days.',
			},
			q8: {
				question: 'Can I access my money at any time?',
				answer: 'Yes. Your balance is available whenever you need it for payroll, payments, or transfers.',
			},
		},
	},
	es: {
		title: 'Preguntas frecuentes sobre la cuenta empresarial',
		items: {
			q1: { question: '¿Quién puede abrir una cuenta empresarial de Garna?', answer: 'Garna trabaja con empresas de una amplia variedad de sectores y jurisdicciones. Cada solicitante pasa por nuestro proceso de incorporación y revisión de cumplimiento.' },
			q2: { question: '¿Qué documentos necesito para abrir una cuenta empresarial de Garna?', answer: 'Para abrir una cuenta empresarial con Garna, tendrás que completar una breve solicitud KYB (Know Your Business) y presentar los documentos de respaldo. Los requisitos exactos dependen de la estructura y jurisdicción de tu empresa, y nuestro equipo revisa cada solicitud de forma individual.' },
			q3: { question: '¿Cómo protegen los fondos?', answer: 'Garna utiliza cifrado de nivel bancario y cumple los requisitos del RGPD y las prácticas estándar de seguridad de datos para proteger tus fondos y datos.' },
			q4: { question: '¿Puedo recibir pagos en varias divisas?', answer: 'Admitimos más de 80 divisas nacionales, incluidos USD, EUR y una amplia variedad de opciones locales.' },
			q5: { question: '¿Puedo enviar pagos internacionales desde mi cuenta Garna?', answer: 'Admitimos transferencias bancarias (SWIFT, SEPA y transferencias locales), pagos con tarjeta en moneda local, PayPal y pagos con criptomonedas (USDT/USDC).' },
			q6: { question: '¿Puedo pagar a empleados y contratistas a través de Garna?', answer: 'Sí. Con Garna puedes pagar a empleados, contratistas y freelancers mediante el método de pago que mejor les convenga.' },
			q7: { question: '¿Cuál es el tiempo medio de procesamiento de un pago?', answer: 'El procesamiento suele tardar desde unos instantes hasta tres días hábiles, según el método de pago. La mayoría de los pagos con criptomonedas son instantáneos, los monederos electrónicos tardan hasta un día y las transferencias bancarias hasta tres días hábiles.' },
			q8: { question: '¿Puedo acceder a mi dinero en cualquier momento?', answer: 'Sí. Tu saldo está disponible cuando lo necesites para nóminas, pagos o transferencias.' },
		},
	},
	pt: {
		title: 'Perguntas frequentes sobre a conta empresarial',
		items: {
			q1: { question: 'Quem pode abrir uma conta empresarial Garna?', answer: 'A Garna trabalha com empresas de diversos setores e jurisdições. Cada candidato passa pelo nosso processo de integração e análise de conformidade.' },
			q2: { question: 'Quais documentos são necessários para abrir uma conta empresarial Garna?', answer: 'Para abrir uma conta empresarial com a Garna, você deverá preencher uma breve solicitação KYB (Know Your Business) e enviar documentos comprobatórios. Os requisitos exatos dependem da estrutura e jurisdição da sua empresa, e nossa equipe analisa cada solicitação individualmente.' },
			q3: { question: 'Como vocês mantêm os fundos seguros?', answer: 'A Garna usa criptografia de nível bancário e segue os requisitos do GDPR e as práticas de segurança de dados padrão do setor para proteger seus fundos e dados.' },
			q4: { question: 'Posso receber pagamentos em várias moedas?', answer: 'Aceitamos mais de 80 moedas nacionais, incluindo USD, EUR e uma ampla variedade de opções locais.' },
			q5: { question: 'Posso enviar pagamentos internacionais da minha conta Garna?', answer: 'Aceitamos transferências bancárias (SWIFT, SEPA e transferências locais), pagamentos com cartão em moeda local, PayPal e pagamentos em criptomoedas (USDT/USDC).' },
			q6: { question: 'Posso pagar funcionários e prestadores pela Garna?', answer: 'Sim. Com a Garna, você pode pagar funcionários, prestadores e freelancers usando o método de pagamento mais adequado para eles.' },
			q7: { question: 'Qual é o tempo médio de processamento de um pagamento?', answer: 'O processamento normalmente varia de instantâneo a três dias úteis, dependendo do método de pagamento. A maioria dos pagamentos em criptomoedas é instantânea, carteiras digitais levam até um dia e transferências bancárias levam até três dias úteis.' },
			q8: { question: 'Posso acessar meu dinheiro a qualquer momento?', answer: 'Sim. Seu saldo fica disponível sempre que você precisar para folha de pagamento, pagamentos ou transferências.' },
		},
	},
	ru: {
		title: 'FAQ о платежном счете',
		items: {
			q1: { question: 'Кто может открыть платежный счет Garna?', answer: 'Garna работает с компаниями из разных отраслей и юрисдикций. Каждый заявитель проходит процедуру онбординга и комплаенс-проверку.' },
			q2: { question: 'Какие документы нужны для открытия платежного счета Garna?', answer: 'Чтобы открыть платежный счет Garna, необходимо заполнить короткую заявку KYB (Know Your Business) и предоставить подтверждающие документы. Точные требования зависят от структуры и юрисдикции компании, поэтому наша команда рассматривает каждую заявку индивидуально.' },
			q3: { question: 'Как вы обеспечиваете безопасность средств?', answer: 'Garna использует шифрование банковского уровня и соблюдает требования GDPR и отраслевые стандарты безопасности данных, чтобы защитить ваши средства и информацию.' },
			q4: { question: 'Могу ли я получать платежи в разных валютах?', answer: 'Мы поддерживаем более 80 национальных валют, включая USD, EUR и широкий выбор локальных валют.' },
			q5: { question: 'Могу ли я отправлять международные платежи со счета Garna?', answer: 'Мы поддерживаем банковские переводы SWIFT, SEPA и локальные переводы, платежи на карты в местной валюте, PayPal и криптовалютные платежи в USDT и USDC.' },
			q6: { question: 'Могу ли я платить сотрудникам и подрядчикам через Garna?', answer: 'Да. Через Garna можно платить сотрудникам, подрядчикам и фрилансерам наиболее удобным для них способом.' },
			q7: { question: 'Каково среднее время обработки платежа?', answer: 'Обработка обычно занимает от нескольких секунд до трех рабочих дней в зависимости от способа оплаты. Большинство криптовалютных платежей проходит мгновенно, электронные кошельки — до одного дня, а банковские переводы — до трех рабочих дней.' },
			q8: { question: 'Могу ли я получить доступ к деньгам в любое время?', answer: 'Да. Баланс доступен в любое время для расчета зарплаты, платежей и переводов.' },
		},
	},
};

export const businessAccountTranslations = {
	en: { ...eorTranslations.en, meta: meta.en, hero: { ...eorTranslations.en.hero, ...hero.en }, stats: { ...eorTranslations.en.stats, ...stats.en }, financialAdminCarousel: financialAdminCarousel.en, globalWorkforce: globalWorkforce.en, costEstimator: { ...eorTranslations.en.costEstimator, ...costEstimator.en }, apiPayments: apiPayments.en, security: security.en, moreThanAccount: moreThanAccount.en, faq: faq.en, finalCta: finalCta.en },
	es: { ...eorTranslations.es, meta: meta.es, hero: { ...eorTranslations.es.hero, ...hero.es }, stats: { ...eorTranslations.es.stats, ...stats.es }, financialAdminCarousel: financialAdminCarousel.es, globalWorkforce: globalWorkforce.es, costEstimator: { ...eorTranslations.es.costEstimator, ...costEstimator.es }, apiPayments: apiPayments.es, security: security.es, moreThanAccount: moreThanAccount.es, faq: faq.es, finalCta: finalCta.es },
	pt: { ...eorTranslations.pt, meta: meta.pt, hero: { ...eorTranslations.pt.hero, ...hero.pt }, stats: { ...eorTranslations.pt.stats, ...stats.pt }, financialAdminCarousel: financialAdminCarousel.pt, globalWorkforce: globalWorkforce.pt, costEstimator: { ...eorTranslations.pt.costEstimator, ...costEstimator.pt }, apiPayments: apiPayments.pt, security: security.pt, moreThanAccount: moreThanAccount.pt, faq: faq.pt, finalCta: finalCta.pt },
	ru: { ...eorTranslations.ru, meta: meta.ru, hero: { ...eorTranslations.ru.hero, ...hero.ru }, stats: { ...eorTranslations.ru.stats, ...stats.ru }, financialAdminCarousel: financialAdminCarousel.ru, globalWorkforce: globalWorkforce.ru, costEstimator: { ...eorTranslations.ru.costEstimator, ...costEstimator.ru }, apiPayments: apiPayments.ru, security: security.ru, moreThanAccount: moreThanAccount.ru, faq: faq.ru, finalCta: finalCta.ru },
};
