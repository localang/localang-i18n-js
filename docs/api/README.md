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

[eslintPlugin/index.ts:38](https://github.com/pavelpilyak/localang-i18n-js/blob/d597306/src/eslintPlugin/index.ts#L38)

___

### makeI18n

▸ **makeI18n**(`keyset`): `MakeI18nResponse`

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyset` | `Keyset` |

#### Returns

`MakeI18nResponse`

#### Defined in

[core/index.ts:37](https://github.com/pavelpilyak/localang-i18n-js/blob/d597306/src/core/index.ts#L37)

___

### pull

▸ **pull**(`authToken`, `projectId`): `void`

Loads translations from the hosted Localang service and updates local files.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `authToken` | `string` | Authorization token with translations:read permission. |
| `projectId` | `number` | ID of the project in the (discontinued) service. |

#### Returns

`void`

**`Deprecated`**

The hosted Localang service has been discontinued, so this helper no
longer has a working backend to talk to. It is kept for reference only. The i18n
library and ESLint plugin remain fully usable without it.

#### Defined in

[synchronizer/pull.ts:51](https://github.com/pavelpilyak/localang-i18n-js/blob/d597306/src/synchronizer/pull.ts#L51)

___

### push

▸ **push**(`authToken`, `projectId`, `files`): `void`

Uploads local translations to the hosted Localang service.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `authToken` | `string` | Authorization token with translations:update permission. |
| `projectId` | `number` | ID of the project in the (discontinued) service. |
| `files` | `string`[] | I18n files from which translations should be used. |

#### Returns

`void`

**`Deprecated`**

The hosted Localang service has been discontinued, so this helper no
longer has a working backend to talk to. It is kept for reference only. The i18n
library and ESLint plugin remain fully usable without it.

#### Defined in

[synchronizer/push.ts:18](https://github.com/pavelpilyak/localang-i18n-js/blob/d597306/src/synchronizer/push.ts#L18)

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

[core/index.ts:30](https://github.com/pavelpilyak/localang-i18n-js/blob/d597306/src/core/index.ts#L30)
