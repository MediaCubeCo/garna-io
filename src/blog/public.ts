export function handleLegacyBlogRedirect(request: Request): Response | null {
  const path = new URL(request.url).pathname;
  const target = ['/en/blog-article', '/blog-article'].includes(path)
    ? '/en/blog/global-payroll-complexity'
    : ['/en/blog-author', '/blog-author'].includes(path) ? '/en/blog/author/emily-chen' : null;
  return target ? new Response(null, { status: 301, headers: { Location: target } }) : null;
}
