/**
 * Replaces placeholders in text with given values.
 * @param text          Text with placeholders
 * @param placeholders  Object with placeholders and values
 * @returns             Text with replaced placeholders
 */
export const replacePlaceholders = (
    text: string,
    placeholders: Record<string, string | number> = {},
): string => {
    return text.replace(/\{(\w+)}/g, (match, key) => {
        return key in placeholders ? String(placeholders[key]) : match;
    });
};
