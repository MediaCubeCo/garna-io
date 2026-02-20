import { getPageTranslations } from '../pages/i18n';
import { RouteInfo } from './routes';
import { languages } from '../config/languages';

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
	return `/${segment}`;
}

/**
 * Returns HTML for the footer language select.
 * Custom dropdown with styles and animation copied entirely from SelectForm (selectForm.module.css).
 * Injected server-side; on option click navigates to the same page in the selected language.
 */
function buildFooterLangSelectHtml(pageName: string, currentLanguage: string, languageLabel: string): string {
	const currentLang = currentLanguage.toLowerCase();
	const currentOption = languages.find((l) => l.value === currentLang);
	const displayText = currentOption ? currentOption.label : currentLang;

	const optionsHtml = languages
		.map((lang) => {
			const path = getLanguagePagePath(pageName, lang.value);
			const selected = lang.value === currentLang;
			const selectedClass = selected ? ' footer-lang-optionSelected' : '';
			const ariaSelected = selected ? 'true' : 'false';
			return `<li class="footer-lang-option${selectedClass}" role="option" aria-selected="${ariaSelected}" data-url="${escapeHtml(
				path
			)}">${escapeHtml(lang.label)}</li>`;
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
.footer-lang-list {
	margin: 0; padding: 6px 0; list-style: none;
	background-color: rgb(10, 10, 10); border: 1px solid rgb(34, 34, 34);
	border-radius: 12px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
	overflow-y: auto; max-height: 260px;
}
.footer-lang-option {
	padding: 10px 14px; cursor: pointer; transition: background-color 0.1s ease-out;
	color: rgba(255, 255, 255, 0.9); font-size: inherit;
}
.footer-lang-option:hover, .footer-lang-optionHighlighted {
	background-color: rgba(255, 255, 255, 0.06); color: #fff;
}
.footer-lang-optionSelected { color: rgb(94, 165, 0); font-weight: 500; }
.footer-lang-optionSelected.footer-lang-optionHighlighted,
.footer-lang-optionSelected:hover { background-color: rgba(255, 255, 255, 0.08); color: rgb(94, 165, 0); }
@media (min-width: 768px) { .footer-lang-label { max-width: 160px; } }
@media (max-width: 767px) { .footer-lang-label { max-width: 100%; } }`;

	const script = `
(function(){
	var c=document.getElementById('footer-lang-container');
	var opts=c&&c.querySelectorAll('.footer-lang-option');
	function go(url){ if(url) location.href=url; }
	if(opts){ for(var i=0;i<opts.length;i++){ (function(el){ el.addEventListener('click',function(){ go(el.getAttribute('data-url')); }); })(opts[i]); } }
})();`;

	return (
		`<style>${style}</style>` +
		'<div class="footer-lang-select-block mt-4 md:mt-6">' +
		'<div class="footer-lang-label" id="footer-lang-container">' +
		`<div class="footer-lang-trigger" role="combobox" aria-haspopup="listbox" aria-label="${escapeHtml(
			languageLabel
		)}">` +
		`<span class="footer-lang-triggerText">${escapeHtml(displayText)}</span>` +
		'</div>' +
		'<div class="footer-lang-dropdown">' +
		`<ul class="footer-lang-list" role="listbox" aria-label="${escapeHtml(languageLabel)}">${optionsHtml}</ul>` +
		'</div></div></div>' +
		`<script>${script}</script>`
	);
}

/**
 * Injects page translations into HTML as a JavaScript object
 * and adds the translation script before </body>
 */
export function injectPageTranslations(
	html: string,
	pageName: string,
	routeInfo: RouteInfo,
	baseUrl: string,
	env?: any
): string {
	try {
		// Get translations for all languages (en, es, pt, ru)
		const allTranslations = {
			en: getPageTranslations(pageName, 'en'),
			es: getPageTranslations(pageName, 'es'),
			pt: getPageTranslations(pageName, 'pt'),
			ru: getPageTranslations(pageName, 'ru'),
		};

		// Get current language and replace image src attributes in HTML directly on server
		// This ensures images are correct before browser even starts loading them
		const currentLanguage = routeInfo.language || 'en';

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
		const footerLangSelectHtml = buildFooterLangSelectHtml(pageName, currentLanguage, languageLabel);
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

		if (currentLanguage !== 'en') {
			const currentTranslations =
				allTranslations[currentLanguage as keyof typeof allTranslations] || allTranslations.en;

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

		// Create JavaScript object with translations for all languages
		// Inject translations directly and load script inline to avoid async issues
		// Split into two scripts: one in <head> for immediate image replacement, one before </body> for text translations

		// Script for right after <body> - replaces images SYNCHRONOUSLY before browser loads them
		const headScript = `
<script>
(function() {
  'use strict';
  
  function getCurrentLanguage() {
    var htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang) {
      var lang = htmlLang.split('-')[0].toLowerCase();
      if (['en', 'es', 'pt', 'ru'].indexOf(lang) !== -1) {
        return lang;
      }
    }
    return 'en';
  }
  
  // Replace images IMMEDIATELY and SYNCHRONOUSLY - before browser starts loading them
  function replaceImagesSync() {
    var language = getCurrentLanguage();
    if (language === 'en') return; // English uses default images
    
    var translations = window.pageTranslations[language] || window.pageTranslations.en;
    var imageMappings = translations && translations.images ? translations.images : null;
    if (!imageMappings) return;
    
    // Process images immediately - use multiple strategies to catch them as early as possible
    function processImages() {
      var imgs = document.querySelectorAll('img[data-image-src]');
      for (var i = 0; i < imgs.length; i++) {
        replaceImageSrc(imgs[i], imageMappings);
      }
      return imgs.length;
    }
    
    // Strategy 1: Try immediately (script runs right after <body>)
    var processedCount = 0;
    if (document.body) {
      processedCount = processImages();
    }
    
    // Strategy 2: Use DOMContentLoaded for earliest possible execution
    if (processedCount === 0 || document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        processImages();
      }, { once: true, passive: true });
    }
    
    // Strategy 3: Use MutationObserver to catch images as they're parsed and added to DOM
    if (typeof MutationObserver !== 'undefined') {
      var observer = new MutationObserver(function(mutations) {
        var foundNew = false;
        mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) {
              if (node.tagName === 'IMG' && node.getAttribute('data-image-src')) {
                foundNew = true;
                replaceImageSrc(node, imageMappings);
              } else if (node.querySelectorAll) {
                var childImgs = node.querySelectorAll('img[data-image-src]');
                if (childImgs.length > 0) {
                  foundNew = true;
                  for (var j = 0; j < childImgs.length; j++) {
                    replaceImageSrc(childImgs[j], imageMappings);
                  }
                }
              }
            }
          });
        });
      });
      
      // Start observing immediately
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      
      // Disconnect after a short delay to avoid performance issues
      setTimeout(function() {
        observer.disconnect();
        // Final processing
        processImages();
      }, 1000);
    }
  }
  
  function replaceImageSrc(img, imageMappings) {
    var key = img.getAttribute('data-image-src');
    if (!key) return;
    
    var cleanKey = key.replace(/^images\./, '');
    var imagePath = imageMappings[cleanKey];
    if (!imagePath) return;
    
    var currentSrc = img.getAttribute('src');
    if (!currentSrc) return;
    
    var dir = currentSrc.substring(0, currentSrc.lastIndexOf('/') + 1);
    var newSrc = dir + imagePath;
    
    if (currentSrc !== newSrc) {
      img.setAttribute('src', newSrc);
      
      // Update srcset
      var srcset = img.getAttribute('srcset');
      if (srcset) {
        var newImageBase = imagePath.replace(/\\.png$/i, '');
        var originalFilename = currentSrc.substring(currentSrc.lastIndexOf('/') + 1);
        var originalBaseName = originalFilename.replace(/-p-\\d+\\.png$/i, '').replace(/\\.png$/i, '');
        
        var newSrcset = srcset.replace(new RegExp(originalBaseName.replace(/[.*+?^$()|[\\]\\\\-]/g, '\\\\$&') + '(-p-\\\\d+)?\\\\.png', 'gi'), function(match) {
          var sizeMatch = match.match(/-p-(\\d+)\\.png$/i);
          if (sizeMatch) {
            return newImageBase + '-p-' + sizeMatch[1] + '.png';
          }
          return imagePath;
        });
        img.setAttribute('srcset', newSrcset);
      }
    }
  }
  
  // Execute immediately
  replaceImagesSync();
})();
</script>`;

		// Script for </body> - applies text translations
		const bodyScript = `
<script>
(function() {
  'use strict';
  
  function getCurrentLanguage() {
    var htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang) {
      var lang = htmlLang.split('-')[0].toLowerCase();
      if (['en', 'es', 'pt', 'ru'].indexOf(lang) !== -1) {
        return lang;
      }
    }
    return 'en';
  }
  
  function getNestedValue(obj, path) {
    var keys = path.split('.');
    var value = obj;
    for (var i = 0; i < keys.length; i++) {
      if (value && typeof value === 'object' && keys[i] in value) {
        value = value[keys[i]];
      } else {
        return undefined;
      }
    }
    return value;
  }
  
  function applyTranslations(translations) {
    if (!translations) return;
    var elements = document.querySelectorAll('[data-translate]');
    elements.forEach(function(element) {
      var key = element.getAttribute('data-translate');
      var value = key ? getNestedValue(translations, key) : undefined;
      var tagName = element.tagName ? element.tagName.toUpperCase() : '';
      if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
        var placeholderKey = element.getAttribute('data-translate-placeholder');
        var valueKey = element.getAttribute('data-translate-value');
        var placeholderValue = placeholderKey ? getNestedValue(translations, placeholderKey) : undefined;
        var valueValue = valueKey ? getNestedValue(translations, valueKey) : undefined;
        if (placeholderValue !== undefined && placeholderValue !== null) {
          element.setAttribute('placeholder', String(placeholderValue));
        } else if (value !== undefined && value !== null && element.hasAttribute('placeholder')) {
          element.setAttribute('placeholder', String(value));
        }
        if (valueValue !== undefined && valueValue !== null) {
          element.value = String(valueValue);
        } else if (value !== undefined && value !== null) {
          if (element.value || element.hasAttribute('value')) {
            element.value = String(value);
          }
        }
        return;
      }
      if (value !== undefined && value !== null) {
        var valueStr = String(value);
        if (valueStr.indexOf('<') !== -1 || valueStr.indexOf('&') !== -1) {
          element.innerHTML = valueStr;
        } else {
          element.textContent = valueStr;
        }
      }
    });
  }
  
  // Prevent multiple initializations
  var initialized = false;
  
  function init() {
    if (initialized) {
      return;
    }
    initialized = true;
    
    var language = getCurrentLanguage();
    
    if (!window.pageTranslations) {
      setTimeout(init, 50);
      return;
    }
    
    var translations = window.pageTranslations[language] || window.pageTranslations.en;
    if (!translations) {
      return;
    }
    
    applyTranslations(translations);
  }
  
  // Try to initialize immediately if DOM is ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
  
  // Also try after a short delay as fallback
  setTimeout(function() {
    if (!initialized) {
      init();
    }
  }, 100);
})();
</script>`;

		// Insert translations data into <head>
		const headCloseIndex = html.toLowerCase().indexOf('</head>');
		if (headCloseIndex !== -1) {
			const translationsDataScript = `<script>window.pageTranslations = ${JSON.stringify(allTranslations)};</script>`;
			html = html.slice(0, headCloseIndex) + translationsDataScript + '\n' + html.slice(headCloseIndex);
		}

		// Insert headScript right after <body> tag for immediate image replacement
		const bodyOpenMatch = html.match(/<body[^>]*>/i);
		if (bodyOpenMatch && bodyOpenMatch.index !== undefined) {
			const bodyEndIndex = bodyOpenMatch.index + bodyOpenMatch[0].length;
			html = html.slice(0, bodyEndIndex) + '\n' + headScript + html.slice(bodyEndIndex);
		} else {
			// Fallback: insert before </body>
			const bodyCloseIndex = html.lastIndexOf('</body>');
			if (bodyCloseIndex !== -1) {
				html = html.slice(0, bodyCloseIndex) + headScript + '\n' + html.slice(bodyCloseIndex);
			} else {
				html = headScript + '\n' + html;
			}
		}

		// Insert bodyScript before </body> for text translations
		const bodyCloseIndex = html.lastIndexOf('</body>');
		if (bodyCloseIndex !== -1) {
			html = html.slice(0, bodyCloseIndex) + bodyScript + '\n' + html.slice(bodyCloseIndex);
		} else {
			// If no </body> tag, append at the end
			html += bodyScript;
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
