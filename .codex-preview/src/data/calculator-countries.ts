export const calculatorCountries = [
	['AL', 'Albania'], ['AR', 'Argentina'], ['AM', 'Armenia'], ['AU', 'Australia'], ['AT', 'Austria'], ['AZ', 'Azerbaijan'],
	['BH', 'Bahrain'], ['BD', 'Bangladesh'], ['BY', 'Belarus'], ['BE', 'Belgium'], ['BO', 'Bolivia'], ['BA', 'Bosnia and Herzegovina'],
	['BR', 'Brazil'], ['BG', 'Bulgaria'], ['KH', 'Cambodia'], ['CM', 'Cameroon'], ['CA', 'Canada'], ['CL', 'Chile'], ['CN', 'China'],
	['CO', 'Colombia'], ['CR', 'Costa Rica'], ['CI', "Côte d’Ivoire"], ['HR', 'Croatia'], ['CY', 'Cyprus'], ['CZ', 'Czech Republic'],
	['DK', 'Denmark'], ['DO', 'Dominican Republic'], ['EC', 'Ecuador'], ['EG', 'Egypt'], ['SV', 'El Salvador'], ['EE', 'Estonia'],
	['ET', 'Ethiopia'], ['FI', 'Finland'], ['FR', 'France'], ['GE', 'Georgia'], ['DE', 'Germany'], ['GH', 'Ghana'], ['GR', 'Greece'],
	['GT', 'Guatemala'], ['HN', 'Honduras'], ['HK', 'Hong Kong'], ['HU', 'Hungary'], ['IS', 'Iceland'], ['IN', 'India'],
	['ID', 'Indonesia'], ['IE', 'Ireland'], ['IL', 'Israel'], ['IT', 'Italy'], ['JM', 'Jamaica'], ['JP', 'Japan'], ['JO', 'Jordan'],
	['KZ', 'Kazakhstan'], ['KE', 'Kenya'], ['XK', 'Kosovo'], ['LV', 'Latvia'], ['LT', 'Lithuania'], ['LU', 'Luxembourg'],
	['MO', 'Macao'], ['MG', 'Madagascar'], ['MY', 'Malaysia'], ['MT', 'Malta'], ['MU', 'Mauritius'], ['MX', 'Mexico'],
	['MD', 'Moldova'], ['MN', 'Mongolia'], ['ME', 'Montenegro'], ['MA', 'Morocco'], ['MZ', 'Mozambique'], ['NA', 'Namibia'],
	['NP', 'Nepal'], ['NL', 'Netherlands'], ['NZ', 'New Zealand'], ['NI', 'Nicaragua'], ['NG', 'Nigeria'], ['MK', 'North Macedonia'],
	['NO', 'Norway'], ['OM', 'Oman'], ['PK', 'Pakistan'], ['PA', 'Panama'], ['PY', 'Paraguay'], ['PE', 'Peru'], ['PH', 'Philippines'],
	['PL', 'Poland'], ['PT', 'Portugal'], ['PR', 'Puerto Rico'], ['QA', 'Qatar'], ['RO', 'Romania'], ['RU', 'Russia'], ['RW', 'Rwanda'],
	['SA', 'Saudi Arabia'], ['SN', 'Senegal'], ['RS', 'Serbia'], ['SG', 'Singapore'], ['SK', 'Slovakia'], ['SI', 'Slovenia'],
	['ZA', 'South Africa'], ['KR', 'South Korea'], ['ES', 'Spain'], ['LK', 'Sri Lanka'], ['SR', 'Suriname'], ['SE', 'Sweden'],
	['CH', 'Switzerland'], ['TW', 'Taiwan'], ['TH', 'Thailand'], ['TN', 'Tunisia'], ['TR', 'Turkey'], ['UG', 'Uganda'],
	['UA', 'Ukraine'], ['AE', 'United Arab Emirates'], ['GB', 'United Kingdom'], ['US', 'United States'], ['UY', 'Uruguay'],
	['UZ', 'Uzbekistan'], ['VN', 'Vietnam'], ['ZM', 'Zambia'],
] as const;

export const calculatorCountryNames = new Map<string, string>(calculatorCountries);

export const calculatorCurrencies = [
	['USD', 'US Dollar'], ['EUR', 'Euro'], ['GBP', 'British Pound'], ['CAD', 'Canadian Dollar'], ['AUD', 'Australian Dollar'],
	['CHF', 'Swiss Franc'], ['JPY', 'Japanese Yen'], ['CNY', 'Chinese Yuan'], ['HKD', 'Hong Kong Dollar'], ['SGD', 'Singapore Dollar'],
	['AED', 'UAE Dirham'], ['ARS', 'Argentine Peso'], ['BRL', 'Brazilian Real'], ['BGN', 'Bulgarian Lev'], ['CLP', 'Chilean Peso'],
	['COP', 'Colombian Peso'], ['CZK', 'Czech Koruna'], ['DKK', 'Danish Krone'], ['EGP', 'Egyptian Pound'], ['GEL', 'Georgian Lari'],
	['HUF', 'Hungarian Forint'], ['IDR', 'Indonesian Rupiah'], ['ILS', 'Israeli Shekel'], ['INR', 'Indian Rupee'], ['ISK', 'Icelandic Króna'],
	['KES', 'Kenyan Shilling'], ['KRW', 'South Korean Won'], ['KZT', 'Kazakhstani Tenge'], ['MAD', 'Moroccan Dirham'], ['MXN', 'Mexican Peso'],
	['MYR', 'Malaysian Ringgit'], ['NGN', 'Nigerian Naira'], ['NOK', 'Norwegian Krone'], ['NZD', 'New Zealand Dollar'],
	['PEN', 'Peruvian Sol'], ['PHP', 'Philippine Peso'], ['PKR', 'Pakistani Rupee'], ['PLN', 'Polish Złoty'], ['QAR', 'Qatari Riyal'],
	['RON', 'Romanian Leu'], ['RSD', 'Serbian Dinar'], ['SAR', 'Saudi Riyal'], ['SEK', 'Swedish Krona'], ['THB', 'Thai Baht'],
	['TRY', 'Turkish Lira'], ['TWD', 'New Taiwan Dollar'], ['UAH', 'Ukrainian Hryvnia'], ['UYU', 'Uruguayan Peso'],
	['VND', 'Vietnamese Đồng'], ['ZAR', 'South African Rand'], ['ZMW', 'Zambian Kwacha'],
] as const;
