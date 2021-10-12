import {
	t18ClientOptions,
	ValidValues,
	getKeyTypesObject,
	Contents,
	DeepContents,
	InterpolationFunction,
	getReturnType,
	KeysExtractTypes,
	ReturnableValues,
	getTypeParameters,
} from './typings';

export class t18Client<T extends Contents> {
	private _store: Record<string, ValidValues>;
	constructor({ content }: t18ClientOptions<T>) {
		function recursiveGetKeys<ContentType extends Contents | DeepContents>(
			content: ContentType,
			prefix = ''
		): Record<string, ContentType> {
			let keys = {};

			for (const [name, value] of Object.entries(content)) {
				const keyValue = `${prefix}${prefix.length !== 0 ? '.' : ''}${name}`;

				if (typeof value === 'object') {
					const recursiveKeys = recursiveGetKeys(value, keyValue);
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
		}

		this._store = recursiveGetKeys(content) as unknown as Record<
			string,
			ValidValues
		>; // ugly
	}

	get<Key extends KeysExtractTypes<T, InterpolationFunction>>(
		key: Key,
		args: getTypeParameters<T, Key>
	): getReturnType<getKeyTypesObject<T>, Key>;
	get<Key extends KeysExtractTypes<T, ReturnableValues>>(
		key: Key
	): getReturnType<getKeyTypesObject<T>, Key>;
	get(key: any, args?: any): ReturnableValues {
		if (typeof key !== 'string') {
			return 'INVALID KEY';
		}

		let value = this._store[key];

		if (typeof value === 'function') {
			if (!args || !Array.isArray(args)) {
				return 'INVALID INTERPOLATION FUNCTION ARGUMENTS';
			}

			value = value(...args);
		}

		if (typeof value === 'object') {
			return 'INVALID PATH';
		}

		return value;
	}
}
