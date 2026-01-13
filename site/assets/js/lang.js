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
