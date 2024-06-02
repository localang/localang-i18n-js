import type { Lang } from '../core/builder/types';
import fs from 'fs';
import path from 'path';
import { ESLint } from 'eslint';

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
        return JSON.parse(
            fs
                .readFileSync(filePath, 'utf8')
                .replace(/export const keyset = |;/g, ''),
        );
    }

    return null;
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

        console.log(await eslint.lintFiles(filePath));

        const keyset = readKeyset('test.i18n.js');
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
    });

    it('should delete key from .i18n.js file when i18n call is removed', async () => {
        const initialCode = `i18n('key to delete');`;
        const updatedCode = ``;
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
});
