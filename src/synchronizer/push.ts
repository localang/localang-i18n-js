import path from 'path';
import fs from 'fs';
import https from 'https';
import { parseContent } from '../core';
import type { Keyset } from '../core/builder/types';

/**
 * Uploads local translations to localang.xyz.
 * @param authToken - Authorization token with translations:update permission on localang.xyz.
 * @param files - I18n files from which translations should be used.
 */
export const push = (authToken: string, files: string[]) => {
    const requestData: Record<
        string,
        {
            operation: 'update' | 'delete';
            translations?: Keyset;
        }
    > = {};

    files.forEach((file) => {
        const filePath = path.resolve(process.cwd(), file);
        const baseFile = filePath.replace(/\.i18n\./, '.');

        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    throw new Error(
                        `Error reading file ${file}: ${err.message}`,
                    );
                }

                try {
                    const content = parseContent(data);

                    requestData[baseFile] = {
                        operation: 'update',
                        translations: content,
                    };
                } catch (parseError: unknown) {
                    throw new Error(
                        `Error parsing JSON in file ${file}: ${
                            typeof parseError === 'object' &&
                            parseError !== null &&
                            'message' in parseError
                                ? parseError.message
                                : ''
                        }`,
                    );
                }
            });
        } else {
            requestData[baseFile] = {
                operation: 'delete',
            };
        }
    });

    const req = https.request(
        {
            hostname: 'https://localang.xyz',
            port: 443,
            path: '/api/translations/update',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        },
        (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const result = JSON.parse(data);

                if (result?.status !== 'success') {
                    throw new Error('Error syncing keysets');
                }
            });
        },
    );

    req.write(requestData);

    req.on('error', function (e) {
        throw new Error(`Error syncing keysets: ${e.message}`);
    });

    req.end();
};
