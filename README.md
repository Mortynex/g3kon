# g3kon

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

g3kon is centralized content store built with Typescript. 
g3kon is inspired by [i18next](https://github.com/i18next/i18next), 
but rather than internationalization, g3kon focuses more on *centralization*

- [Install](#install)
- [Usage example](#usage-example)
- [API](#api)
- [Options](#options)

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install g3kon
```

## Usage example

```ts
import { G3kon } from 'g3ckon';

const g3kon = new G3kon({
	contents: {
		general: {
			hello_world: 'Hello World!',
		},
	},
});

console.log(g3kon.g('general.hello_world'));
// => "Hello World!"
```

You can also have dynamic content with functions!

```ts
import { G3kon } from 'g3ckon';

const g3kon = new G3kon({
	contents: {
		general: {
			welcome: (name: string) => `Welcome ${name}!`,
		},
	},
});

console.log(g3kon.g('general.welcome', ['Bob']));
// => "Welcome Bob!"
```

## API

### G3kon

Initialize a new `G3kon` with the given `options` data.

**Params**

- `options` **{Object}**: See all [available options](#options).

**Example**

```js
import { G3kon } from 'g3ckon';

new G3kon({
	contents: {},
});
```

### .g

Get `value` from `key`

**Params**

- `key` **{String}**
- `args` **{Array}**: Arguments for interpolation function, not required if key doesnt map to a non interpolation function

- `returns` **{String | Number}**: Value that key maps to.

**Example**

```js
const g3kon = new G3kon({
	contents: {
		general: {
			hello_world: 'Hello World!',
			welcome: (name: string) => `Welcome ${name}`,
		},
	},
});

g3kon.g('general.hello_world');
// => "Hello World!"

g3kon.g('general.welcome', ['Bob']);
// => "Welcome Bob!"
```

### .getFixedG

Get `value` from `key`

**Params**

- (Optional) `prefix` **{String}**: Prefix for the key

- `returns` **{Function}**: Get function similar to `.g`

**Example**

```js
const g3kon = new G3kon({
	contents: {
		general: {
			hello_world: 'Hello World!',
			welcome: (name: string) => `Welcome ${name}`,
		},
	},
});

// with prefix
const generalG = g3kon.getFixedG('general');

generalG('hello_world');
// => "Hello World!"

generalG('welcome', ['Bob']);
// => "Welcome Bob!"

// without prefix
const g = g3kon.getFixedG('general');

// same as g3kon.g
g('general.hello_world');
// => "Hello World!"

g('general.welcome', ['Bob']);
// => "Welcome Bob!"
```

## Options

| **Option** | **Type** | **Required** | **Description** |
| --- | --- | --- | --- |
| `contents` | `object` | `true` | Object from which are keys generated and values retrieved. |

## Example

```js
const g3kon = new G3kon({
	contents: {
		general: {
			hello_world: 'Hello World!',
			welcome: (name: string) => `Welcome ${name}`,
		},
	},
});
```

### License

Copyright © 2021, [Mortynex](https://github.com/Mortynex).
Released under the [MIT License](LICENSE).

[build-img]: https://github.com/Mortynex/g3kon/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/Mortynex/g3kon/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/g3kon
[downloads-url]: https://www.npmtrends.com/g3kon
[npm-img]: https://img.shields.io/npm/v/g3kon
[npm-url]: https://www.npmjs.com/package/g3kon
[issues-img]: https://img.shields.io/github/issues/Mortynex/g3kon
[issues-url]: https://github.com/Mortynex/g3kon/issues
[codecov-img]: https://codecov.io/gh/Mortynex/g3kon/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/Mortynex/g3kon
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
