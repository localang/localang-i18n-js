import { parseContent } from './parseContent';

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

const content = `import { makeI18n } from 'localang-i18n-js';

const keyset = ${JSON.stringify(keyset, null, 4)};

export i18n = makeI18n(keyset);
`;

describe('core/helpers/parseContent', () => {
    it('should return keyset', () => {
        expect(parseContent(content)).toEqual(keyset);
    });

    it('should return empty object when parsing is failed', () => {
        expect(parseContent('qwerty')).toEqual({});
    });
});
