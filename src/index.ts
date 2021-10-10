import {
	getInterpolationFunctionKeys,
	getAllTranslationKeys,
	t18ClientOptions,
	Translations,
	UnionOmit,
	ValidValues,
	TranslationResource,
	getFunctionArguments,
	t18TranslateOptions,
	getAllKeys,
	RemoveKeyPrefix,
	getInterpolationFunctionKeysWithoutPrefix,
	getNonInterpolationFunctionKeysWithoutPrefix,
	getFunctionArgumentsWithPrefix,
} from './typings';

export class t18Client<T extends Translations, L extends string> {
	private _resources: TranslationResource<T, L>[];
	private _currentLanguage: L;
	constructor({ resources }: t18ClientOptions<T, L>) {
		resources = Array.isArray(resources) ? resources : [resources];

		if (resources.length === 0) {
			throw new Error('Invalid translation length');
		}

		this._resources = resources;

		const defaultLanguage =
			resources.length > 1
				? resources.find(res => res.default === true)?.language
				: resources[0].language;

		if (!defaultLanguage) {
			throw new Error('Default translation file was not set');
		}

		this._currentLanguage = defaultLanguage;
	}

	changeLanguage(lng: L) {
		this._currentLanguage = lng;
	}

	private _getTranslations(lng?: L) {
		const translations = this._resources.find(
			file => file.language === (lng ?? this._currentLanguage)
		)?.translations;

		if (translations === undefined) {
			throw new Error('Invalid language');
		}

		return translations;
	}

	t<Key extends getInterpolationFunctionKeys<T>>(
		key: Key,
		args: getFunctionArguments<T, Key>
	): string;
	t(
		key: UnionOmit<getAllTranslationKeys<T>, getInterpolationFunctionKeys<T>>
	): string;
	t(key: any, args?: any): string {
		if (typeof key !== 'string') {
			return 'INVALID KEY';
		}

		return this._translate({
			key,
			args,
			lng: this._currentLanguage,
		});
	}

	private _translate({ key, args, lng }: t18TranslateOptions) {
		const objects = key.split('.');

		let currentValue: ValidValues | Translations = this._getTranslations(lng);
		for (const object of objects) {
			if (typeof currentValue !== 'object') {
				return 'INVALID PATH';
			}

			currentValue = currentValue[object];
		}

		const translation = currentValue;

		if (typeof translation === 'function') {
			if (!args || !Array.isArray(args)) {
				return 'INVALID INTERPOLATION FUNCTION ARGUMENTS';
			}

			const interpolatedString = translation(...args);
			if (typeof interpolatedString !== 'string') {
				return 'INVALID VALUE';
			}

			return interpolatedString;
		}

		if (typeof translation === 'object') {
			return 'INVALID PATH';
		}

		return translation;
	}

	getFixedT(lng?: L, keyPrefix?: getAllKeys<T>) {
		type addToString<A extends string, B extends string> = `${A}${B}`;
		type KeyPrefix = typeof keyPrefix;
		type prefixed<kp> = kp extends string ? addToString<kp, '.'> : '';
		type prefix = prefixed<KeyPrefix>;

		const translateFunction = this._translate.bind(this);
		const language = lng ?? this._currentLanguage;

		function t<
			Key extends getInterpolationFunctionKeysWithoutPrefix<T, prefix>
		>(key: Key, args: any[]): string;
		function t(
			key: getNonInterpolationFunctionKeysWithoutPrefix<T, prefix>
		): string;
		function t(key: any, args?: any): string {
			if (typeof key !== 'string') {
				return 'INVALID KEY';
			}

			return translateFunction({
				key,
				args,
				lng: language,
			});
		}

		return t;
	}
}
