import type { ESLint } from 'eslint';
import { createGenerateI18nFileRule } from './rules/generateI18nFile';
import type { Lang } from '../core/builder/types';

// TODO: import type
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
export const createEslintPlugin = ({
    keyLanguage = 'en',
    langs = ['en'],
    fileExt = 'js',
}: Config = {}): ESLint.Plugin => ({
    // TODO: will it work instead of `ignores` in index.test.eslint.config.js
    configs: {
        generateI18nFile: [
            {
                ignores: ['**/*.i18n.*'],
            },
        ],
    },
    rules: {
        'generate-i18n-file': createGenerateI18nFileRule({
            keyLanguage,
            langs,
            fileExt,
        }),
    },
});