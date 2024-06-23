import { importKeyset } from './importKeyset';

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

describe('core/helpers/importKeyset', () => {
    it('should return keyset from module files', async () => {
        expect(
            await importKeyset('./importKeyset.test.moduleExample.ts'),
        ).toEqual(keyset);
    });

    it('should return keyset from commonjs files', async () => {
        expect(
            await importKeyset('./importKeyset.test.commonExample.ts'),
        ).toEqual(keyset);
    });
});
