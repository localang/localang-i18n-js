/*!
 * localang-i18n-js v0.1.0
 * (c) Localang
 * Released under the MIT License.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

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
 * @returns - Function to work with translations.
 */
var makeI18n$1 = function (lang, keyset) {
    return function (key, placeholders) {
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
 * @param baseContent - Base string content.
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
    catch (error) {
        console.log("JSON parse error: ".concat(error));
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
    Api.prototype.makeI18n = function (keyset) {
        return makeI18n$1(this.settings.lang, keyset);
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
 * @param baseFile - File which imports i18n
 * @param baseI18nFileNameWithoutExt - Name of i18n file without extension
 * @param importT - Import string
 */
function addI18nFileImportStatement(baseFile, baseI18nFileNameWithoutExt, importT) {
    var content = fs.readFileSync(baseFile, 'utf8');
    if (!content.includes(baseI18nFileNameWithoutExt)) {
        fs.writeFileSync(baseFile, importT + content);
    }
}
/**
 * Builds rule which generates i18n files.
 * @param keyLanguage - Language which uses key
 * @param langs - Available languages
 * @param fileExt - I18n file extension
 * @param importType - Type of import and exports
 */
var createGenerateI18nFileRule = function (_a) {
    var keyLanguage = _a.keyLanguage, langs = _a.langs, fileExt = _a.fileExt, importType = _a.importType, addI18nImportToBaseFile = _a.addI18nImportToBaseFile;
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
                    var baseName = path.basename(context.filename);
                    var baseFileName = baseName.substring(0, baseName.lastIndexOf('.'));
                    var baseI18nFileNameWithoutExt = "".concat(baseFileName, ".i18n");
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
                        if (addI18nImportToBaseFile) {
                            addI18nFileImportStatement(context.filename, baseI18nFileNameWithoutExt, getImportFromI18nFileT(baseI18nFileNameWithoutExt));
                        }
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
    var _b = _a === void 0 ? {} : _a, _c = _b.keyLanguage, keyLanguage = _c === void 0 ? 'en' : _c, _d = _b.langs, langs = _d === void 0 ? ['en'] : _d, _e = _b.fileExt, fileExt = _e === void 0 ? 'js' : _e, _f = _b.importType, importType = _f === void 0 ? 'module' : _f, _g = _b.addI18nImportToBaseFile, addI18nImportToBaseFile = _g === void 0 ? false : _g;
    return ({
        rules: {
            'generate-i18n-file': createGenerateI18nFileRule({
                keyLanguage: keyLanguage,
                langs: langs,
                fileExt: fileExt,
                importType: importType,
                addI18nImportToBaseFile: addI18nImportToBaseFile,
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
        var filePathSplit = filePath.split('.');
        filePathSplit[filePathSplit.length - 1] = "i18n.".concat(filePathSplit.at(-1));
        var i18nFilePath = filePathSplit.join('.');
        if (!fs.existsSync(i18nFilePath)) {
            console.log("File ".concat(i18nFilePath, " doesn't exist"));
            return;
        }
        fs.readFile(i18nFilePath, 'utf8', function (err, data) {
            if (err) {
                throw new Error("Error reading file ".concat(i18nFilePath, ": ").concat(err.message));
            }
            var newObjectString = JSON.stringify(keyset, null, 4);
            var regex = /const keyset = {[\s\S]*?};/;
            var updatedCodeString = data.replace(regex, "const keyset = ".concat(newObjectString, ";"));
            fs.writeFileSync(i18nFilePath, updatedCodeString);
        });
    });
};
/**
 * Loads translations from localang.xyz and updates local files.
 * @param authToken - Authorization token with translations:read permission on localang.xyz.
 * @param projectId - ID of project on localang.xyz.
 */
var pull = function (authToken, projectId) {
    var req = https.request({
        hostname: 'localang.xyz',
        port: 443,
        path: "/api/translations/getAll?project_id=".concat(projectId),
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
 * @param projectId - ID of project on localang.xyz.
 * @param files - I18n files from which translations should be used.
 */
var push = function (authToken, projectId, files) {
    var requestData = {};
    files.forEach(function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var filePath, baseFile, baseContent, content;
        return __generator(this, function (_a) {
            filePath = path.resolve(process.cwd(), file);
            baseFile = file.replace(/\.i18n\./, '.');
            if (fs.existsSync(filePath)) {
                baseContent = fs.readFileSync(filePath, 'utf8');
                content = parseContent(baseContent);
                requestData[baseFile] = {
                    operation: 'update',
                    translations: content,
                };
            }
            else {
                requestData[baseFile] = {
                    operation: 'delete',
                };
            }
            return [2 /*return*/];
        });
    }); });
    var req = https.request({
        hostname: 'localang.xyz',
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
    req.write(JSON.stringify({
        project_id: projectId,
        files: requestData,
    }));
    req.on('error', function (e) {
        throw new Error("Error syncing keysets: ".concat(e.message));
    });
    req.end();
};

var _a;
var makeI18n = (_a = new Api(), _a.makeI18n), setSettings = _a.setSettings;

export { createEslintPlugin, makeI18n, pull, push, setSettings };
//# sourceMappingURL=index.esm.js.map
