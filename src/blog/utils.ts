const HTML_ESCAPE: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
};

export function escapeHtml(value: unknown): string {
	return String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPE[char] || char);
}

export function escapeAttribute(value: unknown): string {
	return escapeHtml(value).replace(/`/g, '&#96;');
}

export function slugify(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/['"]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 96);
}

export function normalizePublicOrigin(env?: { PUBLIC_ORIGIN?: string }): string {
	return (env?.PUBLIC_ORIGIN || 'https://garna.io').replace(/\/+$/, '');
}

export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
	const headers = new Headers(init.headers);
	headers.set('Content-Type', 'application/json; charset=utf-8');
	return new Response(JSON.stringify(body), { ...init, headers });
}

export function htmlResponse(html: string, init: ResponseInit = {}): Response {
	const headers = new Headers(init.headers);
	headers.set('Content-Type', 'text/html; charset=utf-8');
	if (!headers.has('Cache-Control')) headers.set('Cache-Control', 'public, max-age=300');
	headers.set('X-Content-Type-Options', 'nosniff');
	headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	return new Response(html, { ...init, headers });
}

export function redirect(location: string, status = 302): Response {
	return new Response(null, { status, headers: { Location: location } });
}

export function notFound(message = 'Not found'): Response {
	return htmlResponse(`<!doctype html><title>Not found</title><body>${escapeHtml(message)}</body>`, {
		status: 404,
		headers: { 'Cache-Control': 'no-store' },
	});
}

export function parseCookie(header: string | null): Record<string, string> {
	const cookies: Record<string, string> = {};
	if (!header) return cookies;
	for (const part of header.split(';')) {
		const [rawKey, ...rawValue] = part.trim().split('=');
		if (!rawKey) continue;
		cookies[rawKey] = decodeURIComponent(rawValue.join('=') || '');
	}
	return cookies;
}

export function markdownToHtml(markdown: string, options: { headingIds?: boolean } = {}): string {
	const lines = markdown.replace(/\r\n/g, '\n').split('\n');
	const html: string[] = [];
	let paragraph: string[] = [];
	let listOpen = false;
	const usedHeadingIds = new Map<string, number>();

	const closeParagraph = () => {
		if (!paragraph.length) return;
		html.push(`<p>${paragraph.join(' ')}</p>`);
		paragraph = [];
	};
	const closeList = () => {
		if (!listOpen) return;
		html.push('</ul>');
		listOpen = false;
	};

	for (const rawLine of lines) {
		const line = rawLine.trim();
		if (!line) {
			closeParagraph();
			closeList();
			continue;
		}
		if (line === '---') {
			closeParagraph();
			closeList();
			html.push('<hr class="garna-blog-divider" />');
			continue;
		}
		const image = line.match(/^!\[([^\]]*)\]\((https?:\/\/[^)\s]+|\/[^)\s]+)\)$/);
		if (image) {
			closeParagraph();
			closeList();
			html.push(`<figure class="garna-blog-image"><img src="${escapeAttribute(image[2])}" alt="${escapeAttribute(image[1])}" />${image[1] ? `<figcaption>${escapeHtml(image[1])}</figcaption>` : ''}</figure>`);
			continue;
		}
		const youtube = line.match(/^\{\{youtube:(.+)\}\}$/);
		if (youtube) {
			const embedUrl = youtubeEmbedUrl(youtube[1]);
			if (embedUrl) {
				closeParagraph();
				closeList();
				html.push(`<figure class="garna-blog-video"><iframe src="${escapeAttribute(embedUrl)}" title="YouTube video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></figure>`);
				continue;
			}
		}
		const cta = line.match(/^\{\{cta:(\{.*\})\}\}$/);
		if (cta) {
			const ctaHtml = ctaBlockToHtml(cta[1]);
			if (ctaHtml) {
				closeParagraph();
				closeList();
				html.push(ctaHtml);
				continue;
			}
		}
		const tldr = line.match(/^\{\{tldr:(\{.*\})\}\}$/);
		if (tldr) {
			const tldrHtml = tldrBlockToHtml(tldr[1]);
			if (tldrHtml) {
				closeParagraph();
				closeList();
				html.push(tldrHtml);
				continue;
			}
		}
		const heading = line.match(/^(#{1,3})\s+(.+)$/);
		if (heading) {
			closeParagraph();
			closeList();
			const level = heading[1].length + 1;
			const id = options.headingIds ? uniqueHeadingId(heading[2], usedHeadingIds) : '';
			html.push(`<h${level}${id ? ` id="${escapeAttribute(id)}"` : ''}>${inlineMarkdown(heading[2])}</h${level}>`);
			continue;
		}
		const bullet = line.match(/^[-*]\s+(.+)$/);
		if (bullet) {
			closeParagraph();
			if (!listOpen) {
				html.push('<ul>');
				listOpen = true;
			}
			html.push(`<li>${inlineMarkdown(bullet[1])}</li>`);
			continue;
		}
		paragraph.push(inlineMarkdown(line));
	}

	closeParagraph();
	closeList();
	return html.join('\n');
}

function uniqueHeadingId(value: string, used: Map<string, number>): string {
	const base = slugify(stripMarkdown(value)) || 'section';
	const count = used.get(base) || 0;
	used.set(base, count + 1);
	return count ? `${base}-${count + 1}` : base;
}

function stripMarkdown(value: string): string {
	return value
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[*_`~]/g, '')
		.trim();
}

function inlineMarkdown(value: string): string {
	let text = escapeHtml(value);
	text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	text = text.replace(
		/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
		'<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>'
	);
	return text;
}

function youtubeEmbedUrl(value: string): string | null {
	try {
		const url = new URL(value.trim());
		let id = '';
		if (url.hostname.includes('youtu.be')) id = url.pathname.replace(/^\/+/, '');
		if (url.hostname.includes('youtube.com')) id = url.searchParams.get('v') || url.pathname.match(/\/embed\/([^/]+)/)?.[1] || '';
		if (!id || !/^[A-Za-z0-9_-]{6,}$/.test(id)) return null;
		return `https://www.youtube.com/embed/${id}`;
	} catch {
		return null;
	}
}

function ctaBlockToHtml(value: string): string {
	try {
		const data = JSON.parse(value) as { title?: string; text?: string; button?: string; url?: string };
		if (!data.title && !data.text && !data.button) return '';
		const url = data.url && /^https?:\/\//.test(data.url) ? data.url : 'https://garna.io/';
		return `<a class="garna-blog-cta" href="${escapeAttribute(url)}" target="_blank" rel="noopener noreferrer">
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

function tldrBlockToHtml(value: string): string {
	try {
		const data = JSON.parse(value) as { title?: string; items?: string[] };
		const items = Array.isArray(data.items) ? data.items.filter(Boolean) : [];
		if (!items.length) return '';
		return `<aside class="garna-blog-tldr">
			<h2>${zapIcon()}${escapeHtml(data.title || 'TLDR')}</h2>
			<ul>${items.map((item) => `<li>${checkCircleIcon()}<span>${escapeHtml(item)}</span></li>`).join('')}</ul>
		</aside>`;
	} catch {
		return '';
	}
}

function zapIcon(): string {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5ea500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
}

function checkCircleIcon(): string {
	return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5ea500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>';
}

export async function sha256Hex(value: string): Promise<string> {
	const data = new TextEncoder().encode(value);
	const digest = await crypto.subtle.digest('SHA-256', data);
	return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function randomToken(bytes = 32): string {
	const array = new Uint8Array(bytes);
	crypto.getRandomValues(array);
	return btoa(String.fromCharCode(...array)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
