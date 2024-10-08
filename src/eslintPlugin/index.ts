import type { ESLint } from 'eslint';
import { createGenerateI18nFileRule } from './rules/generateI18nFile';
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
    /**
     * Automatically adds import i18n-function from a translation file.
     * May not work as expected in IDE with ESLint auto-correct via save
     * @default false
     */
    addI18nImportToBaseFile?: boolean;
}

/**
 * Creates ESLint plugin to generate I18n files.
 */
export const createEslintPlugin = ({
    keyLanguage = 'en',
    langs = ['en'],
    fileExt = 'js',
    importType = 'module',
    addI18nImportToBaseFile = false,
}: Config = {}): ESLint.Plugin => ({
    rules: {
        'generate-i18n-file': createGenerateI18nFileRule({
            keyLanguage,
            langs,
            fileExt,
            importType,
            addI18nImportToBaseFile,
        }),
    },
});
