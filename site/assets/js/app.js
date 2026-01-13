import { includeFragments } from './includes.js';
import { resolveLang, applyLangToDocument, setStoredLang, wireLangToggle } from './lang.js';
import { pathToRoute, wireLinkInterceptor, navigate, withPreservedLang } from './router.js';
import { renderAbout, renderProjects, renderProjectDetail, renderNotFound, renderPrivacy } from './views.js';

function setCurrentNav(pathname){
  const path = pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;
    const isCurrent = (href === '/about-me' && (path === '/' || path === '/about-me')) || href === path;
    a.setAttribute('aria-current', isCurrent ? 'page' : 'false');
  });
}

function setYear(){
  const node = document.querySelector('[data-year]');
  if (node) node.textContent = String(new Date().getFullYear());
}

async function render(){
  const lang = resolveLang();
  applyLangToDocument(lang);

  const outlet = document.getElementById('app');
  if (!outlet) return;

  const route = pathToRoute(window.location.pathname);
  setCurrentNav(window.location.pathname);

  outlet.innerHTML = '';

  try{
    let view;
    if (route.name === 'about') view = await renderAbout({ lang });
    else if (route.name === 'projects') view = await renderProjects({ lang });
    else if (route.name === 'projectDetail') view = await renderProjectDetail({ lang, slug: route.slug });
    else if (route.name === 'privacy') view = renderPrivacy({ lang });
    else view = renderNotFound({ lang, path: route.path });

    outlet.appendChild(view);
  }catch(err){
    outlet.appendChild(
      Object.assign(document.createElement('div'), {
        className: 'container',
        innerHTML: `<section class="card hero"><h1 class="h1">Error</h1><p class="p">${String(err?.message ?? err)}</p></section>`
      })
    );
  }
}

async function boot(){
  await includeFragments(document);
  setYear();

  const lang = resolveLang();
  wireLangToggle(lang, (next) => {
    setStoredLang(next);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', next);
    history.replaceState({}, '', url);
    render();
  });

  wireLinkInterceptor();

  window.addEventListener('popstate', render);

  // Default route
  if (window.location.pathname === '/') navigate(withPreservedLang('/about-me'));
  else render();
}

boot();
