'use strict';

// TODO: make it work with dev version
const { createEslintPlugin } = require('../../dist/index');
const { langs } = require('./index.test');

/**
 * ESLint options.
 * @type {import('eslint').Linter.FlatConfig[]}
 */
const config = [
    {
        plugins: {
            localang: createEslintPlugin({
                langs,
            }),
        },
        rules: {
            'localang/generate-i18n-file': 'error',
        },
    },
];

module.exports = config;
