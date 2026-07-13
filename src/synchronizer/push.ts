import path from 'path';
import fs from 'fs';
import https from 'https';
import { parseContent } from '../core';
import type { Keyset } from '../core/builder/types';

/**
 * Uploads local translations to the hosted Localang service.
 *
 * @deprecated The hosted Localang service has been discontinued, so this helper no
 * longer has a working backend to talk to. It is kept for reference only. The i18n
 * library and ESLint plugin remain fully usable without it.
 *
 * @param authToken - Authorization token with translations:update permission.
 * @param projectId - ID of the project in the (discontinued) service.
 * @param files - I18n files from which translations should be used.
 */
export const push = (authToken: string, projectId: number, files: string[]) => {
    const requestData: Record<
        string,
        {
            operation: 'update' | 'delete';
            translations?: Keyset;
        }
    > = {};

    files.forEach(async (file) => {
        const filePath = path.resolve(process.cwd(), file);
        const baseFile = file.replace(/\.i18n\./, '.');

        if (fs.existsSync(filePath)) {
            const baseContent = fs.readFileSync(filePath, 'utf8');
            const content = parseContent(baseContent);

            requestData[baseFile] = {
                operation: 'update',
                translations: content,
            };
        } else {
            requestData[baseFile] = {
                operation: 'delete',
            };
        }
    });

    const req = https.request(
        {
            hostname: 'localang.xyz',
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

    req.write(
        JSON.stringify({
            project_id: projectId,
            files: requestData,
        }),
    );

    req.on('error', function (e) {
        throw new Error(`Error syncing keysets: ${e.message}`);
    });

    req.end();
};
