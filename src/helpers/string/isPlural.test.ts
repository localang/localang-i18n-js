import { isPlural } from './isPlural';

describe('helpers/string/isPlural', () => {
    it('should return true for "count"', () => {
        expect(isPlural('You have count new messages.')).toBe(true);
    });

    it('should return true for "count2"', () => {
        expect(isPlural('You have count2 new messages.')).toBe(true);
    });

    it('should return true for "count" followed by a number', () => {
        expect(isPlural('You have count123 new messages.')).toBe(true);
    });

    it('should return false for text without "count" placeholder', () => {
        expect(isPlural('You have new messages.')).toBe(false);
    });

    it('should return false for text with similar but not matching placeholders', () => {
        expect(isPlural('You have counter new messages.')).toBe(false);
        expect(isPlural('You have recount new messages.')).toBe(false);
    });

    it('should return true for multiple plural placeholders in the text', () => {
        expect(isPlural('You have count and count2 new messages.')).toBe(true);
    });
});
