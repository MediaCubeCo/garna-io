import { homeTranslations } from './home';

// Страница /call: тексты тела - в astro/content/call/{en,ru}.html, здесь только заголовок и описание
// (для вкладки и превью ссылки), остальное - общие шапка и подвал с главной.
const meta = {
	en: {
		title: 'Call with Garna | Pick a time',
		description:
			'Pick a time for a short call with Garna. Slots in your time zone, the invite with a Google Meet link goes to your email.',
	},
	ru: {
		title: 'Звонок с Garna | Выберите время',
		description:
			'Выберите удобное время для короткого звонка с Garna. Время в вашем часовом поясе, приглашение со ссылкой на Google Meet придёт на почту.',
	},
};

export const callTranslations = {
	en: { ...homeTranslations.en, meta: meta.en },
	ru: { ...homeTranslations.ru, meta: meta.ru },
};
