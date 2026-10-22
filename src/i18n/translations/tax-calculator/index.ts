import { homeTranslations } from '../home';
import { taxCalculatorEn } from './en';
import { taxCalculatorEs } from './es';
import { taxCalculatorPt } from './pt';
import { taxCalculatorRu } from './ru';

export const taxCalculatorTranslations = {
	en: { ...taxCalculatorEn, bookingWidget: homeTranslations.en.bookingWidget },
	es: { ...taxCalculatorEs, bookingWidget: homeTranslations.es.bookingWidget },
	pt: { ...taxCalculatorPt, bookingWidget: homeTranslations.pt.bookingWidget },
	ru: { ...taxCalculatorRu, bookingWidget: homeTranslations.ru.bookingWidget },
};
