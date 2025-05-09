import { describe, it, expect } from 'vitest';
import removeUnusedLanguages from '../remove-unused-languages';

describe('removeUnusedLanguages', () => {
    const plugin = removeUnusedLanguages({ lang: 'en' });

    it('should remove non-target languages from i18n files', () => {
        const input = `
            import { makeI18n } from 'localang-i18n-js';
            // or const { makeI18n } = require('localang-i18n-js');

            const keyset = {
                'What is love?': {
                    en: 'What is love?',
                    ar: 'ما هو الحب؟',
                },
                '{count} left': {
                    en: {
                        zero: 'Nothing left',
                        one: 'One left',
                        two: 'Two left',
                        few: 'A few left',
                        many: 'Many left',
                        other: '{count} left',
                    },
                    ar: {
                        zero: 'ليس لديك شيء',
                        one: '',
                        two: '',
                        few: '',
                        many: '',
                        other: ''
                    },
                },
            };

            export const i18n = makeI18n(keyset);
            // or module.exports = makeI18n(keyset);
        `;

        const result = plugin.transform(input, 'test.i18n.js');

        expect(result).not.toBeNull();
        expect(result.code).toContain('"en":');
        expect(result.code).not.toContain('"ar":');
        expect(result.code).toContain('What is love?');
        expect(result.code).toContain('Nothing left');
    });

    it('should not process non-i18n files', () => {
        const input = 'const x = 1;';
        const result = plugin.transform(input, 'test.js');
        expect(result).toBeNull();
    });

    it('should handle empty keyset', () => {
        const input = 'const keyset = {};';
        const result = plugin.transform(input, 'test.i18n.js');
        expect(result).not.toBeNull();
        expect(result.code).toBe(input);
    });

    it('should handle keyset with only target language', () => {
        const input = `
            const keyset = {
                'Hello': {
                    en: 'Hello'
                }
            };
        `;
        const result = plugin.transform(input, 'test.i18n.js');
        expect(result).not.toBeNull();
        expect(result.code).toContain('"en":');
        expect(result.code).toContain('Hello');
    });
});
