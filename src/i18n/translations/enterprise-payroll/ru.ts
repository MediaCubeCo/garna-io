import { homeRu } from '../home/ru';

export const enterprisePayrollRu = {
	...homeRu,
	common: {
		learnMore: 'Подробнее',
	},
	meta: {
		title: 'Международная payroll-система для крупных компаний | Garna',
		description:
			'Узнайте о возможностях партнерства с Garna — системой, которая предлагает эффективное решение для глобального payroll.',
	},
	hero: {
		...homeRu.hero,
		badge: 'Payroll для крупных компаний',
		title: 'Payroll-инфраструктура для масштабирования глобального бизнеса',
		description:
			'Централизованная система глобального payroll, созданная для управления операциями в разных странах, юридических лицах, с подрядчиками и сотрудниками без потери гибкости',
		cta: 'Попробовать Garna',
	},
	howTo: {
		...homeRu.howTo,
		title: 'Как работает payroll: 4 простых шага',
		description:
			'Для крупных компаний корректный payroll без ошибок — серьезная задача. Поэтому мы создали систему из нескольких простых шагов, чтобы сделать процесс понятнее и надежнее',
		steps: {
			step1: {
				title: 'Настройте команду и payroll-структуру',
				description:
					'Настройте компанию и банковский счет, назначьте роли payroll-команде, добавьте новых сотрудников и подрядчиков, а также настройте все нужные юридические лица и команды',
			},
			step2: {
				title: 'Автоматизируйте расчеты и соблюдение требований',
				description: 'Подключите дашборд через API и автоматизируйте payroll-задачи',
			},
			step3: {
				title: 'Запускайте payroll и глобальные выплаты',
				description:
					'Настройте финансирование и отправляйте выплаты сотрудникам и подрядчикам по всему миру через разные способы: локальные банковские переводы, SWIFT, SEPA, PayPal, Payoneer или крипто',
			},
			step4: {
				title: 'Отслеживайте, анализируйте и масштабируйтесь',
				description:
					'Управляйте payroll-операциями через простой дашборд, получайте отчетность и аналитику в реальном времени и отслеживайте расходы на команду в каждом регионе',
			},
		},
	},
	heroVisual: {
		entitySync: 'Синхронизация юрлиц',
		markets: '24 рынка',
		entitiesSynced: 'Юрлица синхронизированы',
		commandTitle: 'Центр управления payroll',
		commandMeta: '6 юрлиц · 38 стран',
		live: 'Активно',
		readyCycle: 'Payroll готов к запуску в этом цикле',
		countries: 'Страны',
		entities: 'Юрлица',
		workers: 'Сотрудники',
		approvalQueue: 'Очередь согласований',
		approvers: 'Согласующие',
		multiCountryPayroll: 'Payroll в нескольких странах',
		multiCountryMeta: 'Сотрудники · подрядчики · поставщики',
		ready: 'Готово',
		complianceChecks: 'Проверки требований',
		complianceMeta: 'Налоги · контракты · локальные правила',
		running: 'В процессе',
		regions: '14 регионов',
	},
	whyGarna: homeRu.whyGarna,
	enterpriseFinalCta: {
		title: 'Глобальный payroll становится проще с Garna',
		description:
			'Garna предоставляет глобальную payroll-инфраструктуру под разные задачи: выход на новые рынки, управление распределенными командами или замена устаревших разрозненных payroll-систем. Платформа гибко адаптируется к вашим потребностям',
		button: 'Попробовать сейчас',
	},
	faqHome: {
		...homeRu.faqHome,
		subtitle: 'Есть вопросы? У нас есть ответы',
	},
	enterprisePayrollFaq: {
		title: 'Вопросы о payroll для глобального бизнеса',
		items: {
			q1: {
				question: 'Как работает глобальный payroll?',
				answer:
					'Глобальный payroll позволяет бизнесу управлять выплатами сотрудникам и подрядчикам в разных странах через централизованную систему, которая закрывает все: от платежей до соблюдения налоговых требований и отчетности.',
			},
			q2: {
				question: 'Можно ли назначать разные уровни доступа разным участникам команды?',
				answer:
					'Да. Вы можете настроить ролевой доступ к данным, которые нужны сотрудникам, а также установить лимиты выплат для подрядчиков. Все операции сверх этих лимитов будут требовать дополнительных согласований.',
			},
			q3: {
				question: 'Как вы обеспечиваете соблюдение требований в разных странах?',
				answer:
					'Garna использует автоматизированные процессы соблюдения требований, которые учитывают локальные налоговые правила, payroll-регулирование и региональные требования к отчетности.',
			},
			q4: {
				question: 'Можно ли платить подрядчикам и сотрудникам в одной платформе?',
				answer:
					'Да. Garna работает как единая глобальная payroll-платформа для управления сотрудниками, подрядчиками, фрилансерами и распределенными командами из одной системы.',
			},
			q5: {
				question: 'Сколько времени занимает запуск в новой стране?',
				answer:
					'Сроки запуска зависят от страны и конфигурации, но Garna помогает компаниям выходить на международные рынки значительно быстрее, чем при самостоятельном создании локальной payroll-инфраструктуры.',
			},
			q6: {
				question: 'Поддерживаете ли вы мультивалютные выплаты?',
				answer:
					'Да. Garna позволяет делать глобальные payroll-выплаты в разных валютах с гибкими способами оплаты, включая SWIFT, SEPA, банковские переводы, PayPal, Payoneer и крипто.',
			},
			q7: {
				question: 'Может ли Garna интегрироваться с нашими текущими системами?',
				answer:
					'Да. Мы поддерживаем payroll API-интеграцию с HR-системами, бухгалтерскими платформами, ERP-инструментами и SaaS-продуктами.',
			},
			q8: {
				question: 'Может ли Garna заменить нескольких payroll-провайдеров?',
				answer:
					'Да, и честно говоря, так эффективнее. Многие крупные клиенты используют Garna, чтобы консолидировать payroll-провайдеров, централизовать payroll-операции и избавиться от сложностей работы с разрозненными региональными поставщиками.',
			},
			q9: {
				question: 'Подходит ли Garna для embedded payroll-сценариев?',
				answer:
					'Да. Мы поддерживаем embedded payroll-инфраструктуру, white-label payroll-решения и модели payroll-as-a-service для платформ, маркетплейсов и экосистем крупных компаний.',
			},
			q10: {
				question: 'Насколько безопасна платформа?',
				answer:
					'Garna использует уровень безопасности, ожидаемый от корпоративной payroll-платформы: шифрование корпоративного уровня, ролевой доступ и защиту payroll-данных, рассчитанную на масштабные глобальные операции.',
			},
		},
	},
	sourceText: {
		'Take Full Control Over Global Payroll Operations': 'Полный контроль над глобальными payroll-операциями',
		"Garna has a unique solution for enterprises with growing teams and entities and compliance requirements that have to be dealt with in different regions. We've built one solid payroll infrastructure platform that makes it possible for large businesses to manage their workforces on a global scale":
			'У Garna есть решение для крупных компаний с растущими командами, юридическими лицами и требованиями в разных регионах. Мы создали единую payroll-инфраструктуру, которая помогает крупному бизнесу управлять глобальной командой в разных странах',
		'Centralizing payroll across countries and entities': 'Централизация payroll по странам и юридическим лицам',
		'With Garna, you can deal with multiple countries, subsidiaries, and workforce setups from different places from one global payroll dashboard':
			'С Garna можно управлять разными странами, дочерними компаниями и форматами занятости из одного глобального payroll-дашборда',
		'Making payroll scalable and automated': 'Масштабируемый и автоматизированный payroll',
		"Garna's solution makes automated processing, approvals, invoices, contractor payments and other processes run smoother":
			'Решение Garna упрощает автоматическую обработку, согласования, инвойсы, выплаты подрядчикам и другие процессы',
		'Staying on top of global compliance': 'Контроль соблюдения глобальных требований',
		'Garna helps companies stay on top of ever-changing rules and regulations with automated tax rules handling, regulatory compliance, audit-ready records and keeping track of compliance across different countries':
			'Garna помогает компаниям работать с постоянно меняющимися правилами и требованиями: автоматизировать налоговые правила, соблюдать регуляторные требования, хранить готовые к аудиту данные и отслеживать требования в разных странах',
		'Having everything in one place': 'Все в одном месте',
		'Manage payroll operations, approvals, reporting, contractor payments, global workflows, and multi-currency payroll from one intuitive system':
			'Управляйте payroll-операциями, согласованиями, отчетностью, выплатами подрядчикам, глобальными процессами и мультивалютным payroll в одной понятной системе',
		'A Single Platform That Handles Many Processes — Greatly and Globally':
			'Одна платформа для множества процессов — глобально и эффективно',
		'A Single Platform That Handles Many Processes &mdash; Greatly and Globally':
			'Одна платформа для множества процессов — глобально и эффективно',
		'Garna helps enterprises keep their payroll in order across different countries and teams without overdoing. We’ve got one platform that lets you sort out payroll, compliance, reporting, and sending out paychecks all in one go':
			'Garna помогает крупным компаниям держать payroll под контролем в разных странах и командах без лишней сложности. Одна платформа закрывает payroll, соблюдение требований, отчетность и выплаты в едином процессе',
		"Garna helps enterprises keep their payroll in order across different countries and teams without overdoing. We've got one platform that lets you sort out payroll, compliance, reporting, and sending out paychecks all in one go":
			'Garna помогает крупным компаниям держать payroll под контролем в разных странах и командах без лишней сложности. Одна платформа закрывает payroll, соблюдение требований, отчетность и выплаты в едином процессе',
		'Payroll & Compliance': 'Payroll и соблюдение требований',
		'Payroll &amp; Compliance': 'Payroll и соблюдение требований',
		'Payments Infrastructure': 'Платежная инфраструктура',
		'Permissions': 'Права доступа',
		'Approval Controls': 'Контроль согласований',
		'Visibility': 'Прозрачность',
		'24/7 Support': 'Поддержка 24/7',
		'Compliance run': 'Проверка требований',
		'Taxes, reports, and audit trail synced': 'Налоги, отчеты и аудит синхронизированы',
		'Payout routes': 'Маршруты выплат',
		'SWIFT, SEPA, cards, and crypto ready': 'SWIFT, SEPA, карты и крипто готовы',
		'Identity connected': 'Идентификация подключена',
		'SSO enabled for admins and teams': 'SSO включен для админов и команд',
		'Finance admin': 'Финансовый админ',
		'Full payroll access': 'Полный доступ к payroll',
		'EU contractor run': 'Выплаты подрядчикам в ЕС',
		'$42,000 needs regional approval': '$42,000 требует регионального согласования',
		'Global payroll report': 'Глобальный payroll-отчет',
		'38 countries, 6 entities, 12 exceptions': '38 стран, 6 юрлиц, 12 исключений',
		'Support desk': 'Служба поддержки',
		'Payroll and compliance teams online': 'Payroll-команда и специалисты по требованиям онлайн',
		'Enterprise payroll workflow': 'Payroll-процесс',
		'Global payroll operations board': 'Дашборд payroll-операций',
		'4 steps active': '4 шага',
		'Structure': 'Структура',
		'Entities and roles': 'Юрлица и роли',
		'Automate': 'Автоматиз.',
		'API and rules': 'API и правила',
		'Pay': 'Выплаты',
		'Global methods': 'Способы',
		'Scale': 'Масштабир.',
		'Reports and cost': 'Отчеты',
		'Team and payroll structure': 'Команда и payroll',
		'Configured': 'Настроено',
		'Entities': 'Юрлица',
		'Teams': 'Команды',
		'Workers': 'Люди',
		'Payroll admin': 'Payroll-админ',
		'Finance HQ': 'Финансовый офис',
		'Regional approver': 'Согласующий',
		'EU entities': 'ЕС-юрлица',
		'HR lead': 'HR-лид',
		'Global team': 'Глобальная команда',
		'Payout rail': 'Маршрут выплат',
		'$1.84M ready': '$1.84M готово',
		'Funding checked': 'Финансирование проверено',
		'38 countries': '38 стран',
		'Automation and compliance': 'Автоматиз. и требования',
		'Live': 'Активно',
		'Reporting and scale': 'Отчетность и рост',
		'Updated': 'Обновлено',
		'Payroll cost': 'Расходы payroll',
		'Exceptions': 'Искл.',
		"Payroll operations don't stop when the office doors close. We have 24/7 support for all your payroll teams, finance departments, HR managers, contractors and employees wherever they are, any time of day":
			'Payroll-операции не останавливаются после окончания рабочего дня. Мы обеспечиваем поддержку 24/7 для ваших payroll-команд, финансовых отделов, HR-менеджеров, подрядчиков и сотрудников, где бы они ни находились и в любое время суток',
		'Automate your payroll, taxes, reporting and compliance in all the countries you have operations in. Garna helps big teams to reduce the paperwork and keep everything audit-proof so you know you’re on the right side of the law':
			'Автоматизируйте payroll, налоги, отчетность и соблюдение требований во всех странах, где работает ваша компания. Garna помогает большим командам сократить бумажную работу и хранить данные в формате, готовом к аудиту, чтобы вы оставались в правовом поле',
		'Send remunerations to all your teams and contractors globally using our platform built for big businesses. It has all the tools you need for mass payouts, multi-currency payroll, contractors and employee payments in 150+ countries. You can use bank transfers, SWIFT, SEPA, local bank transfers, PayPal, Payoneer, and crypto':
			'Отправляйте выплаты командам и подрядчикам по всему миру через платформу, созданную для крупного бизнеса. В ней есть все для массовых выплат, мультивалютного payroll, выплат подрядчикам и сотрудникам в 150+ странах. Можно использовать банковские переводы, SWIFT, SEPA, локальные банковские переводы, PayPal, Payoneer и крипто',
		'Send remunerations to all your teams and contractors globally using our platform built for big businesses. It has all the tools you need for mass payouts, multi-currency payroll, contractors and employee payments in 150+ countries. You can use bank transfers, SWIFT, SEPA, PayPal, Payoneer, and crypto':
			'Отправляйте выплаты командам и подрядчикам по всему миру через платформу, созданную для крупного бизнеса. В ней есть все для массовых выплат, мультивалютного payroll, выплат подрядчикам и сотрудникам в 150+ странах. Можно использовать банковские переводы, SWIFT, SEPA, PayPal, Payoneer и крипто',
		'Flexible payment options': 'Гибкие варианты выплат',
		'Pick the payment method that works best for your teams and structure and get everything sorted from one platform':
			'Выберите способ выплат, который подходит вашей команде и структуре, и управляйте всем из одной платформы',
		'Global reach': 'Глобальный охват',
		'Pay your employees and contractors in 150+ countries without having to turn to different providers or separate systems':
			'Платите сотрудникам и подрядчикам в 150+ странах без отдельных провайдеров и разрозненных систем',
		'Early payout access': 'Ранний доступ к выплатам',
		'Give your teams faster payouts with our flexible funding and payment workflows':
			'Обеспечьте командам более быстрые выплаты с гибкими процессами финансирования и платежей',
		'Single Sign-On (SSO)': 'Single Sign-On (SSO)',
		'Get secure access to Garna through your existing identity provider. This feature locks down security, makes user management and the login process for employees and admins easier':
			'Получайте безопасный доступ к Garna через вашего текущего поставщика идентификационных данных. Эта функция усиливает безопасность и упрощает управление пользователями и вход для сотрудников и администраторов',
		'Role-Based Permissions': 'Ролевые права доступа',
		'Give your finance, HR, operations, and leadership teams different levels of access based on their functions. This way every user only sees the data they need to see, while sensitive payroll information is kept safe':
			'Настраивайте разные уровни доступа для финансовых, HR, операционных и руководящих команд в зависимости от их задач. Так каждый пользователь видит только нужные данные, а чувствительная payroll-информация остается защищенной',
		'Payment Limits & Approval Controls': 'Лимиты выплат и контроль согласований',
		'Set payout limits for managers, teams, or departments to keep control over company finances. For anything above that, require additional approvals':
			'Устанавливайте лимиты выплат для менеджеров, команд или отделов, чтобы сохранять контроль над финансами компании. Для операций сверх лимита можно требовать дополнительные согласования',
		'Control & Visibility': 'Контроль и прозрачность',
		'Track payroll status, payout timing, exceptions, approvals, and workforce costs in one place so finance and operations teams can understand what is happening across every country':
			'Отслеживайте статус payroll, сроки выплат, исключения, согласования и расходы на команду в одном месте, чтобы финансовые и операционные команды понимали, что происходит в каждой стране',
		'Garna Solutions for Enterprises': 'Решения Garna для крупных компаний',
		'Pay Global Contractors in 3 Clicks': 'Выплачивайте подрядчикам по всему миру в 3 клика',
		"With Garna, you can cut administrative costs and manage contractor onboarding, invoicing, and compliance regulations. Get their pay out to them with ease, no matter where they're based or how many of them you have. API payments set up lets enterprises automate contractor payouts straight from their own system":
			'С Garna можно сократить административные расходы и управлять онбордингом подрядчиков, инвойсами и соблюдением требований. Выплачивайте подрядчикам без лишней сложности, где бы они ни находились и сколько бы их ни было. Настройка API-платежей позволяет крупным компаниям автоматизировать выплаты подрядчикам прямо из собственной системы',
		'Hire Employees Worldwide': 'Нанимайте сотрудников по всему миру',
		"No need to open up local offices in different countries just to get the right people on board. That's where the employer of record superstructure comes at hand. This lets you hire people across the world while all the usual employer duties get taken care of: payroll, compliance, taxes, and the local employment rules":
			'Не нужно открывать локальные офисы в разных странах только ради найма нужных людей. В этом помогает модель employer of record: вы нанимаете людей по всему миру, а стандартные обязанности работодателя закрываются за вас — payroll, соблюдение требований, налоги и локальные трудовые правила',
		'Built for Global Teams and Complex Operations': 'Создано для глобальных команд и сложных операций',
		"When you're running a global payroll operation, you need infrastructure that can match the complexity and scale of it. We'll explain it in one word - and in more detail":
			'Когда вы управляете глобальным payroll, нужна инфраструктура, которая соответствует его масштабу и сложности. Объясним это одним словом — и подробнее',
		'Consolidation': 'Консолидация',
		"There's no need for a group of separate payroll providers and disconnected regional systems. Swap them for a global payroll solution that is built for the biggest and most complex multinational businesses":
			'Вам не нужна группа отдельных payroll-провайдеров и разрозненных региональных систем. Замените их глобальным payroll-решением, созданным для самых крупных и сложных международных компаний',
		'Want to give your contractors and employees the payroll experience they deserve? Our white-label and embedded payroll solutions let you orchestrate the launching of a fully-branded payroll product or integrated payroll functionality directly into your own product (internal systems, SaaS platforms, finance tools, and marketplaces)':
			'Хотите дать подрядчикам и сотрудникам payroll-опыт, которого они заслуживают? Наши white-label и embedded payroll-решения помогают запустить полностью брендированный payroll-продукт или встроить payroll-функциональность прямо в ваш продукт: внутренние системы, SaaS-платформы, финансовые инструменты и маркетплейсы',
		'Scalability': 'Масштабируемость',
		"Pay hundreds of contractors and employees with a couple of clicks. Our solution is designed to handle high-volume payroll processing, multi-country payroll operations, and workforce growth, that's why it's flexible and adjusts to any minor changes in your business":
			'Выплачивайте сотням подрядчиков и сотрудников в несколько кликов. Наше решение создано для обработки больших объемов payroll, операций в разных странах и роста команды, поэтому оно гибко адаптируется к изменениям в бизнесе',
		'Safety': 'Безопасность',
		'All the data is strongly protected with enterprise payroll security, SSO authentication, role-based access controls, payroll audit compliance, and secure global payroll operations':
			'Все данные защищены на корпоративном уровне безопасности для payroll: SSO-аутентификацией, ролевым доступом, готовностью к аудиту и безопасными глобальными payroll-операциями',
		'Trusted by Growing Teams': 'Нам доверяют растущие команды',
		'There is a simple explanation behind the reason why global businesses partner with Garna: our platform makes the processes easier, safer, and efficient. Here are the proofs':
			'Есть простое объяснение, почему глобальные компании выбирают Garna: наша платформа делает процессы проще, безопаснее и эффективнее. Вот подтверждения',
		'"Garna helped us consolidate payroll across six entities without forcing every region into the same rigid process. Finance finally has one source of truth for payroll cost, approvals, and reporting"':
			'"Garna помогла нам консолидировать payroll по шести юридическим лицам, не заставляя каждый регион работать по одному жесткому процессу. У финансовой команды наконец появился единый источник данных по payroll-расходам, согласованиям и отчетности"',
		'"We needed payroll infrastructure that could support employees, contractors, and local requirements at the same time. Garna gave our operations team the control we were missing across countries"':
			'"Нам была нужна payroll-инфраструктура, которая одновременно поддерживает сотрудников, подрядчиков и локальные требования. Garna дала нашей операционной команде контроль, которого нам не хватало в разных странах"',
		'"The biggest change was visibility. Our HR, finance, and compliance teams can now track payroll status, exceptions, and payout timing from one workflow instead of chasing regional providers"':
			'"Главное изменение — прозрачность. Теперь наши HR, финансовая команда и команда по соблюдению требований отслеживают статус payroll, исключения и сроки выплат в одном процессе, вместо того чтобы постоянно обращаться к региональным провайдерам"',
		'Global Payroll Is Easy When Made By Using Garna': 'Глобальный payroll становится проще с Garna',
		"Garna provides the global payroll infrastructure independently from the task вЂ” whether you're scaling into new markets, dealing with distributed teams, or replacing old, fragmented payroll systems, itвЂ™ll adjust to your needs seamlessly":
			'Garna предоставляет глобальную payroll-инфраструктуру под разные задачи: выход на новые рынки, управление распределенными командами или замена устаревших разрозненных payroll-систем. Платформа гибко адаптируется к вашим потребностям',
		'Try now': 'Попробовать сейчас',
	},
	bookingWidget: {
		...homeRu.bookingWidget,
		title: 'Начните работу с Garna',
		subtitle: 'Оставьте данные, чтобы забронировать демо',
	},
};

