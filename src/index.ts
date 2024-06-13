import { Api as I18nApi } from './core';

export const { makeI18n, setSettings } = new I18nApi();

export { createEslintPlugin } from './eslintPlugin';

export { pull, push } from './synchronizer';
