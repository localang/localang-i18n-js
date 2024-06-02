import type { ESLint } from 'eslint';
import type { Lang } from '../core/builder/types';
/** Plugin's config */
export interface Config {
    /**
     * Key will be the default translation for some language
     * @default en
     */
    keyLanguage?: Lang;
    /**
     * Languages in use
     * @default ['en']
     */
    langs?: Lang[];
    /**
     * Generated file extension
     * @default js
     */
    fileExt?: 'js' | 'ts';
}
/**
 * Creates ESLint plugin to generate I18n files.
 */
export declare const createEslintPlugin: ({ keyLanguage, langs, fileExt, }?: Config) => ESLint.Plugin;
//# sourceMappingURL=index.d.ts.map