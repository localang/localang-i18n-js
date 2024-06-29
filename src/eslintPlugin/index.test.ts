import type { Lang } from '../core/builder/types';
import fs from 'fs';
import path from 'path';
import { ESLint } from 'eslint';
import { parseContent } from '../core';

const tempDir = path.join(__dirname, 'temp');
export const langs: Lang[] = ['en', 'es', 'fr'];

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

function cleanTempDir() {
    const files = fs.readdirSync(tempDir);
    for (const file of files) {
        fs.unlinkSync(path.join(tempDir, file));
    }
}

function removeTempDir() {
    fs.rmdirSync(tempDir);
}

function readKeyset(fileName: string) {
    const filePath = path.join(tempDir, fileName);

    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');

        return parseContent(content);
    }

    return null;
}

function readFileContent(filePath: string) {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

describe('eslintPlugin/index', () => {
    let eslint: ESLint;

    beforeAll(async () => {
        eslint = new ESLint({
            overrideConfigFile: path.resolve(
                __dirname,
                'index.test.eslint.config.js',
            ),
        });
    });

    beforeEach(async () => {
        cleanTempDir();
    });

    afterAll(() => {
        cleanTempDir();
        removeTempDir();
    });

    it('should generate .i18n.js file with multiple languages for i18n string', async () => {
        const code = `i18n("some string"); i18n('another string');`;
        const filePath = path.join(tempDir, 'test.js');
        await fs.promises.writeFile(filePath, code);

        await eslint.lintFiles(filePath);

        const keyset = readKeyset('test.i18n.js');
        const updatedContent = readFileContent(filePath);

        expect(keyset).toBeTruthy();
        expect(keyset['some string']).toEqual({
            en: 'some string',
            es: '',
            fr: '',
        });
        expect(keyset['another string']).toEqual({
            en: 'another string',
            es: '',
            fr: '',
        });

        expect(updatedContent).toContain(`import { i18n } from './test.i18n';`);
    });

    it('should delete .i18n.js file then there is no keys left', async () => {
        const initialCode = `i18n("some string");`;
        const updatedCode = '';
        const filePath = path.join(tempDir, 'delete-test.js');
        await fs.promises.writeFile(filePath, initialCode);

        await eslint.lintFiles(filePath);

        const keyset = readKeyset('delete-test.i18n.js');
        expect(keyset).toBeTruthy();
        expect(keyset['some string']).toEqual({
            en: 'some string',
            es: '',
            fr: '',
        });

        await fs.promises.writeFile(filePath, updatedCode);

        await eslint.lintFiles([filePath]);

        const updatedKeyset = readKeyset('delete-test.i18n.js');
        expect(updatedKeyset).toBeNull();
    });

    it('should delete key from .i18n.js file when i18n call is removed', async () => {
        const initialCode = `i18n('key to delete');`;
        const updatedCode = `i18n('other key');`;
        const filePath = path.join(tempDir, 'delete-test.js');
        await fs.promises.writeFile(filePath, initialCode);

        await eslint.lintFiles([filePath]);

        const keyset = readKeyset('delete-test.i18n.js');
        expect(keyset['key to delete']).toEqual({
            en: 'key to delete',
            es: '',
            fr: '',
        });

        await fs.promises.writeFile(filePath, updatedCode);

        await eslint.lintFiles([filePath]);

        const updatedKeyset = readKeyset('delete-test.i18n.js');
        expect(updatedKeyset['key to delete']).toBeUndefined();
    });

    it('should handle multiple usages of i18n in a file', async () => {
        const code = `i18n('first string'); i18n('second string'); i18n('third string');`;
        const filePath = path.join(tempDir, 'multi-test.js');
        await fs.promises.writeFile(filePath, code);

        await eslint.lintFiles([filePath]);

        const keyset = readKeyset('multi-test.i18n.js');
        expect(keyset).toBeTruthy();
        expect(keyset['first string']).toEqual({
            en: 'first string',
            es: '',
            fr: '',
        });
        expect(keyset['second string']).toEqual({
            en: 'second string',
            es: '',
            fr: '',
        });
        expect(keyset['third string']).toEqual({
            en: 'third string',
            es: '',
            fr: '',
        });
    });

    it('should create plural version', async () => {
        const code = `i18n('Items: {count}.'); i18n('second string');`;
        const filePath = path.join(tempDir, 'plural-test.js');
        await fs.promises.writeFile(filePath, code);

        await eslint.lintFiles([filePath]);

        const keyset = readKeyset('plural-test.i18n.js');
        expect(keyset).toBeTruthy();
        expect(keyset['Items: {count}.']).toEqual({
            en: {
                zero: 'Items: {count}.',
                one: 'Items: {count}.',
                two: 'Items: {count}.',
                few: 'Items: {count}.',
                many: 'Items: {count}.',
                other: 'Items: {count}.',
            },
            es: {
                zero: '',
                one: '',
                two: '',
                few: '',
                many: '',
                other: '',
            },
            fr: {
                zero: '',
                one: '',
                two: '',
                few: '',
                many: '',
                other: '',
            },
        });
        expect(keyset['second string']).toEqual({
            en: 'second string',
            es: '',
            fr: '',
        });
    });
});
