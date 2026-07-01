import { homeEs } from '../home/es';

export const enterprisePayrollEs = {
	...homeEs,
	common: {
		learnMore: 'Más información',
	},
	meta: {
		title: 'Sistema internacional de nómina para grandes empresas | Garna',
		description:
			'Explora las oportunidades de colaborar con Garna, el sistema que ofrece una solución eficiente de nómina global.',
	},
	hero: {
		...homeEs.hero,
		badge: 'Nómina para grandes empresas',
		title: 'Infraestructura de nómina creada para escalar negocios globales',
		description:
			'Un sistema centralizado de nómina global diseñado para gestionar operaciones en distintos países, entidades, contratistas y empleados sin perder flexibilidad',
		cta: 'Prueba Garna',
	},
	howTo: {
		...homeEs.howTo,
		title: 'Cómo funciona la nómina: 4 pasos simples',
		description:
			'Para las grandes empresas, gestionar la nómina correctamente y sin errores es un gran desafío. Por eso creamos un sistema de varios pasos simples para que el proceso sea más claro y fiable',
		steps: {
			step1: {
				title: 'Configura tu equipo y estructura de nómina',
				description:
					'Configura tu empresa y cuenta bancaria, asigna roles al equipo de nómina, incorpora nuevos empleados y contratistas, y organiza todas las entidades y equipos que necesites',
			},
			step2: {
				title: 'Automatiza cálculos y cumplimiento',
				description: 'Conecta tu dashboard mediante API y automatiza tareas de nómina',
			},
			step3: {
				title: 'Ejecuta nómina y pagos globales',
				description:
					'Configura la financiación y envía pagos a empleados y contratistas en todo el mundo mediante distintos métodos: transferencias bancarias locales, SWIFT, SEPA, PayPal, Payoneer o crypto',
			},
			step4: {
				title: 'Supervisa, reporta y escala',
				description:
					'Controla las operaciones de nómina desde un dashboard fácil de usar, accede a reportes y analítica en tiempo real, y supervisa los costos de personal en cada región',
			},
		},
	},
	heroVisual: {
		entitySync: 'Sincronización de entidades',
		markets: '24 mercados',
		entitiesSynced: 'Entidades sincronizadas',
		commandTitle: 'Centro de control de nómina',
		commandMeta: '6 entidades · 38 países',
		live: 'Activo',
		readyCycle: 'Nómina lista para este ciclo',
		countries: 'Países',
		entities: 'Entidades',
		workers: 'Trabajadores',
		approvalQueue: 'Cola de aprobaciones',
		approvers: 'Aprobadores',
		multiCountryPayroll: 'Nómina multinacional',
		multiCountryMeta: 'Empleados · contratistas · proveedores',
		ready: 'Listo',
		complianceChecks: 'Comprobaciones de cumplimiento',
		complianceMeta: 'Impuestos · contratos · normas locales',
		running: 'En curso',
		regions: '14 regiones',
	},
	whyGarna: homeEs.whyGarna,
	enterpriseFinalCta: {
		title: 'La nómina global es más fácil con Garna',
		description:
			'Garna proporciona infraestructura global de nómina para distintas necesidades: expansión a nuevos mercados, gestión de equipos distribuidos o sustitución de sistemas de nómina antiguos y fragmentados. La plataforma se adapta a tus necesidades con flexibilidad',
		button: 'Probar ahora',
	},
	faqHome: {
		...homeEs.faqHome,
		subtitle: '¿Tienes preguntas? Tenemos respuestas',
	},
	enterprisePayrollFaq: {
		title: 'Preguntas frecuentes sobre nómina para negocios globales',
		items: {
			q1: {
				question: '¿Cómo funciona la nómina global?',
				answer:
					'La nómina global permite a las empresas controlar pagos a empleados y contratistas en varios países mediante un sistema centralizado que gestiona todo: desde pagos hasta cumplimiento fiscal y reportes.',
			},
			q2: {
				question: '¿Puedo asignar distintos niveles de acceso a diferentes miembros del equipo?',
				answer:
					'Sí. Puedes otorgar permisos basados en roles para los datos que tus empleados necesitan y, además, establecer límites de pago para contratistas. Toda operación que supere esos límites requerirá aprobaciones adicionales.',
			},
			q3: {
				question: '¿Cómo garantizan el cumplimiento en distintos países?',
				answer:
					'Garna utiliza flujos automatizados de cumplimiento que tienen en cuenta reglas fiscales locales, normativas de nómina y requisitos regionales de reporte.',
			},
			q4: {
				question: '¿Puedo pagar a contratistas y empleados en una sola plataforma?',
				answer:
					'Sí. Garna funciona como una plataforma global unificada de nómina para gestionar empleados, contratistas, freelancers y equipos distribuidos desde un solo sistema.',
			},
			q5: {
				question: '¿Cuánto tiempo lleva lanzarse en un nuevo país?',
				answer:
					'Los tiempos de lanzamiento dependen del país y la configuración, pero Garna ayuda a las empresas a expandirse internacionalmente mucho más rápido que si construyeran infraestructura local de nómina por su cuenta.',
			},
			q6: {
				question: '¿Admiten pagos en múltiples divisas?',
				answer:
					'Sí. Garna permite realizar pagos globales de nómina en múltiples divisas mediante métodos flexibles como SWIFT, SEPA, transferencias bancarias, PayPal, Payoneer y crypto.',
			},
			q7: {
				question: '¿Puede Garna integrarse con nuestros sistemas actuales?',
				answer:
					'Sí. Admitimos integración de payroll API con sistemas de RR. HH., plataformas contables, herramientas ERP y productos SaaS.',
			},
			q8: {
				question: '¿Puede Garna sustituir a varios proveedores de nómina?',
				answer:
					'Sí, y siendo honestos, así es más eficiente. Muchos de nuestros clientes grandes usan Garna para consolidar proveedores de nómina, centralizar sus operaciones y liberarse de las complicaciones de trabajar con proveedores regionales desconectados.',
			},
			q9: {
				question: '¿Garna es adecuada para casos de embedded payroll?',
				answer:
					'Sí. Admitimos infraestructura de embedded payroll, soluciones white-label de nómina y modelos payroll-as-a-service para plataformas, marketplaces y ecosistemas de grandes empresas.',
			},
			q10: {
				question: '¿Qué tan segura es la plataforma?',
				answer:
					'Garna utiliza el nivel de seguridad que esperarías de una plataforma corporativa de nómina: cifrado de nivel corporativo, controles de acceso basados en roles y protección de datos de nómina diseñada para operaciones globales a gran escala.',
			},
		},
	},
	sourceText: {
		'Take Full Control Over Global Payroll Operations': 'Toma el control total de las operaciones globales de nómina',
		"Garna has a unique solution for enterprises with growing teams and entities and compliance requirements that have to be dealt with in different regions. We've built one solid payroll infrastructure platform that makes it possible for large businesses to manage their workforces on a global scale":
			'Garna ofrece una solución para grandes empresas con equipos en crecimiento, entidades y requisitos de cumplimiento que deben gestionarse en distintas regiones. Hemos creado una plataforma sólida de infraestructura de nómina que permite a las grandes empresas gestionar su fuerza laboral a escala global',
		'Centralizing payroll across countries and entities': 'Centralización de la nómina entre países y entidades',
		'With Garna, you can deal with multiple countries, subsidiaries, and workforce setups from different places from one global payroll dashboard':
			'Con Garna, puedes gestionar múltiples países, filiales y estructuras de personal desde un único dashboard global de nómina',
		'Making payroll scalable and automated': 'Nómina escalable y automatizada',
		"Garna's solution makes automated processing, approvals, invoices, contractor payments and other processes run smoother":
			'La solución de Garna facilita el procesamiento automatizado, las aprobaciones, las facturas, los pagos a contratistas y otros procesos',
		'Staying on top of global compliance': 'Control del cumplimiento global',
		'Garna helps companies stay on top of ever-changing rules and regulations with automated tax rules handling, regulatory compliance, audit-ready records and keeping track of compliance across different countries':
			'Garna ayuda a las empresas a mantenerse al día con reglas y normativas en constante cambio mediante la gestión automatizada de reglas fiscales, el cumplimiento normativo, registros listos para auditoría y el seguimiento de requisitos en distintos países',
		'Having everything in one place': 'Todo en un solo lugar',
		'Manage payroll operations, approvals, reporting, contractor payments, global workflows, and multi-currency payroll from one intuitive system':
			'Gestiona operaciones de nómina, aprobaciones, reportes, pagos a contratistas, flujos globales y nómina multidivisa desde un sistema intuitivo',
		'A Single Platform That Handles Many Processes — Greatly and Globally':
			'Una sola plataforma para muchos procesos — de forma global y eficiente',
		'A Single Platform That Handles Many Processes &mdash; Greatly and Globally':
			'Una sola plataforma para muchos procesos — de forma global y eficiente',
		'Garna helps enterprises keep their payroll in order across different countries and teams without overdoing. We’ve got one platform that lets you sort out payroll, compliance, reporting, and sending out paychecks all in one go':
			'Garna ayuda a las grandes empresas a mantener la nómina bajo control en distintos países y equipos sin añadir complejidad innecesaria. Una sola plataforma permite gestionar nómina, cumplimiento, reportes y pagos en un único flujo',
		"Garna helps enterprises keep their payroll in order across different countries and teams without overdoing. We've got one platform that lets you sort out payroll, compliance, reporting, and sending out paychecks all in one go":
			'Garna ayuda a las grandes empresas a mantener la nómina bajo control en distintos países y equipos sin añadir complejidad innecesaria. Una sola plataforma permite gestionar nómina, cumplimiento, reportes y pagos en un único flujo',
		'Payroll & Compliance': 'Nómina y cumplimiento',
		'Payroll &amp; Compliance': 'Nómina y cumplimiento',
		'Payments Infrastructure': 'Infraestructura de pagos',
		'Permissions': 'Permisos',
		'Approval Controls': 'Controles de aprobación',
		'Visibility': 'Visibilidad',
		'24/7 Support': 'Soporte 24/7',
		'Compliance run': 'Revisión de cumplimiento',
		'Taxes, reports, and audit trail synced': 'Impuestos, reportes y auditoría sincronizados',
		'Payout routes': 'Rutas de pago',
		'SWIFT, SEPA, cards, and crypto ready': 'SWIFT, SEPA, tarjetas y cripto listos',
		'Identity connected': 'Identidad conectada',
		'SSO enabled for admins and teams': 'SSO activo para admins y equipos',
		'Finance admin': 'Admin de finanzas',
		'Full payroll access': 'Acceso completo a nómina',
		'EU contractor run': 'Pago a contratistas de la UE',
		'$42,000 needs regional approval': '$42,000 requiere aprobación regional',
		'Global payroll report': 'Reporte global de nómina',
		'38 countries, 6 entities, 12 exceptions': '38 países, 6 entidades, 12 excepciones',
		'Support desk': 'Mesa de soporte',
		'Payroll and compliance teams online': 'Equipos de nómina y cumplimiento en línea',
		'Enterprise payroll workflow': 'Flujo de nómina para grandes empresas',
		'Global payroll operations board': 'Panel de operaciones globales de nómina',
		'4 steps active': '4 pasos activos',
		'Structure': 'Estructura',
		'Entities and roles': 'Entidades y roles',
		'Automate': 'Automatizar',
		'API and rules': 'API y reglas',
		'Pay': 'Pagar',
		'Global methods': 'Métodos globales',
		'Scale': 'Escalar',
		'Reports and cost': 'Reportes y costes',
		'Team and payroll structure': 'Estructura de equipo y nómina',
		'Configured': 'Configurado',
		'Entities': 'Ent.',
		'Teams': 'Equipos',
		'Workers': 'Trab.',
		'Payroll admin': 'Admin de nómina',
		'Finance HQ': 'Finanzas HQ',
		'Regional approver': 'Aprobador regional',
		'EU entities': 'Ent. UE',
		'HR lead': 'Líder de RR. HH.',
		'Global team': 'Equipo global',
		'Payout rail': 'Ruta de pago',
		'$1.84M ready': '$1.84M listos',
		'Funding checked': 'Financiación verificada',
		'38 countries': '38 países',
		'Automation and compliance': 'Automatización y cumplimiento',
		'Live': 'Activo',
		'Reporting and scale': 'Reportes y escala',
		'Updated': 'Actualizado',
		'Payroll cost': 'Coste de nómina',
		'Exceptions': 'Exc.',
		"Payroll operations don't stop when the office doors close. We have 24/7 support for all your payroll teams, finance departments, HR managers, contractors and employees wherever they are, any time of day":
			'Las operaciones de nómina no se detienen cuando termina la jornada. Ofrecemos soporte 24/7 para tus equipos de nómina, departamentos financieros, responsables de RR. HH., contratistas y empleados, estén donde estén y a cualquier hora',
		'Automate your payroll, taxes, reporting and compliance in all the countries you have operations in. Garna helps big teams to reduce the paperwork and keep everything audit-proof so you know you’re on the right side of the law':
			'Automatiza la nómina, los impuestos, los reportes y el cumplimiento en todos los países donde opera tu empresa. Garna ayuda a los equipos grandes a reducir el papeleo y mantener los datos listos para auditoría, para que trabajes dentro del marco legal',
		'Send remunerations to all your teams and contractors globally using our platform built for big businesses. It has all the tools you need for mass payouts, multi-currency payroll, contractors and employee payments in 150+ countries. You can use bank transfers, SWIFT, SEPA, local bank transfers, PayPal, Payoneer, and crypto':
			'Envía pagos a equipos y contratistas en todo el mundo desde una plataforma creada para grandes empresas. Incluye herramientas para pagos masivos, nómina multidivisa y pagos a contratistas y empleados en más de 150 países. Puedes usar transferencias bancarias, SWIFT, SEPA, transferencias bancarias locales, PayPal, Payoneer y crypto',
		'Send remunerations to all your teams and contractors globally using our platform built for big businesses. It has all the tools you need for mass payouts, multi-currency payroll, contractors and employee payments in 150+ countries. You can use bank transfers, SWIFT, SEPA, PayPal, Payoneer, and crypto':
			'Envía pagos a equipos y contratistas en todo el mundo desde una plataforma creada para grandes empresas. Incluye herramientas para pagos masivos, nómina multidivisa y pagos a contratistas y empleados en más de 150 países. Puedes usar transferencias bancarias, SWIFT, SEPA, PayPal, Payoneer y crypto',
		'Flexible payment options': 'Opciones de pago flexibles',
		'Pick the payment method that works best for your teams and structure and get everything sorted from one platform':
			'Elige el método de pago que mejor se adapte a tus equipos y estructura, y gestiona todo desde una sola plataforma',
		'Global reach': 'Alcance global',
		'Pay your employees and contractors in 150+ countries without having to turn to different providers or separate systems':
			'Paga a empleados y contratistas en más de 150 países sin recurrir a distintos proveedores ni sistemas separados',
		'Early payout access': 'Acceso anticipado a pagos',
		'Give your teams faster payouts with our flexible funding and payment workflows':
			'Ofrece pagos más rápidos a tus equipos con nuestros flujos flexibles de financiación y pagos',
		'Single Sign-On (SSO)': 'Single Sign-On (SSO)',
		'Get secure access to Garna through your existing identity provider. This feature locks down security, makes user management and the login process for employees and admins easier':
			'Accede a Garna de forma segura a través de tu proveedor de identidad actual. Esta función refuerza la seguridad y simplifica la gestión de usuarios y el inicio de sesión para empleados y administradores',
		'Role-Based Permissions': 'Permisos basados en roles',
		'Give your finance, HR, operations, and leadership teams different levels of access based on their functions. This way every user only sees the data they need to see, while sensitive payroll information is kept safe':
			'Asigna distintos niveles de acceso a los equipos de finanzas, RR. HH., operaciones y dirección según sus funciones. Así, cada usuario ve solo los datos que necesita, mientras la información sensible de nómina permanece protegida',
		'Payment Limits & Approval Controls': 'Límites de pago y controles de aprobación',
		'Set payout limits for managers, teams, or departments to keep control over company finances. For anything above that, require additional approvals':
			'Define límites de pago para managers, equipos o departamentos y mantén el control de las finanzas de la empresa. Para cualquier operación que supere esos límites, puedes exigir aprobaciones adicionales',
		'Control & Visibility': 'Control y visibilidad',
		'Track payroll status, payout timing, exceptions, approvals, and workforce costs in one place so finance and operations teams can understand what is happening across every country':
			'Supervisa el estado de la nómina, los plazos de pago, las excepciones, las aprobaciones y los costos de personal en un solo lugar, para que los equipos de finanzas y operaciones entiendan qué ocurre en cada país',
		'Garna Solutions for Enterprises': 'Soluciones de Garna para grandes empresas',
		'Pay Global Contractors in 3 Clicks': 'Paga a contratistas globales en 3 clics',
		"With Garna, you can cut administrative costs and manage contractor onboarding, invoicing, and compliance regulations. Get their pay out to them with ease, no matter where they're based or how many of them you have. API payments set up lets enterprises automate contractor payouts straight from their own system":
			'Con Garna, puedes reducir costos administrativos y gestionar el onboarding de contratistas, facturas y requisitos de cumplimiento. Paga a tus contratistas con facilidad, sin importar dónde estén ni cuántos sean. La configuración de pagos vía API permite a las grandes empresas automatizar pagos a contratistas directamente desde su propio sistema',
		'Hire Employees Worldwide': 'Contrata empleados en todo el mundo',
		"No need to open up local offices in different countries just to get the right people on board. That's where the employer of record superstructure comes at hand. This lets you hire people across the world while all the usual employer duties get taken care of: payroll, compliance, taxes, and the local employment rules":
			'No necesitas abrir oficinas locales en distintos países solo para contratar a las personas adecuadas. Ahí entra el modelo employer of record: puedes contratar personas en todo el mundo mientras se gestionan las responsabilidades habituales del empleador, como nómina, cumplimiento, impuestos y normas laborales locales',
		'Built for Global Teams and Complex Operations': 'Creado para equipos globales y operaciones complejas',
		"When you're running a global payroll operation, you need infrastructure that can match the complexity and scale of it. We'll explain it in one word - and in more detail":
			'Cuando gestionas una operación global de nómina, necesitas una infraestructura capaz de responder a su complejidad y escala. Lo explicamos en una palabra — y con más detalle',
		'Consolidation': 'Consolidación',
		"There's no need for a group of separate payroll providers and disconnected regional systems. Swap them for a global payroll solution that is built for the biggest and most complex multinational businesses":
			'No necesitas varios proveedores de nómina ni sistemas regionales desconectados. Sustitúyelos por una solución global de nómina creada para las empresas multinacionales más grandes y complejas',
		'Want to give your contractors and employees the payroll experience they deserve? Our white-label and embedded payroll solutions let you orchestrate the launching of a fully-branded payroll product or integrated payroll functionality directly into your own product (internal systems, SaaS platforms, finance tools, and marketplaces)':
			'¿Quieres ofrecer a tus contratistas y empleados la experiencia de nómina que merecen? Nuestras soluciones white-label y embedded payroll permiten lanzar un producto de nómina completamente personalizado con tu marca o integrar funcionalidad de nómina directamente en tu propio producto: sistemas internos, plataformas SaaS, herramientas financieras y marketplaces',
		'Scalability': 'Escalabilidad',
		"Pay hundreds of contractors and employees with a couple of clicks. Our solution is designed to handle high-volume payroll processing, multi-country payroll operations, and workforce growth, that's why it's flexible and adjusts to any minor changes in your business":
			'Paga a cientos de contratistas y empleados en pocos clics. Nuestra solución está diseñada para gestionar grandes volúmenes de nómina, operaciones en varios países y crecimiento de equipos, por eso es flexible y se adapta a los cambios de tu negocio',
		'Safety': 'Seguridad',
		'All the data is strongly protected with enterprise payroll security, SSO authentication, role-based access controls, payroll audit compliance, and secure global payroll operations':
			'Todos los datos están protegidos con seguridad de nivel corporativo para nómina: autenticación SSO, controles de acceso basados en roles, preparación para auditorías y operaciones globales de nómina seguras',
		'Trusted by Growing Teams': 'Equipos en crecimiento confían en nosotros',
		'There is a simple explanation behind the reason why global businesses partner with Garna: our platform makes the processes easier, safer, and efficient. Here are the proofs':
			'Hay una explicación simple de por qué las empresas globales eligen Garna: nuestra plataforma hace que los procesos sean más simples, seguros y eficientes. Aquí están las pruebas',
		'"Garna helped us consolidate payroll across six entities without forcing every region into the same rigid process. Finance finally has one source of truth for payroll cost, approvals, and reporting"':
			'"Garna nos ayudó a consolidar la nómina en seis entidades sin obligar a cada región a seguir el mismo proceso rígido. Finanzas por fin tiene una única fuente de verdad para costos de nómina, aprobaciones y reportes"',
		'"We needed payroll infrastructure that could support employees, contractors, and local requirements at the same time. Garna gave our operations team the control we were missing across countries"':
			'"Necesitábamos una infraestructura de nómina que pudiera apoyar a empleados, contratistas y requisitos locales al mismo tiempo. Garna dio a nuestro equipo de operaciones el control que nos faltaba en distintos países"',
		'"The biggest change was visibility. Our HR, finance, and compliance teams can now track payroll status, exceptions, and payout timing from one workflow instead of chasing regional providers"':
			'"El mayor cambio fue la visibilidad. Ahora nuestros equipos de RR. HH., finanzas y cumplimiento pueden seguir el estado de la nómina, las excepciones y los plazos de pago desde un único flujo, en lugar de perseguir a proveedores regionales"',
		'Global Payroll Is Easy When Made By Using Garna': 'La nómina global es más sencilla con Garna',
		"Garna provides the global payroll infrastructure independently from the task вЂ” whether you're scaling into new markets, dealing with distributed teams, or replacing old, fragmented payroll systems, itвЂ™ll adjust to your needs seamlessly":
			'Garna proporciona infraestructura global de nómina para distintas necesidades: expansión a nuevos mercados, gestión de equipos distribuidos o sustitución de sistemas de nómina antiguos y fragmentados. La plataforma se adapta a tus necesidades con flexibilidad',
		'Try now': 'Probar ahora',
	},
	bookingWidget: {
		...homeEs.bookingWidget,
		title: 'Comienza tu camino con Garna',
		subtitle: 'Deja tus datos para reservar una demo',
	},
};
