Localang

# Localang

## Table of contents

### Functions

- [createEslintPlugin](README.md#createeslintplugin)
- [makeI18n](README.md#makei18n)
- [setSettings](README.md#setsettings)

## Functions

### createEslintPlugin

▸ **createEslintPlugin**(`«destructured»?`): `Plugin`

Creates ESLint plugin to generate I18n files.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Config` |

#### Returns

`Plugin`

#### Defined in

[eslintPlugin/index.ts:32](https://github.com/localang/localang-i18n-js/blob/db15155/src/eslintPlugin/index.ts#L32)

___

### makeI18n

▸ **makeI18n**(`keyset`, `placeholders?`): `MakeI18nResponse`

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyset` | `Keyset` |
| `placeholders?` | `Record`<`string`, `string` \| `number`\> |

#### Returns

`MakeI18nResponse`

#### Defined in

[core/index.ts:34](https://github.com/localang/localang-i18n-js/blob/db15155/src/core/index.ts#L34)

___

### setSettings

▸ **setSettings**(`settings`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `settings` | `Partial`<`Settings`\> |

#### Returns

`void`

#### Defined in

[core/index.ts:27](https://github.com/localang/localang-i18n-js/blob/db15155/src/core/index.ts#L27)
