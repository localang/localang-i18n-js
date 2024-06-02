// import { ESLint } from 'eslint';
// import fs from 'fs';
// import path from 'path';
// import {eslintPlugin} from "../index";
//
// // Function to create temporary directory for test files
// const tempDir = path.join(__dirname, 'temp');
// if (!fs.existsSync(tempDir)) {
//     fs.mkdirSync(tempDir);
// }
//
// // Function to clean up temporary directory
// function cleanTempDir() {
//     // const files = fs.readdirSync(tempDir);
//     // for (const file of files) {
//     //     fs.unlinkSync(path.join(tempDir, file));
//     // }
//     // fs.rmdirSync(tempDir);
// }
//
// describe('generate-i18n ESLint rule', () => {
//     let eslint;
//
//     beforeAll(async () => {
//         eslint = new ESLint({
//             fix: true,
//             plugins: {
//                 eslintPlugin
//             },
//         });
//     });
//
//     beforeEach(() => {
//         cleanTempDir();
//     });
//
//     afterAll(() => {
//         cleanTempDir();
//     });
//
//     it('should generate .i18n.js file for i18n string', async () => {
//         const code = `import { i18n } from './test.i18n';i18n('some string');`;
//         const filePath = path.join(tempDir, 'test.js');
//
//         await fs.promises.writeFile(filePath, code);
//
//         const results = await eslint.lintFiles([filePath]);
//         const formatter = await eslint.loadFormatter();
//         const resultText = formatter.format(results);
//
//         expect(resultText).toContain('some string');
//         expect(fs.existsSync(path.join(tempDir, 'test.i18n.js'))).toBe(true);
//     });
//
//     // Add more test cases as needed
// });
