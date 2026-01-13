import { loadJson, formatMonthRange } from './data.js';

function el(tag, attrs = {}, children = []){
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)){
    if (v == null) continue;
    if (k === 'class') node.className = String(v);
    else if (k === 'text') node.textContent = String(v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, String(v));
  }
  for (const c of children){
    if (c == null) continue;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

function setTitle(title){
  document.title = title ? `${title} — Moritz Kobler` : 'Moritz Kobler';
}

export async function renderAbout({ lang }){
  setTitle(lang === 'de' ? 'Über mich' : 'About Me');
  const locale = lang === 'de' ? 'de-DE' : 'en-US';

  const about = await loadJson(`/data/about.${lang}.json`);

  const hero = el('section', { class: 'card hero' }, [
    el('h1', { class: 'h1', text: about?.meta?.name ?? 'Moritz Kobler' }),
    el('p', { class: 'muted', text: `${about?.meta?.title ?? ''}${about?.meta?.location ? ` · ${about.meta.location}` : ''}`.trim() }),
    el('p', { class: 'p', text: about?.summary ?? '' }),
    el('p', { class: 'muted' }, [
      el('a', { href: about?.meta?.linkedin ?? '#', target: '_blank', rel: 'noreferrer', text: lang === 'de' ? 'LinkedIn öffnen' : 'Open LinkedIn' })
    ])
  ]);

  const experience = Array.isArray(about?.experience) ? about.experience : [];
  const expSection = el('section', {}, [
    el('div', { class: 'section-title', text: lang === 'de' ? 'Berufserfahrung' : 'Work Experience' }),
    el('div', { class: 'gallery' }, experience.map((r) => {
      const dates = formatMonthRange(r.startDate, r.endDate, locale);
      return el('article', { class: 'gallery-card' }, [
        el('div', { class: 'muted', text: r.company ?? '' }),
        el('h2', { class: 'h2', text: r.role ?? '' }),
        el('div', { class: 'muted', text: dates }),
        el('ul', {}, (r.highlights ?? []).map((h) => el('li', { text: h })))
      ]);
    }))
  ]);

  const education = Array.isArray(about?.education) ? about.education : [];
  const eduSection = el('section', {}, [
    el('div', { class: 'section-title', text: lang === 'de' ? 'Ausbildung' : 'Education' }),
    el('div', { class: 'gallery' }, education.map((r) => {
      const dates = formatMonthRange(r.startDate, r.endDate, locale);
      return el('article', { class: 'gallery-card' }, [
        el('div', { class: 'muted', text: r.institution ?? '' }),
        el('h2', { class: 'h2', text: r.degree ?? '' }),
        el('div', { class: 'muted', text: dates }),
        el('div', { class: 'muted', text: r.focus ?? '' }),
        el('ul', {}, (r.details ?? []).map((d) => el('li', { text: d })))
      ]);
    }))
  ]);

  const cvHref = about?.meta?.cvPdf;
  const cvSection = el('section', {}, [
    el('div', { class: 'section-title', text: lang === 'de' ? 'Lebenslauf' : 'CV' }),
    el('div', { class: 'card', style: null }, [
      el('div', { class: 'hero' }, [
        el('p', { class: 'p', text: lang === 'de' ? 'PDF herunterladen:' : 'Download PDF:' }),
        el('p', { class: 'muted' }, [
          el('a', { href: cvHref ?? '#', target: '_blank', rel: 'noreferrer', text: cvHref ? (lang === 'de' ? 'CV öffnen' : 'Open CV') : (lang === 'de' ? 'Noch nicht verfügbar' : 'Not available yet') })
        ])
      ])
    ])
  ]);

  return el('div', { class: 'container' }, [hero, expSection, eduSection, cvSection]);
}

export async function renderProjects({ lang }){
  setTitle(lang === 'de' ? 'Projekte' : 'Projects');
  const data = await loadJson('/data/projects.json');
  const projects = Array.isArray(data?.projects) ? data.projects : [];

  const hero = el('section', { class: 'card hero' }, [
    el('h1', { class: 'h1', text: lang === 'de' ? 'Projekte' : 'Projects' }),
    el('p', { class: 'p', text: lang === 'de' ? 'Apps und Experimente – sauber dokumentiert.' : 'Apps and experiments — cleanly documented.' })
  ]);

  const list = el('section', { class: 'grid container' }, projects.map((p) => {
    const href = `/projects/apps/${encodeURIComponent(p.slug)}`;
    return el('a', { class: 'card hero', href, 'data-link': 'true' }, [
      el('div', { class: 'muted', text: p.status ?? '' }),
      el('h2', { class: 'h1', text: p.name ?? '' }),
      el('p', { class: 'p', text: p.shortDescription ?? '' })
    ]);
  }));

  return el('div', { class: 'container' }, [hero, list]);
}

export async function renderProjectDetail({ lang, slug }){
  setTitle(slug);
  const data = await loadJson('/data/projects.json');
  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const project = projects.find((p) => p.slug === slug);

  if (!project){
    return el('div', { class: 'container' }, [
      el('section', { class: 'card hero' }, [
        el('h1', { class: 'h1', text: lang === 'de' ? 'Nicht gefunden' : 'Not found' }),
        el('p', { class: 'p', text: lang === 'de' ? 'Dieses Projekt existiert (noch) nicht.' : 'This project does not exist (yet).' }),
        el('p', { class: 'muted' }, [
          el('a', { href: '/projects', 'data-link': 'true', text: lang === 'de' ? 'Zurück zu Projekten' : 'Back to Projects' })
        ])
      ])
    ]);
  }

  const supportEmail = project.supportEmail;

  return el('div', { class: 'container' }, [
    el('section', { class: 'card hero' }, [
      el('div', { class: 'muted', text: project.status ?? '' }),
      el('h1', { class: 'h1', text: project.name ?? '' }),
      el('p', { class: 'p', text: project.longDescription ?? '' })
    ]),
    el('section', {}, [
      el('div', { class: 'section-title', text: lang === 'de' ? 'Support' : 'Support' }),
      el('p', { class: 'muted' }, [
        supportEmail ? el('a', { href: `mailto:${supportEmail}`, text: supportEmail }) : document.createTextNode(lang === 'de' ? 'Keine Support-E-Mail angegeben.' : 'No support email provided.')
      ])
    ]),
    el('section', {}, [
      el('div', { class: 'section-title', text: lang === 'de' ? 'Datenschutz' : 'Privacy' }),
      el('p', { class: 'p', text: project.privacy ?? '' })
    ])
  ]);
}

export function renderPrivacy({ lang }){
  setTitle('Privacy');
  return el('div', { class: 'container' }, [
    el('section', { class: 'card hero' }, [
      el('h1', { class: 'h1', text: lang === 'de' ? 'Datenschutz' : 'Privacy' }),
      el('p', { class: 'p', text: lang === 'de' ? 'Datenschutzhinweise werden projektbezogen auf den jeweiligen Projektseiten gepflegt.' : 'Privacy notes are maintained per-project on the respective project pages.' })
    ])
  ]);
}

export function renderNotFound({ lang, path }){
  setTitle('404');
  return el('div', { class: 'container' }, [
    el('section', { class: 'card hero' }, [
      el('h1', { class: 'h1', text: lang === 'de' ? '404 — Seite nicht gefunden' : '404 — Page not found' }),
      el('p', { class: 'p', text: lang === 'de' ? `Kein Inhalt für: ${path}` : `No content for: ${path}` }),
      el('p', { class: 'muted' }, [
        el('a', { href: '/about-me', 'data-link': 'true', text: lang === 'de' ? 'Zur Startseite' : 'Go to start' })
      ])
    ])
  ]);
}
