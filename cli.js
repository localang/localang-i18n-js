#!/usr/bin/env node

const { pull, push } = require('./dist');

const parseArgs = () => {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Error: Requires at least 1 argument');
        process.exit();
    }

    const operation = args[0];

    if (!['push', 'pull'].includes(operation)) {
        console.log('Error: The first argument must be equal to "pull" or "push"');
        process.exit();
    }

    if (operation === 'push' && !args[1]) {
        console.log('Error: To push the changes, the i18n files should be listed comma separated as second argument: src/path/getName.i18n.ts,src/index.i18n.ts');
        process.exit();
    }

    return {
        operation: args[0],
        files: args[1]?.split(',').map(s => s.trim()) ?? [],
    };
};

const { operation, files } = parseArgs();

switch (operation) {
    case 'pull':
        pull();
        break;

    case 'push':
        push(files);
        break;
}
