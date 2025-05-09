import { makeI18n } from 'localang-i18n-js';

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
            other: '',
        },
    },
};

export const i18n = makeI18n(keyset);
