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
    /**
     * Import/export type for i18n files
     * @default module
     */
    importType?: 'module' | 'commonjs';
}
/**
 * Creates ESLint plugin to generate I18n files.
 */
export declare const createEslintPlugin: ({ keyLanguage, langs, fileExt, importType, }?: Config) => ESLint.Plugin;
//# sourceMappingURL=index.d.ts.map