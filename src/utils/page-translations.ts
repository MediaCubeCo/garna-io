import { getPageTranslations } from '../i18n';
import { RouteInfo } from './routes';
import { languages } from '../config/languages';
import { getHeaderTranslations } from '../i18n/translations/header';

const FOOTER_LANG_SELECT_PLACEHOLDER = '<!-- FOOTER_LANG_SELECT -->';
const FOOTER_LEGAL_LINKS_PLACEHOLDER = '<!-- FOOTER_LEGAL_LINKS -->';

/**
 * Builds the same-page URL for a given language (worker-side).
 * 404 page: switch to home in that language. Home: /lang. Offer: /lang/for-contractors.
 */
function getLanguagePagePath(pageName: string, lang: string): string {
	const segment = lang.toLowerCase();
	if (pageName === '404' || pageName === 'home') {
		return `/${segment}`;
	}
	if (pageName === 'offer') {
		return `/${segment}/for-contractors`;
	}
	if (pageName === 'form') {
		return `/${segment}/form`;
	}
	if (pageName === 'ai-hiring') {
		return `/${segment}/ai-hiring`;
	}
	if (pageName === 'white-label') {
		return `/${segment}/white-label`;
	}
	if (pageName === 'payroll-small-business') {
		return `/${segment}/payroll-small-business`;
	}
	if (pageName === 'eor') {
		return `/${segment}/employer-of-record`;
	}
	return `/${segment}`;
}

/**
 * Returns HTML for the footer language select.
 * Custom dropdown with styles and animation copied entirely from SelectForm (selectForm.module.css).
 * Injected server-side; on option click navigates to the same page in the selected language.
 */
function buildFooterLangSelectHtml(
	pageName: string,
	currentLanguage: string,
	languageLabel: string,
	availableLanguages?: string[]
): string {
	const currentLang = currentLanguage.toLowerCase();
	const currentOption = languages.find((l) => l.value === currentLang);
	const displayText = currentOption ? currentOption.label : currentLang;
	const footerLanguages = availableLanguages
		? languages.filter((lang) => availableLanguages.includes(lang.value))
		: languages;

	const optionsHtml = footerLanguages
		.map((lang) => {
			const path = getLanguagePagePath(pageName, lang.value);
			const selected = lang.value === currentLang;
			const selectedClass = selected ? ' footer-lang-optionSelected' : '';
			const ariaSelected = selected ? 'true' : 'false';
			return `<li role="none"><a class="footer-lang-option${selectedClass}" role="option" aria-selected="${ariaSelected}" href="${escapeHtml(
				path
			)}" data-footer-lang-link>${escapeHtml(lang.label)}</a></li>`;
		})
		.join('');

	// Styles: trigger + dropdown opening upward, no arrow
	const style = `
.footer-lang-label { position: relative; width: 100%; }
.footer-lang-trigger {
	display: flex; align-items: center;
	width: 100%; border: none; border-bottom: 1px solid rgb(34, 34, 34);
	background-color: transparent; color: #fff; padding: 10px 0;
	cursor: pointer; font: inherit; transition: border-color 0.18s ease; outline: none;
}
.footer-lang-trigger:hover { border-bottom-color: rgba(255, 255, 255, 0.2); }
.footer-lang-trigger:focus-visible { border-bottom-color: rgb(94, 165, 0); outline: none; }
.footer-lang-label:hover .footer-lang-trigger { border-bottom-color: rgb(94, 165, 0); }
.footer-lang-triggerText {
	flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.footer-lang-dropdown {
	position: absolute; left: 0; right: 0; bottom: 100%; top: auto; z-index: 10;
	opacity: 0; transform: translateY(6px);
	transition: opacity 0.18s ease-out, transform 0.18s ease-out;
	pointer-events: none; visibility: hidden; will-change: transform, opacity;
	padding-bottom: 6px;
}
.footer-lang-label:hover .footer-lang-dropdown {
	opacity: 1; transform: translateY(0); pointer-events: auto; visibility: visible;
}
.footer-lang-label.is-open .footer-lang-dropdown {
	opacity: 1; transform: translateY(0); pointer-events: auto; visibility: visible;
}
.footer-lang-list {
	margin: 0; padding: 6px 0; list-style: none;
	background-color: rgb(10, 10, 10); border: 1px solid rgb(34, 34, 34);
	border-radius: 12px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
	overflow-y: auto; max-height: 260px;
}
.footer-lang-option {
	display: block;
	padding: 10px 14px; cursor: pointer; transition: background-color 0.1s ease-out;
	color: rgba(255, 255, 255, 0.9); font-size: inherit;
	text-decoration: none;
}
.footer-lang-option:hover, .footer-lang-optionHighlighted {
	background-color: rgba(255, 255, 255, 0.06); color: #fff;
}
.footer-lang-optionSelected { color: rgb(94, 165, 0); font-weight: 500; }
.footer-lang-optionSelected.footer-lang-optionHighlighted,
.footer-lang-optionSelected:hover { background-color: rgba(255, 255, 255, 0.08); color: rgb(94, 165, 0); }
@media (min-width: 768px) { .footer-lang-label { max-width: 160px; } }
@media (max-width: 767px) { .footer-lang-label { max-width: 100%; } }`;

	return (
		`<style>${style}</style>` +
		'<div class="footer-lang-select-block mt-4 md:mt-6">' +
		'<div class="footer-lang-label" id="footer-lang-container">' +
		`<button type="button" class="footer-lang-trigger" data-footer-lang-trigger role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-label="${escapeHtml(
			languageLabel
		)}">` +
		`<span class="footer-lang-triggerText">${escapeHtml(displayText)}</span>` +
		'</button>' +
		'<div class="footer-lang-dropdown">' +
		`<ul class="footer-lang-list" role="listbox" aria-label="${escapeHtml(languageLabel)}">${optionsHtml}</ul>` +
		'</div></div></div>'
	);
}

export function injectPageTranslations(
	html: string,
	pageName: string,
	routeInfo: RouteInfo,
	baseUrl: string,
	env?: any,
	availableLanguages?: string[]
): string {
	try {
		// Get translations for all languages (en, es, pt, ru)
		const allTranslations = {
			en: { ...(getPageTranslations(pageName, 'en') as any), header: getHeaderTranslations('en') },
			es: { ...(getPageTranslations(pageName, 'es') as any), header: getHeaderTranslations('es') },
			pt: { ...(getPageTranslations(pageName, 'pt') as any), header: getHeaderTranslations('pt') },
			ru: { ...(getPageTranslations(pageName, 'ru') as any), header: getHeaderTranslations('ru') },
		};

		// Get current language and replace image src attributes in HTML directly on server
		// This ensures images are correct before browser even starts loading them
		const currentLanguage = routeInfo.language || 'en';
		html = html.replace(
			/<a\b([^>]*\sdata-localized-path=["']([^"']*)["'][^>]*)>/gi,
			(match: string, attributes: string, path: string) => {
				const href = path ? `/${currentLanguage}/${path}` : `/${currentLanguage}`;
				const nextAttributes = /\shref=["'][^"']*["']/i.test(attributes)
					? attributes.replace(/\shref=["'][^"']*["']/i, ` href="${escapeHtml(href)}"`)
					: ` href="${escapeHtml(href)}"${attributes}`;

				return `<a${nextAttributes}>`;
			}
		);
		html = localizeLinkHref(html, 'data-garna-home', `/${currentLanguage}`);
		html = localizeLinkHref(html, 'data-garna-signup', `https://app.garna.io/${currentLanguage}/auth/sign-up`);
		html = localizeLinkHref(html, 'data-garna-signin', `https://app.garna.io/${currentLanguage}/auth/sign-in`);

		const currentTranslations =
			allTranslations[currentLanguage as keyof typeof allTranslations] || allTranslations.en;
		const bookingWidgetTranslations = (currentTranslations as any).bookingWidget || {};
		html = html
			.replaceAll('__GARNA_LOCALE__', serializeJsonForScript(currentLanguage))
			.replaceAll('__GARNA_WIDGET_TRANSLATIONS__', serializeJsonForScript(bookingWidgetTranslations));

		// 404 page: point "Return Home" link to the locale-prefixed home (e.g. /en, /ru)
		if (pageName === '404') {
			const homePath = `/${currentLanguage}`;
			html = html.replace(/<a(?=[^>]*data-home-link)[^>]*\bhref="\/"[^>]*>/i, (match) =>
				match.replace('href="/"', `href="${escapeHtml(homePath)}"`)
			);
		}

		// Footer language select (worker-side): inject select with current language and same-page URLs
		const currentTranslationsForLabel =
			allTranslations[currentLanguage as keyof typeof allTranslations] || allTranslations.en;
		const languageLabel = (currentTranslationsForLabel as any)?.footer?.language ?? 'Language';
		const footerLangSelectHtml = buildFooterLangSelectHtml(
			pageName,
			currentLanguage,
			languageLabel,
			availableLanguages
		);
		if (html.includes(FOOTER_LANG_SELECT_PLACEHOLDER)) {
			html = html.replace(FOOTER_LANG_SELECT_PLACEHOLDER, footerLangSelectHtml);
		}

		// Footer legal links (Privacy Policy, Terms of Service) with current lang in URL
		const langParam = currentLanguage.toLowerCase();
		const agreementUrl = `https://app.garna.io/api/documents/agreement?lang=${escapeHtml(langParam)}`;
		const privacyUrl = `https://app.garna.io/api/documents/privacy?lang=${escapeHtml(langParam)}`;
		const footerLegalLinksHtml =
			'<nav class="footer-legal-links flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 md:mt-4 text-sm text-gray-500 font-manrope" aria-label="Legal">' +
			`<a href="${agreementUrl}" target="_blank" rel="noopener noreferrer" class="transition-colors hover:text-[#5EA500] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5EA500]" data-translate="footer.termsOfService">Terms of Service</a>` +
			`<a href="${privacyUrl}" target="_blank" rel="noopener noreferrer" class="transition-colors hover:text-[#5EA500] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5EA500]" data-translate="footer.privacyPolicy">Privacy Policy</a>` +
			'</nav>';
		if (html.includes(FOOTER_LEGAL_LINKS_PLACEHOLDER)) {
			html = html.replace(FOOTER_LEGAL_LINKS_PLACEHOLDER, footerLegalLinksHtml);
		}

		{
			// Update meta title if translation exists
			if (
				currentTranslations.meta &&
				typeof currentTranslations.meta === 'object' &&
				'title' in currentTranslations.meta
			) {
				const title = (currentTranslations.meta as any).title as string;
				html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
			}

			// Update meta description if translation exists
			if (
				currentTranslations.meta &&
				typeof currentTranslations.meta === 'object' &&
				'description' in currentTranslations.meta
			) {
				const description = (currentTranslations.meta as any).description as string;
				// Replace existing description meta tag
				html = html.replace(
					/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
					`<meta name="description" content="${escapeHtml(description)}">`
				);
				// If no description meta tag exists, add one
				if (!html.includes('name="description"')) {
					html = html.replace('</head>', `  <meta name="description" content="${escapeHtml(description)}">\n</head>`);
				}
			}

			// Update Open Graph and Twitter Card to match current locale
			const metaTitle =
				currentTranslations.meta && typeof currentTranslations.meta === 'object' && 'title' in currentTranslations.meta
					? ((currentTranslations.meta as any).title as string)
					: null;
			const metaDescription =
				currentTranslations.meta &&
				typeof currentTranslations.meta === 'object' &&
				'description' in currentTranslations.meta
					? ((currentTranslations.meta as any).description as string)
					: null;
			if (metaTitle) {
				html = html.replace(
					/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
					`<meta property="og:title" content="${escapeHtml(metaTitle)}">`
				);
				html = html.replace(
					/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
					`<meta name="twitter:title" content="${escapeHtml(metaTitle)}">`
				);
			}
			if (metaDescription) {
				html = html.replace(
					/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
					`<meta property="og:description" content="${escapeHtml(metaDescription)}">`
				);
				html = html.replace(
					/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
					`<meta name="twitter:description" content="${escapeHtml(metaDescription)}">`
				);
			}

			const imageMappings = (currentTranslations.images || {}) as Record<string, string>;

			// Find all img tags with data-image-src attribute
			html = html.replace(
				/<img([^>]*data-image-src=["']images\.([^"']+)["'][^>]*)>/gi,
				(match: string, attributes: string, key: string) => {
					const imagePath = imageMappings[key];
					if (!imagePath) return match;

					// Extract src attribute
					const srcMatch = attributes.match(/\ssrc=["']([^"']*\/images\/)([^"']*\.png)["']/i);
					if (!srcMatch) return match;

					const dir = srcMatch[1];
					const originalFilename = srcMatch[2];
					const originalBaseName = originalFilename.replace(/-p-\d+\.png$/i, '').replace(/\.png$/i, '');
					const newImageBase = imagePath.replace(/\.png$/i, '');

					// Replace src attribute
					let newAttributes = attributes.replace(/\ssrc=["'][^"']*["']/i, ` src="${dir}${imagePath}"`);

					// Replace srcset if present
					newAttributes = newAttributes.replace(
						/srcset=["']([^"']+)["']/gi,
						(srcsetMatch: string, srcsetValue: string) => {
							const escapedBaseName = originalBaseName.replace(/[.*+?^$()|[\]\\-]/g, '\\$&');
							const escapedDir = dir.replace(/[.*+?^$()|[\]\\-]/g, '\\$&');
							const newSrcset = srcsetValue.replace(
								new RegExp(`${escapedDir}${escapedBaseName}(-p-\\d+)?\\.png`, 'gi'),
								(entry: string) => {
									const sizeMatch = entry.match(/-p-(\d+)\.png/i);
									if (sizeMatch) {
										return `${dir}${newImageBase}-p-${sizeMatch[1]}.png`;
									}
									return `${dir}${imagePath}`;
								}
							);
							return `srcset="${newSrcset}"`;
						}
					);

					return `<img${newAttributes}>`;
				}
			);

			// Replace text content for elements with data-translate attribute (server-side)
			// Helper function to get nested value
			const getNestedValue = (obj: any, path: string): any => {
				const keys = path.split('.');
				let value = obj;
				for (const key of keys) {
					if (value && typeof value === 'object' && key in value) {
						value = value[key];
					} else {
						return undefined;
					}
				}
				return value;
			};

			html = html.replace(
				/<([a-zA-Z][a-zA-Z0-9:-]*)([^>]*\sdata-translate-(alt|placeholder|value)=["']([^"']+)["'][^>]*)>/gi,
				(match: string, tagName: string, attributes: string, target: string, key: string) => {
					const translation = getNestedValue(currentTranslations, key);
					if (translation === undefined || translation === null) return match;

					const targetAttribute = target === 'alt' ? 'alt' : target;
					const escapedTranslation = escapeHtml(String(translation));
					const attributePattern = new RegExp(`\\s${targetAttribute}=["'][^"']*["']`, 'i');
					const nextAttributes = attributePattern.test(attributes)
						? attributes.replace(attributePattern, ` ${targetAttribute}="${escapedTranslation}"`)
						: `${attributes} ${targetAttribute}="${escapedTranslation}"`;

					return `<${tagName}${nextAttributes}>`;
				}
			);

			html = html.replace(
				/(<textarea\b[^>]*\sdata-translate-value=["']([^"']+)["'][^>]*>)([\s\S]*?)(<\/textarea>)/gi,
				(match: string, openTag: string, key: string, content: string, closeTag: string) => {
					const translation = getNestedValue(currentTranslations, key);
					if (translation === undefined || translation === null) return match;

					return `${openTag}${escapeHtml(String(translation))}${closeTag}`;
				}
			);

			// Replace text in elements with data-translate (server-side)
			// Match patterns like: <div data-translate="key">English text</div>
			// This handles text content between opening and closing tags, including nested tags
			// We need to find matching closing tags, accounting for nested tags with the same name
			const translatePattern = /<([a-zA-Z][a-zA-Z0-9]*)([^>]*\s+data-translate=["']([^"']+)["'][^>]*)>/gi;
			const matches: Array<{ tagName: string; attributes: string; key: string; startIndex: number; endIndex: number }> =
				[];

			// First, find all opening tags with data-translate
			let match;
			while ((match = translatePattern.exec(html)) !== null) {
				const tagName = match[1];
				const attributes = match[2];
				const key = match[3];
				const startIndex = match.index;
				const openTagEnd = startIndex + match[0].length;

				// Find the matching closing tag, accounting for nested tags with the same name
				let depth = 1;
				let searchIndex = openTagEnd;
				const openTagRegex = new RegExp(`<${tagName}(?:\\s[^>]*)?>`, 'gi');
				const closeTagRegex = new RegExp(`</${tagName}>`, 'gi');
				let closingIndex = -1;

				while (depth > 0 && searchIndex < html.length) {
					// Find next opening or closing tag
					openTagRegex.lastIndex = searchIndex;
					closeTagRegex.lastIndex = searchIndex;
					const nextOpen = openTagRegex.exec(html);
					const nextClose = closeTagRegex.exec(html);

					let nextIndex = html.length;
					let isClosing = false;

					if (nextOpen && nextOpen.index < nextIndex) {
						nextIndex = nextOpen.index;
						isClosing = false;
					}
					if (nextClose && nextClose.index < nextIndex) {
						nextIndex = nextClose.index;
						isClosing = true;
					}

					if (nextIndex >= html.length) break;

					if (isClosing) {
						depth--;
						if (depth === 0) {
							closingIndex = nextIndex + nextClose![0].length;
							break;
						}
					} else {
						depth++;
					}

					searchIndex = nextIndex + 1;
				}

				if (closingIndex > 0) {
					matches.push({
						tagName,
						attributes,
						key,
						startIndex,
						endIndex: closingIndex,
					});
				}
			}

			// Process matches in reverse order to avoid index shifting issues
			for (let i = matches.length - 1; i >= 0; i--) {
				const { tagName, attributes, key, startIndex, endIndex } = matches[i];
				const translation = getNestedValue(currentTranslations, key);
				if (translation !== undefined && translation !== null) {
					const translationStr = String(translation);
					const before = html.substring(0, startIndex);
					const after = html.substring(endIndex);
					const openTag = `<${tagName}${attributes}>`;
					const closeTag = `</${tagName}>`;
					html = before + openTag + translationStr + closeTag + after;
				}
			}
		}

		return html;
	} catch {
		return html; // Return original HTML on error
	}
}

/**
 * Escapes HTML special characters to prevent XSS
 * @param text Text to escape
 * @returns Escaped text
 */
function escapeHtml(text: string): string {
	const map: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;',
	};
	return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

function serializeJsonForScript(value: unknown): string {
	return JSON.stringify(value).replace(/</g, '\\u003c');
}

function localizeLinkHref(html: string, markerAttribute: string, href: string): string {
	const markerPattern = markerAttribute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return html.replace(
		new RegExp(`<a\\b([^>]*\\s${markerPattern}(?:=["'][^"']*["'])?[^>]*)>`, 'gi'),
		(match: string, attributes: string) => {
			const nextAttributes = /\shref=["'][^"']*["']/i.test(attributes)
				? attributes.replace(/\shref=["'][^"']*["']/i, ` href="${escapeHtml(href)}"`)
				: ` href="${escapeHtml(href)}"${attributes}`;

			return `<a${nextAttributes}>`;
		}
	);
}
