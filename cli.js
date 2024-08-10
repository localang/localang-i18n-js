#!/usr/bin/env node

const { pull, push } = require('./dist');

const parseArgs = () => {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Error: Requires at least 1 argument');
        process.exit();
    }

    const operation = args[0];
    const authToken = args[1];
    const projectId = args[2];
    const files = args[3];

    if (!['push', 'pull'].includes(operation)) {
        console.log('Error: The first argument must be equal to "pull" or "push"');
        process.exit();
    }

    if (!authToken) {
        console.log('Error: The second argument is to pass an authorization token to Localang');
        process.exit();
    }

    if (!projectId) {
        console.log('Error: The third argument is to pass the project ID to Localang');
        process.exit();
    }

    if (operation === 'push' && !files) {
        console.log('Error: To push the changes, the i18n files should be listed comma separated as fourth argument: src/path/getName.i18n.ts,src/index.i18n.ts');
        process.exit();
    }

    return {
        operation,
        authToken,
        projectId,
        files: files?.split(',').map(s => s.trim()) ?? [],
    };
};

const { operation, authToken, projectId, files } = parseArgs();

switch (operation) {
    case 'pull':
        pull(authToken, projectId);
        break;

    case 'push':
        push(authToken, projectId, files);
        break;
}
