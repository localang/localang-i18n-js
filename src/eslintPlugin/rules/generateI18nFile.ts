import type { Rule } from 'eslint';
import fs from 'fs';
import type { Config } from '../index';
import { isPlural } from '../../helpers/string/isPlural';

// TODO: comments

function loadKeyset(fileName: string) {
    if (fs.existsSync(fileName)) {
        return JSON.parse(
            fs
                .readFileSync(fileName, 'utf8')
                .replace(/export const keyset = |;/g, ''),
        );
    }
    return {};
}

function saveKeyset(fileName: string, keyset: Record<string, unknown>) {
    fs.writeFileSync(
        fileName,
        `export const keyset = ${JSON.stringify(keyset, null, 4)};\n`,
    );
}

function removeKeyset(fileName: string) {
    if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName);
    }
}

export const createGenerateI18nFileRule = ({
    keyLanguage,
    langs,
    fileExt,
}: Required<Config>): Rule.RuleModule => ({
    create(context) {
        const usedKeys: Set<string> = new Set();

        return {
            'CallExpression'(node) {
                if (
                    'name' in node.callee &&
                    node.callee?.name === 'i18n' &&
                    node.arguments.length >= 1 &&
                    node.arguments[0]?.type === 'Literal' &&
                    typeof node.arguments[0].value === 'string'
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
                    saveKeyset(i18nFileName, updatedKeyset);
                }
            },
        };
    },
});
