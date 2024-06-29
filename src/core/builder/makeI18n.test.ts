import { makeI18n } from './makeI18n';

describe('core/builder/makeI18n', () => {
    const keyset = {
        'What is love?': {
            ar: 'What is love?',
            ru: 'Что такое любовь?',
        },
        '{count} left': {
            ar: {
                zero: 'Nothing left',
                one: 'One left',
                two: 'Two left',
                few: 'A few left',
                many: 'Many left',
                other: '{count} left',
            },
            ru: {
                zero: 'Ничего не осталось',
                one: 'мало',
                two: 'пара',
                few: 'неплохо',
                many: 'wow',
                other: 'мде',
            },
        },
    };

    it('should return simple translation without placeholders', () => {
        const i18n = makeI18n('ar', keyset);
        expect(i18n('What is love?')).toBe('What is love?');
    });

    it('should return empty string for missing translation key', () => {
        const i18n = makeI18n('ar', keyset);
        expect(i18n('Missing key')).toBe('');
    });

    it('should return correct plural form for count = 0', () => {
        const i18n = makeI18n('ar', keyset);
        expect(i18n('{count} left', { count: 0 })).toBe('Nothing left');
    });

    it('should return correct plural form for count = 1', () => {
        const i18n = makeI18n('ar', keyset);
        expect(i18n('{count} left', { count: 1 })).toBe('One left');
    });

    it('should return correct plural form for count = 2', () => {
        const i18n = makeI18n('ar', keyset);
        expect(i18n('{count} left', { count: 2 })).toBe('Two left');
    });

    it('should return correct plural form for count = 3', () => {
        const i18n = makeI18n('ar', keyset);
        expect(i18n('{count} left', { count: 3 })).toBe('A few left');
    });

    it('should return correct plural form for count = 5', () => {
        const i18n = makeI18n('ar', keyset);
        expect(i18n('{count} left', { count: 5 })).toBe('A few left');
    });

    it('should return correct plural form for count = 10', () => {
        const i18n = makeI18n('ar', keyset);
        expect(i18n('{count} left', { count: 10 })).toBe('A few left');
    });

    it('should replace placeholders correctly', () => {
        const i18n = makeI18n('ar', keyset);
        expect(i18n('{count} left', { count: 10, name: 'John' })).toBe(
            'A few left',
        );
    });

    it('should handle missing placeholders gracefully', () => {
        const i18n = makeI18n('ar', keyset);
        expect(i18n('{count} left')).toBe('Nothing left');
    });
});
