import { replacePlaceholders } from './replacePlaceholders';

describe('helpers/string/replacePlaceholders', () => {
    it('should replace single placeholder', () => {
        const text = 'Hello, {name}!';
        const placeholders = { name: 'Alice' };
        expect(replacePlaceholders(text, placeholders)).toBe('Hello, Alice!');
    });

    it('should replace multiple placeholders', () => {
        const text = 'Hello, {name}! You have {count} new messages.';
        const placeholders = { name: 'Alice', count: 5 };
        expect(replacePlaceholders(text, placeholders)).toBe(
            'Hello, Alice! You have 5 new messages.',
        );
    });

    it('should leave placeholders that are not in the object unchanged', () => {
        const text = 'Hello, {name}! You have {count} new messages.';
        const placeholders = { name: 'Alice' };
        expect(replacePlaceholders(text, placeholders)).toBe(
            'Hello, Alice! You have {count} new messages.',
        );
    });

    it('should replace placeholder with number', () => {
        const text = 'You have {count} new messages.';
        const placeholders = { count: 5 };
        expect(replacePlaceholders(text, placeholders)).toBe(
            'You have 5 new messages.',
        );
    });

    it('should handle empty placeholders object', () => {
        const text = 'Hello, {name}!';
        const placeholders = {};
        expect(replacePlaceholders(text, placeholders)).toBe('Hello, {name}!');
    });

    it('should handle text without placeholders', () => {
        const text = 'Hello, world!';
        const placeholders = { name: 'Alice' };
        expect(replacePlaceholders(text, placeholders)).toBe('Hello, world!');
        expect(replacePlaceholders(text)).toBe('Hello, world!');
    });
});
