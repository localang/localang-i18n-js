// eslint-disable-next-line
module.exports = function({ types: t }) {
    return {
        visitor: {
            VariableDeclarator(path, state) {
                const fileName = state.file.opts.filename;

                if (
                    !fileName.endsWith('.i18n.js') &&
                    !fileName.endsWith('.i18n.ts')
                ) {
                    return;
                }

                const targetLanguage = state.opts.lang || 'en'; // Default to 'en' if not provided
                const { id, init } = path.node;

                // Check if the object represents a keyset for i18n
                if (
                    t.isIdentifier(id, { name: 'keyset' }) &&
                    t.isObjectExpression(init)
                ) {
                    init.properties.forEach((prop) => {
                        if (t.isObjectProperty(prop)) {
                            const languages = prop.value.properties;

                            // Filter out all languages except the targetLanguage
                            prop.value.properties = languages.filter(
                                (lang) => lang.key.value === targetLanguage,
                            );
                        }
                    });
                }
            },
        },
    };
};
