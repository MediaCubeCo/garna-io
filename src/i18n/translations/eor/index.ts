import { eorEn } from './en';
import { eorEs } from './es';
import { eorPt } from './pt';
import { eorRu } from './ru';
import { homeEn } from '../home/en';
import { homeEs } from '../home/es';
import { homePt } from '../home/pt';
import { homeRu } from '../home/ru';

const withHomeDashboardTranslations = <T extends Record<string, unknown>, U extends {
	dashboard: unknown;
	templates: unknown;
	transactions: unknown;
	footer: unknown;
}>(eor: T, home: U) => ({
	...eor,
	dashboard: home.dashboard,
	templates: home.templates,
	transactions: home.transactions,
	footer: home.footer,
});

export const eorTranslations = {
	en: withHomeDashboardTranslations(eorEn, homeEn),
	es: withHomeDashboardTranslations(eorEs, homeEs),
	pt: withHomeDashboardTranslations(eorPt, homePt),
	ru: withHomeDashboardTranslations(eorRu, homeRu),
};
