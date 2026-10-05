export type EorCostCountry = {
	name: string;
	code: string;
	rate: number;
	fixed: number;
};

const rows: Array<[string, string, number, number]> = [
	['Albania', 'AL', 0.173, 0], ['Argentina', 'AR', 0.36083, 3], ['Armenia', 'AM', 0.006, 0], ['Australia', 'AU', 0.17663, 0],
	['Austria', 'AT', 0.3037, 3350], ['Azerbaijan', 'AZ', 0.16718, 0], ['Bahrain', 'BH', 0.01307, 318], ['Bangladesh', 'BD', 0.0893, 0],
	['Belarus', 'BY', 0.352, 0], ['Belgium', 'BE', 0.4378, 653], ['Belize', 'BZ', 0.00095, 0], ['Bolivia', 'BO', 0.1781, 646],
	['Bosnia and Herzegovina', 'BA', 0.071, 0], ['Brazil', 'BR', 0.46973, 2403], ['Bulgaria', 'BG', 0.1962, 108], ['Cambodia', 'KH', 0.06, 51],
	['Cameroon', 'CM', 0.1605, 87], ['Canada', 'CA', 0.102, 0], ['Chile', 'CL', 0.0642, 2681], ['China', 'CN', 0.33544, 0],
	['Colombia', 'CO', 0.05224, 512], ['Costa Rica', 'CR', 0.29473, 2502], ["Cote D'Ivoire", 'CI', 0.28983, 10], ['Croatia', 'HR', 0.171, 0],
	['Cyprus', 'CY', 0.16, 0], ['Czech Republic', 'CZ', 0.3436, 223], ['Denmark', 'DK', 0.1395, 1620], ['Dominican Republic', 'DO', 0.1694, 0],
	['Ecuador', 'EC', 0.2108, 0], ['Egypt', 'EG', 0.1935, 109], ['El Salvador', 'SV', 0.1785, 600], ['Estonia', 'EE', 0.344, 182],
	['Ethiopia', 'ET', 0.116, 0], ['Finland', 'FI', 0.20282, 41], ['France', 'FR', 0.49525, 1240], ['Georgia', 'GE', 0.026, 0],
	['Germany', 'DE', 0.2171, 0], ['Ghana', 'GH', 0.135, 0], ['Greece', 'GR', 0.2174, 383], ['Guatemala', 'GT', 0.3826, 551],
	['Honduras', 'HN', 0.158, 0], ['Hong Kong', 'HK', 0.05177, 0], ['Hungary', 'HU', 0.136, 649], ['Iceland', 'IS', 0.22857, 0],
	['India', 'IN', 0.00633, 10], ['Indonesia', 'ID', 0.19413, 0], ['Ireland', 'IE', 0.1185, 0], ['Israel', 'IL', 0.17582, 1952],
	['Italy', 'IT', 0.3742, 183], ['Jamaica', 'JM', 0.13098, 0], ['Japan', 'JP', 0.17112, 0], ['Jordan', 'JO', 0.1485, 0],
	['Kazakhstan', 'KZ', 0.16943, 0], ['Kenya', 'KE', 0.0841, 5], ['Kosovo', 'XK', 0.056, 0], ['Latvia', 'LV', 0.2419, 5],
	['Lithuania', 'LT', 0.0237, 0], ['Luxembourg', 'LU', 0.1304, 0], ['Macao', 'MO', 0.006, 460], ['Madagascar', 'MG', 0.196, 0],
	['Malaysia', 'MY', 0.03647, 2], ['Malta', 'MT', 0.109, 584], ['Mauritius', 'MU', 0.23433, 0], ['Mexico', 'MX', 0.11968, 492],
	['Moldova, Republic of', 'MD', 0.246, 0], ['Mongolia', 'MN', 0.131, 0], ['Montenegro', 'ME', 0.1657, 0], ['Morocco', 'MA', 0.2194, 0],
	['Mozambique', 'MZ', 0.05, 0], ['Namibia', 'NA', 0.035, 0], ['Nepal', 'NP', 0.20933, 0], ['Netherlands', 'NL', 0.1727, 254],
	['New Zealand', 'NZ', 0.0431, 0], ['Nicaragua', 'NI', 0.251, 0], ['Nigeria', 'NG', 0.145, 0], ['North Macedonia', 'MK', 0.006, 0],
	['Norway', 'NO', 0.31907, 0], ['Oman', 'OM', 0.0086, 4675], ['Pakistan', 'PK', 0.2326, 113], ['Panama', 'PA', 0.277, 0],
	['Paraguay', 'PY', 0.171, 181], ['Peru', 'PE', 0.38599, 398], ['Philippines', 'PH', 0.22433, 39], ['Poland', 'PL', 0.2008, 169],
	['Portugal', 'PT', 0.275, 1894], ['Puerto Rico', 'PR', 0.1435, 0], ['Qatar', 'QA', 0.006, 96], ['Romania', 'RO', 0.0285, 1473],
	['Rwanda', 'RW', 0.089, 0], ['Saudi Arabia', 'SA', 0.01, 9737], ['Senegal', 'SN', 0.276, 541], ['Serbia', 'RS', 0.1515, 0],
	['Singapore', 'SG', 0.1725, 0], ['Slovakia', 'SK', 0.358, 1050], ['Slovenia', 'SI', 0.177, 2207], ['South Africa', 'ZA', 0.022, 0],
	['South Korea', 'KR', 0.11703, 536], ['Spain', 'ES', 0.33842, 664], ['Sri Lanka', 'LK', 0.156, 0], ['Suriname', 'SR', 0.058, 0],
	['Sweden', 'SE', 0.3202, 600], ['Switzerland', 'CH', 0.1622, 0], ['Taiwan', 'TW', 0.22474, 0], ['Thailand', 'TH', 0.079, 0],
	['Tunisia', 'TN', 0.1767, 0], ['Turkey', 'TR', 0.2235, 0], ['Uganda', 'UG', 0.115, 0], ['Ukraine', 'UA', 0.226, 0],
	['United Arab Emirates', 'AE', 0.0066, 0], ['United Kingdom', 'GB', 0.188, 0], ['United States', 'US', 0.125, 0],
	['Uruguay', 'UY', 0.16455, 589], ['Uzbekistan', 'UZ', 0.13171, 0], ['Vietnam', 'VN', 0.241, 0], ['Zambia', 'ZM', 0.25096, 0],
];

export const eorCostCountries: EorCostCountry[] = rows.map(([name, code, rate, fixed]) => ({
	name,
	code,
	rate,
	fixed,
}));
