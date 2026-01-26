export function pathToRoute(pathname){
  const path = pathname.replace(/\/$/, '') || '/';
  if (path === '/' || path === '/about-me') return { name: 'about' };
  if (path === '/projects') return { name: 'projects' };

  const appMatch = path.match(/^\/projects\/apps\/([^\/]+)$/);
  if (appMatch) return { name: 'projectDetail', slug: decodeURIComponent(appMatch[1]) };

  if (path === '/privacy') return { name: 'privacy' };

  return { name: 'notFound', path };
}

export function withPreservedLang(to){
  const current = new URL(window.location.href);
  const currentLang = current.searchParams.get('lang');
  if (!currentLang) return to;

  const target = new URL(to, current.origin);
  if (!target.searchParams.get('lang')) target.searchParams.set('lang', currentLang);
  return `${target.pathname}${target.search}${target.hash}`;
}

export function navigate(to){
  history.pushState({}, '', withPreservedLang(to));
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function wireLinkInterceptor(){
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const a = target.closest('a[data-link]');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href) return;
    if (href.startsWith('http:') || href.startsWith('https:') || href.startsWith('mailto:')) return;

    e.preventDefault();
    navigate(href);
  });
}
