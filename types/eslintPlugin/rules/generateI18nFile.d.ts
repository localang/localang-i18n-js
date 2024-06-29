import type { Rule } from 'eslint';
import type { Config } from '../index';
/**
 * Builds rule which generates i18n files.
 * @param keyLanguage - Language which uses key
 * @param langs - Available languages
 * @param fileExt - I18n file extension
 * @param importType - Type of import and exports
 */
export declare const createGenerateI18nFileRule: ({ keyLanguage, langs, fileExt, importType, }: Required<Config>) => Rule.RuleModule;
//# sourceMappingURL=generateI18nFile.d.ts.map