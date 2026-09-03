const blogContent = {
	blog: {
		hero: {
			title: 'Garna Insights Hub',
			description:
				'Dive into the world of expert insights on global hiring, payroll, and workforce management and stay one step ahead. Check out our practical guides, industry trends, and international employment updates',
		},
		categories: {
			all: 'All categories',
			payroll: 'Payroll',
			hr: 'HR',
			businessFinance: 'Business finance',
			tools: 'Tools',
		},
		cta: {
			title: 'Your Global Growth Starts Here',
			button: 'Book a Demo',
		},
	},
	// Aura exports keep much of the page as raw HTML. Future locale work can map exact
	// English source strings here without rebuilding the imported markup first.
	sourceText: {},
	sourceAttributes: {},
};

const rawBlogPageContent = {
	sourceText: {},
	sourceAttributes: {},
};

const blogArticleContent = {
	blogArticle: {
		hero: {
			category: 'payroll',
			date: 'October 24, 2023',
			readTime: '6 min read',
			title: 'Breaking Down Complexity in Life Science Web Applications',
			description:
				'Exploring architectural patterns and frontend strategies to build scalable, high-performance web tools for genomic data analysis and research collaboration',
			authorAlt: 'Dr. Emily Chen',
			authorName: 'Dr. Emily Chen',
			authorRole: 'Lead Software Architect',
			shareLabel: 'Share this article:',
		},
		faq: {
			title: 'Frequently Asked Questions',
			subtitle: "Can't find the answer you're looking for? Reach out to our team.",
			contactCta: 'Contact Team',
			items: {
				q1: {
					question: 'What are the main features of the platform?',
					answer:
						'Our platform offers advanced analytics, seamless integrations with your favorite tools, real-time collaboration features, and enterprise-grade security. Everything is designed to help your team work more efficiently and scale without friction.',
				},
				q2: {
					question: 'How does the pricing structure work?',
					answer:
						'We offer transparent, tiered pricing based on the number of active users and features required. There are no hidden fees, and you can switch plans or cancel at any time. Annual subscriptions come with a 20% discount.',
				},
				q3: {
					question: 'Is it easy to migrate from another provider?',
					answer:
						'Yes! We provide dedicated migration specialists for all new accounts. We support automated imports from major platforms, and our team will handle the heavy lifting to ensure your historical data is transferred accurately and securely.',
				},
				q4: {
					question: 'What level of support do you provide?',
					answer:
						'All plans include 24/7 email support and access to our comprehensive knowledge base. Pro and Enterprise plans include priority live chat, and Enterprise plans come with a dedicated Customer Success Manager and phone support.',
				},
			},
		},
	},
	...rawBlogPageContent,
};

const blogAuthorContent = {
	blogAuthor: {
		hero: {
			avatarAlt: 'Dr. Emily Chen',
			kicker: 'Author Profile',
			role: 'Lead Software Architect',
			name: 'Dr. Emily Chen',
			bio:
				'Exploring architectural patterns and frontend strategies to build scalable, high-performance web tools for genomic data analysis and research collaboration. Passionate about bridging the gap between life sciences and software engineering',
		},
	},
	...rawBlogPageContent,
};

export const blogTranslations = {
	en: {
		...blogContent,
		meta: {
			title: 'Global Hiring & Payroll Insights | Garna Blog',
			description:
				'Discover expert articles, practical guides, industry trends, and compliance updates on global employment. Hire, pay, and manage international teams with ease.',
		},
	},
	es: {
		...blogContent,
		meta: {
			title: 'Perspectivas sobre contratación global y nóminas | Blog de Garna',
			description:
				'Descubre artículos de expertos, guías prácticas, tendencias del sector y actualizaciones sobre cumplimiento normativo en el empleo internacional. Contrata, paga y gestiona equipos globales con facilidad.',
		},
	},
	pt: {
		...blogContent,
		meta: {
			title: 'Insights sobre Contratação Global e Payroll | Blog da Garna',
			description:
				'Descubra artigos especializados, guias práticos, tendências do setor e atualizações de conformidade sobre emprego global. Contrate, pague e gira equipas internacionais com facilidade.',
		},
	},
	ru: {
		...blogContent,
		meta: {
			title: 'Аналитика международного рекрутинга и Global Payroll | Блог Garna',
			description:
				'Откройте для себя экспертные статьи, практические руководства, отраслевые тенденции и обновления нормативных требований в сфере международного трудоустройства. Нанимайте, оплачивайте и управляйте международными командами с легкостью.',
		},
	},
};

export const blogAuthorTranslations = {
	en: {
		...blogAuthorContent,
		meta: {
			title: 'Global Hiring & Payroll Insights | Garna Blog',
			description:
				'Discover expert articles, practical guides, industry trends, and compliance updates on global employment. Hire, pay, and manage international teams with ease.',
		},
	},
	es: {
		...blogAuthorContent,
		meta: {
			title: 'Perspectivas sobre contratación global y nóminas | Blog de Garna',
			description:
				'Descubre artículos de expertos, guías prácticas, tendencias del sector y actualizaciones sobre cumplimiento normativo en el empleo internacional. Contrata, paga y gestiona equipos globales con facilidad.',
		},
	},
	pt: {
		...blogAuthorContent,
		meta: {
			title: 'Insights sobre Contratação Global e Payroll | Blog da Garna',
			description:
				'Descubra artigos especializados, guias práticos, tendências do setor e atualizações de conformidade sobre emprego global. Contrate, pague e gira equipas internacionais com facilidade.',
		},
	},
	ru: {
		...blogAuthorContent,
		meta: {
			title: 'Аналитика международного рекрутинга и Global Payroll | Блог Garna',
			description:
				'Откройте для себя экспертные статьи, практические руководства, отраслевые тенденции и обновления нормативных требований в сфере международного трудоустройства. Нанимайте, оплачивайте и управляйте международными командами с легкостью.',
		},
	},
};

export const blogArticleTranslations = {
	en: {
		...blogArticleContent,
		meta: {
			title: 'Global Hiring & Payroll Insights | Garna Blog',
			description:
				'Discover expert articles, practical guides, industry trends, and compliance updates on global employment. Hire, pay, and manage international teams with ease.',
		},
	},
	es: {
		...blogArticleContent,
		meta: {
			title: 'Perspectivas sobre contratación global y nóminas | Blog de Garna',
			description:
				'Descubre artículos de expertos, guías prácticas, tendencias del sector y actualizaciones sobre cumplimiento normativo en el empleo internacional. Contrata, paga y gestiona equipos globales con facilidad.',
		},
	},
	pt: {
		...blogArticleContent,
		meta: {
			title: 'Insights sobre Contratação Global e Payroll | Blog da Garna',
			description:
				'Descubra artigos especializados, guias práticos, tendências do setor e atualizações de conformidade sobre emprego global. Contrate, pague e gira equipas internacionais com facilidade.',
		},
	},
	ru: {
		...blogArticleContent,
		meta: {
			title: 'Аналитика международного рекрутинга и Global Payroll | Блог Garna',
			description:
				'Откройте для себя экспертные статьи, практические руководства, отраслевые тенденции и обновления нормативных требований в сфере международного трудоустройства. Нанимайте, оплачивайте и управляйте международными командами с легкостью.',
		},
	},
};
