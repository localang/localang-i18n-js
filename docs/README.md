Localang

# Localang

## Table of contents

### Functions

- [createEslintPlugin](README.md#createeslintplugin)
- [makeI18n](README.md#makei18n)
- [pull](README.md#pull)
- [push](README.md#push)
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

[eslintPlugin/index.ts:32](https://github.com/localang/localang-i18n-js/blob/8f9ecd7/src/eslintPlugin/index.ts#L32)

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

[core/index.ts:37](https://github.com/localang/localang-i18n-js/blob/8f9ecd7/src/core/index.ts#L37)

___

### pull

▸ **pull**(`authToken`, `projectId`): `void`

Loads translations from localang.xyz and updates local files.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `authToken` | `string` | Authorization token with translations:read permission on localang.xyz. |
| `projectId` | `number` | ID of project on localang.xyz. |

#### Returns

`void`

#### Defined in

[synchronizer/pull.ts:43](https://github.com/localang/localang-i18n-js/blob/8f9ecd7/src/synchronizer/pull.ts#L43)

___

### push

▸ **push**(`authToken`, `projectId`, `files`): `void`

Uploads local translations to localang.xyz.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `authToken` | `string` | Authorization token with translations:update permission on localang.xyz. |
| `projectId` | `number` | ID of project on localang.xyz. |
| `files` | `string`[] | I18n files from which translations should be used. |

#### Returns

`void`

#### Defined in

[synchronizer/push.ts:13](https://github.com/localang/localang-i18n-js/blob/8f9ecd7/src/synchronizer/push.ts#L13)

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

[core/index.ts:30](https://github.com/localang/localang-i18n-js/blob/8f9ecd7/src/core/index.ts#L30)
