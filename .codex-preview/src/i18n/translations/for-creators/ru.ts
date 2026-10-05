import { homeRu } from '../home/ru';

export const forCreatorsRu = {
	meta: {
		title: 'Garna для креаторов',
		description:
			'Получайте выплаты с платформ для креаторов, Marketplace, freelance-сервисов и платформ цифровых продуктов через один аккаунт Garna.',
	},
	images: {},
	legacy: {
		visual: {
			newBadge: 'НОВОЕ',
			verifyCompliance: '// 1. Verify compliance',
			notCompliant: "'Not compliant'",
			processPayout: '// 2. Process automated payout',
			payoutCreated: '200 OK - Payout Created',
		},
	},
	hero: {
		badge: 'Ранний доступ для выбранных креаторов',
		titleMain: 'Получайте выплаты со всех платформ для креаторов в одном месте',
		titleAccent: 'в одном месте',
		description:
			'Получайте доход с Marketplace, платформ и freelance-сервисов, а затем управляйте балансом и выводом средств с пошаговой настройкой',
		cta: 'Связаться с payout-менеджером',
		accountCta: 'Создать аккаунт Garna',
	},
	heroVisual: {
		sources: {
			envato: {
				label: 'Выплата Envato',
			},
			adobe: {
				label: 'Доход от ассетов',
			},
			patreon: {
				label: 'Выплата от подписчиков',
			},
		},
		balance: {
			label: 'Баланс креатора',
			account: 'Аккаунт',
		},
		destinations: {
			bank: {
				label: 'Банковский перевод',
				title: 'Alex Carter USD',
			},
			card: {
				label: 'Выплата на карту',
				title: 'Visa / Mastercard',
				meta: 'Карта оканчивается на 4482',
			},
			crypto: {
				label: 'Криптокошелек',
				title: 'USDT wallet',
				meta: 'TRC20 • подтверждено',
			},
		},
	},
	payoutDemo: {
		cursor: 'Креатор',
		tabs: {
			platform: {
				title: 'Выплата с платформы',
				subtitle: 'Доход креатора отправлен',
			},
			balance: {
				title: 'Баланс Garna',
				subtitle: 'Средства зачислены',
			},
			withdraw: {
				title: 'Вывод денег',
				subtitle: 'Выбор метода вывода',
			},
		},
		platform: {
			brand: 'marketplace',
			search: 'Поиск',
			unlimitedAccess: 'Безлимитный доступ',
			marketplaceHeading: 'Все типы ассетов для любого проекта',
			filters: {
				allItems: 'Все ассеты',
			},
			categories: {
				videoTemplates: 'Видеошаблоны',
				soundEffects: 'Звуковые эффекты',
				stockPhotos: 'Стоковые фото',
				royaltyFreeMusic: 'Музыка без роялти',
				graphicTemplates: 'Графические шаблоны',
				fonts: 'Шрифты',
				assets3d: '3D-ассеты',
				presentationTemplates: 'Шаблоны презентаций',
			},
			finance: {
				creatorStudio: 'Студия креатора',
				earningsWorkspace: 'Доходы',
				juneCycle: 'Июньский цикл',
				readyToTransfer: 'Готово к переводу',
				fromProducts: 'От 3 продуктов',
				checked: 'Проверено',
				sourcesVerified: 'Источники подтверждены',
				avgRating: 'Средний рейтинг',
				acrossPaidProducts: 'По платным продуктам',
			},
			products: {
				videoPack: 'Пак видеошаблонов',
				videoMeta: '42 продажи / рейтинг 4.9',
				musicBundle: 'Музыкальный бандл',
				musicMeta: '18 лицензий / в подборке',
				graphicSet: 'Набор мокапов',
				graphicMeta: '24 продажи / в тренде',
			},
			destination: {
				title: 'Выберите шаблон выплаты',
				garnaBank: 'Банковский счет Garna',
				debitCard: 'Дебетовая карта',
				noTemplate: 'Шаблон еще не выбран',
				templateSelected: 'Шаблон выплаты выбран',
				sendPayout: 'Отправить выплату',
			},
		},
		garna: {
			nav: {
				balance: 'Баланс',
				notifications: 'Уведомления',
				support: 'Поддержка',
			},
			balanceTitle: 'Баланс',
			internalAccountUsd: 'Внутренний счет USD',
			accountNumber: 'Номер счета',
			actions: {
				send: 'Отправить',
				withdraw: 'Вывести',
				addFunds: 'Пополнить',
			},
			templates: {
				title: 'Шаблоны',
				all: 'Все',
				usdCard: 'USD карта',
				eurAccount: 'EUR счет',
			},
			transactions: {
				title: 'Транзакции',
				marketplaceTitle: 'Выплата дохода с Marketplace',
				marketplaceSubtitle: 'Зачислено с платформы креаторов',
				danielTitle: 'Перевод от Daniel Cruz',
				collaborationPayment: 'Оплата за коллаборацию',
				usdCardTitle: 'Перевод на USD карту',
				confirmed: 'Подтверждено',
			},
			modal: {
				date: '12 июня 2026 в 17:21',
				title: 'Выплата с Marketplace зачислена',
				transactionDetails: 'Детали транзакции',
				amountUsd: 'Сумма, USD',
				creditedAmount: 'Зачисленная сумма',
				gotIt: 'Понятно',
			},
		},
		withdraw: {
			modal: {
				title: 'Вывод денег',
				garnaInternalAccount: 'Внутренний счет Garna',
				toUsdCard: 'На USD карту',
				withdrawAll: 'Вывести все',
				enterAmount: 'Введите сумму - мы рассчитаем комиссию',
				debited: 'Спишется',
				sent: 'отправится',
				details: 'Детали',
				withdrawButton: 'Вывести',
			},
			success: {
				title: 'Перевод выполнен',
				copy: 'Деньги уже на счете получателя',
				close: 'Закрыть',
			},
		},
	},
	creatorTypes: {
		title: 'Для креаторов, которые зарабатывают по всему миру',
		description:
			'Garna помогает креаторам, фрилансерам и продавцам цифровых продуктов получать доход с международных платформ',
		cards: {
			designers: {
				title: 'Дизайнеры и иллюстраторы',
				description: 'Для креаторов, которые продают графику, шаблоны, шрифты, цифровые ассеты и визуальные продукты',
			},
			photographers: {
				title: 'Фотографы и авторы стокового контента',
				description: 'Для авторов, которые получают роялти или выплаты со стоковых фото- и медиаплатформ',
			},
			gameAssets: {
				title: '3D-художники и авторы игровых ассетов',
				description: 'Для креаторов, которые продают 3D-модели, плагины, текстуры, игровые ассеты и продукты для Marketplace',
			},
			freelancers: {
				title: 'Фрилансеры и digital-продавцы',
				description:
					'Для тех, кто зарабатывает на фриланс-платформах, подписках, курсах, музыке, контенте или цифровых продуктах',
			},
		},
	},
	accountFlow: {
		title: 'Один аккаунт для выплат креаторам',
		description:
			'Понятный путь: подключить выплаты с платформ, получить средства на баланс Garna и вывести их доступным способом',
		steps: {
			receive: {
				title: 'Получайте выплаты с платформ',
				description: 'Используйте реквизиты Garna там, где это поддерживается, чтобы принимать платежи с международных платформ для креаторов',
				footer: {
					platformPayout: 'Выплата с платформы',
					garnaDetails: 'Реквизиты Garna',
					balanceCredit: 'Зачисление на баланс',
				},
			},
			setup: {
				title: 'Пройдите настройку с сопровождением',
				description:
					'Расскажите, какой платформой пользуетесь. Мы проверим доступный способ выплат и проведем вас через настройку',
				footer: {
					platformRules: 'Правила платформы',
					payoutRoute: 'Маршрут выплаты',
					setupGuidance: 'Сопровождение настройки',
				},
			},
			withdraw: {
				title: 'Выводите средства глобально',
				description:
					'Выводите деньги банковским переводом, на карту, через PayPal, Payoneer, криптовалюту и другие доступные способы',
				footer: {
					chooseMethod: 'Выбрать способ',
					sendRequest: 'Отправить запрос',
					receiveFunds: 'Получить средства',
				},
			},
		},
	},
	process: {
		title: 'От выплаты с платформы до баланса Garna',
		description:
			'Схема простая, но настройка может отличаться в зависимости от платформы. Во время раннего доступа мы сопровождаем вас на важных этапах',
		visual: {
			account: {
				profile: 'Профиль',
				setup: 'Настройка',
				statusLabel: 'Статус аккаунта',
				statusValue: 'Открытие',
				emailConfirmed: 'Email подтвержден',
				kycReview: 'KYC на проверке',
				accountOpening: 'Аккаунт открывается',
				legalName: 'Юридическое имя',
				country: 'Страна',
				currency: 'Валюта',
			},
			chat: {
				managerOnline: 'Менеджер онлайн',
				messageIncome: 'Доход с Envato',
				messageCountry: 'Отправьте страну и валюту выплаты',
				messagePlatform: 'Португалия, USD. Еще использую Adobe Stock',
				messageCheck: 'Принято. Проверю доступный маршрут и правила инвойса',
				messageWithdrawal: 'Добавьте, пожалуйста, шаги для первого вывода',
				platformsLabel: 'Платформы',
				platformsValue: '2 добавлены',
				routeLabel: 'Проверка маршрута',
				routeValue: 'В процессе',
			},
			details: {
				title: 'Реквизиты Garna',
				routing: 'Routing',
				account: 'Аккаунт',
				method: 'Метод',
				beneficiary: 'Получатель',
				reference: 'Референс',
				envatoReady: 'Envato готова',
				adobeManual: 'Adobe Stock вручную',
				invoiceRequired: 'Нужен инвойс',
				routeStatus: 'Статус маршрута',
				checked: 'Проверено',
				useInPlatform: 'Использовать на платформе',
				readyToPaste: 'Готово к вставке',
				copyAction: 'Скопировать реквизиты',
			},
			withdraw: {
				title: 'Вывод с Envato',
				summary: 'Сводка выплаты',
				availableNow: 'Доступно сейчас',
				marketplaceFee: 'Комиссия Marketplace',
				paid: 'Оплачена',
				routeDetails: 'Детали маршрута',
				destination: 'Назначение',
				request: 'Запрос',
				prepared: 'Подготовлен',
				requestAction: 'Запросить выплату',
			},
			invoice: {
				title: 'Инвойс #2048',
				client: 'Клиент',
				amount: 'Сумма',
				status: 'Статус',
				matching: 'Сверка',
				reference: 'Референс',
				junePayout: 'Июньская выплата',
				proofAttached: 'Подтверждение выплаты приложено',
				screenshot: 'Скриншот',
				platformReport: 'Отчет платформы',
			},
			balance: {
				title: 'Баланс Garna',
				credited: 'Зачислено',
				incomingPayout: 'Входящая выплата',
				availableNow: 'Доступно сейчас',
				accountNumber: 'Номер аккаунта',
				bank: 'Банк',
				card: 'Карта',
				crypto: 'Крипто',
				withdrawAction: 'Вывести средства',
			},
		},
		steps: {
			account: {
				title: 'Создайте аккаунт Garna',
				description: 'Зарегистрируйтесь в Garna и пройдите проверку. KYC обычно занимает 1-2 рабочих дня',
			},
			platform: {
				title: 'Расскажите о своей платформе',
				description: 'Свяжитесь с payout-менеджером и расскажите, где вы получаете доход',
			},
			instructions: {
				title: 'Получите инструкции по настройке',
				description: 'Мы проверим доступный способ выплаты и дадим корректные реквизиты Garna или следующие шаги',
			},
			request: {
				title: 'Запросите выплату на платформе',
				description: 'Добавьте выданные реквизиты там, где это поддерживается, и запросите вывод с платформы',
			},
			invoice: {
				title: 'Создайте инвойс в Garna',
				description: 'Создайте инвойс и приложите нужное подтверждение: скриншот выплаты или документ платформы',
			},
			receive: {
				title: 'Получите и выведите средства',
				description:
					'Garna сверяет платеж с инвойсом, зачисляет средства на баланс, а вы выводите их удобным доступным способом',
			},
		},
	},
	earlyAccessFee: {
		title: 'Сниженная комиссия для\nкреаторов раннего доступа',
		description:
			'Мы запускаем выплаты креаторам в формате раннего доступа и вручную помогаем выбранным пользователям настроить первые платформы',
		cta: 'Связаться с payout-менеджером',
		standard: {
			label: 'Стандартная комиссия',
			caption:
				'Обычная сервисная комиссия Garna применяется после раннего доступа или для настроек выплат креаторам вне выбранной launch-группы.',
		},
		access: {
			label: 'Комиссия раннего доступа',
			caption:
				'Креаторы раннего доступа могут получить сниженную сервисную комиссию Garna 1.5% для первых выплат, пока мы помогаем проверить и донастроить процесс.',
			disclaimer:
				'Проценты выше относятся только к сервисной комиссии Garna. Комиссии платформ за вывод, комиссии способов оплаты, FX-расходы и другие сторонние комиссии могут отличаться и не включены.',
		},
		banner: {
			title: 'Сниженная комиссия для выплат креаторам',
			description:
				'Стандартная сервисная комиссия Garna применяется после раннего доступа или вне выбранной launch-группы',
			terms: 'Условия запуска',
			accessCaption:
				'Выбранные креаторы могут начать со сниженной сервисной комиссией Garna, пока мы помогаем проверить первую настройку выплат.',
			disclaimer: 'Только сервисная комиссия Garna. Комиссии платформ, способов оплаты и FX могут отличаться.',
			cta: 'Связаться с payout-менеджером',
		},
	},
	platforms: {
		title: 'Популярные платформы,\nс которыми мы можем помочь',
		description:
			'Мы начинаем с популярных платформ для креаторов, Marketplace и сервисов цифровых продуктов. Некоторые платформы можно настроить напрямую, а для других может понадобиться ручное сопровождение Garna или поддержка самой платформы',
	},
	globalInfrastructure: {
		title: 'Глобальная платежная инфраструктура для современных команд и креаторов',
		description:
			'Garna уже помогает компаниям и подрядчикам работать с международными выплатами. Теперь мы открываем ту же платежную инфраструктуру для креаторов, которые зарабатывают на глобальных платформах',
		cards: {
			platformPayouts: {
				title: 'Глобальные выплаты с платформ',
				description: 'Получайте доход креатора в разных странах, валютах и способах выплат',
			},
			currencyRoutes: {
				title: 'Маршруты выплат в разных валютах',
				description: 'Используйте нужную валюту и маршрут выплаты из одного аккаунта Garna',
			},
			setupSupport: {
				title: 'Поддержка настройки 24/7',
				description: 'Получайте помощь с реквизитами, инвойсами и следующими шагами',
			},
			complianceFlow: {
				metric: '1-2 дня',
				title: 'Выплаты с готовой проверкой',
				description: 'Держите в порядке верификацию, документы и сверку платежей',
			},
		},
	},
	managerSupport: {
		title: 'Нужна помощь с первой настройкой?',
		description:
			'Ваш payout-менеджер поможет понять, поддерживается ли ваша платформа, какой способ выплаты доступен и какие шаги нужно пройти',
		actions: {
			telegram: 'Написать в Telegram',
			email: 'Отправить email',
		},
		visual: {
			managerOnline: 'Payout-менеджер онлайн',
			messages: {
				income: 'Я получаю доход с Envato и Adobe Stock 👋',
				platformCountry: 'Алекс, отправьте платформу и страну выплаты. Я проверю, какие реквизиты Garna можно использовать',
				firstWithdrawal: 'Отлично, мне еще нужна помощь с первым выводом',
				ready: 'Готово. Правила платформы проверены, маршрут выплаты подготовлен, сверка инвойса включена ✅',
			},
			route: {
				title: 'Персональный менеджер',
				online: 'Онлайн во время настройки',
				channels: 'Telegram / Email',
			},
			dialog: {
				status: 'Менеджер онлайн',
				time: '2 мин',
				request: 'Мне нужна помощь с первой выплатой с платформы',
				reply: 'Отправьте платформу и страну. Я проверю шаги настройки для вас',
			},
			steps: {
				platformCheck: 'Проверка платформы',
				setupGuidance: 'Сопровождение настройки',
				payoutMethod: 'Способ выплаты',
				firstWithdrawal: 'Первый вывод',
			},
			panel: {
				manager: 'Персональный менеджер',
				title: 'Настройка первой выплаты',
				online: 'Онлайн',
				income: 'Я получаю доход с Envato и Adobe Stock',
				checkRules: 'Мы проверим правила платформы и отправим доступный маршрут выплаты',
			},
		},
	},
	creatorFaq: {
		title: 'Частые вопросы креаторов',
		subtitle: 'Несколько важных деталей перед первой настройкой выплат с Garna',
		items: {
			creatorPlatform: {
				question: 'Garna — это платформа для креаторов?',
				answer:
					'Нет. Garna не является Marketplace и не продает ваш контент. Garna помогает креаторам получать выплаты с международных платформ и выводить средства доступными способами',
			},
			availability: {
				question: 'Это доступно всем?',
				answer:
					'Выплаты креаторам сейчас доступны в формате раннего доступа. Мы начинаем с выбранных креаторов и платформ, чтобы убедиться, что каждая настройка работает корректно',
			},
			account: {
				question: 'Нужно ли создавать аккаунт Garna?',
				answer: 'Да. Аккаунт Garna нужен, чтобы пройти проверку, создавать инвойсы, получать средства и выводить баланс',
			},
			verification: {
				question: 'Сколько занимает проверка?',
				answer: 'KYC обычно занимает 1-2 рабочих дня в зависимости от документов и процесса проверки',
			},
			platformFunds: {
				question: 'Сколько занимает получение средств с платформы?',
				answer:
					'Это зависит от платформы и способа выплаты. Во многих случаях входящие средства могут поступать через 1-5 рабочих дней после отправки выплаты платформой',
			},
			withdrawal: {
				question: 'Сколько занимает вывод из Garna?',
				answer:
					'Срок вывода зависит от выбранного способа и направления. В качестве общего ориентира многие стандартные способы занимают 1-2 рабочих дня',
			},
			anyPlatform: {
				question: 'Можно ли использовать Garna с любой платформой?',
				answer:
					'Не всегда. У каждой платформы свои правила выплат и поддерживаемые способы. Во время настройки мы подтверждаем, можно ли обработать вашу платформу и какой процесс подходит',
			},
			fee: {
				question: 'Какая комиссия?',
				answer:
					'Стандартная сервисная комиссия Garna составляет 5.5%. Креаторы раннего доступа могут получить сниженную сервисную комиссию Garna 1.5% для первых выплат после финального подтверждения и настройки',
			},
		},
	},
	creatorFinalCta: {
		title: 'Начните получать выплаты креаторов с Garna',
		description:
			'Свяжитесь с payout-менеджером, чтобы проверить платформу и пройти настройку с сопровождением, или создайте аккаунт Garna, когда будете готовы продолжить',
		contact: 'Связаться с payout-менеджером',
		account: 'Создать аккаунт Garna',
	},
	sectionHeadings: {
		hireEmployeesWorldwide: 'Осуществляйте официальное трудоустройство с дополнительными преимуществами',
		embeddedPayrollInfrastructure: 'Решение по назначению официального подрядчика для вашего бизнеса',
	},
	sectionDescriptions: {
		hireEmployeesWorldwide:
			'Упростите процесс найма сотрудников и фрилансеров с помощью Garna. В отличие от других компаний, мы возьмем на себя не только финансовые, но и юридические вопросы, пока вы будете искать подходящих специалистов',
		embeddedPayrollInfrastructure:
			'Расширьте деятельность вашей подрядной организации на международный уровень. Используйте Garna в качестве поставщика бэкэнд-услуг: интегрируйте функции управления подрядчиками и расчетов в свой продукт или запустите полноценные услуги по оплате труда под собственным брендом',
	},
	faq: {
		title: 'Часто задаваемые вопросы о решениях для оплаты труда',
		items: {
			q1: {
				question: 'Как быстро я смогу начать пользоваться Garna?',
				answer:
					'В среднем время от регистрации до первого найма или выплаты вознаграждения подрядчику составляет менее 10 минут. Вы можете создать аккаунт, подтвердить его и сразу же начать им пользоваться. Наша команда оперативно рассматривает заявки и предоставляет доступ к одному из лучших онлайн-сервисов по расчету заработной платы и решений по управлению подрядчиками. На данный момент мы предоставляем услуги по оплате труда, что позволяет вам сотрудничать как с штатными сотрудниками, так и с подрядчиками.',
			},
			q2: {
				question: 'Могу ли я брендировать панель управления подрядчиками под логотипом своей компании?',
				answer:
					'Конечно! Наше решение White Label позволяет полностью настроить интерфейс не только для ваших внутренних подрядчиков, но и для ваших клиентов.',
			},
			q3: {
				question: 'Какие способы оплаты поддерживает Garna?',
				answer:
					'Мы поддерживаем банковские переводы (SWIFT, SEPA, банковские переводы в национальной валюте), оплату на карты в национальной валюте, PayPal, Payoneer, а также оплату в криптовалюте (USDT/USDC).',
			},
			q4: {
				question: 'Как компания Garna решает вопросы налогообложения и соблюдения нормативных требований на международном уровне?',
				answer:
					'Вам не придется беспокоиться о бюрократических проволочках. При использовании нашего решения по официальному трудоустройству мы берем на себя все вопросы, связанные с уплатой местных налогов, отчислений в социальные фонды, страхованием и соблюдением нормативных требований. При использовании нашего решения для официальных подрядчиков компания Garna гарантирует предотвращение риска неправильной классификации работников. Как ваш официальный агент по найму персонала, мы берем на себя всю ответственность за подбор сотрудников, чтобы вы могли сосредоточиться на развитии своей компании.',
			},
			q5: {
				question: 'Могу ли я интегрировать API Garna в свою платформу?',
				answer: 'Да. С помощью нашего API вы можете автоматизировать выплаты подрядчикам прямо в вашем продукте.',
			},
			q6: {
				question: 'Какие валюты поддерживаются для выплат?',
				answer:
					'Мы поддерживаем более 80 национальных валют, включая доллар США, евро и фунт стерлингов. В Garna мы считаем, что компании должны получать самые выгодные курсы обмена валют без наценок.',
			},
			q7: {
				question: 'Как Garna управляет подрядчиками?',
				answer:
					'Garna автоматизирует весь процесс — от регистрации новых клиентов и проверки соответствия нормативным требованиям до мгновенного формирования счетов. Вы оплачиваете один сводный счет, а мы распределяем средства между подрядчиками в соответствии с их предпочтениями относительно способа оплаты и валюты. Garna берет на себя риск неправильной классификации и обеспечивает соблюдение местных нормативных требований.',
			},
			q8: {
				question: 'Надежно ли хранятся мои данные в Garna?',
				answer:
					'Конечно. Являясь одним из ведущих мировых поставщиков услуг по оплате труда, компания Garna использует шифрование банковского уровня и строго соблюдает протоколы GDPR и стандарты безопасности финансовых данных. Кроме того, доступ к вашему личному аккаунту есть только у вас. Вы можете удалить свой личный аккаунт в любое время.',
			},
			q9: {
				question: 'Могу ли я использовать Garna, если у моей компании уже есть собственная панель управления?',
				answer: 'Да, мы можем интегрировать любой из наших инструментов в ваши рабочие процессы.',
			},
			q10: {
				question: 'Оказываете ли вы поддержку по вопросам расчета заработной платы в разных странах?',
				answer:
					'Да, конечно. Наша служба поддержки работает круглосуточно и без выходных, чтобы ответить на любые ваши вопросы, касающиеся услуг, оплаты и т. д.',
			},
		},
	},
	finalCta: {
		title: 'Запустите глобальное программное обеспечение для оплаты труда автоматически уже сегодня',
		description: 'Выплачивайте зарплату своим сотрудникам в более чем 150 странах всего за несколько кликов. Никакой бюрократии, только быстрые выплаты',
		button: 'Заказать пробную версию',
	},
	sourceText: {
		'Book a demo': 'Заказать пробную версию',
		'Creator payouts are currently available in Early Access. We start with selected creators and platforms to make sure each setup works correctly':
			'Выплаты креаторам сейчас доступны в формате раннего доступа. Мы начинаем с выбранных креаторов и платформ, чтобы убедиться, что каждая настройка работает корректно',
		'The standard Garna service fee is 5.5%. Early Access creators can receive a reduced 1.5% Garna service fee for their first payouts, subject to final confirmation and setup details':
			'Стандартная сервисная комиссия Garna составляет 5.5%. Креаторы раннего доступа могут получить сниженную сервисную комиссию Garna 1.5% для первых выплат после финального подтверждения и настройки',
		'businesses using Garna': 'компаний используют Garna',
		'paid to specialists': 'выплачено специалистам',
		'talents already use Garna': 'специалистов уже используют Garna',
		'global payroll service availability': 'круглосуточная доступность выплат',
		'countries covered': 'стран',
		'Manage Global Payroll Effortlessly': 'Управляйте расчетом заработной платы по всему миру без лишних усилий',
		'One platform to run payroll for freelancers, remote employees, and full-time teams':
			'Единая платформа для выплат фрилансерам, удалённым сотрудникам и штатным командам',
		'Flexible Payout Methods': 'Гибкие способы выплат',
		'Pay teams by bank transfer, card, electronic wallet, or crypto':
			'Выплачивайте командам банковским переводом, на карту, электронный кошелёк или в криптовалюте',
		'We streamline payroll processing, offering flexible, reliable solutions for businesses of all sizes and industries':
			'Мы оптимизируем процесс оплаты труда, предлагая гибкие и надежные решения для компаний любого размера и из любых отраслей',
		'Automated Payroll Platform': 'Автоматизированная платформа выплат',
		'Automate global payout processes with a flexible, user-friendly platform':
			'Автоматизируйте глобальные процессы выплат с помощью гибкой и удобной платформы',
		'Business': 'Бизнес',
		'Web Designer': 'Web Designer',
		'Developer': 'Developer',
		'Ops Manager': 'Ops Manager',
		'Global Reach': 'Глобальный охват',
		'Pay in 150+ countries with local currencies and crypto': 'Платите в 150+ стран в локальных валютах и криптовалюте',
		'No hidden Fees': 'Без скрытых комиссий',
		'Transparent pricing, zero setup cost': 'Прозрачные цены, нулевая стоимость подключения',
		'Payment Information': 'Информация о платеже',
		'Recipient receives 100 $': 'Пользователь получает 100 $',
		'Exchange rate 1 € = 1.0591 $': 'Курс обмена 1 € = 1.0591 $',
		'Fees 0.00 €': 'Комиссия 0.00 €',
		'Hire Employees Worldwide': 'Осуществляйте официальное трудоустройство с дополнительными преимуществами',
		'Simplify the hiring process for employees and freelancers with Garna. Unlike other companies, we will resolve not only the financial, but also legal side while you are looking for the right specialists':
			'Упростите процесс найма сотрудников и фрилансеров с помощью Garna. В отличие от других компаний, мы возьмем на себя не только финансовые, но и юридические вопросы, пока вы будете искать подходящих специалистов',
		'Quick Global Employment': 'Быстрое глобальное трудоустройство',
		'Hire employees anywhere in the world without setting up local legal entities':
			'Нанимайте сотрудников в любой точке мира без необходимости создания местных юридических лиц',
		'Immigration Assistance': 'Помощь в вопросах иммиграции',
		'We help you not only find talent, but also apply for a visa and permanent residence support':
			'Мы помогаем вам не только найти талантливых специалистов, но и оформить визу и получить поддержку в вопросах получения постоянного вида на жительство',
		'Flexible Worksite Coverage': 'Гибкое страховое покрытие для рабочих мест',
		'Hire for offices, retail, factories, or remote teams: wherever your business operates':
			'оформляйте полисы для офисов, торговых точек, производственных предприятий или удаленных команд — везде, где работает ваша компания',
		'24/7 Support': 'Круглосуточная поддержка',
		'Our support team is available 24/7 to resolve any issue in just a few minutes':
			'Есть вопросы? Наша служба поддержки работает круглосуточно и без выходных, чтобы решить любую проблему всего за несколько минут',
		'Seamless Integration': 'Гладкая интеграция',
		'Garna integrates seamlessly with your existing HR processes and accounting payroll software':
			'Garna легко интегрируется с вашими существующими кадровыми процессами и программами оплаты труда',
		'Employee Benefits': 'Льготы для сотрудников',
		'A user-friendly personal dashboard for every team member: access to payslips, vacation management, and expense tracking in real time':
			'удобная личная панель управления для каждого члена команды, обеспечивающая доступ к расчетным листам, управлению отпусками и отслеживанию расходов в режиме реального времени',
		'Simplify Global Contractor Payments': 'Упростите управление подрядчиками по всему миру и процесс расчетов с ними',
		'Centralize invoices, approvals, and payments in one place. Manage and pay freelancers worldwide in their preferred method and currency without unnecessary fees':
			'Управляйте счетами, утверждениями и платежами в одной системе. Управляйте работой фрилансеров по всему миру и выплачивайте им гонорары удобным способом и в выбранной ими валюте без лишних комиссий',
		'Multiple payout methods': 'Несколько способов выплаты',
		'Contractors receive payouts via bank transfers in 80+ currencies, cards, wallets, or cryptocurrencies':
			'Подрядчики получают выплаты банковскими переводами в 80+ валютах, на карты, кошельки или криптовалютой',
		'Bank transfer': 'Банковский перевод',
		'Transfer to a card': 'Перевод на карту',
		'Electronic wallets': 'Электронные кошельки',
		'Cryptocurrencies': 'Криптовалюты',
		'Mobile first experience': 'Мобильное приложение',
		'Get notified when your payout is credited and manage balances and payouts in one app':
			'Получайте уведомления о зачислении и управляйте балансами и выплатами в одном приложении',
		'Payout credited': 'Выплата зачислена',
		'Your January payout has been credited to your balance': 'Ваш январский платеж зачислен на баланс',
		'Early payout access': 'Доступ к досрочной выплате',
		'Request early access to earned payouts through a simple and transparent approval flow':
			'Запросите доступ к заработанным средствам раньше срока в несколько простых шагов',
		'Effective Payroll For Your Team Starts Here': 'Эффективная оплата труда вашей команды начинается здесь',
		'Make payments to the contractor when you need to (without any hassle, delays, or additional fees) using CSV mass payments or stand alone transfers. Pay international contractors in just a few clicks or set up full automation':
			'Осуществляйте платежи подрядчикам в любое удобное для вас время (без лишних хлопот, задержек и дополнительных комиссий) с помощью массовых платежей по файлу CSV или отдельных переводов. Оплачивайте услуги международных подрядчиков всего в несколько кликов или настройте полную автоматизацию',
		'Balance': 'Баланс',
		'Notifications': 'Уведомления',
		'Support': 'Поддержка',
		'Send': 'Отправить',
		'Withdraw': 'Вывести',
		'Add funds': 'Пополнить',
		'Details': 'Детали',
		'Transactions': 'Транзакции',
		'$ 1,000,000.00 available for team payouts': '$ 1,000,000.00 доступно для выплат команде',
		'Pay your contractors now — repay later with flexible terms': 'Платите подрядчикам сейчас, а возвращайте позже на гибких условиях',
		'Request': 'Запросить',
		'Pay contractors now, settle later': 'Платите подрядчикам сейчас, рассчитывайтесь позже',
		'Execute global payouts immediately and repay Garna on a schedule that suits your business cash flow':
			'Выполняйте глобальные выплаты сразу и возвращайте средства Garna по графику, который подходит денежному потоку вашего бизнеса',
		'Immediate payouts, deferred settlement': 'Мгновенные выплаты, отложенный расчет',
		'Flexible terms: 30, 60, or 90 days': 'Гибкие сроки: 30, 60 или 90 дней',
		'Facility limits from $50K to one million': 'Лимиты от $50K до одного миллиона',
		'Instant allocation &amp; processing': 'Мгновенное распределение и обработка',
		'Embedded Payroll Infrastructure': 'Решение по назначению официального подрядчика для вашего бизнеса',
		'Use Garna as your backend provider: integrate contractor management and payments into your product or launch full-fledged payroll services under your own brand':
			'Расширьте деятельность вашей подрядной организации на международный уровень. Используйте Garna в качестве поставщика бэкэнд-услуг: интегрируйте функции управления подрядчиками и расчетов в свой продукт или запустите полноценные услуги по оплате труда под собственным брендом',
		'API contractor management and payments': 'Управление подрядчиками и расчеты через API',
		'Integrate global contractor payments directly into your platform':
			'Интегрируйте платежи международным подрядчикам прямо в вашу платформу',
		'White-label contractor dashboard and payments': 'Панель управления подрядчиком и платежи в рамках модели White Label',
		'Launch professional payment software under your own brand':
			'Запустите профессиональное программное обеспечение для оплаты под своим собственным брендом',
		'Learn more': 'Узнать больше',
		'From quick registration and talent’s search to your first payout. Everything is clear and completely under your control in a few simple steps':
			'От быстрой регистрации и поиска талантов до вашей первой выплаты. Все прозрачно и полностью под вашим контролем — всего в несколько простых шагов',
		'Set up your company profile': 'Создайте профиль своей компании',
		'Add your team': 'Добавьте свою команду',
		'Fund your account': 'Пополните счет',
		'Send payout': 'Отправляйте выплаты',
		'Set up your company account': 'Создайте аккаунт своей компании',
		'Make a quick profile check and verification, fill in the required fields and get started':
			'Пройдите быструю проверку профиля, заполните обязательные поля и получите доступ к сервису',
		'Assign a financial contact person': 'Назначьте ответственное лицо по финансовым вопросам',
		'SSpecify the person who will be responsible for financial matters':
			'Укажите лицо, которое будет отвечать за финансовые вопросы',
		'Create your first EoR contract': 'Составьте свой первый договор о предоставлении услуг официального работодателя',
		"Enter the employee's details":
			'Введите данные сотрудника',
		'Invite an employee': 'Пригласите сотрудника',
		'Send an invitation and onboard your employee': 'После отправки запроса в личном кабинете сотрудник получает личное приглашение по электронной почте и создает аккаунт в Garna для получения выплат',
		'Fund your wallet and run first payroll': 'Пополните свой кошелек и проведите первую оплату труда',
		'Top up your balance and start paying globally':
			'Вы можете сделать это любым удобным для вас способом: от SWIFT и SEPA до PayPal и криптовалюты. Начните выплачивать зарплату уже сегодня',
		'Why Companies Choose Garna': 'Почему Garna — лучший выбор для управления оплатой труда и подрядчиками по всему миру',
		'Why Garna? There are plenty of benefits we offer while handling every payment process on time and accurately':
			'Почему Garna? Мы предлагаем множество преимуществ, своевременно и точно обрабатывая каждый платеж',
		'Cut Admin Work by 70%': 'Сократите административную нагрузку на 70%',
		'Our contract and payment automation frees your HR and finance department from routine tasks':
			'Наша система автоматизации заключения договоров и расчетов освобождает ваши отделы кадров и финансов от рутинных задач',
		'Flawless Reporting and Analytics': 'Безупречная отчетность и аналитика',
		'All invoices, transactions, and tax reports are gathered in one place':
			'Все инвойсы, транзакции и налоговые отчеты собраны в одном месте',
		'100% Intellectual Property Protection': 'Стопроцентная защита интеллектуальной собственности',
		'Scale with the API': 'Масштабируйте с помощью API',
		'Integrate bulk payments directly into your internal systems and automate workflows programmatically':
			'Интегрируйте массовые платежи непосредственно в ваши внутренние системы и автоматизируйте рабочие процессы с помощью программного обеспечения',
		'100% compliance with the laws': 'Стопроцентное соблюдение законодательства',
		'Automated payments': 'Автоматические платежи',
		'Shared dashboard': 'Общая панель управления',
		'Garna Payroll vs Other Payroll': 'Garna и другие системы оплаты труда',
		'Everything is relative, right? Take a look at the comparison table, we believe our transparency speaks louder than words. We offer, and we offer a lot, because we want to be the best':
			'Все относительно, верно? Взгляните на сравнительную таблицу — мы уверены, что факты говорят громче слов',
		'Feature': 'Функция',
		'Other Payroll': 'Другая система',
		'Garna Payroll': 'Garna',
		'Geography': 'География',
		'Limited to few countries': 'Ограничена несколькими странами',
		'150+ countries': 'Более 150 стран',
		'Tax compliance': 'Соблюдение налогового законодательства',
		'Manual / regional expertise needed': 'Вручную / требуется региональная экспертиза',
		'Automated &amp; compliant': 'Автоматизировано и соответствует требованиям',
		'Payout speed': 'Скорость выплат',
		'Up to a Few Days': 'До нескольких дней',
		'Few Minutes': 'Несколько минут',
		'Integration': 'Интеграция',
		'Hard or custom-built': 'Сложная или индивидуальная',
		'API ready / White label': 'Поддержка API / White Label',
		'Fragmented tools': 'Разрозненные инструменты',
		'Unified dashboard for contractors and employees management': 'Единая панель управления для управления подрядчиками и сотрудниками',
		'Standard business hours': 'Обычные рабочие часы',
		'24/7 global support': 'Круглосуточная поддержка по всему миру',
		'Funding options': 'Варианты финансирования',
		'Bank and SWIFT only': 'Только банковские и SWIFT-переводы',
		'Bank transfers in USD and local currencies, SWIFT, SEPA, Crypto, PayPal, Payoneer':
			'Банковские переводы в долларах США и национальных валютах, SWIFT, SEPA, криптовалюта, PayPal, Payoneer',
		'Contractor management': 'Управление подрядчиками',
		'Limited': 'Ограниченное',
		'Integrated': 'Интегрированное',
		'Reporting': 'Отчетность',
		'Manual &amp; slow': 'Ручная и медленная',
		'Real-time, exportable': 'В режиме реального времени, с возможностью экспорта',
		'Trusted by Those Who Build the Future': 'Нам доверяют те, кто строит будущее',
		'Find out why large companies and middle-sized businesses are switching to Garna. We set the standard for international payroll, trusted by professionals in over 150 countries':
			'Узнайте, почему крупные компании и компании среднего размера переходят на Garna',
		'Start Paying Globally': 'Создайте международную систему оплаты труда и подключите услугу по назначению официального подрядчика или официального работодателя',
		'Complete a quick verification process and gain access to a full-featured payroll software solution':
			'Пройдите быструю процедуру верификации и получите доступ к полнофункциональному программному решению для оплаты труда',
		'Import data for employees and international contractors':
			'Импортируйте данные о сотрудниках и международных подрядчиках',
		'Fund your account at Garna via SWIFT, SEPA, bank transfer in local currencies, PayPal, or use crypto assets for instant deposits':
			'Пополните свой счет в Garna через SWIFT, SEPA, банковский перевод в местной валюте, PayPal или воспользуйтесь криптовалютой для мгновенного пополнения счета',
		'Pay recipients in 150+ countries with full compliance':
			'Оплачивайте получателям в более чем 150 странах с полным соблюдением требований',
		'Access to the best specialists in 150+ countries': 'Доступ к лучшим специалистам в более чем 150 странах',
		'Hunt the best specialists wherever they are without wasting time and money on registering legal entities':
			'Найдите лучших специалистов, где бы они ни находились, не тратя время и деньги на регистрацию юридических лиц',
		'24/7 support': 'Круглосуточная поддержка',
		'We provide quick solutions to any issues both for the company and for each employee around the clock':
			'Мы круглосуточно предоставляем оперативные решения любых вопросов как для компании, так и для каждого сотрудника',
		'We assume full responsibility for compliance with the labor code of each country, from taxes to social benefits. Our team is monitoring any legal changes':
			'Мы берем на себя полную ответственность за соблюдение трудового законодательства каждой страны',
		'Make payments in one click in any currency. The system calculates taxes and other contributions immediately':
			'Производите платежи в один клик в любой валюте',
		'Management of contracts, expenses, income, and vacations is available in one interface':
			'Управление контрактами, расходами, доходами и отпусками доступно в одном интерфейсе',
		'You can make payments via traditional banking or digital assets for maximum speed':
			'Вы можете осуществлять платежи как через традиционные банковские системы, так и с помощью цифровых активов для максимальной оперативности',
		'We legally guarantee that all work produced by your contractors belongs exclusively to you':
			'Мы юридически гарантируем, что все материалы, созданные вашими подрядчиками, принадлежат исключительно вам',
		'Flexible Funding: From Bank transfers to Crypto': 'Гибкие способы оплаты: от банковских переводов до криптовалюты',
		'Fund Wallet &amp; Run Payroll': 'Пополните кошелек и проведите оплату труда',
		'Top up with Bank transfer': 'Пополнить банковским переводом',
		'Top up with USDT': 'Пополнить через USDT',
		'Company Profile Verified': 'Профиль компании подтвержден',
		'Company name': 'Название компании',
		'Country of registration': 'Страна регистрации',
		'Date of registration': 'Дата регистрации',
		'Registration number': 'Регистрационный номер',
		'Internal account USD': 'Внутренний счет USD',
		'Company Profile': 'Профиль компании',
		'Email': 'Email',
		'Reason': 'Причина',
		'Approve': 'Одобрить',
		'Approve &amp; Pay': 'Одобрить и оплатить',
		'Decline': 'Отклонить',
		'Confirmed': 'Подтверждено',
		'Pending': 'В ожидании',
		'Active': 'Активно',
		'Ready': 'Готово',
		'ready': 'ready',
		'Pending Payouts': 'Ожидающие выплаты',
		'Payout Processed': 'Выплата обработана',
		'Payout Volume': 'Объем выплат',
		'Post-Payment Balance': 'Баланс после выплаты',
		'Available Limit': 'Доступный лимит',
		'Amount requested': 'Запрошенная сумма',
		'Outstanding': 'Задолженность',
		'Revolving Facility': 'Возобновляемый лимит',
		'Utilization 12.4%': 'Использование 12,4%',
		'Vendor payout': 'Выплата поставщику',
		'Engineering Team': 'Инженерная команда',
		'just now': 'только что',
		'Just now': 'Только что',
		'Paid': 'Оплачено',
		'Recipient receives': 'Пользователь получает',
		'Exchange rate': 'Курс обмена',
		'Fees': 'Комиссии',
		'Amount': 'Сумма',
		'amount': 'amount',
		'Payout': 'Выплата',
		'payout': 'payout',
		'payouts': 'payouts',
		'currency': 'currency',
		'status': 'status',
		'Status': 'Статус',
		'from': 'from',
		'From': 'From',
		'create': 'create',
		'verify': 'verify',
		'await': 'ожидать',
		'new': 'новое',
		'All': 'Все',
		'Next': 'Далее',
		'Templates': 'Шаблоны',
		'Onboarding': 'Онбординг',
		'Onboarding Checklist': 'Чек-лист онбординга',
		'Employee Onboarded': 'Сотрудник подключен',
		'EoR Contract Signed': 'EoR-контракт подписан',
		'First Payroll Estimate': 'Первый расчет payroll',
		'Employee Gross Salary': 'Валовая зарплата сотрудника',
		'Employment Country': 'Страна трудоустройства',
		'Employee': 'Сотрудник',
		'Sign up in Garna': 'Зарегистрироваться в Garna',
		'Contractor Batch': 'Пакет подрядчиков',
		'18 records': '18 записей',
		'Contractor of Record': 'Для официального подрядчика',
		'Employer of Record': 'Для официального работодателя',
		'Payroll API': 'Payroll API',
		'CSV payment': 'CSV-выплата',
		'Transaction by email': 'Транзакция по email',
		'Transfer to Maria Rei': 'Перевод Maria Rei',
		'Transfer to Vlad Kolomensky': 'Перевод Vlad Kolomensky',
		'Personal expenses': 'Личные расходы',
		'Full Stack Developer': 'Full Stack Developer',
		'Senior Software Engineer': 'Senior Software Engineer',
		'Senior UX Designer': 'Senior UX Designer',
		'Marketing Consultant': 'Marketing Consultant',
		'Mon': 'Пн',
		'Tue': 'Вт',
		'Wed': 'Ср',
		'Thu': 'Чт',
		'Fri': 'Пт',
		'Sat': 'Сб',
		'Sun': 'Вс',
		'Tuesday, January 10': 'Вторник, 10 января',
		'English': 'Английский',
		'Español': 'Испанский',
		'Português': 'Португальский',
		'Powered by Garna': 'На базе Garna',
		'Error': 'Error',
		'Not compliant': 'Not compliant',
		"'Not compliant'": "'Not compliant'",
		'Dashboard': 'Панель управления',
		'White Label dashboard and payments': 'Панель управления White Label и выплаты',
		'White Label contractor dashboard and payments': 'Панель управления White Label и выплаты для подрядчиков',
		'api.garna.com/v1': 'api.garna.com/v1',
		'garna.io/dashboard': 'garna.io/dashboard',
		'Account number': 'Номер счета',
		'Routing': 'Маршрутизация',
		'routing': 'routing',
		'Contractors': 'Подрядчики',
		'contractors': 'подрядчики',
		'Company': 'Компания',
		'Garna opened the US market for me. I can now accept payments from clients who only work with US entities and withdraw straight to my bank. Absolute game changer.':
			'Garna открыла для меня рынок США. Теперь я могу принимать платежи от клиентов, которые работают только с американскими юрлицами, и выводить прямо на банк. Полный прорыв.',
		'"Garna opened the US market for me. I can now accept payments from clients who only work with US entities and withdraw straight to my bank. Absolute game changer."':
			'"Garna открыла для меня рынок США. Теперь я могу принимать платежи от клиентов, которые работают только с американскими юрлицами, и выводить прямо на банк. Полный прорыв."',
		'Finally, a platform that doesn\'t make me feel like a second-class citizen. Getting paid is instant, and I can withdraw to my local bank without the usual headache.':
			'Наконец-то платформа, где я не чувствую себя человеком второго сорта. Выплаты мгновенные, и я могу выводить на свой банк без привычной головной боли.',
		'"Finally, a platform that doesn\'t make me feel like a second-class citizen. Getting paid is instant, and I can withdraw to my local bank without the usual headache."':
			'"Наконец-то платформа, где я не чувствую себя человеком второго сорта. Выплаты мгновенные, и я могу выводить на свой банк без привычной головной боли."',
		'Had an issue with my local tax authorities before started using Garna. Now I have all the tax documents in place.':
			'Раньше у меня были проблемы с местной налоговой, пока не начал использовать Garna. Теперь все налоговые документы в порядке.',
		'"Had an issue with my local tax authorities before started using Garna. Now I have all the tax documents in place."':
			'"Раньше у меня были проблемы с местной налоговой, пока не начал использовать Garna. Теперь все налоговые документы в порядке."',
	},
	footer: homeRu.footer,
	bookingWidget: homeRu.bookingWidget,
};
