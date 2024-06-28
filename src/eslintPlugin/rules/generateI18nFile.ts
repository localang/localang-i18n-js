import type { Rule } from 'eslint';
import fs from 'fs';
import type { Config } from '../index';
import { isPlural } from '../../helpers/string/isPlural';
import path from 'path';
import { parseContent } from '../../core';

const moduleImportTemplate = "import { makeI18n } from 'localang-i18n-js';";
const moduleExportTemplate = 'export const i18n = makeI18n(keyset);';

const commonJSImportTemplate =
    "const { makeI18n } = require('localang-i18n-js');";
const commonJSExportTemplate = 'module.exports = makeI18n(keyset);';

const getModuleImportFromI18nFileTemplate = (i18nFileName: string) =>
    `import { i18n } from './${i18nFileName}';\n`;
const getCommonJSImportFromI18nFileTemplate = (i18nFileName: string) =>
    `const i18n = require('./${i18nFileName}');\n`;

const importExportTemplates = {
    module: {
        importT: moduleImportTemplate,
        exportT: moduleExportTemplate,
        getImportFromI18nFileT: getModuleImportFromI18nFileTemplate,
    },
    commonjs: {
        importT: commonJSImportTemplate,
        exportT: commonJSExportTemplate,
        getImportFromI18nFileT: getCommonJSImportFromI18nFileTemplate,
    },
};

/**
 * Trying to parse i18n file.
 * @param fileName - Name of i18n file
 * @returns Parsed keyset or empty object
 */
function loadKeyset(fileName: string) {
    if (fs.existsSync(fileName)) {
        const content = fs.readFileSync(fileName, 'utf8');

        return parseContent(content);
    }

    return {};
}

/**
 * Saves keyset to i18n file.
 * @param fileName - Name of i18n file
 * @param keyset - Translations
 * @param exportT - String with export of keyset
 * @param importT - String with import of makeI18n function
 */
function saveKeyset({
    fileName,
    keyset,
    exportT,
    importT,
}: {
    fileName: string;
    keyset: Record<string, unknown>;
    importT: string;
    exportT: string;
}) {
    fs.writeFileSync(
        fileName,
        `${importT}\n\nconst keyset = ${JSON.stringify(
            keyset,
            null,
            4,
        )};\n\n${exportT}\n`,
    );
}

/**
 * Deletes file with keyset if it exists.
 * @param fileName - I18n file
 */
function removeKeyset(fileName: string) {
    if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName);
    }
}

/**
 * Adds import of i18n function from i18n file.
 * @param baseFile
 * @param importT
 */
function addI18nFileImportStatement(baseFile: string, importT: string) {
    const content = fs.readFileSync(baseFile, 'utf8');

    const importRegex =
        /import\s*\{\s*i18n\s*\}\s*from\s*['"]\..*\.i18n\.js['"]\s*;/;
    const requireRegex =
        /const\s*{\s*i18n\s*}\s*=\s*require\s*\(['"]\..*\.i18n\.js['"]\)\s*;/;

    if (!importRegex.test(content) && !requireRegex.test(content)) {
        fs.writeFileSync(baseFile, importT + content);
    }
}

/**
 * Builds rule which generates i18n files.
 * @param keyLanguage  Language which uses key
 * @param langs        Available languages
 * @param fileExt      I18n file extension
 * @param importType   Type of import and exports
 */
export const createGenerateI18nFileRule = ({
    keyLanguage,
    langs,
    fileExt,
    importType,
}: Required<Config>): Rule.RuleModule => ({
    create(context) {
        const usedKeys: Set<string> = new Set();

        const { importT, exportT, getImportFromI18nFileT } =
            importExportTemplates[importType];

        return {
            'CallExpression'(node) {
                if (
                    'name' in node.callee &&
                    node.callee?.name === 'i18n' &&
                    node.arguments.length >= 1 &&
                    node.arguments[0]?.type === 'Literal' &&
                    typeof node.arguments[0].value === 'string' &&
                    !context.filename.includes('.i18n.')
                ) {
                    usedKeys.add(node.arguments[0].value);
                }
            },
            'Program:exit'() {
                const fileName = context.filename.substring(
                    0,
                    context.filename.lastIndexOf('.'),
                );
                const i18nFileName = `${fileName}.i18n.${fileExt}`;
                const existingKeyset = loadKeyset(i18nFileName);
                const updatedKeyset = { ...existingKeyset };

                usedKeys.forEach((key) => {
                    if (!updatedKeyset[key]) {
                        const isKeyPlural = isPlural(key);

                        updatedKeyset[key] = {};

                        langs.forEach((lang) => {
                            const translation = lang === keyLanguage ? key : '';

                            // @ts-expect-error -- TODO: TS2532: Object is possibly undefined
                            updatedKeyset[key][lang] = isKeyPlural
                                ? {
                                      zero: translation,
                                      one: translation,
                                      two: translation,
                                      few: translation,
                                      many: translation,
                                      other: translation,
                                  }
                                : translation;
                        });
                    }
                });

                Object.keys(existingKeyset).forEach((key) => {
                    if (!usedKeys.has(key)) {
                        delete updatedKeyset[key];
                    }
                });

                if (Object.keys(updatedKeyset).length === 0) {
                    removeKeyset(i18nFileName);
                } else {
                    saveKeyset({
                        fileName: i18nFileName,
                        keyset: updatedKeyset,
                        importT,
                        exportT,
                    });

                    addI18nFileImportStatement(
                        context.filename,
                        getImportFromI18nFileT(path.basename(i18nFileName)),
                    );
                }
            },
        };
    },
});
