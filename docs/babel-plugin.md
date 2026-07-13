# Babel Plugin

If you use different bundles for different languages, you can remove unused locales with the babel plugin to reduce the size of your production bundle.

## Usage

In your .babelrc:

```
{
    "presets": ["@babel/preset-env"],
    "plugins": [
        [
            "localang-i18n-js/babel/remove-unused-languages.js",
            {
                "lang": "en" // Language to keep in i18n-files, e.g., "en" for English
            }
        ]
    ]
}
```
