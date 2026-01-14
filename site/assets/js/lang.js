const STORAGE_KEY = 'mk_lang';

export function getLangFromUrl(){
  const url = new URL(window.location.href);
  const lang = url.searchParams.get('lang');
  if (lang === 'de' || lang === 'en') return lang;
  return null;
}

export function getStoredLang(){
  try{
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'de' || v === 'en') return v;
  }catch{ /* ignore */ }
  return null;
}

export function setStoredLang(lang){
  try{ localStorage.setItem(STORAGE_KEY, lang); }catch{ /* ignore */ }
}

export function resolveLang(){
  return getLangFromUrl() ?? getStoredLang() ?? 'en';
}

export function applyLangToDocument(lang){
  document.documentElement.lang = lang;
}

export function wireLangToggle(lang, onChange){
  const toggle = document.querySelector('[data-lang-toggle]');
  if (toggle){
    const label = String(lang).toUpperCase();
    const next = lang === 'de' ? 'en' : 'de';

    toggle.textContent = label;
    toggle.setAttribute('aria-label', `Language: ${label}. Activate to switch to ${String(next).toUpperCase()}.`);

    toggle.addEventListener('click', () => onChange(next));
    return;
  }

  // Backward-compatible: multi-button picker
  const buttons = document.querySelectorAll('[data-lang]');
  buttons.forEach((btn) => {
    const v = btn.getAttribute('data-lang');
    btn.setAttribute('aria-pressed', v === lang ? 'true' : 'false');
    btn.addEventListener('click', () => {
      if (v !== 'de' && v !== 'en') return;
      onChange(v);
    });
  });
}
