'use strict';

const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({ recommendedConfig: js.configs.recommended });

/**
 * ESLint options.
 * @type {import('eslint').Linter.FlatConfig[]}
 */
const config = [
    ...compat.config({
        root: true,
        parser: '@typescript-eslint/parser',
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
            ecmaVersion: 2021,
        },
        plugins: ['@typescript-eslint'],
        extends: [
            'eslint:recommended',
            'plugin:prettier/recommended',
            'plugin:@typescript-eslint/eslint-recommended',
            'plugin:@typescript-eslint/recommended',
        ],
    }),
    {
        ignores: [
            'docs',
            'dist',
            'types',
            '**/index.test.eslint.config.js',
        ],
    },
];

module.exports = config;
