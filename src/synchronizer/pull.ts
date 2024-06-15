import fs from 'fs';
import https from 'https';
import type { Keyset } from '../core/builder/types';

/**
 * Updates content of local files.
 * @param files - Files and keysets.
 */
const sync = (files: Array<{ filePath: string; keyset: Keyset }>) => {
    files.forEach(({ filePath, keyset }) => {
        if (!fs.existsSync(filePath)) {
            console.log(`File ${filePath} doesn't exist`);
            return;
        }

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                throw new Error(
                    `Error reading file ${filePath}: ${err.message}`,
                );
            }

            const newObjectString = JSON.stringify(keyset, null, 4).replace(
                /"(\w+)":/g,
                '$1:',
            );
            const regex = /const keyset = {[\s\S]*?};/;
            const updatedCodeString = data.replace(
                regex,
                `const keyset = ${newObjectString};`,
            );

            fs.writeFileSync(filePath, updatedCodeString);
        });
    });
};

/**
 * Loads translations from localang.xyz and updates local files.
 * @param authToken - Authorization token with translations:read permission on localang.xyz.
 * @param projectId - ID of project on localang.xyz.
 */
export const pull = (authToken: string, projectId: number) => {
    const req = https.request(
        {
            hostname: 'https://localang.xyz',
            port: 443,
            path: `/api/translations/getAll?project_id=${projectId}`,
            method: 'GET',
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
                    throw new Error('Error getting keysets');
                }

                sync(result.files);
            });
        },
    );

    req.on('error', function (e) {
        throw new Error(`Error syncing keysets: ${e.message}`);
    });

    req.end();
};
