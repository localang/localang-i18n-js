import { Api } from './index';

describe('core/builder/index', () => {
    const keyset = {
        'What is love?': {
            en: 'What is love?',
            ru: 'Что такое любовь?',
        },
    };

    const { setSettings, makeI18n } = new Api();

    it('should have default language', () => {
        const i18n = makeI18n(keyset);
        expect(i18n('What is love?')).toBe('What is love?');
    });

    it('should set language and return correct translation', () => {
        setSettings({ lang: 'ru' });
        const i18n = makeI18n(keyset);
        expect(i18n('What is love?')).toBe('Что такое любовь?');
    });
});
