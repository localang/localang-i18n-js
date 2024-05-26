/**
 * Checks if the given text contains a plural placeholder.
 * A plural placeholder is defined as a string that starts with 'count' followed by an optional number.
 * @param text  The text to check for plural placeholders.
 * @returns     true if the text contains a plural placeholder, false otherwise.
 */
export const isPlural = (text: string): boolean => {
    return /\bcount\d*\b/.test(text);
};
