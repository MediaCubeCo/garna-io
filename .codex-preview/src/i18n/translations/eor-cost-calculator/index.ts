import { payrollSolutionNewTranslations } from '../payroll-solution-new';
import { eorCostCalculatorEn } from './en';
import { eorCostCalculatorEs } from './es';
import { eorCostCalculatorPt } from './pt';
import { eorCostCalculatorRu } from './ru';

export const eorCostCalculatorTranslations = {
	en: { ...eorCostCalculatorEn, bookingWidget: payrollSolutionNewTranslations.en.bookingWidget },
	es: { ...eorCostCalculatorEs, bookingWidget: payrollSolutionNewTranslations.es.bookingWidget },
	pt: { ...eorCostCalculatorPt, bookingWidget: payrollSolutionNewTranslations.pt.bookingWidget },
	ru: { ...eorCostCalculatorRu, bookingWidget: payrollSolutionNewTranslations.ru.bookingWidget },
};
