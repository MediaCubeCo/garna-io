import { homeTranslations } from '../home';
import { eorCostCalculatorEn } from './en';
import { eorCostCalculatorEs } from './es';
import { eorCostCalculatorPt } from './pt';
import { eorCostCalculatorRu } from './ru';

export const eorCostCalculatorTranslations = {
	en: { ...eorCostCalculatorEn, bookingWidget: homeTranslations.en.bookingWidget },
	es: { ...eorCostCalculatorEs, bookingWidget: homeTranslations.es.bookingWidget },
	pt: { ...eorCostCalculatorPt, bookingWidget: homeTranslations.pt.bookingWidget },
	ru: { ...eorCostCalculatorRu, bookingWidget: homeTranslations.ru.bookingWidget },
};
