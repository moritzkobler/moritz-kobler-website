import { formatMonthRange } from './data.js';
import { loadBundle } from './i18n.js';

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

function svgEl(tag, attrs = {}, children = []){
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)){
    if (v == null) continue;
    node.setAttribute(k, String(v));
  }
  for (const c of children){
    if (c == null) continue;
    node.appendChild(c);
  }
  return node;
}

function renderChevronIcon(direction){
  const d = direction === 'left'
    ? 'M15 18l-6-6 6-6'
    : 'M9 6l6 6-6 6';
  return svgEl('svg', { class: `card-nav__icon card-nav__icon--${direction}`, viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' }, [
    svgEl('path', {
      d,
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2.2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    })
  ]);
}

function setTitle(title){
  document.title = title ? `${title} — Moritz Kobler` : 'Moritz Kobler';
}



function parseYearMonth(value){
  if (typeof value !== 'string') return null;
  const v = value.trim();
  if (!v) return null;
  if (v.toLowerCase() === 'present') return null;

  const m = /^([0-9]{4})(?:-([0-9]{2}))?$/.exec(v);
  if (!m) return null;
  const year = Number(m[1]);
  const month = m[2] ? Number(m[2]) : 1;
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return null;
  return { year, month };
}

function formatDurationCompact(startDate, endDate){
  const start = parseYearMonth(startDate);
  if (!start) return null;

  const endParsed = parseYearMonth(endDate);
  const end = endParsed
    ? endParsed
    : (() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() + 1 };
      })();

  const totalMonths = (end.year - start.year) * 12 + (end.month - start.month);
  if (!Number.isFinite(totalMonths) || totalMonths < 0) return null;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years <= 0 && months <= 0) return '0m';

  const parts = [];
  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}m`);
  return parts.join('');
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

function renderLogo(src, alt, extraClass = ''){
  const fallback = '/assets/img/about/logo.png';
  const img = el('img', { class: `logo ${extraClass}`.trim(), src: src || fallback, alt: src ? `${alt || ''} logo`.trim() : '' });
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

function isExternalHref(href){
  return typeof href === 'string' && /^https?:\/\//i.test(href);
}

function renderExternalIcon(){
  return svgEl('svg', { class: 'link-out__icon', viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' }, [
    svgEl('path', {
      d: 'M7 17L17 7M10 7h7v7',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    })
  ]);
}

function renderLinkOut(text, href, extraClass = ''){
  if (!href) return document.createTextNode(String(text ?? ''));
  return el('a', {
    class: `link-out ${extraClass}`.trim(),
    href,
    ...(isExternalHref(href) ? { target: '_blank', rel: 'noreferrer' } : {})
  }, [String(text ?? ''), renderExternalIcon()]);
}

function scrollCardIntoView(card){
  const gallery = card.parentElement;
  if (!gallery) return;
  if (gallery.classList.contains('gallery--shots')){
    // For shots: scroll so card's left edge aligns with gallery's left padding
    const pad = parseFloat(getComputedStyle(gallery).paddingLeft) || 0;
    const left = card.offsetLeft - pad;
    gallery.scrollTo({ left, behavior: 'smooth' });
    try{ card.focus({ preventScroll: true }); } catch(err){ card.focus(); }
    return;
  }
  const pad = parseFloat(getComputedStyle(gallery).paddingLeft) || 0;
  const left = card.offsetLeft - pad;
  gallery.scrollTo({ left, behavior: 'smooth' });
  try{ card.focus({ preventScroll: true }); } catch(err){ card.focus(); }
}

function onGalleryCardClick(e){
  const target = e.target;
  if (target instanceof Element){
    const a = target.closest('a');
    if (a) return; // allow link clicks to navigate
  }
  const card = e.currentTarget;
  if (!(card instanceof HTMLElement)) return;
  scrollCardIntoView(card);
}

function attachCarousel(carouselRoot){
  const gallery = carouselRoot.querySelector('.gallery');
  if (!gallery) return;
  const cards = Array.from(gallery.children).filter((n) => n?.classList?.contains('gallery-card'));
  if (cards.length === 0) return;

  if (gallery.classList.contains('gallery--shots')){
    attachVariableTrailingForShots(gallery);
  }

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
    // Use same scroll logic for all galleries (align card to left padding)
    const left = card.offsetLeft - getPad();
    gallery.scrollTo({ left, behavior: 'smooth' });
  };

  // Per-card footer navigation (chevrons)
  for (let i = 0; i < cards.length; i++){
    const card = cards[i];
    if (card.querySelector('.card-nav')) continue;

    const footer = el('div', { class: 'card-nav' }, [
      i > 0
        ? el('button', {
            class: 'card-nav__btn',
            type: 'button',
            'aria-label': `Previous card (${i} of ${cards.length})`,
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              scrollToIndex(i - 1);
            }
          }, [renderChevronIcon('left'), el('span', { class: 'sr-only', text: 'Previous' })])
        : el('span', { class: 'card-nav__spacer', 'aria-hidden': 'true' }),

      i < cards.length - 1
        ? el('button', {
            class: 'card-nav__btn',
            type: 'button',
            'aria-label': `Next card (${i + 2} of ${cards.length})`,
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              scrollToIndex(i + 1);
            }
          }, [el('span', { class: 'sr-only', text: 'Next' }), renderChevronIcon('right')])
        : el('span', { class: 'card-nav__spacer', 'aria-hidden': 'true' })
    ]);

    card.appendChild(footer);
  }

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

const _shotsTrailingBound = new WeakSet();
function attachVariableTrailingForShots(gallery){
  if (_shotsTrailingBound.has(gallery)) return;
  _shotsTrailingBound.add(gallery);

  let raf = 0;
  const schedule = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      update();
    });
  };

  const update = () => {
    const cards = Array.from(gallery.children).filter((n) => n?.classList?.contains('gallery-card'));
    if (cards.length === 0) return;
    const last = cards[cards.length - 1];
    if (!(last instanceof HTMLElement)) return;

    const inset = parseFloat(getComputedStyle(gallery).paddingLeft) || 0;
    const viewportW = document.documentElement.clientWidth || window.innerWidth;
    const lastW = last.getBoundingClientRect().width;
    const trailing = Math.max(0, viewportW - inset - lastW);

    gallery.style.setProperty('--gallery-trailing', `${Math.round(trailing)}px`);
  };

  // Recompute when images load (sizes become known).
  gallery.querySelectorAll('img').forEach((img) => {
    img.addEventListener('load', schedule, { once: true });
  });

  window.addEventListener('resize', schedule);
  try{
    const ro = new ResizeObserver(schedule);
    ro.observe(gallery);
  }catch(e){
    // Ignore if ResizeObserver is unavailable.
  }

  schedule();
}

export async function renderAbout({ lang }){
  const locale = lang === 'de' ? 'de-DE' : 'en-US';

  const { data: about, t } = await loadBundle(lang, 'about');
  setTitle(t('pageTitle'));

  const meta = about?.meta ?? {};

  const priorities = Array.isArray(about?.priorities) ? about.priorities.filter(Boolean) : [];
  const aboutMe = typeof about?.aboutMe === 'string' ? about.aboutMe.trim() : '';

  const introSide = el('div', { class: 'card panel' }, [
    el('div', { class: 'panel__inner' }, [
      priorities.length
        ? el('div', { class: 'kv' }, [
            el('div', { class: 'kv__label', text: t('prioritiesLabel') }),
            el('div', { class: 'kv__value' }, [
              el('ul', { class: 'list' }, priorities.map((item) => el('li', { text: String(item) })))
            ])
          ])
        : null
    ].filter(Boolean))
  ]);

  const hero = el('section', { class: 'card hero' }, [
    el('h1', { class: 'h1', text: meta.name ?? 'Moritz Kobler' }),
    el('p', { class: 'overview', text: `${meta.title ?? ''}${meta.location ? ` · ${meta.location}` : ''}`.trim() }),
    el('p', { class: 'p', text: about?.summary ?? '' }),
    aboutMe
      ? el('div', { class: 'hero-about' }, [
          el('div', { class: 'kv__label', text: t('aboutMeLabel') }),
          el('p', { class: 'p', text: aboutMe })
        ])
      : null,
    el('div', { class: 'chips' }, [
      meta.linkedin ? el('a', { class: 'chip', href: meta.linkedin, target: '_blank', rel: 'noreferrer', text: t('chipLinkedIn') }) : null,
      meta.cvPdf ? el('a', { class: 'chip', href: meta.cvPdf, download: '', text: t('chipDownloadCv') }) : null
    ].filter(Boolean))
  ].filter(Boolean));

  const introGrid = el('div', { class: 'grid' }, [
    el('div', {}, [hero]),
    el('div', {}, [introSide])
  ]);

  const experience = Array.isArray(about?.experience) ? about.experience : [];
  const expGallery = el('div', { class: 'gallery gallery--lg' }, experience.map((r) => {
    const dates = formatMonthRange(r.startDate, r.endDate, locale);
    const duration = formatDurationCompact(r.startDate, r.endDate);
    const latestRole = Array.isArray(r.roles) && r.roles.length ? r.roles[r.roles.length - 1] : (r.role ?? '');
    const previousRoles = Array.isArray(r.roles) && r.roles.length > 1 ? r.roles.slice(0, -1) : [];

    const paragraphs = Array.isArray(r.text)
      ? r.text
      : (typeof r.text === 'string' && r.text.trim() ? [r.text] : []);

    const highlightType = r.highlightType === 'ordered' ? 'ordered' : 'unordered';
    const listTag = highlightType === 'ordered' ? 'ol' : 'ul';

    const dateMeta = duration
      ? el('div', { class: 'muted card-head__meta' }, [
          el('span', { class: 'card-head__duration', text: duration }),
          ' · ',
          el('span', { class: 'card-head__range', text: dates })
        ])
      : el('div', { class: 'muted card-head__meta', text: dates });

    const card = el('article', { class: 'gallery-card', tabindex: '-1', onclick: onGalleryCardClick }, [
      el('div', { class: 'card-row card-head' }, [
        renderLogo(r.logo, r.company, 'logo--exp'),
        el('div', { class: 'card-row__body card-head__body' }, [
          el('div', { class: 'card-head__top' }, [
            el('div', { class: 'muted card-head__label card-head__org' }, [renderLinkOut(r.company ?? '', r.link, 'muted')]),
            dateMeta
          ]),
          el('div', { class: 'card-head__main' }, [
            el('h2', { class: 'h2 card-head__title', text: latestRole }),
            previousRoles.length ? el('div', { class: 'muted card-head__sub', text: previousRoles.join(' · ') }) : null
          ].filter(Boolean))
        ])
      ]),
      ...paragraphs.map((t) => el('p', { class: 'exp-text', text: t })),
      el(listTag, { class: 'exp-highlights' }, (r.highlights ?? []).map((h) => el('li', { text: h })))
    ]);
    applyGlowSeed(card, r.id || `${r.company || ''}-${latestRole}`);
    return card;
  }));
  const expSection = el('section', {}, [
    el('div', { class: 'section-title', text: t('sectionWorkExperience') }),
    el('div', { class: 'carousel' }, [expGallery])
  ]);
  attachCarousel(expSection.querySelector('.carousel'));

  const education = Array.isArray(about?.education) ? about.education : [];
  const volunteering = Array.isArray(about?.volunteering) ? about.volunteering : [];
  const eduVolItems = [
    ...education.map((r) => ({ kind: 'education', data: r })),
    ...volunteering.map((v) => ({ kind: 'volunteering', data: v }))
  ];

  const eduVolGallery = el('div', { class: 'gallery gallery--lg' }, eduVolItems.map((item) => {
    if (item.kind === 'education'){
      const r = item.data;
      const dates = formatMonthRange(r.startDate, r.endDate, locale);
      const card = el('article', { class: 'gallery-card', tabindex: '-1', onclick: onGalleryCardClick }, [
        el('div', { class: 'card-row card-head' }, [
          renderLogo(r.logo, r.institution),
          el('div', { class: 'card-row__body card-head__body' }, [
            el('div', { class: 'card-head__top' }, [
              el('div', { class: 'muted card-head__label card-head__org' }, [renderLinkOut(r.institution ?? '', r.link, 'muted')]),
              el('div', { class: 'muted card-head__meta', text: dates })
            ]),
            el('div', { class: 'card-head__main' }, [
              el('h2', { class: 'h2 card-head__title', text: r.degree ?? '' }),
              r.focus ? el('div', { class: 'muted card-head__sub', text: r.focus }) : null
            ].filter(Boolean))
          ])
        ]),
        el('ul', {}, (r.details ?? []).map((d) => el('li', { text: d })))
      ]);
      applyGlowSeed(card, r.id || `${r.institution || ''}-${r.degree || ''}`);
      return card;
    }

    const v = item.data;
    const dates = formatMonthRange(v.startDate, v.endDate, locale);
    const link = v.link ?? v.url;
    const card = el('article', { class: 'gallery-card', tabindex: '-1', onclick: onGalleryCardClick }, [
      el('div', { class: 'card-row card-head' }, [
        renderLogo(v.image, v.organization),
        el('div', { class: 'card-row__body card-head__body' }, [
          el('div', { class: 'card-head__top' }, [
            el('div', { class: 'muted card-head__label card-head__org' }, [renderLinkOut(v.organization ?? '', link, 'muted')]),
            el('div', { class: 'muted card-head__meta', text: dates })
          ]),
          el('div', { class: 'card-head__main' }, [
            el('h2', { class: 'h2 card-head__title', text: v.role ?? '' }),
            v.cause ? el('div', { class: 'muted card-head__sub', text: v.cause }) : null
          ].filter(Boolean))
        ])
      ]),
      el('ul', {}, (v.highlights ?? []).map((h) => el('li', { text: h })))
    ]);
    applyGlowSeed(card, v.id || `${v.organization || ''}-${v.role || ''}`);
    return card;
  }));

  const eduVolSection = eduVolItems.length ? el('section', {}, [
    el('div', { class: 'section-title', text: t('sectionEducationVolunteering') }),
    el('div', { class: 'carousel' }, [eduVolGallery])
  ]) : null;
  if (eduVolSection) attachCarousel(eduVolSection.querySelector('.carousel'));

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

    const link = r.link ?? r.profileUrl;
    const card = el('article', { class: 'gallery-card', tabindex: '-1', onclick: onGalleryCardClick }, [
      el('div', { class: 'card-row card-head' }, [
        r.image ? el('img', { class: 'ref-photo', src: r.image, alt: r.name ?? '' }) : renderLogo(null, r.name),
        el('div', { class: 'card-row__body card-head__body' }, [
          el('div', { class: 'card-head__top' }, [
            el('div', { class: 'muted card-head__label card-head__org', text: r.title ?? '' }),
            el('div', { class: 'muted card-head__meta', text: dateLabel })
          ]),
          el('div', { class: 'card-head__main' }, [
            el('h2', { class: 'h2 card-head__title' }, [renderLinkOut(r.name ?? '', link, '')]),
            r.relation ? el('div', { class: 'muted card-head__sub', text: r.relation }) : null
          ].filter(Boolean))
        ])
      ]),
      el('p', { class: 'muted', text: r.text ?? '' }),
    ].filter(Boolean));
    applyGlowSeed(card, r.id || r.profileUrl || r.name || 'reference');
    return card;
  }));
  const referencesSection = references.length ? el('section', {}, [
    el('div', { class: 'section-title', text: t('sectionReferences') }),
    el('div', { class: 'carousel' }, [referencesGallery])
  ]) : null;
  if (referencesSection) attachCarousel(referencesSection.querySelector('.carousel'));

  const skills = Array.isArray(about?.skills) ? about.skills : [];
  const skillsSection = el('section', {}, [
    el('div', { class: 'section-title', text: t('sectionSkillsTools') }),
    skills.length === 0
      ? el('p', { class: 'muted', text: t('emptySkills') })
      : (typeof skills[0] === 'object' && skills[0] && Array.isArray(skills[0].items))
        ? el('div', { class: 'stack' }, skills.map((g) => {
            const items = Array.isArray(g.items) ? g.items : [];
            return el('div', { class: 'card panel' }, [
              el('div', { class: 'panel__inner' }, [
                el('div', { class: 'muted', text: g.group ?? '' }),
                el('div', { class: 'icon-grid' }, items.map((s) => {
                  const isObj = typeof s === 'object' && s;
                  const name = typeof s === 'string' ? s : (s?.name ?? '');
                  const src = isObj ? s?.icon : null;
                  const notes = isObj && typeof s?.notes === 'string' ? s.notes.trim() : '';

                  return el('div', { class: 'icon-item' }, [
                    renderLogo(src || iconDataUrl(name, name), name, 'logo--skill'),
                    el('div', { class: 'icon-text' }, [
                      el('div', { class: 'icon-label', text: name }),
                      notes ? el('div', { class: 'icon-notes', text: notes }) : null
                    ].filter(Boolean))
                  ]);
                }))
              ])
            ]);
          }))
        : el('div', { class: 'icon-grid' }, skills.map((s) => {
            const isObj = typeof s === 'object' && s;
            const name = typeof s === 'string' ? s : (s?.name ?? '');
            const src = isObj ? s?.icon : null;
            const notes = isObj && typeof s?.notes === 'string' ? s.notes.trim() : '';
            return el('div', { class: 'icon-item' }, [
              renderLogo(src || iconDataUrl(name, name), name),
              el('div', { class: 'icon-text' }, [
                el('div', { class: 'icon-label', text: name }),
                notes ? el('div', { class: 'icon-notes', text: notes }) : null
              ].filter(Boolean))
            ]);
          }))
  ]);

  const contact = about?.contact ?? {};
  const contactSection = el('section', {}, [
    el('div', { class: 'section-title', text: t('sectionContact') }),
    el('div', {}, [
      meta.linkedin ? el('p', { class: 'muted' }, [el('a', { href: meta.linkedin, target: '_blank', rel: 'noreferrer', text: t('chipLinkedIn') })]) : null,
      contact.email ? el('p', { class: 'muted' }, [el('a', { href: `mailto:${contact.email}`, text: contact.email })]) : null,
      contact.phone ? el('p', { class: 'muted' }, [el('a', { href: `tel:${contact.phone.replace(/\s+/g, '')}`, text: contact.phone })]) : null,
      contact.linkedinText && !meta.linkedin ? el('p', { class: 'muted', text: contact.linkedinText }) : null
    ])
  ]);

  return el('div', { class: 'container' }, [introGrid, expSection, eduVolSection, referencesSection, skillsSection, contactSection].filter(Boolean));
}

export async function renderProjects({ lang }){
  const { data, t } = await loadBundle(lang, 'projects');
  setTitle(t('pageTitle'));
  const projects = Array.isArray(data?.projects) ? data.projects : [];

  const header = el('header', { class: 'page-head' }, [
    el('h1', { class: 'h1', text: t('heroTitle') }),
    el('p', { class: 'p', text: t('heroSubtitle') })
  ]);

  const list = el('section', { class: 'grid-cards' }, projects.map((p) => {
    const href = `/projects/apps/${encodeURIComponent(p.slug)}`;
    const type = String(p.type ?? '').trim();
    return el('a', { class: 'card card-link project-card', href, 'data-link': 'true' }, [
      el('div', { class: 'card-row card-head project-card__head' }, [
        renderLogo(iconDataUrl(p.slug ?? '', p.name ?? ''), p.name ?? '', 'logo--project'),
        el('div', { class: 'card-row__body card-head__body' }, [
          el('div', { class: 'card-head__top' }, [
            el('div', { class: 'muted card-head__label card-head__label--compact', text: type ? type.toUpperCase() : '' }),
            el('div', { class: 'muted card-head__meta', text: p.status ?? '' })
          ]),
          el('div', { class: 'card-head__main' }, [
            el('h2', { class: 'h2 card-head__title', text: p.name ?? '' }),
            p.shortDescription ? el('div', { class: 'muted card-head__sub', text: p.shortDescription }) : null
          ].filter(Boolean))
        ])
      ])
    ]);
  }));

  return el('div', { class: 'container' }, [header, list]);
}

export async function renderProjectDetail({ lang, slug }){
  setTitle(slug);
  const { data, t, tf } = await loadBundle(lang, 'projects');
  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const project = projects.find((p) => p.slug === slug);

  if (!project){
    return el('div', { class: 'container' }, [
      el('section', { class: 'card hero' }, [
        el('h1', { class: 'h1', text: t('notFoundTitle') }),
        el('p', { class: 'p', text: t('notFoundBody') }),
        el('p', { class: 'muted' }, [
          el('a', { href: '/projects', 'data-link': 'true', text: t('notFoundBackLink') })
        ])
      ])
    ]);
  }

  const supportEmail = project.supportEmail;
  const screenshots = Array.isArray(project.screenshots)
    ? project.screenshots.filter((s) => typeof s === 'string' && s.trim().length > 0)
    : [];
  const ios = project?.appStoreLinks?.ios;
  const android = project?.appStoreLinks?.android;

  const typeLabel = String(project.type ?? t('detailTypeFallback')).trim();

  const screenshotsSection = el('section', {}, [
    el('div', { class: 'section-title', text: t('sectionScreenshots') }),
    screenshots.length === 0
      ? el('p', { class: 'muted', text: t('emptyScreenshots') })
      : (() => {
          const gallery = el('div', { class: 'gallery gallery--lg gallery--shots' }, screenshots.map((src, idx) =>
            el('article', { class: 'gallery-card gallery-card--shot', tabindex: '-1', onclick: onGalleryCardClick }, [
              el('img', {
                class: 'shot shot--carousel',
                src,
                alt: tf('screenshotAlt', {
                  name: project.name ?? t('appFallbackName'),
                  index: idx + 1
                })
              })
            ])
          ));
          const carousel = el('div', { class: 'carousel carousel--shots' }, [gallery]);
          attachCarousel(carousel);
          return carousel;
        })()
  ]);

  return el('div', { class: 'container' }, [
    el('a', { class: 'back-link', href: '/projects', 'data-link': 'true' }, [
      renderChevronIcon('left'),
      el('span', { text: t('backToProjects') })
    ]),
    el('section', { class: 'card hero' }, [
      el('div', { class: 'project-meta' }, [
        el('span', { class: 'meta-tag', text: typeLabel ? typeLabel.toUpperCase() : '' }),
        project.status ? el('span', { class: 'muted project-meta__status', text: project.status }) : null
      ].filter(Boolean)),
      el('div', { class: 'project-hero' }, [
        renderLogo(iconDataUrl(project.slug ?? '', project.name ?? ''), project.name ?? '', 'logo--project-lg'),
        el('div', {}, [
          el('h1', { class: 'h1', text: project.name ?? '' }),
          el('p', { class: 'p', text: project.longDescription ?? '' })
        ])
      ]),
      el('div', { class: 'chips' }, [
        ios ? el('a', { class: 'chip', href: ios, target: '_blank', rel: 'noreferrer', text: 'iOS' }) : null,
        android ? el('a', { class: 'chip', href: android, target: '_blank', rel: 'noreferrer', text: 'Android' }) : null
      ].filter(Boolean))
    ]),

    screenshotsSection,

    el('section', {}, [
      el('div', { class: 'section-title', text: t('sectionAppStores') }),
      (ios || android)
        ? el('div', { class: 'chips' }, [
            ios ? el('a', { class: 'chip', href: ios, target: '_blank', rel: 'noreferrer', text: t('openOnIos') }) : null,
            android ? el('a', { class: 'chip', href: android, target: '_blank', rel: 'noreferrer', text: t('openOnAndroid') }) : null
          ].filter(Boolean))
        : el('p', { class: 'muted', text: t('emptyStoreLinks') })
    ]),

    el('section', {}, [
      el('div', { class: 'section-title', text: t('sectionSupport') }),
      el('p', { class: 'muted' }, [
        supportEmail ? el('a', { href: `mailto:${supportEmail}`, text: supportEmail }) : document.createTextNode(t('emptySupportEmail'))
      ])
    ]),
    el('section', {}, [
      el('div', { class: 'section-title', text: t('sectionPrivacy') }),
      el('p', { class: 'p', text: project.privacy ?? '' })
    ])
  ]);
}

export async function renderPrivacy({ lang }){
  const { t } = await loadBundle(lang, 'privacy');
  setTitle(t('pageTitle'));
  return el('div', { class: 'container' }, [
    el('section', { class: 'card hero' }, [
      el('h1', { class: 'h1', text: t('heroTitle') }),
      el('p', { class: 'p', text: t('heroBody') })
    ])
  ]);
}

export async function renderNotFound({ lang, path }){
  const { t, tf } = await loadBundle(lang, 'site');
  setTitle('404');
  return el('div', { class: 'container' }, [
    el('section', { class: 'card hero' }, [
      el('h1', { class: 'h1', text: t('notFoundHeroTitle') }),
      el('p', { class: 'p', text: tf('notFoundBody', { path }) }),
      el('p', { class: 'muted' }, [
        el('a', { href: '/about-me', 'data-link': 'true', text: t('notFoundBackHome') })
      ])
    ])
  ]);
}
