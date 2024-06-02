import type { Keyset, Lang } from './builder/types';
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
export declare class Api {
    settings: Settings;
    constructor();
    setSettings(settings: Partial<Settings>): void;
    makeI18n(keyset: Keyset, placeholders?: Record<string, string | number>): (key: string) => string;
}
export {};
//# sourceMappingURL=index.d.ts.map