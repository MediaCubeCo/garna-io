import { gamescom2026En } from './en';
import { gamescom2026Es } from './es';
import { gamescom2026Pt } from './pt';
import { gamescom2026Ru } from './ru';
import { homeTranslations } from '../home';

export const gamescom2026Translations = {
	en: { ...gamescom2026En, bookingWidget: homeTranslations.en.bookingWidget },
	es: { ...gamescom2026Es, bookingWidget: homeTranslations.es.bookingWidget },
	pt: { ...gamescom2026Pt, bookingWidget: homeTranslations.pt.bookingWidget },
	ru: { ...gamescom2026Ru, bookingWidget: homeTranslations.ru.bookingWidget },
};
