const cache = new Map();

export async function loadJson(path){
  if (cache.has(path)) return cache.get(path);

  const p = (async () => {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
    const text = await res.text();
    try{
      return JSON.parse(text);
    }catch(e){
      throw new Error(`Invalid JSON in ${path}`);
    }
  })();

  cache.set(path, p);
  return p;
}

export function formatMonthRange(start, end, locale){
  const toLabel = (value) => {
    if (!value) return '';
    if (value === 'present') return locale === 'de' ? 'Heute' : 'Present';
    // Allow year-only values: YYYY
    if (/^\d{4}$/.test(value)) return value;
    // value expected: YYYY-MM
    const [y, m] = value.split('-').map((v) => Number(v));
    if (!y || !m) return value;
    const d = new Date(Date.UTC(y, m - 1, 1));
    return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(d);
  };

  const a = toLabel(start);
  const b = toLabel(end);
  if (!a && !b) return '';
  if (a && !b) return a;
  if (!a && b) return b;
  return `${a} – ${b}`;
}
