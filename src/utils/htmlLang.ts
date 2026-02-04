/**
 * Injects or updates the lang attribute in the <html> tag
 * @param html HTML content
 * @param language Language code (e.g., 'en', 'es', 'pt', 'ru')
 * @returns Modified HTML with lang attribute
 */
export function injectHtmlLangTag(html: string, language: string): string {
	// Check if <html> tag already has a lang attribute
	if (html.match(/<html[^>]*\s+lang=/i)) {
		// Replace existing lang attribute
		html = html.replace(/(<html[^>]*\s+lang=")([^"]*)(")/i, `$1${language}$3`);
	} else {
		// Add lang attribute to <html> tag
		html = html.replace(/<html(\s|>)/i, `<html lang="${language}"$1`);
	}

	return html;
}
