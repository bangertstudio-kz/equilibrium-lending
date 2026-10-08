import ru from './locales/ru.json';
import en from './locales/en.json';
import kk from './locales/kk.json';
import pt from './locales/pt.json';
import es from './locales/es.json';

export const LOCALES = ['ru', 'en', 'kk', 'pt', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ru';

/** Switcher labels, written in their own language. */
export const LOCALE_LABELS: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
  kk: 'Қазақша',
  pt: 'Português',
  es: 'Español',
};

export const HTML_LANG: Record<Locale, string> = {
  ru: 'ru-RU', en: 'en-US', kk: 'kk-KZ', pt: 'pt-PT', es: 'es-ES',
};
export const OG_LOCALES: Record<Locale, string> = {
  ru: 'ru_RU', en: 'en_US', kk: 'kk_KZ', pt: 'pt_PT', es: 'es_ES',
};

const messages: Record<Locale, unknown> = { ru, en, kk, pt, es };

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
