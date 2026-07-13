# Getting Started

## Installation

This library is published in the NPM registry and can be installed using any compatible package manager.

```sh
npm install localang-i18n-js --save

# For Yarn, use the command below.
yarn add localang-i18n-js
```

## Usage

### Language setting

Somewhere in your entrypoint you need to call `setSettings`:

```javascript
import { setSettings } from 'localang-i18n-js';

// By default, lang is 'en'
setSettings({ lang: 'en' });
```

### Translation file

**To create translation files automatically, without thinking about manual creation, you can use [the eslint plugin](./i18n-file-generator.md)**.

The file with translations is best placed next to the file in which the translations will be used. For example, if the file is named **index.js**, the file with translations will be named **index.i18n.js**.

The translation file should look like the following:
```javascript
import { makeI18n } from 'localang-i18n-js';
// or const { makeI18n } = require('localang-i18n-js');

const keyset = {
    'What is love?': {
        en: 'What is love?',
        ar: 'ما هو الحب؟',
    },
    '{count} left': {
        en: {
            zero: 'Nothing left',
            one: 'One left',
            two: 'Two left',
            few: 'A few left',
            many: 'Many left',
            other: '{count} left',
        },
        ar: {
            zero: 'ليس لديك شيء',
            one: '',
            two: '',
            few: '',
            many: '',
            other: ''
        },
    },
};

export const i18n = makeI18n(keyset);
// or module.exports = makeI18n(keyset);
```

Next you can use translations:

```javascript
import { i18n } from './index.i18n';
// or const i18n = require('./index.i18n');

console.log(i18n('What is love?')) // What is love?
console.log(i18n('{count} left', { count: 1 })) // One left
```

### Placeholders

The second argument in the i18n function is a dictionary with placeholder values.
Any word wrapped in curly braces is a placeholder.

For example:

```javascript
i18n('Your name is {name}. You are {age} years old', {
    name: 'Brad',
    age: 20,
}) // Your name is Brad. You are 20 years old
```

### Numerical placeholders

If the text has a placeholder `{count}`, then the translation is considered numeral.

The translation will be selected depending on the number sent to the placeholder:

```javascript
const keyset = {
    '{count} left': {
        en: {
            zero: 'Nothing left',
            one: 'Just {count} left',
            two: 'Two left',
            few: 'A few left',
            many: '{count} left',
            other: '{count} left',
        },
    },
};

...

i18n('{count} left', { count: 1 }) // Just 1 left
i18n('{count} left', { count: 0 }) // Nothing left
```
