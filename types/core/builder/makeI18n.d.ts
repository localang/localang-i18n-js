import type { Keyset, Lang } from './types';
type MakeI18nResponse = (key: string) => string;
/**
 * Creates function to work with translations.
 * @param lang - Current app language
 * @param keyset - Translations keyset
 * @param placeholders - Placeholders and its values
 * @returns - Function to work with translations.
 */
export declare const makeI18n: (lang: Lang, keyset: Keyset, placeholders?: Record<string, string | number>) => MakeI18nResponse;
export {};
//# sourceMappingURL=makeI18n.d.ts.map