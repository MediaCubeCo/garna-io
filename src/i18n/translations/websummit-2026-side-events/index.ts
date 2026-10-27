import { webSummit2026En } from './en';
import { webSummit2026Es } from './es';
import { webSummit2026Pt } from './pt';
import { webSummit2026Ru } from './ru';
import { homeTranslations } from '../home';

export const webSummit2026Translations = {
	en: { ...webSummit2026En, bookingWidget: homeTranslations.en.bookingWidget },
	es: { ...webSummit2026Es, bookingWidget: homeTranslations.es.bookingWidget },
	pt: { ...webSummit2026Pt, bookingWidget: homeTranslations.pt.bookingWidget },
	ru: { ...webSummit2026Ru, bookingWidget: homeTranslations.ru.bookingWidget },
};
