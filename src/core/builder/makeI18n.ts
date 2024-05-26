import type { Keyset, Lang } from './types';
import { replacePlaceholders } from '../../helpers/string/replacePlaceholders';

type MakeI18nResponse = (key: string) => string;

/**
 * Creates function to work with translations.
 * @param lang - Current app language
 * @param keyset - Translations keyset
 * @param placeholders - Placeholders and its values
 * @returns - Function to work with translations.
 */
export const makeI18n = (
    lang: Lang,
    keyset: Keyset,
    placeholders?: Record<string, string | number>,
): MakeI18nResponse => {
    return (key: string) => {
        const translations = keyset[key];

        if (!translations) {
            return '';
        }

        const translation = translations[lang];

        if (typeof translation === 'object' && translation !== null) {
            if (!placeholders) {
                return translation.zero;
            }

            const countKey = Object.keys(placeholders).find((key) =>
                /^count([0-9+]?)+$/.test(key),
            );
            const count =
                countKey && countKey in placeholders
                    ? Number(placeholders[countKey]) || 0
                    : 0;
            const pluralForm =
                count === 0 ? 'zero' : new Intl.PluralRules(lang).select(count);

            return replacePlaceholders(translation[pluralForm], placeholders);
        }

        return translation
            ? replacePlaceholders(translation, placeholders)
            : '';
    };
};
