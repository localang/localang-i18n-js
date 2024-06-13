/*!
 * localang v0.0.1
 * (c) Localang
 * Released under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var https = require('https');

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
 * Parses content from i18n file.
 * @param base - Base string content.
 * @returns - Keyset.
 */
var parseContent = function (baseContent) {
    // remove keyset initialization
    var content = baseContent.replace(/const keyset = |;/g, '');
    // remove import
    content = content.substring(content.indexOf('\n') + 1);
    // remove export
    content = content.substring(0, content.lastIndexOf('\n'));
    content = content.substring(0, content.lastIndexOf('\n'));
    var parsed = {};
    try {
        parsed = JSON.parse(content);
    }
    catch (_) {
        console.log('JSON parse error');
    }
    return parsed;
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

/**
 * Checks if the given text contains a plural placeholder.
 * A plural placeholder is defined as a string that starts with 'count' followed by an optional number.
 * @param text  The text to check for plural placeholders.
 * @returns     true if the text contains a plural placeholder, false otherwise.
 */
var isPlural = function (text) {
    return /\bcount\d*\b/.test(text);
};

// TODO: comments
var moduleImportTemplate = "import { makeI18n } from 'localang-i18n-js';";
var moduleExportTemplate = 'export const i18n = makeI18n(keyset);';
var commonJSImportTemplate = "const { makeI18n } = require('localang-i18n-js');";
var commonJSExportTemplate = 'module.exports = makeI18n(keyset);';
var getModuleImportFromI18nFileTemplate = function (i18nFileName) {
    return "import { i18n } from './".concat(i18nFileName, "';\n");
};
var getCommonJSImportFromI18nFileTemplate = function (i18nFileName) {
    return "const i18n = require('./".concat(i18nFileName, "');\n");
};
var importExportTemplates = {
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
function loadKeyset(fileName) {
    if (fs.existsSync(fileName)) {
        var content = fs.readFileSync(fileName, 'utf8');
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
function saveKeyset(_a) {
    var fileName = _a.fileName, keyset = _a.keyset, exportT = _a.exportT, importT = _a.importT;
    fs.writeFileSync(fileName, "".concat(importT, "\n\nconst keyset = ").concat(JSON.stringify(keyset, null, 4), ";\n\n").concat(exportT, "\n"));
}
/**
 * Deletes file with keyset if it exists.
 * @param fileName - I18n file
 */
function removeKeyset(fileName) {
    if (fs.existsSync(fileName)) {
        fs.unlinkSync(fileName);
    }
}
/**
 * Adds import of i18n function from i18n file.
 * @param baseFile
 * @param importT
 */
function addI18nFileImportStatement(baseFile, importT) {
    var content = fs.readFileSync(baseFile, 'utf8');
    var importRegex = /import\s*\{\s*i18n\s*\}\s*from\s*['"]\..*\.i18n\.js['"]\s*;/;
    var requireRegex = /const\s*{\s*i18n\s*}\s*=\s*require\s*\(['"]\..*\.i18n\.js['"]\)\s*;/;
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
var createGenerateI18nFileRule = function (_a) {
    var keyLanguage = _a.keyLanguage, langs = _a.langs, fileExt = _a.fileExt, importType = _a.importType;
    return ({
        create: function (context) {
            var usedKeys = new Set();
            var _a = importExportTemplates[importType], importT = _a.importT, exportT = _a.exportT, getImportFromI18nFileT = _a.getImportFromI18nFileT;
            return {
                'CallExpression': function (node) {
                    var _a, _b;
                    if ('name' in node.callee &&
                        ((_a = node.callee) === null || _a === void 0 ? void 0 : _a.name) === 'i18n' &&
                        node.arguments.length >= 1 &&
                        ((_b = node.arguments[0]) === null || _b === void 0 ? void 0 : _b.type) === 'Literal' &&
                        typeof node.arguments[0].value === 'string' &&
                        !context.filename.includes('.i18n.')) {
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
                            var isKeyPlural_1 = isPlural(key);
                            updatedKeyset[key] = {};
                            langs.forEach(function (lang) {
                                var translation = lang === keyLanguage ? key : '';
                                // @ts-expect-error -- TODO: TS2532: Object is possibly undefined
                                updatedKeyset[key][lang] = isKeyPlural_1
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
                    Object.keys(existingKeyset).forEach(function (key) {
                        if (!usedKeys.has(key)) {
                            delete updatedKeyset[key];
                        }
                    });
                    if (Object.keys(updatedKeyset).length === 0) {
                        removeKeyset(i18nFileName);
                    }
                    else {
                        saveKeyset({
                            fileName: i18nFileName,
                            keyset: updatedKeyset,
                            importT: importT,
                            exportT: exportT,
                        });
                        addI18nFileImportStatement(context.filename, getImportFromI18nFileT(path.basename(i18nFileName)));
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
    var _b = _a === void 0 ? {} : _a, _c = _b.keyLanguage, keyLanguage = _c === void 0 ? 'en' : _c, _d = _b.langs, langs = _d === void 0 ? ['en'] : _d, _e = _b.fileExt, fileExt = _e === void 0 ? 'js' : _e, _f = _b.importType, importType = _f === void 0 ? 'module' : _f;
    return ({
        // TODO: will it work instead of `ignores` in index.test.eslint.config.js?
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
                importType: importType,
            }),
        },
    });
};

/**
 * Updates content of local files.
 * @param files - Files and keysets.
 */
var sync = function (files) {
    files.forEach(function (_a) {
        var filePath = _a.filePath, keyset = _a.keyset;
        if (!fs.existsSync(filePath)) {
            console.log("File ".concat(filePath, " doesn't exist"));
            return;
        }
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                throw new Error("Error reading file ".concat(filePath, ": ").concat(err.message));
            }
            var newObjectString = JSON.stringify(keyset, null, 4).replace(/"(\w+)":/g, '$1:');
            var regex = /const keyset = {[\s\S]*?};/;
            var updatedCodeString = data.replace(regex, "const keyset = ".concat(newObjectString, ";"));
            fs.writeFileSync(filePath, updatedCodeString);
        });
    });
};
/**
 * Loads translations from localang.xyz and updates local files.
 * @param authToken - Authorization token with translations:get permission on localang.xyz.
 */
var pull = function (authToken) {
    var req = https.request({
        hostname: 'https://localang.xyz',
        port: 443,
        path: '/api/translations/getAll',
        method: 'GET',
        headers: {
            'Authorization': "Bearer ".concat(authToken),
            'Content-Type': 'application/json',
        },
    }, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            var result = JSON.parse(data);
            if ((result === null || result === void 0 ? void 0 : result.status) !== 'success') {
                throw new Error('Error getting keysets');
            }
            sync(result.files);
        });
    });
    req.on('error', function (e) {
        throw new Error("Error syncing keysets: ".concat(e.message));
    });
    req.end();
};

/**
 * Uploads local translations to localang.xyz.
 * @param authToken - Authorization token with translations:update permission on localang.xyz.
 * @param files - I18n files from which translations should be used.
 */
var push = function (authToken, files) {
    var requestData = {};
    files.forEach(function (file) {
        var filePath = path.resolve(process.cwd(), file);
        var baseFile = filePath.replace(/\.i18n\./, '.');
        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, 'utf8', function (err, data) {
                if (err) {
                    throw new Error("Error reading file ".concat(file, ": ").concat(err.message));
                }
                try {
                    var content = parseContent(data);
                    requestData[baseFile] = {
                        operation: 'update',
                        translations: content,
                    };
                }
                catch (parseError) {
                    throw new Error("Error parsing JSON in file ".concat(file, ": ").concat(typeof parseError === 'object' &&
                        parseError !== null &&
                        'message' in parseError
                        ? parseError.message
                        : ''));
                }
            });
        }
        else {
            requestData[baseFile] = {
                operation: 'delete',
            };
        }
    });
    var req = https.request({
        hostname: 'https://localang.xyz',
        port: 443,
        path: '/api/translations/update',
        method: 'POST',
        headers: {
            'Authorization': "Bearer ".concat(authToken),
            'Content-Type': 'application/json',
        },
    }, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            var result = JSON.parse(data);
            if ((result === null || result === void 0 ? void 0 : result.status) !== 'success') {
                throw new Error('Error syncing keysets');
            }
        });
    });
    req.write(requestData);
    req.on('error', function (e) {
        throw new Error("Error syncing keysets: ".concat(e.message));
    });
    req.end();
};

var _a;
var makeI18n = (_a = new Api(), _a.makeI18n), setSettings = _a.setSettings;

exports.createEslintPlugin = createEslintPlugin;
exports.makeI18n = makeI18n;
exports.pull = pull;
exports.push = push;
exports.setSettings = setSettings;
//# sourceMappingURL=index.cjs.map
