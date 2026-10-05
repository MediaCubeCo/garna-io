const languageCodes = ['en', 'es', 'pt', 'ru'];

function normalizePagePath(path: string): string {
	return path.replace(/\/?index\.html$/, '').replace(/\.html$/, '');
}

export function getPagePathFromPathname(pathname: string): string {
	const pathnameSegments = pathname.split('/').filter(Boolean);
	const [firstSegment, ...restSegments] = pathnameSegments;
	const pagePath = firstSegment && languageCodes.includes(firstSegment.toLowerCase())
		? restSegments.join('/')
		: pathnameSegments.join('/');

	return normalizePagePath(pagePath);
}
