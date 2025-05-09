import { defineConfig } from 'vite';
import removeUnusedLanguages from '../remove-unused-languages';

export default defineConfig({
    plugins: [
        removeUnusedLanguages({
            lang: 'en',
        }),
    ],
    build: {
        outDir: 'dist',
    },
});
