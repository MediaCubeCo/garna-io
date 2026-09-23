import { escapeHtml, escapeAttribute } from '@mediacubeco/blog-engine';
export function renderInlineCta(data: Record<string, unknown>): string {
  return ctaBlockToHtml(JSON.stringify(data));
}
export function renderBlogListCta(): string {
	return `<section class="overflow-hidden pt-4 pb-8 relative">
		<div class="font-manrope max-w-7xl mx-auto pr-6 pl-6">
			<a href="#" onclick="event.preventDefault(); if (window.GarnaWidget) window.GarnaWidget.open({ trackingCta: 'blog_demo' });" class="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-between rounded-3xl border border-white/10 bg-[#0a0a0a]/55 px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition-colors hover:border-[#CBF300]/30">
				<h2 class="md:text-3xl text-2xl leading-tight font-thin text-white tracking-tight" data-translate="blog.cta.title">Your Global Growth Starts Here</h2>
				<span class="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-[#CBF300] px-7 text-base font-normal text-[#101010] shadow-[0_0_24px_rgba(203, 243, 0,0.32)] transition-transform duration-300 hover:scale-[1.03] hover:bg-[#D8FF33]">
					<span data-translate="blog.cta.button">Book a Demo</span>
				</span>
			</a>
		</div>
	</section>`;
}
export function payrollSideBanner(): string {
	return `<a href="#" onclick="event.preventDefault(); if (window.GarnaWidget) window.GarnaWidget.open({ trackingCta: 'blog_article_side_banner_demo' });" class="block overflow-hidden group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-[#CBF300]/30 bg-gradient-to-b from-[#1a1a1e] via-[#151518] to-[#0a0a0c] w-full h-[320px] border-white/5 border rounded-xl mb-6 relative shadow-lg">
		<div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
			<div class="absolute top-[5%] left-[-30%] w-[160%] h-20 bg-[#CBF300]/20 rotate-[35deg] blur-2xl transform-gpu transition-transform duration-1000 group-hover:translate-x-4"></div>
			<div class="absolute top-[30%] left-[-30%] w-[160%] h-24 bg-[#CBF300]/10 rotate-[35deg] blur-3xl transform-gpu transition-transform duration-1000 group-hover:translate-x-8"></div>
		</div>
		<div class="flex flex-col w-full h-full z-10 pt-6 pr-6 pb-6 pl-6 relative items-center justify-start">
			<div class="text-center mb-auto pb-4">
				<h2 class="leading-[1.15] text-2xl lg:text-xl text-white tracking-tight font-thin xl:text-xl">See Global Payroll<br><span class="font-normal text-[#CBF300]">in Action</span></h2>
			</div>
			<div class="flex group-hover:-translate-y-1 transition-transform duration-500 w-full h-full max-w-[190px] z-20 mb-6 relative items-center justify-center">
				<div class="absolute inset-0 bg-[#CBF300] blur-[16px] opacity-15 rounded-full group-hover:opacity-25 transition-all duration-700 mix-blend-screen"></div>
				<div class="flex flex-col transition-all duration-500 group-hover:border-[#CBF300]/30 group-hover:shadow-[0_8px_25px_rgba(203, 243, 0,0.1)] overflow-hidden bg-center w-full h-full bg-[url(/pages/blog/assets/21-f0f31e7a-67b4-4cbd-918d-d607080ee39f_3840w.png)] bg-cover z-20 border-white/10 border rounded-xl relative shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md">
					<div class="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#CBF300]/50 to-transparent opacity-40"></div>
				</div>
			</div>
			<div class="group/btn z-20 mt-auto relative">
				<div class="absolute -inset-0.5 bg-gradient-to-r from-[#CBF300] to-[#829A00] rounded-full blur opacity-30 group-hover/btn:opacity-70 transition duration-500"></div>
				<span class="flex transition-all duration-300 hover:scale-105 text-sm font-normal text-[#101010] tracking-wide bg-[#CBF300] rounded-xl pt-2.5 pr-6 pb-2.5 pl-6 relative shadow-sm gap-x-2 gap-y-2 items-center justify-center">Book a Demo</span>
			</div>
			<div class="absolute top-0 right-0 w-40 h-40 bg-[#CBF300]/5 rounded-full blur-3xl z-0 pointer-events-none transition-opacity duration-700 group-hover:bg-[#CBF300]/10"></div>
		</div>
	</a>`;
}

function ctaBlockToHtml(value: string): string {
	try {
		const data = JSON.parse(value) as { title?: string; text?: string; button?: string; customUrlEnabled?: boolean; url?: string };
		if (!data.title && !data.text && !data.button) return '';
		const useCustomUrl = Boolean(data.customUrlEnabled && data.url && /^https?:\/\//.test(data.url));
		const linkAttributes = useCustomUrl
			? `href="${escapeAttribute(data.url || '')}" target="_blank" rel="noopener noreferrer"`
			: `href="#" onclick="event.preventDefault(); if (window.GarnaWidget) window.GarnaWidget.open({ trackingCta: 'blog_article_inline_cta' });"`;
		return `<a class="garna-blog-cta" ${linkAttributes}>
			<div class="garna-blog-cta-beams" aria-hidden="true"><span></span><span></span></div>
			<div class="garna-blog-cta-content">
				<div class="garna-blog-cta-copy">
					<h2>${escapeHtml(data.title || 'Modern Payroll for Global Teams')}</h2>
					<p>${escapeHtml(data.text || 'Manage payroll and contractor payouts in 150+ countries with local currencies, cards, wallets, and crypto')}</p>
					<span>${escapeHtml(data.button || 'Explore Payroll')}</span>
				</div>
				<div class="garna-blog-cta-visual" aria-hidden="true">
					${payrollCardHtml('Sarah J.', 'Engineering', '$8,500.00', 'Txn #4829', 'Paid via ACH', 'Today, 9:00 AM', '/pages/blog/assets/15-photo-1494790108377-be9c29b29330.jpg', 'green')}
					${payrollCardHtml('Alex C.', 'Design', '4.2 ETH', '0x8F...3aC', 'Paid via Wallet', 'Today, 9:02 AM', '/pages/blog/assets/20-photo-1599566150163-29194dcaad36.jpg', 'blue')}
				</div>
			</div>
		</a>`;
	} catch {
		return '';
	}
}

function payrollCardHtml(name: string, role: string, amount: string, meta: string, method: string, time: string, image: string, tone: 'green' | 'blue'): string {
	const accent = tone === 'green' ? 'garna-blog-payroll-card--green' : 'garna-blog-payroll-card--blue';
	return `<div class="garna-blog-payroll-card ${accent}">
		<div class="garna-blog-payroll-card-main">
			<div class="garna-blog-payroll-avatar"><img src="${escapeAttribute(image)}" alt="${escapeAttribute(name)}" /><span></span></div>
			<div><strong>${escapeHtml(name)}</strong><small>${escapeHtml(role)}</small></div>
			<div class="garna-blog-payroll-amount"><strong>${escapeHtml(amount)}</strong><small>${escapeHtml(meta)}</small></div>
		</div>
		<div class="garna-blog-payroll-card-footer"><span>${checkIcon()}${escapeHtml(method)}</span><small>${escapeHtml(time)}</small></div>
	</div>`;
}

function checkIcon(): string {
	return '<i><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></i>';
}
