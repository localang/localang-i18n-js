import type { Keyset } from '../builder/types';

/**
 * Parses content from i18n file.
 * @param baseContent - Base string content.
 * @returns - Keyset.
 */
export const parseContent = (baseContent: string): Keyset => {
    // remove keyset initialization
    let content = baseContent.replace(/const keyset = |;/g, '');

    // remove import
    content = content.substring(content.indexOf('\n') + 1);

    // remove export
    content = content.substring(0, content.lastIndexOf('\n'));
    content = content.substring(0, content.lastIndexOf('\n'));
    content = content.substring(0, content.lastIndexOf('\n'));

    let parsed = {};

    try {
        parsed = JSON.parse(content);
    } catch (error) {
        console.log(`JSON parse error: ${error}`);
    }

    return parsed;
};
