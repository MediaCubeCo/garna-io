import { homePt } from '../home/pt';

export const enterprisePayrollPt = {
	...homePt,
	common: {
		learnMore: 'Saiba mais',
	},
	meta: {
		title: 'Sistema internacional de payroll para grandes empresas | Garna',
		description:
			'Explore as oportunidades de parceria com a Garna, o sistema que oferece uma solução eficiente de payroll global.',
	},
	hero: {
		...homePt.hero,
		badge: 'Payroll para Grandes Empresas',
		title: 'Infraestrutura de payroll criada para escalar negócios globais',
		description:
			'Um sistema centralizado de payroll global criado para gerir operações em diferentes países, entidades, contratados e colaboradores sem perder flexibilidade',
		cta: 'Experimentar Garna',
	},
	howTo: {
		...homePt.howTo,
		title: 'Como funciona o payroll: 4 passos simples',
		description:
			'Para grandes empresas, acertar no payroll sem erros é um grande desafio. Por isso criámos um sistema de vários passos simples para tornar o processo mais claro e fiável',
		steps: {
			step1: {
				title: 'Configure a sua equipa e estrutura de payroll',
				description:
					'Configure a empresa e a conta bancária, atribua funções à equipa de payroll, adicione novos colaboradores e contratados, e organize todas as entidades e equipas necessárias',
			},
			step2: {
				title: 'Automatize cálculos e compliance',
				description: 'Ligue o dashboard via API e automatize tarefas de payroll',
			},
			step3: {
				title: 'Execute payroll e pagamentos globais',
				description:
					'Configure o financiamento e envie pagamentos para colaboradores e contratados em todo o mundo através de diferentes métodos: transferências bancárias locais, SWIFT, SEPA, PayPal, Payoneer ou crypto',
			},
			step4: {
				title: 'Acompanhe, reporte e escale',
				description:
					'Controle operações de payroll através de um dashboard simples, aceda a relatórios e análises em tempo real, e acompanhe os custos da força de trabalho em cada região',
			},
		},
	},
	heroVisual: {
		entitySync: 'Sincronização de entidades',
		markets: '24 mercados',
		entitiesSynced: 'Entidades sincronizadas',
		commandTitle: 'Centro de controlo de payroll',
		commandMeta: '6 entidades · 38 países',
		live: 'Ativo',
		readyCycle: 'Payroll pronto para este ciclo',
		countries: 'Países',
		entities: 'Entidades',
		workers: 'Trabalhadores',
		approvalQueue: 'Fila de aprovações',
		approvers: 'Aprovadores',
		multiCountryPayroll: 'Payroll multinacional',
		multiCountryMeta: 'Colaboradores · contratados · fornecedores',
		ready: 'Pronto',
		complianceChecks: 'Verificações de compliance',
		complianceMeta: 'Impostos · contratos · regras locais',
		running: 'Em curso',
		regions: '14 regiões',
	},
	whyGarna: homePt.whyGarna,
	enterpriseFinalCta: {
		title: 'O payroll global fica mais simples com a Garna',
		description:
			'A Garna fornece infraestrutura global de payroll para diferentes necessidades: expansão para novos mercados, gestão de equipas distribuídas ou substituição de sistemas de payroll antigos e fragmentados. A plataforma adapta-se às suas necessidades com flexibilidade',
		button: 'Experimentar agora',
	},
	faqHome: {
		...homePt.faqHome,
		subtitle: 'Tem perguntas? Temos respostas',
	},
	enterprisePayrollFaq: {
		title: 'Perguntas frequentes sobre payroll para negócios globais',
		items: {
			q1: {
				question: 'Como funciona o payroll global?',
				answer:
					'O payroll global permite que empresas controlem pagamentos a colaboradores e contratados em vários países através de um sistema centralizado que gere tudo: de pagamentos a compliance fiscal e relatórios.',
			},
			q2: {
				question: 'Posso atribuir diferentes níveis de acesso a diferentes membros da equipa?',
				answer:
					'Sim. Pode atribuir permissões baseadas em funções aos dados de que os colaboradores precisam e, além disso, definir limites de pagamento para contratados. Qualquer operação acima desses limites exigirá aprovações adicionais.',
			},
			q3: {
				question: 'Como garantem compliance em diferentes países?',
				answer:
					'A Garna utiliza workflows automatizados de compliance que consideram regras fiscais locais, regulamentos de payroll e requisitos regionais de relatórios.',
			},
			q4: {
				question: 'Posso pagar contratados e colaboradores numa única plataforma?',
				answer:
					'Sim. A Garna funciona como uma plataforma global unificada de payroll para gerir colaboradores, contratados, freelancers e equipas distribuídas a partir de um único sistema.',
			},
			q5: {
				question: 'Quanto tempo demora lançar num novo país?',
				answer:
					'Os prazos de lançamento dependem do país e da configuração, mas a Garna ajuda empresas a expandirem-se internacionalmente muito mais rápido do que se criassem infraestrutura local de payroll por conta própria.',
			},
			q6: {
				question: 'Suportam pagamentos em várias moedas?',
				answer:
					'Sim. A Garna permite fazer pagamentos globais de payroll em várias moedas através de métodos flexíveis como SWIFT, SEPA, transferências bancárias, PayPal, Payoneer e crypto.',
			},
			q7: {
				question: 'A Garna pode integrar-se com os nossos sistemas atuais?',
				answer:
					'Sim. Suportamos integração de payroll API com sistemas de RH, plataformas contabilísticas, ferramentas ERP e produtos SaaS.',
			},
			q8: {
				question: 'A Garna pode substituir vários fornecedores de payroll?',
				answer:
					'Sim, e sendo sinceros, é mais eficiente assim. Muitos dos nossos grandes clientes usam a Garna para consolidar fornecedores de payroll, centralizar operações e livrar-se das complicações de trabalhar com fornecedores regionais desconectados.',
			},
			q9: {
				question: 'A Garna é adequada para casos de embedded payroll?',
				answer:
					'Sim. Suportamos infraestrutura de embedded payroll, soluções white-label de payroll e modelos payroll-as-a-service para plataformas, marketplaces e ecossistemas de grandes empresas.',
			},
			q10: {
				question: 'Quão segura é a plataforma?',
				answer:
					'A Garna utiliza o nível de segurança esperado de uma plataforma corporativa de payroll: encriptação de nível corporativo, controlos de acesso baseados em funções e proteção de dados de payroll criada para operações globais em grande escala.',
			},
		},
	},
	sourceText: {
		'Take Full Control Over Global Payroll Operations': 'Controle total sobre operações globais de payroll',
		"Garna has a unique solution for enterprises with growing teams and entities and compliance requirements that have to be dealt with in different regions. We've built one solid payroll infrastructure platform that makes it possible for large businesses to manage their workforces on a global scale":
			'A Garna oferece uma solução para grandes empresas com equipas em crescimento, entidades e requisitos de compliance que precisam de ser geridos em diferentes regiões. Criámos uma plataforma sólida de infraestrutura de payroll que permite a grandes empresas gerir a sua força de trabalho em escala global',
		'Centralizing payroll across countries and entities': 'Centralização do payroll entre países e entidades',
		'With Garna, you can deal with multiple countries, subsidiaries, and workforce setups from different places from one global payroll dashboard':
			'Com a Garna, pode gerir vários países, subsidiárias e estruturas de trabalho a partir de um único dashboard global de payroll',
		'Making payroll scalable and automated': 'Payroll escalável e automatizado',
		"Garna's solution makes automated processing, approvals, invoices, contractor payments and other processes run smoother":
			'A solução da Garna torna mais simples o processamento automatizado, as aprovações, as faturas, os pagamentos a contratados e outros processos',
		'Staying on top of global compliance': 'Controlo do compliance global',
		'Garna helps companies stay on top of ever-changing rules and regulations with automated tax rules handling, regulatory compliance, audit-ready records and keeping track of compliance across different countries':
			'A Garna ajuda empresas a acompanhar regras e regulamentos em constante mudança com gestão automatizada de regras fiscais, compliance regulatório, registos prontos para auditoria e acompanhamento de requisitos em diferentes países',
		'Having everything in one place': 'Tudo num só lugar',
		'Manage payroll operations, approvals, reporting, contractor payments, global workflows, and multi-currency payroll from one intuitive system':
			'Gira operações de payroll, aprovações, relatórios, pagamentos a contratados, workflows globais e payroll multimoeda a partir de um sistema intuitivo',
		'A Single Platform That Handles Many Processes — Greatly and Globally':
			'Uma única plataforma para muitos processos — globalmente e com eficiência',
		'A Single Platform That Handles Many Processes &mdash; Greatly and Globally':
			'Uma única plataforma para muitos processos — globalmente e com eficiência',
		'Garna helps enterprises keep their payroll in order across different countries and teams without overdoing. We’ve got one platform that lets you sort out payroll, compliance, reporting, and sending out paychecks all in one go':
			'A Garna ajuda grandes empresas a manter o payroll organizado em diferentes países e equipas sem complexidade desnecessária. Uma única plataforma permite gerir payroll, compliance, relatórios e pagamentos num só fluxo',
		"Garna helps enterprises keep their payroll in order across different countries and teams without overdoing. We've got one platform that lets you sort out payroll, compliance, reporting, and sending out paychecks all in one go":
			'A Garna ajuda grandes empresas a manter o payroll organizado em diferentes países e equipas sem complexidade desnecessária. Uma única plataforma permite gerir payroll, compliance, relatórios e pagamentos num só fluxo',
		'Payroll & Compliance': 'Payroll e compliance',
		'Payroll &amp; Compliance': 'Payroll e compliance',
		'Payments Infrastructure': 'Infraestrutura de pagamentos',
		'Permissions': 'Permissões',
		'Approval Controls': 'Controlos de aprovação',
		'Visibility': 'Visibilidade',
		'24/7 Support': 'Suporte 24/7',
		'Compliance run': 'Verificação de compliance',
		'Taxes, reports, and audit trail synced': 'Impostos, relatórios e auditoria sincronizados',
		'Payout routes': 'Rotas de pagamento',
		'SWIFT, SEPA, cards, and crypto ready': 'SWIFT, SEPA, cartões e crypto prontos',
		'Identity connected': 'Identidade ligada',
		'SSO enabled for admins and teams': 'SSO ativo para admins e equipas',
		'Finance admin': 'Admin financeiro',
		'Full payroll access': 'Acesso completo a payroll',
		'EU contractor run': 'Pagamento a contratados da UE',
		'$42,000 needs regional approval': '$42,000 requer aprovação regional',
		'Global payroll report': 'Relatório global de payroll',
		'38 countries, 6 entities, 12 exceptions': '38 países, 6 entidades, 12 exceções',
		'Support desk': 'Mesa de suporte',
		'Payroll and compliance teams online': 'Equipas de payroll e compliance online',
		'Enterprise payroll workflow': 'Workflow de payroll para grandes empresas',
		'Global payroll operations board': 'Dashboard de operações globais de payroll',
		'4 steps active': '4 passos ativos',
		'Structure': 'Estrutura',
		'Entities and roles': 'Entidades e funções',
		'Automate': 'Automatizar',
		'API and rules': 'API e regras',
		'Pay': 'Pagar',
		'Global methods': 'Métodos globais',
		'Scale': 'Escalar',
		'Reports and cost': 'Relatórios e custo',
		'Team and payroll structure': 'Estrutura da equipa e payroll',
		'Configured': 'Configurado',
		'Entities': 'Ent.',
		'Teams': 'Equipas',
		'Workers': 'Trab.',
		'Payroll admin': 'Admin de payroll',
		'Finance HQ': 'Finanças HQ',
		'Regional approver': 'Aprovador regional',
		'EU entities': 'Ent. UE',
		'HR lead': 'Líder de RH',
		'Global team': 'Equipa global',
		'Payout rail': 'Rota de pagamento',
		'$1.84M ready': '$1.84M prontos',
		'Funding checked': 'Financiamento verificado',
		'38 countries': '38 países',
		'Automation and compliance': 'Automatização e compliance',
		'Live': 'Ativo',
		'Reporting and scale': 'Relatórios e escala',
		'Updated': 'Atualizado',
		'Payroll cost': 'Custo de payroll',
		'Exceptions': 'Exc.',
		"Payroll operations don't stop when the office doors close. We have 24/7 support for all your payroll teams, finance departments, HR managers, contractors and employees wherever they are, any time of day":
			'As operações de payroll não param quando o escritório fecha. Oferecemos suporte 24/7 para as suas equipas de payroll, departamentos financeiros, gestores de RH, contratados e colaboradores, estejam onde estiverem e a qualquer hora',
		'Automate your payroll, taxes, reporting and compliance in all the countries you have operations in. Garna helps big teams to reduce the paperwork and keep everything audit-proof so you know you’re on the right side of the law':
			'Automatize payroll, impostos, relatórios e compliance em todos os países onde opera. A Garna ajuda equipas grandes a reduzir burocracia e manter dados prontos para auditoria, para que a empresa opere dentro das regras',
		'Send remunerations to all your teams and contractors globally using our platform built for big businesses. It has all the tools you need for mass payouts, multi-currency payroll, contractors and employee payments in 150+ countries. You can use bank transfers, SWIFT, SEPA, local bank transfers, PayPal, Payoneer, and crypto':
			'Envie pagamentos para equipas e contratados em todo o mundo através de uma plataforma criada para grandes empresas. Ela tem as ferramentas necessárias para pagamentos em massa, payroll multimoeda e pagamentos a contratados e colaboradores em mais de 150 países. Pode usar transferências bancárias, SWIFT, SEPA, transferências bancárias locais, PayPal, Payoneer e crypto',
		'Send remunerations to all your teams and contractors globally using our platform built for big businesses. It has all the tools you need for mass payouts, multi-currency payroll, contractors and employee payments in 150+ countries. You can use bank transfers, SWIFT, SEPA, PayPal, Payoneer, and crypto':
			'Envie pagamentos para equipas e contratados em todo o mundo através de uma plataforma criada para grandes empresas. Ela tem as ferramentas necessárias para pagamentos em massa, payroll multimoeda e pagamentos a contratados e colaboradores em mais de 150 países. Pode usar transferências bancárias, SWIFT, SEPA, PayPal, Payoneer e crypto',
		'Flexible payment options': 'Opções de pagamento flexíveis',
		'Pick the payment method that works best for your teams and structure and get everything sorted from one platform':
			'Escolha o método de pagamento que melhor funciona para as suas equipas e estrutura, e gira tudo a partir de uma única plataforma',
		'Global reach': 'Alcance global',
		'Pay your employees and contractors in 150+ countries without having to turn to different providers or separate systems':
			'Pague a colaboradores e contratados em mais de 150 países sem recorrer a vários fornecedores ou sistemas separados',
		'Early payout access': 'Acesso antecipado a pagamentos',
		'Give your teams faster payouts with our flexible funding and payment workflows':
			'Ofereça pagamentos mais rápidos às suas equipas com os nossos workflows flexíveis de financiamento e pagamento',
		'Single Sign-On (SSO)': 'Single Sign-On (SSO)',
		'Get secure access to Garna through your existing identity provider. This feature locks down security, makes user management and the login process for employees and admins easier':
			'Tenha acesso seguro à Garna através do seu fornecedor de identidade atual. Esta funcionalidade reforça a segurança e simplifica a gestão de utilizadores e o login para colaboradores e administradores',
		'Role-Based Permissions': 'Permissões baseadas em funções',
		'Give your finance, HR, operations, and leadership teams different levels of access based on their functions. This way every user only sees the data they need to see, while sensitive payroll information is kept safe':
			'Defina diferentes níveis de acesso para equipas de finanças, RH, operações e liderança de acordo com as suas funções. Assim, cada utilizador vê apenas os dados necessários, enquanto as informações sensíveis de payroll permanecem protegidas',
		'Payment Limits & Approval Controls': 'Limites de pagamento e controlos de aprovação',
		'Set payout limits for managers, teams, or departments to keep control over company finances. For anything above that, require additional approvals':
			'Defina limites de pagamento para gestores, equipas ou departamentos para manter controlo sobre as finanças da empresa. Para operações acima desses limites, pode exigir aprovações adicionais',
		'Control & Visibility': 'Controlo e visibilidade',
		'Track payroll status, payout timing, exceptions, approvals, and workforce costs in one place so finance and operations teams can understand what is happening across every country':
			'Acompanhe o estado do payroll, prazos de pagamento, exceções, aprovações e custos da força de trabalho num só lugar, para que as equipas de finanças e operações entendam o que acontece em cada país',
		'Garna Solutions for Enterprises': 'Soluções da Garna para grandes empresas',
		'Pay Global Contractors in 3 Clicks': 'Pague contratados globais em 3 cliques',
		"With Garna, you can cut administrative costs and manage contractor onboarding, invoicing, and compliance regulations. Get their pay out to them with ease, no matter where they're based or how many of them you have. API payments set up lets enterprises automate contractor payouts straight from their own system":
			'Com a Garna, pode reduzir custos administrativos e gerir onboarding de contratados, faturas e requisitos de compliance. Pague aos contratados com facilidade, independentemente de onde estejam ou de quantos sejam. A configuração de pagamentos via API permite que grandes empresas automatizem pagamentos a contratados diretamente a partir do seu próprio sistema',
		'Hire Employees Worldwide': 'Contrate colaboradores em todo o mundo',
		"No need to open up local offices in different countries just to get the right people on board. That's where the employer of record superstructure comes at hand. This lets you hire people across the world while all the usual employer duties get taken care of: payroll, compliance, taxes, and the local employment rules":
			'Não é necessário abrir escritórios locais em diferentes países apenas para contratar as pessoas certas. É aqui que o modelo employer of record ajuda: pode contratar pessoas em todo o mundo enquanto as responsabilidades habituais do empregador são tratadas, incluindo payroll, compliance, impostos e regras laborais locais',
		'Built for Global Teams and Complex Operations': 'Criado para equipas globais e operações complexas',
		"When you're running a global payroll operation, you need infrastructure that can match the complexity and scale of it. We'll explain it in one word - and in more detail":
			'Ao gerir uma operação global de payroll, precisa de infraestrutura capaz de acompanhar a sua complexidade e escala. Explicamos numa palavra — e em detalhe',
		'Consolidation': 'Consolidação',
		"There's no need for a group of separate payroll providers and disconnected regional systems. Swap them for a global payroll solution that is built for the biggest and most complex multinational businesses":
			'Não precisa de vários fornecedores de payroll nem de sistemas regionais desconectados. Substitua-os por uma solução global de payroll criada para as maiores e mais complexas empresas multinacionais',
		'Want to give your contractors and employees the payroll experience they deserve? Our white-label and embedded payroll solutions let you orchestrate the launching of a fully-branded payroll product or integrated payroll functionality directly into your own product (internal systems, SaaS platforms, finance tools, and marketplaces)':
			'Quer oferecer aos contratados e colaboradores a experiência de payroll que merecem? As nossas soluções white-label e embedded payroll permitem lançar um produto de payroll totalmente personalizado com a sua marca ou integrar funcionalidade de payroll diretamente no seu produto: sistemas internos, plataformas SaaS, ferramentas financeiras e marketplaces',
		'Scalability': 'Escalabilidade',
		"Pay hundreds of contractors and employees with a couple of clicks. Our solution is designed to handle high-volume payroll processing, multi-country payroll operations, and workforce growth, that's why it's flexible and adjusts to any minor changes in your business":
			'Pague a centenas de contratados e colaboradores em poucos cliques. A nossa solução foi criada para lidar com grandes volumes de payroll, operações em vários países e crescimento da força de trabalho, por isso é flexível e adapta-se às mudanças do negócio',
		'Safety': 'Segurança',
		'All the data is strongly protected with enterprise payroll security, SSO authentication, role-based access controls, payroll audit compliance, and secure global payroll operations':
			'Todos os dados são protegidos com segurança corporativa para payroll: autenticação SSO, controlos de acesso baseados em funções, preparação para auditorias e operações globais de payroll seguras',
		'Trusted by Growing Teams': 'Equipas em crescimento confiam em nós',
		'There is a simple explanation behind the reason why global businesses partner with Garna: our platform makes the processes easier, safer, and efficient. Here are the proofs':
			'Há uma explicação simples para as empresas globais escolherem a Garna: a nossa plataforma torna os processos mais simples, seguros e eficientes. Aqui estão as provas',
		'"Garna helped us consolidate payroll across six entities without forcing every region into the same rigid process. Finance finally has one source of truth for payroll cost, approvals, and reporting"':
			'"A Garna ajudou-nos a consolidar o payroll em seis entidades sem obrigar cada região a seguir o mesmo processo rígido. A equipa financeira finalmente tem uma única fonte de verdade para custos de payroll, aprovações e relatórios"',
		'"We needed payroll infrastructure that could support employees, contractors, and local requirements at the same time. Garna gave our operations team the control we were missing across countries"':
			'"Precisávamos de uma infraestrutura de payroll que pudesse suportar colaboradores, contratados e requisitos locais ao mesmo tempo. A Garna deu à nossa equipa de operações o controlo que nos faltava em diferentes países"',
		'"The biggest change was visibility. Our HR, finance, and compliance teams can now track payroll status, exceptions, and payout timing from one workflow instead of chasing regional providers"':
			'"A maior mudança foi a visibilidade. Agora as nossas equipas de RH, finanças e compliance conseguem acompanhar o estado do payroll, exceções e prazos de pagamento a partir de um único workflow, em vez de perseguirem fornecedores regionais"',
		'Global Payroll Is Easy When Made By Using Garna': 'O payroll global fica mais simples com a Garna',
		"Garna provides the global payroll infrastructure independently from the task вЂ” whether you're scaling into new markets, dealing with distributed teams, or replacing old, fragmented payroll systems, itвЂ™ll adjust to your needs seamlessly":
			'A Garna fornece infraestrutura global de payroll para diferentes necessidades: expansão para novos mercados, gestão de equipas distribuídas ou substituição de sistemas de payroll antigos e fragmentados. A plataforma adapta-se às suas necessidades com flexibilidade',
		'Try now': 'Experimentar agora',
	},
	bookingWidget: {
		...homePt.bookingWidget,
		title: 'Comece a sua jornada com a Garna',
		subtitle: 'Deixe os seus dados para reservar uma demo',
	},
};
