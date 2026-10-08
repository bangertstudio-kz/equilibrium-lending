import ru from './locales/ru.json';
import en from './locales/en.json';
import kk from './locales/kk.json';
import pt from './locales/pt.json';
import es from './locales/es.json';

export const LOCALES = ['ru', 'en', 'kk', 'pt', 'es', 'meow'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ru';

/** Real languages: they get hreflang links and are indexed. 'meow' is a joke. */
export const INDEXED_LOCALES = LOCALES.filter((l) => l !== 'meow');

/** The locale to hand to Intl (dates): cats read English calendars. */
export const intlLocale = (locale: Locale) => (locale === 'meow' ? 'en' : locale);

/** Switcher labels, written in their own language. */
export const LOCALE_LABELS: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
  kk: 'Қазақша',
  pt: 'Português',
  es: 'Español',
  meow: 'Meow 🐾',
};

export const HTML_LANG: Record<Locale, string> = {
  ru: 'ru-RU', en: 'en-US', kk: 'kk-KZ', pt: 'pt-PT', es: 'es-ES', meow: 'en-x-meow',
};
export const OG_LOCALES: Record<Locale, string> = {
  ru: 'ru_RU', en: 'en_US', kk: 'kk_KZ', pt: 'pt_PT', es: 'es_ES', meow: 'en_US',
};

/** Names and terms cats leave alone, so the page still says what it is. */
const KEEP = new Set([
  'equilibrium', 'app', 'store', 'iphone', 'ipad', 'mac', 'web', 'mcp', 'claude',
  'cursor', 'code', 'desktop', 'telegram', 'appmetrica', 'amplitude', 'hugging',
  'face', 'yandex', 'webvisor', 'bangert', 'studio', 'ip', 'id', 'ai', 'macos',
]);
const SOUNDS = ['meow', 'mew', 'mrrp', 'purr', 'nya', 'mrow', 'prrr', 'meep'];

/** One English word → a cat sound of a similar length, same capitalisation. */
function meowWord(word: string): string {
  if (KEEP.has(word.toLowerCase())) return word;
  // FNV-1a: mixes all bits, so every sound turns up about as often.
  let h = 2166136261;
  for (const ch of word.toLowerCase()) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  let sound = SOUNDS[h % SOUNDS.length];
  if (word.length > 7) sound = sound.replace(/[eaoru]/, (v) => v.repeat(Math.min(5, word.length - 5)));
  if (word.length > 1 && word === word.toUpperCase()) return sound.toUpperCase();
  return /\p{Lu}/u.test(word[0]) ? sound[0].toUpperCase() + sound.slice(1) : sound;
}

/** Meowifies every string, keeping {placeholders}, numbers and punctuation. */
function meowify(node: unknown): unknown {
  if (typeof node === 'string') {
    return node
      .split(/(\{\w+\})/)
      .map((part) => (part.startsWith('{') ? part : part.replace(/\p{L}[\p{L}'’]*/gu, meowWord)))
      .join('');
  }
  if (Array.isArray(node)) return node.map(meowify);
  if (node && typeof node === 'object') {
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, meowify(v)]));
  }
  return node;
}

const messages: Record<Locale, unknown> = { ru, en, kk, pt, es, meow: meowify(en) };

/** Formats a date in the page's language; the cat page gets cat words. */
export function formatDate(locale: Locale, date: Date, options: Intl.DateTimeFormatOptions): string {
  const text = new Intl.DateTimeFormat(intlLocale(locale), options).format(date);
  return locale === 'meow' ? (meowify(text) as string) : text;
}

/**
 * The only place a page path is built, so canonical, hreflang and links
 * agree. `page` is '' for home, '/privacy', '/support'.
 */
export function pathFor(locale: Locale, page = ''): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return prefix + page || '/';
}

/** `t('ai.create', { n: 3 })` — dotted key, `{name}` placeholders. */
export function useT(locale: Locale) {
  return (key: string, params: Record<string, string | number> = {}): string => {
    const value = key
      .split('.')
      .reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], messages[locale]);
    if (typeof value !== 'string') throw new Error(`Missing translation ${locale}:${key}`);
    return value.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ''));
  };
}

/** Structured content (lists, FAQ, sections) for pages that iterate it. */
export function messagesFor(locale: Locale): any {
  return messages[locale];
}
