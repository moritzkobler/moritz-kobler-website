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

function mergePreferPrimary(primary, fallback){
  if (primary === undefined || primary === null) return fallback;
  if (Array.isArray(primary)) return primary;

  const isObj = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);
  if (isObj(primary) && isObj(fallback)){
    const out = {};
    const keys = new Set([...Object.keys(fallback), ...Object.keys(primary)]);
    for (const k of keys){
      out[k] = mergePreferPrimary(primary[k], fallback[k]);
    }
    return out;
  }

  return primary;
}

function iconDataUrl(seed, label){
  const safe = (label || '').slice(0, 24).replace(/[<>"']/g, '');
  const ch = (safe.trim()[0] || (seed || '?')[0] || '?').toUpperCase();
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#7c3aed" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#22d3ee" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="84" height="84" rx="18" fill="url(#g)"/>
  <text x="48" y="57" text-anchor="middle" font-family="ui-sans-serif,system-ui" font-size="34" font-weight="700" fill="#0b0f14">${ch}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function fnv1a(str){
  let h = 2166136261;
  for (let i = 0; i < str.length; i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed){
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function applyGlowSeed(card, seedText){
  const rand = mulberry32(fnv1a(String(seedText || '')));
  const palettes = [
    ['rgba(124,58,237,.18)', 'rgba(34,211,238,.12)', 'rgba(251,113,133,.10)'],
    ['rgba(34,211,238,.18)', 'rgba(124,58,237,.12)', 'rgba(34,211,238,.10)'],
    ['rgba(251,113,133,.16)', 'rgba(124,58,237,.12)', 'rgba(34,211,238,.10)'],
    ['rgba(124,58,237,.16)', 'rgba(251,113,133,.12)', 'rgba(34,211,238,.10)']
  ];
  const pal = palettes[Math.floor(rand() * palettes.length)];
  const blobCount = 2 + Math.floor(rand() * 3); // 2..4

  const make = (i) => {
    const x = Math.round(8 + rand() * 84);
    const y = Math.round(8 + rand() * 84);
    const sx = Math.round(260 + rand() * 260);
    const sy = Math.round(130 + rand() * 170);
    const color = pal[i % pal.length];
    card.style.setProperty(`--g${i + 1}-x`, `${x}%`);
    card.style.setProperty(`--g${i + 1}-y`, `${y}%`);
    card.style.setProperty(`--g${i + 1}-sx`, `${sx}px`);
    card.style.setProperty(`--g${i + 1}-sy`, `${sy}px`);
    card.style.setProperty(`--g${i + 1}-c`, color);
  };

  for (let i = 0; i < 4; i++){
    if (i < blobCount) make(i);
    else card.style.setProperty(`--g${i + 1}-c`, 'rgba(0,0,0,0)');
  }
}

function renderLogo(src, alt){
  const fallback = '/assets/img/logo.png';
  const img = el('img', { class: 'logo', src: src || fallback, alt: src ? `${alt || ''} logo`.trim() : '' });
  img.addEventListener('error', () => {
    if (img.getAttribute('src') !== fallback) img.setAttribute('src', fallback);
  }, { once: true });
  return img;
}

function renderKeyValue(label, value){
  if (!value) return null;
  return el('div', { class: 'kv' }, [
    el('div', { class: 'kv__label', text: label }),
    el('div', { class: 'kv__value', text: value })
  ]);
}

function attachCarousel(carouselRoot){
  const gallery = carouselRoot.querySelector('.gallery');
  if (!gallery) return;
  const cards = Array.from(gallery.children).filter((n) => n?.classList?.contains('gallery-card'));
  if (cards.length === 0) return;

  if (cards.length === 1){
    cards[0].classList.add('is-active');
    return;
  }

  const dots = el('div', { class: 'carousel-dots', role: 'tablist', 'aria-label': 'Carousel navigation' },
    cards.map((_, idx) =>
      el('button', {
        class: 'carousel-dot',
        type: 'button',
        role: 'tab',
        'aria-label': `Go to item ${idx + 1} of ${cards.length}`,
        onclick: () => scrollToIndex(idx)
      })
    )
  );
  carouselRoot.appendChild(dots);

  const dotButtons = Array.from(dots.querySelectorAll('button'));

  const getPad = () => parseFloat(getComputedStyle(gallery).paddingLeft) || 0;
  const scrollToIndex = (idx) => {
    const card = cards[idx];
    if (!card) return;
    const left = card.offsetLeft - getPad();
    gallery.scrollTo({ left, behavior: 'smooth' });
  };

  const computeActiveIndex = () => {
    const target = gallery.scrollLeft + getPad();
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < cards.length; i++){
      const dist = Math.abs(cards[i].offsetLeft - target);
      if (dist < bestDist){ bestDist = dist; bestIdx = i; }
    }
    return bestIdx;
  };

  const update = () => {
    const activeIdx = computeActiveIndex();
    for (let i = 0; i < cards.length; i++){
      cards[i].classList.toggle('is-active', i === activeIdx);
      dotButtons[i]?.setAttribute('aria-current', i === activeIdx ? 'true' : 'false');
      dotButtons[i]?.setAttribute('tabindex', i === activeIdx ? '0' : '-1');
    }
  };

  let raf = 0;
  const scheduleUpdate = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; update(); });
  };

  gallery.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  requestAnimationFrame(update);
}

export async function renderAbout({ lang }){
  setTitle(lang === 'de' ? 'Über mich' : 'About Me');
  const locale = lang === 'de' ? 'de-DE' : 'en-US';

  const aboutPrimary = await loadJson(`/data/about.${lang}.json`);
  const aboutFallback = lang === 'en' ? null : await loadJson('/data/about.en.json');
  const about = mergePreferPrimary(aboutPrimary, aboutFallback);

  const meta = about?.meta ?? {};

  const introSide = el('div', { class: 'card panel' }, [
    el('div', { class: 'panel__inner' }, [
      renderKeyValue(lang === 'de' ? 'Rolle' : 'Role', meta.title),
      renderKeyValue(lang === 'de' ? 'Ort' : 'Location', meta.location),
      el('div', { class: 'panel__actions' }, [
        meta.linkedin ? el('a', { class: 'btn', href: meta.linkedin, target: '_blank', rel: 'noreferrer', text: 'LinkedIn' }) : null,
        meta.cvPdf ? el('a', { class: 'btn btn--ghost', href: meta.cvPdf, download: '', text: lang === 'de' ? 'CV (PDF)' : 'CV (PDF)' }) : null
      ].filter(Boolean))
    ])
  ]);

  const hero = el('section', { class: 'card hero' }, [
    el('h1', { class: 'h1', text: meta.name ?? 'Moritz Kobler' }),
    el('p', { class: 'muted', text: `${meta.title ?? ''}${meta.location ? ` · ${meta.location}` : ''}`.trim() }),
    el('p', { class: 'p', text: about?.summary ?? '' }),
    el('div', { class: 'chips' }, [
      meta.linkedin ? el('a', { class: 'chip', href: meta.linkedin, target: '_blank', rel: 'noreferrer', text: lang === 'de' ? 'LinkedIn öffnen' : 'Open LinkedIn' }) : null,
      meta.cvPdf ? el('a', { class: 'chip', href: meta.cvPdf, download: '', text: lang === 'de' ? 'CV herunterladen' : 'Download CV' }) : null
    ].filter(Boolean))
  ]);

  const introGrid = el('div', { class: 'grid' }, [
    el('div', {}, [hero]),
    el('div', {}, [introSide])
  ]);

  const experience = Array.isArray(about?.experience) ? about.experience : [];
  const expGallery = el('div', { class: 'gallery gallery--lg' }, experience.map((r) => {
    const dates = formatMonthRange(r.startDate, r.endDate, locale);
    const latestRole = Array.isArray(r.roles) && r.roles.length ? r.roles[r.roles.length - 1] : (r.role ?? '');
    const previousRoles = Array.isArray(r.roles) && r.roles.length > 1 ? r.roles.slice(0, -1) : [];
    const card = el('article', { class: 'gallery-card', tabindex: '-1', onclick: (e) => {
      e.preventDefault();
      const card = e.currentTarget;
      const gallery = card.parentElement;
      const pad = parseFloat(getComputedStyle(gallery).paddingLeft) || 0;
      const left = card.offsetLeft - pad;
      gallery.scrollTo({ left, behavior: 'smooth' });
      try{ card.focus({ preventScroll: true }); } catch(err){ card.focus(); }
    } }, [
      el('div', { class: 'card-row' }, [
        renderLogo(r.logo, r.company),
        el('div', { class: 'card-row__body' }, [
          el('div', { class: 'muted', text: r.company ?? '' }),
          el('h2', { class: 'h2', text: latestRole }),
          previousRoles.length ? el('div', { class: 'muted', text: previousRoles.join(' · ') }) : null,
          el('div', { class: 'muted', text: dates })
        ])
      ]),
      el('ul', {}, (r.highlights ?? []).map((h) => el('li', { text: h })))
    ]);
    applyGlowSeed(card, r.id || `${r.company || ''}-${latestRole}`);
    return card;
  }));
  const expSection = el('section', {}, [
    el('div', { class: 'section-title', text: lang === 'de' ? 'Berufserfahrung' : 'Work Experience' }),
    el('div', { class: 'carousel' }, [expGallery])
  ]);
  attachCarousel(expSection.querySelector('.carousel'));

  const education = Array.isArray(about?.education) ? about.education : [];
  const eduGallery = el('div', { class: 'gallery' }, education.map((r) => {
    const dates = formatMonthRange(r.startDate, r.endDate, locale);
    const card = el('article', { class: 'gallery-card', tabindex: '-1', onclick: (e) => {
      e.preventDefault();
      const card = e.currentTarget;
      const gallery = card.parentElement;
      const pad = parseFloat(getComputedStyle(gallery).paddingLeft) || 0;
      const left = card.offsetLeft - pad;
      gallery.scrollTo({ left, behavior: 'smooth' });
      try{ card.focus({ preventScroll: true }); } catch(err){ card.focus(); }
    } }, [
      el('div', { class: 'card-row' }, [
        renderLogo(r.logo, r.institution),
        el('div', { class: 'card-row__body' }, [
          el('div', { class: 'muted', text: r.institution ?? '' }),
          el('h2', { class: 'h2', text: r.degree ?? '' }),
          el('div', { class: 'muted', text: dates }),
          el('div', { class: 'muted', text: r.focus ?? '' })
        ])
      ]),
      el('ul', {}, (r.details ?? []).map((d) => el('li', { text: d })))
    ]);
    applyGlowSeed(card, r.id || `${r.institution || ''}-${r.degree || ''}`);
    return card;
  }));
  const eduSection = el('section', {}, [
    el('div', { class: 'section-title', text: lang === 'de' ? 'Ausbildung' : 'Education' }),
    el('div', { class: 'carousel' }, [eduGallery])
  ]);
  attachCarousel(eduSection.querySelector('.carousel'));

  const volunteering = Array.isArray(about?.volunteering) ? about.volunteering : [];
  const volunteeringGallery = el('div', { class: 'gallery' }, volunteering.map((v) => {
    const dates = formatMonthRange(v.startDate, v.endDate, locale);
    const card = el('article', { class: 'gallery-card', tabindex: '-1', onclick: (e) => {
      e.preventDefault();
      const card = e.currentTarget;
      const gallery = card.parentElement;
      const pad = parseFloat(getComputedStyle(gallery).paddingLeft) || 0;
      const left = card.offsetLeft - pad;
      gallery.scrollTo({ left, behavior: 'smooth' });
      try{ card.focus({ preventScroll: true }); } catch(err){ card.focus(); }
    } }, [
      el('div', { class: 'card-row' }, [
        renderLogo(v.image, v.organization),
        el('div', { class: 'card-row__body' }, [
          el('div', { class: 'muted', text: v.organization ?? '' }),
          el('h2', { class: 'h2', text: v.role ?? '' }),
          el('div', { class: 'muted', text: dates }),
          el('div', { class: 'muted', text: v.cause ?? '' })
        ])
      ]),
      el('ul', {}, (v.highlights ?? []).map((h) => el('li', { text: h }))),
      v.url ? el('p', { class: 'muted' }, [el('a', { href: v.url, target: '_blank', rel: 'noreferrer', text: lang === 'de' ? 'Organisation öffnen' : 'Open organization' })]) : null
    ].filter(Boolean));
    applyGlowSeed(card, v.id || `${v.organization || ''}-${v.role || ''}`);
    return card;
  }));
  const volunteeringSection = volunteering.length ? el('section', {}, [
    el('div', { class: 'section-title', text: lang === 'de' ? 'Engagement' : 'Volunteering' }),
    el('div', { class: 'carousel' }, [volunteeringGallery])
  ]) : null;
  if (volunteeringSection) attachCarousel(volunteeringSection.querySelector('.carousel'));

  const references = Array.isArray(about?.references) ? about.references : [];
  const referencesGallery = el('div', { class: 'gallery gallery--lg' }, references.map((r) => {
    const dateLabel = (() => {
      if (!r.date) return '';
      try{
        const d = new Date(r.date);
        if (Number.isNaN(d.getTime())) return r.date;
        return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(d);
      }catch(e){
        return r.date;
      }
    })();

    const card = el('article', { class: 'gallery-card', tabindex: '-1', onclick: (e) => {
      e.preventDefault();
      const card = e.currentTarget;
      const gallery = card.parentElement;
      const pad = parseFloat(getComputedStyle(gallery).paddingLeft) || 0;
      const left = card.offsetLeft - pad;
      gallery.scrollTo({ left, behavior: 'smooth' });
      try{ card.focus({ preventScroll: true }); } catch(err){ card.focus(); }
    } }, [
      el('div', { class: 'card-row' }, [
        r.image ? el('img', { class: 'ref-photo', src: r.image, alt: r.name ?? '' }) : renderLogo(null, r.name),
        el('div', { class: 'card-row__body' }, [
          el('div', { class: 'muted', text: r.title ?? '' }),
          el('h2', { class: 'h2', text: r.name ?? '' }),
          el('div', { class: 'muted', text: `${dateLabel}${r.relation ? ` · ${r.relation}` : ''}`.trim() })
        ])
      ]),
      el('p', { class: 'muted', text: r.text ?? '' }),
      r.profileUrl ? el('p', { class: 'muted' }, [el('a', { href: r.profileUrl, target: '_blank', rel: 'noreferrer', text: lang === 'de' ? 'Profil öffnen' : 'Open profile' })]) : null
    ].filter(Boolean));
    applyGlowSeed(card, r.id || r.name || r.profileUrl || String(Math.random()));
    return card;
  }));
  const referencesSection = references.length ? el('section', {}, [
    el('div', { class: 'section-title', text: lang === 'de' ? 'Empfehlungen' : 'References' }),
    el('div', { class: 'carousel' }, [referencesGallery])
  ]) : null;
  if (referencesSection) attachCarousel(referencesSection.querySelector('.carousel'));

  const skills = Array.isArray(about?.skills) ? about.skills : [];
  const skillsSection = el('section', {}, [
    el('div', { class: 'section-title', text: lang === 'de' ? 'Skills & Tools' : 'Skills & Tools' }),
    skills.length === 0
      ? el('p', { class: 'muted', text: lang === 'de' ? 'Noch keine Skills gepflegt.' : 'No skills listed yet.' })
      : (typeof skills[0] === 'object' && skills[0] && Array.isArray(skills[0].items))
        ? el('div', { class: 'stack' }, skills.map((g) => {
            const items = Array.isArray(g.items) ? g.items : [];
            return el('div', { class: 'card panel' }, [
              el('div', { class: 'panel__inner' }, [
                el('div', { class: 'muted', text: g.group ?? '' }),
                el('div', { class: 'icon-grid' }, items.map((s) => {
                  const name = typeof s === 'string' ? s : (s?.name ?? '');
                  const src = typeof s === 'object' ? s?.icon : null;
                  return el('div', { class: 'icon-item' }, [
                    renderLogo(src || iconDataUrl(name, name), name),
                    el('div', { class: 'icon-label', text: name })
                  ]);
                }))
              ])
            ]);
          }))
        : el('div', { class: 'icon-grid' }, skills.map((s) => {
            const name = typeof s === 'string' ? s : (s?.name ?? '');
            const src = typeof s === 'object' ? s?.icon : null;
            return el('div', { class: 'icon-item' }, [
              renderLogo(src || iconDataUrl(name, name), name),
              el('div', { class: 'icon-label', text: name })
            ]);
          }))
  ]);

  const hobbies = Array.isArray(about?.hobbies) ? about.hobbies : [];
  const hobbiesSection = el('section', {}, [
    el('div', { class: 'section-title', text: lang === 'de' ? 'Hobbys' : 'Hobbies' }),
    hobbies.length === 0
      ? el('p', { class: 'muted', text: lang === 'de' ? 'Noch keine Hobbys gepflegt.' : 'No hobbies listed yet.' })
      : el('ul', { class: 'list' }, hobbies.map((h) => el('li', { text: h })))
  ]);

  const contact = about?.contact ?? {};
  const contactSection = el('section', {}, [
    el('div', { class: 'section-title', text: lang === 'de' ? 'Kontakt' : 'Contact' }),
    el('div', {}, [
      meta.linkedin ? el('p', { class: 'muted' }, [el('a', { href: meta.linkedin, target: '_blank', rel: 'noreferrer', text: 'LinkedIn' })]) : null,
      contact.email ? el('p', { class: 'muted' }, [el('a', { href: `mailto:${contact.email}`, text: contact.email })]) : null,
      contact.phone ? el('p', { class: 'muted' }, [el('a', { href: `tel:${contact.phone.replace(/\s+/g, '')}`, text: contact.phone })]) : null,
      contact.linkedinText && !meta.linkedin ? el('p', { class: 'muted', text: contact.linkedinText }) : null
    ])
  ]);

  const cvHref = meta.cvPdf;
  const cvSection = el('section', {}, [
    el('div', { class: 'section-title', text: lang === 'de' ? 'Lebenslauf' : 'CV' }),
    el('div', { class: 'card panel' }, [
      el('div', { class: 'panel__inner' }, [
        el('p', { class: 'p', text: lang === 'de' ? 'PDF herunterladen:' : 'Download PDF:' }),
        el('p', { class: 'muted' }, [
          cvHref
            ? el('a', { href: cvHref, download: '', text: lang === 'de' ? 'CV herunterladen' : 'Download CV' })
            : document.createTextNode(lang === 'de' ? 'Noch nicht verfügbar.' : 'Not available yet.')
        ])
      ])
    ])
  ]);

  return el('div', { class: 'container' }, [introGrid, expSection, eduSection, volunteeringSection, referencesSection, skillsSection, hobbiesSection, contactSection, cvSection].filter(Boolean));
}

export async function renderProjects({ lang }){
  setTitle(lang === 'de' ? 'Projekte' : 'Projects');
  const data = await loadJson('/data/projects.json');
  const projects = Array.isArray(data?.projects) ? data.projects : [];

  const hero = el('section', { class: 'card hero' }, [
    el('h1', { class: 'h1', text: lang === 'de' ? 'Projekte' : 'Projects' }),
    el('p', { class: 'p', text: lang === 'de' ? 'Apps und Experimente – sauber dokumentiert.' : 'Apps and experiments — cleanly documented.' })
  ]);

  const list = el('section', { class: 'grid-cards' }, projects.map((p) => {
    const href = `/projects/apps/${encodeURIComponent(p.slug)}`;
    return el('a', { class: 'card card-link project-card', href, 'data-link': 'true' }, [
      el('div', { class: 'project-card__top' }, [
        el('img', { class: 'project-icon', src: '/assets/img/logo.png', alt: '' }),
        el('div', {}, [
          el('div', { class: 'muted', text: p.status ?? '' }),
          el('h2', { class: 'h2', text: p.name ?? '' })
        ])
      ]),
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
  const screenshots = Array.isArray(project.screenshots) ? project.screenshots : [];
  const ios = project?.appStoreLinks?.ios;
  const android = project?.appStoreLinks?.android;

  return el('div', { class: 'container' }, [
    el('section', { class: 'card hero' }, [
      el('div', { class: 'muted', text: project.status ?? '' }),
      el('div', { class: 'project-hero' }, [
        el('img', { class: 'project-icon project-icon--lg', src: '/assets/img/logo.png', alt: '' }),
        el('div', {}, [
          el('h1', { class: 'h1', text: project.name ?? '' }),
          el('p', { class: 'p', text: project.longDescription ?? '' })
        ])
      ]),
      el('div', { class: 'chips' }, [
        el('span', { class: 'chip chip--muted', text: project.type ?? 'project' }),
        ios ? el('a', { class: 'chip', href: ios, target: '_blank', rel: 'noreferrer', text: 'iOS' }) : null,
        android ? el('a', { class: 'chip', href: android, target: '_blank', rel: 'noreferrer', text: 'Android' }) : null
      ].filter(Boolean))
    ]),

    el('section', {}, [
      el('div', { class: 'section-title', text: lang === 'de' ? 'Screenshots' : 'Screenshots' }),
      screenshots.length === 0
        ? el('p', { class: 'muted', text: lang === 'de' ? 'Noch keine Screenshots verfügbar.' : 'No screenshots yet.' })
        : el('div', { class: 'shot-grid' }, screenshots.map((s, idx) =>
            el('img', { class: 'shot', src: s, alt: `${project.name ?? 'App'} screenshot ${idx + 1}` })
          ))
    ]),

    el('section', {}, [
      el('div', { class: 'section-title', text: lang === 'de' ? 'App Stores' : 'App Stores' }),
      (ios || android)
        ? el('div', { class: 'chips' }, [
            ios ? el('a', { class: 'chip', href: ios, target: '_blank', rel: 'noreferrer', text: 'Open on iOS' }) : null,
            android ? el('a', { class: 'chip', href: android, target: '_blank', rel: 'noreferrer', text: 'Open on Android' }) : null
          ].filter(Boolean))
        : el('p', { class: 'muted', text: lang === 'de' ? 'Noch keine Store-Links.' : 'No store links yet.' })
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
