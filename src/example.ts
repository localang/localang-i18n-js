// TODO: remove file
import { makeI18n } from 'localang';
import type { Keyset } from './core/builder/types';

const keyset: Keyset = {
    'What is love?': {
        en: 'What is love?',
        ru: 'Шо це любовь?',
    },
    '{count} left': {
        en: {
            zero: 'Ничего не осталось',
            one: 'мало',
            two: 'пара',
            few: 'неплохо',
            many: 'УХ',
            other: 'мде',
        },
        ru: {
            zero: 'Ничего не осталось',
            one: 'мало',
            two: 'пара',
            few: 'неплохо',
            many: 'УХ',
            other: 'мде',
        },
    },
};

export const i18n = makeI18n(keyset);
