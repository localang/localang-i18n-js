export default function removeUnusedLanguages(options = {}) {
    const targetLanguage = options.lang || 'en'; // Default to 'en' if not provided

    return {
        name: 'remove-unused-languages',
        transform(code, id) {
            // Only process .i18n.js and .i18n.ts files
            if (!id.endsWith('.i18n.js') && !id.endsWith('.i18n.ts')) {
                return null;
            }

            // Find the keyset object using a more precise regex
            const keysetMatch = code.match(
                /const\s+keyset\s*=\s*({[\s\S]*?});/,
            );
            if (!keysetMatch) {
                return null;
            }

            const keysetStr = keysetMatch[1];

            const processTranslation = (objStr) => {
                // First, parse the object string into a proper object
                let obj;
                try {
                    // Replace single quotes with double quotes and wrap unquoted property names
                    const jsonStr = objStr
                        .replace(/'/g, '"') // Replace single quotes with double quotes
                        .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3') // Wrap unquoted property names
                        .replace(
                            /([{,]\s*)(['"])([^'"]+)(['"])(\s*:)/g,
                            '$1"$3"$5',
                        ) // Normalize quoted property names
                        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
                        .replace(/,(\s*,)/g, '$1'); // Remove multiple commas

                    obj = JSON.parse(jsonStr);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (_e) {
                    return objStr;
                }

                const processObject = (obj) => {
                    if (typeof obj !== 'object' || obj === null) {
                        return obj;
                    }

                    // If it's an object with language keys
                    const result = {};
                    for (const [key, value] of Object.entries(obj)) {
                        if (key === targetLanguage) {
                            result[key] = value;
                        } else if (
                            typeof value === 'object' &&
                            value !== null
                        ) {
                            // For nested objects that aren't language keys, process them
                            result[key] = processObject(value);

                            if (Object.keys(result[key]).length === 0) {
                                delete result[key];
                            }
                        }
                    }
                    return result;
                };

                const processedObj = processObject(obj);

                return JSON.stringify(processedObj, null, 4);
            };

            const processedKeyset = processTranslation(keysetStr);
            const newCode = code.replace(
                /const\s+keyset\s*=\s*({[\s\S]*?});/,
                `const keyset = ${processedKeyset};`,
            );

            return {
                code: newCode,
                map: null,
            };
        },
    };
}
