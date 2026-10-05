import { payrollSolutionNewTranslations } from '../payroll-solution-new';
import { taxCalculatorEn } from './en';
import { taxCalculatorEs } from './es';
import { taxCalculatorPt } from './pt';
import { taxCalculatorRu } from './ru';

export const taxCalculatorTranslations = {
	en: { ...taxCalculatorEn, bookingWidget: payrollSolutionNewTranslations.en.bookingWidget },
	es: { ...taxCalculatorEs, bookingWidget: payrollSolutionNewTranslations.es.bookingWidget },
	pt: { ...taxCalculatorPt, bookingWidget: payrollSolutionNewTranslations.pt.bookingWidget },
	ru: { ...taxCalculatorRu, bookingWidget: payrollSolutionNewTranslations.ru.bookingWidget },
};
