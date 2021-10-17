import {
	G3konConstructorOptions,
	ValidValues,
	Contents,
	InterpolationKeys,
	NonInterpolationKeys,
	ReturnType,
	ReturnableValues,
	InterpolationArguments,
	RemovePrefix,
	AddPrefix,
	Prefixes,
	GetFunction,
	PrefixedGetFunction,
} from './typings';

export class G3kon<T extends Contents> {
	private _store: Record<string, ValidValues>;
	constructor({ contents }: G3konConstructorOptions<T>) {
		const recursiveTransformKeys = (contents: Contents, prefix = '') => {
			let keys = {};

			for (const [name, value] of Object.entries(contents)) {
				const keyValue = `${prefix}${prefix.length !== 0 ? '.' : ''}${name}`;

				if (typeof value === 'object') {
					const recursiveKeys = recursiveTransformKeys(value, keyValue);
					keys = {
						...keys,
						...(typeof recursiveKeys === 'object' ? recursiveKeys : {}),
					};
				} else {
					keys = {
						...keys,
						[keyValue]: value,
					};
				}
			}

			return keys;
		};

		this._store = recursiveTransformKeys(contents);
	}

	g<Key extends InterpolationKeys<T>>(
		key: Key,
		args: InterpolationArguments<T, Key>
	): ReturnType<T, Key>;
	g<Key extends NonInterpolationKeys<T>>(key: Key): ReturnType<T, Key>;
	g(key: any, args?: any): ReturnableValues {
		if (typeof key !== 'string') {
			return 'INVALID KEY';
		}

		return this._getValue(key, args);
	}

	getFixedG(): GetFunction<T>;
	getFixedG<KeyPrefix extends Prefixes<T>>(
		prefix?: KeyPrefix
	): PrefixedGetFunction<T, AddPrefix<'.', KeyPrefix>>;
	getFixedG<KeyPrefix extends Prefixes<T>>(prefix?: KeyPrefix) {
		if (prefix === undefined || prefix === '') {
			return this.g.bind(this);
		}
		type Prefix = AddPrefix<'.', KeyPrefix>;

		const getFunction = this._getValue.bind(this);

		function get<Key extends RemovePrefix<InterpolationKeys<T>, Prefix>>(
			key: Key,
			args: InterpolationArguments<T, AddPrefix<Key, Prefix>>
		): ReturnType<T, AddPrefix<Key, Prefix>>;
		function get<Key extends RemovePrefix<NonInterpolationKeys<T>, Prefix>>(
			key: Key
		): ReturnType<T, AddPrefix<Key, Prefix>>;
		function get(key: any, args?: any): ReturnableValues {
			if (typeof key !== 'string' || typeof prefix !== 'string') {
				return 'INVALID KEY';
			}

			return getFunction(`${String(prefix)}.${String(key)}`, args);
		}

		return get;
	}

	private _getValue(key: string, args?: any[]): ReturnableValues {
		let value = this._store[key];

		if (typeof value === 'function') {
			if (!args || !Array.isArray(args)) {
				throw new Error('INVALID INTERPOLATION FUNCTION ARGUMENTS');
			}

			value = value(...args);
		}

		if (typeof value === 'object' || value === undefined) {
			throw new Error('INVALID KEY');
		}

		return value;
	}
}
