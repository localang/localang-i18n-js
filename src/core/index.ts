import type { Keyset, Lang } from './builder/types';
import { makeI18n } from './builder/makeI18n';

export { importKeyset } from './helpers/importKeyset';
export { parseContent } from './helpers/parseContent';

type Settings = {
    /**
     * Project language
     * @default en
     */
    lang: Lang;
};

/**
 * Adds context wrapper to main function to store settings like app language.
 */
export class Api {
    settings: Settings;

    constructor() {
        this.settings = {
            lang: 'en',
        };

        this.setSettings = this.setSettings.bind(this);
        this.makeI18n = this.makeI18n.bind(this);
    }

    setSettings(settings: Partial<Settings>) {
        this.settings = {
            ...this.settings,
            ...settings,
        };
    }

    makeI18n(keyset: Keyset) {
        return makeI18n(this.settings.lang, keyset);
    }
}
