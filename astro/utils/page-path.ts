const languageCodes = ['en', 'es', 'pt', 'ru'];

export function getPagePathFromPathname(pathname: string): string {
	const pathnameSegments = pathname.split('/').filter(Boolean);
	const [firstSegment, ...restSegments] = pathnameSegments;

	return firstSegment && languageCodes.includes(firstSegment.toLowerCase())
		? restSegments.join('/')
		: pathnameSegments.join('/');
}
