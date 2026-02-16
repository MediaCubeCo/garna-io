import { getHeaderTranslations } from '../pages/translations/header';

export const HEADER_PLACEHOLDER = '<!-- HEADER_PLACEHOLDER -->';

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

/**
 * Builds the shared header (navbar) HTML with locale-prefixed links and active page styling.
 */
export function buildHeaderHtml(lang: string, currentPath: string): string {
	const t = getHeaderTranslations(lang);
	const brand = escapeHtml(t.brand);
	const payrollSolution = escapeHtml(t.payrollSolution);
	const forContractors = escapeHtml(t.forContractors);
	const aiHiring = escapeHtml(t.aiHiring);
	const logIn = escapeHtml(t.logIn);
	const signUp = escapeHtml(t.signUp);

	const base = `/${lang}`;
	const homeHref = base;
	const offerHref = `${base}/for-contractors`;
	const aiHiringHref = `${base}/ai-hiring`;

	const isHome = currentPath === '';
	const isOffer = currentPath === 'for-contractors';

	const homeLinkClass =
		'hover:opacity-80 transition-opacity text-base font-medium font-manrope ' +
		(isHome ? 'text-[#5ea500]' : 'text-white');
	const offerLinkClass =
		'text-base font-medium font-manrope ' +
		(isOffer ? 'text-[#5ea500]' : 'hover:opacity-80 transition-opacity text-white');
	const aiHiringLinkClass =
		'hidden hover:opacity-80 transition-opacity text-base lg:text-lg font-medium font-manrope ' + 'text-white';

	const mobileHomeClass =
		'block text-2xl font-medium font-manrope transition-colors ' +
		(isHome ? 'text-[#5EA500] hover:text-[#7CFF00]' : 'text-white hover:opacity-80');
	const mobileOfferClass =
		'block text-2xl font-medium font-manrope transition-colors ' +
		(isOffer ? 'text-[#5EA500] hover:text-[#7CFF00]' : 'text-white hover:opacity-80');
	const mobileAiHiringClass =
		'hidden block text-2xl font-medium text-white font-manrope transition-colors hover:opacity-80';

	const signUpUrl = 'https://app.garna.io/auth/sign-up';
	const logInUrl = 'https://app.garna.io/auth/sign-in';

	return (
		'<nav class="fixed z-50 glass-high w-full top-0">' +
		'<div class="flex h-16 max-w-7xl mr-auto ml-auto pr-6 pl-6 relative items-center justify-between">' +
		'<div class="flex items-center gap-2">' +
		`<div class="flex items-center gap-2 pt-3">
                <a href="/" data-garna-home class="hover:opacity-80 transition-opacity inline-block"><img
                        src="/garna_logo.svg" alt="Garna" class="h-10 w-auto object-contain"
                        data-translate-alt="nav.brand" /></a>
            </div>` +
		'</div>' +
		'<div class="hidden -translate-x-1/2 md:flex md:gap-x-5 lg:gap-x-8 absolute left-1/2 gap-x-8 gap-y-[60px] items-center">' +
		`<a href="${escapeHtml(homeHref)}" class="${homeLinkClass}">${payrollSolution}</a>` +
		`<a href="${escapeHtml(offerHref)}" class="${offerLinkClass}">${forContractors}</a>` +
		`<a href="${escapeHtml(aiHiringHref)}" class="${aiHiringLinkClass}">${aiHiring}</a>` +
		'</div>' +
		'<div class="flex gap-y-4 items-center gap-x-5 md:gap-4 lg:gap-6">' +
		`<a href="${escapeHtml(logInUrl)}" class="hidden hover:opacity-80 transition-opacity md:inline-flex items-center text-white font-manrope">` +
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-in w-6 h-6 lg:hidden">' +
		'<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" x2="3" y1="12" y2="12"></line>' +
		'</svg>' +
		`<span class="hidden lg:inline">${logIn}</span></a>` +
		`<a href="${escapeHtml(signUpUrl)}" class="group inline-flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale--11 text-[#ffffff] font-manrope bg-[#5ea500] h-11 rounded-xl pr-7 pl-7 shadow-[0_0_20px_-5px_rgba(94,165,0,0.5)]" id="header-signup-btn">${signUp}</a>` +
		"<button onclick=\"document.getElementById('mobile-nav-menu').classList.toggle('hidden'); document.body.classList.toggle('overflow-hidden'); this.querySelector('.menu-icon').classList.toggle('hidden'); this.querySelector('.close-icon').classList.toggle('hidden'); document.getElementById('header-signup-btn').classList.toggle('hidden');\" class=\"md:hidden text-white hover:text-[#5EA500] transition-colors p-1\" aria-label=\"Toggle Menu\">" +
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="menu-icon w-6 h-6 lucide lucide-menu">' +
		'<line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>' +
		'</svg>' +
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="close-icon hidden w-8 h-8 lucide lucide-x">' +
		'<path d="M18 6 6 18"></path><path d="M6 6 18 18"></path>' +
		'</svg></button>' +
		'</div>' +
		'<div id="mobile-nav-menu" class="hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-[#050505] border-t border-white/10 flex flex-col gap-2 md:hidden z-50 overflow-y-auto animate-fade-in px-6 pb-6 pt-8">' +
		'<div class="flex flex-col gap-5">' +
		`<a href="${escapeHtml(homeHref)}" class="${mobileHomeClass}">${payrollSolution}</a>` +
		`<a href="${escapeHtml(offerHref)}" class="${mobileOfferClass}">${forContractors}</a>` +
		`<a href="${escapeHtml(aiHiringHref)}" class="${mobileAiHiringClass}">${aiHiring}</a>` +
		'</div>' +
		'<div class="mt-auto flex flex-col gap-4"><div class="h-px bg-white/10 w-full mb-2"></div>' +
		'<div class="flex flex-col gap-3">' +
		`<a href="${escapeHtml(logInUrl)}" class="flex items-center justify-center p-4 rounded-xl hover:bg-white/5 text-lg font-medium text-white font-manrope transition-colors border border-white/10 hover:border-white/20">${logIn}</a>` +
		`<a href="${escapeHtml(signUpUrl)}" class="flex items-center justify-center p-4 rounded-xl text-lg font-medium text-white font-manrope transition-all bg-[#5EA500] hover:bg-[#4d8700] hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_-5px_rgba(94,165,0,0.5)]">${signUp}</a>` +
		'</div></div></div></div></nav>'
	);
}
