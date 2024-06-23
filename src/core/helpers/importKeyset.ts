import type { Keyset } from '../builder/types';

/**
 * Imports keyset from i18n file.
 * @param filePath - Path to file.
 * @returns - Keyset.
 */
export const importKeyset = async (filePath: string): Promise<Keyset> => {
    let keyset = {};

    try {
        const module = await import(filePath);
        keyset = module.keyset ?? {};
    } catch (error) {
        console.log(`Reading error: ${error}`);
    }

    return keyset;
};
