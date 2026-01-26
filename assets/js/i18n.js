import { loadJson } from './data.js';

function isPlainObject(v){
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function mergePreferPrimary(primary, fallback){
  if (primary === undefined || primary === null) return fallback;
  if (Array.isArray(primary)) return primary;

  if (isPlainObject(primary) && isPlainObject(fallback)){
    const out = {};
    const keys = new Set([...Object.keys(fallback), ...Object.keys(primary)]);
    for (const k of keys){
      out[k] = mergePreferPrimary(primary[k], fallback[k]);
    }
    return out;
  }

  return primary;
}

function pickCopy(copy, key){
  if (!copy || typeof copy !== 'object') return key;
  const v = copy[key];
  return typeof v === 'string' ? v : key;
}

function formatCopy(template, vars){
  if (typeof template !== 'string') return String(template ?? '');
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) => {
    const value = vars?.[name];
    return value == null ? `{${name}}` : String(value);
  });
}

export async function loadBundle(lang, baseName){
  const primary = await loadJson(`/data/${baseName}.${lang}.json`);
  const fallback = lang === 'en' ? null : await loadJson(`/data/${baseName}.en.json`);
  const data = mergePreferPrimary(primary, fallback);
  const copy = (data && typeof data.copy === 'object' && data.copy) ? data.copy : {};
  const t = (key) => pickCopy(copy, key);
  const tf = (key, vars) => formatCopy(t(key), vars);
  return { data, copy, t, tf };
}
