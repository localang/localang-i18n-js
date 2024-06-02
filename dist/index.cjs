/*!
 * localang v0.0.1
 * (c) Localang
 * Released under the MIT License.
 */

'use strict';

var fs = require('fs');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Replaces placeholders in text with given values.
 * @param text          Text with placeholders
 * @param placeholders  Object with placeholders and values
 * @returns             Text with replaced placeholders
 */
var replacePlaceholders = function (text, placeholders) {
    if (placeholders === void 0) { placeholders = {}; }
    return text.replace(/\{(\w+)}/g, function (match, key) {
        return key in placeholders ? String(placeholders[key]) : match;
    });
};

/**
 * Creates function to work with translations.
 * @param lang - Current app language
 * @param keyset - Translations keyset
 * @param placeholders - Placeholders and its values
 * @returns - Function to work with translations.
 */
var makeI18n$1 = function (lang, keyset, placeholders) {
    return function (key) {
        var translations = keyset[key];
        if (!translations) {
            return '';
        }
        var translation = translations[lang];
        if (typeof translation === 'object' && translation !== null) {
            if (!placeholders) {
                return translation.zero;
            }
            var countKey = Object.keys(placeholders).find(function (key) {
                return /^count([0-9+]?)+$/.test(key);
            });
            var count = countKey && countKey in placeholders
                ? Number(placeholders[countKey]) || 0
                : 0;
            var pluralForm = count === 0 ? 'zero' : new Intl.PluralRules(lang).select(count);
            return replacePlaceholders(translation[pluralForm], placeholders);
        }
        return translation
            ? replacePlaceholders(translation, placeholders)
            : '';
    };
};

/**
 * Adds context wrapper to main function to store settings like app language.
 */
var Api = /** @class */ (function () {
    function Api() {
        this.settings = {
            lang: 'en',
        };
        this.setSettings = this.setSettings.bind(this);
        this.makeI18n = this.makeI18n.bind(this);
    }
    Api.prototype.setSettings = function (settings) {
        this.settings = __assign(__assign({}, this.settings), settings);
    };
    Api.prototype.makeI18n = function (keyset, placeholders) {
        return makeI18n$1(this.settings.lang, keyset, placeholders);
    };
    return Api;
}());

// TODO: comments
function loadKeyset(fileName) {
    if (fs.existsSync(fileName)) {
        return JSON.parse(fs
            .readFileSync(fileName, 'utf8')
            .replace(/export const keyset = |;/g, ''));
    }
    return {};
}
function saveKeyset(fileName, keyset) {
    fs.writeFileSync(fileName, "export const keyset = ".concat(JSON.stringify(keyset, null, 4), ";\n"));
}
function removeKeyset(fileName) {
    fs.unlinkSync(fileName);
}
var createGenerateI18nFileRule = function (_a) {
    var keyLanguage = _a.keyLanguage, langs = _a.langs, fileExt = _a.fileExt;
    return ({
        create: function (context) {
            var usedKeys = new Set();
            return {
                'CallExpression': function (node) {
                    var _a, _b;
                    if ('name' in node.callee &&
                        ((_a = node.callee) === null || _a === void 0 ? void 0 : _a.name) === 'i18n' &&
                        node.arguments.length === 1 &&
                        ((_b = node.arguments[0]) === null || _b === void 0 ? void 0 : _b.type) === 'Literal' &&
                        typeof node.arguments[0].value === 'string') {
                        usedKeys.add(node.arguments[0].value);
                    }
                },
                'Program:exit': function () {
                    var fileName = context.filename.substring(0, context.filename.lastIndexOf('.'));
                    var i18nFileName = "".concat(fileName, ".i18n.").concat(fileExt);
                    var existingKeyset = loadKeyset(i18nFileName);
                    var updatedKeyset = __assign({}, existingKeyset);
                    usedKeys.forEach(function (key) {
                        if (!updatedKeyset[key]) {
                            // TODO: is plural
                            updatedKeyset[key] = {};
                            langs.forEach(function (lang) {
                                updatedKeyset[key][lang] =
                                    lang === keyLanguage ? key : '';
                            });
                        }
                    });
                    Object.keys(existingKeyset).forEach(function (key) {
                        if (!usedKeys.has(key)) {
                            delete updatedKeyset[key];
                        }
                    });
                    if (Object.keys(updatedKeyset).length === 0) {
                        removeKeyset(i18nFileName);
                    }
                    else {
                        saveKeyset(i18nFileName, updatedKeyset);
                    }
                },
            };
        },
    });
};

/**
 * Creates ESLint plugin to generate I18n files.
 */
var createEslintPlugin = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.keyLanguage, keyLanguage = _c === void 0 ? 'en' : _c, _d = _b.langs, langs = _d === void 0 ? ['en'] : _d, _e = _b.fileExt, fileExt = _e === void 0 ? 'js' : _e;
    return ({
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
                keyLanguage: keyLanguage,
                langs: langs,
                fileExt: fileExt,
            }),
        },
    });
};

var _a;
var makeI18n = (_a = new Api(), _a.makeI18n), setSettings = _a.setSettings;

exports.createEslintPlugin = createEslintPlugin;
exports.makeI18n = makeI18n;
exports.setSettings = setSettings;
//# sourceMappingURL=index.cjs.map
